import type { CatalogCategory } from "@/lib/catalog";

// Single source of truth for branding. Replace SITE_NAME once you've picked a
// business name; every component pulls from here, so it only needs to change once.
export const SITE_NAME = "Longitivity";
export const SITE_TAGLINE = "Curated Wellness & Home Essentials";

export const CONTACT = {
  email: "contact@longitivity.com",
};

// Categories that count as opened personal-care/health/consumable items under
// most retailers' hygiene exclusions (Amazon/Walmart restrict or block these
// once opened, even inside their general return window).
const HYGIENE_EXCLUDED: CatalogCategory[] = ["Nutrilite", "Artistry", "Personal Care", "XS"];

// Standard customer satisfaction guarantee, processed directly through me
// (refund / exchange / credit), not a corporate return line. Water & Air
// Treatment systems get a shorter window than everything else.
export function getReturnPolicy(category: CatalogCategory): string {
  const window = category === "Water & Air Treatment" ? "4 months" : "6 months";
  return `100% satisfaction guarantee: return within ${window} through me for a refund, exchange, or credit.`;
}

// Retailer return policy, tailored to whether this specific product's
// category is subject to that retailer's opened-item/hygiene exclusions.
// Confirmed from each retailer's own help-center pages; verify before quoting
// exact figures to a customer, since policies can change without notice.
export function getRetailerReturnPolicy(retailer: string, category: CatalogCategory): string {
  const excluded = HYGIENE_EXCLUDED.includes(category);

  if (retailer === "Amazon") {
    return excluded
      ? "1 month from delivery, but only if unopened; once opened, items like this are usually final sale."
      : "1 month from delivery for a full refund.";
  }

  if (retailer === "Walmart") {
    return excluded
      ? "3 months, but once opened, items like this can usually only be returned in-store, not by mail."
      : "3 months for a full refund.";
  }

  if (retailer === "Costco") {
    return category === "Water & Air Treatment"
      ? "No general time limit, though electronics like this are limited to 3 months."
      : "No time limit: full refund whenever you're not satisfied.";
  }

  return "Contact retailer for current policy.";
}
