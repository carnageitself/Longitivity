import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site-config";
import { OG_SIZE, OgFrame, loadOgFonts } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Longitivity terms of use";

export default async function Image() {
  return new ImageResponse(
    (
      <OgFrame
        siteName={SITE_NAME}
        eyebrow="Terms"
        title="The rules, written plainly."
        subtitle="What this site is, how prices and comparisons should be read, and what the satisfaction guarantee actually covers."
      />
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
