// Self-destroying service worker: cleans up all Workbox/PWA caches and unregisters itself immediately.
self.addEventListener('install', function (e) {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (k) {
          return caches.delete(k);
        })
      );
    }).then(function () {
      return self.registration.unregister();
    }).then(function () {
      return self.clients.matchAll({ type: 'window' });
    }).then(function (clients) {
      clients.forEach(function (client) {
        if (client && client.navigate) {
          client.navigate(client.url);
        }
      });
    })
  );
});

self.addEventListener('fetch', function (e) {
  // Let network handle everything directly
  return;
});
