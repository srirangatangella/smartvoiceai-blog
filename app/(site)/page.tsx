import Link from "next/link";
import {
  ArrowRight,
  Mic,
  Phone,
  Building2,
  Stethoscope,
  Sparkles,
  Mail,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { buildMetadata, serviceSchema, JsonLd } from "@/lib/seo";
import { siteConfig, homeFaqs } from "@/lib/site";
import CapabilitiesGrid from "@/components/CapabilitiesGrid";
import TrustBar from "@/components/TrustBar";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import LeadForm from "@/components/LeadForm";

export const metadata = buildMetadata({
  title: "AI Voice Agents for Real Estate & Healthcare",
  description:
    "Smart Voice AI builds custom AI voice agents on VAPI for real estate and healthcare businesses in the US & India — 24/7 inbound & outbound calls, appointment booking, and CRM integration. Book a free demo.",
  path: "/",
  keywords: [
    "AI voice agents",
    "AI receptionist for real estate",
    "AI voice agent for hospitals",
    "AI appointment booking",
    "VAPI voice agent",
  ],
});

const steps = [
  {
    title: "Free consultation",
    body: "We map your call flows, scripts, and the outcomes you care about — booked appointments, qualified leads, fewer no-shows.",
  },
  {
    title: "Custom agent + demo",
    body: "We build a voice agent tailored to your business on VAPI and hand you a live demo to test with real calls.",
  },
  {
    title: "Integrate & connect",
    body: "We wire it into your phone number, calendar, and CRM (HubSpot, Salesforce, GoHighLevel, EHR) with secure integrations.",
  },
  {
    title: "Go live & optimise",
    body: "Your agent answers 24/7. We monitor transcripts and tune performance so it keeps getting better.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "AI Voice Agent Development",
          description: siteConfig.description,
          path: "/",
          serviceType: "AI voice agents for inbound and outbound calls",
        })}
      />

      {/* Hero */}
      <section className="hero">
        <span className="orb orb-primary" style={{ width: 500, height: 500, top: -220, left: "50%", transform: "translateX(-50%)" }} />
        <span className="eyebrow hero-badge">
          <Sparkles className="h-3.5 w-3.5" /> Built on VAPI · US &amp; India
        </span>
        <h1>
          AI Voice Agents for{" "}
          <span className="gradient-text">Real Estate &amp; Healthcare</span>
        </h1>
        <p>
          Never lose another lead to a missed call. We build hyper-realistic AI voice agents that
          answer, qualify, book appointments, and sync to your CRM — 24/7, on the phone and on your
          website.
        </p>
        <div className="hero-btns">
          <Link href="/demo?client=apas" className="btn btn-primary">
            Experience the Voice AI <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/contact" className="btn btn-outline">
            Book a Free Consultation
          </Link>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="num">24/7</div>
            <div className="label">Never miss a call</div>
          </div>
          <div className="hero-stat">
            <div className="num">&lt;1s</div>
            <div className="label">Response latency</div>
          </div>
          <div className="hero-stat">
            <div className="num">2</div>
            <div className="label">Markets: US &amp; India</div>
          </div>
          <div className="hero-stat">
            <div className="num">1–2<span className="text-primary">wk</span></div>
            <div className="label">To go live</div>
          </div>
        </div>
      </section>

      <TrustBar />

      <CapabilitiesGrid />

      {/* How it works */}
      <section className="section">
        <div className="section-header">
          <span className="eyebrow">How it works</span>
          <h2>From first call to live agent in weeks</h2>
        </div>
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step" key={s.title}>
              <div className="step-num">{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="section">
        <div className="section-header">
          <span className="eyebrow">Industries</span>
          <h2>Purpose-built for high-value verticals</h2>
          <p>Deep, industry-specific agents — not generic bots.</p>
        </div>
        <div className="grid-3">
          <Link href="/industries/real-estate" className="card">
            <div className="icon-box">
              <Building2 className="h-6 w-6" />
            </div>
            <h3>Real Estate</h3>
            <p>
              Qualify buyers instantly, answer project FAQs, and book site visits directly into your
              sales team&apos;s calendar — even after hours.
            </p>
            <span className="inline-flex items-center gap-1 text-primary text-sm mt-4 font-semibold">
              Explore real estate <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link href="/industries/healthcare" className="card">
            <div className="icon-box alt">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h3>Healthcare &amp; Clinics</h3>
            <p>
              Schedule and confirm appointments, send reminders to cut no-shows, and answer patient
              FAQs — with privacy-first, compliance-ready workflows.
            </p>
            <span className="inline-flex items-center gap-1 text-primary text-sm mt-4 font-semibold">
              Explore healthcare <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link href="/solutions/website-voice-assistant" className="card">
            <div className="icon-box">
              <Mic className="h-6 w-6" />
            </div>
            <h3>Website Voice Assistant</h3>
            <p>
              Add a rich, talking assistant to your site that greets visitors, answers questions,
              and captures leads straight into your pipeline.
            </p>
            <span className="inline-flex items-center gap-1 text-primary text-sm mt-4 font-semibold">
              See website widget <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* Demo */}
      <section className="section" id="demo">
        <div className="demo-preview">
          <div className="demo-text">
            <span className="eyebrow" style={{ marginBottom: 18 }}>
              Live Demo
            </span>
            <h2 style={{ fontSize: 34, marginBottom: 16 }}>
              Talk to <span className="text-primary">&ldquo;Sneha&rdquo;</span>, our AI sales agent
            </h2>
            <p className="mb-8 text-base text-gray-300">
              Experience real-time, sub-second conversation. Sneha handles complex real estate
              queries, overcomes objections, and books site visits — right in your browser.
            </p>
            <Link href="/demo?client=apas" className="btn btn-primary">
              <Mic className="h-5 w-5" /> Try the Live Demo
            </Link>
          </div>
          <div className="demo-visual">
            <div className="wave-container">
              <div className="wave-bar" style={{ animationDelay: "0s" }} />
              <div className="wave-bar" style={{ animationDelay: "0.1s" }} />
              <div className="wave-bar" style={{ animationDelay: "0.2s" }} />
              <div className="wave-bar" style={{ animationDelay: "0.3s" }} />
              <div className="wave-bar" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      <Faq faqs={homeFaqs} />

      {/* Contact / Lead form */}
      <section className="section" id="contact">
        <div className="form-section">
          <div>
            <span className="eyebrow" style={{ marginBottom: 18 }}>
              Get started
            </span>
            <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-5">
              Get a free custom AI voice demo
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Tell us about your business and we&apos;ll build a tailored voice agent demo for your
              niche — free. See it handle your calls before you commit.
            </p>

            <ul className="benefit-list mb-8">
              <li>
                <CheckCircle2 className="h-5 w-5" /> Custom-built for real estate or healthcare
              </li>
              <li>
                <CheckCircle2 className="h-5 w-5" /> Integrates with your calendar &amp; CRM
              </li>
              <li>
                <ShieldCheck className="h-5 w-5" /> Privacy-first, compliance-ready workflows
              </li>
            </ul>

            <div className="flex flex-col gap-4">
              <a href={`mailto:${siteConfig.email}`} className="contact-detail mt-0">
                <Mail className="h-6 w-6 text-primary" /> {siteConfig.email}
              </a>
              <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer" className="contact-detail mt-0">
                <Phone className="h-6 w-6 text-primary" /> {siteConfig.phone} (WhatsApp)
              </a>
            </div>
          </div>

          <LeadForm source="Homepage" />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
