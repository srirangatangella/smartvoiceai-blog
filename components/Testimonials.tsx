import { Star } from "lucide-react";
import { testimonials } from "@/lib/site";

export default function Testimonials() {
  return (
    <div className="section" id="testimonials">
      <div className="section-header">
        <span className="eyebrow">Results</span>
        <h2>Trusted by growth-focused teams</h2>
        <p>Real outcomes from businesses that never miss a call.</p>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((t, i) => (
          <div className="testimonial" key={i}>
            <div className="stars" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="quote">&ldquo;{t.quote}&rdquo;</p>
            <div className="author">{t.name}</div>
            <div className="role">{t.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
