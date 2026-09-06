import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site-config";
import { OG_SIZE, OgFrame, loadOgFonts } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Contact Longitivity";

export default async function Image() {
  return new ImageResponse(
    (
      <OgFrame
        siteName={SITE_NAME}
        eyebrow="Contact"
        title="Get in touch."
        subtitle="A dedicated account executive for product picks, order tracking, delivery and refunds. One person, not a support queue."
      />
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
