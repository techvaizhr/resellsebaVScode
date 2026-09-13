import { n as ORDER_TABS } from "./courier-status-BxiQVHJB.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import "react/jsx-runtime";
//#region src/routes/_authenticated/reseller/orders.tsx
var $$splitComponentImporter = () => import("./orders-BbTsrBJ4.js");
var Route = createFileRoute("/_authenticated/reseller/orders")({
	validateSearch: (s) => ({
		tab: ORDER_TABS.some((t) => t.key === s.tab) ? s.tab : void 0,
		q: typeof s.q === "string" && s.q ? s.q : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
