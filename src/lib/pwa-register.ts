/**
 * Guarded service-worker registration point for the PWA.
 * Registers /sw.js with root scope to enable 1-click install while preserving 100% live database synchronization.
 */

const SW_PATH = "/sw.js";

export function registerPwa() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  // Don't register inside iframes or preview modes
  if (window.self !== window.top) return;
  const host = window.location.hostname;
  if (host.startsWith("id-preview--") || host.startsWith("preview--")) return;
  if (new URLSearchParams(window.location.search).get("sw") === "off") return;

  const register = () => {
    navigator.serviceWorker
      .register(SW_PATH, { scope: "/" })
      .catch((err) => {
        console.warn("PWA SW registration notice:", err);
      });
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register);
  }
}
