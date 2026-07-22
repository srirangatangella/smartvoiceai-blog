import Link from "next/link";
import { getExperience, updateExperienceProfile } from "@/lib/db";
import { getBusinessProfile, exaConfigured } from "@/lib/exa";
import ExperienceClient from "@/components/ExperienceClient";
import PipecatDemo from "@/components/PipecatDemo";

export const dynamic = "force-dynamic";

// India uses our own native-Telugu Pipecat + Sarvam agent when it's configured;
// everyone else (and India before the agent is live) uses the VAPI assistant.
const VOICE_AGENT_URL = process.env.NEXT_PUBLIC_VOICE_AGENT_URL || "";

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

  // Build the business profile once (from their website via Exa), then cache it.
  let profile = exp.profile || "";
  if (!profile && exp.website && !exp.used && exaConfigured()) {
    const result = await getBusinessProfile(exp.website);
    if (result?.profile) {
      profile = result.profile;
      await updateExperienceProfile(token, profile);
    }
  }

  const isIndia = (exp.country || "").toUpperCase() === "IN";
  if (isIndia && VOICE_AGENT_URL) {
    return (
      <PipecatDemo
        token={token}
        businessName={exp.business_name || ""}
        country={exp.country || ""}
      />
    );
  }

  return (
    <ExperienceClient
      token={token}
      initialAllowed={!exp.used}
      businessName={exp.business_name || ""}
      industry={exp.industry || ""}
      profile={profile}
      country={exp.country || ""}
    />
  );
}
