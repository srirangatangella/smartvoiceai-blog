import Link from "next/link";
import { breadcrumbSchema, JsonLd } from "@/lib/seo";

export default function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const full = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <JsonLd data={breadcrumbSchema(full)} />
      {full.map((item, i) => (
        <span key={item.path}>
          {i < full.length - 1 ? (
            <Link href={item.path}>{item.name}</Link>
          ) : (
            <span className="text-white">{item.name}</span>
          )}
          {i < full.length - 1 && <span className="sep">/</span>}
        </span>
      ))}
    </nav>
  );
}
