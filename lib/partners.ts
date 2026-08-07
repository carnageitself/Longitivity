export type Partner = {
  name: string;
  logo?: string;
  logoWidth?: number;
  description: string;
  // A single standout credential — the kind of thing you'd put on a plaque,
  // not just another feature bullet. Kept separate from `points` so it can
  // get its own visual treatment.
  achievement: string;
  points: string[];
};

// Brand-level data: distinct from CATEGORY_INFO in catalog.ts, since brands
// like Satinique and SA8/L.O.C. sit inside a broader catalog category rather
// than mapping to one 1:1.
export const partners: Partner[] = [
  {
    name: "Nutrilite",
    description: "The world's only global vitamin brand grown on its own certified organic farms.",
    achievement: "The world's #1 selling vitamins and supplements brand (Euromonitor International).",
    points: [
      "Grown and traced on dedicated farms, not sourced from an anonymous factory.",
      "22 plant concentrates in every serving of the flagship multivitamin.",
    ],
  },
  {
    name: "Artistry",
    description: "Prestige-tier skincare and color cosmetics, sold exclusively through consultants.",
    achievement: "Official beauty sponsor of the Miss America Organization and New York Fashion Week.",
    points: [
      "Built on real actives, like ashwagandha and holy basil, not filler.",
      "The same global formulas sold at department-store counters, priced the same.",
    ],
  },
  {
    name: "Satinique",
    description: "Moisturizing hair care built around real botanical ingredients.",
    achievement: "One of the longest-running hair care lines in the lineup, still reformulated to modern standards.",
    points: [
      "A sunflower-seed water complex you won't find in a drugstore shampoo aisle.",
      "Formulated for daily use on dry, unruly hair.",
    ],
  },
  {
    name: "XS",
    description: "Energy drinks built around a low-sugar, higher-caffeine formula.",
    achievement: "Zero sugar since day one, years before that became the industry standard.",
    points: [
      "Zero sugar, 114 mg of caffeine per can: a real lift without the crash.",
      "Six flavors, from classic citrus to sparkling dragon fruit.",
    ],
  },
  {
    name: "eSpring",
    description: "Certified home water treatment, tested against real contaminants.",
    achievement: "Certified against more NSF/ANSI drinking-water standards than any other system on the market.",
    points: [
      "Filters down to 0.2 microns while leaving beneficial minerals untouched.",
      "Independently tested against 170+ contaminants.",
    ],
  },
  {
    name: "SA8 / L.O.C.",
    description: "Concentrated home care formulas that outlast the bottle they come in.",
    achievement: "SA8 was one of the first phosphate-free laundry detergents sold in the U.S., years ahead of regulation.",
    points: [
      "A little goes further than the bottle suggests.",
      "EPA Safer Choice-recognized where it matters most.",
    ],
  },
];
