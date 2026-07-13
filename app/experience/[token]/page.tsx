import Link from "next/link";
import { getExperience } from "@/lib/db";
import ExperienceClient from "@/components/ExperienceClient";

export default async function ExperiencePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const exp = await getExperience(token);

  if (!exp) {
    return (
      <div className="talk-wrap">
        <div className="talk-card">
          <div className="talk-eyebrow">Live voice experience</div>
          <h1 className="talk-title">Link not found</h1>
          <p className="talk-sub">
            This sample link is invalid or has expired. Book a quick call and we&apos;ll set up a fresh one.
          </p>
          <Link href="/contact" className="btn btn-primary talk-btn">
            Book a Consultation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ExperienceClient
      token={token}
      initialAllowed={!exp.used}
      businessName={exp.business_name || ""}
      industry={exp.industry || ""}
    />
  );
}
