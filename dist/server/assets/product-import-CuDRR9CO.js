import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { l as validateAndCompress, r as supabase, s as createSsrRpc } from "./client-BZQd8T2B.js";
import { t as requireSupabaseAuth } from "./auth-middleware-CuZqyT13.js";
//#region src/lib/product-import.functions.ts
/** Reads a marketplace product page and returns plain, sanitized fields. */
var importProductFromUrl = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (typeof input?.url !== "string" || input.url.length < 8 || input.url.length > 2e3) throw new Error("Paste a valid product link.");
	return { url: input.url };
}).handler(createSsrRpc("fa2d8575432f23be6da68030eb418b5b7a3130a5a3fb69d3b266b5fc82073749"));
/** Downloads one remote image server-side (CORS-safe) and returns verified bytes. */
var fetchImportImage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (typeof input?.url !== "string" || input.url.length > 2e3) throw new Error("Invalid image link.");
	return { url: input.url };
}).handler(createSsrRpc("c466d25b6b17dbdf3f48540f96fec6c096d61bacfa4b597c6d9b6daedb8257da"));
//#endregion
//#region src/lib/product-import.ts
/** Client-side glue for the "Import product from URL" flow. */
var DRAFT_KEY = "product-import-draft";
function saveImportDraft(draft) {
	try {
		sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
	} catch {}
}
function takeImportDraft() {
	try {
		const raw = sessionStorage.getItem(DRAFT_KEY);
		if (!raw) return null;
		sessionStorage.removeItem(DRAFT_KEY);
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
/**
* Pulls remote images through the server, re-encodes them in the browser
* (magic-byte check + canvas re-draw + ≤200KB WebP) and uploads to storage.
* Any image that fails is skipped rather than aborting the whole import.
*/
async function importImagesToStorage(urls, fetchImage, max = 6, onProgress, folder = "master") {
	const list = urls.slice(0, max);
	let done = 0;
	return (await Promise.all(list.map(async (url) => {
		try {
			const { base64, mime } = await fetchImage({ data: { url } });
			const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
			const compressed = await validateAndCompress(new File([bytes], "import.bin", { type: mime }), { square: true });
			const path = `${folder}/${crypto.randomUUID()}.webp`;
			const { error } = await supabase.storage.from("product-images").upload(path, compressed.blob, {
				contentType: "image/webp",
				cacheControl: "31536000",
				upsert: false
			});
			if (error) throw error;
			const { data: signed } = await supabase.storage.from("product-images").createSignedUrl(path, 3600 * 24 * 365 * 5);
			return {
				path,
				url: signed?.signedUrl ?? "",
				bytes: compressed.bytes
			};
		} catch {
			return null;
		} finally {
			done += 1;
			onProgress?.(done, list.length);
		}
	}))).filter((im) => !!im);
}
//#endregion
export { importProductFromUrl as a, fetchImportImage as i, saveImportDraft as n, takeImportDraft as r, importImagesToStorage as t };
