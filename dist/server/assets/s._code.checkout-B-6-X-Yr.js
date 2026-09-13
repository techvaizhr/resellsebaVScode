import { n as createFileRoute, t as lazyRouteComponent } from "./lazyRouteComponent-_UvbgDVt.js";
//#region src/routes/s.$code.checkout.tsx
var $$splitComponentImporter = () => import("./s._code.checkout-CQ8Z0tuJ.js");
var Route = createFileRoute("/s/$code/checkout")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [
		{ title: "Checkout · Reseller Store" },
		{
			name: "description",
			content: "Complete your reseller store order with delivery area and payment method selection."
		},
		{
			property: "og:title",
			content: "Checkout · Reseller Store"
		},
		{
			property: "og:description",
			content: "Complete your order securely through COD, manual wallet, or verified gateway payment."
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
		l: typeof s.l === "string" ? s.l : void 0,
		q: s.q ? Number(s.q) : void 0,
		pay: typeof s.pay === "string" ? s.pay : void 0
	})
});
/** Area names come from Admin → Advanced settings → Delivery charge. */
//#endregion
export { Route as t };
