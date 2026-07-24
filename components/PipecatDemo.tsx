"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Phone, PhoneOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { PipecatClient } from "@pipecat-ai/client-js";
import { SmallWebRTCTransport } from "@pipecat-ai/small-webrtc-transport";

/* Native-Telugu AI receptionist (Priya), served by our own Pipecat + Sarvam
   agent — no VAPI. Same mobile call-screen UI as the VAPI version. The agent
   loads THIS business's profile by token and enforces the 2-minute cap. */

const AGENT_URL = (process.env.NEXT_PUBLIC_VOICE_AGENT_URL || "").replace(/\/$/, "");
const MAX_SECONDS = 120;

// ICE servers for the browser. STUN alone fails behind stricter NATs — the
// browser also needs the TURN relay so media works from any network.
function iceServers(): RTCIceServer[] {
  const list: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];
  const turnUrl = process.env.NEXT_PUBLIC_TURN_URL;
  if (turnUrl) {
    list.push({
      urls: turnUrl,
      username: process.env.NEXT_PUBLIC_TURN_USER || "",
      credential: process.env.NEXT_PUBLIC_TURN_PASS || "",
    });
  }
  return list;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function PipecatDemo({
  token,
  businessName,
  country = "",
}: {
  token: string;
  businessName: string;
  country?: string;
}) {
  const clientRef = useRef<PipecatClient | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [connecting, setConnecting] = useState(false);
  const [active, setActive] = useState(false);
  const [ended, setEnded] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [remaining, setRemaining] = useState(MAX_SECONDS);
  const [error, setError] = useState("");

  const biz = businessName || "your business";
  const initial = (businessName || "S").trim().charAt(0).toUpperCase();
  const isIndia = (country || "").toUpperCase() === "IN";

  const cleanupTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const endCall = async () => {
    try {
      await clientRef.current?.disconnect();
    } catch {}
  };

  const startCall = async () => {
    if (connecting || active) return;
    if (!AGENT_URL) {
      setError("Voice agent is not configured yet.");
      return;
    }
    setError("");
    setConnecting(true);

    const client = new PipecatClient({
      transport: new SmallWebRTCTransport({
        iceServers: iceServers(),
      }),
      enableCam: false,
      enableMic: true,
      callbacks: {
        onConnected: () => {
          startRef.current = Date.now();
          setConnecting(false);
          setActive(true);
          timerRef.current = setInterval(() => {
            const el = Math.floor((Date.now() - startRef.current) / 1000);
            setRemaining(Math.max(0, MAX_SECONDS - el));
            if (el >= MAX_SECONDS) endCall();
          }, 1000);
        },
        onDisconnected: () => {
          cleanupTimer();
          setActive(false);
          setConnecting(false);
          setEnded(true);
        },
        onBotStartedSpeaking: () => setSpeaking(true),
        onBotStoppedSpeaking: () => setSpeaking(false),
        // Attach the bot's audio track so the caller can hear Priya.
        onTrackStarted: (track: MediaStreamTrack, participant?: { local?: boolean }) => {
          if (track.kind !== "audio" || participant?.local) return;
          if (audioRef.current) {
            audioRef.current.srcObject = new MediaStream([track]);
            audioRef.current.play().catch(() => {});
          }
        },
        onError: () => {
          setError("Couldn't connect. Please allow the microphone and try again.");
          setConnecting(false);
        },
      },
    });
    clientRef.current = client;

    try {
      await client.connect({ webrtcUrl: `${AGENT_URL}/api/offer?token=${encodeURIComponent(token)}` });
    } catch {
      setError("Couldn't start the call. Please allow the microphone and try again.");
      setConnecting(false);
    }
  };

  useEffect(() => {
    return () => {
      cleanupTimer();
      try {
        clientRef.current?.disconnect();
      } catch {}
    };
  }, []);

  // ── Ended ─────────────────────────────────────────────────────────
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

  // ── Idle / connecting / active ────────────────────────────────────
  return (
    <div className="call-screen">
      <audio ref={audioRef} autoPlay playsInline hidden />
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
          <div className={`call-wave ${speaking ? "" : "placeholder"}`}>
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
          {error
            ? error
            : active
            ? "Ask it anything a customer might."
            : connecting
            ? "Allow microphone access when prompted."
            : "Free 2-minute call · uses your microphone · nothing to install"}
        </p>
      </div>
    </div>
  );
}
