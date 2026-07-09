"use client";

import React, { useState } from "react";
import { Mail, Check, AlertCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Subscribed successfully!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription failed. Please check your email.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="bg-[#0c0c12] border border-white/10 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto my-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <h3 className="font-serif text-3xl font-bold mb-3">Stay ahead of the curve</h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Join our newsletter to receive the latest insights, case studies, and tutorials about AI Voice Agents and business automation.
      </p>

      {status === "success" ? (
        <div className="flex flex-col items-center justify-center gap-3 text-primary animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="h-6 w-6 text-primary" />
          </div>
          <p className="font-semibold text-lg">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              disabled={status === "loading"}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:border-primary text-white placeholder-gray-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn btn-primary justify-center py-4 px-8 text-base font-bold whitespace-nowrap rounded-xl transition-all duration-300 pointer-events-auto"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <div className="flex items-center justify-center gap-2 text-red-500 mt-4 font-semibold text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
