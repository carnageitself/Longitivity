"use client";

import Link from "next/link";
import { addProductInquiry } from "@/lib/productInquiry";

export default function AskAboutProductButton({
  slug,
  name,
  category,
}: {
  slug: string;
  name: string;
  category: string;
}) {
  return (
    <Link
      href="/contact"
      onClick={() => addProductInquiry({ slug, name, category })}
      className="mt-12 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
    >
      Ask about this product
    </Link>
  );
}
