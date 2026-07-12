"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { Mic, ArrowLeft } from "lucide-react";

/* Loads VAPI via the same CDN script the /demo page uses (no npm dependency),
   which is proven to build & run in production. The SDK renders a floating
   mic button; this page frames it with a branded, personalized experience. */

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vapiSDK?: any;
  }
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "ba407006-669b-4cb3-91c2-1796c297d18e";
const ASSISTANT_ID = process.env.NEXT_PUBLIC_TALK_ASSISTANT_ID || "320adb5f-8ac2-4a36-a48f-4a248aff9090";

function TalkExperience() {
  const params = useSearchParams();
  const name = params.get("name") || "";
  const industry = params.get("industry") || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vapiRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);

  const init = () => {
    if (!window.vapiSDK || vapiRef.current) return;
    try {
      const instance = window.vapiSDK.run({
        apiKey: PUBLIC_KEY,
        assistant: ASSISTANT_ID,
        assistantOverrides: { variableValues: { name, industry } },
        config: {
          position: "bottom",
          offset: "40px",
          button: {
            style: {
              width: "76px",
              height: "76px",
              backgroundColor: "#00d4ff",
              boxShadow: "0 0 30px rgba(0,212,255,0.6)",
              border: "4px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
            },
          },
        },
      });
      instance.on?.("call-start", () => setActive(true));
      instance.on?.("call-end", () => setActive(false));
      vapiRef.current = instance;
      setLoaded(true);
    } catch (e) {
      console.error("Vapi init error:", e);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.vapiSDK) init();
    return () => {
      try {
        vapiRef.current?.stop?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const greeting = name ? `Hi ${name} 👋` : "Hi there 👋";
  const sub = industry
    ? `Tap the glowing mic button and ask me anything about how Smart Voice AI would work for your ${industry.toLowerCase()} business.`
    : "Tap the glowing mic button and ask me anything about how Smart Voice AI would work for your business.";

  return (
    <div className="talk-wrap">
      <Script
        src="https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js"
        onLoad={init}
      />
      <Link href="/" className="talk-back">
        <ArrowLeft className="h-4 w-4" /> Smart Voice AI
      </Link>

      <div className="talk-card">
        <div className="talk-eyebrow">Live voice experience</div>
        <h1 className="talk-title">{greeting}</h1>
        <p className="talk-sub">{sub}</p>

        <div className={`talk-orb ${active ? "live" : ""}`}>
          {active ? (
            <div className="wave-container" style={{ position: "absolute" }}>
              {[0, 0.1, 0.2, 0.3, 0.4].map((d) => (
                <div key={d} className="wave-bar" style={{ animationDelay: `${d}s` }} />
              ))}
            </div>
          ) : (
            <Mic className="h-12 w-12" />
          )}
        </div>

        <div className="talk-status">
          {active
            ? "Connected — go ahead and talk"
            : loaded
              ? "Tap the glowing button (bottom of screen) to start"
              : "Preparing your assistant…"}
        </div>

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
    <Suspense
      fallback={
        <div className="talk-wrap">
          <div className="talk-card">Loading…</div>
        </div>
      }
    >
      <TalkExperience />
    </Suspense>
  );
}
