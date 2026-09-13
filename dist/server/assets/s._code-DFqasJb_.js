import { n as createFileRoute, t as lazyRouteComponent } from "./lazyRouteComponent-_UvbgDVt.js";
import { n as seoMeta, o as getStoreSeo, t as seoLinks } from "./seo-meta-DY5-eAa7.js";
//#region src/routes/s.$code.tsx
var $$splitComponentImporter = () => import("./s._code-t7Y9vn2d.js");
var Route = createFileRoute("/s/$code")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	loader: ({ params }) => getStoreSeo({ data: { code: params.code } }),
	head: ({ params, loaderData }) => ({
		meta: seoMeta(loaderData, {
			title: `${params.code} — Online Store`,
			description: `Shop from ${params.code} — genuine products with cash-on-delivery across Bangladesh.`,
			image: null,
			url: null,
			type: "website",
			siteName: null
		}),
		links: seoLinks(loaderData)
	})
});
//#endregion
export { Route as t };
