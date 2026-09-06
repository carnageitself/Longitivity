"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SITE_NAME } from "@/lib/site-config";
import SamplesButton from "@/components/SamplesButton";

const LINKS = [
  { href: "/products", label: "Products" },
  { href: "/for-you", label: "For You" },
  { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-colors duration-300 ${
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
  );
}
