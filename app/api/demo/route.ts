import { NextResponse } from "next/server";
import { saveLead, createExperience } from "@/lib/db";
import { getBusinessProfile, exaConfigured } from "@/lib/exa";
import { sendLeadNotification } from "@/lib/email";

export const runtime = "nodejs";

/**
 * Powers the on-site Live Demo. Takes the prospect's business details, captures
 * them as a lead, builds a personalised profile (from their website via Exa, or
 * from their free-text description), creates a one-time experience token, and
 * returns the URL of the generated website (/preview) or voice demo (/experience).
 */
export async function POST(req: Request) {
  let b: Record<string, string>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const kind = (b.kind === "voice" ? "voice" : "website") as "website" | "voice";
  const name = (b.name || "").trim();
  const businessName = (b.businessName || "").trim();
  const businessType = (b.businessType || "").trim();
  const email = (b.email || "").trim();
  const phone = (b.phone || "").trim();
  const website = (b.website || "").trim();
  const googleLink = (b.googleLink || "").trim();
  const description = (b.description || "").trim();
  const city = (b.city || "").trim();

  if (!name || !businessName || !businessType || !email) {
    return NextResponse.json({ error: "Please fill in your name, business name, type and email." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // Build a business profile for personalisation: prefer the real website (Exa),
  // else fall back to the free-text description the prospect typed.
  let profile = description || "";
  const normalizedWebsite = website && !/^https?:\/\//i.test(website) ? `https://${website}` : website;
  if (normalizedWebsite && exaConfigured()) {
    const result = await getBusinessProfile(normalizedWebsite).catch(() => null);
    if (result?.profile) profile = result.profile;
  }

  // Capture the lead (best-effort — never block the demo on it).
  const notes = [description, googleLink ? `Google: ${googleLink}` : ""].filter(Boolean).join(" · ");
  await saveLead({
    name,
    email,
    mobile: phone || undefined,
    company: businessName,
    website: normalizedWebsite || googleLink || undefined,
    industry: businessType,
    message: notes || undefined,
    source: `Live Demo — ${kind === "voice" ? "Voice AI" : "Website"}`,
  }).catch((e) => console.error("saveLead failed:", e));
  sendLeadNotification({
    name, email, mobile: phone, company: businessName, industry: businessType,
    message: `Live Demo (${kind}) — ${notes || "no notes"}`, source: "Live Demo",
  }).catch(() => {});

  const token = await createExperience({
    businessName,
    industry: businessType,
    website: normalizedWebsite || undefined,
    profile: profile || undefined,
    city: city || undefined,
    phone: phone || undefined,
  });

  if (!token) {
    return NextResponse.json({ error: "Demo generation is temporarily unavailable. Please try again." }, { status: 503 });
  }

  const url = kind === "voice" ? `/experience/${token}` : `/preview/${token}`;
  return NextResponse.json({ url });
}
