// ResellSeba PWA Service Worker
// Enables PWA installation on Mobile & Desktop without caching any API or dynamic data.
// 100% network-first / live database communication.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => caches.delete(k)));
    }).then(() => self.clients.claim())
  );
});

// Pass-through fetch handler — satisfies PWA installability requirements
// while allowing every request to go directly to network and MySQL database.
self.addEventListener('fetch', (event) => {
  return;
});
