import Image from "next/image";
import { CATEGORY_VISUAL, type CatalogCategory } from "@/lib/catalog";

export default function CategoryVisual({
  category,
  width,
  height,
  iconSize,
  rounded = "rounded-3xl",
}: {
  category: CatalogCategory;
  width: number;
  height: number;
  iconSize?: number;
  rounded?: string;
}) {
  const visual = CATEGORY_VISUAL[category];
  const Icon = visual.icon;

  if (visual.image) {
    if (visual.photoStyle === "card") {
      return (
        <div
          style={{ width, height }}
          className={`relative flex items-center justify-center ${rounded} bg-white p-3 shadow-xl shadow-black/40`}
        >
          <Image
            src={visual.image}
            alt={category}
            fill
            sizes={`${width}px`}
            style={{ objectFit: "contain" }}
            className="p-2"
          />
        </div>
      );
    }

    return (
      <div style={{ width, height }} className="relative">
        <Image
          src={visual.image}
          alt={category}
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
