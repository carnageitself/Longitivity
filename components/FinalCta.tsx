"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-black py-32 lg:py-44">
      <Image
        src="/longitivity-CTA.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        quality={90}
        className="object-contain"
      />
      <div aria-hidden className="absolute inset-0 bg-black/70" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-56 bg-linear-to-b from-black to-transparent" />
      {/* Soft spotlight behind the text: a radial gradient fades to fully
          transparent well within its own box, so there's no hard blur-edge
          for the busy photo behind it to reveal. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="h-[70vh] w-[70vh] max-h-140 max-w-140 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 22%, transparent) 0%, color-mix(in srgb, var(--color-accent) 8%, transparent) 40%, transparent 72%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            Not sure where to start?
          </h2>
          <p className="max-w-lg text-muted">
            Browse bundles built for your situation, or just send a message.
            I&apos;ll help you find the right fit.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
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
