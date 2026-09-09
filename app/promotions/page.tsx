import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromotionsEditorial from "@/components/PromotionsEditorial";
import JsonLd from "@/components/JsonLd";
import {
  currentMonth,
  discountLabel,
  formatLongDay,
  monthLabel,
  productsInPromotion,
  promoPrice,
  promotionsForMonth,
  spellCount,
} from "@/lib/promotions";
import { absoluteUrl, breadcrumbJsonLd, ORGANIZATION_ID } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

// The page is built around "what month is it", so a fully static build would
// keep serving the month it was deployed in until the next deploy. An hourly
// revalidate means the listing rolls over on its own the night a month ends.
// Must stay a literal: Next requires the value to be statically analyzable.
export const revalidate = 3600;

const DESCRIPTION =
  "Save 15% on every Artistry Go Vibrant light up lip glow shade and 15% on the entire XS energy drink range this month. Every price shown up front, no codes, no minimum order.";

export const metadata: Metadata = {
  // Bare title: the root layout's template appends "| Longitivity".
  title: "This Month's Promotions & Offers",
  description: DESCRIPTION,
  keywords: [
    "Amway promotions",
    "Artistry lip gloss sale",
    "Artistry Go Vibrant discount",
    "XS energy drink deal",
    "XS energy discount",
    "monthly wellness offers",
    "Artistry offers this month",
  ],
  alternates: { canonical: "/promotions" },
  openGraph: {
    url: "/promotions",
    title: `Promotions This Month | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
  twitter: {
    title: `Promotions This Month | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Promotions", path: "/promotions" },
]);

export default function PromotionsPage() {
  const { year, month } = currentMonth();
  const promotions = promotionsForMonth(year, month);
  const label = monthLabel(year, month);
  // Spelled out for the headline: "Two favourites" is written the way a house
  // would set it, where "2 favourites" reads like a filter result.
  const countWord = spellCount(promotions.length);
  const headlineCount = countWord.charAt(0).toUpperCase() + countWord.slice(1);
  const productCount = promotions.reduce(
    (total, promo) => total + productsInPromotion(promo).length,
    0,
  );

  // Each discounted item is emitted as an Offer with its promotional price and
  // the date the offer stops being valid, which is what lets a rich result show
  // the sale price rather than the catalog one. Items whose price cannot be
  // discounted arithmetically are left out instead of guessed at.
  const offers = promotions.flatMap((promo) =>
    productsInPromotion(promo).flatMap((product) => {
      const price = promoPrice(product, promo.discount);
      if (!price) return [];
      return [
        {
          "@type": "Offer",
          name: `${product.name} - ${discountLabel(promo.discount)}`,
          url: absoluteUrl(`/products/${product.slug}`),
          price: price.now.replace("$", ""),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          priceValidUntil: promo.end,
          itemOffered: {
            "@type": "Product",
            name: product.name,
            category: product.category,
            ...(product.image ? { image: absoluteUrl(product.image) } : {}),
          },
        },
      ];
    }),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/promotions"),
    url: absoluteUrl("/promotions"),
    name: `Promotions This Month | ${SITE_NAME}`,
    description: DESCRIPTION,
    isPartOf: { "@id": absoluteUrl("/#website") },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: offers.length,
      itemListElement: offers.map((offer, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: offer,
      })),
    },
  };

  // Every promotion this month closes on the same day in practice, so the
  // masthead can state one date. Taken as the latest, not the first, so a
  // shorter offer inside the month never overstates the deadline.
  const closes = promotions.reduce<string | null>(
    (latest, promo) => (latest === null || promo.end > latest ? promo.end : latest),
    null,
  );

  return (
    <>
      <JsonLd data={[jsonLd, breadcrumbs]} />
      <Navbar />
      <main className="flex-1">
        {/* Masthead. Type-only over an ambient gold wash: the two chapters
            below each carry a photograph, and a third competing image up here
            would leave the page with no quiet opening. */}
        <section className="relative overflow-hidden border-b border-border px-6 pt-36 pb-20 sm:pt-44 sm:pb-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 82% 4%, rgba(198, 161, 92, 0.16) 0%, transparent 62%), radial-gradient(ellipse 45% 45% at 4% 96%, rgba(198, 161, 92, 0.07) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-6xl">
            <div className="flex items-center gap-4">
              <span aria-hidden className="h-px w-8 bg-accent" />
              <p className="font-mono text-[11px] tracking-[0.3em] text-accent uppercase">
                {label} · The Edit
              </p>
            </div>

            {/* max-w-4xl and a tightened leading: at 3xl the last word fell to
                a line of its own, which left the masthead with an orphan. */}
            <h1 className="mt-10 max-w-4xl font-serif text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl lg:text-7xl">
              {promotions.length === 0 ? (
                <>
                  Between edits,{" "}
                  <span className="text-accent/85 italic">for the moment.</span>
                </>
              ) : (
                <>
                  {headlineCount}{" "}
                  {promotions.length === 1 ? "favourite" : "favourites"},{" "}
                  <span className="text-accent/85 italic">yours for less.</span>
                </>
              )}
            </h1>

            {/* Deliberately says nothing about how many: the headline already
                counts them, and hardcoding "two" here would quietly go wrong
                the first month a third offer is added. */}
            <p className="mt-8 max-w-lg leading-relaxed text-muted">
              {promotions.length === 0 ? (
                <>
                  No offers are running just now. Everything in the catalog is
                  at its standard price, with the full ingredient list on every
                  product.
                </>
              ) : (
                <>
                  No codes, no minimums, nothing added at checkout. Just the
                  price you actually pay. When {label.split(" ")[0]} ends, so do
                  these prices.
                </>
              )}
            </p>

            {/* Masthead spec row: the practical questions answered before the
                reader has scrolled anywhere. */}
            {promotions.length > 0 && (
              <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-y-7 border-t border-border pt-8 sm:grid-cols-3">
                <div>
                  {/* Not "In this edit": the contents list below already uses
                      that as its heading, and the two together read as the
                      same label twice. */}
                  <dt className="text-[10px] tracking-[0.2em] text-muted uppercase">
                    Ranges
                  </dt>
                  <dd className="mt-2 font-serif text-xl">{promotions.length}</dd>
                </div>
                <div>
                  <dt className="text-[10px] tracking-[0.2em] text-muted uppercase">
                    Products included
                  </dt>
                  <dd className="mt-2 font-serif text-xl">{productCount}</dd>
                </div>
                {closes && (
                  <div>
                    <dt className="text-[10px] tracking-[0.2em] text-muted uppercase">
                      Closes
                    </dt>
                    <dd className="mt-2 font-serif text-xl">{formatLongDay(closes)}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </section>

        <PromotionsEditorial promotions={promotions} />
      </main>
      <Footer />
    </>
  );
}
