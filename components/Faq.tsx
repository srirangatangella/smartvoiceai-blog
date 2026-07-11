import { ChevronDown } from "lucide-react";
import { faqSchema, JsonLd } from "@/lib/seo";

export default function Faq({
  faqs,
  title = "Frequently asked questions",
  eyebrow = "FAQ",
}: {
  faqs: { q: string; a: string }[];
  title?: string;
  eyebrow?: string;
}) {
  return (
    <div className="section" id="faq">
      <JsonLd data={faqSchema(faqs)} />
      <div className="section-header">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <div className="faq-list">
        {faqs.map((f, i) => (
          <details className="faq-item" key={i}>
            <summary>
              {f.q}
              <ChevronDown className="chevron h-5 w-5" />
            </summary>
            <div className="faq-answer">{f.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
