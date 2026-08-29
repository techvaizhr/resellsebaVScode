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

        // 1) Preferred: service-role client (Lovable Cloud / full self-host).
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
          // 2) Fallback: public REST read (self-hosted builds without the
          // service-role key — global_settings allows anon SELECT).
          try {
            const base = import.meta.env.VITE_SUPABASE_URL as string;
            const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
            const res = await fetch(
              `${base}/rest/v1/global_settings?id=eq.1&select=site_name,favicon_url`,
              { headers: { apikey: key, accept: "application/json" } },
            );
            const rows = (await res.json()) as { site_name?: string; favicon_url?: string }[];
            const row = rows?.[0];
            if (row?.site_name) siteName = row.site_name;
            faviconUrl = row?.favicon_url ?? null;
          } catch {
            // fall through to defaults
          }
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
