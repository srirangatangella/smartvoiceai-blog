import Link from "next/link";
import type { Metadata } from "next";
import { getPreview, updateExperienceProfile } from "@/lib/db";
import { getBusinessProfile, exaConfigured } from "@/lib/exa";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false }, // demo pages must never be indexed
};

/* ── Industry-aware copy so the mock looks tailored even with no website ── */
function industryKind(industry?: string | null): "dental" | "clinic" | "realestate" | "hotel" | "generic" {
  const s = (industry || "").toLowerCase();
  if (s.includes("dental") || s.includes("dentist")) return "dental";
  if (s.includes("hospital") || s.includes("clinic") || s.includes("medical") || s.includes("doctor")) return "clinic";
  if (s.includes("real estate") || s.includes("realtor") || s.includes("propert") || s.includes("builder")) return "realestate";
  if (s.includes("hotel") || s.includes("hospitality") || s.includes("resort")) return "hotel";
  return "generic";
}

function content(kind: ReturnType<typeof industryKind>) {
  switch (kind) {
    case "dental":
      return {
        tagline: "Gentle, expert dental care for your whole family.",
        services: [
          ["Routine Check-ups & Cleaning", "Preventive care that keeps your smile healthy year-round."],
          ["Cosmetic Dentistry", "Whitening, veneers, and smile makeovers by experienced hands."],
          ["Root Canal & Fillings", "Painless, precise treatment using modern techniques."],
          ["Braces & Aligners", "Straighten your teeth with options that fit your lifestyle."],
          ["Implants & Crowns", "Restore missing teeth with natural-looking results."],
          ["Emergency Dental Care", "Same-day relief when you need it most."],
        ],
      };
    case "clinic":
      return {
        tagline: "Trusted, patient-first healthcare close to home.",
        services: [
          ["General Consultation", "Experienced doctors for everyday health concerns."],
          ["Diagnostics & Lab Tests", "Accurate results with quick turnaround."],
          ["Specialist Care", "Access to trusted specialists across fields."],
          ["Preventive Health Checks", "Stay ahead with regular screening packages."],
          ["Vaccination", "Safe, scheduled immunisation for all ages."],
          ["Follow-up Care", "Continuous support through your recovery."],
        ],
      };
    case "realestate":
      return {
        tagline: "Find the right property with a team that knows the market.",
        services: [
          ["Buying Assistance", "Handpicked listings matched to your budget and needs."],
          ["Selling & Valuation", "Get the best price with expert market pricing."],
          ["Rentals & Leasing", "Verified homes and quick, hassle-free move-ins."],
          ["Investment Advisory", "Data-backed guidance on high-growth areas."],
          ["Site Visits", "Guided visits scheduled around you."],
          ["Legal & Documentation", "End-to-end paperwork handled for you."],
        ],
      };
    case "hotel":
      return {
        tagline: "Comfort, warmth, and hospitality you'll remember.",
        services: [
          ["Rooms & Suites", "Comfortable stays for business and leisure."],
          ["Dining", "Fresh, local flavours prepared to delight."],
          ["Events & Banquets", "Perfect venues for every celebration."],
          ["Room Service", "Round-the-clock service at your convenience."],
          ["Conference Facilities", "Well-equipped spaces for your meetings."],
          ["Concierge", "Local expertise to make your stay effortless."],
        ],
      };
    default:
      return {
        tagline: "Quality service and care your customers can count on.",
        services: [
          ["Our Services", "A full range of offerings tailored to your needs."],
          ["Experienced Team", "Skilled professionals dedicated to quality."],
          ["Trusted Locally", "A reputation built on happy customers."],
          ["Fair Pricing", "Transparent, honest value every time."],
          ["Easy Booking", "Reach us in a tap and get seen quickly."],
          ["Customer Support", "We're here whenever you need us."],
        ],
      };
  }
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return <span aria-hidden>{"★★★★★".slice(0, full)}<span className="pv-star-empty">{"★★★★★".slice(full)}</span></span>;
}

export default async function PreviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const p = await getPreview(token);

  if (!p) {
    return (
      <div className="pv-notfound">
        <div>
          <h1>Preview not found</h1>
          <p>This demo link is invalid or has expired.</p>
          <Link href="/contact" className="pv-cta">Get your own site</Link>
        </div>
      </div>
    );
  }

  // Enrich from their real website if we have one (cached once, like /experience).
  let profile = p.profile || "";
  if (!profile && p.website && exaConfigured()) {
    const result = await getBusinessProfile(p.website);
    if (result?.profile) {
      profile = result.profile;
      await updateExperienceProfile(token, profile);
    }
  }

  const name = p.business_name || "Your Business";
  const kind = industryKind(p.industry);
  const c = content(kind);
  const rating = p.rating != null ? Number(p.rating) : null;
  const reviews = p.reviews != null ? Number(p.reviews) : null;
  const initial = name.trim().charAt(0).toUpperCase() || "•";
  const mapQuery = encodeURIComponent(p.address || `${name} ${p.city || ""}`.trim());
  const tel = p.phone ? p.phone.replace(/[^\d+]/g, "") : "";

  return (
    <div className="pv-root">
      <style
        dangerouslySetInnerHTML={{
          __html: `
:root{--pv-primary:#0d7d74;--pv-primary-d:#0a5f58;--pv-ink:#132420;--pv-muted:#5a6b66;--pv-bg:#ffffff;--pv-soft:#f2f7f6;--pv-line:#e2ece9;--pv-gold:#f5a623}
.pv-root{background:var(--pv-bg);color:var(--pv-ink);font-family:var(--font-sans,system-ui,sans-serif);min-height:100vh;width:100%;line-height:1.6}
.pv-root *{box-sizing:border-box}
.pv-ribbon{background:linear-gradient(90deg,#0a5f58,#0d7d74);color:#eafffb;font-size:13.5px;text-align:center;padding:9px 16px}
.pv-ribbon a{color:#fff;font-weight:800;text-decoration:underline;text-underline-offset:2px}
.pv-wrap{max-width:1080px;margin:0 auto;padding:0 22px}
.pv-header{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--pv-line)}
.pv-headin{display:flex;align-items:center;gap:14px;padding:14px 22px;max-width:1080px;margin:0 auto}
.pv-logo{width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,var(--pv-primary),var(--pv-primary-d));color:#fff;display:grid;place-items:center;font-weight:800;font-size:20px;flex:none}
.pv-bname{font-weight:800;font-size:18px;letter-spacing:-.01em}
.pv-nav{margin-left:auto;display:flex;gap:26px;align-items:center}
.pv-nav a{color:var(--pv-muted);text-decoration:none;font-weight:600;font-size:14.5px}
.pv-nav a:hover{color:var(--pv-ink)}
.pv-btn{background:var(--pv-primary);color:#fff;border:0;border-radius:40px;padding:11px 22px;font-weight:800;font-size:14.5px;text-decoration:none;display:inline-block;cursor:pointer;white-space:nowrap}
.pv-btn:hover{background:var(--pv-primary-d)}
.pv-btn-ghost{background:#fff;color:var(--pv-primary);border:1.5px solid var(--pv-primary)}
@media(max-width:720px){.pv-nav a:not(.pv-btn){display:none}}
.pv-hero{background:radial-gradient(1200px 400px at 80% -10%,#e3f4f1,transparent),var(--pv-soft);padding:74px 0 64px}
.pv-hero h1{font-family:var(--font-display,Georgia,serif);font-size:clamp(34px,5vw,56px);line-height:1.06;margin:0 0 16px;letter-spacing:-.02em}
.pv-hero p.lead{font-size:clamp(17px,2.2vw,21px);color:var(--pv-muted);max-width:640px;margin:0 0 26px}
.pv-badges{display:flex;flex-wrap:wrap;gap:14px;margin:0 0 30px;align-items:center}
.pv-rate{display:inline-flex;align-items:center;gap:9px;background:#fff;border:1px solid var(--pv-line);border-radius:40px;padding:8px 16px;font-weight:700;font-size:15px}
.pv-rate .pv-stars{color:var(--pv-gold);letter-spacing:2px;font-size:16px}
.pv-star-empty{color:#d9e3e0}
.pv-heroctas{display:flex;gap:12px;flex-wrap:wrap}
.pv-sec{padding:64px 0}
.pv-sec h2{font-family:var(--font-display,Georgia,serif);font-size:clamp(26px,3.4vw,36px);margin:0 0 10px;letter-spacing:-.01em}
.pv-sec .sub{color:var(--pv-muted);max-width:640px;margin:0 0 38px;font-size:16.5px}
.pv-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
@media(max-width:860px){.pv-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.pv-grid{grid-template-columns:1fr}}
.pv-card{background:#fff;border:1px solid var(--pv-line);border-radius:16px;padding:24px 22px;transition:.15s}
.pv-card:hover{box-shadow:0 10px 30px rgba(13,125,116,.10);transform:translateY(-2px)}
.pv-card .ic{width:42px;height:42px;border-radius:11px;background:var(--pv-soft);color:var(--pv-primary);display:grid;place-items:center;font-size:20px;margin-bottom:14px}
.pv-card h3{margin:0 0 7px;font-size:17.5px}
.pv-card p{margin:0;color:var(--pv-muted);font-size:14.5px}
.pv-about{background:var(--pv-soft)}
.pv-about .box{background:#fff;border:1px solid var(--pv-line);border-radius:18px;padding:34px 32px;max-width:820px}
.pv-stats{display:flex;flex-wrap:wrap;gap:38px;margin-top:30px}
.pv-stat .n{font-family:var(--font-display,Georgia,serif);font-size:34px;font-weight:800;color:var(--pv-primary);line-height:1}
.pv-stat .l{color:var(--pv-muted);font-size:14px;margin-top:4px}
.pv-contact{display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:start}
@media(max-width:760px){.pv-contact{grid-template-columns:1fr}}
.pv-info li{list-style:none;display:flex;gap:12px;padding:11px 0;border-bottom:1px dashed var(--pv-line);font-size:15.5px}
.pv-info li b{color:var(--pv-primary)}
.pv-map{width:100%;min-height:220px;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.08);background:radial-gradient(600px 200px at 30% 0%,#e3f4f1,var(--pv-soft));border:1px solid var(--pv-line);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-decoration:none;color:var(--pv-ink);padding:30px 22px;text-align:center}
.pv-map:hover{border-color:var(--pv-primary)}
.pv-map-pin{font-size:34px}
.pv-map-name{font-weight:800;font-size:17px}
.pv-map-addr{color:var(--pv-muted);font-size:14px;max-width:320px}
.pv-map-link{margin-top:6px;color:var(--pv-primary);font-weight:800;font-size:14.5px}
.pv-footer{background:#0a1a17;color:#cfe4df;padding:40px 0;text-align:center}
.pv-footer .fb{font-weight:800;color:#fff;font-size:18px}
.pv-footer .fm{color:#8fb3ac;font-size:13.5px;margin-top:8px}
.pv-notfound{min-height:100vh;display:grid;place-items:center;background:var(--pv-soft,#f2f7f6);text-align:center;padding:24px;color:#132420}
.pv-notfound h1{font-size:26px;margin:0 0 8px}.pv-notfound p{color:#5a6b66;margin:0 0 18px}
.pv-cta{background:#0d7d74;color:#fff;padding:11px 22px;border-radius:40px;text-decoration:none;font-weight:800}
`,
        }}
      />

      {/* Conversion ribbon — this is the sales hook back to Smart Voice AI */}
      <div className="pv-ribbon">
        ✨ Demo site built for <b>{name}</b> by Smart Voice AI ·{" "}
        <Link href={`${siteConfig.url}/contact`}>Get your real website + 24/7 AI receptionist →</Link>
      </div>

      <header className="pv-header">
        <div className="pv-headin">
          <div className="pv-logo">{initial}</div>
          <div className="pv-bname">{name}</div>
          <nav className="pv-nav">
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#contact" className="pv-btn">Book Appointment</a>
          </nav>
        </div>
      </header>

      <section className="pv-hero">
        <div className="pv-wrap">
          <h1>{name}</h1>
          <p className="lead">{c.tagline}</p>
          <div className="pv-badges">
            {rating != null && (
              <span className="pv-rate">
                <span className="pv-stars"><Stars rating={rating} /></span>
                {rating.toFixed(1)}{reviews != null ? ` · ${reviews} Google reviews` : ""}
              </span>
            )}
            {p.city && <span className="pv-rate">📍 {p.city}</span>}
          </div>
          <div className="pv-heroctas">
            <a href="#contact" className="pv-btn">Book an Appointment</a>
            {tel && <a href={`tel:${tel}`} className="pv-btn pv-btn-ghost">📞 Call Now</a>}
          </div>
        </div>
      </section>

      <section className="pv-sec" id="services">
        <div className="pv-wrap">
          <h2>Our Services</h2>
          <p className="sub">Everything you need, delivered with care and expertise.</p>
          <div className="pv-grid">
            {c.services.map(([title, desc]) => (
              <div className="pv-card" key={title}>
                <div className="ic">✦</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pv-sec pv-about" id="about">
        <div className="pv-wrap">
          <h2>About {name}</h2>
          <div className="box">
            <p style={{ margin: 0, fontSize: "16.5px", color: "var(--pv-muted)" }}>
              {profile ||
                `${name} is a trusted local name${p.city ? ` in ${p.city}` : ""}, known for quality service and a customer-first approach. Our experienced team is committed to giving you the best experience, every visit.`}
            </p>
            <div className="pv-stats">
              {rating != null && (
                <div className="pv-stat"><div className="n">{rating.toFixed(1)}★</div><div className="l">Average rating</div></div>
              )}
              {reviews != null && (
                <div className="pv-stat"><div className="n">{reviews}+</div><div className="l">Happy reviews</div></div>
              )}
              <div className="pv-stat"><div className="n">24/7</div><div className="l">Easy booking</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="pv-sec" id="contact">
        <div className="pv-wrap">
          <h2>Visit or Book With Us</h2>
          <p className="sub">We&apos;d love to see you. Reach out and we&apos;ll get you booked in.</p>
          <div className="pv-contact">
            <div>
              <ul className="pv-info" style={{ padding: 0, margin: "0 0 22px" }}>
                {p.phone && <li><b>Call</b> <a href={`tel:${tel}`} style={{ color: "inherit" }}>{p.phone}</a></li>}
                {p.address && <li><b>Visit</b> {p.address}</li>}
                {p.city && !p.address && <li><b>Area</b> {p.city}</li>}
                <li><b>Hours</b> Mon–Sat, 9:00 AM – 8:00 PM</li>
              </ul>
              <a href={tel ? `tel:${tel}` : "#"} className="pv-btn">Book an Appointment</a>
            </div>
            <a
              className="pv-map"
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="pv-map-pin">📍</span>
              <span className="pv-map-name">{name}</span>
              {p.address && <span className="pv-map-addr">{p.address}</span>}
              <span className="pv-map-link">View on Google Maps →</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="pv-footer">
        <div className="pv-wrap">
          <div className="fb">{name}</div>
          <div className="fm">
            © {new Date().getFullYear()} {name}. Demo website by{" "}
            <a href={siteConfig.url} style={{ color: "#eafffb" }}>Smart Voice AI</a>.
          </div>
        </div>
      </footer>
    </div>
  );
}
