import { u as api } from "./client-BAn7XKYw.js";
import { m as setGlobalDelivery, u as mergeDeliverySettings } from "./delivery-DY_nRbFK.js";
import { t as applyPlatformBranding } from "./platform-branding-DO8pd0Ly.js";
import { a as primeMyReseller, i as primeGlobalSettings } from "./app-data-DrOhMwcy.js";
//#region src/lib/bootstrap.ts
/**
* Page bootstrap cache.
*
* Every public/panel page loads its data from ONE database function call
* (`*_bootstrap` / `*_page`) instead of a fan-out of table queries. The result
* is memoised per session key so navigating back to a page costs zero requests.
*
* Nothing here is hardcoded: the backend URL/keys come from env through the
* generated client, so pointing the project at another (self-hosted) backend
* needs no code change.
*/
var cache = /* @__PURE__ */ new Map();
/** When a fresh load was started moments ago, a second mount reuses it instead of refetching. */
var started = /* @__PURE__ */ new Map();
var COALESCE_MS = 1500;
function once(key, run, force = false) {
	const hit = cache.get(key);
	if (force) {
		const age = Date.now() - (started.get(key) ?? 0);
		if (hit && age < COALESCE_MS) return hit;
		cache.delete(key);
	} else if (hit) return hit;
	started.set(key, Date.now());
	const p = run().catch((e) => {
		cache.delete(key);
		throw e;
	});
	cache.set(key, p);
	return p;
}
/** Share one in-flight/last payload across remounts for arbitrary loaders. */
function sharedLoad(key, run, force = false) {
	return once(key, run, force);
}
/** Drop cached page payloads (all, or every key starting with `prefix`). */
function clearBootstrapCache(prefix) {
	if (!prefix) return cache.clear();
	for (const k of [...cache.keys()]) if (k.startsWith(prefix)) cache.delete(k);
}
async function rpc(name, args) {
	try {
		return await api.post(`/rpc/${name}`, args) ?? null;
	} catch (error) {
		console.error(`[bootstrap] ${name} failed`, error?.message || error);
		return null;
	}
}
/** Landing page: branding + content + stats + categories + products in one call. */
function getLpBootstrap(host, force = false) {
	return once(`lp:${host}`, async () => {
		const data = await rpc("lp_bootstrap", { _host: host || null });
		applyPlatformBranding(data?.settings);
		return data;
	}, force);
}
/** Storefront: settings + listings + categories + menu + delivery rule in one call. */
function getStoreBootstrap(code, force = false) {
	return once(`store:${code}`, async () => {
		const data = await rpc("store_bootstrap", { _code: code });
		if (data) {
			setGlobalDelivery(mergeDeliverySettings(data.delivery));
			primeGlobalSettings(data.settings);
		}
		return data;
	}, force);
}
/** Reseller dashboard: reseller + orders + items + payouts + commissions + listings in one call. */
function getResellerDashboard(userId, fromTs, toTs, force = false) {
	return once(`rdash:${fromTs ?? ""}:${toTs ?? ""}`, async () => {
		const data = await rpc("reseller_dashboard", {
			_from: fromTs != null ? new Date(fromTs).toISOString() : null,
			_to: toTs != null ? new Date(toTs).toISOString() : null
		});
		primeMyReseller(userId, data?.reseller ?? null);
		return data;
	}, force);
}
/** Admin dashboard: range orders + lifetime orders + catalog/reseller/payout aggregates in one call. */
function getAdminDashboard(fromTs, toTs, force = false) {
	return once(`adash:${fromTs ?? ""}:${toTs ?? ""}`, () => rpc("admin_dashboard", {
		_from: fromTs != null ? new Date(fromTs).toISOString() : null,
		_to: toTs != null ? new Date(toTs).toISOString() : null
	}), force);
}
/** Admin pickers (Add Order modal): resellers + active products, cached per session. */
function getAdminLookups(force = false) {
	return once("alookups", () => rpc("admin_lookups", {}), force);
}
//#endregion
export { getResellerDashboard as a, getLpBootstrap as i, getAdminDashboard as n, getStoreBootstrap as o, getAdminLookups as r, sharedLoad as s, clearBootstrapCache as t };
