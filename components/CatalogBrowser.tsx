"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { catalog, CATEGORY_INFO, CATEGORY_VISUAL, type CatalogCategory } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import { type PromoMark } from "@/lib/promotions";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

const CATEGORIES = Object.keys(CATEGORY_INFO) as CatalogCategory[];

// Skip anything with no real photo (own image or the category fallback) so
// the catalog only shows products with actual photography, not icon cards.
const CATALOG_WITH_IMAGE = catalog.filter((p) => p.image ?? CATEGORY_VISUAL[p.category].image);

const SEARCH_PLACEHOLDERS = [
  "Search Nutrilite vitamins...",
  "Looking for Artistry skincare?",
  "Try 'energy drink'...",
  "Search for a water filter...",
  "Search Glister oral care...",
];

function isCatalogCategory(value: string | null): value is CatalogCategory {
  return CATEGORIES.includes(value as CatalogCategory);
}

export default function CatalogBrowser({
  // Built on the server and passed in: this component is a client component,
  // and working the date out here could disagree with the prerendered HTML.
  promoMarks = {},
}: {
  promoMarks?: Record<string, PromoMark>;
}) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState<CatalogCategory | "All">(
    isCatalogCategory(categoryParam) ? categoryParam : "All",
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return CATALOG_WITH_IMAGE.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("All")}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === "All"
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted hover:bg-surface"
            }`}
          >
            All ({CATALOG_WITH_IMAGE.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted hover:bg-surface"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <PlaceholdersAndVanishInput
          placeholders={SEARCH_PLACEHOLDERS}
          onChange={(e) => setQuery(e.target.value)}
          onSubmit={(e) => e.preventDefault()}
          className="h-10 sm:mr-0 sm:ml-auto sm:w-96"
        />
      </div>

      {activeCategory !== "All" && (
        <p className="mb-8 rounded-xl border border-border bg-surface px-5 py-3 text-sm text-muted">
          <span className="font-medium text-foreground">Did you know? </span>
          {CATEGORY_INFO[activeCategory].blurb}
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">
          No products match that search. Try another term or category.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.slug}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="h-full"
              >
                <ProductCard product={product} promo={promoMarks[product.slug]} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
