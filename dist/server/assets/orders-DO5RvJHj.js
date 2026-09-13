import { n as createFileRoute, t as lazyRouteComponent } from "./lazyRouteComponent-_UvbgDVt.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { n as ORDER_TABS } from "./courier-status-BxiQVHJB.js";
require_jsx_runtime();
var $$splitComponentImporter = () => import("./orders-BJUXO-MQ.js");
var Route = createFileRoute("/_authenticated/reseller/orders")({
	validateSearch: (s) => ({
		tab: ORDER_TABS.some((t) => t.key === s.tab) ? s.tab : void 0,
		q: typeof s.q === "string" && s.q ? s.q : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
