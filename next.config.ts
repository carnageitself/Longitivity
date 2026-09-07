import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  async headers() {
    return [
      {
        // /card is handed out as a QR code, and its Artistry loop is meant to
        // begin at 0:00 every time someone opens it.
        //
        // The obstacle is the back/forward cache. Tap the CTA through to the
        // site, press back, and the browser restores the page from memory
        // rather than reloading it — the <video> comes back exactly where it
        // was, mid-loop, and autoplay never re-fires because nothing remounted.
        //
        // `no-store` is the documented way to opt a page out of bfcache in
        // Chrome and Firefox, so back navigation performs a real load and the
        // video starts over. Cheap here: the page is a single screen, and its
        // contact details should be fresh anyway.
        source: "/card",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
