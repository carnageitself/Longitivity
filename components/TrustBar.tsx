"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Brand = { name: string; logo?: string; width: number };

const BRANDS: Brand[] = [
  { name: "Nutrilite", width: 130 },
  { name: "Artistry", width: 110 },
  { name: "Satinique", width: 120 },
  { name: "XS", width: 56 },
  { name: "eSpring", width: 84 },
  { name: "Glister", width: 100 },
];
const LOOP = [...BRANDS, ...BRANDS];

export default function TrustBar() {
  return (
    <section className="border-b border-border bg-surface py-10">
      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-7 text-center text-xs font-medium tracking-wide text-muted uppercase"
        >
          Powered by brands you already trust
        </motion.p>

        <div className="relative flex overflow-hidden">
          {/* Edge fades as solid overlays instead of an animated mask-image:
              masking a moving transform causes visible flicker/pop in some
              browsers as the mask layer gets recomposited every frame. */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-surface to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-surface to-transparent sm:w-24" />
          <motion.div
            className="flex shrink-0 items-center gap-x-16 pr-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          >
            {LOOP.map((brand, i) => (
              <motion.div
                key={`${brand.name}-${i}`}
                className="group flex h-9 shrink-0 items-center justify-center"
                whileHover={{ scale: 1.12 }}
              >
                {brand.logo ? (
                  <div className="relative h-full" style={{ width: brand.width }}>
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      sizes={`${brand.width}px`}
                      className="object-contain object-center opacity-70 transition-all duration-300 filter-[brightness(0)_invert(1)] group-hover:opacity-100 group-hover:filter-none"
                    />
                  </div>
                ) : (
                  <span className="text-lg font-semibold tracking-tight text-muted/80 transition-colors duration-300 group-hover:text-foreground">
                    {brand.name}
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
