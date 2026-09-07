import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE, CONTACT } from "@/lib/site-config";

// Standalone digital business card: meant to be handed out as a direct link
// or QR code, not browsed to from the main site nav. Deliberately excluded
// from the sitemap and de-indexed below for the same reason.
export const metadata: Metadata = {
  // Bare title: the root layout template appends the brand, so spelling it out
  // here produced "Get in Touch | Longitivity | Longitivity".
  title: "Get in Touch",
  description: `Contact details, the full ${SITE_NAME} site, and a look at Artistry skincare — all in one place.`,
  // Kept out of the index, but `follow` so the crawler still walks the links
  // through to the main site instead of treating them as a dead end.
  robots: { index: false, follow: true },
};

const PHONE_DISPLAY = "+1 (805) 212-8139";
const PHONE_HREF = "tel:+18052128139";

export default function CardPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center overflow-y-auto bg-background px-7 py-16 text-foreground lg:h-dvh lg:justify-center lg:overflow-hidden lg:px-6 lg:py-6">
      <div className="flex w-full max-w-md flex-col items-center gap-14 lg:max-w-2xl lg:gap-6">
        {/* Identity */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{SITE_NAME}</h1>
          <p className="text-sm text-muted">{SITE_TAGLINE}</p>
        </div>

        {/* Artistry video */}
        <div className="flex w-full flex-col gap-3">
          <p className="text-xs font-medium tracking-wide text-accent uppercase">Artistry</p>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {/* Ambient loop, no controls: purely visual, so no caption track
                needed. (The jsx-a11y disable that used to sit here was flagged
                as unused — that rule is not enabled in this config.) */}
            <video
              id="artistry-loop"
              // "#t=0" is a media fragment, not a URL hash the server ever
              // sees: it pins the start position so the browser cannot resume
              // a partially-played file from its media cache.
              src={`${encodeURI("/Artistry video.mp4")}#t=0`}
              // The file's true dimensions. Without them the element has no
              // height until metadata arrives, so the card collapsed and then
              // snapped open, shoving the CTA down the page — the visible jump
              // on load. Declaring them reserves the 16:9 box up front.
              width={1024}
              height={576}
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              // `block` kills the few px of inline-descender gap that would
              // otherwise show as a seam inside the rounded border.
              className="pointer-events-none block h-auto w-full"
            />
          </div>
          {/* Rewind on every entry to the page.
           *
           * `load`/`DOMContentLoaded` are no use for the case that actually
           * breaks: returning via the back button restores the page from the
           * back/forward cache, which re-runs no scripts and remounts nothing,
           * so the loop resumes wherever it was. `pageshow` is the one event
           * that fires for both a fresh load and a bfcache restore.
           *
           * Inline on purpose — it must run before paint, and this keeps the
           * page a server component with no hydration boundary. */}
          <script
            dangerouslySetInnerHTML={{
              __html:
                'addEventListener("pageshow",function(e){' +
                'var v=document.getElementById("artistry-loop");if(!v)return;' +
                // Only rewind when it actually resumed mid-loop. A cold load is
                // already at zero from autoplay + "#t=0", and seeking it again
                // would yank back the frames just painted. `persisted` marks a
                // bfcache restore; the currentTime check catches the browsers
                // (some iOS Safari builds) that restore without setting it.
                "if(!e.persisted&&v.currentTime<0.25)return;" +
                // Seeking before metadata exists throws InvalidStateError.
                "try{v.currentTime=0}catch(err){}" +
                "var p=v.play();if(p&&p.catch)p.catch(function(){});});",
            }}
          />
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
