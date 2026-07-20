import Link from "next/link";
import { ArrowRight, Mic } from "lucide-react";

export default function CtaBand({
  title = "Ready to stop losing leads to missed calls?",
  subtitle = "Book a free consultation and we'll build a custom AI assistant demo for your business — no cost, no obligation.",
  primaryLabel = "Book a Free Consultation",
  primaryHref = "/contact",
}: {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
}) {
  return (
    <div className="cta-band">
      <span className="orb orb-primary" style={{ width: 300, height: 300, top: -100, left: -60 }} />
      <span className="orb orb-accent" style={{ width: 260, height: 260, bottom: -100, right: -40 }} />
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <div className="hero-btns">
        <Link href={primaryHref} className="btn btn-primary">
          {primaryLabel} <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/demo" className="btn btn-outline">
          <Mic className="h-4 w-4" /> Try the Live Demo
        </Link>
      </div>
    </div>
  );
}
