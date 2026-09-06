import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site-config";
import { OG_SIZE, OgFrame, loadOgFonts } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "The business opportunity, explained";

export default async function Image() {
  return new ImageResponse(
    (
      <OgFrame
        siteName={SITE_NAME}
        eyebrow="The opportunity"
        title="Entrepreneurship in the 21st century."
        subtitle="An honest look at how the compensation plan works, and the training and mentorship behind it."
      />
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
