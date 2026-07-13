/**
 * Turns a business website into an agent-ready profile (+ email) using Exa's
 * /contents endpoint. Clean text + AI summary in one call — much better than
 * raw HTML scraping for personalizing the sample assistant.
 *
 * Env: EXA_API_KEY. If unset, returns null (the assistant falls back to
 * name + industry personalization).
 *
 * Uses Exa's REST API directly (no npm dependency — keeps the build light).
 */

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const BAD_EMAIL = /(\.(png|jpg|jpeg|gif|svg|webp))|sentry\.|wixpress|example\.(com|org)|@2x|no-?reply|@sentry/i;

export function exaConfigured() {
  return Boolean(process.env.EXA_API_KEY);
}

function pickEmail(text: string): string | undefined {
  const found = [...new Set((text.match(EMAIL_RE) || []).map((e) => e.toLowerCase()))].filter(
    (e) => !BAD_EMAIL.test(e) && e.length < 60
  );
  return found[0];
}

export async function getBusinessProfile(
  website: string
): Promise<{ profile: string; email?: string } | null> {
  const key = process.env.EXA_API_KEY;
  if (!key || !website) return null;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch("https://api.exa.ai/contents", {
      method: "POST",
      signal: ctrl.signal,
      headers: { "x-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        urls: [website],
        text: { maxCharacters: 4000 },
        livecrawl: "fallback",
        summary: {
          query:
            "Summarize this business for an AI receptionist: what they do, their key services/specialties, locations or areas served, and any contact email or phone. 4-6 sentences, factual only.",
        },
      }),
    });
    if (!res.ok) {
      console.error("Exa contents error:", res.status, (await res.text().catch(() => "")).slice(0, 200));
      return null;
    }
    const data = await res.json();
    const r = data?.results?.[0];
    if (!r) return null;
    const profile: string = (r.summary || r.text || "").toString().trim().slice(0, 1800);
    if (!profile) return null;
    const email = pickEmail((r.text || "").toString());
    return { profile, email };
  } catch (e) {
    console.error("Exa fetch failed:", e);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
