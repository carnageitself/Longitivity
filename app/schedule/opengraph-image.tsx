import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site-config";
import { OG_SIZE, OgFrame, loadOgFonts, loadOgLogo } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Book a free product demo and samples";

export default async function Image() {
  const [fonts, logoSrc] = await Promise.all([loadOgFonts(), loadOgLogo()]);

  return new ImageResponse(
    (
      <OgFrame
        siteName={SITE_NAME}
        logoSrc={logoSrc}
        eyebrow="Free demo & samples"
        title="Book a slot that suits you."
        subtitle="Pick a time and a representative will confirm your free product demo and samples. No charge, no obligation."
      />
    ),
    { ...size, fonts },
  );
}
