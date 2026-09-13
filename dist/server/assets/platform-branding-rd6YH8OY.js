import { useEffect, useState } from "react";
//#region src/lib/branding.ts
function hexToRgb(hex) {
	let clean = hex.replace("#", "").trim();
	if (clean.length === 3) clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
	const num = parseInt(clean, 16);
	if (isNaN(num) || clean.length !== 6) return {
		r: 79,
		g: 70,
		b: 229
	};
	return {
		r: num >> 16 & 255,
		g: num >> 8 & 255,
		b: num & 255
	};
}
function getContrastColor(hex) {
	const { r, g, b } = hexToRgb(hex);
	return (r * 299 + g * 587 + b * 114) / 1e3 >= 150 ? "#0f172a" : "#ffffff";
}
/**
* Directly applies CSS theme variables to the document root immediately.
*/
function applyBrandingThemeDirectly(color, accent, options) {
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
		root.style.setProperty("--gradient-brand", accent && accent.trim() ? `linear-gradient(135deg, ${c} 0%, ${accent.trim()} 100%)` : `linear-gradient(135deg, ${c} 0%, rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)}, 1) 100%)`);
		root.style.setProperty("--shadow-elegant", `0 12px 30px -8px rgba(${r}, ${g}, ${b}, 0.35)`);
		root.style.setProperty("--shadow-glow", `0 0 24px -2px rgba(${r}, ${g}, ${b}, 0.45)`);
	}
	if (accent && accent.trim()) {
		const a = accent.trim();
		const afg = getContrastColor(a);
		root.style.setProperty("--accent", a);
		root.style.setProperty("--accent-foreground", afg);
	}
	if (options?.radius) root.style.setProperty("--radius", options.radius);
}
/**
* Applies branding colors (primary + optional accent + optional radius) as CSS variables globally.
*/
function useBrandingTheme(color, accent, options) {
	useEffect(() => {
		if (!color && !accent && !options?.radius) return;
		applyBrandingThemeDirectly(color, accent, options);
	}, [
		color,
		accent,
		options?.radius
	]);
}
//#endregion
//#region src/lib/platform-branding.ts
/**
* Platform branding (favicon, apple-touch-icon + primary/accent colors).
*
* Updates tab favicon, mobile apple-touch-icon, and theme variables globally.
*/
var current = {
	primary: null,
	accent: null,
	radius: null,
	favicon: null,
	siteName: null
};
var subs = /* @__PURE__ */ new Set();
function applyPlatformBranding(settings) {
	if (!settings) return;
	if (typeof document !== "undefined" && settings.favicon_url) {
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
	const next = {
		primary: settings.primary_color ?? null,
		accent: settings.accent_color ?? null,
		radius: settings?.border_radius ?? null,
		favicon: settings.favicon_url ?? null,
		siteName: settings.site_name ?? null
	};
	applyBrandingThemeDirectly(next.primary, next.accent, { radius: next.radius });
	current = next;
	subs.forEach((fn) => fn(current));
}
/** Subscribe to the branding pushed by the current page's bootstrap call. */
function usePlatformBranding() {
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
//#endregion
export { useBrandingTheme as i, usePlatformBranding as n, applyBrandingThemeDirectly as r, applyPlatformBranding as t };
