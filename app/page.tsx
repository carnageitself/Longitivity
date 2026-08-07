import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ScrollShowcase from "@/components/ScrollShowcase";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import FeaturedProducts from "@/components/FeaturedProducts";
import ArtistrySpotlight from "@/components/ArtistrySpotlight";
import ProductCategories from "@/components/ProductCategories";
import WhyIndependent from "@/components/WhyIndependent";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_TAGLINE, CONTACT } from "@/lib/site-config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://longitivity.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  description: SITE_TAGLINE,
  url: SITE_URL,
  email: CONTACT.email,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
        <FeaturedProducts />
        <ArtistrySpotlight />
        <ProductCategories />
        <WhyIndependent />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
