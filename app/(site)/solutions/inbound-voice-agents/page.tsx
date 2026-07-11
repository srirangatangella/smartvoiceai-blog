import Link from "next/link";
import { CheckCircle2, PhoneIncoming, CalendarCheck, Filter, Headphones, Clock, Share2 } from "lucide-react";
import { buildMetadata, serviceSchema, JsonLd } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import LeadForm from "@/components/LeadForm";

export const metadata = buildMetadata({
  title: "Inbound AI Voice Agents — 24/7 AI Receptionist & Call Answering",
  description:
    "Inbound AI voice agents that answer every call in one ring, qualify callers, book appointments, and route hot leads to your team. A 24/7 AI receptionist for real estate and healthcare. Free demo.",
  path: "/solutions/inbound-voice-agents",
  keywords: [
    "inbound AI voice agent",
    "AI receptionist",
    "AI call answering service",
    "virtual receptionist AI",
    "24/7 AI phone answering",
  ],
});

const faqs = [
  { q: "What is an inbound AI voice agent?", a: "It's an AI that answers your incoming phone calls in a natural, human-sounding voice — handling FAQs, qualifying the caller, booking appointments, and routing hot leads to a human when needed, 24/7." },
  { q: "Can it transfer to a human?", a: "Yes. You define the rules — the agent can warm-transfer to the right person or team, take a message, or book a callback if no one is available." },
  { q: "Does it work with my existing business number?", a: "Yes. We connect it to your existing number (or a new one) via telephony providers like Twilio, so callers just experience faster, always-available service." },
  { q: "How natural does it sound?", a: "Very. Built on VAPI with premium voices and sub-second latency, conversations feel human — try the live demo to hear for yourself." },
];

const features = [
  { icon: PhoneIncoming, title: "Answer in one ring, 24/7", body: "Every call picked up instantly — nights, weekends, and peak times included." },
  { icon: Filter, title: "Qualify & capture", body: "Collects the details you need and captures the lead into your CRM automatically." },
  { icon: CalendarCheck, title: "Book on the call", body: "Checks live availability and books appointments while the caller is on the line." },
  { icon: Share2, title: "Smart routing & transfer", body: "Warm-transfers to the right person, or takes a message and schedules a callback." },
  { icon: Headphones, title: "FAQ handling", body: "Answers your most common questions accurately from an approved knowledge base." },
  { icon: Clock, title: "Zero hold time", body: "No queues, no voicemail — callers get an answer immediately, every time." },
];

export default function InboundPage() {
  return (
    <>
      <JsonLd data={serviceSchema({ name: "Inbound AI Voice Agents", description: metadata.description as string, path: "/solutions/inbound-voice-agents", serviceType: "Inbound AI voice agent / AI receptionist" })} />
      <Breadcrumbs items={[{ name: "Solutions", path: "/solutions/inbound-voice-agents" }, { name: "Inbound Voice Agents", path: "/solutions/inbound-voice-agents" }]} />

      <PageHero
        eyebrow="Inbound"
        title={<>Inbound <span className="gradient-text">AI Voice Agents</span></>}
        description="A 24/7 AI receptionist that answers every call in one ring, qualifies the caller, books appointments, and routes hot leads to your team — so you never lose business to a missed call again."
      />

      <section className="section">
        <div className="section-header">
          <span className="eyebrow">What it does</span>
          <h2>Your always-on front desk</h2>
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
          <h2>Missed calls are missed revenue</h2>
          <p className="lead">Studies show most callers won&apos;t leave a voicemail — they just call a competitor. An inbound agent captures 100% of that demand.</p>
          <ul className="benefit-list">
            <li><CheckCircle2 className="h-5 w-5" /> Never miss a lead, even at 2am</li>
            <li><CheckCircle2 className="h-5 w-5" /> Cut front-desk workload on repetitive calls</li>
            <li><CheckCircle2 className="h-5 w-5" /> Consistent, on-brand answers every time</li>
            <li><CheckCircle2 className="h-5 w-5" /> Full transcripts synced to your CRM</li>
          </ul>
          <div className="mt-6 flex gap-3 flex-wrap">
            <Link href="/industries/real-estate" className="pill">For Real Estate →</Link>
            <Link href="/industries/healthcare" className="pill">For Healthcare →</Link>
          </div>
        </div>
        <div className="split-visual">
          <div className="benefit-list" style={{ gap: 20 }}>
            <div><div className="text-3xl font-extrabold text-primary">1 ring</div><p className="text-sm text-gray-400">average pickup</p></div>
            <div><div className="text-3xl font-extrabold text-primary">0</div><p className="text-sm text-gray-400">missed calls</p></div>
            <div><div className="text-3xl font-extrabold text-primary">24/7/365</div><p className="text-sm text-gray-400">availability</p></div>
          </div>
        </div>
      </section>

      <Faq faqs={faqs} title="Inbound voice agent FAQs" />
      <CtaBand title="Answer every call, automatically" subtitle="Get a free inbound AI voice agent demo for your business." />
      <section className="section" id="contact">
        <div className="form-section">
          <div>
            <span className="eyebrow" style={{ marginBottom: 18 }}>Get started</span>
            <h2 className="text-4xl font-bold leading-[1.1] mb-5">Hear your inbound agent live</h2>
            <p className="text-lg text-gray-400 mb-8">We&apos;ll build a free demo tuned to your business and call flows.</p>
          </div>
          <LeadForm source="Inbound solution page" />
        </div>
      </section>
    </>
  );
}
