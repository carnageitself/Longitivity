import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site-config";
import { OG_SIZE, OgFrame, loadOgFonts } from "@/lib/og";
import { currentMonth, monthLabel, promotionsForMonth } from "@/lib/promotions";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "This month's promotions";

export default async function Image() {
  const { year, month } = currentMonth();
  const promotions = promotionsForMonth(year, month);

  // The share card states the actual offers, so a link posted in a chat is
  // worth opening. Each promotion's own headline is better copy here than a
  // discount stitched onto a product name: "$15 off all four lip glow shades"
  // sells where "$15 off Go Vibrant Light Up Liquid Lip Glow" only labels.
  // Falls back to the standing description in a month with nothing running,
  // rather than promising a discount that does not exist.
  const subtitle =
    promotions.length > 0
      ? promotions.map((promo) => promo.headline).join(" · ")
      : "Offers change month to month. Every product otherwise at its standard price.";

  return new ImageResponse(
    (
      <OgFrame
        siteName={SITE_NAME}
        eyebrow={monthLabel(year, month)}
        title="Yours for less, this month."
        subtitle={subtitle}
      />
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
