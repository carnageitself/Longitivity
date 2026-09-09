import type { MetadataRoute } from "next";
import { catalog } from "@/lib/catalog";
import { CATEGORY_SEO } from "@/lib/categories";
import { absoluteUrl } from "@/lib/seo";

// Build time is the honest answer for a fully static catalog: every page in
// here is regenerated on deploy, so that is genuinely when it last changed.
// Omitting lastModified entirely (as before) gives crawlers nothing to
// prioritise on.
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/products"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    // Daily: the offers on this page turn over with the calendar month, so it
    // is the one static route whose content genuinely changes without a deploy.
    { url: absoluteUrl("/promotions"), lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/for-you"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/partners"), lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/opportunity"), lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/schedule"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/contact"), lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Category landing pages sit above individual products: they are the pages
  // built to rank for "nutrilite vitamins" and "espring water filter".
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_SEO.map((entry) => ({
    url: absoluteUrl(`/collections/${entry.slug}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = catalog.map((product) => ({
    url: absoluteUrl(`/products/${product.slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
    // Image entries get the product photography into Google Images, which is
    // a real traffic source for "what does X look like" product searches.
    ...(product.image ? { images: [absoluteUrl(product.image)] } : {}),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
