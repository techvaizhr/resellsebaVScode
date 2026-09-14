import { t as getRequest } from "./request-response-BEPp1C2k.js";
import { t as createServerFn } from "./createServerFn-CIHAFgYl.js";
import { r as supabase } from "./client-Be051lUg.js";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.js";
//#region src/lib/seo.server.ts
/**
* Server-only SEO helpers.
*
* Social crawlers (Facebook, WhatsApp, Twitter/X) never run JavaScript, so
* every shareable page must ship real Open Graph tags in the server-rendered
* HTML. These helpers fetch the minimum fields needed and build an absolute
* URL for `og:image` / `og:url`.
*/
function currentOrigin() {
	try {
		const req = getRequest();
		if (!req) return null;
		const proto = req.headers.get("x-forwarded-proto") ?? "https";
		const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
		if (host) return `${proto}://${host}`;
		return new URL(req.url).origin;
	} catch {
		return null;
	}
}
function absolute(url, origin) {
	if (!url) return null;
	if (/^https?:\/\//i.test(url)) return url;
	if (!origin) return null;
	return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}
function plain(html, max = 155) {
	const text = String(html ?? "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#0?39;|&apos;/g, "'").replace(/\s+/g, " ").trim();
	return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
function firstImage(imgs) {
	return [...imgs ?? []].sort((a, b) => Number(!!b.is_primary) - Number(!!a.is_primary) || Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))[0]?.url ?? null;
}
async function globalSettings() {
	try {
		const { data } = await supabase.from("global_settings").select("site_name, meta_description, og_image_url, logo_url, meta_title_template").eq("id", 1).maybeSingle();
		return data ?? null;
	} catch (err) {
		console.warn("SEO globalSettings fallback:", err);
		return null;
	}
}
/** Landing page / platform-level share card. */
async function siteSeo(path = "/") {
	const origin = currentOrigin();
	try {
		const gs = await globalSettings();
		const name = gs?.site_name ?? "ResellSeba";
		return {
			title: name,
			description: plain(gs?.meta_description) || `${name} — start your own online store with zero investment.`,
			image: absolute(gs?.og_image_url ?? gs?.logo_url ?? null, origin),
			url: origin ? `${origin}${path}` : null,
			type: "website",
			siteName: name
		};
	} catch (err) {
		console.warn("siteSeo fallback:", err);
		return {
			title: "ResellSeba",
			description: "ResellSeba — start your own online store with zero investment.",
			image: null,
			url: origin ? `${origin}${path}` : null,
			type: "website",
			siteName: "ResellSeba"
		};
	}
}
/** Master catalog product page. */
async function catalogProductSeo(slug) {
	const origin = currentOrigin();
	try {
		const [gs, res] = await Promise.all([globalSettings(), supabase.from("products").select("name, slug, short_description, description, meta_title, meta_description, og_image_url, product_images(url, is_primary, sort_order)").eq("slug", slug).eq("is_active", true).maybeSingle()]);
		const site = gs?.site_name ?? "Catalog";
		let p = res?.data;
		if (!p) return {
			title: `Product not found — ${site}`,
			description: "This product is no longer available.",
			image: absolute(gs?.og_image_url ?? null, origin),
			url: origin ? `${origin}/catalog/${slug}` : null,
			type: "website",
			siteName: site
		};
		return {
			title: p.meta_title || `${p.name} — ${site}`,
			description: plain(p.meta_description) || plain(p.short_description) || plain(p.description) || `${p.name} — ${site}`,
			image: absolute(firstImage(p.product_images) ?? p.og_image_url ?? p.main_image ?? gs?.og_image_url ?? null, origin),
			url: origin ? `${origin}/catalog/${p.slug}` : null,
			type: "product",
			siteName: site
		};
	} catch (err) {
		console.warn("catalogProductSeo fallback:", err);
		return {
			title: `Product — ResellSeba`,
			description: "Product details on ResellSeba",
			image: null,
			url: origin ? `${origin}/catalog/${slug}` : null,
			type: "product",
			siteName: "ResellSeba"
		};
	}
}
/**
* Storefront data comes from the `store_seo` database function: storefront
* tables are not readable by anonymous clients, and social crawlers are always
* anonymous.
*/
async function storeSeoRow(code, slug) {
	try {
		const { data } = await supabase.rpc("store_seo", {
			_code: code,
			_slug: slug ?? null
		});
		return data ?? null;
	} catch (err) {
		console.warn("storeSeoRow fallback:", err);
		return null;
	}
}
/** Reseller storefront home. */
async function storeSeo(code) {
	const origin = currentOrigin();
	try {
		const s = (await storeSeoRow(code))?.store ?? null;
		if (!s) return {
			title: "Store not found",
			description: "No active store exists for this address.",
			image: null,
			url: origin ? `${origin}/s/${code}` : null,
			type: "website",
			siteName: null
		};
		const name = s.name;
		return {
			title: s.tagline ? `${name} — ${s.tagline}` : `${name} — Online Store`,
			description: plain(s.meta_description) || `Shop from ${name} — genuine products with cash on delivery across Bangladesh.`,
			image: absolute(s.og_image_url ?? s.hero_image_url ?? s.logo_url ?? null, origin),
			url: origin ? `${origin}/s/${s.code}` : null,
			type: "website",
			siteName: name
		};
	} catch (err) {
		console.warn("storeSeo fallback:", err);
		return {
			title: "Online Store",
			description: "Shop online with cash on delivery across Bangladesh.",
			image: null,
			url: origin ? `${origin}/s/${code}` : null,
			type: "website",
			siteName: null
		};
	}
}
/** Reseller storefront product page. */
async function storeProductSeo(code, slug) {
	const origin = currentOrigin();
	try {
		const row = await storeSeoRow(code, slug);
		const s = row?.store ?? null;
		if (!s) return storeSeo(code);
		const storeName = s.name;
		const p = row?.product ?? null;
		if (!p) {
			const base = await storeSeo(code);
			return {
				...base,
				url: origin ? `${origin}/s/${code}/p/${slug}` : base.url
			};
		}
		const title = p.custom_title || p.name;
		const price = Number(p.selling_price ?? 0);
		return {
			title: p.meta_title || `${title} — ${storeName}`,
			description: plain(p.meta_description) || plain(p.custom_description) || plain(p.short_description) || plain(p.description) || `Order ${title}${price ? ` at ৳${price}` : ""} with cash on delivery across Bangladesh.`,
			image: absolute(p.image ?? s.og_image_url ?? s.logo_url ?? null, origin),
			url: origin ? `${origin}/s/${s.code}/p/${p.slug}` : null,
			type: "product",
			siteName: storeName
		};
	} catch (err) {
		console.warn("storeProductSeo fallback:", err);
		return {
			title: "Product Details",
			description: "Order with cash on delivery across Bangladesh.",
			image: null,
			url: origin ? `${origin}/s/${code}/p/${slug}` : null,
			type: "product",
			siteName: null
		};
	}
}
//#endregion
//#region src/lib/seo.functions.ts?tss-serverfn-split
var getSiteSeo_createServerFn_handler = createServerRpc({
	id: "c24f72c85b41724a74a1745027f025f52b52eb3c4ebca1226865ec5a765fb1b1",
	name: "getSiteSeo",
	filename: "src/lib/seo.functions.ts"
}, (opts) => getSiteSeo.__executeServer(opts));
var getSiteSeo = createServerFn({ method: "GET" }).inputValidator((d) => ({ path: d?.path ? String(d.path) : "/" })).handler(getSiteSeo_createServerFn_handler, async ({ data }) => siteSeo(data.path));
var getCatalogProductSeo_createServerFn_handler = createServerRpc({
	id: "13797c175a94746878249e5130933501e971965e8e0c193ee048e3d6bde0f18c",
	name: "getCatalogProductSeo",
	filename: "src/lib/seo.functions.ts"
}, (opts) => getCatalogProductSeo.__executeServer(opts));
var getCatalogProductSeo = createServerFn({ method: "GET" }).inputValidator((d) => ({ slug: String(d.slug) })).handler(getCatalogProductSeo_createServerFn_handler, async ({ data }) => catalogProductSeo(data.slug));
var getStoreSeo_createServerFn_handler = createServerRpc({
	id: "400a97eb346d0389219e8b1d28c9cb3c3ee2d543fde9b923d087e8976553f2cd",
	name: "getStoreSeo",
	filename: "src/lib/seo.functions.ts"
}, (opts) => getStoreSeo.__executeServer(opts));
var getStoreSeo = createServerFn({ method: "GET" }).inputValidator((d) => ({ code: String(d.code) })).handler(getStoreSeo_createServerFn_handler, async ({ data }) => storeSeo(data.code));
var getStoreProductSeo_createServerFn_handler = createServerRpc({
	id: "76e95cd3419397cb9224b68fd58494b99e1cbbf8f3c5acfbff89f796291816b6",
	name: "getStoreProductSeo",
	filename: "src/lib/seo.functions.ts"
}, (opts) => getStoreProductSeo.__executeServer(opts));
var getStoreProductSeo = createServerFn({ method: "GET" }).inputValidator((d) => ({
	code: String(d.code),
	slug: String(d.slug)
})).handler(getStoreProductSeo_createServerFn_handler, async ({ data }) => storeProductSeo(data.code, data.slug));
//#endregion
export { getCatalogProductSeo_createServerFn_handler, getSiteSeo_createServerFn_handler, getStoreProductSeo_createServerFn_handler, getStoreSeo_createServerFn_handler };
