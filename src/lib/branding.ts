import { useEffect } from "react";

function hexToRgb(hex: string) {
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
  }
  const num = parseInt(clean, 16);
  if (isNaN(num) || clean.length !== 6) {
    return { r: 79, g: 70, b: 229 }; // default royal indigo
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? "#0f172a" : "#ffffff";
}

/**
 * Directly applies CSS theme variables to the document root immediately.
 */
export function applyBrandingThemeDirectly(
  color?: string | null,
  accent?: string | null,
  options?: { radius?: string | null }
) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (color && color.trim()) {
    const c = color.trim();
    const fg = getContrastColor(c);
    const { r, g, b } = hexToRgb(c);

    root.style.setProperty("--primary", c);
    root.style.setProperty("--ring", c);
    root.style.setProperty("--primary-foreground", fg);
    root.style.setProperty("--primary-soft", `rgba(${r}, ${g}, ${b}, 0.12)`);
    root.style.setProperty("--sidebar-accent", `rgba(${r}, ${g}, ${b}, 0.14)`);
    root.style.setProperty("--sidebar-accent-foreground", c);
    root.style.setProperty("--sidebar-ring", c);
    root.style.setProperty(
      "--gradient-brand",
      accent && accent.trim()
        ? `linear-gradient(135deg, ${c} 0%, ${accent.trim()} 100%)`
        : `linear-gradient(135deg, ${c} 0%, rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)}, 1) 100%)`
    );
    root.style.setProperty(
      "--shadow-elegant",
      `0 12px 30px -8px rgba(${r}, ${g}, ${b}, 0.35)`
    );
    root.style.setProperty(
      "--shadow-glow",
      `0 0 24px -2px rgba(${r}, ${g}, ${b}, 0.45)`
    );
  }

  if (accent && accent.trim()) {
    const a = accent.trim();
    const afg = getContrastColor(a);
    root.style.setProperty("--accent", a);
    root.style.setProperty("--accent-foreground", afg);
  }

  if (options?.radius) {
    root.style.setProperty("--radius", options.radius);
  }
}

/**
 * Applies branding colors (primary + optional accent + optional radius) as CSS variables globally.
 */
export function useBrandingTheme(
  color: string | null | undefined,
  accent?: string | null | undefined,
  options?: { radius?: string | null }
) {
  useEffect(() => {
    if (!color && !accent && !options?.radius) return;
    applyBrandingThemeDirectly(color, accent, options);
  }, [color, accent, options?.radius]);
}
