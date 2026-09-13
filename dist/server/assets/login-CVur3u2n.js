import { n as createFileRoute, t as lazyRouteComponent } from "./lazyRouteComponent-_UvbgDVt.js";
import { i as enumType, l as stringType, s as objectType } from "./types-CX4iBvKD.js";
//#region src/routes/login.tsx
var $$splitComponentImporter = () => import("./login-CoxfCNyh.js");
var Route = createFileRoute("/login")({
	ssr: false,
	validateSearch: objectType({
		redirect: stringType().optional(),
		mode: enumType(["signin", "signup"]).optional()
	}),
	head: () => ({ meta: [
		{ title: "Login / Register" },
		{
			name: "description",
			content: "Sign in to your reseller account or register a new one."
		},
		{
			property: "og:title",
			content: "Login / Register"
		},
		{
			property: "og:description",
			content: "Create a reseller account and launch your own store."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
/** Makes sure the signed-in user has a reseller/supplier record + role. Safe to call repeatedly. */
//#endregion
export { Route as t };
