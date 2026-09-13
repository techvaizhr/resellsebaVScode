import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_authenticated/admin/payouts.tsx
var $$splitComponentImporter = () => import("./payouts-VfwKmW2S.js");
var Route = createFileRoute("/_authenticated/admin/payouts")({
	validateSearch: (s) => ({
		reseller: typeof s.reseller === "string" && s.reseller ? s.reseller : void 0,
		status: typeof s.status === "string" && s.status ? s.status : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
