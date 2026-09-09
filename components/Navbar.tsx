"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SITE_NAME } from "@/lib/site-config";
import SamplesButton from "@/components/SamplesButton";
import { useSessionFlag } from "@/lib/sessionFlag";
import PromoBanner from "@/components/PromoBanner";
import StudentOfferModal from "@/components/StudentOfferModal";

const PROMO_DISMISSED = "offer-bar-dismissed";

const LINKS = [
  { href: "/products", label: "Products" },
  { href: "/promotions", label: "Offers" },
  { href: "/for-you", label: "For You" },
  { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // The offer bar sits in normal flow directly above this header, so it moves
  // page content down on its own. This header is fixed, though, which means
  // flow changes do not move it: it has to offset itself by the bar's height
  // while the bar is there, and drop back to the top once it is dismissed.
  // Dismissal has to outlive this component. Every page renders its own
  // Navbar, so navigating remounts it, and plain state would bring the bar
  // back on the next page - which reads as the close button not working.
  const [promoDismissed, dismissPromo] = useSessionFlag(PROMO_DISMISSED);
  const promoOpen = !promoDismissed;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open, and always close it
  // if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Mounted here rather than in the root layout for the same reason the
          offer bar is: /card renders no Navbar, and a timed pop-up over
          someone's digital business card would be wrong. */}
      <StudentOfferModal />
      {promoOpen && <PromoBanner onClose={dismissPromo} />}
      <header
        className={`fixed right-0 left-0 z-50 transition-[top,color,background-color,border-color] duration-300 ${
          // Mirrors the bar's own h-9 sm:h-10. Kept as static classes rather
          // than a measured value so the offset is correct on first paint,
          // before any JavaScript has run.
          promoOpen ? "top-9 sm:top-10" : "top-0"
        } ${
          scrolled || menuOpen
            ? "border-b border-border/80 bg-background/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
      <nav className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-6 sm:px-12 lg:px-20">
        <Link href="/#top" className="text-xl font-bold tracking-tight sm:text-2xl" onClick={() => setMenuOpen(false)}>
          {SITE_NAME}
        </Link>

        <div className="flex items-center gap-8">
          <ul className="hidden items-center gap-8 text-xs font-medium tracking-widest text-muted uppercase md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="group relative inline-block py-1 transition-colors hover:text-foreground">
                  {link.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Wrapper owns the responsive visibility: putting `hidden` on the
              button itself would collide with its own `inline-flex`. */}
          <span className="hidden md:block">
            <SamplesButton />
          </span>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/5 md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-border/80 bg-background/95 backdrop-blur-md md:hidden"
          >
            {LINKS.map((link) => (
              <li key={link.href} className="border-b border-border/60">
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-6 py-4 text-sm font-medium tracking-wide text-muted uppercase transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="px-6 py-4">
              <SamplesButton size="md" onClick={() => setMenuOpen(false)} />
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
      </header>
    </>
  );
}
