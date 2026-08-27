import { createFileRoute } from "@tanstack/react-router";

/**
 * Dynamic PWA manifest — uses the favicon set from Admin → Settings as the
 * app icon, and the site name as the app name. Falls back to the bundled
 * icons when no favicon has been uploaded yet.
 */
export const Route = createFileRoute("/api/public/manifest")({
  server: {
    handlers: {
      GET: async () => {
        let siteName = "Reseller Platform";
        let faviconUrl: string | null = null;
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data } = await supabaseAdmin
            .from("global_settings")
            .select("site_name, favicon_url")
            .eq("id", 1)
            .maybeSingle();
          if (data?.site_name) siteName = data.site_name;
          faviconUrl = data?.favicon_url ?? null;
        } catch {
          // fall through to defaults
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
          theme_color: "#ffffff",
          icons,
        };

        return new Response(JSON.stringify(manifest), {
          headers: {
            "content-type": "application/manifest+json",
            // short cache so a new favicon is picked up quickly
            "cache-control": "public, max-age=300",
          },
        });
      },
    },
  },
});
