import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site-config";
import { OG_SIZE, OgFrame, loadOgFonts, loadOgLogo } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Longitivity privacy policy";

export default async function Image() {
  const [fonts, logoSrc] = await Promise.all([loadOgFonts(), loadOgLogo()]);

  return new ImageResponse(
    (
      <OgFrame
        siteName={SITE_NAME}
        logoSrc={logoSrc}
        eyebrow="Privacy"
        title="Your details, and nothing more."
        subtitle="No analytics, no tracking pixels, no data sold. We hold what you type into a form and delete it when there is no reason to keep it."
      />
    ),
    { ...size, fonts },
  );
}
