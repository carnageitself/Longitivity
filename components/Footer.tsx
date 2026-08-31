import Link from "next/link";
import { Mail } from "lucide-react";
import BrandSparkles from "@/components/BrandSparkles";
import BackToTop from "@/components/BackToTop";
import { SITE_NAME, SITE_TAGLINE, CONTACT } from "@/lib/site-config";

const NAV_COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Shop",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/for-you", label: "For You" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/partners", label: "Our Brands" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-6 py-16 sm:mx-12 lg:mx-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 max-w-sm lg:col-span-1">
            <BrandSparkles />
            <p className="mt-3 text-sm text-muted">{SITE_TAGLINE}</p>
          </div>

          {NAV_COLUMNS.map((column) => (
            <div key={column.heading}>
              <p className="text-xs font-medium tracking-widest text-foreground uppercase">
                {column.heading}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs font-medium tracking-widest text-foreground uppercase">
              Get in touch
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
                >
                  <Mail size={14} className="shrink-0 text-accent" />
                  <span className="break-all">{CONTACT.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-6 flex flex-col items-center gap-4 py-8 sm:mx-12 sm:flex-row sm:justify-between lg:mx-20">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
