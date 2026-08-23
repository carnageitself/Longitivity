"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  useScroll,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { ParticleField, HeroBottles } from "@/components/ui/particle-field";

const FRAME_COUNT = 120;
const frameSrc = (i: number) => `/perfume-frames/frame-${String(i).padStart(3, "0")}.jpg`;
// The crossfade from the static hero art into the frame sequence happens in
// this early slice of scroll progress; the rest is the frame scrub.
const CROSSFADE_END = 0.05;
const FINALE_START = 0.88;
const FINALE_END = 0.97;

function FadeInItem({
  delay,
  className,
  children,
}: {
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ScrollCaption({
  scrollYProgress,
  start,
  end,
  eyebrow,
  title,
  children,
}: {
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  const span = end - start;
  const inPoint = start + span * 0.25;
  const outPoint = end - span * 0.25;
  const opacity = useTransform(scrollYProgress, [start, inPoint, outPoint, end], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [start, inPoint, outPoint, end], [16, 0, 0, -16]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-y-0 left-0 hidden w-[46%] flex-col justify-center px-20 lg:flex"
    >
      <p className="text-xs font-medium tracking-[0.3em] text-accent uppercase">{eyebrow}</p>
      <h2 className="mt-5 max-w-md font-serif text-4xl leading-[1.05] font-medium tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      <p className="mt-6 max-w-md text-base text-muted sm:text-lg">{children}</p>
    </motion.div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [framesReady, setFramesReady] = useState(false);

  // Scroll-driven opacity for these layers is applied by writing directly to
  // the DOM in the scroll listener below (see the useMotionValueEvent call),
  // not via React state — that keeps scrolling perfectly smooth by avoiding a
  // re-render of this whole tree on every scroll tick. The whole scroll-scrub
  // sequence (canvas, captions, CTA) is desktop-only; on mobile these refs
  // simply never get written to, so the hero stays at its resting state.
  const textLayerRef = useRef<HTMLDivElement>(null);
  const bottlesLayerRef = useRef<HTMLDivElement>(null);
  const canvasLayerRef = useRef<HTMLDivElement>(null);
  const particleLayerRef = useRef<HTMLDivElement>(null);
  const isDesktopRef = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const frameFloat = useTransform(scrollYProgress, [CROSSFADE_END, 1], [0, FRAME_COUNT - 1]);

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

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      isDesktopRef.current = mq.matches;
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = frameSrc(i);
      img.onload = img.onerror = () => {
        loaded += 1;
        if (!cancelled && loaded === FRAME_COUNT) setFramesReady(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, []);

  function draw(index: number) {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.clearRect(0, 0, w, h);
    const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }

  useMotionValueEvent(frameFloat, "change", (latest) => {
    if (!isDesktopRef.current) return;
    draw(Math.round(latest));
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isDesktopRef.current) return;

    const t = Math.min(1, Math.max(0, latest / CROSSFADE_END));
    if (textLayerRef.current) textLayerRef.current.style.opacity = String(1 - t);
    if (bottlesLayerRef.current) bottlesLayerRef.current.style.opacity = String(1 - t);
    if (canvasLayerRef.current) canvasLayerRef.current.style.opacity = String(t);

    const finaleT = Math.min(1, Math.max(0, (latest - FINALE_START) / (FINALE_END - FINALE_START)));
    if (particleLayerRef.current) {
      particleLayerRef.current.style.opacity = String(1 - finaleT * 0.7);
    }
  });

  useEffect(() => {
    draw(0);
    const onResize = () => draw(Math.round(frameFloat.get()));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framesReady]);

  return (
    <section ref={sectionRef} id="top" className="relative h-screen bg-black lg:h-[500vh]">
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        <div
          ref={rowRef}
          onMouseMove={handleRowMouseMove}
          onMouseLeave={handleRowMouseLeave}
          className="relative z-10 mx-auto grid w-full max-w-[1800px] flex-1 items-stretch gap-12 px-6 py-16 sm:px-12 lg:grid-cols-[1fr_1.15fr] lg:px-20"
        >
          <div ref={textLayerRef} className="flex h-full flex-col">
            <div className="flex flex-1 flex-col justify-center">
              <FadeInItem
                delay={0.15}
                className="flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-muted uppercase"
              >
                <span className="h-px w-8 bg-accent" aria-hidden />
                For people who take this seriously
              </FadeInItem>
              <FadeInItem
                delay={0.27}
                className="mt-5 font-serif text-4xl leading-[1.05] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl"
              >
                Serious about your health?
                <br />
                Stop buying it <em className="text-accent">blind</em>.
              </FadeInItem>
              <FadeInItem delay={0.39} className="mt-6 max-w-lg text-base text-muted sm:text-lg">
                You don&apos;t end up on a page like this by accident. Every product
                here is traceable to its source and backed by a real person,
                not a random seller you&apos;ll never hear from again.
              </FadeInItem>
            </div>

            <FadeInItem delay={0.51} className="mt-10 mb-10 flex flex-wrap items-center gap-x-8 gap-y-4 lg:mb-16">
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
            </FadeInItem>
          </div>

          <FadeInItem delay={0.63} className="relative mx-auto w-full max-w-lg self-center">
            {/* Particles: not clipped, bleed past the image box, always in front. */}
            <div
              ref={particleLayerRef}
              className="pointer-events-none absolute -inset-6 z-20 sm:-inset-10 lg:-inset-20"
            >
              <ParticleField x={x} y={y} scrollYProgress={scrollYProgress} className="absolute inset-0" />
            </div>

            <div className="relative aspect-square w-full overflow-hidden">
              <div ref={bottlesLayerRef} className="absolute inset-0">
                <HeroBottles x={x} y={y} scrollYProgress={scrollYProgress} />
              </div>

              <div ref={canvasLayerRef} style={{ opacity: 0 }} className="absolute inset-0 hidden lg:block">
                <canvas ref={canvasRef} className="h-full w-full" />
              </div>
            </div>
          </FadeInItem>
        </div>

        <ScrollCaption
          scrollYProgress={scrollYProgress}
          start={0.1}
          end={0.38}
          eyebrow="Artistry · Unknown"
          title="Nobody can quite place it."
        >
          Amber and worn leather, blended so it never smells quite the same
          on two different people.
        </ScrollCaption>

        <ScrollCaption
          scrollYProgress={scrollYProgress}
          start={0.48}
          end={0.72}
          eyebrow="What lingers"
          title={"The compliment starts with “wait—”"}
        >
          Built to get warmer through the day, not weaker. Most people
          notice it by hour three, not minute three.
        </ScrollCaption>
      </div>
    </section>
  );
}
