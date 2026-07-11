import { CheckCircle2, Webhook, Database, Phone, Calendar as CalIcon, PlugZap } from "lucide-react";
import { buildMetadata, serviceSchema, JsonLd } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";

export const metadata = buildMetadata({
  title: "Integrations — Connect Your AI Voice Agent to Your CRM & Calendar",
  description:
    "Smart Voice AI voice agents integrate with HubSpot, Salesforce, GoHighLevel, Google Calendar, Outlook, Twilio, and your EHR or custom systems via secure API and webhooks. Every call synced.",
  path: "/integrations",
  keywords: [
    "AI voice agent CRM integration",
    "HubSpot voice agent",
    "Salesforce voice AI",
    "GoHighLevel voice agent",
    "voice agent calendar integration",
  ],
});

const groups = [
  { icon: Database, title: "CRM", items: ["HubSpot", "Salesforce", "GoHighLevel", "Zoho", "Pipedrive"] },
  { icon: CalIcon, title: "Calendars & Scheduling", items: ["Google Calendar", "Outlook / Microsoft 365", "Cal.com", "Calendly", "Practice-management systems"] },
  { icon: Phone, title: "Telephony", items: ["Twilio", "Your existing business number", "SIP trunks", "Toll-free & local numbers"] },
  { icon: Webhook, title: "Automation & Custom", items: ["n8n", "Zapier", "Make", "Custom REST APIs", "Secure webhooks"] },
];

const faqs = [
  { q: "What if my system isn't listed?", a: "If it has an API or can accept a webhook, we can almost certainly connect it. We build custom integrations for CRMs, EHRs, and internal tools regularly — just tell us what you use." },
  { q: "How does the data flow?", a: "During and after each call, the agent captures structured data (contact, intent, appointment) and pushes it to your CRM, plus a full transcript and summary. Bookings are written to your live calendar." },
  { q: "Is the integration secure?", a: "Yes. We use authenticated API connections and encrypted transport, with least-privilege access scoped to only what's needed." },
];

export default function IntegrationsPage() {
  return (
    <>
      <JsonLd data={serviceSchema({ name: "AI Voice Agent Integrations", description: metadata.description as string, path: "/integrations", serviceType: "CRM, calendar and telephony integration for AI voice agents" })} />
      <Breadcrumbs items={[{ name: "Integrations", path: "/integrations" }]} />

      <PageHero
        eyebrow="Integrations"
        title={<>Connect to the tools you <span className="gradient-text">already use</span></>}
        description="Your AI voice agent plugs into your CRM, calendar, phone system, and automation stack — so every call becomes a synced record, a booked appointment, or a routed lead. No rip-and-replace."
        showDemo={false}
      />

      <section className="section">
        <div className="grid-3">
          {groups.map((g) => (
            <div className="card" key={g.title}>
              <div className="icon-box"><g.icon className="h-6 w-6" /></div>
              <h3>{g.title}</h3>
              <ul className="benefit-list" style={{ marginTop: 12 }}>
                {g.items.map((it) => (
                  <li key={it}><CheckCircle2 className="h-5 w-5" /> {it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="split">
        <div>
          <h2>Have a custom system?</h2>
          <p className="lead">
            We integrate with proprietary CRMs, EHRs, and internal tools through their APIs or via
            secure webhooks and middleware like n8n. If your team can describe the workflow, we can
            wire the agent into it.
          </p>
          <ul className="benefit-list">
            <li><CheckCircle2 className="h-5 w-5" /> Real-time, two-way data sync</li>
            <li><CheckCircle2 className="h-5 w-5" /> Full transcripts &amp; call summaries</li>
            <li><CheckCircle2 className="h-5 w-5" /> Live calendar availability &amp; booking</li>
          </ul>
        </div>
        <div className="split-visual">
          <div className="benefit-list" style={{ gap: 18 }}>
            <div className="flex items-center gap-3"><PlugZap className="h-6 w-6 text-primary" /><span className="text-gray-300">API &amp; webhook connectors</span></div>
            <div className="flex items-center gap-3"><Database className="h-6 w-6 text-primary" /><span className="text-gray-300">CRM record creation &amp; updates</span></div>
            <div className="flex items-center gap-3"><CalIcon className="h-6 w-6 text-primary" /><span className="text-gray-300">Live calendar booking</span></div>
            <div className="flex items-center gap-3"><Phone className="h-6 w-6 text-primary" /><span className="text-gray-300">Telephony &amp; number porting</span></div>
          </div>
        </div>
      </section>

      <Faq faqs={faqs} title="Integration FAQs" />
      <CtaBand title="Works with your stack" subtitle="Tell us what you use — we'll show you how the agent connects." />
    </>
  );
}
