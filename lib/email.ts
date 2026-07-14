import { Resend } from "resend";
import nodemailer from "nodemailer";
import { siteConfig } from "./site";
import type { LeadInput } from "./db";

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

/* ─────────────────────────────────────────────────────────────
   SMTP (e.g. Zoho) — customer-facing welcome email with a link to
   the browser voice experience (/talk). Works globally, no phone
   number needed. Env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
   SMTP_SECURE (default true), SMTP_FROM.
   ───────────────────────────────────────────────────────────── */

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== "false",
    auth: { user, pass },
  });
  return transporter;
}

export function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function firstName(name?: string) {
  return (name || "").trim().split(/\s+/)[0] || "there";
}

/** Notifies YOU of a new demo booking (via SMTP if set, else Resend). */
export async function sendBookingNotification(b: {
  name?: string;
  email?: string;
  phone?: string;
  preferredTime?: string;
  notes?: string;
  source?: string;
}): Promise<boolean> {
  const to = NOTIFY_TO;
  const rows = [
    ["Name", b.name],
    ["Email", b.email],
    ["Phone", b.phone],
    ["Preferred time", b.preferredTime],
    ["Notes", b.notes],
    ["Source", b.source],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600">${k}</td><td style="padding:6px 12px">${escapeHtml(String(v))}</td></tr>`)
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px">
    <h2 style="color:#00a3c4">📅 New demo booking</h2>
    <table style="border-collapse:collapse;border:1px solid #eee">${rows}</table></div>`;
  const subject = `📅 Demo booking: ${b.name || "New lead"}`;

  const t = getTransporter();
  if (t) {
    await t.sendMail({ from: process.env.SMTP_FROM || `Smart Voice AI <${process.env.SMTP_USER}>`, to, replyTo: b.email || undefined, subject, html });
    return true;
  }
  if (resend) {
    await resend.emails.send({ from: FROM, to, replyTo: b.email || undefined, subject, html });
    return true;
  }
  return false;
}

/** True when a Cal.com/Calendly link is configured. */
export function bookingUrlConfigured() {
  return Boolean(siteConfig.bookingUrl);
}

/** After the AI booker captures details, email the LEAD your scheduler link to
 *  pick their exact slot. No-ops if SMTP or the booking URL isn't configured. */
export async function sendBookingLinkToLead(b: { name?: string; email?: string }): Promise<boolean> {
  if (!b.email || !bookingUrlConfigured()) return false;
  const t = getTransporter();
  if (!t) return false;
  const fn = firstName(b.name);
  const url = siteConfig.bookingUrl;
  await t.sendMail({
    from: process.env.SMTP_FROM || `Smart Voice AI <${process.env.SMTP_USER}>`,
    to: b.email,
    replyTo: siteConfig.email,
    subject: `${fn}, pick your demo time →`,
    text: `Hi ${fn},\n\nThanks for booking a demo with Smart Voice AI. Pick the exact time that works for you here:\n${url}\n\n— Smart Voice AI`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;padding:28px">
        <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb">
          <div style="background:#0b2a33;padding:22px 28px;color:#fff;font-size:18px;font-weight:800">SMART VOICE <span style="color:#00d4ff">AI</span></div>
          <div style="padding:28px">
            <h1 style="margin:0 0 12px;font-size:22px;color:#111">Hi ${escapeHtml(fn)}, pick your demo time</h1>
            <p style="color:#444;line-height:1.6;font-size:15px;margin:0 0 22px">Thanks for booking a demo! Choose the exact time that suits you:</p>
            <a href="${url}" style="display:inline-block;background:#00d4ff;color:#00131a;text-decoration:none;font-weight:800;padding:14px 28px;border-radius:40px;font-size:16px">📅 Choose my time</a>
            <p style="color:#888;font-size:13px;margin:22px 0 0">Or open: <a href="${url}" style="color:#00a3c4">${url}</a></p>
          </div>
        </div>
      </div>`,
  });
  return true;
}

/** Personalized link to the browser voice experience. */
export function talkLink(lead: LeadInput) {
  const q = new URLSearchParams();
  if (lead.name) q.set("name", firstName(lead.name));
  if (lead.industry) q.set("industry", lead.industry);
  return `${siteConfig.url}/talk?${q.toString()}`;
}

/** Sends the lead a branded email with TWO actions: (1) talk to a live sample
 *  assistant for their business, (2) book a live demo. `experienceUrl` is the
 *  personalized one-time sample link; falls back to the generic /talk page. */
export async function sendLeadWelcomeWithLink(lead: LeadInput, experienceUrl?: string): Promise<boolean> {
  const t = getTransporter();
  if (!t) return false;
  const fn = firstName(lead.name);
  const link1 = experienceUrl || talkLink(lead);
  // Link 2 = the AI voice booker (Assistant B on /talk) — qualifies and books.
  const link2 = `${siteConfig.url}/talk?name=${encodeURIComponent(fn)}`;
  const from = process.env.SMTP_FROM || `Smart Voice AI <${process.env.SMTP_USER}>`;

  await t.sendMail({
    from,
    to: lead.email,
    replyTo: siteConfig.email,
    subject: `${fn}, hear a live AI assistant for your business →`,
    text: `Hi ${fn},\n\nThanks for reaching out to Smart Voice AI.\n\n1) Talk to a live AI assistant for your business (2-min sample, in your browser):\n${link1}\n\n2) Ready to book a demo? Talk to our AI booker and it'll schedule you in:\n${link2}\n\n— Smart Voice AI\n${siteConfig.email}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;padding:28px">
        <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb">
          <div style="background:#0b2a33;padding:22px 28px;color:#fff;font-size:18px;font-weight:800">
            SMART VOICE <span style="color:#00d4ff">AI</span>
          </div>
          <div style="padding:28px">
            <h1 style="margin:0 0 12px;font-size:22px;color:#111">Hi ${escapeHtml(fn)}, want to hear it for yourself?</h1>
            <p style="color:#444;line-height:1.6;font-size:15px;margin:0 0 22px">
              Two quick things — both work right in your browser, no phone call, nothing to install:
            </p>
            <p style="margin:0 0 10px;font-weight:700;color:#111">1 · Talk to a live AI assistant for your business</p>
            <a href="${link1}" style="display:inline-block;background:#00d4ff;color:#00131a;text-decoration:none;font-weight:800;padding:13px 26px;border-radius:40px;font-size:15px;margin-bottom:22px">
              🎙️ Try the 2-minute sample
            </a>
            <p style="margin:8px 0 10px;font-weight:700;color:#111">2 · Ready to book a demo?</p>
            <a href="${link2}" style="display:inline-block;background:#0b2a33;color:#fff;text-decoration:none;font-weight:800;padding:13px 26px;border-radius:40px;font-size:15px">
              🎙️ Talk to our AI to schedule
            </a>
            <p style="color:#888;font-size:13px;margin:24px 0 0">
              Trouble with the buttons? Sample: <a href="${link1}" style="color:#00a3c4">${link1}</a>
            </p>
            <p style="color:#444;font-size:14px;margin:20px 0 0">— Team Smart Voice AI</p>
          </div>
          <div style="padding:16px 28px;background:#fafafa;color:#999;font-size:12px;border-top:1px solid #eee">
            ${siteConfig.email} · ${siteConfig.url.replace("https://", "")}
          </div>
        </div>
      </div>`,
  });
  return true;
}
