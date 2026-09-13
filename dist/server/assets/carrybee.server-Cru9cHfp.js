//#region src/lib/carrybee.server.ts
var CARRYBEE_PRODUCTION_URL = "https://developers.carrybee.com";
function carrybeeBase(_conf) {
	return CARRYBEE_PRODUCTION_URL;
}
function carrybeeHeaders(conf) {
	if (!conf.client_id || !conf.client_secret || !conf.client_context) throw new Response("Missing Carrybee credentials (Client-ID / Secret / Context)", { status: 400 });
	return {
		"Client-ID": conf.client_id,
		"Client-Secret": conf.client_secret,
		"Client-Context": conf.client_context,
		"Content-Type": "application/json",
		Accept: "application/json"
	};
}
async function carrybeeRequest(conf, path, init) {
	const res = await fetch(`${carrybeeBase(conf)}${path}`, {
		...init,
		headers: {
			...carrybeeHeaders(conf),
			...init?.headers ?? {}
		}
	});
	const text = await res.text();
	let body = {};
	try {
		body = text ? JSON.parse(text) : {};
	} catch {
		body = { raw: text };
	}
	if (!res.ok || body?.error === true) {
		const causes = body?.causes ? ` ${JSON.stringify(body.causes)}` : "";
		console.error(`Carrybee ${path} failed [${res.status}]: ${text}`);
		throw new Response(`${body?.message || `Carrybee request failed (${res.status})`}${causes}`, { status: res.ok ? 400 : 502 });
	}
	return body;
}
/** Resolve a free-text address into Carrybee city/zone/area ids. */
async function carrybeeResolveLocation(conf, args) {
	const query = [args.address, args.city].filter(Boolean).join(", ");
	if (query.trim().length >= 10) try {
		const body = await carrybeeRequest(conf, "/api/v2/address-details", {
			method: "POST",
			body: JSON.stringify({ query: query.trim().slice(0, 200) })
		});
		const cityId = Number(body?.data?.city_id ?? 0);
		const zoneId = Number(body?.data?.zone_id ?? 0);
		if (cityId && zoneId) return {
			cityId,
			zoneId,
			areaId: null
		};
	} catch {}
	const search = (args.city || args.address || "").trim().slice(0, 60);
	if (search.length >= 3) {
		const first = ((await carrybeeRequest(conf, `/api/v2/area-suggestion?search=${encodeURIComponent(search)}`))?.data?.items ?? [])[0];
		if (first?.city_id && first?.zone_id) return {
			cityId: Number(first.city_id),
			zoneId: Number(first.zone_id),
			areaId: first.area_id ? Number(first.area_id) : null
		};
	}
	throw new Response("Carrybee city/zone resolve korte parlam na — address ta detail dorkar", { status: 400 });
}
//#endregion
export { carrybeeRequest, carrybeeResolveLocation };
