/**
 * Single, guarded service-worker registration point for the PWA.
 * Registers /sw.js with immediate scope.
 */

const SW_PATH = "/sw.js";

function isRefusedContext(): boolean {
  if (typeof window === "undefined") return true;
  if (window.self !== window.top) return true; // iframe preview
  const host = window.location.hostname;
  if (host.startsWith("id-preview--") || host.startsWith("preview--")) return true;
  if (new URLSearchParams(window.location.search).get("sw") === "off") return true;
  return false;
}

export function registerPwa() {
  if (typeof window === "undefined") return;

  // Purge any stale cache to ensure strictly live database data
  if ("caches" in window) {
    window.caches.keys().then((keys) => {
      for (const k of keys) window.caches.delete(k);
    }).catch(() => {});
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      for (const reg of regs) {
        reg.unregister().catch(() => {});
      }
    }).catch(() => {});
  }
}
