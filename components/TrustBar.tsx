import { builtWith } from "@/lib/site";

export default function TrustBar({ label = "Built with best-in-class voice & CRM technology" }: { label?: string }) {
  return (
    <div className="trust-bar">
      <p className="trust-label">{label}</p>
      <div className="trust-logos">
        {builtWith.map((name) => (
          <span key={name}>{name}</span>
        ))}
      </div>
    </div>
  );
}
