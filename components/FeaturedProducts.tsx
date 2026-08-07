"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Play } from "lucide-react";
import { catalog, CATEGORY_VISUAL } from "@/lib/catalog";
import CategoryVisual from "@/components/CategoryVisual";

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-accent text-accent-foreground",
  New: "bg-emerald-500 text-white",
  "Staff Pick": "bg-amber-500 text-black",
};

const FEATURED = catalog.filter((p) => p.badge).slice(0, 6);

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function FeaturedProducts() {
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
          <p className="mb-3 text-xs font-medium tracking-wide text-accent uppercase">
            Fan favorites
          </p>
          <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            What people actually reorder
          </h2>
          <p className="mt-4 text-muted">
            The bestsellers, staff picks, and newest arrivals across every
            line, picked to actually show you what you&apos;re buying.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
        >
          View full catalog
        </Link>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURED.map((product) => {
          const visual = CATEGORY_VISUAL[product.category];

          return (
            <motion.div key={product.slug} variants={item}>
              <Link
                href={`/products/${product.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/60"
              >
                <div className="relative flex h-48 shrink-0 items-center justify-center overflow-hidden bg-linear-to-b from-background to-surface">
                  <div
                    aria-hidden
                    className={`absolute h-32 w-32 rounded-full bg-linear-to-br ${visual.gradient} blur-2xl transition-transform duration-500 group-hover:scale-110`}
                  />

                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ rotate: [-1, 1.5, -1], scale: 1.04 }}
                  >
                    <CategoryVisual
                      category={product.category}
                      width={visual.image ? 112 : 80}
                      height={visual.image ? 112 : 96}
                      iconSize={30}
                      rounded="rounded-2xl"
                    />
                  </motion.div>

                  {product.badge && (
                    <span
                      className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${BADGE_STYLES[product.badge]}`}
                    >
                      {product.badge}
                    </span>
                  )}
                  {product.videoId && (
                    <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
                      <Play size={11} className="fill-current" />
                      Video
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-medium tracking-wide text-muted uppercase">
                    {product.category}
                  </span>
                  <h3 className="mt-1 line-clamp-2 font-semibold">{product.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{product.hook}</p>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                    <div>
                      <span className="text-lg font-semibold tracking-tight">{product.price}</span>
                      {product.priceStatus === "approx" && (
                        <p className="text-[11px] text-muted">estimated</p>
                      )}
                      {product.priceStatus === "on-request" && (
                        <p className="text-[11px] text-muted">ask for current price</p>
                      )}
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                      View details
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
