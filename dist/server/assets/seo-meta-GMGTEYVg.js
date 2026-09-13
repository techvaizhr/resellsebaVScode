import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { i as createSsrRpc } from "./upload.functions-wdbBXhar.js";
//#region src/lib/seo.functions.ts
var getSiteSeo = createServerFn({ method: "GET" }).inputValidator((d) => ({ path: d?.path ? String(d.path) : "/" })).handler(createSsrRpc("c24f72c85b41724a74a1745027f025f52b52eb3c4ebca1226865ec5a765fb1b1"));
var getCatalogProductSeo = createServerFn({ method: "GET" }).inputValidator((d) => ({ slug: String(d.slug) })).handler(createSsrRpc("13797c175a94746878249e5130933501e971965e8e0c193ee048e3d6bde0f18c"));
var getStoreSeo = createServerFn({ method: "GET" }).inputValidator((d) => ({ code: String(d.code) })).handler(createSsrRpc("400a97eb346d0389219e8b1d28c9cb3c3ee2d543fde9b923d087e8976553f2cd"));
var getStoreProductSeo = createServerFn({ method: "GET" }).inputValidator((d) => ({
	code: String(d.code),
	slug: String(d.slug)
})).handler(createSsrRpc("76e95cd3419397cb9224b68fd58494b99e1cbbf8f3c5acfbff89f796291816b6"));
//#endregion
//#region src/lib/seo-meta.ts
function seoMeta(seo, fallback) {
	const s = seo ?? fallback;
	const meta = [
		{ title: s.title },
		{
			name: "description",
			content: s.description
		},
		{
			property: "og:title",
			content: s.title
		},
		{
			property: "og:description",
			content: s.description
		},
		{
			property: "og:type",
			content: s.type
		},
		{
			name: "twitter:card",
			content: s.image ? "summary_large_image" : "summary"
		},
		{
			name: "twitter:title",
			content: s.title
		},
		{
			name: "twitter:description",
			content: s.description
		}
	];
	if (s.siteName) meta.push({
		property: "og:site_name",
		content: s.siteName
	});
	if (s.url) meta.push({
		property: "og:url",
		content: s.url
	});
	if (s.image) {
		meta.push({
			property: "og:image",
			content: s.image
		});
		meta.push({
			property: "og:image:secure_url",
			content: s.image
		});
		meta.push({
			property: "og:image:width",
			content: "1200"
		});
		meta.push({
			property: "og:image:height",
			content: "630"
		});
		meta.push({
			name: "twitter:image",
			content: s.image
		});
	}
	return meta;
}
function seoLinks(seo) {
	return seo?.url ? [{
		rel: "canonical",
		href: seo.url
	}] : [];
}
//#endregion
export { getStoreProductSeo as a, getSiteSeo as i, seoMeta as n, getStoreSeo as o, getCatalogProductSeo as r, seoLinks as t };
