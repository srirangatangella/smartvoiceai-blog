import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Smart Voice AI — AI Assistants for Real Estate & Healthcare";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #030305 0%, #06131a 60%, #041a24 100%)",
          padding: "70px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #22d3ee, #3b82f6 55%, #6366f1)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 5,
              padding: "0 13px 22px",
            }}
          >
            {[15, 27, 38, 27, 15].map((h, i) => (
              <div key={i} style={{ width: 5.5, height: h, borderRadius: 3, background: "#fff" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, color: "#fff", fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>
            <span>SMART VOICE</span>
            <span style={{ color: "#22d3ee" }}>AI</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#fff", fontSize: 66, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2 }}>
            AI Assistants for
          </div>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, color: "#00d4ff" }}>
            Real Estate &amp; Healthcare
          </div>
          <div style={{ color: "#a1a1aa", fontSize: 30, marginTop: 24, maxWidth: 900 }}>
            24/7 inbound &amp; outbound calls · Appointment booking · CRM integration
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["AI Receptionist", "US & India", "Book a free demo"].map((t) => (
            <div
              key={t}
              style={{
                color: "#00d4ff",
                fontSize: 24,
                border: "1px solid rgba(0,212,255,0.4)",
                borderRadius: 40,
                padding: "10px 24px",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
