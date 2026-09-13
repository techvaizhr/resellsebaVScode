import { r as supabase } from "./client-KjQ-na90.js";
//#region src/lib/slug.ts
var slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
async function uniqueProductSlug(name, ignoreId) {
	const base = slugify(name) || "product";
	let q = supabase.from("products").select("slug").like("slug", `${base}%`);
	if (ignoreId) q = q.neq("id", ignoreId);
	const { data } = await q;
	const taken = new Set((data ?? []).map((r) => r.slug));
	if (!taken.has(base)) return base;
	for (let i = 1; i < 1e3; i++) {
		const cand = `${base}-${i}`;
		if (!taken.has(cand)) return cand;
	}
	return `${base}-${Date.now()}`;
}
//#endregion
export { uniqueProductSlug as n, slugify as t };
