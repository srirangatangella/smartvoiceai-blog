import { Calendar, ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/site";

/**
 * Booking section. If NEXT_PUBLIC_BOOKING_URL is set to a real Cal.com/Calendly
 * link it embeds an iframe; otherwise it shows a clearly-marked placeholder CTA.
 */
export default function BookingSection() {
  const url = siteConfig.bookingUrl;
  const isPlaceholder = url.includes("smartvoiceai/30min"); // default placeholder pattern

  return (
    <div className="section" id="book">
      <div className="section-header">
        <span className="eyebrow">Book a Call</span>
        <h2>Schedule a free strategy call</h2>
        <p>Pick a time that works for you. We&apos;ll map your call flows and show you a live assistant.</p>
      </div>

      {isPlaceholder ? (
        <div className="booking-fallback">
          <Calendar className="h-10 w-10 text-primary mx-auto mb-4" />
          <p className="text-gray-300 mb-2">
            Connect your scheduling link to enable inline booking.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Set <code>NEXT_PUBLIC_BOOKING_URL</code> to your Cal.com or Calendly link to embed the
            calendar here.
          </p>
          <a href="/contact" className="btn btn-primary">
            Request a Call Instead
          </a>
        </div>
      ) : (
        <div>
          <iframe
            src={url}
            className="booking-frame"
            title="Book a call with Smart Voice AI"
            loading="lazy"
          />
          <p className="text-center mt-4 text-sm text-gray-500">
            Trouble loading?{" "}
            <a href={url} target="_blank" rel="noreferrer" className="text-primary inline-flex items-center gap-1">
              Open the scheduler <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
