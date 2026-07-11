import { NextResponse } from "next/server";
import { saveSubscriber } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const stored = await saveSubscriber(email.trim().toLowerCase());
    if (!stored) {
      // DB not configured — log so the signup isn't lost.
      console.log(`New subscriber (DB not configured): ${email}`);
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to the newsletter!",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
