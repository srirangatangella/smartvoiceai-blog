import Link from "next/link";
import Image from "next/image";
import {
  Mic,
  LayoutTemplate,
  MessagesSquare,
  MessageCircle,
  PhoneCall,
  ArrowRight,
  Check,
  QrCode,
  type LucideIcon,
} from "lucide-react";
import { services } from "@/lib/site";

const icons: Record<string, LucideIcon> = {
  Mic,
  LayoutTemplate,
  MessagesSquare,
  MessageCircle,
  PhoneCall,
};

export default function ServicesGrid() {
  const featured = services.find((s) => "featured" in s && s.featured);
  const rest = services.filter((s) => s !== featured);

  return (
    <section className="section" id="offerings">
      <div className="section-header">
        <span className="eyebrow">What we build</span>
        <h2>One partner for your whole customer-facing stack</h2>
        <p>From your website to the AI that answers on it — designed to capture every lead, on every channel.</p>
      </div>

      {featured && (
        <div className="svc-featured">
          <div className="svc-featured-text">
            <span className="eyebrow svc-featured-badge">
              <Mic className="h-3.5 w-3.5" /> Signature product
            </span>
            <h3>{featured.title}</h3>
            <p className="svc-featured-tag">{featured.tagline}</p>
            <ul className="svc-points">
              {featured.points.map((pt) => (
                <li key={pt}>
                  <Check className="h-4 w-4" /> {pt}
                </li>
              ))}
            </ul>
            <div className="svc-featured-cta">
              <Link href="/demo?client=apas" className="btn btn-primary">
                <Mic className="h-4 w-4" /> Try it — click &amp; talk
              </Link>
              <Link href={featured.href} className="btn btn-outline">
                How it works <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="svc-qr">
            <div className="svc-qr-card">
              <Image src="/qr-voice.png" alt="Scan to talk to the Smart Voice AI assistant" width={180} height={180} />
            </div>
            <div className="svc-qr-label">
              <QrCode className="h-4 w-4" /> Scan to talk to a live AI — no app, no phone number
            </div>
          </div>
        </div>
      )}

      <div className="svc-grid">
        {rest.map((s) => {
          const Icon = icons[s.icon] || Mic;
          return (
            <Link href={s.href} className="card svc-card" key={s.title}>
              <div className="icon-box">
                <Icon className="h-6 w-6" />
              </div>
              <h3>{s.title}</h3>
              <p className="svc-tag">{s.tagline}</p>
              <ul className="svc-mini-points">
                {s.points.map((pt) => (
                  <li key={pt}>
                    <Check className="h-3.5 w-3.5" /> {pt}
                  </li>
                ))}
              </ul>
              <span className="svc-more">
                Learn more <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
