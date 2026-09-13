import { r as supabase } from "./client-BpJCBCUq.js";
import { n as useAuth } from "./use-auth-BPiZPMVq.js";
import { createContext, useContext, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Copy } from "lucide-react";
//#region src/components/catalog/shell.tsx
var Ctx = createContext({
	siteName: "Catalog",
	logoUrl: null,
	banner: null,
	tagline: "",
	landingContent: null
});
var useCatalogBrand = () => useContext(Ctx);
var CatalogBrandProvider = Ctx.Provider;
function useLoadCatalogBrand() {
	const [brand, setBrand] = useState({
		siteName: "Catalog",
		logoUrl: null,
		banner: null,
		tagline: "",
		landingContent: null
	});
	useEffect(() => {
		(async () => {
			const { data } = await supabase.from("global_settings").select("site_name, logo_url, landing_content").eq("id", 1).maybeSingle();
			if (!data) return;
			const lc = data.landing_content ?? {};
			setBrand({
				siteName: data.site_name ?? "Catalog",
				logoUrl: data.logo_url ?? null,
				banner: lc?.hero?.bannerImage?.url ?? null,
				tagline: lc?.footer?.tagline ?? "",
				landingContent: lc ?? null
			});
		})();
	}, []);
	return brand;
}
function CatalogFooter() {
	const { siteName, tagline } = useCatalogBrand();
	return /* @__PURE__ */ jsx("footer", {
		className: "mt-16 border-t border-border/60",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:px-6",
			children: [/* @__PURE__ */ jsxs("span", { children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" ",
				siteName,
				" ",
				tagline ? `· ${tagline}` : ""
			] }), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-4",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "hover:text-primary",
						children: "Home"
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/catalog",
						search: {},
						className: "hover:text-primary",
						children: "Catalog"
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/privacy",
						className: "font-semibold text-primary hover:text-primary/80",
						children: "Privacy Policy"
					})
				]
			})]
		})
	});
}
function copyText(text, label = "Copied") {
	navigator.clipboard.writeText(text).then(() => toast.success(label), () => toast.error("Copy failed"));
}
function CopyBtn({ text, label, title }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		title,
		onClick: (e) => {
			e.preventDefault();
			e.stopPropagation();
			copyText(text, label ?? "Copied");
		},
		className: "inline-flex items-center gap-1 rounded-lg border bg-card/90 px-2 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur hover:border-primary/50 hover:text-primary",
		children: [
			/* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" }),
			" ",
			title
		]
	});
}
/**
* Master catalog price visibility.
* Visible to admin/staff/reseller/leader — not visible to guests or suppliers.
*/
function useCatalogPrices() {
	const { roles, loading } = useAuth();
	if (loading) return false;
	return roles.some((r) => r === "super_admin" || r === "staff" || r === "reseller" || r === "leader");
}
//#endregion
export { useCatalogPrices as a, useCatalogBrand as i, CatalogFooter as n, useLoadCatalogBrand as o, CopyBtn as r, CatalogBrandProvider as t };
