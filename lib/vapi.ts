import type { LeadInput } from "./db";

/**
 * Speed-to-lead: place an outbound VAPI call to a new lead within seconds.
 *
 * Env (set in Netlify):
 *   VAPI_PRIVATE_KEY            — your VAPI private (server) API key
 *   VAPI_PHONE_NUMBER_ID        — the VAPI phone-number id to call FROM
 *   VAPI_OUTBOUND_ASSISTANT_ID  — an assistant configured for outbound qualifying
 *   VAPI_API_URL (optional)     — defaults to https://api.vapi.ai/call
 *
 * If any of the three required vars are missing, this safely no-ops so the
 * lead form still works. Calling a lead who just requested a demo is a
 * consented callback (they asked to be contacted) — not cold calling.
 */

const API_URL = process.env.VAPI_API_URL || "https://api.vapi.ai/call";

export function vapiConfigured(): boolean {
  return Boolean(
    process.env.VAPI_PRIVATE_KEY &&
      process.env.VAPI_PHONE_NUMBER_ID &&
      process.env.VAPI_OUTBOUND_ASSISTANT_ID
  );
}

/** Best-effort E.164 normalisation. Collect real +country-code numbers on the form. */
function normalizeNumber(raw?: string): string {
  if (!raw) return "";
  const digitsPlus = raw.replace(/[^\d+]/g, "");
  if (!digitsPlus) return "";
  if (digitsPlus.startsWith("+")) return "+" + digitsPlus.slice(1).replace(/\+/g, "");
  return "+" + digitsPlus.replace(/\+/g, "");
}

/** Returns true if a call was successfully queued, false if skipped/failed. */
export async function triggerOutboundCall(lead: LeadInput): Promise<boolean> {
  if (!vapiConfigured()) return false;

  const number = normalizeNumber(lead.mobile);
  if (number.replace(/\D/g, "").length < 8) {
    console.warn("VAPI call skipped — lead phone number looks invalid:", lead.mobile);
    return false;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
      assistantId: process.env.VAPI_OUTBOUND_ASSISTANT_ID,
      customer: { number, name: lead.name },
      // Pass lead context into the assistant prompt via {{variables}}.
      assistantOverrides: {
        variableValues: {
          name: lead.name,
          company: lead.company || "",
          industry: lead.industry || "",
          message: lead.message || "",
          source: lead.source || "",
        },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("VAPI outbound call failed:", res.status, body.slice(0, 500));
    return false;
  }
  return true;
}
