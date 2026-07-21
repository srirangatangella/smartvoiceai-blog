import { ImageResponse } from "next/og";
import { getPreview } from "@/lib/db";

export const runtime = "nodejs";
export const alt = "Smart Voice AI — personalized demo website";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Rich link-preview card shown when the /preview link is shared (WhatsApp, etc.).
export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const p = await getPreview(token).catch(() => null);
  const name = p?.business_name || "Your Business";
  const rating = p?.rating != null ? Number(p.rating).toFixed(1) : null;
  const reviews = p?.reviews != null ? Number(p.reviews).toLocaleString("en-IN") : null;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%", width: "100%", display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #04101a 0%, #06131a 55%, #041a24 100%)",
          padding: "64px", fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #22d3ee, #3b82f6 55%, #6366f1)", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 5, padding: "0 12px 18px" }}>
            {[13, 23, 33, 23, 13].map((h, i) => (
              <div key={i} style={{ width: 5, height: h, borderRadius: 3, background: "#fff" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, color: "#cfe7ef", fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>
            <span>SMART VOICE</span><span style={{ color: "#22d3ee" }}>AI</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#8fb3c7", fontSize: 26, marginBottom: 10 }}>Personalized demo website for</div>
          <div style={{ color: "#fff", fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 1020 }}>{name}</div>
          {(rating || reviews) && (
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24 }}>
              {rating && <div style={{ display: "flex", background: "#f5a623", color: "#231a00", fontSize: 27, fontWeight: 800, borderRadius: 40, padding: "8px 22px" }}>{`${rating} Google rating`}</div>}
              {reviews && <div style={{ display: "flex", color: "#cfe7ef", fontSize: 26 }}>{`${reviews} reviews`}</div>}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["Book online", "AI chat 24/7", "WhatsApp", "AI receptionist"].map((t) => (
            <div key={t} style={{ color: "#22d3ee", fontSize: 22, border: "1px solid rgba(34,211,238,0.45)", borderRadius: 40, padding: "8px 20px" }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
