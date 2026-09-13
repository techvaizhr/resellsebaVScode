//#region src/lib/product-import.server.ts
/**
* Server-side product scraper for supported marketplaces (Daraz, Alibaba,
* AliExpress, Amazon) and any WooCommerce / OG-tagged shop page.
*
* Safety rules (never relax):
* - https only, no credentials in URL, no private / loopback hosts (SSRF)
* - response body capped, request timed out
* - no HTML is ever executed or returned raw; we only extract plain text
* - image URLs must be absolute https and are re-encoded client-side before upload
*/
var MAX_HTML_BYTES = 6 * 1024 * 1024;
var MAX_IMAGE_BYTES = 8 * 1024 * 1024;
var TIMEOUT_MS = 2e4;
var BLOCKED_HOST = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|\[?::1\]?)/i;
var BLOCKED_SUFFIX = /\.(local|internal|localdomain|home|lan)$/i;
function assertSafeUrl(raw) {
	let u;
	try {
		u = new URL(raw.trim());
	} catch {
		throw new Error("Invalid link. Paste a full product URL.");
	}
	if (u.protocol !== "https:") throw new Error("Only https links are allowed.");
	if (u.username || u.password) throw new Error("Links with credentials are not allowed.");
	const host = u.hostname.toLowerCase();
	if (BLOCKED_HOST.test(host) || BLOCKED_SUFFIX.test(host) || !host.includes(".")) throw new Error("This host is not allowed.");
	return u;
}
function sourceLabel(host) {
	const h = host.replace(/^www\./, "");
	if (h.includes("daraz")) return "Daraz";
	if (h.includes("aliexpress")) return "AliExpress";
	if (h.includes("alibaba")) return "Alibaba";
	if (h.includes("amazon")) return "Amazon";
	return h;
}
async function fetchText(url) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
	try {
		const res = await fetch(url, {
			redirect: "follow",
			signal: ctrl.signal,
			headers: {
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
				accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
				"accept-language": "en-US,en;q=0.9,bn;q=0.8"
			}
		});
		if (!res.ok) {
			if ([
				401,
				403,
				405,
				429,
				503
			].includes(res.status)) throw new Error(`${sourceLabel(new URL(url).hostname)} automated read block korche (${res.status}). Kichukkhon pore try korun ba manually add korun.`);
			if (res.status === 404) throw new Error("Link ta pawa jacche na (404). Product page URL ta abar copy korun.");
			throw new Error(`Source responded ${res.status}. The page may be blocked or removed.`);
		}
		const buf = await res.arrayBuffer();
		if (buf.byteLength > MAX_HTML_BYTES) throw new Error("Page is too large to import.");
		return new TextDecoder("utf-8").decode(buf);
	} finally {
		clearTimeout(timer);
	}
}
/** Strips tags/scripts and decodes basic entities — output is plain text only. */
function toPlainText(html, limit = 4e3) {
	return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|li|div|h\d)>/gi, "\n").replace(/<li[^>]*>/gi, "• ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, "\"").replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, limit);
}
function meta(html, ...names) {
	for (const name of names) {
		const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const re = new RegExp(`<meta[^>]+(?:property|name|itemprop)=["']${esc}["'][^>]*content=["']([^"']+)["']`, "i");
		const alt = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name|itemprop)=["']${esc}["']`, "i");
		const m = html.match(re) ?? html.match(alt);
		if (m?.[1]) return toPlainText(m[1], 600);
	}
	return null;
}
function jsonLdBlocks(html) {
	const out = [];
	const re = /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi;
	let m;
	while (m = re.exec(html)) try {
		const parsed = JSON.parse(m[1].trim());
		out.push(...Array.isArray(parsed) ? parsed : [parsed]);
	} catch {}
	const flat = [];
	for (const node of out) {
		flat.push(node);
		if (Array.isArray(node?.["@graph"])) flat.push(...node["@graph"]);
	}
	return flat;
}
function num(v) {
	if (typeof v === "number" && Number.isFinite(v)) return v;
	if (typeof v === "string") {
		const cleaned = v.replace(/[^\d.,]/g, "").replace(/,(?=\d{3}\b)/g, "");
		const n = Number(cleaned.replace(/,/g, "."));
		return Number.isFinite(n) && n > 0 ? n : null;
	}
	return null;
}
function cleanImages(list, base) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const raw of list) {
		let s = typeof raw === "string" ? raw : raw?.url ?? raw?.src;
		if (typeof s !== "string") continue;
		s = s.trim();
		if (s.startsWith("//")) s = `https:${s}`;
		if (!/^https:\/\//i.test(s)) continue;
		try {
			const u = new URL(s, base);
			if (u.protocol !== "https:") continue;
			const key = u.href.replace(/_\d+x\d+(q\d+)?(\.\w+)?(?=(\.|$))/i, "");
			if (seen.has(key)) continue;
			seen.add(key);
			out.push(u.href);
		} catch {}
		if (out.length >= 8) break;
	}
	return out;
}
/** Marketplace-specific image + price hints when JSON-LD is missing. */
function harvestExtras(html) {
	const images = [];
	const imgRe = /"(?:image|images|imgUrl|hiRes|large|src)"\s*:\s*"((?:https:)?\/\/[^"']+?\.(?:jpg|jpeg|png|webp)[^"']*)"/gi;
	let m;
	while ((m = imgRe.exec(html)) && images.length < 30) images.push(m[1]);
	let price = null;
	const priceRe = /\\?"(?:salePrice|sale_price|pdt_price|priceText|priceValue|discountedPrice|offerPrice|current_price|minPrice|formattedPrice|priceAmount|price)\\?"\s*:\s*\\?"?\s*([^"}\\]{1,32})/gi;
	let pm;
	const cents = /Shopify\.currency|"price_min"\s*:\s*\d|"presentment_prices"/i.test(html);
	while (pm = priceRe.exec(html)) {
		const candidate = num(pm[1]);
		if (candidate) {
			const isBare = /^\s*\d+\s*$/.test(pm[1]);
			price = cents && isBare && candidate >= 1e3 && candidate % 100 === 0 ? candidate / 100 : candidate;
			break;
		}
	}
	return {
		images,
		price
	};
}
/** Decodes JSON-string escapes (Daraz/AliExpress embed description as escaped HTML). */
function decodeJsonString(s) {
	return s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\n/g, "\n").replace(/\\r/g, " ").replace(/\\t/g, " ").replace(/\\"/g, "\"").replace(/\\\//g, "/").replace(/\\\\/g, "\\");
}
/** Reads one JSON string value starting right after `"key":"` without full parsing. */
function readJsonStringValue(html, key) {
	const marker = new RegExp(`"${key}"\\s*:\\s*"`, "i");
	let from = 0;
	for (let guard = 0; guard < 20; guard++) {
		const m = html.slice(from).match(marker);
		if (!m || m.index === void 0) return null;
		const start = from + m.index + m[0].length;
		let i = start;
		while (i < html.length && i - start < 6e4) {
			const ch = html[i];
			if (ch === "\\") {
				i += 2;
				continue;
			}
			if (ch === "\"") break;
			i += 1;
		}
		const value = decodeJsonString(html.slice(start, i));
		if (toPlainText(value, 6e3).length > 60) return value;
		from = i + 1;
	}
	return null;
}
/** Grabs the chunk after a container's opening tag — tags are stripped later anyway. */
function sliceAfter(html, re, len = 3e4) {
	const m = html.match(re);
	if (!m || m.index === void 0) return null;
	return html.slice(m.index + m[0].length, m.index + m[0].length + len);
}
/**
* Marketplace / WooCommerce description harvesting used when JSON-LD and OG
* tags carry nothing useful (Daraz keeps it inside embedded module JSON).
*/
function harvestDescription(html) {
	for (const key of [
		"descriptionHtml",
		"detailDescription",
		"productDescription",
		"html",
		"description",
		"body_html"
	]) {
		const raw = readJsonStringValue(html, key);
		const text = raw ? toPlainText(raw) : "";
		if (text.length > 60) return text;
	}
	for (const re of [
		/<div[^>]+id=["']module_product_detail["'][^>]*>/i,
		/<div[^>]+class=["'][^"']*pdp-product-desc[^"']*["'][^>]*>/i,
		/<div[^>]+class=["'][^"']*html-content[^"']*["'][^>]*>/i,
		/<div[^>]+id=["']productDescription["'][^>]*>/i,
		/<div[^>]+id=["']feature-bullets["'][^>]*>/i,
		/<div[^>]+class=["'][^"']*woocommerce-Tabs-panel--description[^"']*["'][^>]*>/i,
		/<div[^>]+class=["'][^"']*woocommerce-product-details__short-description[^"']*["'][^>]*>/i,
		/<div[^>]+id=["']tab-description["'][^>]*>/i,
		/<[^>]+itemprop=["']description["'][^>]*>/i
	]) {
		const chunk = sliceAfter(html, re);
		const text = chunk ? toPlainText(chunk) : "";
		if (text.length > 60) return text;
	}
	return "";
}
/** Anti-bot / captcha interstitials must not be imported as product data. */
function assertNotBlocked(html, host) {
	if (/rgv587_flag|_____tmd_____|x5secdata|captcha-delivery|Enable JavaScript and cookies to continue|Are you a human/i.test(html.slice(0, 4e3))) throw new Error(`${sourceLabel(host)} blocked the automated read (bot check). Kichukkhon pore abar try korun, ba onno product link din.`);
}
/** Product-page URL shapes used by this platform (panel catalog + storefronts). */
var PANEL_PATHS = [
	/^\/catalog\/([^/]+)\/?$/i,
	/^\/s\/[^/]+\/p\/([^/]+)\/?$/i,
	/^\/p\/([^/]+)\/?$/i
];
/** Extracts the product slug / code a panel link points at. */
function panelRef(url) {
	for (const re of PANEL_PATHS) {
		const m = url.pathname.match(re);
		if (m?.[1]) return { slug: decodeURIComponent(m[1]) };
	}
	const code = url.searchParams.get("code") ?? url.searchParams.get("product_code");
	if (code) return { code };
	if (url.pathname.replace(/\/$/, "") === "/api/public/product") {
		const slug = url.searchParams.get("slug");
		const c = url.searchParams.get("code");
		if (slug) return { slug };
		if (c) return { code: c };
	}
	return null;
}
/**
* Best path: the linked product already lives in THIS panel (own catalog or a
* reseller storefront of this instance). We read it straight from the database
* so the real admin/buying prices and the original rich-text description come
* through instead of the public sale price + plain text.
* Cost fields are only returned to catalog staff (`includeCosts`).
*/
async function tryLocalImport(url, includeCosts) {
	const ref = panelRef(url);
	if (!ref) return null;
	try {
		const { supabaseAdmin } = await import("./client.server-BwYXcjEZ.js");
		let q = supabaseAdmin.from("products").select("name, slug, sku, product_code, short_description, description, buying_price, reseller_price, suggested_price, meta_title, meta_description, og_image_url, brands(name), categories(name), product_images(url, is_primary, sort_order)").limit(1);
		q = ref.slug ? q.eq("slug", ref.slug) : q.eq("product_code", (ref.code ?? "").toUpperCase());
		const { data } = await q.maybeSingle();
		if (!data?.name) return null;
		const images = [...data.product_images ?? []].sort((a, b) => Number(!!b.is_primary) - Number(!!a.is_primary) || Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)).map((i) => i.url).filter((u) => typeof u === "string" && /^https:\/\//i.test(u));
		const brand = Array.isArray(data.brands) ? data.brands[0] : data.brands;
		const category = Array.isArray(data.categories) ? data.categories[0] : data.categories;
		const description = String(data.description ?? "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").slice(0, 2e4).trim();
		return {
			source: "This panel",
			url: url.href,
			name: String(data.name).slice(0, 200),
			description,
			shortDescription: toPlainText(String(data.short_description ?? ""), 400) || toPlainText(description, 200),
			price: Number(data.suggested_price ?? 0) || null,
			adminPrice: includeCosts ? Number(data.reseller_price ?? 0) || null : null,
			buyingPrice: includeCosts ? Number(data.buying_price ?? 0) || null : null,
			currency: "BDT",
			sku: data.sku ?? data.product_code ?? null,
			brand: brand?.name ?? null,
			category: category?.name ?? null,
			images: images.length ? images : data.og_image_url ? [String(data.og_image_url)] : [],
			metaTitle: toPlainText(String(data.meta_title || data.name), 60),
			metaDescription: toPlainText(String(data.meta_description || ""), 160) || toPlainText(description, 160)
		};
	} catch {
		return null;
	}
}
/**
* Fast path: the link belongs to another (or this) instance of this platform,
* so read the structured public product feed instead of scraping HTML.
* Returns null when the link is not a panel product link.
*/
async function tryPanelImport(url) {
	let query = null;
	for (const re of PANEL_PATHS) {
		const m = url.pathname.match(re);
		if (m?.[1]) {
			query = `slug=${encodeURIComponent(decodeURIComponent(m[1]))}`;
			break;
		}
	}
	const code = url.searchParams.get("code") ?? url.searchParams.get("product_code");
	if (!query && code) query = `code=${encodeURIComponent(code)}`;
	if (!query && url.pathname.replace(/\/$/, "") === "/api/public/product") query = url.searchParams.toString();
	if (!query) return null;
	const api = `${url.origin}/api/public/product?${query}`;
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
	try {
		const res = await fetch(api, {
			signal: ctrl.signal,
			headers: { accept: "application/json" }
		});
		if (!res.ok) return null;
		const body = await res.json();
		const p = body?.product;
		if (!body?.ok || !p || typeof p.name !== "string") return null;
		const description = String(p.description ?? "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").slice(0, 2e4).trim();
		const shortDescription = toPlainText(String(p.shortDescription ?? ""), 400) || toPlainText(description, 200);
		const priceNum = num(p.price);
		return {
			source: `Panel (${url.hostname.replace(/^www\./, "")})`,
			url: url.href,
			name: toPlainText(p.name, 200),
			description,
			shortDescription,
			price: priceNum,
			currency: typeof p.currency === "string" ? p.currency.slice(0, 6) : "BDT",
			sku: typeof p.sku === "string" ? toPlainText(p.sku, 60) : null,
			brand: typeof p.brand === "string" ? toPlainText(p.brand, 80) : null,
			category: typeof p.category === "string" ? toPlainText(p.category, 80) : null,
			images: cleanImages(Array.isArray(p.images) ? p.images : [], url),
			metaTitle: toPlainText(String(p.metaTitle || p.name), 60),
			metaDescription: toPlainText(String(p.metaDescription || ""), 160) || toPlainText(description, 160)
		};
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}
async function scrapeProduct(rawUrl, opts = {}) {
	const url = assertSafeUrl(rawUrl);
	const local = await tryLocalImport(url, !!opts.includeCosts);
	if (local) return local;
	const panel = await tryPanelImport(url);
	if (panel) return panel;
	const html = await fetchText(url.href);
	assertNotBlocked(html, url.hostname);
	const product = jsonLdBlocks(html).find((b) => {
		const t = b?.["@type"];
		return t === "Product" || Array.isArray(t) && t.includes("Product");
	}) ?? null;
	const offersRaw = product?.offers;
	const offer = Array.isArray(offersRaw) ? offersRaw[0] : offersRaw;
	const extras = harvestExtras(html);
	const ldName = typeof product?.name === "string" ? toPlainText(product.name, 200) : null;
	const ogName = meta(html, "og:title", "twitter:title");
	const name = ldName ?? ogName ?? toPlainText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "", 200);
	if (!name || !ldName && !ogName && !extras.price && !extras.images.length) throw new Error(`${sourceLabel(url.hostname)} theke product data pawa gelo na — page ta JavaScript-only, login ba bot-protected hote pare. Onno link try korun ba manually add korun.`);
	const ldDesc = typeof product?.description === "string" ? toPlainText(product.description) : "";
	const metaDesc = toPlainText(meta(html, "og:description", "description", "twitter:description") ?? "");
	const description = [
		ldDesc,
		ldDesc.length > 120 ? "" : harvestDescription(html),
		metaDesc
	].sort((a, b) => b.length - a.length)[0] ?? "";
	const price = num(offer?.price) ?? num(offer?.lowPrice) ?? num(offer?.priceSpecification?.price) ?? num(meta(html, "product:price:amount", "og:price:amount")) ?? extras.price;
	const imageCandidates = [
		...Array.isArray(product?.image) ? product.image : product?.image ? [product.image] : [],
		meta(html, "og:image", "twitter:image") ?? "",
		...extras.images
	];
	const brandRaw = product?.brand;
	const brand = typeof brandRaw === "string" ? toPlainText(brandRaw, 80) : typeof brandRaw?.name === "string" ? toPlainText(brandRaw.name, 80) : meta(html, "product:brand") ?? null;
	const catRaw = product?.category;
	const category = typeof catRaw === "string" ? toPlainText(catRaw.split(">").pop() ?? catRaw, 80) : meta(html, "product:category") ?? null;
	return {
		source: sourceLabel(url.hostname),
		url: url.href,
		name,
		description,
		shortDescription: description.slice(0, 200),
		price,
		currency: (typeof offer?.priceCurrency === "string" ? offer.priceCurrency.slice(0, 6) : null) ?? meta(html, "product:price:currency", "og:price:currency"),
		sku: (typeof product?.sku === "string" ? toPlainText(product.sku, 60) : null) ?? (typeof product?.mpn === "string" ? toPlainText(product.mpn, 60) : null),
		brand,
		category,
		images: cleanImages(imageCandidates, url),
		metaTitle: name.slice(0, 60),
		metaDescription: description.slice(0, 160)
	};
}
var IMAGE_MAGIC = [
	{
		mime: "image/jpeg",
		bytes: [
			255,
			216,
			255
		]
	},
	{
		mime: "image/png",
		bytes: [
			137,
			80,
			78,
			71
		]
	},
	{
		mime: "image/webp",
		bytes: [
			82,
			73,
			70,
			70
		]
	},
	{
		mime: "image/gif",
		bytes: [
			71,
			73,
			70,
			56
		]
	}
];
/** Downloads one remote image and returns verified bytes as base64 (never HTML/scripts). */
async function fetchRemoteImage(rawUrl) {
	const url = assertSafeUrl(rawUrl);
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
	try {
		const res = await fetch(url.href, {
			redirect: "follow",
			signal: ctrl.signal,
			headers: {
				"user-agent": "Mozilla/5.0",
				accept: "image/*"
			}
		});
		if (!res.ok) throw new Error(`Image download failed (${res.status}).`);
		const buf = new Uint8Array(await res.arrayBuffer());
		if (buf.byteLength === 0) throw new Error("Empty image.");
		if (buf.byteLength > MAX_IMAGE_BYTES) throw new Error("Image too large.");
		const mime = IMAGE_MAGIC.find((sig) => sig.bytes.every((b, i) => buf[i] === b))?.mime;
		if (!mime) throw new Error("Downloaded file is not a real image — skipped for safety.");
		let binary = "";
		for (let i = 0; i < buf.length; i += 32768) binary += String.fromCharCode(...buf.subarray(i, i + 32768));
		return {
			base64: btoa(binary),
			mime
		};
	} finally {
		clearTimeout(timer);
	}
}
/** Catalog staff OR an active supplier may pull product data from a link. */
async function assertImporter(client, userId) {
	const { data } = await client.from("suppliers").select("id").eq("user_id", userId).eq("status", "active").maybeSingle();
	if (data?.id) return "supplier";
	const { assertAnyPermission } = await import("./admin-users.server-Cj-VRRLO.js");
	await assertAnyPermission(client, userId, ["products.manage"]);
	return "staff";
}
//#endregion
export { assertImporter, fetchRemoteImage, scrapeProduct };
