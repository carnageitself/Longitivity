export type CompetitorMatch = {
  name: string;
  retailer: string;
  price: string;
  difference: string;
  madeIn: string; // country of manufacture/origin, or "Not publicly confirmed"
  // Return policy is derived from `retailer` + the product's category via
  // getRetailerReturnPolicy() in site-config.ts, not stored per-product here.
};

export type FullComparison = {
  slug: string; // matches CatalogProduct.slug in lib/catalog.ts
  competitors: CompetitorMatch[];
};

// Researched via live web search against Amazon/Walmart/Costco listings and
// brand/ingredient sources. Prices fluctuate: treat as approximate reference
// points, not live quotes. "difference" is written in plain, everyday language
// on purpose: it's meant to explain what the difference actually means for the
// person buying it, not to read like a chemistry label.
export const fullCompare: FullComparison[] = [
  // ---------- Nutrilite ----------
  {
    slug: "nutrilite-double-x",
    competitors: [
      {
        name: "Centrum Silver",
        retailer: "Walmart",
        price: "~$10-19",
        difference: "Uses lab-made vitamins instead of the real fruit and vegetable concentrates in Double X, so you're not getting the same whole-food nutrients.",
        madeIn: "USA (some batches Puerto Rico/Canada)",
      },
      {
        name: "Kirkland Signature Daily Multi",
        retailer: "Costco",
        price: "~$20 / 500 ct",
        difference: "A basic multivitamin with only lab-made vitamins and minerals, no added plant nutrients like Double X includes.",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "nutrilite-vitamin-c",
    competitors: [
      {
        name: "Nature Made Vitamin C 1000mg Time Release",
        retailer: "Amazon",
        price: "~$10-14",
        difference: "Packs a bigger dose of vitamin C per pill, but it's made in a lab rather than sourced from real acerola cherries like Nutrilite's.",
        madeIn: "USA",
      },
      {
        name: "Kirkland Signature Vitamin C 1000mg",
        retailer: "Costco",
        price: "~$19.99 / 500 ct",
        difference: "Much cheaper per pill with a bigger dose, but again it's lab-made vitamin C, not from real fruit.",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "nutrilite-kids-chewable",
    competitors: [
      {
        name: "L'il Critters Gummy Vites",
        retailer: "Walmart",
        price: "Not publicly confirmed",
        difference: "A sugary gummy vitamin with no real fruit or vegetable content, just added vitamins in a candy-like base.",
        madeIn: "USA",
      },
      {
        name: "Kirkland Signature Children's Chewable Multivitamin",
        retailer: "Costco",
        price: "Not publicly confirmed",
        difference: "Covers more vitamins and minerals on paper, but they're all lab-made, with none of the real fruit and veggie extras Nutrilite adds.",
        madeIn: "Not publicly confirmed",
      },
    ],
  },
  {
    slug: "nutrilite-omega",
    competitors: [
      {
        name: "Nature Made Fish Oil 1200mg",
        retailer: "Walmart",
        price: "~$10-15",
        difference: "A solid, well-tested fish oil, but it isn't independently certified for sustainable fishing the way Nutrilite's is.",
        madeIn: "USA (fish oil sourced from Peru/Norway/Canada)",
      },
      {
        name: "Kirkland Signature Fish Oil 1000mg",
        retailer: "Costco",
        price: "~$20.99 / 400 ct",
        difference: "Gives you noticeably less of the beneficial omega-3s per softgel than Nutrilite, and isn't certified sustainable.",
        madeIn: "USA (fish sourced from Peru)",
      },
    ],
  },
  {
    slug: "nutrilite-all-plant-protein",
    competitors: [
      {
        name: "Orgain Organic Vegan Protein Powder",
        retailer: "Walmart",
        price: "~$11-15",
        difference: "Made from pea, rice, and mung bean instead of soy, with more protein per scoop than Nutrilite's blend.",
        madeIn: "USA",
      },
      {
        name: "Vega Protein and Greens",
        retailer: "Amazon",
        price: "Not publicly confirmed",
        difference: "Blends in extra vegetables for added nutrients, but has a stronger, more noticeable taste than Nutrilite's neutral flavor.",
        madeIn: "Canada",
      },
    ],
  },
  {
    slug: "nutrilite-organics-plant-protein",
    competitors: [
      {
        name: "Garden of Life RAW Organic Protein",
        retailer: "Amazon",
        price: "~$25-35 / 20 servings",
        difference: "Also certified organic, but it's a more complicated mix of 13 different plant sources plus added probiotics.",
        madeIn: "USA",
      },
      {
        name: "Orgain Organic Vegan Protein Powder",
        retailer: "Walmart",
        price: "~$11-15",
        difference: "Also certified organic, made from different plant sources (pea, rice, mung bean) with added fiber.",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "nutrilite-cal-mag-d",
    competitors: [
      {
        name: "Kirkland Signature Calcium Citrate, Magnesium and Zinc",
        retailer: "Costco",
        price: "Price varies by warehouse",
        difference: "Uses a form of calcium that's easier for your body to absorb on an empty stomach, and adds zinc that Nutrilite's version doesn't have in the same amount.",
        madeIn: "USA",
      },
      {
        name: "Citracal Petites",
        retailer: "Amazon",
        price: "~$17-20 / 375 ct",
        difference: "Also easier to absorb on an empty stomach, but has no magnesium and its calcium comes from mined rock, not a natural seaweed source.",
        madeIn: "USA (some imported materials)",
      },
    ],
  },

  // ---------- Artistry ----------
  {
    slug: "artistry-defying-serum",
    competitors: [
      {
        name: "Olay Regenerist Micro-Sculpting Serum",
        retailer: "Amazon",
        price: "~$28-30",
        difference: "Fights fine lines with lab-made ingredients instead of the plant extracts Artistry uses, and costs a lot less.",
        madeIn: "USA (some variants Thailand)",
      },
      {
        name: "Estée Lauder Advanced Night Repair",
        retailer: "Amazon",
        price: "~$135",
        difference: "A similarly high-end price, but its anti-aging power comes from a lab fermentation process rather than plant extracts.",
        madeIn: "Not publicly confirmed",
      },
    ],
  },
  {
    slug: "artistry-hydrating-gel-cream",
    competitors: [
      {
        name: "Neutrogena Hydro Boost Gel Cream",
        retailer: "Walmart",
        price: "~$19-20",
        difference: "Hydrates with just one main ingredient (hyaluronic acid) instead of Artistry's blend of several, and costs less.",
        madeIn: "France",
      },
      {
        name: "Clinique Moisture Surge 100H",
        retailer: "Amazon",
        price: "~$30",
        difference: "A closer match in price and complexity, using aloe and caffeine instead of Artistry's plant-based blend.",
        madeIn: "Not publicly confirmed",
      },
    ],
  },
  {
    slug: "artistry-ideal-radiance-cc-cream",
    competitors: [
      {
        name: "IT Cosmetics CC+ Cream SPF 50+",
        retailer: "Amazon",
        price: "~$40-48",
        difference: "Similar high-end price and the same strong SPF 50 sun protection, but skips the vitamin-C brightening ingredient Artistry uses.",
        madeIn: "Not publicly confirmed",
      },
      {
        name: "Physicians Formula Super CC+ Cream SPF 30",
        retailer: "Walmart",
        price: "~$12-15",
        difference: "Much cheaper, but with weaker sun protection (SPF 30 instead of 50) and no vitamin-C brightener.",
        madeIn: "USA (some imported parts)",
      },
    ],
  },
  {
    slug: "artistry-signature-eyes-mascara",
    competitors: [
      {
        name: "Maybelline Lash Sensational",
        retailer: "Walmart",
        price: "~$9.98-10.98",
        difference: "A genuinely similar volumizing mascara for roughly a third of Artistry's likely price.",
        madeIn: "Varies by plant (USA, France, Brazil, India, Japan, or China)",
      },
      {
        name: "Maybelline Great Lash",
        retailer: "Walmart",
        price: "~$6-7",
        difference: "An older, simpler formula. Cheap, but it lengthens without adding much definition.",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "artistry-go-vibrant-lipstick",
    competitors: [
      {
        name: "Maybelline SuperStay Matte Ink Liquid Lipstick",
        retailer: "Amazon",
        price: "~$9-10",
        difference: "A similar liquid lipstick, but it dries to a harder, fully matte finish instead of Artistry's softer, creamier feel.",
        madeIn: "USA (per one retailer listing)",
      },
      {
        name: "NYX Soft Matte Lip Cream",
        retailer: "Walmart",
        price: "~$7",
        difference: "Cheaper with more shade choices, but the same harder matte finish rather than Artistry's cream texture.",
        madeIn: "Not publicly confirmed",
      },
    ],
  },
  {
    slug: "artistry-men-balancing-hydrator",
    competitors: [
      {
        name: "Nivea Men Sensitive Post Shave Balm",
        retailer: "Walmart",
        price: "~$7-8",
        difference: "A basic post-shave soothing lotion. It doesn't include the caffeine or skin-firming ingredients Artistry's version has, and it's meant for after shaving rather than all-day wear.",
        madeIn: "Germany or Mexico (varies by retailer listing)",
      },
    ],
  },
  {
    slug: "artistry-exact-fit-powder-foundation",
    competitors: [
      {
        name: "L'Oréal Infallible Fresh Wear Foundation in a Powder",
        retailer: "Walmart",
        price: "~$13-15",
        difference: "Claims to last longer through the day, but has no built-in sun protection like Artistry's SPF 20.",
        madeIn: "Not publicly confirmed",
      },
      {
        name: "Maybelline Fit Me Matte + Poreless Powder",
        retailer: "Walmart",
        price: "~$8-9",
        difference: "Much cheaper, but again with no built-in sun protection.",
        madeIn: "USA",
      },
    ],
  },

  // ---------- XS ----------
  {
    slug: "xs-classic",
    competitors: [
      {
        name: "Red Bull Sugar Free",
        retailer: "Amazon",
        price: "~$50 / 24-pack",
        difference: "Same amount of caffeine, but skips the ginseng and extra amino acid that XS includes for a smoother energy boost.",
        madeIn: "Austria",
      },
      {
        name: "Monster Zero Ultra",
        retailer: "Amazon",
        price: "~$28 / 24-pack (16oz cans)",
        difference: "Comes in a bigger can with more total caffeine, plus a couple of extra energy ingredients XS doesn't include.",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "xs-tropical",
    competitors: [
      {
        name: "Celsius Sparkling Tropical Vibe",
        retailer: "Costco",
        price: "~$28 / 18-pack",
        difference: "Nearly double the caffeine, and gets its energy from green tea and coffee bean extract instead of the ginseng XS uses.",
        madeIn: "USA",
      },
      {
        name: "Monster Ultra (fruity variants)",
        retailer: "Amazon",
        price: "~$28 / 24-pack",
        difference: "More caffeine in a bigger can, sweetened a bit differently, but still includes ginseng like XS does.",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "xs-black-cherry-cola",
    competitors: [
      {
        name: "Bang Black Cherry Vanilla",
        retailer: "Amazon",
        price: "~$23 / 12-pack",
        difference: "Nearly triple the caffeine, with artificial cherry flavor instead of the real cherry juice XS uses, and no ginseng.",
        madeIn: "USA",
      },
      {
        name: "Hiball Organic Energy Black Cherry",
        retailer: "Amazon",
        price: "~$24 / 8-pack variety",
        difference: "Uses real cherry juice and organic cane sugar (so it's not sugar-free like XS), plus organic ginseng.",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "xs-energy-burn-kiwi-strawberry",
    competitors: [
      {
        name: "Celsius (core flavors)",
        retailer: "Costco",
        price: "~$28 / 18-pack",
        difference: "Uses very similar metabolism-boosting ingredients, but carries almost double the caffeine and skips XS's ginseng blend.",
        madeIn: "USA",
      },
      {
        name: "Bang Energy",
        retailer: "Amazon",
        price: "~$23 / 12-pack (16oz cans)",
        difference: "Focuses on different recovery ingredients for its energy boost, rather than the green tea extract XS Burn uses.",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "xs-cranberry-grape",
    competitors: [
      {
        name: "Rockstar Pure Zero Grape",
        retailer: "Walmart",
        price: "Not publicly confirmed",
        difference: "No cranberry in the flavor, and more caffeine in a bigger can than XS.",
        madeIn: "Not publicly confirmed",
      },
      {
        name: "V8 +Energy",
        retailer: "Amazon",
        price: "Not publicly confirmed",
        difference: "The closest thing to a real-juice energy drink on the market, though it has less caffeine and no matching cranberry-grape flavor.",
        madeIn: "USA",
      },
    ],
  },
  // ---------- Personal Care ----------
  {
    slug: "satinique-smooth-moisture-shampoo",
    competitors: [
      {
        name: "Pantene Pro-V Daily Moisture Renewal",
        retailer: "Walmart",
        price: "~$5.97-9.97",
        difference: "Cleans with a harsher, foaming ingredient (a sulfate) instead of Satinique's gentler, sulfate-free formula.",
        madeIn: "USA",
      },
      {
        name: "Herbal Essences bio:renew",
        retailer: "Amazon",
        price: "~$5-9",
        difference: "Also gentle and sulfate-free, but moisturizes with coconut milk instead of the almond oil Satinique uses.",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "satinique-smooth-moisture-conditioner",
    competitors: [
      {
        name: "Pantene Pro-V Daily Moisture Renewal Conditioner",
        retailer: "Walmart",
        price: "~$5.97-9.97",
        difference: "Pairs with a shampoo that uses harsher cleansing ingredients, unlike Satinique's gentler, matched set.",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "glister-toothpaste",
    competitors: [
      {
        name: "Crest Cavity Protection",
        retailer: "Walmart",
        price: "~$5.99-7.97",
        difference: "A slightly stronger dose of the same cavity-fighting ingredient (fluoride), but without the tooth-friendly sugar substitute (xylitol) Glister adds.",
        madeIn: "USA or Mexico (varies by batch)",
      },
      {
        name: "Colgate Total (Stannous Fluoride)",
        retailer: "Amazon",
        price: "~$15-20 / 4-pack",
        difference: "Uses a different type of fluoride paired with zinc, aimed more at fighting bacteria and sensitivity than Glister's simpler formula.",
        madeIn: "USA (also manufactured in Mexico)",
      },
    ],
  },
  {
    slug: "glister-oral-rinse",
    competitors: [
      {
        name: "Crest Pro-Health Multi-Protection (Alcohol-Free, CPC)",
        retailer: "Walmart",
        price: "~$6-8",
        difference: "Ready to use straight from the bottle, no mixing with water needed like Glister's concentrate requires.",
        madeIn: "Not publicly confirmed",
      },
      {
        name: "Listerine Cool Mint",
        retailer: "Amazon",
        price: "Not publicly confirmed",
        difference: "Uses a stronger-tasting mix of essential oils to kill germs, and the original formula contains alcohol (alcohol-free versions exist too).",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "gh-protect-deodorant-roll-on",
    competitors: [
      {
        name: "Dove Advanced Care Roll-On",
        retailer: "Walmart",
        price: "~$6.97",
        difference: "Blocks sweat the same basic way, but skips the green tea and calming skin ingredients g&h adds.",
        madeIn: "Not publicly confirmed",
      },
      {
        name: "Native Deodorant Roll-On",
        retailer: "Amazon",
        price: "Not publicly confirmed",
        difference: "Doesn't block sweat at all. It only covers up odor, which is a different approach than g&h's sweat-blocking formula.",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "gh-protect-plus-deodorant",
    competitors: [
      {
        name: "Native Deodorant (Classic stick)",
        retailer: "Amazon",
        price: "~$12-14",
        difference: "Also skips aluminum, but moisturizes with coconut oil and shea butter instead of G&H's plant extract blend.",
        madeIn: "USA",
      },
      {
        name: "Secret Aluminum Free Deodorant",
        retailer: "Amazon",
        price: "~$6-8",
        difference: "Some versions skip baking soda entirely, using a gentler odor-fighting ingredient instead, aimed at sensitive skin.",
        madeIn: "Not publicly confirmed",
      },
    ],
  },
  {
    slug: "gh-nourish-body-wash",
    competitors: [
      {
        name: "Dove Deep Moisture Body Wash",
        retailer: "Walmart",
        price: "~$7 / bottle (4-pack ~$27.99)",
        difference: "Markets itself as gentle, but several versions still contain the harsher foaming ingredient (a sulfate) that g&h's formula avoids.",
        madeIn: "Not publicly confirmed",
      },
      {
        name: "Olay Ultra Moisture Shea Butter Body Wash",
        retailer: "Amazon",
        price: "~$6-9",
        difference: "Contains that same harsher foaming ingredient, unlike g&h's gentler, plant-based formula.",
        madeIn: "Not publicly confirmed",
      },
    ],
  },

  // ---------- Home Care ----------
  {
    slug: "dish-drops",
    competitors: [
      {
        name: "Dawn Ultra Botanicals (Aloe Water)",
        retailer: "Walmart",
        price: "~$2.64 / 19.4 fl oz",
        difference: "Contains a harsher foaming ingredient that Dish Drops' plant-based formula leaves out.",
        madeIn: "Not publicly confirmed",
      },
      {
        name: "Palmolive Ultra Strength",
        retailer: "Walmart",
        price: "~$18.60-20.99 / 102 fl oz",
        difference: "Sold in a much bigger bottle, so it can work out cheaper per ounce even though Dish Drops is more concentrated.",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "kitchen-cleaner",
    competitors: [
      {
        name: "Scrubbing Bubbles Kitchen",
        retailer: "Walmart",
        price: "~$3.97-9.36",
        difference: "Not independently certified as environmentally friendly, unlike this version.",
        madeIn: "Not publicly confirmed",
      },
      {
        name: "Method Kitchen",
        retailer: "Amazon",
        price: "Not publicly confirmed",
        difference: "Also plant-based, but hasn't been independently tested and rated as gentle on skin the way this one has.",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "bathroom-cleaner",
    competitors: [
      {
        name: "Lysol Disinfectant Bathroom Cleaner",
        retailer: "Walmart",
        price: "Not publicly confirmed (single-unit)",
        difference: "Focused on killing germs rather than dissolving soap scum and hard-water buildup the way this formula does.",
        madeIn: "USA",
      },
      {
        name: "Scrubbing Bubbles Bathroom Cleaner",
        retailer: "Walmart",
        price: "~$3.97-9.36",
        difference: "Cleans using foaming bubbles instead of the scale-dissolving ingredient (citric acid) in this version.",
        madeIn: "Not publicly confirmed",
      },
    ],
  },

  // ---------- Water & Air Treatment ----------
  {
    slug: "espring-under-counter",
    competitors: [
      {
        name: "APEC RO-90",
        retailer: "Amazon",
        price: "~$230-290",
        difference: "Costs much less, but it strips out beneficial minerals from your water and produces extra wastewater, which eSpring doesn't do.",
        madeIn: "USA",
      },
      {
        name: "Big Berkey",
        retailer: "Amazon",
        price: "~$367",
        difference: "Doesn't need electricity to run, but it can't disinfect with UV light the way eSpring does.",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "espring-e3-filter",
    competitors: [
      {
        name: "APEC FILTER-MAX90 annual replacement set",
        retailer: "Amazon",
        price: "~$50-70 / yr",
        difference: "Costs much less per year to maintain, but that's because you're replacing 4-5 separate filters instead of eSpring's single all-in-one cartridge.",
        madeIn: "USA",
      },
    ],
  },
  {
    slug: "atmosphere-sky",
    competitors: [
      {
        name: "Dyson Purifier Cool TP07",
        retailer: "Amazon",
        price: "~$400-500",
        difference: "Much cheaper, and its air-cleaning claims are tested against a standard industry benchmark that's easier to independently verify than Atmosphere Sky's.",
        madeIn: "Not publicly confirmed (Dyson generally manufactures in Malaysia/Singapore)",
      },
      {
        name: "Coway Airmega 400",
        retailer: "Amazon",
        price: "~$649-749",
        difference: "Covers about 3 times the room size for less than half the price, and publishes an independently verified performance rating that Atmosphere Sky doesn't.",
        madeIn: "China (assembly; designed in South Korea)",
      },
    ],
  },
  {
    slug: "atmosphere-sky-hepa-filter",
    competitors: [
      {
        name: "Honeywell HPA300 HEPA filter (3-pack)",
        retailer: "Amazon",
        price: "~$45 / yr",
        difference: "Needs replacing every year instead of lasting up to 3 years like Atmosphere Sky's filter, but each replacement costs much less.",
        madeIn: "China",
      },
    ],
  },
  {
    slug: "atmosphere-sky-carbon-filter",
    competitors: [
      {
        name: "Levoit Core 600S replacement filter",
        retailer: "Amazon",
        price: "~$60 / 6-12 months",
        difference: "Cheaper, but it's an all-in-one filter that handles particles, odor, and allergens together, rather than a dedicated odor-fighting filter like Atmosphere Sky's.",
        madeIn: "China",
      },
    ],
  },
];
