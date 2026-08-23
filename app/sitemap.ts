import type { MetadataRoute } from "next";
import { catalog } from "@/lib/catalog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://longitivity.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/for-you`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/partners`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/opportunity`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const productRoutes: MetadataRoute.Sitemap = catalog.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
