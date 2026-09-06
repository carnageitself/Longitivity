"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Scales } from "@/components/ui/scales";

export default function ArtistrySpotlight() {
  return (
    <section className="mx-auto max-w-7xl overflow-hidden px-6 py-24">
      <div className="grid grid-cols-1 items-center gap-24 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mx-auto h-80 w-72 rounded-lg bg-neutral-950"
        >
          <div className="absolute inset-y-[-30%] -left-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
            <Scales size={8} className="rounded-lg" />
          </div>
          <div className="absolute inset-y-[-30%] -right-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
            <Scales size={8} className="rounded-lg" />
          </div>
          <div className="absolute inset-x-[-30%] -top-10 h-8 w-[160%] mask-r-from-90% mask-l-from-90%">
            <Scales size={8} className="rounded-lg" />
          </div>
          <div className="absolute inset-x-[-30%] -bottom-10 h-8 w-[160%] mask-r-from-90% mask-l-from-90%">
            <Scales size={8} className="rounded-lg" />
          </div>

          <div className="relative z-10 h-full w-full overflow-hidden rounded-lg bg-surface shadow-sm ring-1 ring-black/40">
            <Image
              src="/artistry.png"
              alt="Artistry skincare and cosmetics lineup"
              fill
              sizes="(min-width: 1024px) 400px, 90vw"
              className="object-contain"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xs font-medium tracking-wide text-accent uppercase">Artistry</p>
          <h2 className="mt-3 max-w-md font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            Prestige beauty, without the department-store markup.
          </h2>
          <p className="mt-4 max-w-md text-muted">
            Complexion, eye, and lip: the full Artistry line, sold exclusively
            through consultants like me, at the same price you&apos;d pay
            anywhere else it&apos;s sold.
          </p>
          <Link
            href="/collections/artistry"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
          >
            Shop Artistry
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
