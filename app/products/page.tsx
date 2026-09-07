import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogBrowser from "@/components/CatalogBrowser";
import JsonLd from "@/components/JsonLd";
import { catalog } from "@/lib/catalog";
import { CATEGORY_SEO, countIn } from "@/lib/categories";
import { absoluteUrl, breadcrumbJsonLd, ORGANIZATION_ID } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

const DESCRIPTION =
  "Every product across Nutrilite, Artistry, XS, personal care, home care and water & air treatment, with full ingredient lists, sizes and honest pricing.";

export const metadata: Metadata = {
  // Bare title: the root layout's template appends "| Longitivity". Adding it
  // here too is what produced "... | Longitivity | Longitivity" in the SERP.
  title: "All Products: Nutrilite, Artistry, XS & More",
  description: DESCRIPTION,
  keywords: [
    "Nutrilite catalog",
    "Artistry catalog",
    "XS energy drink flavors",
    "eSpring filters",
    "Atmosphere Sky filters",
    "Home care products",
    "wellness product prices",
    "product ingredients list",
  ],
  alternates: { canonical: "/products" },
  openGraph: {
    url: "/products",
    title: `Full Product Catalog | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
  twitter: {
    title: `Full Product Catalog | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": absoluteUrl("/products"),
  url: absoluteUrl("/products"),
  name: `Full Product Catalog | ${SITE_NAME}`,
  description: DESCRIPTION,
  isPartOf: { "@id": absoluteUrl("/#website") },
  publisher: { "@id": ORGANIZATION_ID },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: catalog.length,
    itemListElement: catalog.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/products/${product.slug}`),
      name: product.name,
    })),
  },
};

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
]);

export default function ProductsPage() {
  return (
    <>
      <JsonLd data={[jsonLd, breadcrumbs]} />
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border px-6 pt-20 pb-14">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-xs font-medium tracking-wide text-accent uppercase">
              The full lineup
            </p>
            <h1 className="max-w-2xl font-serif text-4xl font-medium tracking-tight sm:text-5xl">
              Every product. Every ingredient. One honest price.
            </h1>
            <p className="mt-5 max-w-xl text-muted">
              No mystery formulas, no vague &quot;proprietary blend&quot;
              hand-waving. Tap any product to see exactly what&apos;s inside
              before you commit.
            </p>

            {/* Server-rendered links into the category landing pages. The
                filter buttons below are client state and produce no crawlable
                URL, so without these the collection pages would be orphaned. */}
            <nav aria-label="Product categories" className="mt-8 flex flex-wrap gap-3">
              {CATEGORY_SEO.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/collections/${entry.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
                >
                  {entry.category}
                  <span className="text-xs text-muted">{countIn(entry.category)}</span>
                </Link>
              ))}
            </nav>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <Suspense fallback={null}>
            <CatalogBrowser />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
