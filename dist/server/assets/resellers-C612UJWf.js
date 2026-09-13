import { n as createFileRoute, t as lazyRouteComponent } from "./lazyRouteComponent-_UvbgDVt.js";
//#region src/routes/_authenticated/admin/resellers.tsx
var $$splitComponentImporter = () => import("./resellers-B2T2qEcm.js");
var Route = createFileRoute("/_authenticated/admin/resellers")({
	validateSearch: (s) => ({ status: typeof s.status === "string" ? s.status : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
