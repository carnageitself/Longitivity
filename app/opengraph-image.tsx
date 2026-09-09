import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site-config";
import { STUDENT_OFFER_BADGE } from "@/lib/studentOffer";
import { OG_SIZE, OgFrame, loadOgFonts, loadOgLogo } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${SITE_NAME}: wellness and home essentials, price-checked against Amazon, Walmart and Costco`;

export default async function OpengraphImage() {
  const [fonts, logoSrc] = await Promise.all([loadOgFonts(), loadOgLogo()]);

  return new ImageResponse(
    (
      <OgFrame
        siteName={SITE_NAME}
        logoSrc={logoSrc}
        eyebrow="An independent price check"
        title="Serious about your health? Stop buying it blind."
        subtitle="Every product traceable to its source, with full ingredient lists and honest price comparisons against Amazon, Walmart and Costco."
        badge={STUDENT_OFFER_BADGE}
      />
    ),
    { ...size, fonts },
  );
}
