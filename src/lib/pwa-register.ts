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
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  if (isRefusedContext()) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(SW_PATH, { scope: "/" })
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (installing) {
            installing.addEventListener("statechange", () => {
              if (installing.state === "installed" && navigator.serviceWorker.controller) {
                console.log("New PWA content available; please refresh.");
              }
            });
          }
        });
      })
      .catch((err) => {
        console.warn("PWA Service Worker registration failed:", err);
      });
  });
}
