import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { s as createSsrRpc } from "./client-fziyWHNw.js";
import { i as enumType, l as stringType, n as arrayType, r as booleanType, s as objectType } from "./types-CX4iBvKD.js";
import { t as requireSupabaseAuth } from "./auth-middleware-B9l3vJQd.js";
//#region src/lib/cloudflare.functions.ts
/** Masked Cloudflare credentials for the admin settings screen. */
var getCloudflareConfig = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("ade31f0e85e821c0c9984553cd0af6a3ac9c2f9f0bbbc71b11174056b684ac4a"));
/** Save credentials. An empty token keeps the stored one. */
var saveCloudflareConfig = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	api_token: stringType().max(300).optional(),
	account_id: stringType().max(120).default(""),
	zone_id: stringType().max(120).default(""),
	zone_name: stringType().max(253).default(""),
	worker_name: stringType().max(120).default(""),
	cname_target: stringType().max(253).default(""),
	a_record_ip: stringType().max(64).default(""),
	auto_worker_domain: booleanType().default(false),
	is_active: booleanType().default(false),
	mode: enumType([
		"cloudflare",
		"dns",
		"both"
	]).default("both"),
	server_a_ip: stringType().max(64).default(""),
	server_cname: stringType().max(253).default(""),
	server_note: stringType().max(2e3).default(""),
	dns_active: booleanType().default(false)
}).parse(d)).handler(createSsrRpc("e681b5bcf4d58665c92b49d188b4328094cbb5aacf7e0b26307702f8603d300e"));
/** Check the stored token / zone / account against Cloudflare. */
var testCloudflareConfig = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("f7d2b7addd0fda66bd511042fa2856a7a8ca6d28c6b804821ec09834178fc07d"));
/** Public-safe DNS instructions for the reseller panel. */
var getDnsGuide = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => d ?? {}).handler(createSsrRpc("aacdf5781b98bc48cc6a146e3461e151efb2f0722ac439a7ac3d790f5416c459"));
/** Which reseller the caller may act on. */
/** Domains of one reseller (self) or, for admins, of everyone. */
var listDomains = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	resellerId: stringType().optional(),
	all: booleanType().optional()
}).parse(d ?? {})).handler(createSsrRpc("aa38052ba1ea57d4f2ebac1ba15438d82f607703322e9bb22a67a0a40503254f"));
/** Add a hostname and provision it on Cloudflare. */
var connectDomain = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	hostname: stringType().max(300),
	resellerId: stringType().optional(),
	mode: enumType(["cloudflare", "dns"]).default("cloudflare")
}).parse(d)).handler(createSsrRpc("1de17cc7f2793b21d06ee002aa5a238c2432ea1923fa9fc2527bf6ead15ef408"));
/** Pull the live Cloudflare status for one domain. */
var refreshDomain = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().min(1) }).parse(d)).handler(createSsrRpc("2d5e71d3e2ba36243c3b1a733b0fe4b540d79894c95517bfe0f13a6928e404ab"));
/** Make one hostname the store's canonical domain. */
var setPrimaryDomain = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().min(1) }).parse(d)).handler(createSsrRpc("faaa580fd4cb98d1b12ecb9e0bb7a060ab3975a86f23abb9e6be865e25d51865"));
/** Remove the domain from Cloudflare (hostname + worker domain) and from the DB. */
var disconnectDomain = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().min(1) }).parse(d)).handler(createSsrRpc("d5dc6b97d303a369fb80b25d5071fcb7fc72bcb783d35eb1004728e1efbb00d5"));
var getPlatformOrigins = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("5154d03a6ed76df0f43dc14445a211249a07639dedc8c8bfd9f4261231ef73c0"));
var savePlatformOrigins = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	allowed_origins: arrayType(stringType().max(253)).max(50).default([]),
	callback_base_url: stringType().max(253).default("")
}).parse(d)).handler(createSsrRpc("b2f365d22f7d0d90f0f364eff697e0e33d81d572fbef647481171a0b6069cc9d"));
//#endregion
export { getPlatformOrigins as a, saveCloudflareConfig as c, testCloudflareConfig as d, getDnsGuide as i, savePlatformOrigins as l, disconnectDomain as n, listDomains as o, getCloudflareConfig as r, refreshDomain as s, connectDomain as t, setPrimaryDomain as u };
