import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

// Shared design tokens and layout for every generated share card, so the OG
// images stay in step with the site instead of drifting into their own look.
// Values mirror :root in app/globals.css.
export const OG_SIZE = { width: 1200, height: 630 };

export const OG = {
  background: "#000000",
  foreground: "#ffffff",
  muted: "#a1a1aa",
  border: "#27272a",
  surface: "#111113",
  accent: "#c6a15c",
  /** accent as raw channels, for rgba() glows */
  accentRgb: "198, 161, 92",
} as const;

// Satori only accepts ttf/otf/woff, and next/font emits woff2, so the two
// theme faces are vendored in assets/ and read from disk at build time. That
// also keeps builds off the network. Total ~141KB against Satori's 500KB
// budget, which leaves room for a product photo alongside them.
export async function loadOgFonts() {
  const [fraunces, geist] = await Promise.all([
    readFile(join(process.cwd(), "assets/Fraunces-SemiBold.ttf")),
    readFile(join(process.cwd(), "assets/Geist-Regular.ttf")),
  ]);
  return [
    { name: "Fraunces", data: fraunces, weight: 600 as const, style: "normal" as const },
    { name: "Geist", data: geist, weight: 400 as const, style: "normal" as const },
  ];
}

export const BRAND_LINE = "Nutrilite · Artistry · Satinique · Glister · XS · eSpring";

const LOGO_FILE = "Longitivity logo transparent.png";

/**
 * The brand mark, inlined as a data URI for Satori's <img src>.
 *
 * Trimmed before resizing: the source is a 500px square with the monogram
 * filling only about half of it, so mounted untrimmed at lockup size the mark
 * would render at roughly half the height of the wordmark beside it. trim()
 * takes the transparent margin off and lets the glyph fill the box it is given.
 *
 * Returns null rather than throwing: a missing logo should cost the card its
 * mark, not fail the build.
 */
export async function loadOgLogo(size = 128): Promise<string | null> {
  try {
    const buf = await readFile(join(process.cwd(), "public", LOGO_FILE));
    const png = await sharp(buf)
      .trim()
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * The product shot on the right of a card.
 *
 * How it's mounted depends on what the photo's own backdrop is:
 *  - light  → a pale plate, the way the catalog cards present white-background
 *             shots, so the photo doesn't glare against the black field
 *  - dark / transparent → straight onto the card over a gold pool, which is the
 *             on-site treatment and blends seamlessly since the card is black
 */
export function OgPhotoPanel({
  src,
  backdrop,
  size = 320,
}: {
  src: string;
  backdrop: "light" | "dark" | "transparent";
  size?: number;
}) {
  const inner = Math.round(size * 0.87);
  const onPlate = backdrop === "light";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: 22,
        ...(onPlate
          ? { backgroundColor: "#f4f4f5", border: `1px solid ${OG.border}` }
          : {
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(${OG.accentRgb}, 0.26), transparent 68%)`,
            }),
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={inner}
        height={inner}
        style={{ objectFit: "contain", width: inner, height: inner }}
      />
    </div>
  );
}

/**
 * The card shell: black field, gold glow bleeding in from the top right, a
 * hairline inset frame, and the wordmark over a gold gradient rule - the same
 * treatment BrandSparkles gives it in the header.
 *
 * Satori is flexbox-only and needs an explicit `display: flex` on anything
 * with more than one child, so every container below sets it.
 */
export function OgFrame({
  eyebrow,
  title,
  subtitle,
  footer = BRAND_LINE,
  siteName,
  logoSrc,
  badge,
  right,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer?: string;
  siteName: string;
  /** Data URI from loadOgLogo(). Omitted, the lockup is the wordmark alone. */
  logoSrc?: string | null;
  /** Standing offer or similar, as a gold pill under the subtitle. */
  badge?: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: OG.background,
        fontFamily: "Geist",
        position: "relative",
      }}
    >
      {/* Ambient gold wash, echoing the accent glow behind the hero product */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(ellipse 70% 80% at 88% 8%, rgba(${OG.accentRgb}, 0.28), transparent 62%)`,
          display: "flex",
        }}
      />
      {/* Second, tighter pool low-left so the composition isn't lit from one side only */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(ellipse 50% 45% at 6% 96%, rgba(${OG.accentRgb}, 0.12), transparent 70%)`,
          display: "flex",
        }}
      />
      {/* Hairline inset frame: reads as a printed card edge rather than a screenshot */}
      <div
        style={{
          position: "absolute",
          top: 28,
          right: 28,
          bottom: 28,
          left: 28,
          border: `1px solid ${OG.border}`,
          borderRadius: 18,
          display: "flex",
        }}
      />
      {/* Lit top edge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          backgroundImage: `linear-gradient(90deg, transparent, rgba(${OG.accentRgb}, 0.9), transparent)`,
          display: "flex",
        }}
      />

      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 76px",
        }}
      >
        {/* Brand lockup: monogram, then the wordmark over the gold gradient
            rule from BrandSparkles */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {logoSrc && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logoSrc}
              alt=""
              width={52}
              height={52}
              style={{ objectFit: "contain", width: 52, height: 52 }}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div
              style={{
                fontSize: 27,
                fontWeight: 400,
                color: OG.foreground,
                letterSpacing: -0.6,
              }}
            >
              {siteName}
            </div>
            <div
              style={{
                marginTop: 7,
                width: 148,
                height: 1,
                backgroundImage: `linear-gradient(90deg, transparent, ${OG.accent}, transparent)`,
                display: "flex",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 52 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Eyebrow: gold dash + wide uppercase, the same pattern the hero
                and every section header on the site opens with. */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{ width: 32, height: 1, backgroundColor: OG.accent, display: "flex" }}
              />
              <div
                style={{
                  fontSize: 19,
                  color: OG.accent,
                  letterSpacing: 4.4,
                  textTransform: "uppercase",
                }}
              >
                {eyebrow}
              </div>
            </div>

            <div
              style={{
                marginTop: 22,
                fontFamily: "Fraunces",
                // A photo on the right halves the text column, so the headline
                // has to step down or long product names wrap into the footer.
                fontSize: right
                  ? title.length > 40
                    ? 42
                    : 52
                  : title.length > 44
                    ? 60
                    : 72,
                fontWeight: 600,
                color: OG.foreground,
                letterSpacing: -1.6,
                lineHeight: 1.06,
              }}
            >
              {title}
            </div>

            {subtitle && (
              <div
                style={{
                  marginTop: 22,
                  fontSize: 25,
                  color: OG.muted,
                  lineHeight: 1.42,
                  maxWidth: right ? 520 : 820,
                }}
              >
                {subtitle}
              </div>
            )}

            {badge && (
              <div
                style={{
                  marginTop: 24,
                  // alignSelf keeps the pill hugging its text instead of
                  // stretching the full width of the column.
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                  padding: "11px 22px",
                  borderRadius: 999,
                  border: `1px solid rgba(${OG.accentRgb}, 0.5)`,
                  backgroundColor: `rgba(${OG.accentRgb}, 0.1)`,
                  fontSize: 21,
                  color: OG.accent,
                  letterSpacing: 0.2,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    backgroundColor: OG.accent,
                    display: "flex",
                  }}
                />
                {badge}
              </div>
            )}
          </div>

          {right}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: "100%", height: 1, backgroundColor: OG.border, display: "flex" }} />
          <div
            style={{
              marginTop: 20,
              fontSize: 20,
              color: OG.muted,
              letterSpacing: 0.4,
            }}
          >
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
