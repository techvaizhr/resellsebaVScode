import { n as Outlet } from "./Match-D8nEIile.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { n as CatalogFooter, o as useLoadCatalogBrand, t as CatalogBrandProvider } from "./shell-DmNyF2_A.js";
import { n as PublicHeader } from "./public-header-DnfAojTg.js";
//#region src/routes/catalog.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
function CatalogLayout() {
	const brand = useLoadCatalogBrand();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogBrandProvider, {
		value: brand,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {
					siteName: brand.siteName,
					logoUrl: brand.logoUrl,
					content: brand.landingContent ?? void 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogFooter, {})
			]
		})
	});
}
//#endregion
export { CatalogLayout as component };
