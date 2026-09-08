import Link from "next/link";
import Image from "next/image";
import { variantsOf, type CatalogProduct } from "@/lib/catalog";

/**
 * Shade / flavour switcher for products that come in more than one.
 *
 * Someone who lands on Root Beer from search should be able to reach Tropical
 * without going back to the catalog, and someone comparing lip gloss shades
 * should see all four at once. Server-rendered links, so every sibling is also
 * a crawlable path between the variant pages rather than a dead end.
 */
export default function VariantNav({ product }: { product: CatalogProduct }) {
  const siblings = variantsOf(product);
  if (siblings.length === 0) return null;

  // Current one first, so the row reads as "you are here, and here is the rest".
  const all = [product, ...siblings];
  const label = product.category === "XS" ? "flavour" : "shade";
  const withPhotos = all.every((p) => p.image);

  return (
    <section className="mt-10">
      <h2 className="text-xs font-medium tracking-wide text-muted uppercase">
        {all.length} {label}s in this range
      </h2>

      {withPhotos ? (
        <ul className="mt-4 flex flex-wrap gap-3">
          {all.map((p) => {
            const isCurrent = p.slug === product.slug;
            return (
              <li key={p.slug}>
                <Link
                  href={`/products/${p.slug}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`flex w-24 flex-col items-center gap-2 rounded-xl border p-2 transition-colors ${
                    isCurrent
                      ? "border-accent bg-surface"
                      : "border-border hover:border-accent/60 hover:bg-surface"
                  }`}
                >
                  <span className="relative h-16 w-full">
                    <Image
                      src={p.image!}
                      alt={p.variantLabel ?? p.name}
                      fill
                      sizes="96px"
                      className="object-contain"
                    />
                  </span>
                  <span
                    className={`text-center text-[11px] leading-tight ${
                      isCurrent ? "font-medium text-foreground" : "text-muted"
                    }`}
                  >
                    {p.variantLabel ?? p.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        // Most XS flavours have no individual photo, so a pill row reads better
        // than a grid of identical category fallback images.
        <ul className="mt-4 flex flex-wrap gap-2">
          {all.map((p) => {
            const isCurrent = p.slug === product.slug;
            return (
              <li key={p.slug}>
                <Link
                  href={`/products/${p.slug}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`inline-flex rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                    isCurrent
                      ? "border-accent bg-accent text-accent-foreground font-medium"
                      : "border-border text-muted hover:bg-surface hover:text-foreground"
                  }`}
                >
                  {p.variantLabel ?? p.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
