import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PartnersGrid from "@/components/PartnersGrid";
import { SITE_NAME } from "@/lib/site-config";

const DESCRIPTION =
  "The nine brands behind every product here: Nutrilite, Artistry, Satinique, XS, eSpring, G&H, Glister, iCook and Atmosphere — and what each one makes.";

export const metadata: Metadata = {
  title: "Our Brands: Nutrilite, Artistry & eSpring",
  description: DESCRIPTION,
  keywords: [
    "Nutrilite brand",
    "Artistry brand",
    "Satinique brand",
    "Glister brand",
    "XS energy brand",
    "eSpring brand",
    "G&H brand",
    "iCook cookware",
    "Atmosphere air treatment brand",
  ],
  alternates: { canonical: "/partners" },
  openGraph: {
    url: "/partners",
    title: `Brand Partners | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
  twitter: {
    title: `Brand Partners | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default function PartnersPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border px-6 pt-20 pb-14">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-xs font-medium tracking-wide text-accent uppercase">
              Who&apos;s behind the products
            </p>
            <h1 className="max-w-2xl font-serif text-4xl font-medium tracking-tight sm:text-5xl">
              Nine brands. One roof.
            </h1>
            <p className="mt-5 max-w-xl text-muted">
              Every product sold here comes from one of these established
              brands. Same formulas, same manufacturing, same quality bar,
              just with a person behind the sale instead of an algorithm.
            </p>
          </div>
        </section>

        <PartnersGrid />
      </main>
      <Footer />
    </>
  );
}
