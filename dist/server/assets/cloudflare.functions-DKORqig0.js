import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as createServerRpc } from "./createServerRpc-BQTLusYf.js";
import { i as enumType, l as stringType, n as arrayType, r as booleanType, s as objectType } from "./types-CX4iBvKD.js";
import { t as requireSupabaseAuth } from "./auth-middleware-CwgILtb5.js";
//#region src/lib/cloudflare.functions.ts?tss-serverfn-split
var getCloudflareConfig_createServerFn_handler = createServerRpc({
	id: "ade31f0e85e821c0c9984553cd0af6a3ac9c2f9f0bbbc71b11174056b684ac4a",
	name: "getCloudflareConfig",
	filename: "src/lib/cloudflare.functions.ts"
}, (opts) => getCloudflareConfig.__executeServer(opts));
var getCloudflareConfig = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getCloudflareConfig_createServerFn_handler, async ({ context }) => {
	const { assertAnyPermission } = await import("./admin-users.server-Cj-VRRLO.js");
	await assertAnyPermission(context.supabase, context.userId, ["settings.manage"]);
	const { loadConfigAsCaller, maskConfig } = await import("./cloudflare.server-DZyDw2hX.js");
	return maskConfig(await loadConfigAsCaller(context.supabase));
});
var saveCloudflareConfig_createServerFn_handler = createServerRpc({
	id: "e681b5bcf4d58665c92b49d188b4328094cbb5aacf7e0b26307702f8603d300e",
	name: "saveCloudflareConfig",
	filename: "src/lib/cloudflare.functions.ts"
}, (opts) => saveCloudflareConfig.__executeServer(opts));
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
}).parse(d)).handler(saveCloudflareConfig_createServerFn_handler, async ({ data, context }) => {
	const { assertAnyPermission } = await import("./admin-users.server-Cj-VRRLO.js");
	await assertAnyPermission(context.supabase, context.userId, ["settings.manage"]);
	const { loadConfigAsCaller, maskConfig } = await import("./cloudflare.server-DZyDw2hX.js");
	const { error } = await context.supabase.rpc("cf_config_save", {
		_api_token: (data.api_token ?? "").trim(),
		_account_id: data.account_id.trim(),
		_zone_id: data.zone_id.trim(),
		_zone_name: data.zone_name.trim(),
		_worker_name: data.worker_name.trim(),
		_cname_target: data.cname_target.trim(),
		_a_record_ip: data.a_record_ip.trim(),
		_auto_worker_domain: data.auto_worker_domain,
		_is_active: data.is_active,
		_mode: data.mode,
		_server_a_ip: data.server_a_ip.trim(),
		_server_cname: data.server_cname.trim(),
		_server_note: data.server_note.trim(),
		_dns_active: data.dns_active
	});
	if (error) throw new Response(error.message, { status: 400 });
	return maskConfig(await loadConfigAsCaller(context.supabase));
});
var testCloudflareConfig_createServerFn_handler = createServerRpc({
	id: "f7d2b7addd0fda66bd511042fa2856a7a8ca6d28c6b804821ec09834178fc07d",
	name: "testCloudflareConfig",
	filename: "src/lib/cloudflare.functions.ts"
}, (opts) => testCloudflareConfig.__executeServer(opts));
var testCloudflareConfig = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(testCloudflareConfig_createServerFn_handler, async ({ context }) => {
	const { assertAnyPermission } = await import("./admin-users.server-Cj-VRRLO.js");
	await assertAnyPermission(context.supabase, context.userId, ["settings.manage"]);
	const { loadConfigAsCaller, requireActiveConfig, verifyToken } = await import("./cloudflare.server-DZyDw2hX.js");
	const conf = await loadConfigAsCaller(context.supabase);
	if (!conf.api_token) throw new Response("Save an API token first", { status: 400 });
	requireActiveConfig({
		...conf,
		is_active: true
	});
	return verifyToken(conf);
});
var getDnsGuide_createServerFn_handler = createServerRpc({
	id: "aacdf5781b98bc48cc6a146e3461e151efb2f0722ac439a7ac3d790f5416c459",
	name: "getDnsGuide",
	filename: "src/lib/cloudflare.functions.ts"
}, (opts) => getDnsGuide.__executeServer(opts));
var getDnsGuide = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => d ?? {}).handler(getDnsGuide_createServerFn_handler, async ({ context }) => {
	const { loadDnsGuideAsCaller } = await import("./cloudflare.server-DZyDw2hX.js");
	return loadDnsGuideAsCaller(context.supabase);
});
async function isAdmin(ctx) {
	const { data } = await ctx.supabase.rpc("has_any_permission", {
		_user_id: ctx.userId,
		_permissions: ["settings.manage", "resellers.manage"]
	});
	return !!data;
}
/** Which reseller the caller may act on. */
async function resolveReseller(ctx, resellerId) {
	if (resellerId) {
		const { data: rRow } = await ctx.supabase.from("resellers").select("id, user_id").eq("id", resellerId).maybeSingle();
		if (rRow && (rRow.id === ctx.userId || rRow.user_id === ctx.userId || await isAdmin(ctx))) return rRow.id;
	}
	const { data: own } = await ctx.supabase.from("resellers").select("id, user_id").or(`user_id.eq.${ctx.userId},id.eq.${ctx.userId}`).maybeSingle();
	if (own?.id) return own.id;
	const { data: byUser } = await ctx.supabase.from("resellers").select("id").eq("user_id", ctx.userId).maybeSingle();
	if (byUser?.id) return byUser.id;
	const { data: byId } = await ctx.supabase.from("resellers").select("id").eq("id", ctx.userId).maybeSingle();
	if (byId?.id) return byId.id;
	const { data: first } = await ctx.supabase.from("resellers").select("id").limit(1).maybeSingle();
	if (first?.id) return first.id;
	return ctx.userId || "reseller-1";
}
async function loadDomainForCaller(ctx, id) {
	const { data: row, error } = await ctx.supabase.from("reseller_domains").select("*").eq("id", id).maybeSingle();
	if (error) throw new Response(error.message, { status: 400 });
	if (!row) throw new Response("Domain not found", { status: 404 });
	const { data: own } = await ctx.supabase.from("resellers").select("id, user_id").or(`user_id.eq.${ctx.userId},id.eq.${ctx.userId}`).maybeSingle();
	if (!(own && (own.id === row.reseller_id || own.user_id === row.reseller_id) || row.reseller_id === ctx.userId) && !await isAdmin(ctx)) throw new Response("Forbidden", { status: 403 });
	return row;
}
function mapRow(row, reseller) {
	return {
		id: row.id,
		mode: row.mode === "dns" ? "dns" : "cloudflare",
		reseller_id: row.reseller_id,
		reseller_name: reseller?.business_name ?? null,
		reseller_code: reseller?.code ?? null,
		hostname: row.hostname,
		is_primary: !!row.is_primary,
		ssl_status: row.ssl_status,
		ownership_status: row.ownership_status ?? null,
		dns_target: row.dns_target ?? null,
		verification_txt_name: row.verification_txt_name ?? null,
		verification_txt_value: row.verification_txt_value ?? null,
		cloudflare_hostname_id: row.cloudflare_hostname_id ?? null,
		worker_domain_id: row.worker_domain_id ?? null,
		last_error: row.last_error ?? null,
		last_checked_at: row.last_checked_at ?? null,
		verified_at: row.verified_at ?? null,
		created_at: row.created_at
	};
}
/** Domains of one reseller (self) or, for admins, of everyone. */
var listDomains_createServerFn_handler = createServerRpc({
	id: "aa38052ba1ea57d4f2ebac1ba15438d82f607703322e9bb22a67a0a40503254f",
	name: "listDomains",
	filename: "src/lib/cloudflare.functions.ts"
}, (opts) => listDomains.__executeServer(opts));
var listDomains = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	resellerId: stringType().optional(),
	all: booleanType().optional()
}).parse(d ?? {})).handler(listDomains_createServerFn_handler, async ({ data, context }) => {
	const ctx = {
		supabase: context.supabase,
		userId: context.userId
	};
	const db = context.supabase;
	let query = db.from("reseller_domains").select("*").order("created_at");
	if (data.all) {
		if (!await isAdmin(ctx)) throw new Response("Forbidden", { status: 403 });
	} else query = query.eq("reseller_id", await resolveReseller(ctx, data.resellerId));
	const { data: rows, error } = await query;
	if (error) throw new Response(error.message, { status: 400 });
	const ids = [...new Set((rows ?? []).map((r) => r.reseller_id))];
	const { data: resellers } = ids.length ? await db.from("resellers").select("id, business_name, code").in("id", ids) : { data: [] };
	const byId = new Map((resellers ?? []).map((r) => [r.id, r]));
	return (rows ?? []).map((r) => mapRow(r, byId.get(r.reseller_id)));
});
var connectDomain_createServerFn_handler = createServerRpc({
	id: "1de17cc7f2793b21d06ee002aa5a238c2432ea1923fa9fc2527bf6ead15ef408",
	name: "connectDomain",
	filename: "src/lib/cloudflare.functions.ts"
}, (opts) => connectDomain.__executeServer(opts));
var connectDomain = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	hostname: stringType().max(300),
	resellerId: stringType().optional(),
	mode: enumType(["cloudflare", "dns"]).default("cloudflare")
}).parse(d)).handler(connectDomain_createServerFn_handler, async ({ data, context }) => {
	const cf = await import("./cloudflare.server-DZyDw2hX.js");
	const ctx = {
		supabase: context.supabase,
		userId: context.userId
	};
	const db = context.supabase;
	const resellerId = await resolveReseller(ctx, data.resellerId);
	const hostname = cf.normalizeHostname(data.hostname);
	const { data: dupe } = await db.from("reseller_domains").select("id, reseller_id").eq("hostname", hostname).maybeSingle();
	if (dupe) throw new Response("This domain is already connected", { status: 400 });
	const { count } = await db.from("reseller_domains").select("id", {
		count: "exact",
		head: true
	}).eq("reseller_id", resellerId);
	const isPrimary = (count ?? 0) === 0;
	if (data.mode === "dns") {
		const conf = cf.requireDnsConfig(await cf.loadConfigFlexible(db));
		const { data: row, error } = await db.from("reseller_domains").insert({
			reseller_id: resellerId,
			hostname,
			mode: "dns",
			is_primary: isPrimary,
			ssl_status: "pending",
			ownership_status: "dns_pending",
			dns_target: cf.dnsTargetFor(conf),
			last_checked_at: (/* @__PURE__ */ new Date()).toISOString(),
			last_error: null
		}).select("*").single();
		if (error) {
			const dup = error.code === "23505";
			throw new Response(dup ? "This domain is already connected" : error.message, { status: 400 });
		}
		return mapRow(row);
	}
	const conf = cf.requireActiveConfig(await cf.loadConfigFlexible(db));
	const state = await cf.createCustomHostname(conf, hostname);
	let workerDomainId = null;
	try {
		workerDomainId = await cf.attachWorkerDomain(conf, hostname);
	} catch (err) {
		console.error("worker domain attach failed", err);
	}
	const { data: row, error } = await db.from("reseller_domains").insert({
		reseller_id: resellerId,
		hostname,
		mode: "cloudflare",
		is_primary: isPrimary,
		ssl_status: state.sslStatus,
		ownership_status: state.ownershipStatus,
		cloudflare_hostname_id: state.id,
		worker_domain_id: workerDomainId,
		dns_target: state.dnsTarget,
		verification_txt_name: state.txtName,
		verification_txt_value: state.txtValue,
		verified_at: state.active ? (/* @__PURE__ */ new Date()).toISOString() : null,
		last_checked_at: (/* @__PURE__ */ new Date()).toISOString(),
		last_error: null
	}).select("*").single();
	if (error) {
		await cf.deleteCustomHostname(conf, state.id);
		const dup = error.code === "23505";
		throw new Response(dup ? "This domain is already connected" : error.message, { status: 400 });
	}
	return mapRow(row);
});
var refreshDomain_createServerFn_handler = createServerRpc({
	id: "2d5e71d3e2ba36243c3b1a733b0fe4b540d79894c95517bfe0f13a6928e404ab",
	name: "refreshDomain",
	filename: "src/lib/cloudflare.functions.ts"
}, (opts) => refreshDomain.__executeServer(opts));
var refreshDomain = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().min(1) }).parse(d)).handler(refreshDomain_createServerFn_handler, async ({ data, context }) => {
	const cf = await import("./cloudflare.server-DZyDw2hX.js");
	const db = context.supabase;
	const row = await loadDomainForCaller({
		supabase: context.supabase,
		userId: context.userId
	}, data.id);
	if (row.mode === "dns") {
		const conf = cf.requireDnsConfig(await cf.loadConfigFlexible(db));
		const { ok, answers } = await cf.checkDnsPointing(conf, row.hostname);
		const { data: updated, error } = await db.from("reseller_domains").update({
			dns_target: cf.dnsTargetFor(conf),
			ssl_status: ok ? "active" : "pending",
			ownership_status: ok ? "active" : "dns_pending",
			verified_at: ok ? row.verified_at ?? (/* @__PURE__ */ new Date()).toISOString() : null,
			last_checked_at: (/* @__PURE__ */ new Date()).toISOString(),
			last_error: ok ? null : `DNS is not pointing here yet${answers.length ? ` (found: ${answers.slice(0, 3).join(", ")})` : ""}`
		}).eq("id", row.id).select("*").single();
		if (error) throw new Response(error.message, { status: 400 });
		return mapRow(updated);
	}
	const conf = cf.requireActiveConfig(await cf.loadConfigFlexible(db));
	let state;
	try {
		state = row.cloudflare_hostname_id ? await cf.getCustomHostname(conf, row.cloudflare_hostname_id) : await cf.createCustomHostname(conf, row.hostname);
	} catch (err) {
		const message = err instanceof Response ? await err.clone().text() : String(err);
		await db.from("reseller_domains").update({
			last_error: message.slice(0, 500),
			last_checked_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", row.id);
		throw err;
	}
	const { data: updated, error } = await db.from("reseller_domains").update({
		cloudflare_hostname_id: state.id,
		ssl_status: state.sslStatus,
		ownership_status: state.ownershipStatus,
		dns_target: state.dnsTarget,
		verification_txt_name: state.txtName,
		verification_txt_value: state.txtValue,
		verified_at: state.active ? row.verified_at ?? (/* @__PURE__ */ new Date()).toISOString() : null,
		last_checked_at: (/* @__PURE__ */ new Date()).toISOString(),
		last_error: null
	}).eq("id", row.id).select("*").single();
	if (error) throw new Response(error.message, { status: 400 });
	return mapRow(updated);
});
var setPrimaryDomain_createServerFn_handler = createServerRpc({
	id: "faaa580fd4cb98d1b12ecb9e0bb7a060ab3975a86f23abb9e6be865e25d51865",
	name: "setPrimaryDomain",
	filename: "src/lib/cloudflare.functions.ts"
}, (opts) => setPrimaryDomain.__executeServer(opts));
var setPrimaryDomain = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().min(1) }).parse(d)).handler(setPrimaryDomain_createServerFn_handler, async ({ data, context }) => {
	const db = context.supabase;
	const row = await loadDomainForCaller({
		supabase: context.supabase,
		userId: context.userId
	}, data.id);
	await db.from("reseller_domains").update({ is_primary: false }).eq("reseller_id", row.reseller_id);
	const { error } = await db.from("reseller_domains").update({ is_primary: true }).eq("id", row.id);
	if (error) throw new Response(error.message, { status: 400 });
	return { ok: true };
});
var disconnectDomain_createServerFn_handler = createServerRpc({
	id: "d5dc6b97d303a369fb80b25d5071fcb7fc72bcb783d35eb1004728e1efbb00d5",
	name: "disconnectDomain",
	filename: "src/lib/cloudflare.functions.ts"
}, (opts) => disconnectDomain.__executeServer(opts));
var disconnectDomain = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().min(1) }).parse(d)).handler(disconnectDomain_createServerFn_handler, async ({ data, context }) => {
	const cf = await import("./cloudflare.server-DZyDw2hX.js");
	const db = context.supabase;
	const row = await loadDomainForCaller({
		supabase: context.supabase,
		userId: context.userId
	}, data.id);
	const conf = await cf.loadConfigFlexible(db);
	if (row.mode !== "dns" && conf.api_token && conf.zone_id && row.cloudflare_hostname_id) await cf.deleteCustomHostname(conf, row.cloudflare_hostname_id);
	if (row.mode !== "dns" && conf.api_token && row.worker_domain_id) await cf.detachWorkerDomain(conf, row.worker_domain_id);
	const { error } = await db.from("reseller_domains").delete().eq("id", row.id);
	if (error) throw new Response(error.message, { status: 400 });
	const { data: rest } = await db.from("reseller_domains").select("id, is_primary").eq("reseller_id", row.reseller_id).order("created_at");
	if ((rest ?? []).length > 0 && !(rest ?? []).some((r) => r.is_primary)) await db.from("reseller_domains").update({ is_primary: true }).eq("id", rest[0].id);
	return { ok: true };
});
function cleanHost(raw) {
	return raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
}
var getPlatformOrigins_createServerFn_handler = createServerRpc({
	id: "5154d03a6ed76df0f43dc14445a211249a07639dedc8c8bfd9f4261231ef73c0",
	name: "getPlatformOrigins",
	filename: "src/lib/cloudflare.functions.ts"
}, (opts) => getPlatformOrigins.__executeServer(opts));
var getPlatformOrigins = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getPlatformOrigins_createServerFn_handler, async ({ context }) => {
	const { assertAnyPermission } = await import("./admin-users.server-Cj-VRRLO.js");
	await assertAnyPermission(context.supabase, context.userId, ["settings.manage"]);
	const { data } = await context.supabase.from("global_settings").select("allowed_origins, callback_base_url").eq("id", 1).maybeSingle();
	return {
		allowed_origins: data?.allowed_origins ?? [],
		callback_base_url: String(data?.callback_base_url ?? "")
	};
});
var savePlatformOrigins_createServerFn_handler = createServerRpc({
	id: "b2f365d22f7d0d90f0f364eff697e0e33d81d572fbef647481171a0b6069cc9d",
	name: "savePlatformOrigins",
	filename: "src/lib/cloudflare.functions.ts"
}, (opts) => savePlatformOrigins.__executeServer(opts));
var savePlatformOrigins = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	allowed_origins: arrayType(stringType().max(253)).max(50).default([]),
	callback_base_url: stringType().max(253).default("")
}).parse(d)).handler(savePlatformOrigins_createServerFn_handler, async ({ data, context }) => {
	const { assertAnyPermission } = await import("./admin-users.server-Cj-VRRLO.js");
	await assertAnyPermission(context.supabase, context.userId, ["settings.manage"]);
	const hosts = Array.from(new Set(data.allowed_origins.map(cleanHost).filter(Boolean)));
	const callback = data.callback_base_url.trim().replace(/\/+$/, "");
	const { error } = await context.supabase.from("global_settings").update({
		allowed_origins: hosts,
		callback_base_url: callback || null
	}).eq("id", 1);
	if (error) throw new Response(error.message, { status: 400 });
	return {
		allowed_origins: hosts,
		callback_base_url: callback
	};
});
//#endregion
export { connectDomain_createServerFn_handler, disconnectDomain_createServerFn_handler, getCloudflareConfig_createServerFn_handler, getDnsGuide_createServerFn_handler, getPlatformOrigins_createServerFn_handler, listDomains_createServerFn_handler, refreshDomain_createServerFn_handler, saveCloudflareConfig_createServerFn_handler, savePlatformOrigins_createServerFn_handler, setPrimaryDomain_createServerFn_handler, testCloudflareConfig_createServerFn_handler };
