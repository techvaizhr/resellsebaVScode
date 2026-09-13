import { n as createFileRoute, t as lazyRouteComponent } from "./lazyRouteComponent-_UvbgDVt.js";
import { n as seoMeta, r as getCatalogProductSeo, t as seoLinks } from "./seo-meta-GMGTEYVg.js";
//#region src/routes/catalog.$slug.tsx
var $$splitComponentImporter = () => import("./catalog._slug-BzdM0vnS.js");
var Route = createFileRoute("/catalog/$slug")({
	loader: ({ params }) => getCatalogProductSeo({ data: { slug: params.slug } }),
	head: ({ params, loaderData }) => {
		const rawSlugTitle = params.slug.replace(/-/g, " ");
		const defaultTitle = `${rawSlugTitle.charAt(0).toUpperCase() + rawSlugTitle.slice(1)} — Master Catalog`;
		const title = loaderData?.title && !loaderData.title.startsWith("Product not found") ? loaderData.title : defaultTitle;
		return {
			meta: seoMeta(loaderData ? {
				...loaderData,
				title
			} : null, {
				title,
				description: `${rawSlugTitle} — images, description, and resell price.`,
				image: null,
				url: null,
				type: "product",
				siteName: "ResellSeba"
			}),
			links: seoLinks(loaderData)
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
