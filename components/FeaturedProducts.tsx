"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { catalog, CATEGORY_GLOW, CATEGORY_VISUAL } from "@/lib/catalog";
import { type PromoMark } from "@/lib/promotions";
import PromoTag from "@/components/PromoTag";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-linear-to-br from-accent to-[#8a6d3b] text-accent-foreground shadow-md shadow-amber-900/40 ring-1 ring-inset ring-white/25",
  New: "bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-inset ring-white/25",
  "Staff Pick": "bg-amber-500 text-black",
};

const FEATURED = catalog
  .filter((p) => p.badge && (p.image ?? CATEGORY_VISUAL[p.category].image))
  .slice(0, 6);

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function FeaturedProducts({
  // Built on the server and passed in, for the same reason the catalog
  // browser takes it as a prop: this is a client component, and deciding
  // here what day it is can disagree with the prerendered HTML.
  promoMarks = {},
}: {
  promoMarks?: Record<string, PromoMark>;
}) {
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
          const glow = CATEGORY_GLOW[product.category];
          const Icon = visual.icon;
          const image = product.image ?? visual.image;
          const photoStyle = product.image ? product.photoStyle : visual.photoStyle;
          const promo = promoMarks[product.slug];

          return (
            <motion.div key={product.slug} variants={item}>
              <Link
                href={`/products/${product.slug}`}
                className="group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-2 transition-colors hover:border-accent/60"
              >
                <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} disabled={false} />
                <div className="relative flex h-full flex-col overflow-hidden rounded-xl">
                  <div className="relative flex h-48 shrink-0 items-center justify-center overflow-hidden bg-black">
                    {/* Ambient glow, same treatment as the catalog product
                        cards: soft diffused light in the category color
                        instead of a flat tinted panel. */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-8 opacity-50 blur-2xl transition-opacity duration-300 group-hover:opacity-75"
                      style={{
                        background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(${glow}, 0.4) 0%, rgba(${glow}, 0.16) 45%, transparent 75%)`,
                      }}
                    />

                    {image ? (
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        sizes="400px"
                        style={
                          photoStyle === "card"
                            ? {
                                objectFit: "contain",
                                maskImage: "radial-gradient(ellipse 60% 60% at 50% 46%, black 45%, transparent 88%)",
                                WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 46%, black 45%, transparent 88%)",
                              }
                            : { objectFit: "contain" }
                        }
                        className={photoStyle === "card" ? "p-6" : "p-5 drop-shadow-2xl"}
                      />
                    ) : (
                      <Icon size={48} className="relative z-10 text-foreground/70" strokeWidth={1.25} />
                    )}

                    {promo && (
                      <PromoTag label={promo.label} className="absolute top-3 left-3" />
                    )}
                    {product.badge && (
                      <span
                        className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${BADGE_STYLES[product.badge]}`}
                      >
                        {product.badge}
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
                        {promo ? (
                          <>
                            <span className="text-lg font-semibold tracking-tight text-accent">
                              {promo.now}
                            </span>
                            <span className="ml-2 text-sm text-muted line-through">
                              {promo.was}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg font-semibold tracking-tight">{product.price}</span>
                            {product.priceStatus === "on-request" && (
                              <p className="text-[11px] text-muted">ask for current price</p>
                            )}
                          </>
                        )}
                      </div>
                      <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                        View details
                      </span>
                    </div>
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
