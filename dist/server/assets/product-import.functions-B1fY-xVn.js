import { t as createServerFn } from "./createServerFn-CIHAFgYl.js";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.js";
import { t as requireSupabaseAuth } from "./auth-middleware-D4xjf72S.js";
//#region src/lib/product-import.functions.ts?tss-serverfn-split
var importProductFromUrl_createServerFn_handler = createServerRpc({
	id: "fa2d8575432f23be6da68030eb418b5b7a3130a5a3fb69d3b266b5fc82073749",
	name: "importProductFromUrl",
	filename: "src/lib/product-import.functions.ts"
}, (opts) => importProductFromUrl.__executeServer(opts));
var importProductFromUrl = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (typeof input?.url !== "string" || input.url.length < 8 || input.url.length > 2e3) throw new Error("Paste a valid product link.");
	return { url: input.url };
}).handler(importProductFromUrl_createServerFn_handler, async ({ data, context }) => {
	const { assertImporter, scrapeProduct } = await import("./product-import.server-B4A0eR_I.js");
	const role = await assertImporter(context.supabase, context.userId);
	return scrapeProduct(data.url, { includeCosts: role === "staff" });
});
var fetchImportImage_createServerFn_handler = createServerRpc({
	id: "c466d25b6b17dbdf3f48540f96fec6c096d61bacfa4b597c6d9b6daedb8257da",
	name: "fetchImportImage",
	filename: "src/lib/product-import.functions.ts"
}, (opts) => fetchImportImage.__executeServer(opts));
var fetchImportImage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (typeof input?.url !== "string" || input.url.length > 2e3) throw new Error("Invalid image link.");
	return { url: input.url };
}).handler(fetchImportImage_createServerFn_handler, async ({ data, context }) => {
	const { assertImporter, fetchRemoteImage } = await import("./product-import.server-B4A0eR_I.js");
	await assertImporter(context.supabase, context.userId);
	return fetchRemoteImage(data.url);
});
//#endregion
export { fetchImportImage_createServerFn_handler, importProductFromUrl_createServerFn_handler };
