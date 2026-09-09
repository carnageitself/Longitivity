import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogBrowser from "@/components/CatalogBrowser";
import JsonLd from "@/components/JsonLd";
import { catalog } from "@/lib/catalog";
import { promoMarks } from "@/lib/promotions";
import { absoluteUrl, breadcrumbJsonLd, ORGANIZATION_ID } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

// These pages carry the "15% off" tags and discounted prices, which are worked
// out from today's date at render time. Without a revalidate they are built
// once and served unchanged, so an offer that ended on the 30th would keep
// advertising itself - to shoppers and to Googlebot - until the next deploy.
// Hourly matches /promotions, so every surface turns over together.
export const revalidate = 3600;

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
  const marks = promoMarks();

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
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <Suspense fallback={null}>
            <CatalogBrowser promoMarks={marks} />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
