import Link from "next/link";
import { Mail } from "lucide-react";
import BrandSparkles from "@/components/BrandSparkles";
import { SITE_NAME, SITE_TAGLINE, CONTACT } from "@/lib/site-config";
import { CATEGORY_SEO } from "@/lib/categories";

// Every category landing page, linked from every page on the site. Sitewide
// footer links are what keep these one hop from anywhere a crawler lands.
// Split by where the product is used: on/in the body (personal wellness)
// versus on the home environment (water, air, surfaces).
const PERSONAL_WELLNESS_SLUGS = ["nutrilite", "artistry", "xs-energy", "personal-care"];
const HOME_ENVIRONMENT_SLUGS = ["home-care", "water-air-treatment"];

function categoryLinks(slugs: string[]) {
  return CATEGORY_SEO.filter((entry) => slugs.includes(entry.slug)).map((entry) => ({
    href: `/collections/${entry.slug}`,
    label: entry.category,
  }));
}

const RANGE_COLUMN_HEADINGS = ["Personal Care", "Home Care"];

const NAV_COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Shop",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/for-you", label: "For You" },
    ],
  },
  {
    heading: "Personal Care",
    links: categoryLinks(PERSONAL_WELLNESS_SLUGS),
  },
  {
    heading: "Home Care",
    links: categoryLinks(HOME_ENVIRONMENT_SLUGS),
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
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:gap-y-12 lg:grid-cols-[1.3fr_0.9fr_1fr_1.1fr_0.9fr_1fr]">
          <div className="col-span-2 mx-auto flex max-w-sm flex-col items-center text-center sm:mx-0 sm:items-start sm:text-left lg:col-span-1">
            <BrandSparkles />
            <p className="mt-3 text-sm text-muted">{SITE_TAGLINE}</p>
          </div>

          {NAV_COLUMNS.map((column) => (
            <div
              key={column.heading}
              className={`${RANGE_COLUMN_HEADINGS.includes(column.heading) ? "hidden sm:flex" : "flex"} flex-col items-center text-center sm:items-start sm:text-left`}
            >
              <p className="text-xs font-medium tracking-widest text-foreground uppercase">
                {column.heading}
              </p>
              <ul className="mt-4 flex flex-col items-center gap-3 sm:items-start">
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

          <div className="col-span-2 flex flex-col items-center text-center sm:col-span-1 sm:items-start sm:text-left">
            <p className="text-xs font-medium tracking-widest text-foreground uppercase">
              Get in touch
            </p>
            <ul className="mt-4 flex flex-col items-center gap-3 sm:items-start">
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
        <div className="mx-6 flex flex-col items-center gap-4 py-8 sm:mx-12 sm:flex-row lg:mx-20">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
