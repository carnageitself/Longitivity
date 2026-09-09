import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  discountLabel,
  formatLongDay,
  productsInPromotion,
  promoPrice,
  promoSummary,
  promotionItemGroups,
  promotionStatus,
  spellCount,
  totalSaving,
  type Promotion,
} from "@/lib/promotions";

/**
 * The month's offers, set as an editorial feature rather than a sale grid.
 *
 * The brief was a page that reads like a luxury house's own site, and the
 * deliberate departures from the catalog pages are:
 *
 *  - No product cards. A bordered card with a glow and a price is a commerce
 *    pattern; it makes an offer look like clearance. Each promotion instead
 *    gets a chapter: one large photograph, a title, and the offer stated once
 *    in a hairline spec row - the device prestige houses use in place of a
 *    badge.
 *  - Offers are never shouted. No "SALE", no pills, no red. The discount is
 *    carried by typography and position, and the old price sits quietly beside
 *    the new one rather than being struck through in a louder colour.
 *  - A contents index up top, so the whole month is legible in one glance
 *    before any scrolling - the practical job a magazine's contents page does.
 *  - Long ranges are typeset, not photographed. Seventeen near-identical cans
 *    in a photo grid is noise; the same seventeen as a grouped price list is
 *    something a reader can scan.
 *
 * Server-rendered throughout, with the site's own CSS-only `reveal-up` for the
 * scroll entrance so no JavaScript is needed to see the page.
 */
export default function PromotionsEditorial({
  promotions,
  faqs = [],
}: {
  promotions: Promotion[];
  /** Rendered as well as marked up: FAQ rich results require visible text. */
  faqs?: { question: string; answer: string }[];
}) {
  if (promotions.length === 0) return <EmptyState />;

  return (
    <>
      <Contents promotions={promotions} />
      {promotions.map((promo, i) => (
        <Chapter key={promo.id} promo={promo} index={i + 1} />
      ))}
      {faqs.length > 0 && <Questions faqs={faqs} />}
      <Closing />
    </>
  );
}

/* --------------------------------- questions --------------------------------- */

/**
 * The practical questions, set as a plain hairline list.
 *
 * Carries the FAQPage markup emitted by the page, and Google only credits that
 * where the same text is on the page, so this is not decoration. It is also the
 * only place a crawler can find the student session offer, which otherwise
 * lives entirely inside a client-side dialog.
 */
function Questions({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <section className="border-b border-border px-6" aria-labelledby="promo-faq-heading">
      <div className="mx-auto max-w-3xl py-20 sm:py-24">
        <h2
          id="promo-faq-heading"
          className="text-[11px] font-medium tracking-[0.25em] text-muted uppercase"
        >
          Before you ask
        </h2>

        <dl className="mt-10 border-t border-border">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b border-border py-7">
              <dt className="font-serif text-xl font-medium tracking-tight sm:text-2xl">
                {faq.question}
              </dt>
              <dd className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------------------------------- contents --------------------------------- */

function Contents({ promotions }: { promotions: Promotion[] }) {
  return (
    <section className="border-b border-border px-6" aria-labelledby="contents-heading">
      <div className="mx-auto max-w-6xl py-16 sm:py-20">
        <h2
          id="contents-heading"
          className="text-[11px] font-medium tracking-[0.25em] text-muted uppercase"
        >
          What&apos;s on offer
        </h2>

        <ol className="mt-8 border-t border-border">
          {promotions.map((promo, i) => (
            <li key={promo.id} className="border-b border-border">
              <Link
                href={`#${promo.id}`}
                className="group flex flex-wrap items-baseline gap-x-6 gap-y-2 py-6 sm:py-7"
              >
                <span className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* Fixed width from the sm breakpoint up: brand names differ in
                    length ("XS" against "ARTISTRY"), and left to size
                    themselves the titles started at a different x on each row. */}
                <span className="text-[11px] tracking-[0.25em] text-muted uppercase sm:w-24 sm:shrink-0">
                  {promo.brand}
                </span>
                <span className="w-full font-serif text-2xl font-medium tracking-tight transition-colors group-hover:text-accent sm:w-auto sm:flex-1 sm:text-3xl">
                  {promo.name}
                </span>
                <span className="ml-auto flex items-baseline gap-3">
                  <span className="font-serif text-xl text-accent sm:text-2xl">
                    {discountLabel(promo.discount)}
                  </span>
                  <ArrowRight
                    size={15}
                    className="translate-y-px text-muted transition-all group-hover:translate-x-1 group-hover:text-accent"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------- chapter ---------------------------------- */

/**
 * Dissolves the named edges of a photograph into the page.
 *
 * These shots are lit on black and end mid-subject: the reflection runs off the
 * bottom of the frame and, on the Artistry shot, the rock on the right stops at
 * the edge instead of resolving. Unmasked, that reads as a photo that has been
 * cropped rather than one that fades into the page.
 *
 * Written as whole classes rather than composed from a `mask-${side}` fragment,
 * because Tailwind scans source text for complete class names and would not
 * emit CSS for a name it never sees spelled out. The percentages differ by axis
 * on purpose: the bottom can start early since only reflection sits down there,
 * while the sides have to stay late to keep from dimming the product itself.
 *
 * Tailwind composites the per-side mask layers by intersection, so naming two
 * edges fades the corner between them rather than fighting.
 */
function edgeFadeClasses(fade: Promotion["image"]["fade"]): string {
  if (!fade?.length) return "";
  const CLASSES = {
    bottom: "mask-b-from-72%",
    right: "mask-r-from-82%",
    left: "mask-l-from-82%",
  } as const;
  return fade.map((edge) => CLASSES[edge]).join(" ");
}

function Chapter({ promo, index }: { promo: Promotion; index: number }) {
  const products = productsInPromotion(promo);
  const summary = promoSummary(promo);
  const status = promotionStatus(promo);
  // Alternating sides keep a two-chapter page from reading as a repeated
  // template, which is the tell of a listing page.
  const mirrored = index % 2 === 0;

  return (
    <section id={promo.id} className="scroll-mt-16 border-b border-border px-6">
      <div className="mx-auto max-w-6xl py-20 sm:py-28">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* The photograph. Lit on black, so it is mounted with no frame and
              no plate: the edges dissolve into the page. */}
          <figure className={`reveal-up relative ${mirrored ? "lg:order-2" : ""}`}>
            <div className="relative aspect-4/3 w-full">
              <Image
                src={promo.image.src}
                alt={promo.image.alt}
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                quality={90}
                priority={index === 1}
                className={`object-contain ${edgeFadeClasses(promo.image.fade)}`}
              />
            </div>
          </figure>

          <div className={mirrored ? "lg:order-1" : ""}>
            <div className="flex items-center gap-4">
              <span aria-hidden className="h-px w-8 bg-accent" />
              <p className="font-mono text-[11px] tracking-[0.25em] text-accent uppercase">
                {String(index).padStart(2, "0")} · {promo.brand}
              </p>
            </div>

            <h2 className="mt-6 font-serif text-4xl font-medium tracking-tight sm:text-5xl">
              {promo.name}
            </h2>

            <p className="mt-6 max-w-xl leading-relaxed text-muted">{promo.blurb}</p>

            {/* The offer, stated once. Hairline rules and small caps labels do
                the work a discount badge would otherwise do, without the
                bargain-bin connotation. */}
            {/* gap-x matters here: this row sits inside one half of the split,
                so three columns are narrow, and a price range at full size ran
                straight into the date beside it. The offer keeps the larger
                size, the two supporting figures step down - deliberate
                hierarchy rather than three equal shouts. */}
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-border py-7 sm:grid-cols-3">
              <div>
                <dt className="text-[10px] tracking-[0.2em] text-muted uppercase">
                  The offer
                </dt>
                <dd className="mt-2 font-serif text-2xl text-accent">
                  {discountLabel(promo.discount)}
                </dd>
              </div>

              {summary && (
                <div>
                  <dt className="text-[10px] tracking-[0.2em] text-muted uppercase">
                    Per {promo.unit}
                  </dt>
                  <dd className="mt-2 font-serif text-xl">
                    {summary.kind === "uniform" ? (
                      <span className="sm:whitespace-nowrap">
                        {summary.now}
                        <span className="ml-2 align-middle text-sm text-muted line-through">
                          {summary.was}
                        </span>
                      </span>
                    ) : (
                      // Both ends, with the list prices underneath rather than
                      // inline: four figures on one line in a third of a split
                      // column is unreadable. "to" rather than a dash, which
                      // this page avoids. Only forced onto one line from sm:
                      // up - at the narrowest 2-column phone width, a range
                      // like "$37.40 to $41.01" is wider than the column and
                      // was pushing the whole page into horizontal overflow.
                      <>
                        <span className="sm:whitespace-nowrap">
                          {summary.nowLow} to {summary.nowHigh}
                        </span>
                        <span className="mt-1 block text-xs text-muted line-through sm:whitespace-nowrap">
                          {summary.wasLow} to {summary.wasHigh}
                        </span>
                      </>
                    )}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-[10px] tracking-[0.2em] text-muted uppercase">
                  {status.state === "upcoming" ? "Opens" : "Through"}
                </dt>
                <dd className="mt-2 font-serif text-xl whitespace-nowrap">
                  {formatLongDay(status.state === "upcoming" ? promo.start : promo.end)}
                </dd>
              </div>
            </dl>

            <Link
              href={promo.cta.href}
              className="group mt-9 inline-flex items-center gap-2 text-sm tracking-wide text-foreground"
            >
              <span className="border-b border-accent/40 pb-1 transition-colors group-hover:border-accent">
                {promo.cta.label}
              </span>
              <ArrowUpRight
                size={15}
                className="text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>

        {/* What is included, then why it beats the alternatives: see it, then
            be given the argument for it, in that order. */}
        {promo.gallery && (
          <div className="mt-20 sm:mt-24">
            <Gallery promo={promo} count={products.length} />
          </div>
        )}

        {promo.comparison && (
          <div className="mt-20 sm:mt-24">
            <Comparison
              comparison={promo.comparison}
              brand={promo.brand}
              // Only a range priced at one figure has a single offer price
              // to show; a spread has nothing meaningful to put in a cell.
              offerPrice={summary?.kind === "uniform" ? summary.now : undefined}
            />
          </div>
        )}

        <p className="mt-14 max-w-2xl border-t border-border pt-6 text-xs leading-relaxed text-muted">
          {promo.terms}
          {products.some((p) => p.priceStatus !== "confirmed") &&
            " Some figures in this range are listed as estimates rather than confirmed prices; the discount is applied to the confirmed price at order time."}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------- item listings ------------------------------- */

/**
 * Small-caps label with the saving spelled out underneath.
 *
 * The figure is the persuasive part and it is computed, never written by hand:
 * what someone keeps is the reason they act, and stating it in dollars is more
 * convincing than restating the percentage they already read above.
 */
function ListHeading({ label, note }: { label: string; note?: string | null }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
      <h3 className="text-[11px] font-medium tracking-[0.25em] text-muted uppercase">
        {label}
      </h3>
      {note && <p className="font-serif text-lg text-accent">{note}</p>}
    </div>
  );
}

/** A photograph each. For a handful of items where the difference is visual. */
function Gallery({ promo, count }: { promo: Promotion; count: number }) {
  const groups = promotionItemGroups(promo);
  const set = totalSaving(promo);

  return (
    <div>
      <ListHeading
        label={`${count} shades included`}
        note={set ? `Take all ${spellCount(count)} and you keep ${set}.` : null}
      />

      <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 sm:gap-x-10">
        {groups.flatMap((group) =>
          group.items.map(({ product, label }) => {
            const price = promoPrice(product, promo.discount);
            return (
              <li key={product.slug} className="reveal-up">
                <Link href={`/products/${product.slug}`} className="group block">
                  <div className="relative aspect-square">
                    {/* A pool of light behind the bottle instead of a card:
                        it lifts the product off black without drawing a box
                        around it. */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(ellipse 55% 55% at 50% 55%, rgba(198, 161, 92, 0.3) 0%, transparent 72%)",
                      }}
                    />
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(min-width: 640px) 220px, 45vw"
                        className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-1"
                      />
                    )}
                  </div>

                  <p className="mt-6 font-serif text-lg tracking-tight transition-colors group-hover:text-accent">
                    {label}
                  </p>
                  {price && (
                    <p className="mt-1.5 flex items-baseline gap-2 text-sm">
                      <span className="text-accent">{price.now}</span>
                      <span className="text-xs text-muted line-through">{price.was}</span>
                    </p>
                  )}
                </Link>
              </li>
            );
          }),
        )}
      </ul>
    </div>
  );
}

/**
 * How the range stands against the brands a shopper is really choosing between.
 *
 * This replaced a typeset list of our own seventeen flavours and their prices.
 * That list answered a question nobody had - the prices were nearly identical
 * down the whole column - where this answers the one they do have, which is
 * why this and not the can they already know.
 *
 * A real <table> because it is one: a row per brand, compared on a single
 * stated basis. Rivals are listed most expensive or most sugar-laden first so
 * the eye travels down to our row, which is the only one in accent.
 */
function Comparison({
  comparison,
  brand,
  offerPrice,
}: {
  comparison: NonNullable<Promotion["comparison"]>;
  brand: string;
  /** What the item costs under the running offer, for the price column. */
  offerPrice?: string;
}) {
  const { basis, columns, rivals, ours, edge, priceColumn } = comparison;

  return (
    <div className="reveal-up">
      <ListHeading label={`Why ${brand}`} note={null} />

      <table className="mt-8 w-full max-w-3xl border-collapse text-left">
        <caption className="sr-only">
          {brand} compared with {rivals.map((r) => r.name).join(", ")}. {basis}.
        </caption>
        <thead>
          <tr className="border-b border-border">
            <th className="w-[26%] py-3 pr-4 text-[10px] font-medium tracking-[0.2em] text-muted uppercase">
              <span className="sr-only">Brand</span>
            </th>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="py-3 pr-4 text-[10px] font-medium tracking-[0.2em] text-muted uppercase last:pr-0"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Keyed on brand *and* product: Estée Lauder appears twice, once for
              the glosstick and once for the lip oil, so the brand alone is not
              unique and React warned about duplicate keys. */}
          {rivals.map((rival, rowIndex) => (
            <tr
              key={`${rival.name}-${rival.product ?? rowIndex}`}
              className="border-b border-border/70 align-top"
            >
              <th scope="row" className="py-3.5 pr-4 font-normal">
                <span className="block text-xs text-foreground/80 sm:text-sm">
                  {rival.name}
                </span>
                {rival.product && (
                  <span className="mt-0.5 block text-[11px] text-muted">
                    {rival.product}
                  </span>
                )}
              </th>
              {rival.cells.map((cell, i) => (
                <td
                  key={columns[i] ?? i}
                  className="py-3.5 pr-4 text-xs text-muted last:pr-0 sm:text-sm"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}

          {/* Ours last and in accent: the row the others have been setting up. */}
          <tr className="border-b border-accent/30 align-top">
            <th scope="row" className="py-4 pr-4 font-normal">
              <span className="block font-serif text-base font-medium tracking-tight text-accent sm:text-lg">
                {ours.name}
              </span>
              {ours.product && (
                <span className="mt-0.5 block text-[11px] text-accent/70">
                  {ours.product}
                </span>
              )}
            </th>
            {ours.cells.map((cell, i) => (
              <td
                key={columns[i] ?? i}
                className="py-4 pr-4 text-xs font-medium text-accent last:pr-0 sm:text-sm"
              >
                {i === priceColumn && offerPrice ? (
                  <span className="whitespace-nowrap">
                    {offerPrice}
                    <span className="ml-1.5 text-muted line-through">{cell}</span>
                  </span>
                ) : (
                  cell
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">{edge}</p>
      <p className="mt-3 max-w-xl text-xs text-muted/70">{basis}.</p>
    </div>
  );
}

/* ---------------------------------- closing ---------------------------------- */

function Closing() {
  return (
    <section className="px-6">
      <div className="mx-auto max-w-2xl py-24 text-center sm:py-32">
        <p className="text-[11px] font-medium tracking-[0.25em] text-muted uppercase">
          Still deciding
        </p>
        <h2 className="mt-6 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
          Let&apos;s find the one you&apos;ll keep reaching for.
        </h2>
        {/* Deliberately does not restate the terms or the deadline: the
            masthead says both, and hearing them twice on one page makes the
            second one read as filler. This block has one job, which is to make
            asking feel easy. */}
        <p className="mt-5 leading-relaxed text-muted">
          Tell me what you&apos;re after and I&apos;ll point you to the right
          shade or flavour. Or ask for a sample first, and try it before you
          commit to anything.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
          >
            Get a personal recommendation
          </Link>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <span className="border-b border-border pb-1 transition-colors group-hover:border-accent">
              Browse the full catalog
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- empty state -------------------------------- */

function EmptyState() {
  return (
    <section className="px-6">
      <div className="mx-auto max-w-2xl py-28 text-center sm:py-36">
        <span aria-hidden className="mx-auto block h-px w-12 bg-accent" />
        <h2 className="mt-10 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
          Next month&apos;s edit is on its way.
        </h2>
        <p className="mt-5 leading-relaxed text-muted">
          Nothing is running just now, so everything in the catalog sits at its
          standard price, with the full ingredient list on every product. Worth
          checking back when the month turns.
        </p>
        <Link
          href="/products"
          className="group mt-9 inline-flex items-center gap-2 text-sm text-foreground"
        >
          <span className="border-b border-accent/40 pb-1 transition-colors group-hover:border-accent">
            Browse the full catalog
          </span>
          <ArrowUpRight size={15} className="text-accent" />
        </Link>
      </div>
    </section>
  );
}
