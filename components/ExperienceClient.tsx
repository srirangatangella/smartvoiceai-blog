"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { Phone, PhoneOff, ArrowLeft, CheckCircle2 } from "lucide-react";

/* Personalized sample assistant, styled as a mobile phone-call screen, with a
   STRICT one-time, 2-minute cap:
   - one-time: the server marks the token `used` on call-start (atomic);
     a used token renders the "already used" screen and never loads the widget.
   - 2 minutes: enforced by the VAPI assistant's max-duration setting (120s in
     the dashboard) plus a client-side backup timer.
   The VAPI CDN widget button is created off-screen; our Call button drives it. */

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
  const [connecting, setConnecting] = useState(false);
  const [active, setActive] = useState(false);
  const [ended, setEnded] = useState(false);
  const [remaining, setRemaining] = useState(MAX_SECONDS);

  const biz = businessName || "your business";
  const initial = (businessName || "S").trim().charAt(0).toUpperCase();
  const isIndia = (country || "").toUpperCase() === "IN";

  const hideWidgetButton = () => {
    document.querySelectorAll('[class*="vapi-btn"], [id^="vapi-"], [class*="vapi-support"]').forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.pointerEvents = "none";
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
          // Created off-screen; our own Call button triggers it.
          position: "bottom",
          offset: "-1000px",
          button: {
            style: { width: "1px", height: "1px", minWidth: "1px", minHeight: "1px", opacity: 0, position: "fixed", bottom: "-1000px" },
          },
        },
      });

      instance.on?.("call-start", async () => {
        startRef.current = Date.now();
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
        setConnecting(false);
        setActive(true);
        timerRef.current = setInterval(() => {
          const el = Math.floor((Date.now() - startRef.current) / 1000);
          setRemaining(Math.max(0, MAX_SECONDS - el));
          if (el >= MAX_SECONDS) {
            try { instance.stop?.(); } catch {}
          }
        }, 1000);
      });

      instance.on?.("call-end", async () => {
        setActive(false);
        setConnecting(false);
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

      instance.on?.("error", () => setConnecting(false));

      vapiRef.current = instance;
    } catch (e) {
      console.error("Vapi init error:", e);
    }
  };

  useEffect(() => {
    if (!blocked && typeof window !== "undefined" && window.vapiSDK) init();
    return () => {
      try { vapiRef.current?.stop?.(); } catch {}
      if (timerRef.current) clearInterval(timerRef.current);
      document
        .querySelectorAll('[class*="vapi-btn"], [id^="vapi-"], [class*="vapi-support"]')
        .forEach((el) => el.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drive the hidden VAPI widget button.
  const startCall = () => {
    if (connecting || active) return;
    setConnecting(true);
    let tries = 0;
    const tryClick = () => {
      const btn = document.querySelector('[class*="vapi-btn"], [id^="vapi-"], [class*="vapi-support"]') as HTMLElement | null;
      if (btn) { btn.click(); return; }
      if (tries++ < 10) setTimeout(tryClick, 300);
      else setConnecting(false);
    };
    tryClick();
    // Safety: if the call never connects (e.g. mic blocked), reset the button.
    setTimeout(() => setConnecting((c) => (active ? false : c && false)), 12000);
  };

  const endCall = () => {
    try { vapiRef.current?.stop?.(); } catch {}
  };

  // ── Already used ────────────────────────────────────────────────
  if (blocked) {
    return (
      <div className="call-screen">
        <div className="call-card">
          <div className="call-avatar"><span>{initial}</span></div>
          <div className="call-name">{biz}</div>
          <div className="call-eyebrow">Sample complete</div>
          <p className="call-msg">You&apos;ve already used your free sample. Ready for the full version, built and connected for your business?</p>
          <Link href="/contact" className="btn btn-primary call-cta">Book your live demo →</Link>
        </div>
      </div>
    );
  }

  // ── Ended ────────────────────────────────────────────────────────
  if (ended) {
    return (
      <div className="call-screen">
        <div className="call-card">
          <div className="call-avatar done"><CheckCircle2 className="h-12 w-12" /></div>
          <div className="call-name">{biz}</div>
          <div className="call-eyebrow">That was your sample 🚀</div>
          <p className="call-msg">Impressed? We&apos;ll build one tailored to {biz} — connected to your calendar and CRM.</p>
          <Link href="/contact" className="btn btn-primary call-cta">Book your live demo →</Link>
        </div>
      </div>
    );
  }

  // ── Idle / connecting / active call screen ──────────────────────
  return (
    <div className="call-screen">
      <Script src="https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js" onLoad={init} />
      <Link href="/" className="call-back"><ArrowLeft className="h-4 w-4" /> Home</Link>

      <div className="call-card">
        <div className={`call-avatar ${active ? "live" : ""} ${connecting ? "ringing" : ""}`}>
          {(active || connecting) && <><span className="call-ring" /><span className="call-ring r2" /></>}
          <span>{initial}</span>
        </div>

        <div className="call-name">{biz}</div>
        <div className="call-role">AI Receptionist{isIndia ? " · తెలుగు · हिंदी · English" : ""}</div>

        <div className={`call-status ${active ? "on" : ""}`}>
          <span className="call-dot" />
          {active ? "Connected — talk now" : connecting ? "Connecting…" : "Ready to call"}
        </div>

        {active ? (
          <div className="call-wave">
            {[0, 0.12, 0.24, 0.36, 0.48, 0.24, 0.12].map((d, i) => (
              <span key={i} style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
        ) : (
          <div className="call-wave placeholder">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => <span key={i} />)}
          </div>
        )}

        <div className={`call-timer ${active ? "on" : ""}`}>{fmt(active ? remaining : MAX_SECONDS)}</div>

        {active ? (
          <button className="call-btn end" onClick={endCall} aria-label="End call">
            <PhoneOff className="h-7 w-7" />
          </button>
        ) : (
          <button className={`call-btn start ${connecting ? "busy" : ""}`} onClick={startCall} disabled={connecting} aria-label="Start call">
            <Phone className="h-7 w-7" />
          </button>
        )}

        <p className="call-hint">
          {active ? "Ask it anything a customer might." : connecting ? "Allow microphone access when prompted." : "Free 2-minute call · uses your microphone · nothing to install"}
        </p>
      </div>
    </div>
  );
}
