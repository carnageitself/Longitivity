import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { promoMarks } from "@/lib/promotions";
import JsonLd from "@/components/JsonLd";
import { CATEGORY_VISUAL } from "@/lib/catalog";
import {
  CATEGORY_SEO,
  CATEGORY_SEO_BY_SLUG,
  productsIn,
  categoryPath,
} from "@/lib/categories";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd, ORGANIZATION_ID } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export function generateStaticParams() {
  return CATEGORY_SEO.map((entry) => ({ category: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const entry = CATEGORY_SEO_BY_SLUG.get(category);
  if (!entry) return {};

  const path = `/collections/${entry.slug}`;

  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `${entry.title} | ${SITE_NAME}`,
      description: entry.description,
    },
    twitter: {
      title: `${entry.title} | ${SITE_NAME}`,
      description: entry.description,
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const entry = CATEGORY_SEO_BY_SLUG.get(category);
  if (!entry) notFound();

  const products = productsIn(entry.category);
  const path = `/collections/${entry.slug}`;

  // The catalog browser only cards products that have real photography. Keep
  // that visual rule here, but still link the rest in text so every product
  // page has an internal link pointing at it from its own category.
  const withPhoto = products.filter((p) => p.image ?? CATEGORY_VISUAL[p.category].image);
  const marks = promoMarks();
  const withoutPhoto = products.filter((p) => !(p.image ?? CATEGORY_VISUAL[p.category].image));

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl(path),
    url: absoluteUrl(path),
    name: `${entry.title} | ${SITE_NAME}`,
    description: entry.description,
    isPartOf: { "@id": absoluteUrl("/#website") },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/products/${product.slug}`),
        name: product.name,
      })),
    },
  };

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: entry.h1, path },
  ]);

  const others = CATEGORY_SEO.filter((c) => c.slug !== entry.slug);

  return (
    <>
      <JsonLd data={[collectionJsonLd, breadcrumbs, faqJsonLd(entry.faqs)]} />
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border px-6 pt-20 pb-14">
          <div className="mx-auto max-w-7xl">
            {/* Visible breadcrumb: matches the BreadcrumbList payload, which is
                what Google wants before it will render breadcrumbs in a SERP. */}
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="transition-colors hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/products" className="transition-colors hover:text-foreground">
                    Products
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-foreground">{entry.h1}</li>
              </ol>
            </nav>

            <p className="mb-3 text-xs font-medium tracking-wide text-accent uppercase">
              {products.length} products
            </p>
            <h1 className="max-w-2xl font-serif text-4xl font-medium tracking-tight sm:text-5xl">
              {entry.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-muted">{entry.intro}</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {withPhoto.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                promo={marks[product.slug]}
              />
            ))}
          </div>

          {withoutPhoto.length > 0 && (
            <div className="mt-12 border-t border-border pt-8">
              <h2 className="text-sm font-medium tracking-widest text-muted uppercase">
                Also in this range
              </h2>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {withoutPhoto.map((product) => (
                  <li key={product.slug}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-sm text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      {product.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="border-t border-border px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-3xl font-medium tracking-tight">
              Common questions
            </h2>
            <dl className="mt-8 flex flex-col gap-8">
              {entry.faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-medium">{faq.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t border-border px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-sm font-medium tracking-widest text-muted uppercase">
              Browse other ranges
            </h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={categoryPath(other.category)}
                    className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
                  >
                    {other.category}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/products"
                  className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
                >
                  All products
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
