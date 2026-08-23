import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-config";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://longitivity.vercel.app";
const DESCRIPTION =
  "Nutrilite, Artistry, Satinique, Glister, XS, eSpring, and home care products, delivered with personal service and honest, side-by-side price comparisons against Amazon, Walmart, and Costco.";

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
  "SA8 laundry detergent",
  "L.O.C. multi-purpose cleaner",
  "wellness products online",
  "home care essentials",
  "premium skincare and supplements",
  "buy Nutrilite online",
  "buy Artistry online",
  "home business opportunity",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: "shopping",
  alternates: {
    canonical: "/",
  },
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
    },
  },
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
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
