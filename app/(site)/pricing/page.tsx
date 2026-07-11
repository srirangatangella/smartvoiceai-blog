import Link from "next/link";
import { Check } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";

export const metadata = buildMetadata({
  title: "Pricing — Custom AI Voice Agents for Business",
  description:
    "Transparent, custom pricing for AI voice agents. Choose a plan for inbound, outbound, or website voice agents with CRM integration. Book a free consultation for a tailored quote.",
  path: "/pricing",
  keywords: ["AI voice agent pricing", "AI receptionist cost", "voice AI pricing"],
});

const plans = [
  {
    name: "Starter",
    price: "Custom",
    unit: "",
    desc: "One focused agent — perfect to prove ROI on a single use case.",
    features: [
      "1 inbound or outbound voice agent",
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
      "Inbound & outbound agents",
      "CRM integration (HubSpot / Salesforce / GHL)",
      "Website voice assistant",
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
    desc: "Multi-agent, multi-location deployments with compliance needs.",
    features: [
      "Unlimited agents & call volume",
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
  { q: "Why is pricing custom?", a: "Voice agents are tailored to your call flows, integrations, languages, and volume. We scope your needs on a free consultation and give you a clear, fixed quote — no surprises." },
  { q: "Is there a setup fee?", a: "Most engagements include a one-time build/setup and a monthly platform + usage fee. We'll break it down transparently for your specific use case." },
  { q: "What drives the cost?", a: "Mainly call volume, number of agents, complexity of integrations, and compliance requirements. We'll recommend the most cost-effective configuration for your goals." },
  { q: "Do you offer a trial or demo?", a: "Yes — we build a free custom demo agent for your business before you commit, so you can hear the ROI for yourself." },
];

export default function PricingPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Pricing", path: "/pricing" }]} />
      <PageHero
        eyebrow="Pricing"
        title={<>Pricing that scales with <span className="gradient-text">your results</span></>}
        description="Every business is different, so every agent is quoted to fit. Book a free consultation and we'll recommend the right plan and give you a transparent, fixed quote."
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
        <p className="text-center text-xs text-gray-500 mt-8">
          Plans are indicative packages — final pricing is tailored to your call volume and
          integrations. Update these tiers with your published rates when ready.
        </p>
      </section>

      <Faq faqs={faqs} title="Pricing FAQs" />
      <CtaBand title="Get a quote in one call" subtitle="Free consultation, a custom demo, and a transparent quote — no obligation." primaryLabel="Get a Custom Quote" />
    </>
  );
}
