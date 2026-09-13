import { n as CatalogFooter, o as useLoadCatalogBrand, t as CatalogBrandProvider } from "./shell-CNUop-aR.js";
import { n as PublicHeader } from "./public-header-C5Iac7PR.js";
import { Outlet } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/catalog.tsx?tsr-split=component
function CatalogLayout() {
	const brand = useLoadCatalogBrand();
	return /* @__PURE__ */ jsx(CatalogBrandProvider, {
		value: brand,
		children: /* @__PURE__ */ jsxs("div", {
			className: "min-h-screen bg-background text-foreground",
			children: [
				/* @__PURE__ */ jsx(PublicHeader, {
					siteName: brand.siteName,
					logoUrl: brand.logoUrl,
					content: brand.landingContent ?? void 0
				}),
				/* @__PURE__ */ jsx("main", { children: /* @__PURE__ */ jsx(Outlet, {}) }),
				/* @__PURE__ */ jsx(CatalogFooter, {})
			]
		})
	});
}
//#endregion
export { CatalogLayout as component };
