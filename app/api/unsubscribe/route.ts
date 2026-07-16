import { addSuppression } from "@/lib/db";

export const runtime = "nodejs";

/** One-click unsubscribe. Marks the email suppressed and shows a confirmation. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("e") || "").trim().toLowerCase();
  let done = false;
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    try {
      await addSuppression(email, "unsubscribe");
      done = true;
    } catch (e) {
      console.error("unsubscribe failed:", e);
    }
  }

  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex"><title>Unsubscribed</title>
  <style>body{font-family:Arial,Helvetica,sans-serif;background:#0b1418;color:#e5e7eb;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}
  .c{max-width:440px;text-align:center;padding:40px 28px;background:#111a1f;border:1px solid #22303a;border-radius:18px}
  h1{color:#fff;font-size:22px;margin:0 0 12px}p{color:#9ca3af;line-height:1.6;margin:0}a{color:#00d4ff}</style></head>
  <body><div class="c">
  ${
    done
      ? `<h1>You're unsubscribed ✓</h1><p>${email} won't receive any more emails from us. Sorry to see you go — if this was a mistake, just reply to any past email.</p>`
      : `<h1>Hmm, something's off</h1><p>We couldn't process that unsubscribe link. Please reply "STOP" to the email and we'll remove you right away.</p>`
  }
  </div></body></html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
