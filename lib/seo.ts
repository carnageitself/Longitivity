import { SITE_NAME, SITE_TAGLINE, CONTACT } from "@/lib/site-config";

// Single source of truth for the canonical origin. Every route used to declare
// its own copy of this line, which meant a domain change had to be made in five
// places and a missed one would emit cross-domain canonicals.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://longitivity.vercel.app"
).replace(/\/+$/, "");

// Absolute URL for structured data and OG tags. Search engines treat relative
// URLs inside JSON-LD as invalid, so anything going into a schema payload has
// to be resolved here first. `new URL` also percent-encodes the spaces that
// most of the product photo filenames contain.
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

export type BreadcrumbEntry = { name: string; path: string };

export function breadcrumbJsonLd(entries: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

// Site-wide identity graph, emitted once from the root layout. The @id values
// let the per-page Product/Collection payloads point back at this publisher
// instead of restating it, which is what Google's entity resolution wants.
export const ORGANIZATION_ID = absoluteUrl("/#organization");
export const WEBSITE_ID = absoluteUrl("/#website");

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_TAGLINE,
  slogan: SITE_TAGLINE,
  email: CONTACT.email,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/opengraph-image"),
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: CONTACT.email,
      areaServed: "US",
      availableLanguage: ["English"],
    },
  ],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_TAGLINE,
  inLanguage: "en-US",
  publisher: { "@id": ORGANIZATION_ID },
};
