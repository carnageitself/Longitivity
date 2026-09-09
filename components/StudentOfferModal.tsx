"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useSessionFlag } from "@/lib/sessionFlag";

const DELAY_MS = 15_000;
/** Marks the visit, so the countdown survives moving between pages. */
const STARTED_AT = "student-offer-started-at";
/** Marks it as answered, so it is not shown twice in one visit. */
const DISMISSED = "student-offer-dismissed";

/**
 * The student session offer, shown once after fifteen seconds on the site.
 *
 * Two things make it behave like one offer per visit rather than a pop-up that
 * follows someone around:
 *
 *  - The fifteen seconds are counted from the first page of the visit, not from
 *    this component mounting. Every page renders its own Navbar, so this
 *    remounts on each navigation, and a per-mount timer would restart with it -
 *    someone browsing four pages for ten seconds each would never see it, and
 *    someone sitting on one page would see it while a busier reader did not.
 *  - Dismissing it is remembered for the session, so it does not reappear on
 *    the next page. sessionStorage rather than localStorage on purpose: an
 *    offer worth showing once a visit is not worth suppressing forever.
 *
 * Never shown on /schedule, since the whole point is to send someone there.
 */
export default function StudentOfferModal() {
  const [open, setOpen] = useState(false);
  const [alreadyAnswered, markAnswered] = useSessionFlag(DISMISSED);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  // Where focus was before the dialog took it, so it can be handed back.
  const previouslyFocused = useRef<Element | null>(null);

  const dismiss = useCallback(() => {
    setOpen(false);
    markAnswered();
  }, [markAnswered]);

  useEffect(() => {
    if (pathname === "/schedule") return;

    if (alreadyAnswered) return;

    let startedAt: number;
    try {
      const stored = sessionStorage.getItem(STARTED_AT);
      startedAt = stored ? Number(stored) : Date.now();
      if (!stored) sessionStorage.setItem(STARTED_AT, String(startedAt));
    } catch {
      startedAt = Date.now();
    }

    const remaining = DELAY_MS - (Date.now() - startedAt);
    const timer = setTimeout(() => setOpen(true), Math.max(0, remaining));
    return () => clearTimeout(timer);
  }, [pathname, alreadyAnswered]);

  // Escape to close, and hold the page still while the dialog is up. Same
  // scroll-lock technique the mobile menu already uses.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      (previouslyFocused.current as HTMLElement | null)?.focus?.();
    };
  }, [open, dismiss]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 px-6 backdrop-blur-sm"
          // Clicking the backdrop closes, but only the backdrop itself: without
          // the target check, a click that started on the panel and drifted
          // would close it too.
          onClick={(event) => {
            if (event.target === event.currentTarget) dismiss();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-offer-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-accent/25 bg-surface p-8 text-center shadow-2xl shadow-black/60 sm:p-10"
          >
            {/* Ambient gold wash, the same treatment the promotions masthead
                opens with, so the dialog reads as part of the house. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(198, 161, 92, 0.16) 0%, transparent 70%)",
              }}
            />

            <button
              ref={closeRef}
              type="button"
              onClick={dismiss}
              aria-label="Close offer"
              className="absolute top-3 right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              <X size={16} />
            </button>

            <div className="relative">
              <p className="text-[11px] font-medium tracking-[0.25em] text-accent uppercase">
                Students
              </p>

              <h2
                id="student-offer-title"
                className="mt-5 font-serif text-3xl font-medium tracking-tight sm:text-4xl"
              >
                Half off your first skin care session.
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-muted">
                Bring a student ID and take 50% off a one-to-one skin care
                consultation: your skin type, your routine, and which Artistry
                products are actually worth your money. Nothing to buy at the
                end of it.
              </p>

              <Link
                href="/schedule"
                onClick={dismiss}
                className="shine-cta mt-8 inline-flex w-full items-center justify-center rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Book my session
              </Link>

              <button
                type="button"
                onClick={dismiss}
                className="mt-4 cursor-pointer text-xs text-muted transition-colors hover:text-foreground"
              >
                Not right now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
