import { n as createFileRoute, t as lazyRouteComponent } from "./lazyRouteComponent-_UvbgDVt.js";
import { a as getStoreProductSeo, n as seoMeta, t as seoLinks } from "./seo-meta-CCcI22pj.js";
//#region src/routes/s.$code.p.$slug.tsx
var $$splitComponentImporter = () => import("./s._code.p._slug-CtWYja-8.js");
var Route = createFileRoute("/s/$code/p/$slug")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	loader: ({ params }) => getStoreProductSeo({ data: {
		code: params.code,
		slug: params.slug
	} }),
	head: ({ params, loaderData }) => {
		const label = params.slug.replace(/-/g, " ");
		return {
			meta: seoMeta(loaderData, {
				title: `${label} — Buy online, cash on delivery`,
				description: `Order ${label} online with cash on delivery across Bangladesh.`,
				image: null,
				url: null,
				type: "product",
				siteName: null
			}),
			links: seoLinks(loaderData)
		};
	}
});
//#endregion
export { Route as t };
