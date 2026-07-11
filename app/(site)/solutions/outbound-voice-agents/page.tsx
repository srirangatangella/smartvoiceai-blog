import Link from "next/link";
import { CheckCircle2, PhoneOutgoing, Zap, RefreshCw, CalendarClock, TrendingUp, ListChecks } from "lucide-react";
import { buildMetadata, serviceSchema, JsonLd } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import LeadForm from "@/components/LeadForm";

export const metadata = buildMetadata({
  title: "Outbound AI Voice Agents — Automated Lead Follow-up & Callbacks",
  description:
    "Outbound AI voice agents that call new leads in seconds, follow up with no-shows, and run reactivation campaigns at scale — natural, human-sounding, and synced to your CRM. Free demo.",
  path: "/solutions/outbound-voice-agents",
  keywords: [
    "outbound AI voice agent",
    "AI lead follow-up calls",
    "automated outbound calling",
    "AI cold calling",
    "speed to lead AI",
  ],
});

const faqs = [
  { q: "What can an outbound AI voice agent do?", a: "It places calls automatically — following up new leads within seconds, chasing no-shows and unconfirmed appointments, running reactivation campaigns on old leads, and confirming details — all with natural conversation and CRM logging." },
  { q: "Is automated outbound calling compliant?", a: "We configure campaigns to respect consent, calling-time windows, do-not-call lists, and disclosure requirements for your region. You stay in control of who gets called and when." },
  { q: "Can it hand off interested people to my team?", a: "Yes — when a lead is hot, the agent can warm-transfer to a human, book a meeting, or schedule a callback based on your rules." },
  { q: "How fast can it call a new lead?", a: "Within seconds of the lead hitting your CRM or form. Speed-to-lead is the biggest lever on conversion, and automation makes it instant." },
];

const features = [
  { icon: Zap, title: "Instant speed-to-lead", body: "Calls new leads within seconds of capture — while intent is highest." },
  { icon: RefreshCw, title: "No-show recovery", body: "Chases unconfirmed and missed appointments and offers to reschedule on the spot." },
  { icon: TrendingUp, title: "Lead reactivation", body: "Re-engages aged or cold leads at scale to pull hidden revenue from your database." },
  { icon: CalendarClock, title: "Appointment confirmations", body: "Confirms upcoming appointments and books replacements when someone cancels." },
  { icon: ListChecks, title: "Surveys & feedback", body: "Runs post-visit or post-sale feedback calls and logs structured results." },
  { icon: PhoneOutgoing, title: "Warm transfer", body: "Hands interested prospects to your team the moment they're ready to talk." },
];

export default function OutboundPage() {
  return (
    <>
      <JsonLd data={serviceSchema({ name: "Outbound AI Voice Agents", description: metadata.description as string, path: "/solutions/outbound-voice-agents", serviceType: "Outbound AI voice agent for lead follow-up and reactivation" })} />
      <Breadcrumbs items={[{ name: "Solutions", path: "/solutions/inbound-voice-agents" }, { name: "Outbound Voice Agents", path: "/solutions/outbound-voice-agents" }]} />

      <PageHero
        eyebrow="Outbound"
        title={<>Outbound <span className="gradient-text">AI Voice Agents</span></>}
        description="Follow up every lead in seconds, recover no-shows, and reactivate cold databases — automatically. Human-sounding outbound calling at scale, fully logged to your CRM."
      />

      <section className="section">
        <div className="section-header">
          <span className="eyebrow">What it does</span>
          <h2>Never let a lead go cold</h2>
        </div>
        <div className="grid-3">
          {features.map((f) => (
            <div className="card" key={f.title}>
              <div className="icon-box"><f.icon className="h-6 w-6" /></div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="split">
        <div>
          <h2>The fortune is in the follow-up</h2>
          <p className="lead">Most leads never get a second call. An outbound agent works your pipeline relentlessly and consistently — without burning out your sales team.</p>
          <ul className="benefit-list">
            <li><CheckCircle2 className="h-5 w-5" /> Call leads within seconds, 100% of the time</li>
            <li><CheckCircle2 className="h-5 w-5" /> Recover revenue from no-shows &amp; old leads</li>
            <li><CheckCircle2 className="h-5 w-5" /> Consent-aware, region-compliant campaigns</li>
            <li><CheckCircle2 className="h-5 w-5" /> Every outcome synced to your CRM</li>
          </ul>
          <div className="mt-6 flex gap-3 flex-wrap">
            <Link href="/industries/real-estate" className="pill">For Real Estate →</Link>
            <Link href="/industries/healthcare" className="pill">For Healthcare →</Link>
          </div>
        </div>
        <div className="split-visual">
          <div className="benefit-list" style={{ gap: 20 }}>
            <div><div className="text-3xl font-extrabold text-primary">Seconds</div><p className="text-sm text-gray-400">to first follow-up call</p></div>
            <div><div className="text-3xl font-extrabold text-primary">At scale</div><p className="text-sm text-gray-400">hundreds of calls in parallel</p></div>
            <div><div className="text-3xl font-extrabold text-primary">100%</div><p className="text-sm text-gray-400">of leads worked, consistently</p></div>
          </div>
        </div>
      </section>

      <Faq faqs={faqs} title="Outbound voice agent FAQs" />
      <CtaBand title="Put your follow-up on autopilot" subtitle="Get a free outbound AI voice agent demo for your pipeline." />
      <section className="section" id="contact">
        <div className="form-section">
          <div>
            <span className="eyebrow" style={{ marginBottom: 18 }}>Get started</span>
            <h2 className="text-4xl font-bold leading-[1.1] mb-5">See outbound in action</h2>
            <p className="text-lg text-gray-400 mb-8">We&apos;ll build a free demo campaign tuned to your leads and scripts.</p>
          </div>
          <LeadForm source="Outbound solution page" />
        </div>
      </section>
    </>
  );
}
