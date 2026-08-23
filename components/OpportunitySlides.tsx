"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import OpportunityHero from "@/components/OpportunityHero";
import IncomeGenerators from "@/components/IncomeGenerators";
import AgeModelComparison from "@/components/AgeModelComparison";
import WaysToEarn from "@/components/WaysToEarn";
import OpportunityStats from "@/components/OpportunityStats";
import BusinessTraining from "@/components/BusinessTraining";
import OpportunityCta from "@/components/OpportunityCta";

type Bg = "background" | "surface";

const SLIDES: { id: string; label: string; bg: Bg; node: React.ReactNode }[] = [
  { id: "intro", label: "Overview", bg: "background", node: <OpportunityHero /> },
  { id: "income", label: "Income Generators", bg: "surface", node: <IncomeGenerators /> },
  { id: "ages", label: "Two Ways to Earn", bg: "background", node: <AgeModelComparison /> },
  { id: "earn", label: "Ways to Earn", bg: "surface", node: <WaysToEarn /> },
  { id: "stats", label: "Why Partner", bg: "background", node: <OpportunityStats /> },
  { id: "training", label: "Training", bg: "surface", node: <BusinessTraining /> },
  { id: "next-steps", label: "Next Steps", bg: "background", node: <OpportunityCta /> },
];

const BG_CLASS: Record<Bg, string> = {
  background: "bg-background",
  surface: "bg-surface",
};

export default function OpportunitySlides() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const idx = slideRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { root: container, threshold: [0.6] }
    );

    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, index));
    slideRefs.current[clamped]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goTo(activeRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(activeRef.current - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  return (
    <div
      ref={containerRef}
      className="hide-scrollbar h-dvh w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth"
    >
      {SLIDES.map((slide, i) => (
        <section
          key={slide.id}
          ref={(el) => {
            slideRefs.current[i] = el;
          }}
          className={`flex h-dvh w-full snap-start snap-always items-start justify-center overflow-y-auto px-6 pt-28 pb-16 lg:items-center lg:py-24 ${BG_CLASS[slide.bg]}`}
        >
          {slide.node}
        </section>
      ))}

      {/* Slide index, top-right */}
      <div className="pointer-events-none fixed top-24 right-6 z-40 text-right">
        <p className="font-mono text-xs text-muted">
          {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </p>
      </div>

      {/* Dot navigation */}
      <div className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to ${slide.label}`}
            aria-current={active === i}
            onClick={() => goTo(i)}
            className="group flex items-center justify-end gap-2"
          >
            <span className="pointer-events-none max-w-0 overflow-hidden text-xs font-medium whitespace-nowrap text-muted opacity-0 transition-all duration-200 group-hover:max-w-40 group-hover:opacity-100">
              {slide.label}
            </span>
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full border transition-all ${
                active === i ? "scale-125 border-accent bg-accent" : "border-border bg-transparent group-hover:border-accent"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Prev / next controls */}
      <div className="fixed right-6 bottom-8 z-40 flex flex-col gap-2">
        <button
          type="button"
          aria-label="Previous section"
          disabled={active === 0}
          onClick={() => goTo(active - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-opacity hover:opacity-80 disabled:opacity-30"
        >
          <ChevronUp size={18} />
        </button>
        <button
          type="button"
          aria-label="Next section"
          disabled={active === SLIDES.length - 1}
          onClick={() => goTo(active + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-opacity hover:opacity-80 disabled:opacity-30"
        >
          <ChevronDown size={18} />
        </button>
      </div>
    </div>
  );
}
