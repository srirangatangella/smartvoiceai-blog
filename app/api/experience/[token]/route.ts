import { NextResponse } from "next/server";
import { getExperience, consumeExperience, endExperience } from "@/lib/db";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ token: string }> };

/** Status: is this session still allowed (not yet used)? */
export async function GET(_req: Request, { params }: Ctx) {
  const { token } = await params;
  const exp = await getExperience(token);
  if (!exp) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({
    allowed: !exp.used,
    businessName: exp.business_name,
    industry: exp.industry,
    profile: exp.profile,
  });
}

/** Actions: 'start' atomically claims the single session; 'end' records duration. */
export async function POST(req: Request, { params }: Ctx) {
  const { token } = await params;
  let body: { action?: string; seconds?: number } = {};
  try {
    body = await req.json();
  } catch {}

  if (body.action === "start") {
    const allowed = await consumeExperience(token);
    return NextResponse.json({ allowed });
  }
  if (body.action === "end") {
    await endExperience(token, Number(body.seconds) || 0);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "bad_action" }, { status: 400 });
}
