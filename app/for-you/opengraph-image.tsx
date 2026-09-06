import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site-config";
import { OG_SIZE, OgFrame, loadOgFonts } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Curated wellness bundles";

export default async function Image() {
  return new ImageResponse(
    (
      <OgFrame
        siteName={SITE_NAME}
        eyebrow="Curated bundles"
        title="Find your starting bundle."
        subtitle="Product bundles put together for students, working professionals, women and families."
      />
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
