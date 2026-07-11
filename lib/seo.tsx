import type { Metadata } from "next";
import { siteConfig } from "./site";

/** Build a page Metadata object with sane SEO + Open Graph defaults. */
export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  keywords,
  type = "website",
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  const url = `${siteConfig.url}${path === "/" ? "" : path}`;
  // When `image` is omitted, Next's file-based opengraph-image.tsx supplies a
  // valid, auto-generated OG image for the route — no more 404s.
  const images = image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      ...(images ? { images } : {}),
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/** Organization schema — rendered once in the root layout. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.png`,
    email: siteConfig.email,
    description: siteConfig.description,
    sameAs: [siteConfig.social.linkedin, siteConfig.social.twitter].filter(Boolean),
    areaServed: siteConfig.markets,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: siteConfig.phoneRaw,
      email: siteConfig.email,
      areaServed: ["US", "IN"],
      availableLanguage: ["English"],
    },
  };
}

/** WebSite schema with search action. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

/** Service schema for solution / industry pages. */
export function serviceSchema({
  name,
  description,
  path,
  serviceType,
}: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    areaServed: siteConfig.markets.map((m) => ({ "@type": "Country", name: m })),
    url: `${siteConfig.url}${path}`,
  };
}

/** FAQPage schema. */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** BreadcrumbList schema. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

/** Article schema for blog posts. */
export function articleSchema({
  title,
  description,
  slug,
  date,
  updatedDate,
  author,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  updatedDate?: string;
  author: string;
  image: string;
}) {
  const img = image.startsWith("http") ? image : `${siteConfig.url}${image}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: img,
    datePublished: date,
    dateModified: updatedDate || date,
    author: { "@type": "Organization", name: author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/icon.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}/blog/${slug}` },
  };
}

/** Render a JSON-LD <script> tag. Use inside a component's JSX. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
