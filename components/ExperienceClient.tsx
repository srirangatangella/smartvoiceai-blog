"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { Mic, Clock, CheckCircle2 } from "lucide-react";

/* Personalized sample assistant with a STRICT one-time, 2-minute cap:
   - one-time: the server marks the token `used` on call-start (atomic);
     a used token renders the "already used" screen and never loads the widget.
   - 2 minutes: enforced primarily by the VAPI assistant's max-duration setting
     (set it to 120s in the VAPI dashboard), plus a client-side backup timer. */

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vapiSDK?: any;
  }
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "ba407006-669b-4cb3-91c2-1796c297d18e";
// Default/US assistant (English). India gets a separate multilingual assistant
// (Telugu / Hindi / English) once its ID is set in NEXT_PUBLIC_SAMPLE_ASSISTANT_ID_IN.
const ASSISTANT_US = process.env.NEXT_PUBLIC_SAMPLE_ASSISTANT_ID || "320adb5f-8ac2-4a36-a48f-4a248aff9090";
const ASSISTANT_IN = process.env.NEXT_PUBLIC_SAMPLE_ASSISTANT_ID_IN || "";

/** India → multilingual assistant when configured; otherwise fall back to the default. */
function pickAssistant(country?: string) {
  return (country || "").toUpperCase() === "IN" && ASSISTANT_IN ? ASSISTANT_IN : ASSISTANT_US;
}
const MAX_SECONDS = 120;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function ExperienceClient({
  token,
  initialAllowed,
  businessName,
  industry,
  profile = "",
  country = "",
}: {
  token: string;
  initialAllowed: boolean;
  businessName: string;
  industry: string;
  profile?: string;
  country?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vapiRef = useRef<any>(null);
  const startRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [blocked] = useState(!initialAllowed);
  const [active, setActive] = useState(false);
  const [ended, setEnded] = useState(false);
  const [remaining, setRemaining] = useState(MAX_SECONDS);

  const hideWidgetButton = () => {
    document.querySelectorAll('[class*="vapi"], [id*="vapi"]').forEach((el) => {
      const tag = (el as HTMLElement).tagName;
      if (tag === "BUTTON" || tag === "DIV") (el as HTMLElement).style.display = "none";
    });
  };

  const init = () => {
    if (blocked || !window.vapiSDK || vapiRef.current) return;
    try {
      const instance = window.vapiSDK.run({
        apiKey: PUBLIC_KEY,
        assistant: pickAssistant(country),
        assistantOverrides: {
          maxDurationSeconds: MAX_SECONDS,
          variableValues: { business: businessName, industry, profile, country },
        },
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

      instance.on?.("call-start", async () => {
        startRef.current = Date.now();
        // Claim the single allowed session; if already used elsewhere, stop.
        try {
          const r = await fetch(`/api/experience/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "start" }),
          });
          const d = await r.json();
          if (!d.allowed) {
            instance.stop?.();
            return;
          }
        } catch {}
        setActive(true);
        timerRef.current = setInterval(() => {
          const el = Math.floor((Date.now() - startRef.current) / 1000);
          setRemaining(Math.max(0, MAX_SECONDS - el));
          if (el >= MAX_SECONDS) {
            try {
              instance.stop?.();
            } catch {}
          }
        }, 1000);
      });

      instance.on?.("call-end", async () => {
        setActive(false);
        setEnded(true);
        if (timerRef.current) clearInterval(timerRef.current);
        hideWidgetButton();
        const seconds = startRef.current ? Math.round((Date.now() - startRef.current) / 1000) : 0;
        try {
          await fetch(`/api/experience/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "end", seconds }),
          });
        } catch {}
      });

      vapiRef.current = instance;
    } catch (e) {
      console.error("Vapi init error:", e);
    }
  };

  useEffect(() => {
    if (!blocked && typeof window !== "undefined" && window.vapiSDK) init();
    return () => {
      try {
        vapiRef.current?.stop?.();
      } catch {}
      if (timerRef.current) clearInterval(timerRef.current);
      document
        .querySelectorAll('[class*="vapi-btn"], [id^="vapi-"], [class*="vapi-support"]')
        .forEach((el) => el.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const biz = businessName || "your business";

  // ── Already used ────────────────────────────────────────────────
  if (blocked) {
    return (
      <div className="talk-wrap">
        <div className="talk-card">
          <div className="talk-eyebrow">Sample complete</div>
          <h1 className="talk-title">You&apos;ve used your free sample 🎙️</h1>
          <p className="talk-sub">
            Hope you enjoyed hearing an AI assistant for {biz}! Ready to see the full version built for
            your business? Book a quick live demo with our team.
          </p>
          <Link href="/contact" className="btn btn-primary talk-btn">
            Book Your Live Demo →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="talk-wrap">
      {!blocked && (
        <Script
          src="https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js"
          onLoad={init}
        />
      )}
      <div className="talk-card">
        {ended ? (
          <>
            <div className="talk-orb">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className="talk-eyebrow">That&apos;s your sample</div>
            <h1 className="talk-title">Impressed? 🚀</h1>
            <p className="talk-sub">
              That was a live AI assistant for {biz}. Book a demo and we&apos;ll build one tailored to
              your business — connected to your calendar and CRM.
            </p>
            <Link href="/contact" className="btn btn-primary talk-btn">
              Book Your Live Demo →
            </Link>
          </>
        ) : (
          <>
            <div className="talk-eyebrow">Live sample · {industry || "your business"}</div>
            <h1 className="talk-title">Meet the AI assistant for {biz}</h1>
            <p className="talk-sub">
              {active
                ? "Go ahead and talk — ask it anything a customer might."
                : "Tap the glowing mic button (bottom of screen) to start your free 2-minute sample."}
            </p>

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

            {active && (
              <div className="talk-status" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Clock className="h-4 w-4 text-primary" /> {fmt(remaining)} left
              </div>
            )}

            <p className="talk-foot">One free 2-minute session · uses your microphone · nothing installed.</p>
          </>
        )}
      </div>
    </div>
  );
}
