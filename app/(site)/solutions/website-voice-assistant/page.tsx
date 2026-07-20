import Link from "next/link";
import { CheckCircle2, Mic, MousePointerClick, MessageSquare, Zap, Palette, Share2 } from "lucide-react";
import { buildMetadata, serviceSchema, JsonLd } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import LeadForm from "@/components/LeadForm";

export const metadata = buildMetadata({
  title: "Website Voice Assistant — Add a Talking AI Assistant to Your Site",
  description:
    "Embed a rich AI voice assistant on your website that greets visitors, answers questions by voice, captures leads, and books appointments — pushing every lead straight into your CRM. Free demo.",
  path: "/solutions/website-voice-assistant",
  keywords: [
    "website voice assistant",
    "AI voice widget for website",
    "voice AI for website",
    "embed voice assistant website",
    "conversational voice assistant",
  ],
});

const faqs = [
  { q: "What is a website voice assistant?", a: "It's a voice-enabled AI assistant embedded on your website. Visitors click to talk, and it answers their questions out loud, shows relevant info on screen, captures their details, and books appointments — a richer experience than a text chatbot." },
  { q: "How do I add it to my site?", a: "We provide a lightweight embed snippet that drops into any website — including WordPress, Webflow, Shopify, or a custom build. We handle the configuration and integrations for you." },
  { q: "Can it show things on screen while talking?", a: "Yes. Like our live demo, it can display floor plans, pricing, or product visuals on screen while it speaks — perfect for real estate and product showcases." },
  { q: "Where do the leads go?", a: "Straight into your CRM (HubSpot, Salesforce, GoHighLevel) or via webhook to any system, with a full transcript of the conversation." },
];

const features = [
  { icon: MousePointerClick, title: "Click-to-talk widget", body: "A branded voice button on your site — visitors talk instead of typing." },
  { icon: MessageSquare, title: "Answers by voice", body: "Handles product, pricing, and service questions in natural conversation." },
  { icon: Zap, title: "Captures leads", body: "Collects name, contact, and intent, then pushes to your CRM instantly." },
  { icon: Share2, title: "Visual responses", body: "Displays floor plans, images, or docs on screen while it speaks." },
  { icon: Palette, title: "On-brand", body: "Matches your colours, voice, and tone with guardrails you approve." },
  { icon: Mic, title: "Books appointments", body: "Schedules meetings and site visits directly from the website conversation." },
];

export default function WebsiteVoiceAssistantPage() {
  return (
    <>
      <JsonLd data={serviceSchema({ name: "Website Voice Assistant", description: metadata.description as string, path: "/solutions/website-voice-assistant", serviceType: "Embeddable website voice AI assistant" })} />
      <Breadcrumbs items={[{ name: "Solutions", path: "/solutions/inbound-voice-agents" }, { name: "Website Voice Assistant", path: "/solutions/website-voice-assistant" }]} />

      <PageHero
        eyebrow="Website Widget"
        title={<>Website <span className="gradient-text">Voice Assistant</span></>}
        description="Turn your website into a conversation. Embed a rich AI voice assistant that greets visitors, answers by voice, shows info on screen, captures leads, and books appointments — straight into your CRM."
        primaryLabel="Get a Website Demo"
      />

      <section className="section">
        <div className="section-header">
          <span className="eyebrow">What it does</span>
          <h2>A talking assistant for every visitor</h2>
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
          <h2>See it live on our own demo</h2>
          <p className="lead">Our real estate demo shows exactly what the website assistant does — talk to &ldquo;Sneha&rdquo; and watch her pull up floor plans as she answers.</p>
          <ul className="benefit-list">
            <li><CheckCircle2 className="h-5 w-5" /> Higher engagement than text chat</li>
            <li><CheckCircle2 className="h-5 w-5" /> Captures leads 24/7 from your existing traffic</li>
            <li><CheckCircle2 className="h-5 w-5" /> Drops into any website with one snippet</li>
          </ul>
          <Link href="/demo" className="btn btn-primary mt-6"><Mic className="h-4 w-4" /> Try the live demo</Link>
        </div>
        <div className="split-visual">
          <div className="demo-visual" style={{ minHeight: 240 }}>
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

      <Faq faqs={faqs} title="Website voice assistant FAQs" />
      <CtaBand title="Add a voice to your website" subtitle="Get a free website voice assistant demo configured for your business." primaryLabel="Get a Website Demo" />
      <section className="section" id="contact">
        <div className="form-section">
          <div>
            <span className="eyebrow" style={{ marginBottom: 18 }}>Get started</span>
            <h2 className="text-4xl font-bold leading-[1.1] mb-5">Put it on your site</h2>
            <p className="text-lg text-gray-400 mb-8">Share your site and we&apos;ll build a free embedded voice demo for it.</p>
          </div>
          <LeadForm source="Website widget page" />
        </div>
      </section>
    </>
  );
}
