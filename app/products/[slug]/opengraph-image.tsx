import { ImageResponse } from "next/og";
import { catalog, CATEGORY_VISUAL } from "@/lib/catalog";
import { OG_SIZE, OgFrame, OgPhotoPanel, loadOgFonts, loadOgLogo } from "@/lib/og";
import { loadOgPhoto } from "@/lib/ogPhoto";
import { SITE_NAME } from "@/lib/site-config";

export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return catalog.map((product) => ({ slug: product.slug }));
}

export default async function ProductOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = catalog.find((p) => p.slug === slug);
  const [fonts, logoSrc] = await Promise.all([loadOgFonts(), loadOgLogo()]);

  if (!product) {
    return new ImageResponse(
      (
        <OgFrame
          siteName={SITE_NAME}
          logoSrc={logoSrc}
          eyebrow="Product"
          title="Product not found"
        />
      ),
      { ...size, fonts },
    );
  }

  // Same fallback chain the product cards use: the product's own photo, else
  // the category shot, else no image at all.
  const visual = CATEGORY_VISUAL[product.category];
  const source = product.image ?? visual.image;
  const photoStyle = product.image ? product.photoStyle : visual.photoStyle;
  const photo = source
    ? await loadOgPhoto(source, { transparent: photoStyle === "transparent" })
    : null;

  const priceLine =
    product.priceStatus === "on-request" ? "Price on request" : product.price;

  return new ImageResponse(
    (
      <OgFrame
        siteName={SITE_NAME}
        logoSrc={logoSrc}
        eyebrow={product.category}
        title={product.name}
        subtitle={product.hook}
        footer={`${priceLine}  ·  ${product.size}`}
        right={
          photo ? (
            <OgPhotoPanel src={photo.src} backdrop={photo.backdrop} size={340} />
          ) : undefined
        }
      />
    ),
    { ...size, fonts },
  );
}
