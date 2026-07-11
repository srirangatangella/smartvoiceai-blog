/**
 * Central site configuration — single source of truth.
 *
 * IMPORTANT: This kills the old `smarvoiceai.in` typo. The canonical domain,
 * every metadata tag, the sitemap and robots.txt all read from here.
 * Override the domain per-environment with NEXT_PUBLIC_SITE_URL.
 */

export const siteConfig = {
  name: "Smart Voice AI",
  legalName: "Smart Voice AI",
  // Canonical production URL. Falls back to the real .in domain (correctly spelled).
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://smartvoiceai.in").replace(/\/$/, ""),
  tagline: "AI Voice Agents for Real Estate & Healthcare",
  description:
    "We build custom AI voice agents on VAPI for real estate and healthcare — 24/7 inbound & outbound calls, appointment booking, and CRM integration. Book a free demo.",
  email: "contact@smartvoiceai.in",
  phone: "+91-6303919752",
  phoneRaw: "+916303919752",
  whatsapp: "https://wa.me/916303919752",
  // Booking link (Cal.com / Calendly). Set NEXT_PUBLIC_BOOKING_URL in your env.
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || "https://cal.com/smartvoiceai/30min",
  locales: ["en_US", "en_IN"],
  markets: ["United States", "India"],
  social: {
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/company/smartvoiceai",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "",
  },
  ogImage: "/og/home.jpg",
} as const;

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Solutions", href: "/solutions/inbound-voice-agents" },
  { label: "Real Estate", href: "/industries/real-estate" },
  { label: "Healthcare", href: "/industries/healthcare" },
  { label: "Integrations", href: "/integrations" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Solutions",
    links: [
      { label: "Inbound Voice Agents", href: "/solutions/inbound-voice-agents" },
      { label: "Outbound Voice Agents", href: "/solutions/outbound-voice-agents" },
      { label: "Website Voice Assistant", href: "/solutions/website-voice-assistant" },
      { label: "Integrations & CRM", href: "/integrations" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Real Estate", href: "/industries/real-estate" },
      { label: "Healthcare & Clinics", href: "/industries/healthcare" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Live Demo", href: "/demo?client=apas" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/** Core capabilities shown on the homepage + solution pages. */
export const capabilities = [
  {
    icon: "PhoneIncoming",
    title: "24/7 Inbound Receptionist",
    description:
      "Answer every call in one ring. The agent handles FAQs, qualifies the caller, and routes hot leads to your team — so you never lose a deal to a missed call again.",
  },
  {
    icon: "PhoneOutgoing",
    title: "Outbound Calling & Follow-up",
    description:
      "Automatically call new leads within seconds, chase no-shows, and run reactivation campaigns at scale — with natural, human-sounding conversations.",
  },
  {
    icon: "CalendarCheck",
    title: "Real-Time Appointment Booking",
    description:
      "The agent checks live availability and books directly into Google Calendar, Outlook, or your practice-management system while still on the call.",
  },
  {
    icon: "Layers",
    title: "CRM & Systems Integration",
    description:
      "Every call is transcribed, summarized, and synced to HubSpot, Salesforce, GoHighLevel, or your EHR/CRM via secure custom integrations.",
  },
  {
    icon: "Globe",
    title: "Website Voice Assistant",
    description:
      "Embed a rich voice agent on your site that greets visitors, answers questions, captures leads, and pushes them straight into your pipeline.",
  },
  {
    icon: "Languages",
    title: "Multilingual & On-Brand",
    description:
      "Agents speak US and Indian English (and more), match your brand tone, and follow guardrails you approve — no hallucinated promises.",
  },
] as const;

/** Trust bar logos / labels. Replace `img` with real files under /public/logos when available. */
export const builtWith = ["VAPI", "ElevenLabs", "Twilio", "HubSpot", "Salesforce", "GoHighLevel", "Google Calendar"];

/** PLACEHOLDER testimonials — replace with real, attributable quotes before launch. */
export const testimonials = [
  {
    quote:
      "Our AI receptionist booked 40+ site visits in the first month and never let a lead go to voicemail. It paid for itself in week one.",
    name: "[Client Name]",
    role: "Sales Head, [Real Estate Firm]",
    placeholder: true,
  },
  {
    quote:
      "Front desk was drowning in calls. The voice agent now handles appointment booking and reminders 24/7, and no-shows dropped noticeably.",
    name: "[Client Name]",
    role: "Practice Manager, [Clinic]",
    placeholder: true,
  },
  {
    quote:
      "Setup was fast and the integration into our CRM was seamless. The conversations sound genuinely human.",
    name: "[Client Name]",
    role: "Founder, [Company]",
    placeholder: true,
  },
] as const;

export const homeFaqs = [
  {
    q: "What is an AI voice agent and how is it different from a chatbot?",
    a: "An AI voice agent is a conversational AI that talks to your callers or website visitors in a natural, human-sounding voice over the phone or web. Unlike a text chatbot, it answers real phone calls, understands intent, handles objections, books appointments, and syncs the outcome to your CRM — all without a human on the line.",
  },
  {
    q: "Which industries do you build voice agents for?",
    a: "We specialise in high-value B2B use cases — primarily real estate (lead qualification, site-visit booking) and healthcare/clinics (appointment scheduling, reminders, patient FAQs). We also build custom agents for other service businesses.",
  },
  {
    q: "Do you serve businesses in the US and India?",
    a: "Yes. We build and deploy voice agents for businesses in both the United States and India, with agents that speak the appropriate English dialect and handle local calling requirements.",
  },
  {
    q: "How are the agents built — what technology do you use?",
    a: "We build on VAPI with best-in-class speech and language models, integrated with telephony (Twilio), calendars, and your CRM. Each agent is custom-configured to your scripts, guardrails, and workflows.",
  },
  {
    q: "Can it integrate with my existing CRM or booking system?",
    a: "Yes. We integrate with HubSpot, Salesforce, GoHighLevel, Google Calendar, Outlook, and many practice-management/EHR systems. If you have a custom system, we can connect via API or webhook.",
  },
  {
    q: "How quickly can I go live?",
    a: "Most agents launch within 1–2 weeks. We start with a free consultation, build a custom demo for your business, then refine and deploy.",
  },
];
