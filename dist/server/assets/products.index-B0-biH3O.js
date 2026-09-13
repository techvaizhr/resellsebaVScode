import { n as createFileRoute, t as lazyRouteComponent } from "./lazyRouteComponent-_UvbgDVt.js";
//#region src/routes/_authenticated/admin/products.index.tsx
var $$splitComponentImporter = () => import("./products.index-qCNJuyfN.js");
var Route = createFileRoute("/_authenticated/admin/products/")({
	validateSearch: (s) => ({
		status: typeof s.status === "string" ? s.status : void 0,
		stock: typeof s.stock === "string" ? s.stock : void 0,
		category: typeof s.category === "string" ? s.category : void 0,
		brand: typeof s.brand === "string" ? s.brand : void 0,
		supplier: typeof s.supplier === "string" ? s.supplier : void 0,
		approval: typeof s.approval === "string" ? s.approval : void 0,
		refresh: typeof s.refresh === "string" ? s.refresh : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
