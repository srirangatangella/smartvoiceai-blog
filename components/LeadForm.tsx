"use client";

import React, { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function LeadForm({ source = "Website" }: { source?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    company: "",
    website: "",
    industry: "",
    message: "",
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.id]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", mobile: "", company: "", website: "", industry: "", message: "" });
      } else {
        setStatus("error");
        setErrorMsg(data?.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again or WhatsApp us.");
    }
  };

  if (status === "success") {
    return (
      <div className="form-box text-center">
        <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Request received!</h3>
        <p className="text-gray-400">
          Thanks — our team will reach out within one business day to schedule your free demo.
        </p>
      </div>
    );
  }

  return (
    <div className="form-box">
      <form onSubmit={onSubmit} noValidate>
        <div className="input-group">
          <label htmlFor="name">Full Name *</label>
          <input id="name" type="text" value={form.name} onChange={onChange} placeholder="Jane Doe" required />
        </div>
        <div className="input-group">
          <label htmlFor="email">Business Email *</label>
          <input id="email" type="email" value={form.email} onChange={onChange} placeholder="jane@company.com" required />
        </div>
        <div className="input-group">
          <label htmlFor="mobile">Phone / WhatsApp *</label>
          <input id="mobile" type="tel" value={form.mobile} onChange={onChange} placeholder="+1 555 000 1234" required />
        </div>
        <div className="input-group">
          <label htmlFor="company">Company</label>
          <input id="company" type="text" value={form.company} onChange={onChange} placeholder="Company name" />
        </div>
        <div className="input-group">
          <label htmlFor="industry">Industry</label>
          <select id="industry" value={form.industry} onChange={onChange}>
            <option value="">Select…</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Healthcare / Clinic">Healthcare / Clinic</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="message">What would you like the agent to do?</label>
          <textarea
            id="message"
            value={form.message}
            onChange={onChange}
            placeholder="e.g. Answer inbound calls, qualify leads, and book site visits"
            rows={3}
            style={{
              width: "100%",
              padding: "16px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              borderRadius: "12px",
              fontFamily: "inherit",
              fontSize: "16px",
              resize: "vertical",
            }}
          />
        </div>

        <button type="submit" className="submit-btn disabled:opacity-70 disabled:cursor-not-allowed" disabled={status === "loading"}>
          {status === "loading" ? (
            <span className="inline-flex items-center gap-2 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </span>
          ) : (
            "Get My Free Demo"
          )}
        </button>

        {status === "error" && (
          <p className="flex items-center gap-2 justify-center text-center mt-4 text-red-400 font-semibold">
            <AlertCircle className="h-4 w-4" /> {errorMsg}
          </p>
        )}
        <p className="text-center mt-4 text-xs text-gray-500">
          No spam. We reply within one business day. Your details stay private.
        </p>
      </form>
    </div>
  );
}
