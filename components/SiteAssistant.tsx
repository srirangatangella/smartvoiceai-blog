"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Mic, PhoneOff, Bot } from "lucide-react";
import { PipecatClient } from "@pipecat-ai/client-js";
import { SmallWebRTCTransport } from "@pipecat-ai/small-webrtc-transport";

/* Floating on-site assistant for smartvoiceai.in — CHAT (Gemini via /api/assistant)
   and TALK (the Pipecat voice agent, site persona). One launcher, two modes. */

const AGENT_URL = (process.env.NEXT_PUBLIC_VOICE_AGENT_URL || "").replace(/\/$/, "");
const SITE_TOKEN = process.env.NEXT_PUBLIC_SITE_VOICE_TOKEN || "smartvoiceai-site";
const VOICE_ENABLED = !!AGENT_URL;

function iceServers(): RTCIceServer[] {
  const list: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];
  const turn = process.env.NEXT_PUBLIC_TURN_URL;
  if (turn) {
    list.push({
      urls: turn,
      username: process.env.NEXT_PUBLIC_TURN_USER || "",
      credential: process.env.NEXT_PUBLIC_TURN_PASS || "",
    });
  }
  return list;
}

type Msg = { role: "user" | "assistant"; content: string };
const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! I'm the Smart Voice AI assistant 👋 Ask me anything about our AI receptionists, website assistants, pricing, or how to get started — or tap the mic to talk.",
};

export default function SiteAssistant() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"chat" | "voice">("chat");
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // voice
  const clientRef = useRef<PipecatClient | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [vState, setVState] = useState<"idle" | "connecting" | "live">("idle");

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setBusy(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error("unavailable");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        setMessages((m) => {
          const c = [...m];
          c[c.length - 1] = { role: "assistant", content: c[c.length - 1].content + chunk };
          return c;
        });
      }
    } catch {
      setMessages((m) => {
        const c = [...m];
        c[c.length - 1] = {
          role: "assistant",
          content: "Sorry, I couldn't reach the assistant. Please try again, or book a call at /book.",
        };
        return c;
      });
    } finally {
      setBusy(false);
    }
  }

  async function endCall() {
    try {
      await clientRef.current?.disconnect();
    } catch {}
    setVState("idle");
  }

  async function startCall() {
    if (vState !== "idle" || !VOICE_ENABLED) return;
    setVState("connecting");
    const client = new PipecatClient({
      transport: new SmallWebRTCTransport({ iceServers: iceServers() }),
      enableCam: false,
      enableMic: true,
      callbacks: {
        onConnected: () => setVState("live"),
        onDisconnected: () => setVState("idle"),
        onTrackStarted: (track: MediaStreamTrack, p?: { local?: boolean }) => {
          if (track.kind !== "audio" || p?.local) return;
          if (audioRef.current) {
            audioRef.current.srcObject = new MediaStream([track]);
            audioRef.current.play().catch(() => {});
          }
        },
        onError: () => setVState("idle"),
      },
    });
    clientRef.current = client;
    try {
      await client.connect({ webrtcUrl: `${AGENT_URL}/api/offer?token=${encodeURIComponent(SITE_TOKEN)}` });
    } catch {
      setVState("idle");
    }
  }

  useEffect(() => () => void clientRef.current?.disconnect().catch(() => {}), []);

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open assistant"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105"
          style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6 55%,#6366f1)" }}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex w-[92vw] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1424] shadow-2xl" style={{ height: "min(70vh,560px)" }}>
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 text-white" style={{ background: "linear-gradient(135deg,#0c1322,#101a2e)" }}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6 55%,#6366f1)" }}>
              <Bot className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <div className="text-sm font-semibold leading-tight">Smart Voice AI</div>
              <div className="text-[11px] text-cyan-300/80">Ask about our AI assistants</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="rounded p-1 text-white/70 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 border-b border-white/10 bg-[#0b1424] px-2 py-1.5">
            <button onClick={() => setMode("chat")} className={`flex-1 rounded-md py-1.5 text-xs font-medium ${mode === "chat" ? "bg-white/10 text-white" : "text-white/50"}`}>💬 Chat</button>
            <button onClick={() => setMode("voice")} disabled={!VOICE_ENABLED} className={`flex-1 rounded-md py-1.5 text-xs font-medium disabled:opacity-40 ${mode === "voice" ? "bg-white/10 text-white" : "text-white/50"}`}>🎙️ Talk</button>
          </div>

          {mode === "chat" ? (
            <>
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[13.5px] leading-relaxed ${m.role === "user" ? "bg-blue-600 text-white" : "bg-white/8 text-white/90"}`}>
                      {m.content || (busy && i === messages.length - 1 ? "…" : "")}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-white/10 p-2.5">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask about pricing, demo, features…"
                  className="flex-1 rounded-full bg-white/8 px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none"
                />
                <button onClick={send} disabled={busy || !input.trim()} aria-label="Send" className="flex h-9 w-9 items-center justify-center rounded-full text-white disabled:opacity-40" style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6 55%,#6366f1)" }}>
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
              <audio ref={audioRef} autoPlay playsInline hidden />
              <div className="text-sm text-white/70">
                {vState === "live" ? "Connected — talk now" : vState === "connecting" ? "Connecting…" : "Talk to our AI assistant about how it can work for your business."}
              </div>
              <div className={`flex h-24 w-24 items-center justify-center rounded-full ${vState === "live" ? "animate-pulse" : ""}`} style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6 55%,#6366f1)" }}>
                {vState === "live" ? <PhoneOff className="h-9 w-9 text-white" /> : <Mic className="h-9 w-9 text-white" />}
              </div>
              {vState === "idle" ? (
                <button onClick={startCall} className="rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white hover:bg-white/15">Start call</button>
              ) : (
                <button onClick={endCall} className="rounded-full bg-red-500/90 px-6 py-2 text-sm font-medium text-white hover:bg-red-500">End call</button>
              )}
              <div className="text-[11px] text-white/40">Uses your microphone · nothing to install</div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
