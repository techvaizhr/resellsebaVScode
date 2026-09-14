import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tanstack/react-start/server": path.resolve(
        __dirname,
        "./src/lib/server-fn-shim.ts"
      ),
      "@tanstack/react-start": path.resolve(
        __dirname,
        "./src/lib/server-fn-shim.ts"
      ),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    target: "es2022",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/xlsx")) {
            return "vendor-excel";
          }
          if (
            id.includes("node_modules/@zxing") ||
            id.includes("node_modules/jsbarcode")
          ) {
            return "vendor-barcode";
          }
          if (id.includes("node_modules/recharts")) {
            return "vendor-charts";
          }
          if (id.includes("node_modules/@tiptap")) {
            return "vendor-editor";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }
          if (
            id.includes("node_modules/@radix-ui") ||
            id.includes("node_modules/cmdk") ||
            id.includes("node_modules/vaul")
          ) {
            return "vendor-ui";
          }
        },
      },
    },
  },
  plugins: [
    tanstackRouter({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      quoteStyle: "double",
    }),
    viteReact(),
    tailwindcss(),
    VitePWA({
      injectRegister: null,
      registerType: "autoUpdate",
      filename: "sw.js",
      outDir: "dist",
      manifest: false,
      devOptions: { enabled: false },
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        navigateFallback: "/index.html",
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
              /\/assets\/.+\.(js|css|woff2?|png|jpg|svg|webp)$/i.test(
                url.pathname
              ),
            handler: "CacheFirst",
            options: {
              cacheName: "pwa-assets",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
});
