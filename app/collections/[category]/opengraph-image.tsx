import { ImageResponse } from "next/og";
import { CATEGORY_VISUAL } from "@/lib/catalog";
import { CATEGORY_SEO, CATEGORY_SEO_BY_SLUG, productsIn } from "@/lib/categories";
import { OG_SIZE, OgFrame, OgPhotoPanel, loadOgFonts, loadOgLogo } from "@/lib/og";
import { loadOgPhoto } from "@/lib/ogPhoto";
import { SITE_NAME } from "@/lib/site-config";

export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return CATEGORY_SEO.map((entry) => ({ category: entry.slug }));
}

export default async function CollectionOgImage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const entry = CATEGORY_SEO_BY_SLUG.get(category);
  const [fonts, logoSrc] = await Promise.all([loadOgFonts(), loadOgLogo()]);

  if (!entry) {
    return new ImageResponse(
      <OgFrame siteName={SITE_NAME} logoSrc={logoSrc} eyebrow="Collection" title="Not found" />,
      { ...size, fonts },
    );
  }

  const products = productsIn(entry.category);
  const visual = CATEGORY_VISUAL[entry.category];

  // Only three of the six categories carry their own hero shot; the rest fall
  // back to their first photographed product so every card gets imagery
  // instead of some rendering text-only.
  const hero = visual.image
    ? { image: visual.image, photoStyle: visual.photoStyle }
    : products.find((p) => p.image);

  const photo = hero?.image
    ? await loadOgPhoto(hero.image, { transparent: hero.photoStyle === "transparent" })
    : null;

  // Not reusing entry.description here: it is written to fill a ~155-character
  // SERP snippet and overflows the narrower text column beside a photo.
  return new ImageResponse(
    (
      <OgFrame
        siteName={SITE_NAME}
        logoSrc={logoSrc}
        eyebrow={entry.category}
        title={entry.h1}
        subtitle={`${products.length} products, every one with a full ingredient list and an honest price comparison.`}
        right={
          photo ? (
            <OgPhotoPanel src={photo.src} backdrop={photo.backdrop} size={320} />
          ) : undefined
        }
      />
    ),
    { ...size, fonts },
  );
}
