import { n as ORDER_TABS } from "./courier-status-BxiQVHJB.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_authenticated/admin/orders.tsx
var $$splitComponentImporter = () => import("./orders-Dbi2BFeB.js");
var Route = createFileRoute("/_authenticated/admin/orders")({
	validateSearch: (s) => ({
		tab: ORDER_TABS.some((t) => t.key === s.tab) ? s.tab : void 0,
		reseller: typeof s.reseller === "string" && s.reseller ? s.reseller : void 0,
		q: typeof s.q === "string" && s.q ? s.q : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
