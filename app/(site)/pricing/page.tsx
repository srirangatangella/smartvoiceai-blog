import Link from "next/link";
import { Check } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";

export const metadata = buildMetadata({
  title: "Pricing — Custom AI Assistants for Business",
  description:
    "Transparent, custom pricing for AI assistants. Choose a plan for inbound, outbound, or website assistants with CRM integration. Book a free consultation for a tailored quote.",
  path: "/pricing",
  keywords: ["AI receptionist pricing", "AI receptionist cost", "AI assistant pricing"],
});

const plans = [
  {
    name: "Starter",
    price: "Custom",
    unit: "",
    desc: "One focused assistant — perfect to prove ROI on a single use case.",
    features: [
      "1 inbound or outbound assistant",
      "Calendar booking integration",
      "Call transcripts & summaries",
      "Email + WhatsApp lead alerts",
      "Go live in 1–2 weeks",
    ],
    cta: "Get a Quote",
    featured: false,
  },
  {
    name: "Growth",
    price: "Custom",
    unit: "",
    desc: "Inbound + outbound, fully integrated into your CRM. Most popular.",
    features: [
      "Inbound & outbound assistants",
      "CRM integration (HubSpot / Salesforce / GHL)",
      "Website assistant",
      "Automated reminders & follow-ups",
      "Priority support & optimisation",
    ],
    cta: "Get a Quote",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "",
    desc: "Multi-assistant, multi-location deployments with compliance needs.",
    features: [
      "Unlimited assistants & call volume",
      "HIPAA-ready / DPDP-aligned setup",
      "Custom & EHR integrations",
      "Dedicated solution architect",
      "SLA & analytics reporting",
    ],
    cta: "Talk to Sales",
    featured: false,
  },
];

const faqs = [
  { q: "Why is pricing custom?", a: "Assistants are tailored to your call flows, integrations, languages, and volume. We scope your needs on a free consultation and give you a clear, fixed quote — no surprises." },
  { q: "Is there a setup fee?", a: "Most engagements include a one-time build/setup and a monthly platform + usage fee. We'll break it down transparently for your specific use case." },
  { q: "What drives the cost?", a: "Mainly call volume, number of assistants, complexity of integrations, and compliance requirements. We'll recommend the most cost-effective configuration for your goals." },
  { q: "Do you offer a trial or demo?", a: "Yes — we build a free custom demo assistant for your business before you commit, so you can hear the ROI for yourself." },
];

export default function PricingPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Pricing", path: "/pricing" }]} />
      <PageHero
        eyebrow="Pricing"
        title={<>Pricing that scales with <span className="gradient-text">your results</span></>}
        description="Every business is different, so every assistant is quoted to fit. Book a free consultation and we'll recommend the right plan and give you a transparent, fixed quote."
        primaryLabel="Get a Custom Quote"
      />

      <section className="section">
        <div className="pricing-grid">
          {plans.map((p) => (
            <div className={`price-card ${p.featured ? "featured" : ""}`} key={p.name}>
              {p.featured && <span className="badge-popular">Most Popular</span>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-price">
                {p.price} {p.unit && <small>{p.unit}</small>}
              </div>
              <p className="plan-desc">{p.desc}</p>
              <ul>
                {p.features.map((f) => (
                  <li key={f}><Check className="h-4 w-4" /> {f}</li>
                ))}
              </ul>
              <Link href="/contact" className={`btn ${p.featured ? "btn-primary" : "btn-outline"} justify-center`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-8">
          Every engagement is scoped to your call volume, integrations, and compliance needs — book a
          free consultation and we&apos;ll give you a clear, fixed quote. No per-minute surprises.
        </p>
      </section>

      {/* ROI comparison */}
      <section className="split">
        <div>
          <span className="eyebrow" style={{ marginBottom: 18 }}>The math</span>
          <h2>A fraction of the cost of a front-desk hire</h2>
          <p className="lead">
            A full-time receptionist runs roughly $2,800–$5,800 a month once you add salary, benefits,
            training, and cover for sick days and holidays — and still only works one shift. Your AI
            assistant answers every call, 24/7, for a fraction of that.
          </p>
          <ul className="benefit-list">
            <li><Check className="h-5 w-5" /> Answers 100% of calls — nights, weekends, holidays</li>
            <li><Check className="h-5 w-5" /> No salary, benefits, training, or turnover</li>
            <li><Check className="h-5 w-5" /> Handles many calls at once during spikes</li>
            <li><Check className="h-5 w-5" /> One booked deal or recovered patient can cover a month</li>
          </ul>
        </div>
        <div className="split-visual">
          <div className="benefit-list" style={{ gap: 22 }}>
            <div>
              <div className="text-3xl font-extrabold text-primary">$2,800–5,800</div>
              <p className="text-sm text-gray-400">/mo — a typical fully-loaded receptionist</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary">24/7</div>
              <p className="text-sm text-gray-400">your assistant works every hour, every day</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary">Fixed quote</div>
              <p className="text-sm text-gray-400">scoped on a free call — no surprises</p>
            </div>
          </div>
        </div>
      </section>

      <Faq faqs={faqs} title="Pricing FAQs" />
      <CtaBand title="Get a quote in one call" subtitle="Free consultation, a custom demo, and a transparent quote — no obligation." primaryLabel="Get a Custom Quote" />
    </>
  );
}
