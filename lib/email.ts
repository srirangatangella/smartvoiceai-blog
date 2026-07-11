import { Resend } from "resend";
import { siteConfig } from "./site";

/**
 * Email via Resend. Set RESEND_API_KEY in your environment.
 * LEAD_NOTIFY_TO overrides where lead alerts are sent (defaults to site email).
 * LEAD_FROM_EMAIL must be a verified sender/domain in Resend
 * (defaults to onboarding@resend.dev, which works for testing only).
 */

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.LEAD_FROM_EMAIL || "Smart Voice AI <onboarding@resend.dev>";
const NOTIFY_TO = process.env.LEAD_NOTIFY_TO || siteConfig.email;

export function emailConfigured() {
  return Boolean(resend);
}

export async function sendLeadNotification(fields: Record<string, string | undefined>) {
  if (!resend) return false;
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;text-transform:capitalize;color:#111">${k}</td><td style="padding:6px 12px;color:#333">${escapeHtml(
          v as string
        )}</td></tr>`
    )
    .join("");

  await resend.emails.send({
    from: FROM,
    to: NOTIFY_TO,
    replyTo: fields.email || undefined,
    subject: `🔔 New lead: ${fields.name || "Website"} ${fields.industry ? `(${fields.industry})` : ""}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px">
        <h2 style="color:#00a3c4">New lead from ${escapeHtml(fields.source || "website")}</h2>
        <table style="border-collapse:collapse;width:100%;border:1px solid #eee">${rows}</table>
        <p style="color:#888;font-size:12px;margin-top:16px">Sent from ${siteConfig.url}</p>
      </div>`,
  });
  return true;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
