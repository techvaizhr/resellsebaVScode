/**
 * Single, guarded service-worker registration point for the PWA.
 *
 * Registers /sw.js only on the real published site. In dev, Lovable preview,
 * iframes, or with ?sw=off, it unregisters any stale app SW instead.
 */

const SW_PATH = "/sw.js";

function isRefusedContext(): boolean {
  if (typeof window === "undefined") return true;
  if (!import.meta.env.PROD) return true;
  if (window.self !== window.top) return true; // iframe preview
  const host = window.location.hostname;
  if (host.startsWith("id-preview--") || host.startsWith("preview--")) return true;
  if (host === "lovableproject.com" || host.endsWith(".lovableproject.com")) return true;
  if (host === "lovableproject-dev.com" || host.endsWith(".lovableproject-dev.com")) return true;
  if (host === "beta.lovable.dev" || host.endsWith(".beta.lovable.dev")) return true;
  if (new URLSearchParams(window.location.search).get("sw") === "off") return true;
  return false;
}

async function unregisterAppSw() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      regs
        .filter((r) => r.active?.scriptURL.endsWith(SW_PATH) || r.installing?.scriptURL.endsWith(SW_PATH) || r.waiting?.scriptURL.endsWith(SW_PATH))
        .map((r) => r.unregister()),
    );
  } catch {
    // ignore
  }
}

export function registerPwa() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  if (isRefusedContext()) {
    void unregisterAppSw();
    return;
  }

  // Load the plugin's registrar only in allowed (production) contexts.
  void import("virtual:pwa-register")
    .then(({ registerSW }) => registerSW({ immediate: true }))
    .catch(() => {
      // plugin virtual module unavailable (e.g. unexpected context) — stay silent
    });
}
