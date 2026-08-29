import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogBrowser from "@/components/CatalogBrowser";
import { catalog } from "@/lib/catalog";
import { SITE_NAME } from "@/lib/site-config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://longitivity.vercel.app";

const DESCRIPTION =
  "Browse every flagship product across Nutrilite, Artistry, Satinique, Glister, XS, Personal Care, Home Care, and Water & Air Treatment, with ingredients, sizing, and retail pricing.";

export const metadata: Metadata = {
  title: `Full Product Catalog | ${SITE_NAME}`,
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
  name: `Full Product Catalog | ${SITE_NAME}`,
  description: DESCRIPTION,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: catalog.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/products/${product.slug}`,
      name: product.name,
    })),
  },
};

export default function ProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            <CatalogBrowser />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
