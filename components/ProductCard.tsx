import Link from "next/link";
import Image from "next/image";
import { Sparkle, Play } from "lucide-react";
import { CATEGORY_GLOW, CATEGORY_VISUAL, type CatalogProduct } from "@/lib/catalog";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-linear-to-br from-accent to-[#8a6d3b] text-accent-foreground shadow-md shadow-amber-900/40 ring-1 ring-inset ring-white/25",
  New: "bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-inset ring-white/25",
  "Staff Pick": "bg-amber-500 text-black",
};

export default function ProductCard({ product }: { product: CatalogProduct }) {
  const visual = CATEGORY_VISUAL[product.category];
  const glow = CATEGORY_GLOW[product.category];
  const Icon = visual.icon;
  const image = product.image ?? visual.image;
  const photoStyle = product.image ? product.photoStyle : visual.photoStyle;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-2 transition-colors hover:border-accent/60"
    >
      <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} disabled={false} />
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl">
        <div className="relative flex h-32 shrink-0 items-center justify-center bg-black">
          {/* Ambient glow instead of a flat color panel: soft, diffused light
              in the category color, brightest directly behind the product
              and fading to nothing well before the card edge. Intensifies
              slightly on hover for a bit of premium sheen. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 opacity-50 blur-2xl transition-opacity duration-300 group-hover:opacity-75"
            style={{
              background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(${glow}, 0.4) 0%, rgba(${glow}, 0.16) 45%, transparent 75%)`,
            }}
          />
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="400px"
              style={
                photoStyle === "card"
                  ? {
                      objectFit: "contain",
                      maskImage: "radial-gradient(ellipse 60% 60% at 50% 46%, black 45%, transparent 88%)",
                      WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 46%, black 45%, transparent 88%)",
                    }
                  : { objectFit: "contain" }
              }
              className={photoStyle === "card" ? "p-4" : "p-3 drop-shadow-2xl"}
            />
          ) : (
            <Icon size={40} className="relative z-10 text-foreground/70" strokeWidth={1.25} />
          )}
          {product.badge && (
            <span
              className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${BADGE_STYLES[product.badge]}`}
            >
              {product.badge}
            </span>
          )}
          {product.videoId && (
            <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
              <Play size={11} className="fill-current" />
              Video
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <span className="text-xs font-medium tracking-wide text-muted uppercase">
            {product.category}
          </span>

          <h3 className="mt-1 line-clamp-2 font-semibold">{product.name}</h3>
          <p className="mt-1 text-xs text-muted">{product.size}</p>

          <p className="mt-3 flex items-start gap-1.5 text-sm">
            <Sparkle size={14} className="mt-0.5 shrink-0 text-accent" />
            <span className="line-clamp-2">{product.hook}</span>
          </p>

          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <div>
              <span className="text-lg font-semibold tracking-tight">{product.price}</span>
              {product.priceStatus === "approx" && (
                <p className="text-[11px] text-muted">estimated</p>
              )}
              {product.priceStatus === "on-request" && (
                <p className="text-[11px] text-muted">ask for current price</p>
              )}
            </div>
            <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
              View details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
