"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { catalog, CATEGORY_INFO, CATEGORY_VISUAL, type CatalogCategory } from "@/lib/catalog";
import { CardSpotlight } from "@/components/ui/card-spotlight";

const CATEGORIES = Object.keys(CATEGORY_INFO) as CatalogCategory[];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function ProductCategories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            Everything under one roof
          </h2>
          <p className="mt-4 text-muted">
            {catalog.length}+ products across {CATEGORIES.length} lines, every
            one of them with a full ingredient list and an honest comparison
            to what you&apos;d find on Amazon, Walmart, or Costco.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
        >
          Browse the full catalog
        </Link>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3"
      >
        {CATEGORIES.map((category) => {
          const visual = CATEGORY_VISUAL[category];
          const Icon = visual.icon;
          const count = catalog.filter((p) => p.category === category).length;
          return (
            <motion.div key={category} variants={item} className="h-full">
              <Link href="/products" className="group block h-full">
                <CardSpotlight className="flex h-full flex-col gap-4 rounded-none border-0 bg-background p-8 transition-colors group-hover:bg-surface">
                  <div className="relative z-20 flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${visual.gradient}`}>
                      <Icon size={20} className="text-foreground/70" />
                    </div>
                    <h3 className="font-medium">{category}</h3>
                  </div>
                  <div className="relative z-20 flex-1">
                    <p className="text-sm text-muted">{CATEGORY_INFO[category].blurb}</p>
                  </div>
                  <span className="relative z-20 flex items-center justify-between text-xs font-medium text-muted">
                    {count} products
                    <span className="flex items-center gap-1.5 text-accent opacity-0 transition-opacity group-hover:opacity-100">
                      Browse
                    </span>
                  </span>
                </CardSpotlight>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
