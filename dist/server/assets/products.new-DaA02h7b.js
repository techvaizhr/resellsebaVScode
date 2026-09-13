import { n as createFileRoute, t as lazyRouteComponent } from "./lazyRouteComponent-_UvbgDVt.js";
//#region src/routes/_authenticated/admin/products.new.tsx
var $$splitComponentImporter = () => import("./products.new-CGf61fW-.js");
var Route = createFileRoute("/_authenticated/admin/products/new")({
	validateSearch: (s) => ({ from: typeof s.from === "string" ? s.from : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
