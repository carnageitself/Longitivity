import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-config";
import { SITE_URL, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

// Kept under ~160 characters: past that Google truncates the snippet mid-word
// and the tail of the sentence never reaches anyone.
const DESCRIPTION =
  "Nutrilite, Artistry, Satinique, Glister, XS and eSpring products, with honest side-by-side price comparisons against Amazon, Walmart and Costco.";

// Broad, brand + category + intent coverage. Individual pages layer on more
// specific keywords via their own metadata; this is the shared baseline.
const KEYWORDS = [
  "Nutrilite vitamins",
  "Nutrilite supplements",
  "Nutrilite Double X",
  "Artistry skincare",
  "Artistry cosmetics",
  "Satinique hair care",
  "Glister toothpaste",
  "G&H body wash",
  "XS energy drinks",
  "eSpring water filter",
  "eSpring water treatment system",
  "Atmosphere Sky air purifier",
  "iCook cookware",
  "wellness products online",
  "home care essentials",
  "premium skincare and supplements",
  "buy Nutrilite online",
  "buy Artistry online",
  "home business opportunity",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Lead with what people search for, not the brand name: nobody is typing
  // "Longitivity" yet. Child pages set a bare title and the template appends
  // the brand once - they must NOT append it themselves.
  title: {
    default: `Nutrilite, Artistry & Wellness Essentials | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: "shopping",
  // No canonical here on purpose. A layout-level canonical is inherited by any
  // route that forgets to set its own, silently pointing it at the homepage and
  // dropping it from the index. Each page declares its own; the homepage's
  // lives in app/page.tsx.
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Without these Google caps image previews to a thumbnail and clips the
      // snippet. Product photography is the reason to click a listing like
      // this one, so let it use the full-size preview.
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Stops iOS Safari turning prices and sizes ("12 fl oz", "$37.00") into
  // tel: links, which mangles the rendered text crawlers read.
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Site-wide identity graph. Emitted once here so every route inherits
            a publisher, rather than each page restating who runs the site. */}
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
        {children}
      </body>
    </html>
  );
}
