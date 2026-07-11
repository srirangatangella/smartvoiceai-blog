import Link from "next/link";
import {
  CheckCircle2,
  PhoneIncoming,
  CalendarCheck,
  Filter,
  Clock,
  MessageSquare,
  Building2,
} from "lucide-react";
import { buildMetadata, serviceSchema, JsonLd } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import LeadForm from "@/components/LeadForm";

export const metadata = buildMetadata({
  title: "AI Receptionist for Real Estate — Qualify Leads & Book Site Visits",
  description:
    "An AI assistant for real estate that answers every enquiry 24/7, qualifies buyers, answers project FAQs, and books site visits directly into your calendar and CRM. Get a free demo.",
  path: "/industries/real-estate",
  keywords: [
    "AI receptionist for real estate",
    "AI assistant for real estate",
    "real estate lead qualification AI",
    "AI to book site visits",
    "real estate call answering service",
  ],
});

const faqs = [
  {
    q: "How does an AI assistant help a real estate business?",
    a: "It answers every inbound enquiry instantly — 24/7 — qualifies the buyer (budget, location, timeline, configuration), answers questions about your projects, and books site visits directly into your sales team's calendar. No lead ever goes to voicemail again.",
  },
  {
    q: "Can it call leads back automatically (outbound)?",
    a: "Yes. Your assistant can call new portal or ad leads within seconds of them coming in, follow up with people who didn't answer, and re-engage cold leads with reactivation campaigns.",
  },
  {
    q: "Will it integrate with my CRM and portals?",
    a: "We integrate with HubSpot, Salesforce, GoHighLevel, and most real estate CRMs, plus lead sources like your website, Google/Meta ads, and property portals. Every call is logged, transcribed, and synced.",
  },
  {
    q: "Does it work for projects in both the US and India?",
    a: "Yes. We deploy assistants that speak US or Indian English and handle local calling requirements for both markets.",
  },
  {
    q: "Can it show floor plans or project details during a call?",
    a: "On our website and demo experiences, it can display floor plans, master plans, and unit visuals on screen while it talks — exactly what you'll see in the live demo.",
  },
];

const useCases = [
  { icon: Clock, title: "After-hours enquiries", body: "Buyers browse at night. Your assistant answers at 2am, qualifies them, and books the visit while they're still interested." },
  { icon: Filter, title: "Instant lead qualification", body: "Captures budget, configuration, location, and timeline so your sales team only spends time on ready buyers." },
  { icon: CalendarCheck, title: "Site-visit booking", body: "Checks live availability and books the visit into your team's calendar during the call — with automatic reminders." },
  { icon: PhoneIncoming, title: "Portal & ad speed-to-lead", body: "Calls fresh leads within seconds. Speed-to-lead is the single biggest driver of conversion." },
  { icon: MessageSquare, title: "Project FAQs", body: "Answers pricing, amenities, possession dates, and location questions accurately from your approved knowledge base." },
  { icon: Building2, title: "Multi-project routing", body: "Handles multiple projects and routes serious buyers to the right sales manager automatically." },
];

export default function RealEstatePage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "AI Assistants for Real Estate",
          description: metadata.description as string,
          path: "/industries/real-estate",
          serviceType: "Real estate AI assistant for lead qualification and appointment booking",
        })}
      />
      <Breadcrumbs items={[{ name: "Industries", path: "/industries/real-estate" }, { name: "Real Estate", path: "/industries/real-estate" }]} />

      <PageHero
        eyebrow="Real Estate"
        title={
          <>
            AI Assistant for <span className="gradient-text">Real Estate</span>
          </>
        }
        description="Turn missed calls into booked site visits. Our AI assistant answers every buyer enquiry 24/7, qualifies them, and books visits straight into your calendar and CRM — for developers, brokers, and sales teams across the US and India."
      />

      {/* Problem / value split */}
      <section className="split">
        <div>
          <h2>Every missed call is a lost commission</h2>
          <p className="lead">
            Real estate runs on speed. If a buyer calls and reaches voicemail — or waits on hold —
            they call the next listing. Your marketing spend leaks out the bottom of the funnel.
          </p>
          <ul className="benefit-list">
            <li><CheckCircle2 className="h-5 w-5" /> Answer 100% of enquiries, instantly, day or night</li>
            <li><CheckCircle2 className="h-5 w-5" /> Qualify buyers before your team spends a minute</li>
            <li><CheckCircle2 className="h-5 w-5" /> Book more site visits with less follow-up chaos</li>
            <li><CheckCircle2 className="h-5 w-5" /> Every conversation logged and synced to your CRM</li>
          </ul>
        </div>
        <div className="split-visual">
          <div className="benefit-list" style={{ gap: 20 }}>
            <div>
              <div className="text-3xl font-extrabold text-primary">78%</div>
              <p className="text-sm text-gray-400">of buyers go with the business that responds first*</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary">24/7</div>
              <p className="text-sm text-gray-400">coverage — nights, weekends, and campaign spikes</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary">0</div>
              <p className="text-sm text-gray-400">calls sent to voicemail</p>
            </div>
            <p className="text-xs text-gray-600 mt-2">*Industry benchmark; replace with your own metrics.</p>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="section">
        <div className="section-header">
          <span className="eyebrow">Use cases</span>
          <h2>What your real estate assistant handles</h2>
        </div>
        <div className="grid-3">
          {useCases.map((u) => (
            <div className="card" key={u.title}>
              <div className="icon-box">
                <u.icon className="h-6 w-6" />
              </div>
              <h3>{u.title}</h3>
              <p>{u.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Faq faqs={faqs} title="Real estate AI assistant FAQs" />

      {/* Lead form */}
      <section className="section" id="contact">
        <div className="form-section">
          <div>
            <span className="eyebrow" style={{ marginBottom: 18 }}>Get started</span>
            <h2 className="text-4xl font-bold leading-[1.1] mb-5">See it qualify a buyer live</h2>
            <p className="text-lg text-gray-400 mb-8">
              We&apos;ll build a free demo assistant for one of your projects. Talk to it, then decide.
            </p>
            <ul className="benefit-list mb-6">
              <li><CheckCircle2 className="h-5 w-5" /> Custom-scripted for your project &amp; pricing</li>
              <li><CheckCircle2 className="h-5 w-5" /> Books into your real calendar</li>
              <li><CheckCircle2 className="h-5 w-5" /> Live in 1–2 weeks</li>
            </ul>
            <Link href="/demo?client=apas" className="btn btn-outline">Try the live real estate demo</Link>
          </div>
          <LeadForm source="Real Estate page" />
        </div>
      </section>

      <CtaBand
        title="Book more site visits, automatically"
        subtitle="Get a free custom real estate AI assistant demo built for your projects."
      />
    </>
  );
}
