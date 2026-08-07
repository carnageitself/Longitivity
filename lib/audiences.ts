export type Audience = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  picks: { name: string; brand: string; note: string }[];
};

export const audiences: Audience[] = [
  {
    slug: "students",
    title: "Students",
    tagline: "Fuel your semester",
    description:
      "Budget-friendly energy, focus, and skincare basics built around long study sessions, tight schedules, and even tighter budgets.",
    picks: [
      { name: "XS Energy Drink", brand: "XS", note: "A cleaner-label boost for late study nights" },
      { name: "All Plant Protein Powder", brand: "Nutrilite", note: "Affordable protein between dining-hall meals" },
      { name: "Skin Nutrition Starter Set", brand: "Artistry", note: "A simple 3-step routine that travels well" },
    ],
  },
  {
    slug: "professionals",
    title: "Working Professionals",
    tagline: "Perform at your best",
    description:
      "Daily wellness, sustained energy, and polished grooming for people who need to show up sharp, every day, on a packed calendar.",
    picks: [
      { name: "Double X Multivitamin", brand: "Nutrilite", note: "One daily habit to cover nutritional gaps" },
      { name: "XS Energy Drink", brand: "XS", note: "A mid-afternoon reset without the crash" },
      { name: "Skin Nutrition Defying Serum", brand: "Artistry", note: "Grooming that holds up on camera and in meetings" },
    ],
  },
  {
    slug: "gym",
    title: "Gym & Fitness",
    tagline: "Fuel the reps, not just the goals",
    description:
      "Protein, energy, and recovery basics built around actual training days, not influencer marketing.",
    picks: [
      { name: "All Plant Protein Powder", brand: "Nutrilite", note: "Tri-blend protein for post-workout recovery" },
      { name: "XS Energy Drink", brand: "XS", note: "Pre-workout energy without the sugar crash" },
      { name: "Omega", brand: "Nutrilite", note: "Supports joint and heart health on heavy training days" },
    ],
  },
  {
    slug: "women",
    title: "Women",
    tagline: "Skincare and wellness, dialed in",
    description:
      "Prestige skincare paired with the daily supplements women reach for most: bone health, hydration, and a routine that actually holds up.",
    picks: [
      { name: "Skin Nutrition Defying Serum", brand: "Artistry", note: "Targets fine lines, pores, and elasticity" },
      { name: "Cal Mag D", brand: "Nutrilite", note: "Calcium, magnesium, and D3 for long-term bone health" },
      { name: "g&h Nourish Body Wash", brand: "g&h", note: "Sulfate-free, gentle enough to double as a face wash" },
    ],
  },
  {
    slug: "families",
    title: "Families",
    tagline: "Everyday essentials, for everyone",
    description:
      "Home care and clean water for the whole household, plus family-size wellness: the recurring essentials families restock every month.",
    picks: [
      { name: "L.O.C. Multi-Purpose Cleaner", brand: "SA8 / L.O.C.", note: "One concentrate, dozens of household uses" },
      { name: "eSpring Water Purifier", brand: "eSpring", note: "Certified clean drinking water at the tap" },
      { name: "Double X Multivitamin (Family Pack)", brand: "Nutrilite", note: "Daily nutrition for the whole household" },
    ],
  },
];
