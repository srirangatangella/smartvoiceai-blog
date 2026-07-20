import Link from "next/link";
import type { Metadata } from "next";
import { getPreview } from "@/lib/db";
import { siteConfig } from "@/lib/site";
import { industryKind, theme, IMG, PREVIEW_CSS } from "@/lib/preview";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false }, // demo pages must never be indexed
};

export default async function PreviewBlogPost({ params }: { params: Promise<{ token: string; slug: string }> }) {
  const { token, slug } = await params;
  const p = await getPreview(token);
  const t = p ? theme(industryKind(p.industry)) : null;
  const post = t?.blogs.find((b) => b.slug === slug);

  if (!p || !t || !post) {
    return (
      <div className="pv-notfound">
        <style dangerouslySetInnerHTML={{ __html: PREVIEW_CSS }} />
        <div>
          <h1>Article not found</h1>
          <p>This demo link is invalid or has expired.</p>
          <Link href="/contact" className="pv-cta">Get your own site</Link>
        </div>
      </div>
    );
  }

  const name = p.business_name || "Your Business";
  const initial = name.trim().charAt(0).toUpperCase() || "•";
  const year = new Date().getFullYear();
  const fill = (s: string) => s.replaceAll("{business}", name);
  const svaiWhatsApp = `${siteConfig.whatsapp}?text=${encodeURIComponent(
    `Hi! I saw the demo website for ${name} and I'm interested in a website + the AI features.`
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
          <Link href={`/preview/${token}`} className="pv-logo">{initial}</Link>
          <Link href={`/preview/${token}`} className="pv-bname">{name}</Link>
          <nav className="pv-nav">
            <Link href={`/preview/${token}#services`}>Services</Link>
            <Link href={`/preview/${token}#blog`}>Blog</Link>
            <Link href={`/preview/${token}#contact`}>Contact</Link>
            <Link href={`/preview/${token}#contact`} className="pv-btn">Book Now</Link>
          </nav>
        </div>
      </header>

      <article className="pv-article">
        <Link href={`/preview/${token}#blog`} className="pv-artback">← Back to all articles</Link>
        <div className="pv-eyebrow">{t.kicker}</div>
        <h1>{fill(post.title)}</h1>
        <div className="pv-artmeta">{post.minutes} min read · By the team at {name}</div>
        <div className="pv-artcover" style={{ backgroundImage: `url(${IMG(post.cover, 1400)})` }} />
        {post.body.map((para, i) => (
          <p key={i}>{fill(para)}</p>
        ))}
        <div className="pv-artcta">
          <h3>Have a question for {name}?</h3>
          <p>Our team is here to help — reach out and we&apos;ll get back to you quickly.</p>
          <a className="pv-btn pv-btn-lg" href={svaiWhatsApp} target="_blank" rel="noopener noreferrer">Message us</a>
        </div>
      </article>

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
