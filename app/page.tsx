import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ScrollShowcase from "@/components/ScrollShowcase";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import FeaturedProducts from "@/components/FeaturedProducts";
import { promoMarks } from "@/lib/promotions";
import ArtistrySpotlight from "@/components/ArtistrySpotlight";
import ArtistryNYFWCta from "@/components/ArtistryNYFWCta";
import ProductCategories from "@/components/ProductCategories";
import WhyIndependent from "@/components/WhyIndependent";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

// The Organization/WebSite graph this page used to declare now lives in the
// root layout, so every route carries it instead of just the homepage.
// These pages carry the "15% off" tags and discounted prices, which are worked
// out from today's date at render time. Without a revalidate they are built
// once and served unchanged, so an offer that ended on the 30th would keep
// advertising itself - to shoppers and to Googlebot - until the next deploy.
// Hourly matches /promotions, so every surface turns over together.
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustBar />

        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-2 px-6 py-16 text-center text-2xl font-semibold tracking-tight sm:text-4xl">
          <span>The best way to shop smarter is to</span>
          <PointerHighlight>
            <span>compare</span>
          </PointerHighlight>
        </div>

        <ScrollShowcase />
        <FeaturedProducts promoMarks={promoMarks()} />
        <ArtistrySpotlight />
        <ProductCategories />
        <ArtistryNYFWCta />
        <WhyIndependent />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
