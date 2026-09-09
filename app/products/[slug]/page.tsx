import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import VariantNav from "@/components/VariantNav";
import JsonLd from "@/components/JsonLd";
import { catalog, type CatalogProduct } from "@/lib/catalog";
import { fullCompare } from "@/lib/fullCompare";
import { categoryPath, CATEGORY_SEO_BY_NAME } from "@/lib/categories";
import { absoluteUrl, breadcrumbJsonLd, ORGANIZATION_ID } from "@/lib/seo";
import { promoMarks, type PromoMark } from "@/lib/promotions";
import { SITE_NAME } from "@/lib/site-config";

export function generateStaticParams() {
  return catalog.map((product) => ({ slug: product.slug }));
}

// The Offer price and the on-page tag both come from today's date, so this
// page cannot be built once and left. Without a revalidate, structured data
// would go on asserting a sale price after the sale ended, which is exactly
// the mismatch that costs a rich result.
export const revalidate = 3600;

// "$86.00" -> 86, "Ask for current price" -> undefined. Structured data
// should only ever assert a price we can actually stand behind.
function parsePrice(product: CatalogProduct): number | undefined {
  if (product.priceStatus === "on-request") return undefined;
  const value = Number(product.price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

function toNumber(price: string): number | undefined {
  const value = Number(price.replace(/[^0-9.]/g, ""));
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

// Google truncates a result title around 60 characters, and the root layout
// template spends 14 of them on " | Longitivity". The budget has to account
// for that suffix and the modifier together - sizing it against the bare
// product name alone pushed 45 of 69 titles over the limit.
const TITLE_LIMIT = 60;
const BRAND_COST = ` | ${SITE_NAME}`.length;
const MODIFIER = " - Price & Ingredients";

// "Price & Ingredients" covers the two highest-intent modifiers people append
// to a product name, but it only earns its space on names short enough to keep
// the whole title intact.
function titleFor(product: CatalogProduct): string | { absolute: string } {
  const name = product.name;
  if (name.length + MODIFIER.length + BRAND_COST <= TITLE_LIMIT) return name + MODIFIER;
  if (name.length + BRAND_COST <= TITLE_LIMIT) return name;
  // Long enough that the name plus brand would be cut mid-word. Drop the brand
  // via `absolute` so the product name - the part people searched for - 
  // survives instead.
  return { absolute: name };
}

// Catalog blurbs run 41-96 characters, which leaves most of a ~160-character
// SERP snippet unused. This pads each one out with the facts people are
// actually searching on - price, size, origin - rather than a boilerplate tail
// repeated across all 69 pages, then clamps on a word boundary.
function metaDescription(product: CatalogProduct, promo?: PromoMark): string {
  const parts: string[] = [product.description.trim().replace(/\s+/g, " ")];
  if (!/[.!?]$/.test(parts[0])) parts[0] += ".";

  // Quote whatever the page itself is showing. A snippet advertising the list
  // price while the page displays a lower one reads as bait, and Google checks
  // the two against each other.
  parts.push(
    product.priceStatus === "on-request"
      ? `${product.size}, price on request.`
      : promo
        ? `${promo.now} for ${product.size}, ${promo.label} until ${promo.endsOn}.`
        : `${product.price} for ${product.size}.`,
  );

  if (product.madeIn && product.madeIn !== "Not publicly confirmed") {
    parts.push(`Made in ${product.madeIn}.`);
  }

  let out = "";
  for (const part of parts) {
    if (out && `${out} ${part}`.length > 158) break;
    out = out ? `${out} ${part}` : part;
  }

  // Longest closing line that still fits. Dropping it wholesale (the previous
  // behaviour) left 22 pages short of a usable snippet.
  const tails = [
    "Full ingredient list and an honest price comparison.",
    "Full ingredient list and price comparison.",
    "Full ingredient list.",
  ];
  const tail = tails.find((t) => `${out} ${t}`.length <= 158);
  return tail ? `${out} ${tail}` : out;
}

// Google suppresses an Offer whose priceValidUntil has passed, so this rolls
// a year forward from each build rather than hardcoding a date that silently
// expires. It is a "quoted until" marker, not a price lock.
function priceValidUntil(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}

/** "30 September" plus this year, as the YYYY-MM-DD schema.org wants. */
function promoEndsIso(promo: PromoMark): string {
  const [day, monthName] = promo.endsOn.split(" ");
  const month = MONTHS.indexOf(monthName) + 1;
  if (!month) return priceValidUntil();
  return `${new Date().getFullYear()}-${String(month).padStart(2, "0")}-${day.padStart(2, "0")}`;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

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

  const description = metaDescription(product, promoMarks()[product.slug]);

  return {
    title,
    description,
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
      description,
    },
    twitter: {
      title: ogTitle,
      description,
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

  // Shades and flavours share one formula, so they share the comparison. Fall
  // back to any sibling in the variant group rather than showing "no comparison
  // available" on three of four lip gloss shades.
  const ownComparison = fullCompare.find((c) => c.slug === slug)?.competitors;
  const groupComparison = product.variantGroup
    ? catalog
        .filter((p) => p.variantGroup === product.variantGroup)
        .map((p) => fullCompare.find((c) => c.slug === p.slug)?.competitors)
        .find((c) => c && c.length > 0)
    : undefined;
  const competitors = ownComparison?.length ? ownComparison : (groupComparison ?? []);
  const promo = promoMarks()[product.slug];
  // The Offer has to state the price on the page. Asserting the list
  // price while the page shows a discounted one is the mismatch Google
  // suppresses rich results over.
  const listPrice = parsePrice(product);
  const price = promo ? (toNumber(promo.now) ?? listPrice) : listPrice;

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
            // A promoted item genuinely reverts on a known date, so quote
            // that rather than the rolling one-year marker.
            priceValidUntil: promo ? promoEndsIso(promo) : priceValidUntil(),
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
        {/* Visible trail matching the BreadcrumbList payload. Google wants the
            structured data to reflect something actually on the page before it
            will render breadcrumbs in a result, and it gives every product an
            internal link up to its category. */}
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-24 text-xs text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/products" className="transition-colors hover:text-foreground">
                Products
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={categoryPath(product.category)}
                className="transition-colors hover:text-foreground"
              >
                {product.category}
              </Link>
            </li>
          </ol>
        </nav>
        <ProductDetail product={product} competitors={competitors} variantNav={<VariantNav product={product} />} />
      </main>
      <Footer />
    </>
  );
}
