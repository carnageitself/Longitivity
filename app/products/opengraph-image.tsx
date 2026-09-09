import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site-config";
import { OG_SIZE, OgFrame, loadOgFonts, loadOgLogo } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "The full product catalog";

export default async function Image() {
  const [fonts, logoSrc] = await Promise.all([loadOgFonts(), loadOgLogo()]);

  return new ImageResponse(
    (
      <OgFrame
        siteName={SITE_NAME}
        logoSrc={logoSrc}
        eyebrow="The full lineup"
        title="Every product. Every ingredient. One honest price."
        subtitle="No proprietary-blend hand-waving. Tap any product to see exactly what is inside before you commit."
      />
    ),
    { ...size, fonts },
  );
}
