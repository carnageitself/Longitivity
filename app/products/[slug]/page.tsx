import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import { catalog } from "@/lib/catalog";
import { fullCompare } from "@/lib/fullCompare";
import { SITE_NAME } from "@/lib/site-config";

export function generateStaticParams() {
  return catalog.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = catalog.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: `${product.name} | ${SITE_NAME}`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = catalog.find((p) => p.slug === slug);
  if (!product) notFound();

  const competitors = fullCompare.find((c) => c.slug === slug)?.competitors ?? [];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ProductDetail product={product} competitors={competitors} />
      </main>
      <Footer />
    </>
  );
}
