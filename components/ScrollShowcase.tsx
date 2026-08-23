"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Check } from "lucide-react";
import { CATEGORY_VISUAL, catalog, type CatalogCategory } from "@/lib/catalog";
import CategoryVisual from "@/components/CategoryVisual";

const CHAPTERS: CatalogCategory[] = ["Nutrilite", "Artistry", "XS", "Water & Air Treatment"];

// Richer, category-specific lifestyle photography for this section only —
// everywhere else (product cards, FinalCta, etc.) keeps the catalog's
// regular per-category image via CategoryVisual.
const CHAPTER_IMAGE: Partial<Record<CatalogCategory, { src: string; alt: string }>> = {
  Nutrilite: { src: "/Nutralite-1.png", alt: "Nutrilite Double X styled with fresh ingredients" },
  Artistry: { src: "/Artistry-1.jpg", alt: "Artistry lip gloss lineup" },
  XS: { src: "/XS-1.png", alt: "XS Energy cans chilling on ice" },
  "Water & Air Treatment": { src: "/Air-1.png", alt: "Atmosphere air treatment system in a living room" },
};

function ChapterPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-72 w-56 overflow-hidden rounded-4xl shadow-xl shadow-black/40 sm:h-80 sm:w-64 lg:h-96 lg:w-72">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 288px, (min-width: 640px) 256px, 224px"
        style={{ objectFit: "cover" }}
      />
      {/* Vignette: darkens the edges so the product stays the focal point
          instead of competing with the photo's own set dressing. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 65% 65% at 50% 45%, transparent 30%, rgba(0,0,0,0.8) 100%)",
        }}
      />
    </div>
  );
}

// Fresh, marketing-specific copy for this section (distinct from the generic
// one-liners reused elsewhere on the page), grounded in facts already backed
// by the catalog data so nothing here is a made-up claim.
const CHAPTER_COPY: Record<CatalogCategory, { eyebrow: string; points: string[] }> = {
  Nutrilite: {
    eyebrow: "The world's only global vitamin brand grown on its own farms",
    points: [
      "Grown and traced on certified organic farms, not sourced from an anonymous factory.",
      "22 plant concentrates in every serving, alongside the vitamins and minerals.",
    ],
  },
  Artistry: {
    eyebrow: "Prestige skincare and color, sold only through consultants",
    points: [
      "Built on real actives, like ashwagandha and holy basil, not filler ingredients.",
      "The same global formulas sold at department-store counters, priced the same.",
    ],
  },
  XS: {
    eyebrow: "Low-sugar energy, built for a crash-free lift",
    points: [
      "Zero sugar, 114 mg of caffeine per can: a real lift without the spike and crash.",
      "Six flavors, from classic citrus to sparkling pink grapefruit.",
    ],
  },
  "Personal Care": {
    eyebrow: "Everyday essentials, built for repeat use",
    points: [
      "Formulated for daily use, not occasional treatments.",
      "Ingredients you can actually read and understand.",
    ],
  },
  "Home Care": {
    eyebrow: "Concentrated formulas that outlast the bottle they come in",
    points: [
      "A little goes further than the bottle suggests.",
      "EPA Safer Choice-recognized where it matters most.",
    ],
  },
  "Water & Air Treatment": {
    eyebrow: "Certified filtration, tested against real contaminants",
    points: [
      "Filters down to 0.2 microns while leaving beneficial minerals untouched.",
      "Independently tested against 170+ contaminants, not just marketing claims.",
    ],
  },
};

function useChapterRange(index: number, total: number) {
  const step = 1 / total;
  const start = index * step;
  const end = start + step;
  const inPoint = start + step * 0.2;
  const outPoint = end - step * 0.2;
  return { start, end, inPoint, outPoint };
}

function Chapter({
  category,
  index,
  total,
  scrollYProgress,
}: {
  category: CatalogCategory;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const visual = CATEGORY_VISUAL[category];
  const copy = CHAPTER_COPY[category];
  const image = CHAPTER_IMAGE[category];
  const count = catalog.filter((p) => p.category === category).length;
  const { start, end, inPoint, outPoint } = useChapterRange(index, total);

  const opacity = useTransform(scrollYProgress, [start, inPoint, outPoint, end], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [start, inPoint, outPoint, end], [0.88, 1, 1, 0.88]);
  // Everything travels left-to-right in lockstep: the image leads in from the
  // right, the copy follows a beat behind, so the whole chapter reads as one
  // panel sliding through rather than four independent fades.
  const imageX = useTransform(scrollYProgress, [start, inPoint, outPoint, end], [140, 0, 0, -140]);
  const textX = useTransform(scrollYProgress, [start, inPoint, outPoint, end], [90, 0, 0, -90]);

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-10 px-6 lg:flex-row lg:justify-center lg:gap-20"
    >
      <motion.div style={{ scale, x: imageX }} className="relative flex items-center justify-center">
        {image ? (
          <ChapterPhoto src={image.src} alt={image.alt} />
        ) : (
          <>
            <div
              aria-hidden
              className={`absolute h-64 w-64 rounded-full bg-linear-to-br ${visual.gradient} blur-3xl`}
            />
            <div className="relative">
              <CategoryVisual
                category={category}
                width={visual.image ? 192 : 152}
                height={visual.image ? 236 : 184}
                iconSize={58}
                rounded="rounded-4xl"
              />
            </div>
          </>
        )}
      </motion.div>

      <motion.div style={{ x: textX }} className="relative max-w-sm text-center lg:text-left">
        <p className="text-xs font-medium tracking-wide text-accent uppercase">{copy.eyebrow}</p>
        <h3 className="mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl">{category}</h3>
        <ul className="mt-4 flex flex-col gap-2.5 text-left">
          {copy.points.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-muted">
              <Check size={15} className="mt-0.5 shrink-0 text-accent" />
              {point}
            </li>
          ))}
        </ul>
        <Link
          href="/products"
          className="pointer-events-auto mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          {count} products in this line
        </Link>
      </motion.div>
    </motion.div>
  );
}

function RailItem({
  category,
  index,
  total,
  scrollYProgress,
}: {
  category: CatalogCategory;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const { start, inPoint, outPoint, end } = useChapterRange(index, total);
  const opacity = useTransform(scrollYProgress, [start, inPoint, outPoint, end], [0.35, 1, 1, 0.35]);
  const scale = useTransform(scrollYProgress, [start, inPoint, outPoint, end], [0.9, 1, 1, 0.9]);
  const dotScale = useTransform(scrollYProgress, [start, inPoint, outPoint, end], [1, 1.6, 1.6, 1]);

  return (
    <motion.div style={{ opacity, scale }} className="flex items-center justify-end gap-3">
      <span className="text-xs font-medium tracking-wide whitespace-nowrap">{category}</span>
      <motion.span style={{ scale: dotScale }} className="h-1.5 w-1.5 rounded-full bg-accent" />
    </motion.div>
  );
}

function ProgressSegment({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const { start, end } = useChapterRange(index, total);
  const width = useTransform(scrollYProgress, [start, end], ["0%", "100%"], { clamp: true });

  return (
    <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
      <motion.div className="h-full bg-accent" style={{ width }} />
    </div>
  );
}

export default function ScrollShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section ref={ref} className="relative" style={{ height: `${CHAPTERS.length * 90}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden border-y border-border bg-black">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            One roof, six product lines
          </p>
        </div>

        <div className="pointer-events-none absolute top-1/2 right-8 hidden -translate-y-1/2 flex-col gap-5 lg:flex">
          {CHAPTERS.map((category, i) => (
            <RailItem
              key={category}
              category={category}
              index={i}
              total={CHAPTERS.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {CHAPTERS.map((category, i) => (
          <Chapter
            key={category}
            category={category}
            index={i}
            total={CHAPTERS.length}
            scrollYProgress={scrollYProgress}
          />
        ))}

        <div className="absolute bottom-10 left-1/2 flex w-56 -translate-x-1/2 gap-2">
          {CHAPTERS.map((category, i) => (
            <ProgressSegment
              key={category}
              index={i}
              total={CHAPTERS.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
