"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Floating widget cluster for the /preview demo sites — a SHOWCASE of the
 * upsell stack (WhatsApp automation, web AI chatbot, AI voice receptionist).
 * The AI panels are polished MOCKUPS (no API/VAPI cost on cold views); every
 * "get this" CTA + the WhatsApp button route to Smart Voice AI to capture the
 * prospect as a lead.
 */

type Msg = { from: "bot" | "you"; text: string };

interface Props {
  name: string;
  bookLabel: string; // "appointment" | "site visit" | "room" | ...
  chips: string[];
  hours: string;
  svaiWhatsApp: string; // wa.me deep link to Smart Voice AI (lead capture)
}

export default function PreviewWidgets({ name, bookLabel, chips, hours, svaiWhatsApp }: Props) {
  const [panel, setPanel] = useState<null | "chat" | "call">(null);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: WIDGET_CSS }} />

      {panel === "chat" && <ChatPanel name={name} bookLabel={bookLabel} chips={chips} hours={hours} svaiWhatsApp={svaiWhatsApp} onClose={() => setPanel(null)} />}
      {panel === "call" && <CallPanel name={name} bookLabel={bookLabel} svaiWhatsApp={svaiWhatsApp} onClose={() => setPanel(null)} />}

      <div className="pvw-stack">
        <a className="pvw-fab pvw-wa" href={svaiWhatsApp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" data-tip="Chat on WhatsApp">
          <WaIcon />
        </a>
        <button className="pvw-fab pvw-chat" onClick={() => setPanel(panel === "chat" ? null : "chat")} aria-label="AI chat" data-tip="Ask our AI assistant">💬</button>
        <button className="pvw-fab pvw-call" onClick={() => setPanel(panel === "call" ? null : "call")} aria-label="AI call" data-tip="Talk to our AI receptionist">📞</button>
      </div>
    </>
  );
}

/* ─────────── Chat mockup ─────────── */
function ChatPanel({ name, bookLabel, chips, hours, svaiWhatsApp, onClose }: Props & { onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: `Hi! 👋 Welcome to ${name}. How can I help you today?` }]);
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const a = /^[aeiou]/i.test(bookLabel) ? "an" : "a"; // "an appointment", "a room"

  function reply(userText: string) {
    setMsgs((m) => [...m, { from: "you", text: userText }]);
    setTyping(true);
    const t = userText.toLowerCase();
    let answer: string;
    if (t.includes("book") || t.includes("appoint") || t.includes("visit") || t.includes("trial") || t.includes("room")) {
      answer = `I'd be glad to help you book ${a} ${bookLabel}! What day and time works best for you?`;
    } else if (t.includes("time") || t.includes("hour") || t.includes("open")) {
      answer = `We're open ${hours}. Would you like me to book you ${a} ${bookLabel}?`;
    } else if (t.includes("where") || t.includes("locat") || t.includes("address")) {
      answer = `We're easy to reach — tap "View on Google Maps" on the page for directions. Shall I book you ${a} ${bookLabel}?`;
    } else if (t.includes("price") || t.includes("cost") || t.includes("rate") || t.includes("fee") || t.includes("budget")) {
      answer = `Great question! Pricing depends on your needs — the quickest way is to book ${a} quick ${bookLabel} and we'll walk you through everything.`;
    } else {
      answer = `Happy to help with that! The easiest next step is to book ${a} ${bookLabel} — would you like me to set that up?`;
    }
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", text: answer }]);
      setDone(true);
    }, 900);
  }

  return (
    <div className="pvw-panel">
      <div className="pvw-head">
        <div className="pvw-avatar">{name.trim().charAt(0).toUpperCase()}</div>
        <div>
          <div className="pvw-htitle">{name} Assistant</div>
          <div className="pvw-hsub"><span className="pvw-dot" /> Online now</div>
        </div>
        <button className="pvw-x" onClick={onClose} aria-label="Close">✕</button>
      </div>

      <div className="pvw-body" ref={bodyRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`pvw-msg ${m.from === "bot" ? "pvw-bot" : "pvw-you"}`}>{m.text}</div>
        ))}
        {typing && <div className="pvw-msg pvw-bot pvw-typing"><span></span><span></span><span></span></div>}
        {done && !typing && (
          <a className="pvw-leadcta" href={svaiWhatsApp} target="_blank" rel="noopener noreferrer">
            ⚡ This AI answers &amp; books 24/7. Want it on your site? <b>Get it →</b>
          </a>
        )}
      </div>

      <div className="pvw-chips">
        {chips.map((c) => (
          <button key={c} className="pvw-chipbtn" onClick={() => reply(c)}>{c}</button>
        ))}
      </div>
      <div className="pvw-foot">⚡ Demo AI by Smart Voice AI</div>
    </div>
  );
}

/* ─────────── Voice-call mockup ─────────── */
function CallPanel({ name, bookLabel, svaiWhatsApp, onClose }: Pick<Props, "name" | "bookLabel" | "svaiWhatsApp"> & { onClose: () => void }) {
  const a = /^[aeiou]/i.test(bookLabel) ? "an" : "a";
  const script: Msg[] = [
    { from: "bot", text: `Thanks for calling ${name}! How can I help you today?` },
    { from: "you", text: `Hi, I'd like to book ${a} ${bookLabel}.` },
    { from: "bot", text: `Of course — I can do that right now. What day works for you?` },
    { from: "you", text: `Tomorrow afternoon, if possible.` },
    { from: "bot", text: `Perfect. You're booked for tomorrow at 3:00 PM. I'll send a confirmation. Anything else?` },
    { from: "you", text: `That's all, thank you!` },
    { from: "bot", text: `You're welcome — see you then! 👋` },
  ];
  const [shown, setShown] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const c = setTimeout(() => setConnected(true), 1400);
    return () => clearTimeout(c);
  }, []);

  useEffect(() => {
    if (!connected) return;
    if (shown >= script.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 400 : 1500);
    return () => clearTimeout(t);
  }, [connected, shown, script.length]);

  const finished = connected && shown >= script.length;

  return (
    <div className="pvw-panel pvw-callpanel">
      <div className="pvw-head">
        <div className="pvw-avatar pvw-avatar-call">🎙️</div>
        <div>
          <div className="pvw-htitle">{name} · AI Receptionist</div>
          <div className="pvw-hsub">{connected ? <><span className="pvw-dot" /> Connected · sample call</> : "Connecting…"}</div>
        </div>
        <button className="pvw-x" onClick={onClose} aria-label="Close">✕</button>
      </div>

      {!connected ? (
        <div className="pvw-ringing">
          <div className="pvw-ring" />
          <div className="pvw-ring pvw-ring2" />
          <div className="pvw-callicon">📞</div>
          <div className="pvw-ringtext">Calling AI receptionist…</div>
        </div>
      ) : (
        <div className="pvw-body">
          {script.slice(0, shown).map((m, i) => (
            <div key={i} className={`pvw-msg ${m.from === "bot" ? "pvw-bot" : "pvw-you"}`}>
              <span className="pvw-who">{m.from === "bot" ? "AI" : "Caller"}</span>{m.text}
            </div>
          ))}
          {shown < script.length && <div className="pvw-wave"><span></span><span></span><span></span><span></span><span></span></div>}
          {finished && (
            <a className="pvw-leadcta" href={svaiWhatsApp} target="_blank" rel="noopener noreferrer">
              ⚡ A real AI receptionist that answers every call 24/7. <b>Add it to your business →</b>
            </a>
          )}
        </div>
      )}
      <div className="pvw-foot">⚡ Sample voice AI by Smart Voice AI</div>
    </div>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 32 32" width="24" height="24" fill="currentColor" aria-hidden>
      <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.1 1.6 5.9L4 29l8.3-1.6c1.7.9 3.6 1.4 5.7 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7.7.7-3.6-.2-.4c-1-1.6-1.5-3.4-1.5-5.3C5.9 9.6 10.4 5.1 16 5.1S26.1 9.6 26.1 15 21.6 24.8 16 24.8zm5.6-7.3c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2c-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.6-.4z" />
    </svg>
  );
}

const WIDGET_CSS = `
.pvw-stack{position:fixed;right:20px;bottom:20px;z-index:60;display:flex;flex-direction:column;gap:12px;align-items:flex-end}
.pvw-fab{width:56px;height:56px;border-radius:50%;border:0;cursor:pointer;display:grid;place-items:center;font-size:24px;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.28);transition:.15s;position:relative}
.pvw-fab:hover{transform:translateY(-3px) scale(1.05)}
.pvw-wa{background:#25D366}
.pvw-chat{background:var(--pv-primary,#0d7d74)}
.pvw-call{background:var(--pv-accent,#f4b740);color:#231a00}
.pvw-fab[data-tip]:hover::after{content:attr(data-tip);position:absolute;right:66px;top:50%;transform:translateY(-50%);background:#16231f;color:#fff;font-size:12.5px;font-weight:600;white-space:nowrap;padding:7px 11px;border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,.2)}
.pvw-panel{position:fixed;right:20px;bottom:88px;z-index:61;width:360px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 120px);background:#fff;border-radius:20px;box-shadow:0 24px 70px rgba(0,0,0,.32);display:flex;flex-direction:column;overflow:hidden;font-family:var(--font-sans,system-ui,sans-serif);animation:pvw-pop .18s ease-out}
@keyframes pvw-pop{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}
.pvw-head{display:flex;align-items:center;gap:12px;padding:14px 16px;background:linear-gradient(135deg,var(--pv-primary,#0d7d74),var(--pv-primary-d,#0a5f58));color:#fff}
.pvw-avatar{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.22);display:grid;place-items:center;font-weight:800;font-size:18px;flex:none}
.pvw-avatar-call{font-size:20px}
.pvw-htitle{font-weight:800;font-size:15px}
.pvw-hsub{font-size:12px;opacity:.9;display:flex;align-items:center;gap:6px}
.pvw-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;display:inline-block;box-shadow:0 0 0 0 rgba(74,222,128,.7);animation:pvw-pulse 1.6s infinite}
@keyframes pvw-pulse{0%{box-shadow:0 0 0 0 rgba(74,222,128,.6)}70%{box-shadow:0 0 0 7px rgba(74,222,128,0)}100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}}
.pvw-x{margin-left:auto;background:transparent;border:0;color:#fff;font-size:16px;cursor:pointer;opacity:.85}
.pvw-x:hover{opacity:1}
.pvw-body{flex:1;overflow-y:auto;padding:16px;background:#f6f9f8;display:flex;flex-direction:column;gap:10px}
.pvw-msg{max-width:82%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.5;box-shadow:0 1px 2px rgba(0,0,0,.06)}
.pvw-bot{background:#fff;color:#16231f;align-self:flex-start;border-bottom-left-radius:5px}
.pvw-you{background:var(--pv-primary,#0d7d74);color:#fff;align-self:flex-end;border-bottom-right-radius:5px}
.pvw-who{display:block;font-size:10.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;opacity:.6;margin-bottom:2px}
.pvw-typing{display:flex;gap:4px;align-items:center;width:auto}
.pvw-typing span{width:7px;height:7px;border-radius:50%;background:#9db4ad;display:inline-block;animation:pvw-blink 1.2s infinite}
.pvw-typing span:nth-child(2){animation-delay:.2s}.pvw-typing span:nth-child(3){animation-delay:.4s}
@keyframes pvw-blink{0%,60%,100%{opacity:.3}30%{opacity:1}}
.pvw-leadcta{display:block;margin-top:4px;background:linear-gradient(135deg,var(--pv-primary,#0d7d74),var(--pv-primary-d,#0a5f58));color:#fff;text-decoration:none;font-size:13px;padding:12px 14px;border-radius:14px;line-height:1.45}
.pvw-leadcta b{white-space:nowrap}
.pvw-chips{display:flex;flex-wrap:wrap;gap:8px;padding:12px 14px;border-top:1px solid #eef2f1;background:#fff}
.pvw-chipbtn{background:#eef6f4;color:var(--pv-primary-d,#0a5f58);border:1px solid #d7e7e3;border-radius:40px;padding:8px 13px;font-size:12.5px;font-weight:700;cursor:pointer;transition:.12s}
.pvw-chipbtn:hover{background:var(--pv-primary,#0d7d74);color:#fff;border-color:transparent}
.pvw-foot{text-align:center;font-size:11px;color:#8aa39c;padding:8px;background:#fff;font-weight:600}
.pvw-ringing{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:#f6f9f8;position:relative}
.pvw-callicon{font-size:40px;z-index:2}
.pvw-ringtext{color:#5c6b66;font-weight:600;font-size:14px;margin-top:10px}
.pvw-ring{position:absolute;top:calc(50% - 44px);width:80px;height:80px;border-radius:50%;border:3px solid var(--pv-primary,#0d7d74);opacity:.5;animation:pvw-ringpulse 1.6s infinite}
.pvw-ring2{animation-delay:.6s}
@keyframes pvw-ringpulse{0%{transform:scale(.6);opacity:.7}100%{transform:scale(1.6);opacity:0}}
.pvw-wave{display:flex;gap:4px;align-items:flex-end;height:22px;align-self:center;padding:4px}
.pvw-wave span{width:4px;height:8px;background:var(--pv-primary,#0d7d74);border-radius:2px;animation:pvw-wave 1s infinite ease-in-out}
.pvw-wave span:nth-child(2){animation-delay:.15s}.pvw-wave span:nth-child(3){animation-delay:.3s}.pvw-wave span:nth-child(4){animation-delay:.45s}.pvw-wave span:nth-child(5){animation-delay:.6s}
@keyframes pvw-wave{0%,100%{height:7px}50%{height:20px}}
`;
