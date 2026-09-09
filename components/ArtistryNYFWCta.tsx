"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ShineLink from "@/components/ui/shine-link";

export default function ArtistryNYFWCta() {
  return (
    <section className="mx-auto max-w-7xl px-0 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="relative aspect-3/2 w-full">
          <Image
            src="/artistryNY.png"
            alt="Artistry, proud sponsor of New York Fashion Week"
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            quality={90}
            style={{ objectFit: "cover" }}
          />
          {/* Dark at the bottom so our CTA reads clearly, fading out toward
              the top so the image's own "Artistry / NYFW" text stays clear. */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-8 pb-10 text-center sm:pb-14">
          {/* Points at the offers page rather than a specific promotion's
              anchor: the Artistry offer on there is month-scoped, so a
              hardcoded #id would dead-link as soon as it rotates out. */}
          <ShineLink href="/promotions" label="Check ongoing offers!" size="lg" />
        </div>
      </motion.div>
    </section>
  );
}
