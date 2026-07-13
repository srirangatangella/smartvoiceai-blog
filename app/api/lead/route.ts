import { NextResponse } from "next/server";
import { saveLead, createExperience } from "@/lib/db";
import { sendLeadNotification, sendLeadWelcomeWithLink } from "@/lib/email";
import { triggerOutboundCall } from "@/lib/vapi";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** US/Canada number → a phone callback is fine. Other countries (e.g. India +91)
 *  get the browser voice link only, since a US caller-ID reads as spam abroad. */
function isUSPhone(mobile: string): boolean {
  const raw = mobile.trim();
  const digits = raw.replace(/\D/g, "");
  if (raw.startsWith("+1")) return true;
  if (digits.length === 11 && digits.startsWith("1")) return true;
  return false;
}

export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const mobile = (body.mobile || "").trim();

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid business email." }, { status: 400 });
  }
  if (!mobile) {
    return NextResponse.json({ error: "Please enter a phone number." }, { status: 400 });
  }

  const lead = {
    name,
    email,
    mobile,
    company: (body.company || "").trim(),
    website: (body.website || "").trim(),
    industry: (body.industry || "").trim(),
    message: (body.message || "").trim(),
    source: (body.source || "Website").trim(),
    userAgent: request.headers.get("user-agent") || undefined,
  };

  // If they gave a website, mint a one-time personalized sample-assistant link.
  let experienceUrl: string | undefined;
  if (lead.website) {
    try {
      const token = await createExperience({
        businessName: lead.company || lead.name,
        industry: lead.industry,
        website: lead.website,
      });
      if (token) experienceUrl = `${siteConfig.url}/experience/${token}`;
    } catch (e) {
      console.error("createExperience failed:", e);
    }
  }

  // Capture channels decide the response. The welcome email (two links) and the
  // US-only phone callback are best-effort and never block lead capture.
  const usPhone = isUSPhone(lead.mobile);
  const [capture, call, welcome] = await Promise.all([
    Promise.allSettled([
      saveLead(lead),
      sendLeadNotification(lead as unknown as Record<string, string>),
      forwardToWebhook(lead),
    ]),
    usPhone
      ? triggerOutboundCall(lead).catch((e) => {
          console.error("VAPI speed-to-lead call errored:", e);
          return false;
        })
      : Promise.resolve(false),
    sendLeadWelcomeWithLink(lead, experienceUrl).catch((e) => {
      console.error("Welcome email failed:", e);
      return false;
    }),
  ]);

  if (call === true) console.log(`Speed-to-lead: US phone call queued for ${lead.name} (${lead.mobile}).`);
  if (welcome === true) console.log(`Welcome email with talk link sent to ${lead.email}.`);

  const delivered = capture.some((r) => r.status === "fulfilled" && r.value === true);
  const failed = capture.some((r) => r.status === "rejected");

  capture.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`Lead delivery channel ${i} failed:`, r.reason);
    }
  });

  if (delivered) {
    return NextResponse.json({ success: true, message: "Lead received." });
  }

  if (failed) {
    // A channel was configured but errored — surface a retry message so the lead isn't lost silently.
    console.error("LEAD DELIVERY FAILED (configured channel errored):", JSON.stringify(lead));
    return NextResponse.json(
      { error: "We couldn't submit right now. Please WhatsApp or email us directly." },
      { status: 500 }
    );
  }

  // No delivery channel configured yet (fresh deploy). Don't show visitors an error —
  // accept the lead and log it so it can be recovered until env vars are set.
  console.warn("LEAD RECEIVED but no delivery channel configured. Set RESEND_API_KEY / DATABASE_URL / LEAD_WEBHOOK_URL. Lead:", JSON.stringify(lead));
  return NextResponse.json({ success: true, message: "Lead received." });
}

/** Optional: forward to an n8n / Zapier / Make webhook if LEAD_WEBHOOK_URL is set. */
async function forwardToWebhook(lead: Record<string, unknown>): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lead, receivedAt: new Date().toISOString() }),
  });
  return res.ok;
}
