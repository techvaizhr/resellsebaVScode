import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_authenticated/admin/resellers.tsx
var $$splitComponentImporter = () => import("./resellers-CHKE4KJ7.js");
var Route = createFileRoute("/_authenticated/admin/resellers")({
	validateSearch: (s) => ({ status: typeof s.status === "string" ? s.status : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
