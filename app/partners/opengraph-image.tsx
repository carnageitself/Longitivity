import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site-config";
import { OG_SIZE, OgFrame, loadOgFonts } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "The brands behind every product";

export default async function Image() {
  return new ImageResponse(
    (
      <OgFrame
        siteName={SITE_NAME}
        eyebrow="Our brands"
        title="Nine brands. One roof."
        subtitle="Nutrilite, Artistry, Satinique, Glister, XS, eSpring, g&h, iCook and Atmosphere."
      />
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
