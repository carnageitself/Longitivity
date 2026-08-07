"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight-new";
import { ParallaxHeroImage } from "@/components/ui/parallax-hero-image";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  const rowRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const bgX = useSpring(useTransform(x, [-0.5, 0.5], [30, -30]), { stiffness: 100, damping: 20, mass: 0.5 });
  const bgY = useSpring(useTransform(y, [-0.5, 0.5], [30, -30]), { stiffness: 100, damping: 20, mass: 0.5 });

  function handleRowMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = rowRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleRowMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden bg-black">
      <Spotlight />
      <motion.div
        ref={rowRef}
        onMouseMove={handleRowMouseMove}
        onMouseLeave={handleRowMouseLeave}
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto grid w-full max-w-[1800px] flex-1 items-stretch gap-12 px-6 py-16 sm:px-12 lg:grid-cols-[1fr_1.15fr] lg:px-20"
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-1 flex-col justify-center">
            <motion.p
              variants={item}
              className="flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-muted uppercase"
            >
              <span className="h-px w-8 bg-accent" aria-hidden />
              For people who take this seriously
            </motion.p>
            <motion.h1
              variants={item}
              className="mt-5 font-serif text-5xl leading-[1.05] font-medium tracking-tight text-balance sm:text-6xl"
            >
              Serious about your health?
              <br />
              Stop buying it <em className="text-accent">blind</em>.
            </motion.h1>
            <motion.p variants={item} className="mt-6 max-w-lg text-base text-muted sm:text-lg">
              You don&apos;t end up on a page like this by accident. Every product
              here is traceable to its source and backed by a real person,
              not a random seller you&apos;ll never hear from again.
            </motion.p>
          </div>

          <motion.div variants={item} className="mt-10 mb-16 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              Browse the catalog
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Talk to me
            </Link>
          </motion.div>
        </div>

        <motion.div variants={item} className="relative mx-auto w-full max-w-lg self-center">
          <motion.div style={{ x: bgX, y: bgY }} className="pointer-events-none absolute -inset-20 -z-10">
            <Image
              src="/herobg.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="object-contain opacity-80"
            />
          </motion.div>

          <div className="relative aspect-square w-full overflow-hidden">
            <ParallaxHeroImage className="absolute inset-0" />
            <div
              style={{
                maskImage:
                  "radial-gradient(ellipse at 50% 50%, black 25%, transparent 60%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at 50% 50%, black 25%, transparent 60%)",
              }}
              className="pointer-events-none absolute inset-0 mix-blend-screen"
            >
              <Spotlight
                translateY={-260}
                width={520}
                height={900}
                smallWidth={220}
                xOffset={70}
                duration={6}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
