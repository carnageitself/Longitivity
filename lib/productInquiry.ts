// Lets a shopper click "Ask about this product" on several product pages
// and have them all show up together on the /contact form, since Next.js
// doesn't preserve component state across a full navigation. Exposed as a
// useSyncExternalStore-compatible store so LeadForm can read it reactively
// without a manual effect + setState (and without a hydration mismatch,
// since the server snapshot is always the empty list).
const STORAGE_KEY = "productInquiries";

export type ProductInquiry = {
  slug: string;
  name: string;
  category: string;
};

const EMPTY: ProductInquiry[] = [];
const listeners = new Set<() => void>();

let cacheRaw: string | null | undefined;
let cache: ProductInquiry[] = EMPTY;

function readSnapshot(): ProductInquiry[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(items: ProductInquiry[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((listener) => listener());
}

export function subscribeProductInquiries(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

export function getProductInquiriesSnapshot(): ProductInquiry[] {
  return readSnapshot();
}

export function getProductInquiriesServerSnapshot(): ProductInquiry[] {
  return EMPTY;
}

export function addProductInquiry(item: ProductInquiry) {
  const items = readSnapshot();
  if (items.some((p) => p.slug === item.slug)) return;
  write([...items, item]);
}

export function removeProductInquiry(slug: string) {
  write(readSnapshot().filter((p) => p.slug !== slug));
}

export function clearProductInquiries() {
  write(EMPTY);
}
