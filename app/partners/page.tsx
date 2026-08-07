import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PartnersGrid from "@/components/PartnersGrid";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Brand Partners | ${SITE_NAME}`,
  description:
    "The brands behind every product: Nutrilite, Artistry, Satinique, XS, eSpring, and SA8/L.O.C.",
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
              Six brands. One roof.
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
