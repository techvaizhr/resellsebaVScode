import { n as createFileRoute, t as lazyRouteComponent } from "./lazyRouteComponent-_UvbgDVt.js";
//#region src/routes/_authenticated/admin/payouts.tsx
var $$splitComponentImporter = () => import("./payouts-8guhEAQk.js");
var Route = createFileRoute("/_authenticated/admin/payouts")({
	validateSearch: (s) => ({
		reseller: typeof s.reseller === "string" && s.reseller ? s.reseller : void 0,
		status: typeof s.status === "string" && s.status ? s.status : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
