import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

export type OgBackdrop = "light" | "dark" | "transparent";

export type OgPhoto = {
  /** base64 data URI, safe to hand straight to Satori's <img src> */
  src: string;
  backdrop: OgBackdrop;
};

/**
 * Mean luminance of the outer ring of pixels, i.e. the photo's backdrop.
 *
 * The catalog's `photoStyle` flag only distinguishes cut-outs from opaque
 * shots - it doesn't say what colour the opaque ones are, and they are mixed:
 * some are on white, some (Nutrilite Double X among them) are on black. On the
 * site that never mattered because every card sits on a black page behind a
 * radial mask. On a share card it does, so measure rather than assume.
 */
async function detectBackdrop(buf: Buffer): Promise<"light" | "dark"> {
  const N = 24;
  const { data, info } = await sharp(buf)
    .resize(N, N, { fit: "fill" })
    .flatten({ background: "#000000" }) // any alpha resolves against black
    .raw()
    .toBuffer({ resolveWithObject: true });

  const ch = info.channels;
  let total = 0;
  let count = 0;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const onEdge = x === 0 || y === 0 || x === N - 1 || y === N - 1;
      if (!onEdge) continue;
      const i = (y * N + x) * ch;
      // Rec. 601 luma, good enough to separate a white sweep from a black one.
      total += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      count++;
    }
  }
  return total / count > 110 ? "light" : "dark";
}

// Satori has a 500KB budget covering fonts, JSX and images, and it cannot fetch
// from the site's own origin at build time (nothing is deployed yet). So the
// photo is read off disk and inlined as a data URI - downscaled first, because
// six of the catalog files are over 400KB and one is 1MB.
export async function loadOgPhoto(
  publicPath: string,
  { transparent = false, width = 460 }: { transparent?: boolean; width?: number } = {},
): Promise<OgPhoto | null> {
  try {
    const abs = join(process.cwd(), "public", decodeURIComponent(publicPath));
    const buf = await readFile(abs);
    const resized = sharp(buf).resize({ width, withoutEnlargement: true });

    if (transparent) {
      const png = await resized.png({ compressionLevel: 9, palette: true }).toBuffer();
      return { src: `data:image/png;base64,${png.toString("base64")}`, backdrop: "transparent" };
    }

    const [jpeg, backdrop] = await Promise.all([
      resized.jpeg({ quality: 72, mozjpeg: true }).toBuffer(),
      detectBackdrop(buf),
    ]);
    return { src: `data:image/jpeg;base64,${jpeg.toString("base64")}`, backdrop };
  } catch {
    // A missing or unreadable file must not fail the build: the card just
    // renders without the photo.
    return null;
  }
}
