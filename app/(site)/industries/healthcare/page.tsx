import Link from "next/link";
import {
  CheckCircle2,
  CalendarCheck,
  BellRing,
  ClipboardList,
  PhoneIncoming,
  ShieldCheck,
  Lock,
  Stethoscope,
} from "lucide-react";
import { buildMetadata, serviceSchema, JsonLd } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import LeadForm from "@/components/LeadForm";

export const metadata = buildMetadata({
  title: "AI Voice Agent for Healthcare & Clinics — Appointment Scheduling",
  description:
    "A privacy-first AI voice agent for clinics and hospitals that books and confirms appointments 24/7, reduces no-shows with reminders, and answers patient FAQs. Compliance-ready. Free demo.",
  path: "/industries/healthcare",
  keywords: [
    "AI voice agent for healthcare",
    "AI answering service for medical clinic",
    "AI appointment scheduling for hospitals",
    "patient appointment booking AI",
    "HIPAA compliant AI voice agent",
  ],
});

const faqs = [
  {
    q: "How does an AI voice agent help clinics and hospitals?",
    a: "It answers patient calls 24/7, books and reschedules appointments into your practice-management system, sends confirmation and reminder calls to cut no-shows, and answers common questions about hours, location, insurance, and services — freeing your front desk for in-person patients.",
  },
  {
    q: "Is it HIPAA compliant?",
    a: "We build privacy-first workflows and can architect the solution to support HIPAA requirements, including a Business Associate Agreement (BAA) with compatible infrastructure and data handling. We'll scope the exact compliance setup with you during onboarding. For India, we align with the DPDP Act.",
  },
  {
    q: "Can it integrate with our scheduling / EHR system?",
    a: "Yes. We integrate with major practice-management and calendar systems (and many EHRs) via API or secure webhook so appointments are booked in real time against live availability.",
  },
  {
    q: "Will it reduce no-shows?",
    a: "Automated confirmation and reminder calls consistently reduce no-shows, and the agent can offer to reschedule on the spot — recapturing slots that would otherwise be lost.",
  },
  {
    q: "Can it handle after-hours and overflow calls?",
    a: "Absolutely. It can cover nights, weekends, and holidays, or simply catch overflow when your front desk is busy so no patient call goes unanswered.",
  },
];

const useCases = [
  { icon: CalendarCheck, title: "Appointment scheduling", body: "Books, reschedules, and cancels appointments against live availability in your system — 24/7." },
  { icon: BellRing, title: "Reminders & confirmations", body: "Automated reminder and confirmation calls dramatically reduce costly no-shows." },
  { icon: PhoneIncoming, title: "After-hours & overflow", body: "Covers nights and weekends, and catches overflow when the front desk is slammed." },
  { icon: ClipboardList, title: "Patient FAQs & triage routing", body: "Answers hours, location, insurance, and prep questions; routes urgent cases per your rules." },
  { icon: Stethoscope, title: "New patient intake", body: "Collects intake details and captures new-patient enquiries so nothing slips through." },
  { icon: BellRing, title: "Recalls & follow-ups", body: "Proactively calls patients due for follow-ups, screenings, or annual visits." },
];

export default function HealthcarePage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "AI Voice Agents for Healthcare & Clinics",
          description: metadata.description as string,
          path: "/industries/healthcare",
          serviceType: "Healthcare AI voice agent for appointment scheduling and patient communication",
        })}
      />
      <Breadcrumbs items={[{ name: "Industries", path: "/industries/healthcare" }, { name: "Healthcare", path: "/industries/healthcare" }]} />

      <PageHero
        eyebrow="Healthcare & Clinics"
        title={
          <>
            AI Voice Agent for <span className="gradient-text">Healthcare &amp; Clinics</span>
          </>
        }
        description="Give every patient a fast, friendly answer — 24/7. Our privacy-first AI voice agent books and confirms appointments, cuts no-shows with reminders, and handles patient FAQs, so your front desk can focus on the people in the room."
      />

      {/* Value split */}
      <section className="split">
        <div>
          <h2>Your front desk can&apos;t answer every call</h2>
          <p className="lead">
            Missed calls mean missed appointments and frustrated patients. Long hold times send them
            to another provider. An AI voice agent picks up instantly, every time.
          </p>
          <ul className="benefit-list">
            <li><CheckCircle2 className="h-5 w-5" /> Book &amp; confirm appointments around the clock</li>
            <li><CheckCircle2 className="h-5 w-5" /> Reduce no-shows with automated reminders</li>
            <li><CheckCircle2 className="h-5 w-5" /> Free staff from repetitive phone questions</li>
            <li><CheckCircle2 className="h-5 w-5" /> Never send a patient to voicemail again</li>
          </ul>
        </div>
        <div className="split-visual">
          <div className="benefit-list" style={{ gap: 20 }}>
            <div>
              <div className="text-3xl font-extrabold text-primary">24/7</div>
              <p className="text-sm text-gray-400">appointment booking &amp; patient support</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary">↓ No-shows</div>
              <p className="text-sm text-gray-400">automated reminders recover lost slots</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary">100%</div>
              <p className="text-sm text-gray-400">of calls answered, even at peak times</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="section">
        <div className="section-header">
          <span className="eyebrow">Use cases</span>
          <h2>What your healthcare agent handles</h2>
        </div>
        <div className="grid-3">
          {useCases.map((u) => (
            <div className="card" key={u.title}>
              <div className="icon-box alt">
                <u.icon className="h-6 w-6" />
              </div>
              <h3>{u.title}</h3>
              <p>{u.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance / Security */}
      <section className="section section-narrow" id="compliance">
        <div className="section-header">
          <span className="eyebrow">Security &amp; Compliance</span>
          <h2>Built with privacy at the core</h2>
          <p className="mx-auto">
            Healthcare data is sensitive. We design every deployment around your compliance
            obligations — and scope the exact requirements with you before go-live.
          </p>
        </div>
        <div className="grid-3">
          <div className="card">
            <div className="icon-box"><ShieldCheck className="h-6 w-6" /></div>
            <h3>HIPAA-ready (US)</h3>
            <p>Architected to support HIPAA requirements, including a BAA with compatible infrastructure and controlled data handling.</p>
          </div>
          <div className="card">
            <div className="icon-box"><Lock className="h-6 w-6" /></div>
            <h3>Encryption &amp; access control</h3>
            <p>Call data encrypted in transit and at rest, with least-privilege access and audit trails.</p>
          </div>
          <div className="card">
            <div className="icon-box"><ShieldCheck className="h-6 w-6" /></div>
            <h3>DPDP-aligned (India)</h3>
            <p>For Indian clinics and hospitals, workflows are aligned with the Digital Personal Data Protection Act.</p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-6">
          Compliance scope is confirmed per engagement. This page is informational and not legal advice.
        </p>
      </section>

      <Faq faqs={faqs} title="Healthcare voice agent FAQs" />

      {/* Lead form */}
      <section className="section" id="contact">
        <div className="form-section">
          <div>
            <span className="eyebrow" style={{ marginBottom: 18 }}>Get started</span>
            <h2 className="text-4xl font-bold leading-[1.1] mb-5">Free demo for your clinic</h2>
            <p className="text-lg text-gray-400 mb-8">
              Tell us how your scheduling works and we&apos;ll build a compliance-ready demo agent for
              your practice — free.
            </p>
            <ul className="benefit-list mb-6">
              <li><CheckCircle2 className="h-5 w-5" /> Integrates with your scheduling system</li>
              <li><CheckCircle2 className="h-5 w-5" /> Privacy-first, HIPAA-ready design</li>
              <li><CheckCircle2 className="h-5 w-5" /> Reduces no-shows from week one</li>
            </ul>
          </div>
          <LeadForm source="Healthcare page" />
        </div>
      </section>

      <CtaBand
        title="Give every patient an instant answer"
        subtitle="Get a free, privacy-first AI voice agent demo built for your clinic or hospital."
      />
    </>
  );
}
