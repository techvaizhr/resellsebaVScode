/**
 * Platform branding (favicon, apple-touch-icon + primary/accent colors).
 *
 * Updates tab favicon, mobile apple-touch-icon, and theme variables globally.
 */
import { useEffect, useState } from "react";

import { applyBrandingThemeDirectly } from "@/lib/branding";

export type PlatformBrand = {
  primary: string | null;
  accent: string | null;
  radius?: string | null;
  favicon?: string | null;
  siteName?: string | null;
};

let current: PlatformBrand = { primary: null, accent: null, radius: null, favicon: null, siteName: null };
const subs = new Set<(b: PlatformBrand) => void>();

export function applyPlatformBranding(
  settings:
    | {
        favicon_url?: string | null;
        primary_color?: string | null;
        accent_color?: string | null;
        border_radius?: string | null;
        site_name?: string | null;
      }
    | null
    | undefined,
) {
  if (!settings) return;
  if (typeof document !== "undefined" && settings.favicon_url) {
    // Update both favicon and apple-touch-icon for PWA installation
    document.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());
    document.querySelectorAll("link[rel='apple-touch-icon']").forEach((el) => el.remove());

    const iconLink = document.createElement("link");
    iconLink.rel = "icon";
    iconLink.href = settings.favicon_url;
    document.head.appendChild(iconLink);

    const appleLink = document.createElement("link");
    appleLink.rel = "apple-touch-icon";
    appleLink.href = settings.favicon_url;
    document.head.appendChild(appleLink);
  }

  const next: PlatformBrand = {
    primary: settings.primary_color ?? null,
    accent: settings.accent_color ?? null,
    radius: (settings as any)?.border_radius ?? null,
    favicon: settings.favicon_url ?? null,
    siteName: settings.site_name ?? null,
  };

  applyBrandingThemeDirectly(next.primary, next.accent, { radius: next.radius });

  current = next;
  subs.forEach((fn) => fn(current));
}

/** Subscribe to the branding pushed by the current page's bootstrap call. */
export function usePlatformBranding(): PlatformBrand {
  const [brand, setBrand] = useState(current);
  useEffect(() => {
    setBrand(current);
    subs.add(setBrand);
    return () => {
      subs.delete(setBrand);
    };
  }, []);
  return brand;
}
