import Image from "next/image";
import { CATEGORY_VISUAL, type CatalogCategory } from "@/lib/catalog";

export default function CategoryVisual({
  category,
  width,
  height,
  iconSize,
  rounded = "rounded-3xl",
  image,
  photoStyle,
  alt,
}: {
  category: CatalogCategory;
  width: number;
  height: number;
  iconSize?: number;
  rounded?: string;
  // Optional per-product override; falls back to the category-level image.
  image?: string;
  photoStyle?: "transparent" | "card";
  alt?: string;
}) {
  const visual = CATEGORY_VISUAL[category];
  const Icon = visual.icon;
  const resolvedImage = image ?? visual.image;
  const resolvedPhotoStyle = image ? photoStyle : visual.photoStyle;

  if (resolvedImage) {
    if (resolvedPhotoStyle === "card") {
      return (
        <div
          style={{ width, height }}
          className={`relative flex items-center justify-center overflow-hidden ${rounded} border border-white/10 bg-linear-to-br ${visual.gradient} shadow-xl shadow-black/40`}
        >
          <Image
            src={resolvedImage}
            alt={alt ?? category}
            fill
            sizes={`${width}px`}
            style={{
              objectFit: "contain",
              maskImage: "radial-gradient(ellipse 60% 60% at 50% 46%, black 45%, transparent 88%)",
              WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 46%, black 45%, transparent 88%)",
            }}
            className="p-3"
          />
        </div>
      );
    }

    return (
      <div style={{ width, height }} className="relative">
        <Image
          src={resolvedImage}
          alt={alt ?? category}
          fill
          sizes={`${width}px`}
          style={{ objectFit: "contain" }}
          className="drop-shadow-2xl"
        />
      </div>
    );
  }

  return (
    <div
      style={{ width, height }}
      className={`flex items-center justify-center ${rounded} border border-white/10 bg-linear-to-br ${visual.gradient} shadow-xl shadow-black/40`}
    >
      <Icon size={iconSize ?? Math.round(width * 0.4)} className="text-foreground/80" strokeWidth={1.5} />
    </div>
  );
}
