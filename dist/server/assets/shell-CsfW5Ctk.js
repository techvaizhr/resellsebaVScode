import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-B8ZbbxaQ.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { jn as Copy } from "./vendor-icons-DF2A5Z8S.js";
import { n as useAuth } from "./use-auth-CSAYNNFO.js";
import { n as PwaInstallButton } from "./pwa-install-crXdrYEy.js";
//#region src/components/catalog/shell.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)({
	siteName: "Catalog",
	logoUrl: null,
	banner: null,
	tagline: "",
	landingContent: null
});
var useCatalogBrand = () => (0, import_react.useContext)(Ctx);
var CatalogBrandProvider = Ctx.Provider;
function useLoadCatalogBrand() {
	const [brand, setBrand] = (0, import_react.useState)({
		siteName: "Catalog",
		logoUrl: null,
		banner: null,
		tagline: "",
		landingContent: null
	});
	(0, import_react.useEffect)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-16 border-t border-border/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" ",
				siteName,
				" ",
				tagline ? `· ${tagline}` : ""
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:text-primary",
						children: "Home"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/catalog",
						search: {},
						className: "hover:text-primary",
						children: "Catalog"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/privacy",
						className: "font-semibold text-primary hover:text-primary/80",
						children: "Privacy Policy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaInstallButton, {
						variant: "inline",
						label: "অ্যাপ ইনস্টল করুন"
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		title,
		onClick: (e) => {
			e.preventDefault();
			e.stopPropagation();
			copyText(text, label ?? "Copied");
		},
		className: "inline-flex items-center gap-1 rounded-lg border bg-card/90 px-2 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur hover:border-primary/50 hover:text-primary",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }),
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
