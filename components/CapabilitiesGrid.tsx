import {
  PhoneIncoming,
  PhoneOutgoing,
  CalendarCheck,
  Layers,
  Globe,
  Languages,
  type LucideIcon,
} from "lucide-react";
import { capabilities } from "@/lib/site";

const icons: Record<string, LucideIcon> = {
  PhoneIncoming,
  PhoneOutgoing,
  CalendarCheck,
  Layers,
  Globe,
  Languages,
};

export default function CapabilitiesGrid() {
  return (
    <div className="section" id="services">
      <div className="section-header">
        <span className="eyebrow">Capabilities</span>
        <h2>Everything your front desk does — automated</h2>
        <p>Our AI doesn&apos;t just talk. It qualifies, books, and syncs to your systems.</p>
      </div>
      <div className="grid-3">
        {capabilities.map((c) => {
          const Icon = icons[c.icon] || Layers;
          return (
            <div className="card" key={c.title}>
              <div className="icon-box">
                <Icon className="h-6 w-6" />
              </div>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
