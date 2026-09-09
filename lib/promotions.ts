import { catalog, type CatalogCategory, type CatalogProduct } from "@/lib/catalog";

// Which catalog items a promotion applies to, kept declarative rather than as a
// predicate function so a promotion can be read and checked at a glance.
//
// "variantGroup" is the useful one for a shade or flavour range: it tracks the
// same field the product pages already switch on, so a fifth lip glow shade
// added to the catalog joins the promotion without anyone remembering to come
// back here and add its slug.
export type PromotionScope =
  | { type: "variantGroup"; value: string }
  | { type: "category"; value: CatalogCategory }
  | { type: "slugs"; value: string[] };

// How much comes off, applied to every product in scope.
//
// Both kinds are needed side by side: a percentage scales sensibly across a
// range whose prices differ (the XS cases are not all one figure), whereas a
// flat amount is the clearer promise on a range that is.
export type PromotionDiscount =
  | { type: "percent"; percentOff: number }
  | { type: "amount"; amountOff: number };

export type Promotion = {
  id: string;
  /** The range on offer, as a shopper would name it. */
  name: string;
  /** The house the range belongs to, set above the title on its chapter. */
  brand: string;
  discount: PromotionDiscount;
  headline: string;
  blurb: string;
  /** Inclusive window, as YYYY-MM-DD. See the note on comparisons below. */
  start: string;
  end: string;
  /** The small print: quantity caps, stacking, who it is open to. */
  terms: string;
  scope: PromotionScope;
  /**
   * The one photograph the chapter is built around. Both current shots are lit
   * on black, so they sit straight on the page with nothing behind them - the
   * frame edge disappears and the product reads as part of the page.
   *
   * `fade` names the edges to dissolve, for shots that run out mid-subject and
   * would otherwise show a hard seam where the photograph stops. Per image
   * rather than global: which edges need it depends on how the shot is
   * composed, and fading an edge that was not cut only dims real product.
   */
  image: {
    src: string;
    alt: string;
    fade?: Array<"bottom" | "right" | "left">;
  };
  /**
   * Show a photograph of every item in scope beneath the chapter. Right for a
   * short range where the difference is something you look at; left off for a
   * long one, where it becomes a wall of near-identical packaging.
   */
  gallery?: boolean;
  /**
   * How the range stands against the brands a shopper is actually choosing
   * between. Carries more weight than another list of our own SKUs, which is
   * what this replaced.
   *
   * IMPORTANT: the rival figures are the one thing on this page not sourced
   * from our own catalog. They are published headline numbers and they move
   * (formulations get reworked, prices get raised, and they differ by market
   * and by can size). Verify before publishing, and keep the hedged wording on
   * anything approximate - the same caution getRetailerReturnPolicy carries in
   * lib/site-config.ts.
   */
  comparison?: {
    /** What the figures are measured on, so the row is not read out of context. */
    basis: string;
    /** Column headings. Every row's `cells` must line up with these. */
    columns: string[];
    /**
     * `product` is the exact item being priced or measured, set as a second
     * line under the brand. It is what makes the row checkable rather than
     * asserted, and on the drinks it carries the can size - without which
     * "160 mg" against "114 mg" would be comparing a 16 oz can to a 12 oz one
     * and quietly flattering us.
     */
    rivals: Array<{ name: string; product?: string; cells: string[] }>;
    ours: { name: string; product?: string; cells: string[] };
    /**
     * Index of the column holding a price, where there is one.
     *
     * Our own cell there is authored as the list price so it lines up
     * like-for-like against the rivals' list prices. Set this and the table
     * additionally shows what the item costs under the running offer, with the
     * list price struck beside it. Without that, this row read as the one place
     * on a promotions page where the discount had not been applied.
     */
    priceColumn?: number;
    /** The "so what", in one line. */
    edge: string;
  };
  /** The unit being priced ("shade", "case"), for the spec row. */
  unit: string;
  cta: { href: string; label: string };
};

// Dates are compared as YYYY-MM-DD strings, never as Date objects.
//
// `new Date("2026-09-01")` is parsed as UTC midnight, so in any timezone west
// of UTC it lands on 31 August locally - which would have made a promotion
// starting on the 1st read as already running on the last day of the previous
// month. Lexicographic comparison of zero-padded ISO dates gives the same
// ordering as chronological comparison, with no timezone in the middle of it.
function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Last calendar day of a month. `day: 0` rolls back to the previous month's end. */
function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * The month a promotion listing should be built around, from the server's
 * current date. `getMonth()` is zero-based; everything here is 1-based.
 */
export function currentMonth(now = new Date()): { year: number; month: number } {
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function monthLabel(year: number, month: number): string {
  // Day 1 at local noon: far enough from either midnight that the formatter
  // cannot be pushed into an adjacent month by a timezone offset.
  return new Date(year, month - 1, 1, 12).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/**
 * Every promotion whose window touches the given month, earliest start first.
 *
 * Overlap rather than containment: a promotion that started in late August and
 * runs to 15 September is genuinely "happening this month", and hiding it
 * because it did not start inside the month would be the wrong answer for the
 * person reading the page.
 */
export function promotionsForMonth(year: number, month: number): Promotion[] {
  const firstDay = isoDate(year, month, 1);
  const finalDay = isoDate(year, month, lastDayOfMonth(year, month));

  return PROMOTIONS.filter(
    (promo) => promo.start <= finalDay && promo.end >= firstDay,
  ).sort((a, b) => a.start.localeCompare(b.start));
}

export type PromotionStatus =
  | { state: "live"; label: string }
  | { state: "upcoming"; label: string }
  | { state: "ended"; label: string };

/**
 * Where a promotion sits relative to today, so a month view can show the two
 * offers running right now differently from one that opens on the 15th.
 */
export function promotionStatus(promo: Promotion, now = new Date()): PromotionStatus {
  const today = isoDate(now.getFullYear(), now.getMonth() + 1, now.getDate());

  if (today < promo.start) {
    return { state: "upcoming", label: `Starts ${formatDay(promo.start)}` };
  }
  if (today > promo.end) {
    return { state: "ended", label: `Ended ${formatDay(promo.end)}` };
  }
  return { state: "live", label: `Ends ${formatDay(promo.end)}` };
}

/** "2026-09-30" -> "Sep 30". Split rather than parsed, to stay off Date entirely. */
function formatDay(date: string): string {
  const [, month, day] = date.split("-").map(Number);
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${MONTHS[month - 1]} ${day}`;
}

/** "2026-09-30" -> "30 September", for the spec row on each chapter. */
export function formatLongDay(date: string): string {
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const [, month, day] = date.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]}`;
}

export function productsInPromotion(promo: Promotion): CatalogProduct[] {
  const { scope } = promo;

  if (scope.type === "category") {
    return catalog.filter((product) => product.category === scope.value);
  }
  if (scope.type === "variantGroup") {
    return catalog.filter((product) => product.variantGroup === scope.value);
  }
  // Mapped over the declared slugs rather than filtered over the catalog, so
  // the listed order is honoured and a typo'd slug drops out instead of
  // silently pulling in nothing.
  return scope.value
    .map((slug) => catalog.find((product) => product.slug === slug))
    .filter((product): product is CatalogProduct => product !== undefined);
}

/**
 * The promotion running *today* that covers this product, if any.
 *
 * Used by the catalog and product pages to mark what is on offer. Deliberately
 * gated on "live" rather than merely belonging to this month's edit: an offer
 * that opens on the 15th must not put a discount tag on a product on the 3rd,
 * and one that closed on the 10th must not still be advertising itself.
 */
export function activePromotionFor(
  product: CatalogProduct,
  now = new Date(),
): Promotion | null {
  const { year, month } = currentMonth(now);

  return (
    promotionsForMonth(year, month).find(
      (promo) =>
        promotionStatus(promo, now).state === "live" &&
        productsInPromotion(promo).some((item) => item.slug === product.slug),
    ) ?? null
  );
}

/**
 * Everything a card or a product page needs to mark one item as on offer.
 *
 * Plain strings on purpose. The catalog browser is a client component, so this
 * has to cross the server/client boundary, which rules out passing a Promotion
 * (it holds no functions, but it is far more than a card needs) and rules out a
 * Set or a Map entirely.
 */
export type PromoMark = {
  /** "15% off" */
  label: string;
  was: string;
  now: string;
  /** "30 September" */
  endsOn: string;
};

/**
 * Every product on a live offer today, keyed by slug.
 *
 * Built once on the server and handed down, rather than each card working out
 * the date for itself. A client component calling `new Date()` during render
 * can disagree with the prerendered HTML about what day it is - a shopper in
 * California at 6pm on the 30th is already on the 1st in UTC - and that is a
 * hydration mismatch that would flicker the tag on and off.
 */
export function promoMarks(now = new Date()): Record<string, PromoMark> {
  const { year, month } = currentMonth(now);
  const marks: Record<string, PromoMark> = {};

  for (const promo of promotionsForMonth(year, month)) {
    // Only what is running right now: an offer opening on the 15th must not
    // put a discount tag on the catalog on the 3rd.
    if (promotionStatus(promo, now).state !== "live") continue;

    for (const product of productsInPromotion(promo)) {
      const price = promoPrice(product, promo.discount);
      // No figure to discount means no tag, rather than a tag with no price.
      if (!price) continue;
      marks[product.slug] = {
        label: discountLabel(promo.discount),
        was: price.was,
        now: price.now,
        endsOn: formatLongDay(promo.end),
      };
    }
  }

  return marks;
}

/** "$29.00" -> 29. Returns null for anything that is not a plain dollar figure. */
export function parsePrice(price: string): number | null {
  const match = /^\$([\d,]+(?:\.\d+)?)$/.exec(price.trim());
  if (!match) return null;
  const value = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(value) ? value : null;
}

export type PromoPrice = { was: string; now: string; saving: string };

/**
 * The struck-through-and-new price pair for one product under one promotion.
 *
 * Null when the catalog price is not a figure we can do arithmetic on - the
 * "on-request" items carry text like "varies", and inventing a discount off an
 * unknown number would be worse than showing no discount at all.
 */
export function promoPrice(
  product: CatalogProduct,
  discount: PromotionDiscount,
): PromoPrice | null {
  const base = parsePrice(product.price);
  if (base === null) return null;

  // A flat amount is capped at the item's own price: a $15 discount against a
  // cheaper item would otherwise price it below zero. Capping keeps the floor
  // at free and, because the saving is derived from the same number, keeps
  // "save X" honest rather than claiming the full $15 came off.
  const off =
    discount.type === "percent"
      ? base * (discount.percentOff / 100)
      : Math.min(discount.amountOff, base);

  const saving = Math.round(off * 100) / 100;
  return {
    was: product.price,
    now: formatUsd(Math.round((base - saving) * 100) / 100),
    saving: formatUsd(saving),
  };
}

function formatUsd(value: number): string {
  return `$${value.toFixed(2)}`;
}

/**
 * Small counts spelled out, for running copy.
 *
 * "Take all four" is how the sentence would be written; "Take all 4" reads as
 * a system message. Numerals stay numerals in the spec labels, where they are
 * being scanned rather than read.
 */
const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six",
  "seven", "eight", "nine", "ten", "eleven", "twelve",
];

export function spellCount(count: number): string {
  return NUMBER_WORDS[count] ?? String(count);
}

/** "$15 off" / "20% off", for badges and headings. */
export function discountLabel(discount: PromotionDiscount): string {
  if (discount.type === "percent") return `${discount.percentOff}% off`;
  // Whole dollars read better unadorned on a badge; cents are kept when set.
  const amount = Number.isInteger(discount.amountOff)
    ? `$${discount.amountOff}`
    : formatUsd(discount.amountOff);
  return `${amount} off`;
}

/**
 * How the promotion prices out as one line in a spec row.
 *
 * A range whose items are all one price can state the move plainly. A range
 * spanning several prices cannot, since quoting one "was" figure for the XS
 * cases would be wrong for most of them, so it gives both ends of what things
 * now cost together with both ends of what they cost before.
 *
 * It used to say only "from $29.75". That reads well but it is not a price:
 * with the per-flavour list removed from the page there was nothing left
 * telling anyone what a case actually comes to.
 */
export type PromoSummary =
  | { kind: "uniform"; was: string; now: string }
  | { kind: "spread"; wasLow: string; wasHigh: string; nowLow: string; nowHigh: string };

export function promoSummary(promo: Promotion): PromoSummary | null {
  const prices = productsInPromotion(promo)
    .map((product) => promoPrice(product, promo.discount))
    .filter((price): price is PromoPrice => price !== null);

  if (prices.length === 0) return null;

  if (new Set(prices.map((price) => price.was)).size === 1) {
    return { kind: "uniform", was: prices[0].was, now: prices[0].now };
  }

  const was = prices.map((price) => parsePrice(price.was) ?? 0);
  const now = prices.map((price) => parsePrice(price.now) ?? 0);
  return {
    kind: "spread",
    wasLow: formatUsd(Math.min(...was)),
    wasHigh: formatUsd(Math.max(...was)),
    nowLow: formatUsd(Math.min(...now)),
    nowHigh: formatUsd(Math.max(...now)),
  };
}

export type PromotionItemGroup = {
  heading: string;
  items: { product: CatalogProduct; label: string }[];
};

/**
 * The items in scope, grouped by sub-line, for the typeset index.
 *
 * Catalog names carry their own structure - "XS Energy Drink: Classic" - so the
 * part before the colon is the sub-line and the part after is the flavour on
 * its own. That turns seventeen near-identical rows into four short lists a
 * reader can actually navigate, and it keeps Energy + Burn from reading as just
 * another flavour of the core drink when it is a different product.
 *
 * `variantLabel` wins for the item's own label where the catalog sets one. Not
 * every range uses a colon - the lip glow shades are named "... Lip Glow -
 * Desert Rose" - and splitting on the wrong separator printed the entire
 * product name under each bottle instead of just the shade.
 */
export function promotionItemGroups(promo: Promotion): PromotionItemGroup[] {
  // Insertion-ordered, so the groups come out in catalog order.
  const groups = new Map<string, PromotionItemGroup>();

  for (const product of productsInPromotion(promo)) {
    const split = product.name.indexOf(": ");
    const heading = split === -1 ? product.category : product.name.slice(0, split);
    const label =
      product.variantLabel ??
      (split === -1 ? product.name : product.name.slice(split + 2));

    const group = groups.get(heading);
    if (group) group.items.push({ product, label });
    else groups.set(heading, { heading, items: [{ product, label }] });
  }

  return [...groups.values()];
}

/** Total a shopper would save buying one of everything in the promotion. */
export function totalSaving(promo: Promotion): string | null {
  const products = productsInPromotion(promo);
  let sum = 0;
  let counted = 0;

  for (const product of products) {
    const price = promoPrice(product, promo.discount);
    if (!price) continue;
    sum += parsePrice(price.saving) ?? 0;
    counted += 1;
  }

  return counted > 0 ? formatUsd(sum) : null;
}

// The month's offers. Discounts and windows are the business's to set: edit
// them here and the listing, the pricing on every card and the structured data
// all follow. A promotion drops off the page of its own accord once `end`
// passes into a previous month, so nothing has to be deleted by hand.
export const PROMOTIONS: Promotion[] = [
  {
    id: "artistry-lip-glow-september",
    name: "Go Vibrant Light Up Liquid Lip Glow",
    brand: "Artistry",
    // 15 percent, not 15 dollars: a flat $15 against a $29.00 shade is a 51.7%
    // cut, which is not what this promotion is.
    discount: { type: "percent", percentOff: 15 },
    start: "2026-09-01",
    end: "2026-09-30",
    headline: "15% off all four lip glow shades",
    blurb:
      "It walked New York Fashion Week, and now it can live in your coat pocket. The glow goes on cushiony, holds its colour for a full ten hours and never turns sticky, while a vitamin complex quietly conditions your lips underneath. Then there is the cap: an LED light and a mirror built right in, so you can reapply in the back of a taxi and still get it right. Four shades, from the rose-brown you will wear to everything to a fuchsia that makes people look twice.",
    terms:
      "Applies to all four shades, while September stock lasts. One discount per item: not combinable with bundle pricing.",
    scope: { type: "variantGroup", value: "artistry-lip-glow" },
    image: {
      src: "/Product-Artistry.png",
      alt: "The four Artistry Go Vibrant Light Up Liquid Lip Glow shades",
      // Reflection runs off the bottom of the frame, and the rock on the right
      // ends against the edge rather than resolving.
      fade: ["bottom", "right"],
    },
    gallery: true,
    comparison: {
      basis: "US list price for a comparable full-size gloss",
      columns: ["List price", "Applicator"],
      // Most expensive first, so the eye travels down the price column and
      // lands on ours. Estée Lauder appears twice on purpose: their tinted lip
      // oil at $30 is the closest any of these gets to us, and leaving it out
      // to show only the $40 stick would be picking the flattering half.
      rivals: [
        { name: "Chanel", product: "Rouge Coco Hydra Gloss", cells: ["$45", "Wand"] },
        { name: "Dior", product: "Addict Lip Maximizer", cells: ["$42", "Wand"] },
        { name: "Gucci", product: "Gloss à Lèvres", cells: ["$42", "Wand"] },
        { name: "Yves Saint Laurent", product: "Loveshine Plumping Lip Oil", cells: ["$40", "Wand"] },
        { name: "Estée Lauder", product: "Pure Color Melt-On Glosstick", cells: ["$40", "Wand"] },
        { name: "Estée Lauder", product: "Glossy Pout Tinted Lip Oil", cells: ["$30", "Wand"] },
      ],
      ours: {
        name: "Artistry",
        product: "Go Vibrant Light Up Liquid Lip Glow",
        cells: ["$29", "Wand, LED light and mirror"],
      },
      priceColumn: 0,
      // Everything after the price is a statement about our own product, not a
      // claim about theirs. Saying "they have no avocado oil" would be a claim
      // about someone else's formula that we cannot stand behind; saying what
      // ours has is simply true.
      edge: "Avocado oil and a vitamin complex condition your lips as you wear it, the non-drip formula holds ten hours without feathering, and the cap carries its own light and mirror. The same prestige tier, without the department-store markup.",
    },
    unit: "shade",
    cta: { href: "/collections/artistry", label: "Choose your shade" },
  },
  {
    id: "xs-energy-september",
    name: "The Complete Energy Range",
    brand: "XS",
    discount: { type: "percent", percentOff: 15 },
    start: "2026-09-01",
    end: "2026-09-30",
    headline: "15% off the entire XS range",
    blurb:
      "The three o'clock slump does not stand a chance. 114 mg of caffeine, zero sugar and fifteen calories a can, so you get the lift and skip the crash that always follows something sweet. Twelve flavours in the core line alone, plus Sparkling Juiced, Energy + Burn and Elite Focus, every one by the case of twelve so you are never caught without a cold one in the fridge. This month the whole range is in, not just the favourites.",
    // The estimate caveat is appended automatically for any range holding a
    // non-confirmed price, so stating it here too printed it twice.
    terms:
      "Applies to all XS cases, including Sparkling Juiced, Energy + Burn and Elite Focus.",
    scope: { type: "category", value: "XS" },
    image: {
      src: "/Product-XS.png",
      alt: "Three XS energy drink cans on ice",
      // Bottom only: this shot is letterboxed left and right, so nothing is cut
      // horizontally and a side fade would just dim the outer ice cubes.
      fade: ["bottom"],
    },
    comparison: {
      basis: "Per can, on each brand's own published figures",
      columns: ["Caffeine", "Sugar", "Nutrients"],
      // Every one of these carries B-vitamins, so "has vitamins" is not on its
      // own a point of difference and must not be presented as one. Giving
      // nutrients a column of its own lets the fuller panel show for itself.
      // Can sizes are on every row because these are not all the same can.
      // Monster's 160 mg is in a 16 oz can against our 12 oz, so quoting the
      // milligrams alone would read as a bigger gap than there is.
      rivals: [
        { name: "Monster", product: "16 fl oz", cells: ["160 mg", "54 g", "B-vitamins"] },
        { name: "Red Bull", product: "8.4 fl oz", cells: ["80 mg", "27 g", "B-vitamins"] },
        { name: "Celsius", product: "12 fl oz", cells: ["200 mg", "None", "B-vitamins, vitamin C"] },
      ],
      ours: {
        name: "XS",
        product: "12 fl oz",
        cells: ["114 mg", "None", "B-vitamins, taurine, L-glutamine, ginseng"],
      },
      // Claims only what is true. Celsius is also sugar-free and carries more
      // caffeine than XS, so the honest edge is the steadier dose and the
      // supporting panel, not "most caffeine" or "only sugar-free one".
      edge: "None of the sugar that Red Bull and Monster carry, a steadier 114 mg rather than a 200 mg hit, and B-vitamins backed by taurine, L-glutamine and ginseng. Cranberry-Grape even comes caffeine-free, which none of them offer.",
    },
    unit: "case",
    cta: { href: "/collections/xs-energy", label: "Pick your flavour" },
  },
];
