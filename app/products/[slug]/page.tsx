import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import { catalog, type CatalogProduct } from "@/lib/catalog";
import { fullCompare } from "@/lib/fullCompare";
import { SITE_NAME } from "@/lib/site-config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://longitivity.vercel.app";

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
  "n* by Nutrilite",
  "Nutrilite",
  "Artistry",
  "Satinique",
  "Glister",
  "g&h",
  "G&H",
  "Atmosphere Sky",
  "eSpring",
  "XS",
  "SA8",
  "L.O.C.",
  "Pursue",
  "Dish Drops",
].sort((a, b) => b.length - a.length);

// SA8 and L.O.C. are no longer an official partner brand (dropped from the
// roster), so still detect them by name but label the result generically.
const BRAND_DISPLAY_OVERRIDE: Record<string, string> = {
  SA8: "Home",
  "L.O.C.": "Home",
};

function brandFor(product: CatalogProduct): string {
  const match = KNOWN_BRANDS.find((b) => product.name.toLowerCase().includes(b.toLowerCase()));
  if (!match) return SITE_NAME;
  return BRAND_DISPLAY_OVERRIDE[match] ?? match;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = catalog.find((p) => p.slug === slug);
  if (!product) return {};

  const title = `${product.name} | ${SITE_NAME}`;
  const image = product.image ? [encodeURI(product.image)] : undefined;

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
      url: `/products/${product.slug}`,
      title,
      description: product.description,
      images: image,
    },
    twitter: {
      title,
      description: product.description,
      images: image,
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

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    ...(product.image ? { image: `${SITE_URL}${encodeURI(product.image)}` } : {}),
    brand: { "@type": "Brand", name: brandFor(product) },
    ...(price !== undefined
      ? {
          offers: {
            "@type": "Offer",
            url: `${SITE_URL}/products/${product.slug}`,
            priceCurrency: "USD",
            price,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Products", item: `${SITE_URL}/products` },
      { "@type": "ListItem", position: 2, name: product.category, item: `${SITE_URL}/products?category=${encodeURIComponent(product.category)}` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${SITE_URL}/products/${product.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        <ProductDetail product={product} competitors={competitors} />
      </main>
      <Footer />
    </>
  );
}
