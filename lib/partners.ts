import type { CatalogCategory } from "@/lib/catalog";

export type Partner = {
  name: string;
  description: string;
  // A single standout credential - the kind of thing you'd put on a plaque,
  // not just another feature bullet. Kept separate from `points` so it can
  // get its own visual treatment.
  achievement: string;
  points: string[];
  // Which catalog category "Explore products" should deep-link to. Left
  // undefined for brands with no catalog products yet (e.g. iCook), so the
  // link falls back to the unfiltered catalog instead of an empty result.
  category?: CatalogCategory;
};

// Brand-level data: distinct from CATEGORY_INFO in catalog.ts, since brands
// like Satinique sit inside a broader catalog category rather than mapping
// to one 1:1.
export const partners: Partner[] = [
  {
    name: "Nutrilite",
    description: "The world's only global vitamin brand grown on its own certified organic farms.",
    achievement: "The world's #1 selling vitamins and supplements brand (Euromonitor International).",
    points: [
      "Grown and traced on dedicated farms, not sourced from an anonymous factory.",
      "22 plant concentrates in every serving of the flagship multivitamin.",
    ],
    category: "Nutrilite",
  },
  {
    name: "Artistry",
    description: "Prestige-tier skincare and color cosmetics, sold exclusively through consultants.",
    achievement: "Official beauty sponsor of the Miss America Organization and New York Fashion Week.",
    points: [
      "Built on real actives, like ashwagandha and holy basil, not filler.",
      "The same global formulas sold at department-store counters, priced the same.",
    ],
    category: "Artistry",
  },
  {
    name: "Satinique",
    description: "Moisturizing hair care built around real botanical ingredients.",
    achievement: "One of the longest-running hair care lines in the lineup, still reformulated to modern standards.",
    points: [
      "A sunflower-seed water complex you won't find in a drugstore shampoo aisle.",
      "Formulated for daily use on dry, unruly hair.",
    ],
    category: "Personal Care",
  },
  {
    name: "XS",
    description: "Energy drinks built around a low-sugar, higher-caffeine formula.",
    achievement: "Zero sugar since day one, years before that became the industry standard.",
    points: [
      "Zero sugar, 114 mg of caffeine per can: a real lift without the crash.",
      "Six flavors, from classic citrus to sparkling pink grapefruit.",
    ],
    category: "XS",
  },
  {
    name: "eSpring",
    description: "Certified home water treatment, tested against real contaminants.",
    achievement: "Certified against more NSF/ANSI drinking-water standards than any other system on the market.",
    points: [
      "Filters down to 0.2 microns while leaving beneficial minerals untouched.",
      "Independently tested against 170+ contaminants.",
    ],
    category: "Water & Air Treatment",
  },
  {
    name: "G&H",
    description: "Plant-based body and hand care, formulated for daily use without harsh sulfates.",
    achievement: "Formulated without parabens, phthalates, or synthetic dyes.",
    points: [
      "Body wash, hand soap, and lotion built around plant-derived cleansers.",
      "Dermatologist-tested, including formulas for sensitive skin.",
    ],
    category: "Personal Care",
  },
  {
    name: "Glister",
    description: "A complete oral care system built around fluoride toothpaste and daily mouthwash.",
    achievement: "Multi-Action Fluoride Toothpaste, formulated to fight cavities and freshen breath in one step.",
    points: [
      "Toothpaste, mouthwash, and toothbrush designed to work as one routine.",
      "Sold internationally as part of Amway's global personal care line.",
    ],
    category: "Personal Care",
  },
  {
    name: "iCook",
    description: "Five-ply stainless steel cookware built to outlast a lifetime of daily cooking.",
    achievement: "Backed by a limited lifetime warranty on the full cookware line.",
    points: [
      "Five-ply construction for even heat distribution, not just a nonstick coating.",
      "Oven-safe, induction-compatible, and dishwasher-safe.",
    ],
  },
  {
    name: "Atmosphere",
    description: "Whole-room air treatment systems built around HEPA and carbon filtration.",
    achievement: "Multi-stage filtration designed to capture common allergens, odors, and airborne particles.",
    points: [
      "HEPA filter captures fine particles; carbon filter targets odors and VOCs.",
      "Quiet enough to run continuously in a bedroom or living room.",
    ],
    category: "Water & Air Treatment",
  },
];
