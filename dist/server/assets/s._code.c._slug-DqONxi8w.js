import { n as createFileRoute, t as lazyRouteComponent } from "./lazyRouteComponent-_UvbgDVt.js";
//#region src/routes/s.$code.c.$slug.tsx
var $$splitComponentImporter = () => import("./s._code.c._slug-DU_eG8sQ.js");
var Route = createFileRoute("/s/$code/c/$slug")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: ({ params }) => ({ meta: [
		{ title: `${params.slug.replace(/-/g, " ")} — Collection` },
		{
			name: "description",
			content: `Browse ${params.slug.replace(/-/g, " ")} products with cash on delivery.`
		},
		{
			property: "og:title",
			content: `${params.slug.replace(/-/g, " ")} — Collection`
		},
		{
			property: "og:description",
			content: `Browse ${params.slug.replace(/-/g, " ")} products.`
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] })
});
//#endregion
export { Route as t };
