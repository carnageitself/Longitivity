"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-black py-24 sm:py-32 lg:py-44">
      <Image
        src="/longitivity-CTA.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        quality={100}
        className="object-cover sm:object-contain"
      />
      {/* Second copy, blurred and masked to only show near the outer edge:
          keeps the photo sharp in the middle while softly blurring it into
          the black background at the perimeter, instead of a hard cutoff. */}
      <Image
        src="/longitivity-CTA.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        quality={100}
        className="object-cover blur-md sm:object-contain"
        style={{
          maskImage: "radial-gradient(ellipse 60% 55% at 50% 45%, transparent 55%, black 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 55% at 50% 45%, transparent 55%, black 100%)",
        }}
      />
      {/* Soft light spilling down from above: blurs the seam where the
          photo's top edge would otherwise read as a picture frame, so it
          feels like ambient light falling across one continuous scene. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-2/3 blur-3xl"
        style={{
          background: "radial-gradient(ellipse 65% 100% at 50% 0%, rgba(255,255,255,0.16) 0%, transparent 65%)",
        }}
      />
      {/* Contrast only where the copy sits, not across the whole photo: a
          soft dark pool centered on the text block, fading out quickly so
          the rest of the image keeps its full brightness and mood. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 42% 48% at 50% 50%, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 55%, transparent 85%)",
        }}
      />
      {/* Solid black-to-transparent fade at the top of the image, matching
          the section above's own background so the two bleed into each
          other instead of cutting hard at the boundary. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-linear-to-b from-black to-transparent"
      />

      <div className="relative z-20 mx-auto max-w-3xl px-6 text-center">
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
