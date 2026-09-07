import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Award, Check, ListChecks, Minus, Scale } from "lucide-react";
import { CATEGORY_PLACEHOLDER_IMAGE, CATEGORY_VISUAL, catalog, type CatalogProduct } from "@/lib/catalog";
import type { CompetitorMatch } from "@/lib/fullCompare";
import { getReturnPolicy, getRetailerReturnPolicy } from "@/lib/site-config";
import Carousel from "@/components/ui/carousel";
import AskAboutProductButton from "@/components/AskAboutProductButton";

// Competitor prices are quoted with the pack size where one was published:
// "~$20 / 500 ct". Split it out so the quantity can sit in its own row against
// our `size`, instead of being buried in the price cell where nobody reads it.
// A bare "~$10-19" has no published pack size, and says so rather than guessing.
function unitFor(c: CompetitorMatch): string {
  const slash = c.price.indexOf("/");
  return slash === -1 ? "Not listed" : c.price.slice(slash + 1).trim();
}

// ...and drop it from the price cell, so "~$88 / 30 mL" doesn't print its
// pack size next to a row that already states it.
function priceOnly(c: CompetitorMatch): string {
  const slash = c.price.indexOf("/");
  return slash === -1 ? c.price : c.price.slice(0, slash).trim();
}

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-linear-to-br from-accent to-[#8a6d3b] text-accent-foreground shadow-md shadow-amber-900/40 ring-1 ring-inset ring-white/25",
  New: "bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-inset ring-white/25",
  "Staff Pick": "bg-amber-500 text-black",
};

export default function ProductDetail({
  product,
  competitors,
}: {
  product: CatalogProduct;
  competitors: CompetitorMatch[];
}) {
  const sameCategory = catalog.filter((p) => p.category === product.category && p.slug !== product.slug);
  const slides = [product, ...sameCategory.slice(0, 5)].map((p) => ({
    title: p.name,
    button: p.slug === product.slug ? "This product" : "View details",
    src: CATEGORY_PLACEHOLDER_IMAGE[p.category],
  }));
  const visual = CATEGORY_VISUAL[product.category];
  const image = product.image ?? visual.image;
  const photoStyle = product.image ? product.photoStyle : visual.photoStyle;

  // Costco's satisfaction guarantee carries no time limit except on
  // electronics, so for anything but Water & Air Treatment they outlast our
  // window and the return row is not ours to claim.
  const outlastsEveryRetailer = !competitors.some(
    (c) => c.retailer === "Costco" && product.category !== "Water & Air Treatment",
  );

  return (
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-16">
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Back to catalog
      </Link>

      {image ? (
        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-black">
          <div
            aria-hidden
            className={`absolute inset-0 m-auto h-32 w-32 rounded-full bg-linear-to-br ${visual.gradient} opacity-60 blur-3xl`}
          />
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 448px, 90vw"
            style={
              photoStyle === "card"
                ? {
                    objectFit: "contain",
                    maskImage: "radial-gradient(ellipse 60% 60% at 50% 46%, black 45%, transparent 88%)",
                    WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 46%, black 45%, transparent 88%)",
                  }
                : { objectFit: "contain" }
            }
            className={photoStyle === "card" ? "p-10" : "p-8 drop-shadow-2xl"}
          />
          {product.badge && (
            <span
              className={`absolute top-4 right-4 z-20 rounded-full px-3 py-1 text-xs font-semibold ${BADGE_STYLES[product.badge]}`}
            >
              {product.badge}
            </span>
          )}
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl bg-black pt-10 pb-24">
          <Carousel slides={slides} />
          {product.badge && (
            <span
              className={`absolute top-4 right-4 z-20 rounded-full px-3 py-1 text-xs font-semibold ${BADGE_STYLES[product.badge]}`}
            >
              {product.badge}
            </span>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="text-xs font-medium tracking-wide text-accent uppercase">
            {product.category}
          </span>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight wrap-break-word">{product.name}</h1>
          <p className="mt-1 text-sm text-muted">{product.size}</p>
        </div>

        <div className="shrink-0 sm:text-right">
          <span className="text-2xl font-semibold tracking-tight">{product.price}</span>
          {product.priceStatus === "on-request" && (
            <p className="text-xs text-muted">not publicly listed, ask for current price</p>
          )}
        </div>
      </div>

      <p className="mt-6 text-lg">{product.hook}</p>
      <p className="mt-3 text-muted">{product.description}</p>

      <div className="mt-12">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-muted uppercase">
          <ListChecks size={15} />
          What&apos;s inside
        </h2>
        <ul className="flex flex-col gap-3">
          {product.ingredients.map((ingredient) => (
            <li key={ingredient} className="flex items-start gap-3 text-sm">
              <Check size={16} className="mt-0.5 shrink-0 text-accent" />
              <span>{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold tracking-wide text-muted uppercase">
          <Scale size={15} />
          Why ours wins
        </h2>
        <p className="mb-4 text-xs text-muted">
          Read across any column to see how {product.name} beats that specific
          alternative. Their prices are listed exactly as they are, so check any of
          them yourself.
        </p>

        {competitors.length === 0 ? (
          <p className="text-sm text-muted">
            No direct comparison is available for this product yet. Reach out and we&apos;ll help you compare it.
          </p>
        ) : (
          <div className="hide-scrollbar overflow-x-auto rounded-2xl border border-border shadow-lg shadow-black/20">
            <table className="w-full min-w-160 border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="sticky left-0 z-10 w-24 bg-background p-4 text-left text-xs font-medium tracking-wide text-muted uppercase">
                    &nbsp;
                  </th>
                  {/* Our column is the hero: filled accent badge, solid white
                      name. Competitors are deliberately quieter so a skim reads
                      ours as the answer and theirs as the alternatives. */}
                  <th className="border-l-2 border-accent bg-surface p-4 text-left align-top">
                    <span className="mb-1 flex w-fit items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
                      <Award size={11} />
                      Our pick
                    </span>
                    <span className="block font-semibold">{product.name}</span>
                  </th>
                  {competitors.map((c) => (
                    <th key={c.name} className="border-l border-border bg-background p-4 text-left align-top">
                      <span className="mb-1 block w-fit rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted">
                        {c.retailer}
                      </span>
                      <span className="block font-medium text-muted">{c.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  // Quantity first, and directly above price. Without it the
                  // table set "$66.00" beside "~$10-19" with nothing to show
                  // they are different amounts of different things - the single
                  // most misleading thing on the page, and it read against us.
                  {
                    label: "What you get",
                    ours: <span className="text-xs">{product.size}</span>,
                    theirs: (c: CompetitorMatch) => <span className="text-xs">{unitFor(c)}</span>,
                  },
                  {
                    label: "Made in",
                    ours: product.madeIn,
                    theirs: (c: CompetitorMatch) => c.madeIn,
                  },
                  {
                    label: "Return policy",
                    // Against Amazon (1 month, opened hygiene items final sale)
                    // and Walmart (3 months, opened items in-store only) the
                    // guarantee is a clear win and should be marked as one.
                    //
                    // Against Costco it is not: their guarantee has no time
                    // limit at all outside electronics, so it genuinely beats
                    // our window. Ticking it there would be a plain false
                    // claim, and a comparison table caught overclaiming once
                    // forfeits the reader's trust on every other row.
                    oursWins: outlastsEveryRetailer,
                    ours: <span className="text-xs">{getReturnPolicy(product.category)}</span>,
                    theirs: (c: CompetitorMatch) => (
                      <span className="text-xs">{getRetailerReturnPolicy(c.retailer, product.category)}</span>
                    ),
                  },
                  // Price sits after the rows we win on, not first. It is the
                  // one axis where a bulk supermarket multivitamin beats us, and
                  // leading with it framed the whole table around our weakest
                  // number. The figure itself is unchanged.
                  {
                    label: "Price",
                    ours: <span className="font-semibold tabular-nums">{product.price}</span>,
                    theirs: (c: CompetitorMatch) => (
                      <span className="font-semibold tabular-nums text-muted">{priceOnly(c)}</span>
                    ),
                  },
                ].map(({ label, ours, theirs, oursWins }, i) => {
                  const rowBg = i % 2 === 1 ? "bg-surface/50" : "";
                  return (
                    <tr key={label} className={`border-b border-border ${rowBg}`}>
                      <td className={`sticky left-0 z-10 bg-background p-4 text-xs font-medium tracking-wide text-muted uppercase ${rowBg}`}>
                        {label}
                      </td>
                      <td className="border-l-2 border-accent bg-surface p-4">
                        {oursWins ? (
                          <span className="flex items-start gap-1.5">
                            <Check size={13} className="mt-0.5 shrink-0 text-accent" />
                            <span>{ours}</span>
                          </span>
                        ) : (
                          ours
                        )}
                      </td>
                      {competitors.map((c) => (
                        <td key={c.name} className={`border-l border-border p-4 ${rowBg}`}>
                          {theirs(c)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                <tr className="border-b border-border">
                  <td className="sticky left-0 z-10 bg-background p-4 align-top text-xs font-medium tracking-wide text-muted uppercase">
                    Ingredients
                  </td>
                  <td className="border-l-2 border-accent bg-surface p-4 align-top">
                    <ul className="flex flex-col gap-1.5 text-xs">
                      {product.ingredients.map((ingredient) => (
                        <li key={ingredient} className="flex items-start gap-1.5">
                          <Check size={12} className="mt-0.5 shrink-0 text-accent" />
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </td>
                  {competitors.map((c) => (
                    <td key={c.name} className="border-l border-border p-4 align-top text-xs text-muted">
                      {/* Ours is a ticked list of what you get; theirs is prose
                          about what differs. Without a marker the two read as
                          equivalent specs instead of a list versus a caveat. */}
                      <span className="flex items-start gap-1.5">
                        <Minus size={12} className="mt-0.5 shrink-0 opacity-60" />
                        <span>{c.difference}</span>
                      </span>
                    </td>
                  ))}
                </tr>
                {/* The text in each competitor column is OUR argument against
                    that competitor, not a description of them. Sitting bare in
                    their column it read like their sales pitch, which is the
                    opposite of the point, hence the explicit "Beats <name>"
                    lead-in and accent styling marking it as our voice. */}
                <tr className="bg-accent/5">
                  <td className="sticky left-0 z-10 bg-background p-4 align-top text-xs font-medium tracking-wide text-accent uppercase">
                    Why ours wins
                  </td>
                  <td className="border-l-2 border-accent bg-surface p-4 align-top">
                    <span className="flex items-start gap-1.5 text-xs font-medium text-accent">
                      <Award size={14} className="mt-0.5 shrink-0" />
                      {product.hook}
                    </span>
                  </td>
                  {competitors.map((c) => (
                    <td key={c.name} className="border-l border-border p-4 align-top text-xs">
                      <span className="mb-1.5 flex items-center gap-1 font-semibold text-accent uppercase">
                        <Check size={12} className="shrink-0" />
                        Beats {c.name}
                      </span>
                      <span className="block text-foreground">{c.advantage}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AskAboutProductButton slug={product.slug} name={product.name} category={product.category} />
    </div>
  );
}
