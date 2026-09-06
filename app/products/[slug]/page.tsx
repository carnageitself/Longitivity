import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import JsonLd from "@/components/JsonLd";
import { catalog, type CatalogProduct } from "@/lib/catalog";
import { fullCompare } from "@/lib/fullCompare";
import { categoryPath, CATEGORY_SEO_BY_NAME } from "@/lib/categories";
import { absoluteUrl, breadcrumbJsonLd, ORGANIZATION_ID } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export function generateStaticParams() {
  return catalog.map((product) => ({ slug: product.slug }));
}

// "$86.00" -> 86, "Ask for current price" -> undefined. Structured data
// should only ever assert a price we can actually stand behind.
function parsePrice(product: CatalogProduct): number | undefined {
  if (product.priceStatus === "on-request") return undefined;
  const value = Number(product.price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

// Longest-match-first so "Atmosphere Sky" wins over the bare "Atmosphere",
// and generic house items (bleach, scouring pads, etc.) fall back to the
// storefront name rather than a nonsense guess from the first word.
const KNOWN_BRANDS = [
  "Nutrilite",
  "Artistry",
  "Satinique",
  "Glister",
  "g&h",
  "G&H",
  "Atmosphere Sky",
  "eSpring",
  "XS",
  "Pursue",
  "Dish Drops",
].sort((a, b) => b.length - a.length);

function brandFor(product: CatalogProduct): string {
  const match = KNOWN_BRANDS.find((b) => product.name.toLowerCase().includes(b.toLowerCase()));
  return match ?? SITE_NAME;
}

// "Price & Ingredients" covers the two highest-intent modifiers people append
// to a product name, but only where the name is short enough that the whole
// title still survives Google's ~60-character truncation.
function titleFor(product: CatalogProduct): string {
  return product.name.length <= 40 ? `${product.name} — Price & Ingredients` : product.name;
}

// Google suppresses an Offer whose priceValidUntil has passed, so this rolls
// a year forward from each build rather than hardcoding a date that silently
// expires. It is a "quoted until" marker, not a price lock.
function priceValidUntil(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = catalog.find((p) => p.slug === slug);
  if (!product) return {};

  // Bare title: the root layout template appends the brand. Passing it here
  // as well is what produced "... | Longitivity | Longitivity".
  const title = titleFor(product);
  const ogTitle = `${product.name} | ${SITE_NAME}`;
  // No `images` here on purpose. The sibling opengraph-image.tsx renders a
  // branded 1200x630 card; setting openGraph.images explicitly would override
  // it and go back to sharing the bare product JPG, which is the wrong aspect
  // ratio and shows a white box on every dark-themed social client.

  return {
    title,
    description: product.description,
    keywords: [
      product.name,
      product.category,
      `buy ${product.name}`,
      `${product.name} price`,
      `${product.name} ingredients`,
    ],
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      url: `/products/${product.slug}`,
      title: ogTitle,
      description: product.description,
    },
    twitter: {
      title: ogTitle,
      description: product.description,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = catalog.find((p) => p.slug === slug);
  if (!product) notFound();

  const competitors = fullCompare.find((c) => c.slug === slug)?.competitors ?? [];
  const price = parsePrice(product);

  const url = absoluteUrl(`/products/${product.slug}`);

  // Return window in days, taken from the same policy the page renders to the
  // customer so the two can't drift apart. Water & Air gets a shorter window.
  const returnDays = product.category === "Water & Air Treatment" ? 120 : 180;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description,
    category: product.category,
    sku: product.slug,
    ...(product.image ? { image: absoluteUrl(product.image) } : {}),
    ...(product.madeIn && product.madeIn !== "Not publicly confirmed"
      ? { countryOfOrigin: product.madeIn }
      : {}),
    brand: { "@type": "Brand", name: brandFor(product) },
    ...(price !== undefined
      ? {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "USD",
            price,
            priceValidUntil: priceValidUntil(),
            itemCondition: "https://schema.org/NewCondition",
            availability: "https://schema.org/InStock",
            seller: { "@id": ORGANIZATION_ID },
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "US",
              returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: returnDays,
            },
          },
        }
      : {}),
  };

  const categoryEntry = CATEGORY_SEO_BY_NAME.get(product.category);

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    // Point at the indexable collection page rather than the old
    // `?category=` query string, which crawlers fold back into /products.
    { name: categoryEntry?.h1 ?? product.category, path: categoryPath(product.category) },
    { name: product.name, path: `/products/${product.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[productJsonLd, breadcrumbs]} />
      <Navbar />
      <main className="flex-1">
        <ProductDetail product={product} competitors={competitors} />
      </main>
      <Footer />
    </>
  );
}
