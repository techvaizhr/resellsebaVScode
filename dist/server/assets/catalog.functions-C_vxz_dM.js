import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { r as supabase } from "./client-B8ZbbxaQ.js";
import { t as createServerRpc } from "./createServerRpc-BQTLusYf.js";
import { f as resolveDelivery } from "./delivery-DY_nRbFK.js";
//#region src/lib/catalog.functions.ts?tss-serverfn-split
function extractImages(row) {
	const sortedImgs = [...row.product_images || row.images || []].sort((a, b) => Number(!!b.is_primary) - Number(!!a.is_primary) || Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
	const primaryImg = (typeof sortedImgs[0] === "string" ? sortedImgs[0] : sortedImgs[0]?.url) || row.main_image || row.image_url || row.og_image_url || null;
	const all = [
		...primaryImg ? [primaryImg] : [],
		...sortedImgs.map((i) => typeof i === "string" ? i : i.url),
		...row.og_image_url ? [row.og_image_url] : [],
		...row.main_image ? [row.main_image] : []
	].filter(Boolean);
	return [...new Set(all)];
}
/** Public master catalog — active products only from live database. */
var getCatalog_createServerFn_handler = createServerRpc({
	id: "2a45d9b79d4ba9547992f1eac18039c2bae0ddf7df7670a8638b3bf5e0a6962f",
	name: "getCatalog",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => getCatalog.__executeServer(opts));
var getCatalog = createServerFn({ method: "GET" }).handler(getCatalog_createServerFn_handler, async () => {
	try {
		const { data } = await supabase.rpc("reseller_catalog_page");
		if (data && data.products) {
			const payload = data;
			const cats = payload.categories ?? [];
			const brands = payload.brands ?? [];
			const products = (payload.products ?? []).filter((p) => p.is_active !== false).map((row) => {
				const imgs = extractImages(row);
				return {
					id: row.id,
					name: row.name,
					slug: row.slug,
					code: row.product_code || "",
					short: row.short_description ?? "",
					price: Number(row.suggested_price ?? 0),
					resellerPrice: Number(row.reseller_price ?? 0),
					categoryId: row.category_id ?? null,
					brandId: row.brand_id ?? null,
					featured: Boolean(row.is_featured),
					createdAt: row.created_at ?? null,
					image: imgs[0] || null,
					images: imgs
				};
			});
			return {
				categories: cats.map((c) => ({
					id: c.id,
					name: c.name,
					slug: c.slug,
					image_url: c.image_url || null,
					count: products.filter((p) => p.categoryId === c.id).length
				})),
				brands: brands.map((b) => ({
					id: b.id,
					name: b.name,
					slug: b.slug
				})),
				products
			};
		}
	} catch (err) {
		console.error("getCatalog error from live database:", err);
	}
	return {
		categories: [],
		brands: [],
		products: []
	};
});
var getCatalogProduct_createServerFn_handler = createServerRpc({
	id: "007261ee9d86e87592cfcd5491f56565cca84574c79db98974ab1951a1437f9d",
	name: "getCatalogProduct",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => getCatalogProduct.__executeServer(opts));
var getCatalogProduct = createServerFn({ method: "GET" }).validator((d) => ({ slug: String(d.slug) })).handler(getCatalogProduct_createServerFn_handler, async ({ data }) => {
	try {
		let { data: row } = await supabase.from("products").select("*, product_images(*), categories(*), brands(*)").eq("slug", data.slug).maybeSingle();
		if (!row) {
			const { data: rowById } = await supabase.from("products").select("*, product_images(*), categories(*), brands(*)").eq("id", data.slug).maybeSingle();
			row = rowById;
		}
		if (!row) return null;
		const imgs = extractImages(row);
		const cat = row.categories || null;
		const brand = row.brands || null;
		const resolved = resolveDelivery(row, {
			inside_dhaka: 60,
			outside_dhaka: 120,
			sub_dhaka: 100
		});
		return {
			id: row.id,
			name: row.name,
			slug: row.slug,
			code: row.product_code || "",
			short: row.short_description ?? "",
			description: row.description ?? "",
			price: Number(row.suggested_price ?? 0),
			resellerPrice: Number(row.reseller_price ?? 0),
			stock: Number(row.stock ?? 0),
			weight: row.weight_grams ?? null,
			deliveryMode: resolved.mode,
			deliverySource: resolved.source,
			deliveryInside: resolved.charges.inside_dhaka,
			deliverySub: resolved.charges.sub_dhaka,
			deliveryOutside: resolved.charges.outside_dhaka,
			deliveryFlat: resolved.mode === "custom" ? resolved.custom : resolved.flat,
			category: cat?.name ?? null,
			categorySlug: cat?.slug ?? null,
			brand: brand?.name ?? null,
			images: imgs
		};
	} catch (err) {
		console.error("getCatalogProduct error from live database:", err);
		return null;
	}
});
//#endregion
export { getCatalogProduct_createServerFn_handler, getCatalog_createServerFn_handler };
