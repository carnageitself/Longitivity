import type { MetadataRoute } from "next";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Deliberately no Disallow for the `?category=` duplicates. Blocking
        // them would stop crawlers reading the rel=canonical on /products that
        // consolidates them, stranding any external links that point there.
        // Internal links now go to /collections/* instead, so they fade out.
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
