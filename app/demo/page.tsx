"use client";

import { useState } from "react";
import Link from "next/link";
import { Mic, Globe, ArrowLeft, ArrowRight, Loader2, Sparkles, Check } from "lucide-react";
import BrandMark from "@/components/BrandMark";

type Kind = "website" | "voice";

const TYPES = [
  "Dental clinic",
  "Medical clinic / Hospital",
  "Real estate",
  "Hotel / hospitality",
  "Gym / fitness",
  "Restaurant / cafe",
  "Other",
];

const empty = { name: "", businessName: "", businessType: "", email: "", phone: "", city: "", website: "", googleLink: "", description: "" };

export default function DemoPage() {
  const [kind, setKind] = useState<Kind | null>(null);
  const [f, setF] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!f.name || !f.businessName || !f.businessType || !f.email) {
      setErr("Please fill in your name, business name, type and email.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, ...f }),
      });
      const d = await r.json();
      if (!r.ok || !d.url) {
        setErr(d.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = d.url;
    } catch {
      setErr("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="demo2">
      <div className="demo2-top">
        <Link href="/" className="demo2-back">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <span className="demo2-brand">
          <span className="nav-logo-mark"><BrandMark className="h-5 w-5" /></span>
          Smart Voice <span className="text-primary font-extrabold">AI</span>
        </span>
      </div>

      {loading && (
        <div className="demo2-loading">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p>{kind === "voice" ? "Warming up your AI receptionist…" : "Building your website…"}</p>
          <span>This takes just a few seconds.</span>
        </div>
      )}

      {!kind ? (
        <div className="demo2-inner">
          <span className="eyebrow" style={{ marginBottom: 16 }}>
            <Sparkles className="inline h-3.5 w-3.5" /> Free live demo
          </span>
          <h1 className="demo2-h1">What would you like to see?</h1>
          <p className="demo2-sub">Pick one and we&apos;ll generate it for your business in seconds — no signup.</p>
          <div className="demo2-choose">
            <button className="demo2-choice" onClick={() => setKind("website")}>
              <span className="demo2-choice-ic"><Globe className="h-7 w-7" /></span>
              <h3>Build my website</h3>
              <p>A modern, ready-to-launch website generated from your business details.</p>
              <span className="demo2-choice-go">Start <ArrowRight className="h-4 w-4" /></span>
            </button>
            <button className="demo2-choice featured" onClick={() => setKind("voice")}>
              <span className="demo2-badge">Signature</span>
              <span className="demo2-choice-ic"><Mic className="h-7 w-7" /></span>
              <h3>Try a voice AI receptionist</h3>
              <p>Talk to a live AI assistant built for your business — right in your browser.</p>
              <span className="demo2-choice-go">Start <ArrowRight className="h-4 w-4" /></span>
            </button>
          </div>
        </div>
      ) : (
        <div className="demo2-inner">
          <button className="demo2-back demo2-back-inline" onClick={() => { setKind(null); setErr(""); }}>
            <ArrowLeft className="h-4 w-4" /> Choose a different demo
          </button>
          <span className="eyebrow" style={{ marginBottom: 14 }}>
            {kind === "voice" ? <><Mic className="inline h-3.5 w-3.5" /> Voice AI demo</> : <><Globe className="inline h-3.5 w-3.5" /> Website demo</>}
          </span>
          <h1 className="demo2-h1">
            {kind === "voice" ? "Let's build your AI receptionist" : "Let's build your website"}
          </h1>
          <p className="demo2-sub">A few quick details and we&apos;ll generate it instantly.</p>

          <form className="demo2-form" onSubmit={submit}>
            <div className="demo2-row">
              <label>Your name *<input value={f.name} onChange={set("name")} placeholder="e.g. Dr. Anita Rao" required /></label>
              <label>Business name *<input value={f.businessName} onChange={set("businessName")} placeholder="e.g. Bright Smile Dental" required /></label>
            </div>
            <div className="demo2-row">
              <label>Business type *
                <select value={f.businessType} onChange={set("businessType")} required>
                  <option value="">Select…</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label>City<input value={f.city} onChange={set("city")} placeholder="e.g. Hyderabad" /></label>
            </div>
            <div className="demo2-row">
              <label>Email *<input type="email" value={f.email} onChange={set("email")} placeholder="you@business.com" required /></label>
              <label>Phone<input value={f.phone} onChange={set("phone")} placeholder="+91 …" /></label>
            </div>
            <label>Website <span className="demo2-opt">(optional — we&apos;ll pull your info from it)</span>
              <input value={f.website} onChange={set("website")} placeholder="yourbusiness.com" />
            </label>
            {kind === "website" && (
              <label>Google Business page <span className="demo2-opt">(optional)</span>
                <input value={f.googleLink} onChange={set("googleLink")} placeholder="Paste your Google Maps / Business link" />
              </label>
            )}
            <label>Or describe your business <span className="demo2-opt">(optional — helps us tailor it)</span>
              <textarea value={f.description} onChange={set("description")} rows={3} placeholder="What you do, your key services, what makes you great…" />
            </label>

            {err && <div className="demo2-err">{err}</div>}

            <button type="submit" className="btn btn-primary demo2-submit" disabled={loading}>
              {kind === "voice" ? <><Mic className="h-4 w-4" /> Generate my AI receptionist</> : <><Sparkles className="h-4 w-4" /> Generate my website</>}
            </button>
            <p className="demo2-fine"><Check className="inline h-3.5 w-3.5 text-primary" /> Free · No signup · Ready in seconds</p>
          </form>
        </div>
      )}
    </div>
  );
}
