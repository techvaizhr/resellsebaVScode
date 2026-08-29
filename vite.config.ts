// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    // Cloudflare Workers: the SSR bundle imports node: built-ins (crypto, stream, buffer),
    // so the worker must be deployed with the nodejs_compat flag.
    cloudflare: { nodeCompat: true },
  },
  vite: {
    plugins: [
      VitePWA({
        // Registration happens only from src/lib/pwa-register.ts (guarded).
        injectRegister: null,
        registerType: "autoUpdate",
        filename: "sw.js",
        // nitro serves dist/client as the public dir — the SW must live there.
        outDir: "dist/client",
        // Manifest is served dynamically at /api/public/manifest (site name + favicon from admin settings).
        manifest: false,
        devOptions: { enabled: false },
        workbox: {
          // SPA-style offline fallback is unsafe for SSR + OAuth; runtime caching only.
          navigateFallback: null,
          runtimeCaching: [
            {
              // Navigations: network first, never for API or OAuth callbacks.
              urlPattern: ({ request, url }) =>
                request.mode === "navigate" &&
                !url.pathname.startsWith("/api") &&
                !url.pathname.startsWith("/~oauth"),
              handler: "NetworkFirst",
              options: {
                cacheName: "pwa-pages",
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
            {
              // Same-origin hashed build assets: cache first.
              urlPattern: ({ url }) =>
                url.origin === self.location.origin &&
                /\/assets\/.+\.(js|css|woff2?|png|jpg|svg|webp)$/i.test(url.pathname),
              handler: "CacheFirst",
              options: {
                cacheName: "pwa-assets",
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
      }),
    ],
  },
});
