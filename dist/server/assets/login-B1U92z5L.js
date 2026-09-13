import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";
//#region src/routes/login.tsx
var $$splitComponentImporter = () => import("./login-kQbsC2fF.js");
var Route = createFileRoute("/login")({
	ssr: false,
	validateSearch: z.object({
		redirect: z.string().optional(),
		mode: z.enum(["signin", "signup"]).optional()
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
