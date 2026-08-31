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
    tagline: "Exams coming up?",
    description:
      "Feel energetic day and night through finals, then actually fall asleep once they're over. Built around what a real semester looks like: late study nights, meals skipped between classes, and a sleep schedule that falls apart around exams.",
    picks: [
      { name: "XS Elite Focus: Peach Mango", brand: "XS", note: "Caffeine built for a study session, not just a sugar rush" },
      { name: "Wellness Bar, Nutty Dark Chocolate", brand: "Nutrilite", note: "A real meal stand-in between back-to-back classes" },
      { name: "Organics Plant Protein Powder", brand: "Nutrilite", note: "Blend it in a dorm-room shaker when dining hall hours don't line up" },
      { name: "Sweet Dreams Sleep Gummies", brand: "Nutrilite", note: "Melatonin and passionflower for actually sleeping after a late study night" },
    ],
  },
  {
    slug: "professionals",
    title: "Working Professionals",
    tagline: "Feeling sleepy after lunch?",
    description:
      "Show up sharp for back-to-back meetings without another coffee wearing off by 3pm. Daily wellness, sustained energy, and polished grooming for people whose calendar doesn't let up.",
    picks: [
      { name: "Double X Multivitamin", brand: "Nutrilite", note: "One daily habit to cover nutritional gaps" },
      { name: "XS Energy Drink", brand: "XS", note: "A mid-afternoon reset without the crash before your next meeting" },
      { name: "Sweet Dreams Sleep Gummies", brand: "Nutrilite", note: "For actually winding down after a day that didn't stop at 5pm" },
      { name: "Skin Nutrition Defying Serum", brand: "Artistry", note: "Grooming that holds up on video calls and in person" },
    ],
  },
  {
    slug: "gym",
    title: "Gym & Fitness",
    tagline: "Want to build a lean, strong body?",
    description:
      "Protein, energy, and recovery built around actual training days: what gets you through a heavy set and the soreness the next morning, not influencer marketing.",
    picks: [
      { name: "Organics Plant Protein Powder", brand: "Nutrilite", note: "USDA-organic protein for post-workout recovery, no synthetic fillers" },
      { name: "XS Energy Drink", brand: "XS", note: "Pre-workout energy without the sugar crash" },
      { name: "Omega", brand: "Nutrilite", note: "Supports joint and heart health on heavy training days" },
    ],
  },
  {
    slug: "women",
    title: "Women",
    tagline: "Skin not bouncing back like it used to?",
    description:
      "Prestige skincare that targets what's actually changing, paired with the daily supplements women reach for most: bone health, hydration, and a routine built to hold up.",
    picks: [
      { name: "Skin Nutrition Defying Serum", brand: "Artistry", note: "Targets fine lines, pores, and elasticity" },
      { name: "Cal Mag D", brand: "Nutrilite", note: "Bone health that matters well before your 40s, not just after" },
      { name: "g&h Nourish Body Wash", brand: "g&h", note: "Sulfate-free, gentle enough to double as a face wash" },
    ],
  },
  {
    slug: "families",
    title: "Families",
    tagline: "Worried about what's really in your tap water?",
    description:
      "Certified clean water and home care for the whole household, plus the family-size wellness essentials you're already restocking every month, without the guesswork.",
    picks: [
      { name: "Dish Drops Dishwashing Liquid", brand: "Amway Home", note: "One concentrated bottle rated to outlast several big-box refills" },
      { name: "eSpring Water Treatment System", brand: "eSpring", note: "Certified clean drinking water at the tap, for everyone in the house" },
      { name: "Double X Multivitamin", brand: "Nutrilite", note: "Daily nutrition for the whole household, kids included" },
    ],
  },
];
