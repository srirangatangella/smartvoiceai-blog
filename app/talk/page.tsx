"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Vapi from "@vapi-ai/web";
import { Mic, PhoneOff, Loader2, ArrowLeft } from "lucide-react";

// Public (browser-safe) VAPI key + the assistant that answers the web experience.
// Override via env; defaults let it work out of the box for testing.
const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "ba407006-669b-4cb3-91c2-1796c297d18e";
const ASSISTANT_ID = process.env.NEXT_PUBLIC_TALK_ASSISTANT_ID || "320adb5f-8ac2-4a36-a48f-4a248aff9090";

type CallState = "idle" | "connecting" | "active" | "ended" | "error";

function TalkExperience() {
  const params = useSearchParams();
  const name = params.get("name") || "";
  const industry = params.get("industry") || "";

  const vapiRef = useRef<Vapi | null>(null);
  const [state, setState] = useState<CallState>("idle");
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const vapi = new Vapi(PUBLIC_KEY);
    vapiRef.current = vapi;

    vapi.on("call-start", () => setState("active"));
    vapi.on("call-end", () => {
      setState("ended");
      setSpeaking(false);
    });
    vapi.on("speech-start", () => setSpeaking(true));
    vapi.on("speech-end", () => setSpeaking(false));
    vapi.on("error", (e: unknown) => {
      console.error("Vapi error:", e);
      setError("Something went wrong starting the call. Please refresh and try again.");
      setState("error");
    });

    return () => {
      try {
        vapi.stop();
      } catch {}
      vapiRef.current = null;
    };
  }, []);

  const start = async () => {
    if (!vapiRef.current) return;
    setError("");
    setState("connecting");
    try {
      await vapiRef.current.start(ASSISTANT_ID, {
        variableValues: { name, industry },
      } as Record<string, unknown>);
    } catch (e) {
      console.error(e);
      setError("Couldn't start the call. Please allow microphone access and try again.");
      setState("error");
    }
  };

  const stop = () => {
    vapiRef.current?.stop();
    setState("ended");
  };

  const greeting = name ? `Hi ${name} 👋` : "Hi there 👋";
  const sub = industry
    ? `Tap the mic and ask me anything about how Smart Voice AI would work for your ${industry.toLowerCase()} business.`
    : "Tap the mic and ask me anything about how Smart Voice AI would work for your business.";

  return (
    <div className="talk-wrap">
      <Link href="/" className="talk-back">
        <ArrowLeft className="h-4 w-4" /> Smart Voice AI
      </Link>

      <div className="talk-card">
        <div className="talk-eyebrow">Live voice experience</div>
        <h1 className="talk-title">{greeting}</h1>
        <p className="talk-sub">{sub}</p>

        <div className={`talk-orb ${state === "active" ? "live" : ""}`}>
          {state === "active" && (
            <div className="wave-container" style={{ position: "absolute" }}>
              {[0, 0.1, 0.2, 0.3, 0.4].map((d) => (
                <div key={d} className="wave-bar" style={{ animationDelay: `${d}s`, opacity: speaking ? 1 : 0.5 }} />
              ))}
            </div>
          )}
          {state !== "active" && <Mic className="h-12 w-12" />}
        </div>

        <div className="talk-status">
          {state === "idle" && "Ready when you are"}
          {state === "connecting" && "Connecting…"}
          {state === "active" && (speaking ? "Assistant is speaking…" : "Listening — go ahead")}
          {state === "ended" && "Call ended. Thanks for trying it!"}
          {state === "error" && error}
        </div>

        {state !== "active" && state !== "connecting" ? (
          <button className="btn btn-primary talk-btn" onClick={start}>
            <Mic className="h-5 w-5" /> {state === "ended" ? "Talk again" : "Start the call"}
          </button>
        ) : state === "connecting" ? (
          <button className="btn btn-primary talk-btn" disabled>
            <Loader2 className="h-5 w-5 animate-spin" /> Connecting…
          </button>
        ) : (
          <button className="btn btn-outline talk-btn" onClick={stop}>
            <PhoneOff className="h-5 w-5" /> End call
          </button>
        )}

        <p className="talk-foot">
          Uses your microphone · nothing is installed · works on any modern browser.
        </p>
        <Link href="/contact" className="talk-link">
          Prefer to talk to a human? Book a consultation →
        </Link>
      </div>
    </div>
  );
}

export default function TalkPage() {
  return (
    <Suspense fallback={<div className="talk-wrap"><div className="talk-card">Loading…</div></div>}>
      <TalkExperience />
    </Suspense>
  );
}
