import { catalog, CATEGORY_INFO, type CatalogCategory } from "@/lib/catalog";
import { getReturnPolicy } from "@/lib/site-config";

// Category landing pages exist because `/products?category=Nutrilite` is a
// query string: crawlers fold those back into /products and they can't rank on
// their own. These give each product line a real, indexable URL with copy
// written for how people actually search ("nutrilite vitamins", "espring
// filter price") instead of the internal category label.
export type CategorySeo = {
  slug: string;
  category: CatalogCategory;
  /** SERP title. The root layout appends "| Longitivity", so leave it off. */
  title: string;
  h1: string;
  /** Meta description, kept under ~160 chars so Google doesn't truncate it. */
  description: string;
  /** On-page intro. Unique prose is what makes the page worth indexing. */
  intro: string;
  faqs: { question: string; answer: string }[];
};

export function countIn(category: CatalogCategory): number {
  return catalog.filter((p) => p.category === category).length;
}

export function productsIn(category: CatalogCategory) {
  return catalog.filter((p) => p.category === category);
}

const NUTRILITE_COUNT = countIn("Nutrilite");
const ARTISTRY_COUNT = countIn("Artistry");
const XS_COUNT = countIn("XS");
const PERSONAL_COUNT = countIn("Personal Care");
const HOME_COUNT = countIn("Home Care");
const WATER_AIR_COUNT = countIn("Water & Air Treatment");

export const CATEGORY_SEO: CategorySeo[] = [
  {
    slug: "nutrilite",
    category: "Nutrilite",
    title: "Nutrilite Vitamins & Supplements",
    h1: "Nutrilite Vitamins & Supplements",
    description: `Browse ${NUTRILITE_COUNT} Nutrilite supplements including Double X, Omega, probiotics and daily packs, with full ingredient lists and prices checked against Amazon and Walmart.`,
    intro:
      "Nutrilite is the part of this catalog people research hardest, and it should be. A daily supplement is something you buy every month for years, so the two questions worth answering up front are what is actually in it and whether the price holds up. Every product below opens to a complete ingredient panel, with no proprietary blends hiding behind a trademark, alongside a side-by-side price check against comparable products at Amazon, Walmart and Costco.",
    faqs: [
      {
        question: "Where are Nutrilite supplements made?",
        answer:
          "Every Nutrilite product listed here is manufactured in the USA. Nutrilite grows and harvests plant ingredients on its own certified organic farms, which is why a finished tablet can be traced back to the field it came from.",
      },
      {
        question: "How much does Nutrilite Double X cost?",
        answer:
          "Double X is $66.00 in this catalog. Its product page lists the full vitamin, mineral and phytonutrient panel next to what comparable multivitamins cost at Amazon, Walmart and Costco, so you can judge the difference yourself rather than take a claim on faith.",
      },
      {
        question: "Can I return a supplement after I have opened it?",
        answer: `Yes. ${getReturnPolicy("Nutrilite")} That matters here because most large retailers treat opened supplements as final sale under their hygiene rules.`,
      },
      {
        question: "Which Nutrilite product should I start with?",
        answer:
          "Most people start with one daily foundation such as Double X, the Men's Pack or the Women's Pack, and only then add something targeted like Omega, a probiotic or sleep support. Tell me what you are trying to cover and I will put a short list together instead of selling you the whole shelf.",
      },
    ],
  },
  {
    slug: "artistry",
    category: "Artistry",
    title: "Artistry Skincare & Cosmetics",
    h1: "Artistry Skincare & Cosmetics",
    description: `Artistry serums, moisturisers, foundation, mascara and lipstick: ${ARTISTRY_COUNT} products with full ingredient lists, real prices and a 6-month satisfaction guarantee.`,
    intro:
      "Artistry is prestige skincare, priced like the brands at the department store counter. The difference: it's sold through a person, not a shelf, so there's no swatching in store. What you get instead is the full ingredient list before you buy, and six months to know it's right for your skin.",
    faqs: [
      {
        question: "Is Artistry sold in stores like Sephora or Ulta?",
        answer:
          "No. Artistry is sold exclusively through consultants, so there is no retail counter to price-check it against. Every product page here lists the price and the full ingredient list directly, which is the closest equivalent to reading the box in person.",
      },
      {
        question: "How much is the Artistry Skin Nutrition Defying Serum?",
        answer:
          "$85.00. The Hydrating Gel Cream is $45.00, the Illuminating CC Cream is $38.00, the Exact Fit Powder Foundation is $32.50, the Light Up Liquid Lip Glow is $29.00, the Go Vibrant Mascara is $28.00 and the Go Vibrant Cream Lipstick is $26.00.",
      },
      {
        question: "Can I return skincare or makeup after opening it?",
        answer: `Yes. ${getReturnPolicy("Artistry")} Amazon and Walmart generally treat opened cosmetics as final sale, so this is the practical difference between the two buying routes.`,
      },
      {
        question: "How do I match a foundation shade without a counter?",
        answer:
          "Send a photo taken in daylight and I will narrow the Exact Fit range to one or two shades before you order. If the shade still misses, the satisfaction guarantee covers the exchange.",
      },
    ],
  },
  {
    slug: "xs-energy",
    category: "XS",
    title: "XS Energy Drinks: Every Flavor & Case Price",
    h1: "XS Energy Drinks",
    description: `All ${XS_COUNT} XS Energy flavors, from Classic and Tropical to Root Beer, Sparkling Juiced, Energy + Burn and Elite Focus, sold by the case, with full ingredient panels.`,
    intro:
      "XS is built around a low-sugar formula with a higher caffeine load than most mainstream energy drinks, and it is sold by the case rather than the single can. A standard 12-pack of 12 fl oz cans runs $37.00, which works out to roughly $3.08 a can, which is worth doing the arithmetic on, because case pricing is where energy drinks are usually either a bargain or quietly expensive. Full ingredient and nutrition panels are on each flavor's page.",
    faqs: [
      {
        question: "What flavors does XS Energy come in?",
        answer:
          "The core line is Classic, Tropical, Citrus, Black Cherry Cola, Root Beer, Electric Lemon, Naranja, Summit, Tamarindo, Watermelon Lemonade, Wild Berry and Cranberry-Grape. Beyond that there is Sparkling Juiced (Mango Pineapple Guava, Pink Grapefruit), Energy + Burn (Kiwi Strawberry, Blue Razz) and Elite Focus (Peach Mango).",
      },
      {
        question: "How much is a case of XS Energy?",
        answer:
          "Most core flavors are $37.00 for a case of twelve 12 fl oz cans, or about $3.08 per can. Electric Lemon and the Sparkling Juiced flavors are $35.00, Energy + Burn is $42.00 and Elite Focus is $44.00.",
      },
      {
        question: "Is XS Energy sugar free?",
        answer:
          "XS is formulated as a low-sugar energy drink rather than a full-sugar one. Rather than repeat a marketing line, each flavor's page carries its actual ingredient panel, so check the one you are interested in, since the Sparkling Juiced and Elite Focus lines differ from the core flavors.",
      },
      {
        question: "Can I mix flavors across cases?",
        answer:
          "Yes. Cases are ordered per flavor, but there is no rule against ordering several different ones together, and it is the sensible way to find out which you actually like before committing to a repeat order.",
      },
    ],
  },
  {
    slug: "personal-care",
    category: "Personal Care",
    title: "Satinique, Glister & G&H: Hair & Oral Care",
    h1: "Hair, Oral & Body Care",
    description: `Satinique shampoo and conditioner, Glister toothpaste and oral rinse, and g&h body wash and deodorant: ${PERSONAL_COUNT} everyday essentials with full ingredient lists.`,
    intro:
      "This is the repeat-purchase corner of the catalog: shampoo, toothpaste, deodorant, body wash. Because you buy these on a cycle rather than once, the per-use cost matters more than the sticker price, and several of them are concentrated. Glister's oral rinse in particular goes considerably further than the bottle size suggests. Satinique covers hair, Glister covers oral care and g&h covers body care.",
    faqs: [
      {
        question: "How much is Glister toothpaste?",
        answer:
          "Glister Multi-Action Fluoride Toothpaste is $7.25 and the Multi-Action Concentrated Oral Rinse is $14.00. The rinse is concentrated, so compare it on cost per use rather than against a ready-to-use bottle of the same volume.",
      },
      {
        question: "What does the Satinique range cost?",
        answer:
          "Satinique Smooth Moisture Shampoo and the matching Conditioner are $15.00 each. Both product pages carry the full ingredient list so you can check them against whatever you currently use.",
      },
      {
        question: "Is there an aluminium-free deodorant option?",
        answer:
          "Yes. The g&h line includes both an antiperspirant roll-on at $10.75 and the Protect+ Long Lasting Deodorant at $10.50. The ingredient list on each page shows exactly which is which.",
      },
      {
        question: "What if the product does not suit my skin or hair?",
        answer: `${getReturnPolicy("Personal Care")} Opened personal-care items are usually non-returnable or in-store-only at the large retailers, so this is the meaningful difference.`,
      },
    ],
  },
  {
    slug: "home-care",
    category: "Home Care",
    title: "Concentrated Home Cleaning & Laundry Products",
    h1: "Home Cleaning & Laundry",
    description: `${HOME_COUNT} concentrated home care products, from Dish Drops and kitchen cleaner to laundry detergent, fabric softener and dishwasher tablets, priced per real use.`,
    intro:
      "Almost everything in this section is concentrated, which is the whole argument for it and also the reason a straight price comparison misleads. A $17.00 litre of kitchen cleaner that dilutes several times over is not competing with a $4.00 spray bottle of ready-to-use cleaner on sticker price; it is competing on cost per bottle you actually fill. Each product page gives the dilution and the ingredient list so you can run that number rather than guess at it.",
    faqs: [
      {
        question: "Why are these cleaners more expensive than supermarket brands?",
        answer:
          "Because most of them are concentrates, not ready-to-use sprays. A 1 L refill of Kitchen Cleaner at $17.00 makes up several trigger bottles. The honest comparison is cost per filled bottle, and each product page lists the dilution so you can do it.",
      },
      {
        question: "Do I need to buy the spray bottles separately?",
        answer:
          "A Refillable Trigger Spray Bottle is $6.50 and is a one-time purchase: you refill it from the concentrate rather than replacing it. Dish Drops is also available in a ready-to-use pump bottle if you would rather skip the dilution step.",
      },
      {
        question: "What is in the laundry range?",
        answer:
          "Laundry detergent, All Fabric Bleach at $17.50, Fabric Softener at $14.00 and Automatic Dishwasher Tablets at $26.00. Scouring Pads and the Pursue Disinfectant Cleaner round out the cleaning side.",
      },
      {
        question: "Can I return cleaning products if they do not work for me?",
        answer: getReturnPolicy("Home Care"),
      },
    ],
  },
  {
    slug: "water-air-treatment",
    category: "Water & Air Treatment",
    // Singular reads closer to how these are actually searched ("espring water
    // filter", "atmosphere air purifier") and keeps the title inside 60 chars
    // once the brand suffix is appended.
    title: "eSpring Water Filter & Atmosphere Air Purifier",
    h1: "Water & Air Treatment Systems",
    description:
      "eSpring under-counter water treatment ($1,299) and Atmosphere Sky air purifiers ($1,710), plus HEPA and carbon replacement filters and real running costs.",
    intro:
      "These are the two genuine capital purchases in the catalog, and they are the ones where the replacement filter cost matters as much as the unit price. The eSpring under-counter system is $1,299.00 with e3 carbon replacement filters at $254.00; the Atmosphere Sky is $1,710.00, with a $192.00 HEPA filter and a $140.00 carbon odour filter. Budget the consumables before you buy the unit, because that is the number most comparison shopping leaves out.",
    faqs: [
      {
        question: "How much does an eSpring water filter cost to run?",
        answer:
          "The under-counter system is $1,299.00 up front, and the e3 carbon replacement filter is $254.00. The filter is the recurring cost, so factor it into any comparison against a cheaper unit with cheaper-looking cartridges.",
      },
      {
        question: "What does the Atmosphere Sky air purifier cost?",
        answer:
          "$1,710.00 for the whole-room, WiFi-enabled unit. Replacement filters are sold separately: $192.00 for the HEPA filter and $140.00 for the carbon odour filter.",
      },
      {
        question: "What contaminants does eSpring remove?",
        answer:
          "eSpring is certified against a tested contaminant list rather than a marketing claim. The product page carries the specifics, and the certification is the part worth reading, because an uncertified filter that claims the same reduction has not been independently tested for it.",
      },
      {
        question: "What is the return window on a water or air system?",
        answer: `${getReturnPolicy("Water & Air Treatment")} This window is shorter than the rest of the catalog, so decide within it rather than after.`,
      },
    ],
  },
];

export const CATEGORY_SEO_BY_SLUG = new Map(CATEGORY_SEO.map((c) => [c.slug, c]));

export const CATEGORY_SEO_BY_NAME = new Map(CATEGORY_SEO.map((c) => [c.category, c]));

/** Indexable landing-page path for a category, used everywhere we used to
 *  deep-link to the `?category=` query string. */
export function categoryPath(category: CatalogCategory): string {
  const entry = CATEGORY_SEO_BY_NAME.get(category);
  return entry ? `/collections/${entry.slug}` : "/products";
}

// Referenced above so the counts stay honest if the catalog changes; if a
// category ever empties out the page would still build, just with no products.
export const CATEGORY_COUNTS = {
  Nutrilite: NUTRILITE_COUNT,
  Artistry: ARTISTRY_COUNT,
  XS: XS_COUNT,
  "Personal Care": PERSONAL_COUNT,
  "Home Care": HOME_COUNT,
  "Water & Air Treatment": WATER_AIR_COUNT,
} satisfies Record<CatalogCategory, number>;

export { CATEGORY_INFO };
