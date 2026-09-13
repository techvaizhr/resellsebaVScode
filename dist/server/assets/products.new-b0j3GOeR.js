import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_authenticated/admin/products.new.tsx
var $$splitComponentImporter = () => import("./products.new-Bmt5OXjA.js");
var Route = createFileRoute("/_authenticated/admin/products/new")({
	validateSearch: (s) => ({ from: typeof s.from === "string" ? s.from : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
