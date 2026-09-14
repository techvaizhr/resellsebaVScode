import { t as getRequest } from "./request-response-BEPp1C2k.js";
import { r as supabase } from "./client-Be051lUg.js";
//#region src/lib/gateways/bridge.server.ts
/** True when this request runs somewhere the privileged backend key exists. */
function hasPrivilegedDb() {
	return true;
}
function publicDb() {
	return supabase;
}
/**
* The origin that owns the privileged backend binding — gateways are pointed at
* it for return/IPN callbacks, and custom-domain requests forward to it.
* Falls back to the current origin when unset.
*/
async function platformOrigin(fallback) {
	const db = publicDb();
	if (!db) return fallback;
	try {
		const { data } = await db.from("global_settings").select("callback_base_url").eq("id", 1).maybeSingle();
		return String(data?.callback_base_url ?? "").trim().replace(/\/+$/, "") || fallback;
	} catch {
		return fallback;
	}
}
/** Forward one payment operation to the platform origin and return its JSON. */
async function forwardToPlatform(op, payload, authorization) {
	const { siteOrigin } = await import("./core.server-sml6MNVz.js");
	const here = siteOrigin();
	const base = await platformOrigin("");
	if (!base || base === here) throw new Response("Online payments are not configured for this domain yet. Please set the payment callback address in settings.", { status: 503 });
	const res = await fetch(`${base}/api/public/payment/bridge`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			...authorization ? { authorization } : {}
		},
		body: JSON.stringify({
			op,
			...payload,
			origin: payload["origin"] || here
		})
	});
	const text = await res.text();
	if (!res.ok) {
		let message = text;
		try {
			message = JSON.parse(text).error ?? text;
		} catch {}
		throw new Response(message || "Payment could not be started", { status: res.status });
	}
	return JSON.parse(text);
}
/** The caller's bearer token, so a forwarded request keeps the same identity. */
function incomingAuthorization() {
	try {
		return getRequest()?.headers.get("authorization") ?? null;
	} catch {
		return null;
	}
}
//#endregion
export { forwardToPlatform, hasPrivilegedDb, incomingAuthorization, platformOrigin };
