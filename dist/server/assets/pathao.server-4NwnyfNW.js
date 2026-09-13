//#region src/lib/pathao.server.ts
/** Pathao Courier Merchant API — production only (same policy as Steadfast/Carrybee). */
var PATHAO_PRODUCTION_URL = "https://api-hermes.pathao.com";
function pathaoBase(_conf) {
	return PATHAO_PRODUCTION_URL;
}
var lastTokenError = "";
async function issueToken(conf, body) {
	const res = await fetch(`${pathaoBase(conf)}/aladdin/api/v1/issue-token`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(body)
	});
	const text = await res.text();
	let parsed = {};
	try {
		parsed = text ? JSON.parse(text) : {};
	} catch {
		parsed = { raw: text };
	}
	if (!res.ok || !parsed?.access_token) {
		console.error(`Pathao issue-token failed [${res.status}]: ${text}`);
		lastTokenError = String(parsed?.message ?? text ?? "").slice(0, 200);
		return {};
	}
	return parsed;
}
/**
* Get a valid Pathao access token. The token (and refresh token) is persisted in
* `courier_configs.config` so it is reused across requests; it is refreshed with
* the refresh_token grant and only falls back to a full password grant.
*/
async function pathaoAccessToken(db, conf) {
	const { client_id, client_secret, username, password } = conf;
	if (!client_id || !client_secret || !username || !password) throw new Response("Missing Pathao credentials (Client ID / Secret / Username / Password)", { status: 400 });
	const expiresAt = Number(conf.token_expires_at ?? 0);
	if (conf.access_token && expiresAt > Date.now() + 300 * 1e3) return conf.access_token;
	let token = {};
	if (conf.refresh_token) token = await issueToken(conf, {
		client_id,
		client_secret,
		grant_type: "refresh_token",
		refresh_token: conf.refresh_token
	});
	if (!token.access_token) token = await issueToken(conf, {
		client_id,
		client_secret,
		grant_type: "password",
		username,
		password
	});
	if (!token.access_token) throw new Response(`Pathao auth failed: ${lastTokenError || "check Client ID/Secret/Username/Password"}`, { status: 400 });
	const nextConfig = {
		...conf,
		access_token: token.access_token,
		refresh_token: token.refresh_token ?? conf.refresh_token ?? "",
		token_expires_at: String(Date.now() + Number(token.expires_in ?? 432e3) * 1e3)
	};
	await db.from("courier_configs").update({ config: nextConfig }).eq("provider", "pathao");
	conf.access_token = nextConfig.access_token;
	conf.refresh_token = nextConfig.refresh_token;
	conf.token_expires_at = nextConfig.token_expires_at;
	return token.access_token;
}
async function pathaoRequest(db, conf, path, init) {
	let token = await pathaoAccessToken(db, conf);
	let res = await fetch(`${pathaoBase(conf)}${path}`, {
		...init,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json; charset=UTF-8",
			Accept: "application/json",
			...init?.headers ?? {}
		}
	});
	if (res.status === 401) {
		conf.access_token = "";
		conf.token_expires_at = "0";
		token = await pathaoAccessToken(db, conf);
		res = await fetch(`${pathaoBase(conf)}${path}`, {
			...init,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json; charset=UTF-8",
				Accept: "application/json",
				...init?.headers ?? {}
			}
		});
	}
	const text = await res.text();
	let body = {};
	try {
		body = text ? JSON.parse(text) : {};
	} catch {
		body = { raw: text };
	}
	if (!res.ok) {
		console.error(`Pathao ${path} failed [${res.status}]: ${text}`);
		const errors = body?.errors ? ` ${JSON.stringify(body.errors)}` : "";
		throw new Response(`${body?.message || `Pathao request failed (${res.status})`}${errors}`, { status: res.status === 422 || res.status === 400 ? 400 : 502 });
	}
	return body;
}
/** Merchant stores (store_id needed for booking). */
async function pathaoStoreList(db, conf) {
	const seen = /* @__PURE__ */ new Map();
	for (let page = 1; page <= 10; page++) {
		const body = await pathaoRequest(db, conf, `/aladdin/api/v1/stores?page=${page}`);
		const raw = Array.isArray(body?.data?.data) ? body.data.data : Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
		for (const s of raw) {
			const id = String(s.store_id ?? s.id ?? "");
			if (!id || seen.has(id)) continue;
			seen.set(id, {
				id,
				name: String(s.store_name ?? s.name ?? `Store ${id}`),
				address: String(s.store_address ?? s.address ?? ""),
				isActive: Number(s.is_active ?? 1) === 1,
				cityId: s.city_id ? Number(s.city_id) : null,
				zoneId: s.zone_id ? Number(s.zone_id) : null
			});
		}
		const lastPage = Number(body?.data?.last_page ?? body?.data?.total_pages ?? 1);
		if (raw.length === 0 || page >= lastPage) break;
	}
	return [...seen.values()];
}
/** Price plan for a parcel (used to preview delivery fee before booking). */
async function pathaoPricePlanRequest(db, conf, args) {
	const d = (await pathaoRequest(db, conf, "/aladdin/api/v1/merchant/price-plan", {
		method: "POST",
		body: JSON.stringify({
			store_id: String(args.storeId),
			item_type: 2,
			delivery_type: args.deliveryType ?? 48,
			item_weight: args.itemWeight ?? .5,
			recipient_city: args.cityId,
			recipient_zone: args.zoneId
		})
	}))?.data ?? {};
	return {
		price: Number(d.price ?? 0),
		discount: Number(d.discount ?? 0),
		codPercentage: Number(d.cod_percentage ?? 0),
		additionalCharge: Number(d.additional_charge ?? 0),
		finalPrice: Number(d.final_price ?? d.price ?? 0)
	};
}
/** Short info for a consignment — used by manual status sync. */
async function pathaoOrderInfo(db, conf, consignmentId) {
	const d = (await pathaoRequest(db, conf, `/aladdin/api/v1/orders/${encodeURIComponent(consignmentId)}/info`))?.data ?? {};
	return {
		consignmentId: String(d.consignment_id ?? consignmentId),
		merchantOrderId: d.merchant_order_id ? String(d.merchant_order_id) : null,
		status: String(d.order_status_slug ?? d.order_status ?? "unknown"),
		invoiceId: d.invoice_id ? String(d.invoice_id) : null,
		updatedAt: d.updated_at ? String(d.updated_at) : null
	};
}
//#endregion
export { pathaoOrderInfo, pathaoPricePlanRequest, pathaoRequest, pathaoStoreList };
