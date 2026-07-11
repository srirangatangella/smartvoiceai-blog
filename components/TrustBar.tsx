import { builtWith } from "@/lib/site";

export default function TrustBar({ label = "Integrates with the tools you already use" }: { label?: string }) {
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
