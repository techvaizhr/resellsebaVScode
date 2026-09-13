import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/laravel/client";

/**
 * Dynamic PWA manifest — uses the favicon set from Admin → Settings as the
 * app icon, and the site name as the app name. Falls back to the bundled
 * icons when no favicon has been uploaded yet.
 */
export const Route = createFileRoute("/api/public/manifest")({
  server: {
    handlers: {
      GET: async () => {
        let siteName = "ResellSeba";
        let faviconUrl: string | null = null;
        let primaryColor = "#4f46e5";

        try {
          const { data } = await supabase
            .from("global_settings")
            .select("site_name, favicon_url, primary_color")
            .eq("id", 1)
            .maybeSingle();

          if (data?.site_name) siteName = data.site_name;
          if (data?.favicon_url) faviconUrl = data.favicon_url;
          if (data?.primary_color) primaryColor = data.primary_color;
        } catch {
          // fallback defaults
        }

        const icons = faviconUrl
          ? [
              { src: faviconUrl, sizes: "192x192", type: "image/png", purpose: "any" },
              { src: faviconUrl, sizes: "512x512", type: "image/png", purpose: "any" },
              { src: faviconUrl, sizes: "512x512", type: "image/png", purpose: "maskable" },
            ]
          : [
              { src: "/pwa-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
              { src: "/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
              { src: "/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
            ];

        const manifest = {
          name: siteName,
          short_name: siteName.length > 12 ? siteName.slice(0, 12) : siteName,
          start_url: "/dashboard",
          scope: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: primaryColor || "#4f46e5",
          icons,
        };

        return new Response(JSON.stringify(manifest), {
          headers: {
            "content-type": "application/manifest+json",
            "cache-control": "public, max-age=300",
          },
        });
      },
    },
  },
});
