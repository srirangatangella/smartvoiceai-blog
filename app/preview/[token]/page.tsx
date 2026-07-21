import Link from "next/link";
import type { Metadata } from "next";
import { getPreview, updateExperienceProfile } from "@/lib/db";
import { getBusinessProfile, exaConfigured } from "@/lib/exa";
import { siteConfig } from "@/lib/site";
import { industryKind, theme, IMG, PREVIEW_CSS } from "@/lib/preview";
import PreviewWidgets from "@/components/PreviewWidgets";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const p = await getPreview(token).catch(() => null);
  const name = p?.business_name || "Your Business";
  return {
    title: `${name} — website preview`,
    description: `A personalized demo website for ${name} by Smart Voice AI — online booking, an AI chat assistant, WhatsApp, and a 24/7 AI receptionist.`,
    robots: { index: false, follow: false }, // demo pages must never be indexed
    openGraph: {
      title: `${name} — demo website`,
      description: `See how ${name} could book appointments online, chat with AI 24/7, and never miss a call — a free preview by Smart Voice AI.`,
      type: "website",
    },
  };
}

const HOURS = "Mon–Sat, 9:00 AM – 8:00 PM";

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
        <style dangerouslySetInnerHTML={{ __html: PREVIEW_CSS }} />
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

  // Every widget engagement routes to Smart Voice AI (lead capture).
  const svaiWhatsApp = `${siteConfig.whatsapp}?text=${encodeURIComponent(
    `Hi! I saw the demo website for ${name} and I'm interested in a website + the AI features (WhatsApp, chatbot, AI call).`
  )}`;

  return (
    <div
      className="pv-root"
      style={{
        ["--pv-primary" as string]: t.primary,
        ["--pv-primary-d" as string]: t.primaryD,
        ["--pv-accent" as string]: t.accent,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: PREVIEW_CSS }} />

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
            <a href="#blog">Blog</a>
            <a href="#contact">Contact</a>
            {tel && <a href={`tel:${tel}`} className="pv-nav-call">📞 {p.phone}</a>}
            <a href="#contact" className="pv-btn">Book Now</a>
          </nav>
        </div>
      </header>

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
            <a href="#contact" className="pv-btn pv-btn-lg">Book {t.bookLabel === "appointment" ? "an Appointment" : `a ${t.bookLabel.replace(/\b\w/, (c) => c.toUpperCase())}`}</a>
            {tel && <a href={`tel:${tel}`} className="pv-btn pv-btn-lg pv-btn-ghost">📞 Call Now</a>}
          </div>
        </div>
      </section>

      <div className="pv-trust">
        <div className="pv-wrap pv-trust-in">
          {rating != null && <span><b>{rating.toFixed(1)}★</b> Google rating</span>}
          {reviews != null && <span><b>{reviews}+</b> happy customers</span>}
          <span><b>100%</b> satisfaction focus</span>
          <span><b>Easy</b> online booking</span>
        </div>
      </div>

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

      {/* BLOG */}
      <section className="pv-sec pv-gallery-sec" id="blog">
        <div className="pv-wrap">
          <div className="pv-eyebrow">From our blog</div>
          <h2>Tips &amp; insights</h2>
          <p className="pv-sub">Helpful reads from the team at {name}.</p>
          <div className="pv-blog">
            {t.blogs.map((b) => (
              <Link className="pv-bcard" key={b.slug} href={`/preview/${token}/blog/${b.slug}`}>
                <div className="pv-bcover" style={{ backgroundImage: `url(${IMG(b.cover, 900)})` }} />
                <div className="pv-bbody">
                  <div className="pv-bmeta">{b.minutes} min read</div>
                  <h3>{b.title}</h3>
                  <p>{b.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                <li><b>Hours</b> {HOURS}</li>
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

      <PreviewWidgets name={name} bookLabel={t.bookLabel} chips={t.chips} hours={HOURS} svaiWhatsApp={svaiWhatsApp} />
    </div>
  );
}
