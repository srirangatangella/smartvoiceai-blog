import { NextResponse } from "next/server";
import { addSuppression } from "@/lib/db";

export const runtime = "nodejs";

/**
 * Receives Amazon SES bounce/complaint events via SNS and suppresses those
 * addresses automatically. Point an SNS topic (subscribed to SES bounce +
 * complaint events) at:  https://smartvoiceai.in/api/ses-notifications
 *
 * Handles the SNS subscription confirmation handshake automatically.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const type = (req.headers.get("x-amz-sns-message-type") || (body.Type as string) || "").toString();

  // 1) SNS subscription handshake — auto-confirm by visiting the SubscribeURL.
  if (type === "SubscriptionConfirmation" && typeof body.SubscribeURL === "string") {
    try {
      await fetch(body.SubscribeURL);
      console.log("SNS subscription confirmed.");
    } catch (e) {
      console.error("SNS confirm failed:", e);
    }
    return NextResponse.json({ ok: true });
  }

  // 2) Actual bounce/complaint notification.
  if (type === "Notification") {
    let msg: Record<string, unknown> = {};
    try {
      msg = JSON.parse((body.Message as string) || "{}");
    } catch {}
    const emails: string[] = [];
    const kind = (msg.notificationType || msg.eventType) as string | undefined;

    if (kind === "Bounce") {
      const b = msg.bounce as { bounceType?: string; bouncedRecipients?: { emailAddress?: string }[] } | undefined;
      // Only suppress permanent (hard) bounces — transient ones may recover.
      if (b?.bounceType === "Permanent") {
        for (const r of b.bouncedRecipients || []) if (r.emailAddress) emails.push(r.emailAddress);
      }
    } else if (kind === "Complaint") {
      const c = msg.complaint as { complainedRecipients?: { emailAddress?: string }[] } | undefined;
      for (const r of c?.complainedRecipients || []) if (r.emailAddress) emails.push(r.emailAddress);
    }

    for (const e of emails) {
      await addSuppression(e, (kind || "bounce").toLowerCase()).catch((err) =>
        console.error("suppress failed:", err)
      );
    }
    if (emails.length) console.log(`SES ${kind}: suppressed ${emails.length} address(es).`);
    return NextResponse.json({ ok: true, suppressed: emails.length });
  }

  return NextResponse.json({ ok: true });
}
