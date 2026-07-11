import { Mail, Phone, Clock, Globe2, CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadForm from "@/components/LeadForm";
import BookingSection from "@/components/BookingSection";

export const metadata = buildMetadata({
  title: "Contact — Book a Free AI Assistant Demo",
  description:
    "Talk to Smart Voice AI. Book a free consultation and we'll build a custom AI assistant demo for your real estate or healthcare business. Serving the US and India.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <PageHero
        eyebrow="Contact"
        title={<>Book your <span className="gradient-text">free demo</span></>}
        description="Tell us about your business and we'll build a custom AI assistant demo for your niche — free. Prefer to talk now? WhatsApp or email us directly."
        showDemo={false}
      />

      <section className="section" id="contact">
        <div className="form-section">
          <div>
            <span className="eyebrow" style={{ marginBottom: 18 }}>Get in touch</span>
            <h2 className="text-3xl font-bold leading-[1.1] mb-6">We reply within one business day</h2>

            <div className="flex flex-col gap-4 mb-8">
              <a href={`mailto:${siteConfig.email}`} className="contact-detail mt-0">
                <Mail className="h-6 w-6 text-primary" /> {siteConfig.email}
              </a>
              <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer" className="contact-detail mt-0">
                <Phone className="h-6 w-6 text-primary" /> {siteConfig.phone} (WhatsApp)
              </a>
              <div className="contact-detail mt-0">
                <Globe2 className="h-6 w-6 text-primary" /> Serving the US &amp; India
              </div>
              <div className="contact-detail mt-0">
                <Clock className="h-6 w-6 text-primary" /> Assistants run 24/7 — our team replies during business hours
              </div>
            </div>

            <ul className="benefit-list">
              <li><CheckCircle2 className="h-5 w-5" /> Free, no-obligation consultation</li>
              <li><CheckCircle2 className="h-5 w-5" /> A custom demo assistant built for your business</li>
              <li><CheckCircle2 className="h-5 w-5" /> Transparent, tailored pricing</li>
            </ul>
          </div>

          <LeadForm source="Contact page" />
        </div>
      </section>

      <BookingSection />
    </>
  );
}
