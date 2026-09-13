import { n as createFileRoute, t as lazyRouteComponent } from "./lazyRouteComponent-_UvbgDVt.js";
import { i as getSiteSeo, n as seoMeta, t as seoLinks } from "./seo-meta-DY5-eAa7.js";
//#region src/routes/catalog.index.tsx
var $$splitComponentImporter = () => import("./catalog.index-D3HTKkEK.js");
var Route = createFileRoute("/catalog/")({
	validateSearch: (s) => ({
		category: typeof s.category === "string" && s.category ? s.category : void 0,
		brand: typeof s.brand === "string" && s.brand ? s.brand : void 0,
		q: typeof s.q === "string" && s.q ? s.q : void 0,
		page: typeof s.page === "number" && s.page > 1 ? s.page : void 0,
		sort: s.sort === "oldest" ? "oldest" : void 0
	}),
	loader: () => getSiteSeo({ data: { path: "/catalog" } }),
	head: ({ loaderData }) => {
		const site = loaderData?.siteName ?? "Master Catalog";
		return {
			meta: seoMeta(loaderData ? {
				...loaderData,
				title: `Master Catalog — ${site}`,
				description: "Complete product catalog by category — with images, descriptions, and resell prices."
			} : null, {
				title: "Master Catalog — All products in one place",
				description: "Complete product catalog by category — with images, descriptions, and resell prices.",
				image: null,
				url: null,
				type: "website",
				siteName: null
			}),
			links: seoLinks(loaderData)
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
