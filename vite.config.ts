import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: true,
  },
  build: {
    target: "es2022",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/recharts")) {
            return "vendor-charts";
          }
          if (id.includes("node_modules/@tiptap")) {
            return "vendor-editor";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }
          if (id.includes("node_modules/@radix-ui")) {
            return "vendor-ui";
          }
        },
      },
    },
  },
  plugins: [
    tanstackStart(),
    viteReact(),
    tailwindcss(),
    VitePWA({
      injectRegister: null,
      registerType: "autoUpdate",
      filename: "sw.js",
      outDir: "dist/client",
      manifest: false,
      devOptions: { enabled: false },
      workbox: {
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) =>
              request.mode === "navigate" &&
              !url.pathname.startsWith("/api"),
            handler: "NetworkFirst",
            options: {
              cacheName: "pwa-pages",
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
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
});
