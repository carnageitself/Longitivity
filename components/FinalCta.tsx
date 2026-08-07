"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import CategoryVisual from "@/components/CategoryVisual";

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-surface py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/15 blur-[110px]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative order-2 mx-auto flex w-full max-w-xs items-center justify-center gap-6 sm:max-w-sm lg:order-1"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
          >
            <CategoryVisual category="XS" width={140} height={140} rounded="rounded-3xl" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <CategoryVisual category="Artistry" width={140} height={140} rounded="rounded-3xl" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="order-1 flex flex-col items-center gap-6 text-center lg:order-2 lg:items-start lg:text-left"
        >
          <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            Not sure where to start?
          </h2>
          <p className="max-w-lg text-muted">
            Browse bundles built for your situation, or just send a message.
            I&apos;ll help you find the right fit.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start">
            <Link
              href="/for-you"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              See bundles for you
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Get in touch
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
