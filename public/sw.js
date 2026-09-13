// ResellSeba Service Worker - Strictly Live & No Stale Cache
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

// Always fetch from network directly; NEVER serve cached offline fallbacks.
self.addEventListener("fetch", (event) => {
  return;
});
