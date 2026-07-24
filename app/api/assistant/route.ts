import { NextRequest } from "next/server";
import { CHAT_SYSTEM_PROMPT } from "@/lib/assistant-knowledge";

/**
 * On-site chat assistant, powered by Gemini Flash via its OpenAI-compatible
 * endpoint. Streams the reply back as plain text chunks.
 *
 * Env: GOOGLE_API_KEY (server-side; NOT NEXT_PUBLIC).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const MODEL = process.env.GEMINI_CHAT_MODEL || "gemini-2.5-flash";

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) return new Response("Assistant not configured.", { status: 503 });

  let messages: Msg[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  // Keep only the last ~12 turns, sanitize, and cap length.
  const history = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  const upstream = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      max_tokens: 400,
      temperature: 0.5,
      messages: [{ role: "system", content: CHAT_SYSTEM_PROMPT }, ...history],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("The assistant is unavailable right now.", { status: 502 });
  }

  // Transform the OpenAI-style SSE stream into plain text deltas.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const t = line.trim();
            if (!t.startsWith("data:")) continue;
            const data = t.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              /* ignore keep-alives / partial frames */
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
