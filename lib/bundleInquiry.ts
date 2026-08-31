// Lets a shopper click "Get this bundle" on /for-you and have that bundle's
// name show up on the /contact form, since Next.js doesn't preserve
// component state across a full navigation. Same useSyncExternalStore
// pattern as lib/productInquiry.ts, just a single string instead of a list.
const STORAGE_KEY = "bundleInquiry";

const listeners = new Set<() => void>();

let cacheRaw: string | null | undefined;
let cache: string | null = null;

function readSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  cache = raw;
  return cache;
}

function write(value: string | null) {
  if (value) {
    window.localStorage.setItem(STORAGE_KEY, value);
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  listeners.forEach((listener) => listener());
}

export function subscribeBundleInquiry(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

export function getBundleInquirySnapshot(): string | null {
  return readSnapshot();
}

export function getBundleInquiryServerSnapshot(): string | null {
  return null;
}

export function setBundleInquiry(title: string) {
  write(title);
}

export function clearBundleInquiry() {
  write(null);
}
