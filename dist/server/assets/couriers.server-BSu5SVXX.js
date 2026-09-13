import { c as normalizeCourierStatus, o as mapCourierStatus } from "./courier-status-BxiQVHJB.js";
//#region src/lib/couriers.server.ts
async function assertAdmin(supabase, userId) {
	const { data, error } = await supabase.rpc("has_any_permission", {
		_user_id: userId,
		_permissions: ["couriers.manage", "orders.edit"]
	});
	if (error || !data) throw new Response("Forbidden", { status: 403 });
}
/**
* Booking access: admins/staff use their own (RLS-scoped) client.
* A supplier that owns items in the order books through the privileged client,
* since suppliers have no direct row access to orders/shipments.
*/
async function courierActorClient(userClient, userId, orderId) {
	const { data: allowed } = await userClient.rpc("has_any_permission", {
		_user_id: userId,
		_permissions: ["couriers.manage", "orders.edit"]
	});
	if (allowed) return userClient;
	const { data: supplierOk } = await userClient.rpc("supplier_can_book_order", { _order: orderId });
	if (!supplierOk) throw new Response("Forbidden", { status: 403 });
	const { supabaseAdmin } = await import("./client.server-RstbviM8.js");
	return supabaseAdmin;
}
async function getCourierConfig(supabase, provider) {
	const { data: cfg } = await supabase.from("courier_configs").select("config, is_active").eq("provider", provider).maybeSingle();
	if (!cfg || !cfg.is_active) throw new Response(`${provider} not configured`, { status: 400 });
	return cfg.config ?? {};
}
/** Human readable name of a saved pickup store (multi-store setups). */
function courierStoreName(conf, storeId) {
	const id = storeId != null ? String(storeId) : "";
	if (!id) return null;
	try {
		const raw = conf.stores_json;
		const list = typeof raw === "string" ? JSON.parse(raw) : raw;
		if (!Array.isArray(list)) return null;
		const hit = list.find((s) => String(s?.id) === id);
		return hit?.name ? String(hit.name) : null;
	} catch {
		return null;
	}
}
/** Saved pickup stores of a provider (empty when never loaded). */
function savedCourierStores(conf) {
	try {
		const raw = conf.stores_json;
		const list = typeof raw === "string" ? JSON.parse(raw || "[]") : raw;
		if (!Array.isArray(list)) return [];
		return list.filter((s) => s && s.id != null && String(s.id) !== "").map((s) => ({
			id: String(s.id),
			name: String(s.name ?? s.id)
		}));
	} catch {
		return [];
	}
}
/**
* A pickup store can be deactivated or deleted from the courier's own panel at
* any time. Fail with a clear, actionable message instead of letting the
* provider API answer with a cryptic validation error.
*/
function assertCourierStore(conf, provider, storeId) {
	const id = String(storeId ?? "");
	const saved = savedCourierStores(conf);
	if (!id) throw new Response(`${provider} pickup store select korun`, { status: 400 });
	if (saved.length === 0) return;
	if (!saved.some((s) => s.id === id)) throw new Response(`Ei pickup store ta ${provider} panel e ar nei (inactive ba delete kora hoyeche). Admin → Couriers e "Load stores" chepe notun store select korun.`, { status: 400 });
}
/**
* Save a freshly loaded pickup-store list into courier_configs so booking can use
* it without the admin pressing Save (and it survives a page reload).
* Returns the default store id that ended up saved.
*/
async function persistCourierStores(db, provider, conf, stores) {
	const usable = stores.filter((s) => s.isActive !== false);
	const saved = usable.map((s) => ({
		id: String(s.id),
		name: String(s.name ?? s.id)
	}));
	const defaultStoreId = saved.some((s) => s.id === String(conf.store_id ?? "")) ? String(conf.store_id) : String(usable.find((s) => s.isDefaultPickup)?.id ?? saved[0]?.id ?? "");
	const nextConfig = {
		...conf,
		stores_json: JSON.stringify(saved),
		store_id: defaultStoreId
	};
	if (!defaultStoreId) delete nextConfig.store_id;
	await db.from("courier_configs").update({ config: nextConfig }).eq("provider", provider);
	return defaultStoreId;
}
function steadfastBase(conf) {
	return (conf.base_url || "https://portal.packzy.com/api/v1").replace(/\/+$/, "");
}
function steadfastHeaders(conf) {
	if (!conf.api_key || !conf.secret_key) throw new Response("Missing Steadfast credentials", { status: 400 });
	return {
		"Api-Key": conf.api_key,
		"Secret-Key": conf.secret_key,
		"Content-Type": "application/json",
		Accept: "application/json"
	};
}
async function steadfastRequest(conf, path, init) {
	const res = await fetch(`${steadfastBase(conf)}${path}`, {
		...init,
		headers: {
			...steadfastHeaders(conf),
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
	if (!res.ok) {
		console.error(`Steadfast ${path} failed [${res.status}]: ${text}`);
		throw new Response(body?.message || `Steadfast request failed (${res.status})`, { status: 502 });
	}
	return body;
}
async function getOrderForBooking(supabase, orderId) {
	const { data: order, error } = await supabase.from("orders").select("id, order_number, status, customer_name, customer_phone, address_line, city, area, landmark, total, payment_method, payment_status, advance_amount, advance_by, received_amount, notes, reseller_note").eq("id", orderId).maybeSingle();
	if (error || !order) throw new Response("Order not found", { status: 404 });
	return order;
}
function calculateCodAmount(order) {
	if (order.payment_status === "paid") return 0;
	if (order.payment_method && order.payment_method !== "cod") return 0;
	const total = Number(order.total || 0);
	const advance = Number(order.advance_amount || order.received_amount || 0);
	return Math.max(0, total - advance);
}
function normalizePhone(phone) {
	const digits = String(phone ?? "").replace(/\D/g, "");
	if (digits.length === 13 && digits.startsWith("880")) return digits.slice(2);
	if (digits.length === 10 && digits.startsWith("1")) return `0${digits}`;
	return digits;
}
function fullAddress(order) {
	return [
		order.address_line,
		order.landmark,
		order.city
	].map((p) => (p ?? "").trim()).filter(Boolean).join(", ").slice(0, 250);
}
/**
* Persist a courier status update: append a courier event, update the shipment
* and move the order status accordingly. Used by both manual sync and webhook.
*/
async function applyCourierUpdate(db, args) {
	let shipment = null;
	if (args.consignmentId) {
		const { data } = await db.from("shipments").select("id, order_id, provider").eq("consignment_id", String(args.consignmentId)).maybeSingle();
		shipment = data ?? null;
	}
	if (!shipment && args.trackingCode) {
		const { data } = await db.from("shipments").select("id, order_id, provider").eq("tracking_id", String(args.trackingCode)).maybeSingle();
		shipment = data ?? null;
	}
	let orderId = shipment?.order_id ?? null;
	if (!orderId && args.invoice) {
		const { data } = await db.from("orders").select("id").eq("order_number", args.invoice).maybeSingle();
		orderId = data?.id ?? null;
	}
	if (!orderId) return { matched: false };
	const provider = shipment?.provider ?? args.provider ?? "steadfast";
	const statusKey = normalizeCourierStatus(provider, args.courierStatus) || "unknown";
	const mapped = mapCourierStatus(provider, args.courierStatus);
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	await db.from("courier_events").insert({
		order_id: orderId,
		shipment_id: shipment?.id ?? null,
		provider,
		source: args.source,
		notification_type: args.notificationType ?? null,
		courier_status: statusKey,
		consignment_id: args.consignmentId ? String(args.consignmentId) : null,
		tracking_code: args.trackingCode ? String(args.trackingCode) : null,
		cod_amount: args.codAmount ?? null,
		delivery_charge: args.deliveryCharge ?? null,
		note: args.note ?? null,
		payload: args.payload ?? {},
		event_at: nowIso
	});
	if (shipment?.id) {
		const pl = args.payload ?? {};
		const echoedLink = typeof pl?.tracking_link === "string" && pl.tracking_link ? pl.tracking_link : typeof pl?.consignment?.tracking_link === "string" && pl.consignment.tracking_link ? pl.consignment.tracking_link : null;
		let keepLink = void 0;
		if (echoedLink) {
			const { data: cur } = await db.from("shipments").select("tracking_url").eq("id", shipment.id).maybeSingle();
			if (!cur?.tracking_url) keepLink = echoedLink;
		}
		await db.from("shipments").update({
			tracking_url: keepLink,
			status: mapped.ship,
			courier_status: statusKey,
			cod_amount: args.codAmount ?? void 0,
			delivery_charge: args.deliveryCharge ?? void 0,
			courier_note: args.note ?? void 0,
			last_event_at: nowIso,
			last_synced_at: nowIso,
			response_payload: args.payload ?? {}
		}).eq("id", shipment.id);
	}
	const { data: order } = await db.from("orders").select("status").eq("id", orderId).maybeSingle();
	const isLocked = order && ["returned", "cancelled"].includes(order.status) && !args.bypassFinalLock;
	if (order && !isLocked && args.codAmount != null && (mapped.order === "delivered" || mapped.order === "partial")) await db.from("orders").update({ received_amount: args.codAmount }).eq("id", orderId);
	if (order && order.status !== mapped.order && !isLocked) {
		await db.from("orders").update({ status: mapped.order }).eq("id", orderId);
		await db.from("order_status_history").insert({
			order_id: orderId,
			status: mapped.order,
			note: `${provider} update (${args.source}): ${statusKey}${args.bypassFinalLock ? " (Admin Override)" : ""}`
		});
	}
	return {
		matched: true,
		orderId,
		shipmentId: shipment?.id ?? null,
		mapped
	};
}
/**
* Pull the live status of one shipment from its courier and persist it.
* Provider agnostic — used by the manual "Recheck status" button and by the
* automatic sync job (webhooks can be missed or misconfigured, so polling is
* the safety net that keeps order statuses correct).
*/
async function syncShipmentStatus(db, shipment, orderNumber) {
	const provider = String(shipment.provider);
	const cid = shipment.consignment_id || shipment.tracking_id;
	const conf = await getCourierConfig(db, provider);
	if (provider === "steadfast") {
		const body = await steadfastRequest(conf, shipment.consignment_id ? `/status_by_cid/${shipment.consignment_id}` : shipment.tracking_id ? `/status_by_trackingcode/${shipment.tracking_id}` : `/status_by_invoice/${orderNumber ?? ""}`);
		const courierStatus = String(body.delivery_status || body.status || "unknown").toLowerCase();
		return {
			courierStatus,
			matched: (await applyCourierUpdate(db, {
				provider,
				consignmentId: shipment.consignment_id,
				trackingCode: shipment.tracking_id,
				invoice: orderNumber ?? null,
				courierStatus,
				source: "sync",
				notificationType: "auto_sync",
				payload: body
			})).matched
		};
	}
	if (provider === "pathao") {
		if (!cid) throw new Response("Shipment has no Pathao consignment id", { status: 400 });
		const { pathaoOrderInfo } = await import("./pathao.server-4NwnyfNW.js");
		const info = await pathaoOrderInfo(db, conf, cid);
		const result = await applyCourierUpdate(db, {
			provider,
			consignmentId: shipment.consignment_id ?? cid,
			trackingCode: shipment.tracking_id,
			invoice: info.merchantOrderId ?? orderNumber ?? null,
			courierStatus: info.status,
			source: "sync",
			notificationType: "auto_sync",
			payload: info
		});
		return {
			courierStatus: info.status,
			matched: result.matched
		};
	}
	if (provider === "carrybee") {
		if (!cid) throw new Response("Shipment has no Carrybee consignment id", { status: 400 });
		const { carrybeeRequest } = await import("./carrybee.server-Cru9cHfp.js");
		const body = await carrybeeRequest(conf, `/api/v2/orders/${encodeURIComponent(cid)}/details`);
		const d = body?.data ?? {};
		const courierStatus = String(d.transfer_status ?? "unknown");
		return {
			courierStatus,
			matched: (await applyCourierUpdate(db, {
				provider,
				consignmentId: shipment.consignment_id ?? cid,
				trackingCode: shipment.tracking_id,
				courierStatus,
				source: "sync",
				notificationType: "auto_sync",
				codAmount: d.collected_amount != null ? Number(d.collected_amount) : null,
				deliveryCharge: d.delivery_fee != null ? Number(d.delivery_fee) : null,
				note: d.reason ?? null,
				payload: body
			})).matched
		};
	}
	throw new Response(`Sync not supported for ${provider}`, { status: 400 });
}
/** Statuses that never change again — skipped by the polling job. */
var FINAL_COURIER_SHIP_STATUSES = [
	"delivered",
	"returned",
	"cancelled",
	"failed"
];
/**
* Poll every still-moving shipment and persist status changes.
* Safe to call repeatedly; errors on one shipment never abort the rest.
*/
async function syncPendingShipments(db, limit = 40, staleMinutes = 0) {
	let query = db.from("shipments").select("id, provider, consignment_id, tracking_id, order_id, orders(order_number)").not("status", "in", `(${FINAL_COURIER_SHIP_STATUSES.join(",")})`).order("last_synced_at", {
		ascending: true,
		nullsFirst: true
	}).limit(limit);
	if (staleMinutes > 0) {
		const cutoff = (/* @__PURE__ */ new Date(Date.now() - staleMinutes * 60 * 1e3)).toISOString();
		query = query.or(`last_synced_at.is.null,last_synced_at.lt.${cutoff}`);
	}
	const { data: rows } = await query;
	let synced = 0;
	const errors = [];
	for (const sh of rows ?? []) try {
		await syncShipmentStatus(db, sh, sh.orders?.order_number ?? null);
		synced += 1;
	} catch (err) {
		errors.push(`${sh.id}: ${err?.message ?? String(err)}`);
	}
	return {
		checked: rows?.length ?? 0,
		synced,
		errors
	};
}
//#endregion
export { applyCourierUpdate, assertAdmin, assertCourierStore, calculateCodAmount, courierActorClient, courierStoreName, fullAddress, getCourierConfig, getOrderForBooking, normalizePhone, persistCourierStores, steadfastRequest, syncPendingShipments, syncShipmentStatus };
