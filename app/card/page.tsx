import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE, CONTACT } from "@/lib/site-config";

// Standalone digital business card: meant to be handed out as a direct link
// or QR code, not browsed to from the main site nav. Deliberately excluded
// from the sitemap and de-indexed below for the same reason.
export const metadata: Metadata = {
  title: `Get in Touch | ${SITE_NAME}`,
  description: `Contact details, the full ${SITE_NAME} site, and a look at Artistry skincare — all in one place.`,
  robots: { index: false, follow: false },
};

const PHONE_DISPLAY = "+1 (805) 212-8139";
const PHONE_HREF = "tel:+18052128139";

export default function CardPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center overflow-y-auto bg-background px-7 py-16 text-foreground lg:h-dvh lg:justify-center lg:overflow-hidden lg:px-6 lg:py-6">
      <div className="flex w-full max-w-md flex-col items-center gap-14 lg:max-w-2xl lg:gap-6">
        {/* Identity */}
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-2xl font-bold tracking-tight">{SITE_NAME}</p>
          <p className="text-sm text-muted">{SITE_TAGLINE}</p>
        </div>

        {/* Artistry video */}
        <div className="flex w-full flex-col gap-3">
          <p className="text-xs font-medium tracking-wide text-accent uppercase">Artistry</p>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {/* Ambient loop, no controls: purely visual, so no caption track needed. */}
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={encodeURI("/Artistry video.mp4")}
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              className="pointer-events-none w-full"
            />
          </div>
          <Link
            href="/"
            className="shine-cta flex items-center justify-center gap-2 rounded-2xl bg-linear-to-br from-accent to-[#8a6d3b] px-6 py-5 text-center text-sm leading-snug font-medium tracking-wide text-accent-foreground shadow-md shadow-amber-900/40 ring-1 ring-inset ring-white/25 transition-opacity hover:opacity-90"
          >
            Care about your health?
            <br className="sm:hidden" /> Lemme hook you up!
          </Link>
        </div>

        {/* Contact */}
        <div className="flex w-full flex-col gap-3">
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-3 rounded-2xl border border-border px-5 py-4 text-sm font-medium transition-colors hover:bg-surface"
          >
            <Mail size={18} className="shrink-0 text-accent" />
            {CONTACT.email}
          </a>
          <a
            href={PHONE_HREF}
            className="flex items-center gap-3 rounded-2xl border border-border px-5 py-4 text-sm font-medium transition-colors hover:bg-surface"
          >
            <Phone size={18} className="shrink-0 text-accent" />
            {PHONE_DISPLAY}
          </a>
        </div>

        <p className="text-xs text-muted">
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>
    </main>
  );
}
