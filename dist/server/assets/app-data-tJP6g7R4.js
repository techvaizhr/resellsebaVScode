import { r as supabase } from "./client-CdRSQB5v.js";
import { m as setGlobalDelivery, u as mergeDeliverySettings } from "./delivery-DY_nRbFK.js";
import { t as applyPlatformBranding } from "./platform-branding-rd6YH8OY.js";
import { a as waitForPanelBootstrap } from "./panel-bootstrap-BcAwhCIE.js";
import "react";
//#region src/lib/app-data.ts
var settingsPromise = null;
var resellerPromise = null;
var resellerForUser = null;
/**
* Seeds the settings cache from a page bootstrap payload that already carries
* the row — so `getGlobalSettings()` callers on that page cost no request.
*/
function primeGlobalSettings(data) {
	if (!data) return;
	const s = data;
	settingsPromise = Promise.resolve(s);
	setGlobalDelivery(mergeDeliverySettings(s?.advanced_settings?.delivery));
	applyPlatformBranding(s);
}
/** One `global_settings` read per session (shared by every caller). */
function getGlobalSettings(force = false) {
	if (force) settingsPromise = null;
	let p = settingsPromise;
	if (!p) {
		p = (async () => {
			try {
				await waitForPanelBootstrap();
				if (settingsPromise && settingsPromise !== p) return settingsPromise;
				const { data } = await supabase.from("global_settings").select("*").eq("id", 1).maybeSingle();
				setGlobalDelivery(mergeDeliverySettings(data?.advanced_settings?.delivery));
				applyPlatformBranding(data);
				return data ?? null;
			} catch {
				return null;
			}
		})();
		settingsPromise = p;
	}
	return p;
}
/** Seeds the reseller cache from a page bootstrap payload (no extra request). */
function primeMyReseller(userId, row) {
	if (!row) return;
	resellerForUser = userId ?? resellerForUser;
	resellerPromise = Promise.resolve(row);
}
/** One `resellers` lookup per signed-in user (shared by every reseller screen). */
function getMyReseller(userId, force = false) {
	if (force || userId && resellerForUser && resellerForUser !== userId) resellerPromise = null;
	let p = resellerPromise;
	if (!p) {
		resellerForUser = userId ?? null;
		p = (async () => {
			try {
				await waitForPanelBootstrap();
				if (resellerPromise && resellerPromise !== p) return resellerPromise;
				let uid = userId ?? null;
				if (!uid) uid = (await supabase.auth.getUser()).data.user?.id ?? null;
				if (!uid) return null;
				resellerForUser = uid;
				const { data } = await supabase.from("resellers").select("id, code, business_name, status, avatar_url").eq("user_id", uid).maybeSingle();
				return data ?? null;
			} catch {
				return null;
			}
		})();
		resellerPromise = p;
	}
	return p;
}
/** Drop caches — call after sign-in/out or after saving settings. */
function clearAppDataCache(scope = "all") {
	if (scope === "all" || scope === "settings") settingsPromise = null;
	if (scope === "all" || scope === "reseller") {
		resellerPromise = null;
		resellerForUser = null;
	}
}
//#endregion
export { primeMyReseller as a, primeGlobalSettings as i, getGlobalSettings as n, getMyReseller as r, clearAppDataCache as t };
