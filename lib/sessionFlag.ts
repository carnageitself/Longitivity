"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * A one-way "already handled this" flag that lasts for the browser session.
 *
 * Exists because the components that need it - the offer bar and the student
 * offer dialog - are rendered by Navbar, which every page renders for itself.
 * Navigating therefore remounts them, and plain component state would forget
 * that someone had closed something the moment they opened another page.
 *
 * Read through useSyncExternalStore rather than by setting state inside an
 * effect. It is the API meant for reading a value that lives outside React,
 * and it takes a separate server snapshot, so the flag reads as unset during
 * server rendering and hydration and is only re-read once on the client. Doing
 * it with an effect instead triggers a cascading render, which is what the
 * project's lint rules object to.
 *
 * sessionStorage, not localStorage: an offer worth showing once per visit is
 * not worth suppressing forever.
 */

// sessionStorage fires no event for writes made by this same tab, so the
// subscribers are notified by hand.
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function read(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    // Safari in private mode can throw on access. Treating that as "not set"
    // means the thing shows, which is the harmless direction to fail in.
    return false;
  }
}

/** Always false: the server has no session, so markup renders as if unset. */
function readServer(): boolean {
  return false;
}

export function useSessionFlag(key: string): [boolean, () => void] {
  const getSnapshot = useCallback(() => read(key), [key]);
  const isSet = useSyncExternalStore(subscribe, getSnapshot, readServer);

  const set = useCallback(() => {
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      // Losing the flag only means the thing may reappear later this visit,
      // which is not worth throwing over.
    }
    listeners.forEach((listener) => listener());
  }, [key]);

  return [isSet, set];
}
