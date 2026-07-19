import Link from "next/link";
import type { Metadata } from "next";
import { getPreview, updateExperienceProfile } from "@/lib/db";
import { getBusinessProfile, exaConfigured } from "@/lib/exa";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false }, // demo pages must never be indexed
};

type Kind = "dental" | "clinic" | "realestate" | "hotel" | "gym" | "generic";

function industryKind(industry?: string | null): Kind {
  const s = (industry || "").toLowerCase();
  if (s.includes("dental") || s.includes("dentist")) return "dental";
  if (s.includes("hospital") || s.includes("clinic") || s.includes("medical") || s.includes("doctor")) return "clinic";
  if (s.includes("real estate") || s.includes("realtor") || s.includes("propert") || s.includes("builder")) return "realestate";
  if (s.includes("hotel") || s.includes("hospitality") || s.includes("resort")) return "hotel";
  if (s.includes("gym") || s.includes("fitness") || s.includes("yoga") || s.includes("crossfit")) return "gym";
  return "generic";
}

const IMG = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

/* Verified Unsplash image sets + colour theme + copy per industry. */
function theme(kind: Kind) {
  const T = {
    dental: {
      primary: "#0ea5a4", primaryD: "#0b6b66", accent: "#f4b740",
      hero: "1629909613654-28e377c37b09",
      gallery: ["1588776814546-1ffcf47267a5", "1606811841689-23dfddce3e95", "1609840114035-3c981b782dfe"],
      kicker: "Trusted Dental Care",
      tagline: "Gentle, expert dentistry for your whole family — with a smile.",
      services: [
        ["🦷", "Check-ups & Cleaning", "Preventive care that keeps your smile healthy year-round."],
        ["✨", "Cosmetic Dentistry", "Whitening, veneers and smile makeovers by experienced hands."],
        ["🩹", "Root Canal & Fillings", "Painless, precise treatment with modern techniques."],
        ["😁", "Braces & Aligners", "Straighten your teeth with options that fit your lifestyle."],
        ["🦿", "Implants & Crowns", "Restore missing teeth with natural-looking results."],
        ["🚨", "Emergency Care", "Same-day relief when you need it most."],
      ],
      why: [
        ["👩‍⚕️", "Experienced dentists", "A caring team with years of clinical expertise."],
        ["🧼", "Strict hygiene", "Sterile, modern equipment for your safety."],
        ["💳", "Easy payment plans", "Flexible options and insurance accepted."],
        ["📅", "Same-day booking", "Get seen quickly — even for emergencies."],
      ],
      testimonials: [
        ["Painless root canal and the friendliest staff I've ever met. Highly recommend!", "Priya S."],
        ["Booked online in seconds and my whole family now comes here. Spotless clinic.", "Rahul M."],
      ],
    },
    clinic: {
      primary: "#2563eb", primaryD: "#1e40af", accent: "#38bdf8",
      hero: "1519494026892-80bbd2d6fd0d",
      gallery: ["1631217868264-e5b90bb7e133", "1666214280557-f1b5022eb634", "1606811841689-23dfddce3e95"],
      kicker: "Patient-First Healthcare",
      tagline: "Trusted, compassionate care close to home.",
      services: [
        ["🩺", "General Consultation", "Experienced doctors for everyday health concerns."],
        ["🧪", "Diagnostics & Labs", "Accurate results with quick turnaround."],
        ["👨‍⚕️", "Specialist Care", "Access trusted specialists across fields."],
        ["🛡️", "Health Check-ups", "Stay ahead with regular screening packages."],
        ["💉", "Vaccination", "Safe, scheduled immunisation for all ages."],
        ["🔄", "Follow-up Care", "Continuous support through your recovery."],
      ],
      why: [
        ["👨‍⚕️", "Qualified doctors", "A team you can trust with your health."],
        ["⏱️", "Minimal wait times", "Smart scheduling that respects your time."],
        ["🧼", "Clean & safe", "Rigorous hygiene and modern facilities."],
        ["📅", "Same-day slots", "Book online in seconds, any day."],
      ],
      testimonials: [
        ["Caring doctors and hardly any waiting. Finally a clinic that respects my time.", "Anjali R."],
        ["Got my reports the same day. Professional and genuinely kind staff.", "Karthik V."],
      ],
    },
    realestate: {
      primary: "#14284a", primaryD: "#0d1b33", accent: "#c9a24b",
      hero: "1600585154340-be6161a56a0c",
      gallery: ["1564013799919-ab600027ffc6", "1512917774080-9991f1c4c750", "1600607687939-ce8a6c25118c"],
      kicker: "Your Property Partner",
      tagline: "Find the right home with a team that knows the market.",
      services: [
        ["🏡", "Buying Assistance", "Handpicked listings matched to your budget."],
        ["📈", "Selling & Valuation", "Get the best price with expert market pricing."],
        ["🔑", "Rentals & Leasing", "Verified homes and quick, hassle-free move-ins."],
        ["💼", "Investment Advisory", "Data-backed guidance on high-growth areas."],
        ["🚗", "Site Visits", "Guided visits scheduled around you."],
        ["📄", "Legal & Docs", "End-to-end paperwork handled for you."],
      ],
      why: [
        ["🏆", "Local experts", "Deep knowledge of every neighbourhood."],
        ["✅", "Verified listings", "No fake photos, no surprises."],
        ["🤝", "Honest guidance", "Advice that puts you first, not the sale."],
        ["⚡", "Fast closings", "We handle the paperwork end to end."],
      ],
      testimonials: [
        ["They found us our dream home in two weeks and handled every document. Effortless.", "Sneha & Arun"],
        ["Sold my flat above asking price. Transparent and professional throughout.", "Mohan K."],
      ],
    },
    hotel: {
      primary: "#a67c34", primaryD: "#7a5a24", accent: "#c9a24b",
      hero: "1566073771259-6a8506099945",
      gallery: ["1571896349842-33c89424de2d", "1551882547-ff40c63fe5fa", "1540541338287-41700207dee6"],
      kicker: "Warm Hospitality",
      tagline: "Comfort, warmth and hospitality you'll remember.",
      services: [
        ["🛏️", "Rooms & Suites", "Comfortable stays for business and leisure."],
        ["🍽️", "Fine Dining", "Fresh, local flavours prepared to delight."],
        ["🎉", "Events & Banquets", "Perfect venues for every celebration."],
        ["🛎️", "Room Service", "Round-the-clock service at your convenience."],
        ["💼", "Conferences", "Well-equipped spaces for your meetings."],
        ["🧭", "Concierge", "Local expertise to make your stay effortless."],
      ],
      why: [
        ["⭐", "Rated by guests", "Consistently loved for service and comfort."],
        ["📍", "Prime location", "Close to everything that matters."],
        ["🧑‍🍳", "Great dining", "A kitchen that delights every palate."],
        ["🕛", "24/7 service", "We're here whenever you need us."],
      ],
      testimonials: [
        ["Spotless rooms, warm staff and incredible food. We'll be back every trip.", "Deepa N."],
        ["Perfect venue for our event — seamless service from start to finish.", "Vikram T."],
      ],
    },
    gym: {
      primary: "#ea580c", primaryD: "#c2410c", accent: "#84cc16",
      hero: "1534438327276-14e5300c3a48",
      gallery: ["1571019613454-1cb2f99b2d8b", "1534258936925-c58bed479fcb", "1517836357463-d25dfeac3438"],
      kicker: "Train Harder. Feel Better.",
      tagline: "Your goals, our mission — let's get you there.",
      services: [
        ["🏋️", "Strength Training", "Expert-guided workouts to build real strength."],
        ["🔥", "HIIT & Cardio", "High-energy sessions that burn and build."],
        ["🧘", "Yoga & Mobility", "Balance, flexibility and recovery."],
        ["🥗", "Nutrition Coaching", "Fuel your progress with a real plan."],
        ["👥", "Personal Training", "One-on-one coaching tailored to you."],
        ["💪", "Group Classes", "Train together, stay motivated."],
      ],
      why: [
        ["🏅", "Certified trainers", "Real coaches who care about results."],
        ["🕕", "Open early & late", "Fits around your schedule, not ours."],
        ["🧼", "Clean equipment", "Modern gear, always maintained."],
        ["🎯", "Real results", "Plans built around your goals."],
      ],
      testimonials: [
        ["Lost 8kg in three months with their trainers. Best decision I've made.", "Aditya P."],
        ["Amazing energy, clean equipment and coaches who actually push you.", "Meera J."],
      ],
    },
    generic: {
      primary: "#0d7d74", primaryD: "#0a5f58", accent: "#f4b740",
      hero: "1497366216548-37526070297c",
      gallery: ["1600880292203-757bb62b4baf", "1600585154340-be6161a56a0c", "1497366216548-37526070297c"],
      kicker: "Quality You Can Trust",
      tagline: "Service and care your customers can count on.",
      services: [
        ["✦", "Our Services", "A full range of offerings tailored to your needs."],
        ["👥", "Expert Team", "Skilled professionals dedicated to quality."],
        ["📍", "Trusted Locally", "A reputation built on happy customers."],
        ["💳", "Fair Pricing", "Transparent, honest value every time."],
        ["📱", "Easy Booking", "Reach us in a tap and get seen quickly."],
        ["💬", "Great Support", "We're here whenever you need us."],
      ],
      why: [
        ["🏆", "Trusted locally", "A name your neighbours recommend."],
        ["⚡", "Quick service", "Fast, friendly and reliable."],
        ["🤝", "Customer-first", "Your satisfaction is our priority."],
        ["📅", "Easy to reach", "Book or call in seconds."],
      ],
      testimonials: [
        ["Fantastic service and lovely people. Couldn't ask for more.", "A happy customer"],
        ["Reliable, professional and always friendly. Highly recommend.", "Local regular"],
      ],
    },
  } as const;
  return T[kind];
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span aria-hidden>
      {"★★★★★".slice(0, full)}
      <span className="pv-star-empty">{"★★★★★".slice(full)}</span>
    </span>
  );
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
  const t = theme(kind);
  const rating = p.rating != null ? Number(p.rating) : null;
  const reviews = p.reviews != null ? Number(p.reviews) : null;
  const initial = name.trim().charAt(0).toUpperCase() || "•";
  const mapQuery = encodeURIComponent(p.address || `${name} ${p.city || ""}`.trim());
  const tel = p.phone ? p.phone.replace(/[^\d+]/g, "") : "";
  const year = new Date().getFullYear();

  return (
    <div
      className="pv-root"
      style={{
        // theme tokens
        ["--pv-primary" as string]: t.primary,
        ["--pv-primary-d" as string]: t.primaryD,
        ["--pv-accent" as string]: t.accent,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Conversion ribbon — sales hook back to Smart Voice AI */}
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
            <a href="#gallery">Gallery</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            {tel && <a href={`tel:${tel}`} className="pv-nav-call">📞 {p.phone}</a>}
            <a href="#contact" className="pv-btn">Book Now</a>
          </nav>
        </div>
      </header>

      {/* HERO — full-bleed image + overlay */}
      <section className="pv-hero" style={{ backgroundImage: `url(${IMG(t.hero, 2000)})` }}>
        <div className="pv-hero-overlay" />
        <div className="pv-wrap pv-hero-in">
          <div className="pv-kicker">{t.kicker}</div>
          <h1>{name}</h1>
          <p className="pv-lead">{t.tagline}</p>
          <div className="pv-badges">
            {rating != null && (
              <span className="pv-rate">
                <span className="pv-stars"><Stars rating={rating} /></span>
                <b>{rating.toFixed(1)}</b>{reviews != null ? ` · ${reviews} Google reviews` : ""}
              </span>
            )}
            {p.city && <span className="pv-chip">📍 {p.city}</span>}
            <span className="pv-chip">🕒 Open Mon–Sat</span>
          </div>
          <div className="pv-heroctas">
            <a href="#contact" className="pv-btn pv-btn-lg">Book an Appointment</a>
            {tel && <a href={`tel:${tel}`} className="pv-btn pv-btn-lg pv-btn-ghost">📞 Call Now</a>}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="pv-trust">
        <div className="pv-wrap pv-trust-in">
          {rating != null && <span><b>{rating.toFixed(1)}★</b> Google rating</span>}
          {reviews != null && <span><b>{reviews}+</b> happy customers</span>}
          <span><b>100%</b> satisfaction focus</span>
          <span><b>Easy</b> online booking</span>
        </div>
      </div>

      {/* SERVICES */}
      <section className="pv-sec" id="services">
        <div className="pv-wrap">
          <div className="pv-eyebrow">What we offer</div>
          <h2>Our Services</h2>
          <p className="pv-sub">Everything you need, delivered with care and expertise.</p>
          <div className="pv-grid">
            {t.services.map(([icon, title, desc]) => (
              <div className="pv-card" key={title}>
                <div className="pv-ic">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="pv-sec pv-gallery-sec" id="gallery">
        <div className="pv-wrap">
          <div className="pv-eyebrow">A look inside</div>
          <h2>Gallery</h2>
          <div className="pv-gallery">
            {t.gallery.map((id, i) => (
              <div className="pv-gitem" key={id} style={{ backgroundImage: `url(${IMG(id, 1000)})` }} data-i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="pv-sec">
        <div className="pv-wrap">
          <div className="pv-eyebrow">Why choose us</div>
          <h2>Reasons customers love {name}</h2>
          <div className="pv-why">
            {t.why.map(([icon, title, text]) => (
              <div className="pv-whycard" key={title}>
                <div className="pv-whyic">{icon}</div>
                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="pv-sec pv-about" id="about">
        <div className="pv-wrap pv-about-in">
          <div className="pv-about-img" style={{ backgroundImage: `url(${IMG(t.gallery[0], 1200)})` }} />
          <div className="pv-about-txt">
            <div className="pv-eyebrow">About us</div>
            <h2>About {name}</h2>
            <p>
              {profile ||
                `${name} is a trusted local name${p.city ? ` in ${p.city}` : ""}, known for quality service and a genuine, customer-first approach. Our experienced team is committed to giving you the best experience, every single visit.`}
            </p>
            <div className="pv-stats">
              {rating != null && <div className="pv-stat"><div className="n">{rating.toFixed(1)}★</div><div className="l">Average rating</div></div>}
              {reviews != null && <div className="pv-stat"><div className="n">{reviews}+</div><div className="l">Happy reviews</div></div>}
              <div className="pv-stat"><div className="n">24/7</div><div className="l">Easy booking</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="pv-sec">
        <div className="pv-wrap">
          <div className="pv-eyebrow">Kind words</div>
          <h2>What people say</h2>
          <div className="pv-tgrid">
            {t.testimonials.map(([quote, author]) => (
              <figure className="pv-quote" key={author}>
                <div className="pv-qstars">★★★★★</div>
                <blockquote>“{quote}”</blockquote>
                <figcaption>— {author}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="pv-cta-band">
        <div className="pv-wrap pv-cta-in">
          <h2>Ready to book with {name}?</h2>
          <p>We&apos;d love to see you. Reach out and we&apos;ll get you booked in.</p>
          <div className="pv-heroctas">
            <a href="#contact" className="pv-btn pv-btn-lg pv-btn-on-dark">Book an Appointment</a>
            {tel && <a href={`tel:${tel}`} className="pv-btn pv-btn-lg pv-btn-ghost-dark">📞 {p.phone}</a>}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="pv-sec" id="contact">
        <div className="pv-wrap">
          <div className="pv-eyebrow">Get in touch</div>
          <h2>Visit or Book With Us</h2>
          <div className="pv-contact">
            <div>
              <ul className="pv-info">
                {p.phone && <li><b>Call</b> <a href={`tel:${tel}`}>{p.phone}</a></li>}
                {p.address && <li><b>Visit</b> {p.address}</li>}
                {p.city && !p.address && <li><b>Area</b> {p.city}</li>}
                <li><b>Hours</b> Mon–Sat, 9:00 AM – 8:00 PM</li>
              </ul>
              <a href={tel ? `tel:${tel}` : "#"} className="pv-btn pv-btn-lg">Book an Appointment</a>
            </div>
            <a className="pv-map" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer">
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
            © {year} {name}. Demo website by{" "}
            <a href={siteConfig.url}>Smart Voice AI</a>.
          </div>
        </div>
      </footer>
    </div>
  );
}

const CSS = `
.pv-root{--pv-ink:#16231f;--pv-muted:#5c6b66;--pv-bg:#fff;--pv-soft:#f4f8f7;--pv-line:#e6edeb;background:var(--pv-bg);color:var(--pv-ink);font-family:var(--font-sans,system-ui,sans-serif);min-height:100vh;line-height:1.6}
.pv-root *{box-sizing:border-box}
.pv-wrap{max-width:1120px;margin:0 auto;padding:0 22px}
.pv-ribbon{background:linear-gradient(90deg,var(--pv-primary-d),var(--pv-primary));color:#fff;font-size:13.5px;text-align:center;padding:9px 16px}
.pv-ribbon a{color:#fff;font-weight:800;text-decoration:underline;text-underline-offset:2px}
.pv-header{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--pv-line)}
.pv-headin{display:flex;align-items:center;gap:14px;padding:13px 22px;max-width:1120px;margin:0 auto}
.pv-logo{width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,var(--pv-primary),var(--pv-primary-d));color:#fff;display:grid;place-items:center;font-weight:800;font-size:20px;flex:none}
.pv-bname{font-weight:800;font-size:18px;letter-spacing:-.01em}
.pv-nav{margin-left:auto;display:flex;gap:24px;align-items:center}
.pv-nav a{color:var(--pv-muted);text-decoration:none;font-weight:600;font-size:14.5px}
.pv-nav a:hover{color:var(--pv-ink)}
.pv-nav-call{color:var(--pv-primary)!important}
.pv-btn{background:var(--pv-primary);color:#fff;border:0;border-radius:40px;padding:11px 22px;font-weight:800;font-size:14.5px;text-decoration:none;display:inline-block;cursor:pointer;white-space:nowrap;transition:.15s}
.pv-btn:hover{background:var(--pv-primary-d);transform:translateY(-1px)}
.pv-btn-lg{padding:15px 30px;font-size:16px;border-radius:44px}
.pv-btn-ghost{background:rgba(255,255,255,.12);color:#fff;border:1.5px solid rgba(255,255,255,.65);backdrop-filter:blur(4px)}
.pv-btn-ghost:hover{background:rgba(255,255,255,.2)}
@media(max-width:820px){.pv-nav a:not(.pv-btn){display:none}}
/* HERO */
.pv-hero{position:relative;background-size:cover;background-position:center;color:#fff;padding:120px 0 96px;overflow:hidden}
.pv-hero-overlay{position:absolute;inset:0;background:linear-gradient(120deg,rgba(8,16,14,.82),rgba(8,16,14,.45) 60%,rgba(8,16,14,.25))}
.pv-hero-in{position:relative}
.pv-kicker{display:inline-block;background:var(--pv-accent);color:#231a00;font-weight:800;font-size:12.5px;letter-spacing:.08em;text-transform:uppercase;padding:6px 14px;border-radius:40px;margin-bottom:18px}
.pv-hero h1{font-family:var(--font-display,Georgia,serif);font-size:clamp(38px,6vw,66px);line-height:1.04;margin:0 0 16px;letter-spacing:-.02em;text-shadow:0 2px 30px rgba(0,0,0,.3)}
.pv-lead{font-size:clamp(17px,2.3vw,23px);max-width:620px;margin:0 0 26px;color:#eef4f2}
.pv-badges{display:flex;flex-wrap:wrap;gap:12px;margin:0 0 30px;align-items:center}
.pv-rate{display:inline-flex;align-items:center;gap:9px;background:rgba(255,255,255,.95);color:var(--pv-ink);border-radius:40px;padding:9px 18px;font-weight:600;font-size:15px}
.pv-rate b{font-weight:800}
.pv-rate .pv-stars{color:var(--pv-accent);letter-spacing:2px;font-size:16px}
.pv-star-empty{opacity:.35}
.pv-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.28);border-radius:40px;padding:9px 16px;font-weight:600;font-size:14px}
.pv-heroctas{display:flex;gap:13px;flex-wrap:wrap}
/* TRUST */
.pv-trust{background:var(--pv-primary-d);color:#fff}
.pv-trust-in{display:flex;flex-wrap:wrap;gap:14px 40px;justify-content:center;padding:18px 22px;font-size:15px}
.pv-trust b{color:var(--pv-accent);font-weight:800}
/* SECTIONS */
.pv-sec{padding:70px 0}
.pv-eyebrow{color:var(--pv-primary);font-weight:800;font-size:13px;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px}
.pv-sec h2{font-family:var(--font-display,Georgia,serif);font-size:clamp(28px,3.6vw,40px);margin:0 0 10px;letter-spacing:-.01em}
.pv-sub{color:var(--pv-muted);max-width:640px;margin:0 0 38px;font-size:16.5px}
.pv-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
@media(max-width:860px){.pv-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.pv-grid{grid-template-columns:1fr}}
.pv-card{background:#fff;border:1px solid var(--pv-line);border-radius:18px;padding:26px 24px;transition:.18s}
.pv-card:hover{box-shadow:0 18px 40px rgba(16,80,72,.12);transform:translateY(-4px);border-color:transparent}
.pv-ic{width:52px;height:52px;border-radius:14px;background:var(--pv-soft);display:grid;place-items:center;font-size:26px;margin-bottom:15px}
.pv-card h3{margin:0 0 7px;font-size:18px}
.pv-card p{margin:0;color:var(--pv-muted);font-size:14.5px}
/* GALLERY */
.pv-gallery-sec{background:var(--pv-soft)}
.pv-gallery{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:200px 200px;gap:14px}
.pv-gitem{border-radius:16px;background-size:cover;background-position:center;box-shadow:0 8px 24px rgba(0,0,0,.08)}
.pv-gitem[data-i="0"]{grid-row:1/3}
@media(max-width:700px){.pv-gallery{grid-template-columns:1fr 1fr;grid-template-rows:160px 160px}.pv-gitem[data-i="0"]{grid-row:auto;grid-column:1/3}}
/* WHY */
.pv-why{display:grid;grid-template-columns:1fr 1fr;gap:18px}
@media(max-width:700px){.pv-why{grid-template-columns:1fr}}
.pv-whycard{display:flex;gap:16px;background:#fff;border:1px solid var(--pv-line);border-radius:16px;padding:22px}
.pv-whyic{width:48px;height:48px;flex:none;border-radius:12px;background:var(--pv-soft);display:grid;place-items:center;font-size:24px}
.pv-whycard h4{margin:0 0 4px;font-size:17px}
.pv-whycard p{margin:0;color:var(--pv-muted);font-size:14.5px}
/* ABOUT */
.pv-about{background:var(--pv-soft)}
.pv-about-in{display:grid;grid-template-columns:1fr 1.1fr;gap:44px;align-items:center}
@media(max-width:820px){.pv-about-in{grid-template-columns:1fr;gap:28px}}
.pv-about-img{min-height:340px;border-radius:20px;background-size:cover;background-position:center;box-shadow:0 20px 50px rgba(0,0,0,.14)}
.pv-about-txt p{color:var(--pv-muted);font-size:16.5px}
.pv-stats{display:flex;flex-wrap:wrap;gap:34px;margin-top:26px}
.pv-stat .n{font-family:var(--font-display,Georgia,serif);font-size:34px;font-weight:800;color:var(--pv-primary);line-height:1}
.pv-stat .l{color:var(--pv-muted);font-size:13.5px;margin-top:4px}
/* TESTIMONIALS */
.pv-tgrid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:700px){.pv-tgrid{grid-template-columns:1fr}}
.pv-quote{margin:0;background:#fff;border:1px solid var(--pv-line);border-radius:18px;padding:28px 26px}
.pv-qstars{color:var(--pv-accent);letter-spacing:2px;font-size:17px;margin-bottom:10px}
.pv-quote blockquote{margin:0 0 12px;font-size:17px;line-height:1.55}
.pv-quote figcaption{color:var(--pv-muted);font-weight:700;font-size:14.5px}
/* CTA BAND */
.pv-cta-band{background:linear-gradient(120deg,var(--pv-primary),var(--pv-primary-d));color:#fff;padding:64px 0;text-align:center}
.pv-cta-in h2{font-family:var(--font-display,Georgia,serif);font-size:clamp(26px,3.6vw,40px);margin:0 0 8px}
.pv-cta-in p{margin:0 0 24px;font-size:17px;opacity:.92}
.pv-cta-in .pv-heroctas{justify-content:center}
.pv-btn-on-dark{background:#fff;color:var(--pv-primary-d)}
.pv-btn-on-dark:hover{background:#fff;opacity:.92}
.pv-btn-ghost-dark{background:rgba(255,255,255,.12);color:#fff;border:1.5px solid rgba(255,255,255,.6)}
/* CONTACT */
.pv-contact{display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:start}
@media(max-width:760px){.pv-contact{grid-template-columns:1fr}}
.pv-info{list-style:none;padding:0;margin:0 0 22px}
.pv-info li{display:flex;gap:12px;padding:12px 0;border-bottom:1px dashed var(--pv-line);font-size:15.5px}
.pv-info li b{color:var(--pv-primary);min-width:52px}
.pv-info a{color:inherit}
.pv-map{min-height:240px;border-radius:18px;border:1px solid var(--pv-line);background:radial-gradient(600px 220px at 30% 0%,var(--pv-soft),#fff);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-decoration:none;color:var(--pv-ink);padding:32px 22px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.06)}
.pv-map:hover{border-color:var(--pv-primary)}
.pv-map-pin{font-size:36px}
.pv-map-name{font-weight:800;font-size:17px}
.pv-map-addr{color:var(--pv-muted);font-size:14px;max-width:320px}
.pv-map-link{margin-top:6px;color:var(--pv-primary);font-weight:800;font-size:14.5px}
/* FOOTER */
.pv-footer{background:#0c1512;color:#cfe0db;padding:40px 0;text-align:center}
.pv-footer .fb{font-weight:800;color:#fff;font-size:18px}
.pv-footer .fm{color:#8fb0a8;font-size:13.5px;margin-top:8px}
.pv-footer a{color:#eafaf6}
/* NOT FOUND */
.pv-notfound{min-height:100vh;display:grid;place-items:center;background:#f4f8f7;text-align:center;padding:24px;color:#16231f}
.pv-notfound h1{font-size:26px;margin:0 0 8px}.pv-notfound p{color:#5c6b66;margin:0 0 18px}
.pv-cta{background:#0d7d74;color:#fff;padding:12px 24px;border-radius:40px;text-decoration:none;font-weight:800}
`;
