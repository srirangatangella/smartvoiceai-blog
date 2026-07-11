import Link from "next/link";
import { ArrowRight, Mic } from "lucide-react";

export default function PageHero({
  eyebrow,
  title,
  description,
  primaryLabel = "Book a Free Consultation",
  primaryHref = "/contact",
  showDemo = true,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  showDemo?: boolean;
}) {
  return (
    <section className="page-hero">
      <span className="orb orb-primary" style={{ width: 440, height: 440, top: -200, left: "50%", transform: "translateX(-50%)" }} />
      <span className="eyebrow" style={{ marginBottom: 24 }}>
        {eyebrow}
      </span>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="hero-btns">
        <Link href={primaryHref} className="btn btn-primary">
          {primaryLabel} <ArrowRight className="h-4 w-4" />
        </Link>
        {showDemo && (
          <Link href="/demo?client=apas" className="btn btn-outline">
            <Mic className="h-4 w-4" /> Try Live Demo
          </Link>
        )}
      </div>
    </section>
  );
}
