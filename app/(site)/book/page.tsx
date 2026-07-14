import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import BookingSection from "@/components/BookingSection";

export const metadata = buildMetadata({
  title: "Book a Free Demo",
  description:
    "Pick a time that works for you and book a free AI voice assistant demo with the Smart Voice AI team.",
  path: "/book",
});

export default function BookPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Book a Demo", path: "/book" }]} />
      <section className="page-hero" style={{ paddingBottom: 0 }}>
        <span className="eyebrow" style={{ marginBottom: 20 }}>
          Book a demo
        </span>
        <h1>
          Pick a time that <span className="gradient-text">works for you</span>
        </h1>
        <p>
          Choose a slot below for a free, no-obligation demo. We&apos;ll show you a live AI assistant
          built for your business.
        </p>
      </section>
      <BookingSection />
    </>
  );
}
