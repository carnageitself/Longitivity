"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconHome,
  IconShoppingBag,
  IconSparkles,
  IconUsers,
  IconMail,
} from "@tabler/icons-react";
import { SITE_NAME } from "@/lib/site-config";
import { FloatingDock } from "@/components/ui/floating-dock";

const LINKS = [
  { href: "/products", label: "Products" },
  { href: "/for-you", label: "For You" },
  { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Contact" },
];

const DOCK_ITEMS = [
  {
    title: "Home",
    icon: <IconHome className="h-full w-full text-muted" />,
    href: "/#top",
  },
  {
    title: "Products",
    icon: <IconShoppingBag className="h-full w-full text-muted" />,
    href: "/products",
  },
  {
    title: "For You",
    icon: <IconSparkles className="h-full w-full text-muted" />,
    href: "/for-you",
  },
  {
    title: "Partners",
    icon: <IconUsers className="h-full w-full text-muted" />,
    href: "/partners",
  },
  {
    title: "Contact",
    icon: <IconMail className="h-full w-full text-muted" />,
    href: "/contact",
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-20 flex h-16 items-center justify-between">
        <Link href="/#top" className="text-2xl font-bold tracking-tight">
          {SITE_NAME}
        </Link>

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

        <FloatingDock items={DOCK_ITEMS} desktopClassName="!hidden" />
      </nav>
    </header>
  );
}
