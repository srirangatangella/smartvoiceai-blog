import { NextResponse } from "next/server";
import { saveBooking } from "@/lib/db";
import { sendBookingNotification } from "@/lib/email";

export const runtime = "nodejs";

/**
 * Called by the VAPI "book_demo" tool (and usable directly). Accepts either:
 *  - a VAPI tool-call payload:  { message: { toolCalls: [{ id, function:{ name, arguments } }] } }
 *  - a plain JSON booking:      { name, email, phone, preferred_time, notes }
 * Stores the booking, emails you, and returns VAPI's expected tool result.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {}

  // Detect a VAPI tool call and pull out the arguments + toolCallId.
  let args: Record<string, unknown> = {};
  let toolCallId: string | undefined;
  const msg = body.message as Record<string, unknown> | undefined;
  const toolCalls = (msg?.toolCalls || msg?.toolCallList) as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(toolCalls) && toolCalls.length) {
    const tc = toolCalls[0];
    toolCallId = tc.id as string;
    const fn = tc.function as Record<string, unknown> | undefined;
    const raw = fn?.arguments;
    args = typeof raw === "string" ? safeParse(raw) : ((raw as Record<string, unknown>) || {});
  } else {
    args = body; // plain call
  }

  const booking = {
    name: str(args.name),
    email: str(args.email),
    phone: str(args.phone),
    preferredTime: str(args.preferred_time ?? args.preferredTime),
    notes: str(args.notes),
    source: toolCallId ? "ai_booker" : str(args.source) || "api",
  };

  await Promise.allSettled([
    saveBooking(booking),
    sendBookingNotification(booking).catch((e) => {
      console.error("Booking notify failed:", e);
      return false;
    }),
  ]);
  console.log("📅 Booking captured:", JSON.stringify(booking));

  const message = `Great — I've noted a demo request for ${booking.name || "you"}${
    booking.preferredTime ? ` around ${booking.preferredTime}` : ""
  }. The team will confirm shortly.`;

  // Respond in VAPI's tool-result shape when called as a tool; else plain JSON.
  if (toolCallId) {
    return NextResponse.json({ results: [{ toolCallId, result: message }] });
  }
  return NextResponse.json({ success: true, message });
}

function safeParse(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
function str(v: unknown): string {
  return v == null ? "" : String(v).trim();
}
