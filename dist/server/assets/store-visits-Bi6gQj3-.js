import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { r as supabase } from "./client-BZQd8T2B.js";
//#region src/lib/store-visits.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var SESSION_STORAGE_KEY = "sv_session";
/** Same path is not re-logged within this window (protects the API from bursts). */
var PATH_THROTTLE_MS = 3e4;
var lastLogged = /* @__PURE__ */ new Map();
function sessionKey() {
	try {
		const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
		if (existing) return existing;
		const fresh = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).replace(/-/g, "").slice(0, 32);
		sessionStorage.setItem(SESSION_STORAGE_KEY, fresh);
		return fresh;
	} catch {
		return "";
	}
}
function deviceKind() {
	if (typeof window === "undefined") return "desktop";
	const w = window.innerWidth;
	if (w < 640) return "mobile";
	if (w < 1024) return "tablet";
	return "desktop";
}
/** Logs one storefront pageview per path (throttled), skipping panel previews. */
function useStoreVisitLog(code, path, skip) {
	(0, import_react.useEffect)(() => {
		if (!code || skip) return;
		const key = `${code}${path}`;
		const now = Date.now();
		if (now - (lastLogged.get(key) ?? 0) < PATH_THROTTLE_MS) return;
		lastLogged.set(key, now);
		const sk = sessionKey();
		if (!sk) return;
		const timer = window.setTimeout(() => {
			supabase.rpc("log_store_visit", {
				_code: code,
				_path: path,
				_referrer: document.referrer || "",
				_session_key: sk,
				_device: deviceKind()
			}).then(() => {}, () => {});
		}, 800);
		return () => window.clearTimeout(timer);
	}, [
		code,
		path,
		skip
	]);
}
var VISIT_RANGES = [
	{
		id: "today",
		label: "Today"
	},
	{
		id: "yesterday",
		label: "Yesterday"
	},
	{
		id: "7d",
		label: "Last 7 days"
	},
	{
		id: "30d",
		label: "Last 30 days"
	}
];
function visitRangeBounds(range) {
	const start = /* @__PURE__ */ new Date();
	start.setHours(0, 0, 0, 0);
	const dayStart = start.getTime();
	const DAY = 864e5;
	switch (range) {
		case "today": return {
			from: new Date(dayStart).toISOString(),
			to: new Date(dayStart + DAY).toISOString()
		};
		case "yesterday": return {
			from: (/* @__PURE__ */ new Date(dayStart - DAY)).toISOString(),
			to: new Date(dayStart).toISOString()
		};
		case "7d": return {
			from: (/* @__PURE__ */ new Date(dayStart - 6 * DAY)).toISOString(),
			to: new Date(dayStart + DAY).toISOString()
		};
		default: return {
			from: (/* @__PURE__ */ new Date(dayStart - 29 * DAY)).toISOString(),
			to: new Date(dayStart + DAY).toISOString()
		};
	}
}
/** Live refresh cadence — only while the tab is visible and only on visitor pages. */
var LIVE_REFRESH_MS = 15e3;
function useLiveRefresh(onTick, enabled = true, intervalMs = LIVE_REFRESH_MS) {
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		let timer = 0;
		const tick = () => {
			if (document.visibilityState === "visible") onTick();
		};
		timer = window.setInterval(tick, intervalMs);
		const onVis = () => {
			if (document.visibilityState === "visible") onTick();
		};
		document.addEventListener("visibilitychange", onVis);
		return () => {
			window.clearInterval(timer);
			document.removeEventListener("visibilitychange", onVis);
		};
	}, [
		onTick,
		enabled,
		intervalMs
	]);
}
//#endregion
export { visitRangeBounds as a, useStoreVisitLog as i, VISIT_RANGES as n, useLiveRefresh as r, LIVE_REFRESH_MS as t };
