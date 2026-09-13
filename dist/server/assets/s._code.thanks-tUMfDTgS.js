import { n as createFileRoute, t as lazyRouteComponent } from "./lazyRouteComponent-_UvbgDVt.js";
//#region src/routes/s.$code.thanks.tsx
var $$splitComponentImporter = () => import("./s._code.thanks-RAIlTqOv.js");
var Route = createFileRoute("/s/$code/thanks")({
	head: () => ({ meta: [
		{ title: "Order received · Reseller Store" },
		{
			name: "description",
			content: "Order confirmation and verified payment result for reseller store customers."
		},
		{
			property: "og:title",
			content: "Order received · Reseller Store"
		},
		{
			property: "og:description",
			content: "View your order number and confirmed payment status after checkout."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	validateSearch: (s) => ({
		n: typeof s.n === "string" ? s.n : "",
		...typeof s.pay === "string" ? { pay: s.pay } : {},
		...typeof s.txn === "string" ? { txn: s.txn } : {}
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
/** Online-payment outcome, shown only when the customer returns from a gateway. */
//#endregion
export { Route as t };
