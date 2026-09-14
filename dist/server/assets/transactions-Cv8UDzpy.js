import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_authenticated/admin/transactions.tsx
var $$splitComponentImporter = () => import("./transactions-BMgYvBJE.js");
var Route = createFileRoute("/_authenticated/admin/transactions")({
	validateSearch: (s) => ({ reseller: typeof s.reseller === "string" && s.reseller ? s.reseller : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [
		{ title: "Transaction report — Reseller earnings" },
		{
			name: "description",
			content: "All reseller order settlements, security deposits and withdrawals with running balance."
		},
		{
			property: "og:title",
			content: "Transaction report — Reseller earnings"
		},
		{
			property: "og:description",
			content: "Filter by reseller and date to audit every money movement."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
export { Route as t };
