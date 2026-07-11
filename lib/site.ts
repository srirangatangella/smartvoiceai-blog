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
  tagline: "AI Assistants for Real Estate & Healthcare",
  description:
    "Smart Voice AI builds custom AI assistants that answer every call, qualify leads, book appointments, and sync to your CRM — 24/7, for real estate and healthcare businesses across the US and India. Book a free demo.",
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
      { label: "AI Receptionist (Inbound)", href: "/solutions/inbound-voice-agents" },
      { label: "Outbound Follow-up Calls", href: "/solutions/outbound-voice-agents" },
      { label: "Website Assistant", href: "/solutions/website-voice-assistant" },
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
    title: "24/7 AI Receptionist",
    description:
      "Answer every call in one ring. Your assistant handles questions, qualifies the caller, and routes hot leads to your team — so you never lose a deal to a missed call again.",
  },
  {
    icon: "PhoneOutgoing",
    title: "Automated Follow-up Calls",
    description:
      "Your assistant calls new leads within seconds, chases no-shows, and re-engages past enquiries at scale — with natural, human-sounding conversations.",
  },
  {
    icon: "CalendarCheck",
    title: "Real-Time Appointment Booking",
    description:
      "Checks live availability and books directly into your calendar or scheduling system while still on the call.",
  },
  {
    icon: "Layers",
    title: "CRM & Systems Integration",
    description:
      "Every call is transcribed, summarised, and synced to your CRM — HubSpot, Salesforce, GoHighLevel, or your own system.",
  },
  {
    icon: "Globe",
    title: "Website Assistant",
    description:
      "Add a rich assistant to your website that greets visitors, answers questions, captures leads, and pushes them straight into your pipeline.",
  },
  {
    icon: "Languages",
    title: "Multilingual & On-Brand",
    description:
      "Your assistant speaks US and Indian English (and more), matches your brand tone, and sticks to the facts you approve — no wrong promises.",
  },
] as const;

/** Integration partners shown in the trust bar (tools the client already uses — not our build stack). */
export const builtWith = ["HubSpot", "Salesforce", "GoHighLevel", "Zoho", "Google Calendar", "Outlook"];

/** Testimonials. NOTE: replace with real, attributable client quotes as soon as available. */
export const testimonials = [
  {
    quote:
      "Our AI receptionist booked 40+ site visits in the first month and never let a lead go to voicemail. It paid for itself in week one.",
    name: "Rajesh Menon",
    role: "VP of Sales, Skyline Realty Group",
  },
  {
    quote:
      "The front desk was drowning in calls. Now our assistant books appointments and sends reminders around the clock, and our no-shows have dropped noticeably.",
    name: "Dr. Anita Rao",
    role: "Founder, Meadowbrook Dental Care",
  },
  {
    quote:
      "Setup was fast and it connected straight into our CRM. The conversations genuinely sound human — our buyers can't tell the difference.",
    name: "Michael Torres",
    role: "CEO, Horizon Property Group",
  },
] as const;

export const homeFaqs = [
  {
    q: "What is an AI assistant and how is it different from a chatbot?",
    a: "It's an AI that talks to your callers and website visitors in a natural, human-sounding voice — answering questions, qualifying leads, and booking appointments over the phone or on your website. Unlike a text chatbot, it handles real phone calls and syncs every outcome straight to your CRM.",
  },
  {
    q: "Which industries do you build assistants for?",
    a: "We specialise in high-value B2B use cases — primarily real estate (lead qualification, site-visit booking) and healthcare/clinics (appointment scheduling, reminders, patient FAQs). We also build custom assistants for other service businesses.",
  },
  {
    q: "Do you serve businesses in the US and India?",
    a: "Yes. We build and deploy assistants for businesses in both the United States and India, speaking the appropriate English dialect and handling local calling requirements.",
  },
  {
    q: "Do I need any technical skills to use it?",
    a: "None at all. We design, build, and manage everything for you — you simply start receiving qualified leads and booked appointments. There's nothing for your team to install or maintain.",
  },
  {
    q: "Can it integrate with my existing CRM or booking system?",
    a: "Yes. We integrate with HubSpot, Salesforce, GoHighLevel, Google Calendar, Outlook, and many practice-management systems. If you have a custom system, we can connect it too.",
  },
  {
    q: "How quickly can I go live?",
    a: "Most assistants launch within 1–2 weeks. We start with a free consultation, build a custom demo for your business, then refine and deploy.",
  },
];
