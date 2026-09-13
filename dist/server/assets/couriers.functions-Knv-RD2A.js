import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as createServerRpc } from "./createServerRpc-BQTLusYf.js";
import { a as literalType, l as stringType, o as numberType, r as booleanType, s as objectType, u as unionType } from "./types-CX4iBvKD.js";
import { t as requireSupabaseAuth } from "./auth-middleware-COl73A2L.js";
import { applyCourierUpdate, assertAdmin, calculateCodAmount, courierActorClient, fullAddress, getCourierConfig, getOrderForBooking, normalizePhone, steadfastRequest } from "./couriers.server-CvlcvVrG.js";
//#region src/lib/couriers.functions.ts?tss-serverfn-split
objectType({ orderId: stringType().uuid() });
var bookSteadfast_createServerFn_handler = createServerRpc({
	id: "001f301805823a9a33fb895039f6966747c37e6b00cf9d0ff65f0b2b1dc177f4",
	name: "bookSteadfast",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => bookSteadfast.__executeServer(opts));
var bookSteadfast = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	orderId: stringType().uuid(),
	deliveryType: unionType([literalType(0), literalType(1)]).optional(),
	note: stringType().max(250).optional()
}).parse(d)).handler(bookSteadfast_createServerFn_handler, async ({ data, context }) => {
	const { userId } = context;
	const supabase = await courierActorClient(context.supabase, userId, data.orderId);
	const conf = await getCourierConfig(supabase, "steadfast");
	const order = await getOrderForBooking(supabase, data.orderId);
	const { data: existing } = await supabase.from("shipments").select("id").eq("order_id", order.id).not("consignment_id", "is", null).maybeSingle();
	if (existing) throw new Response("This order is already booked with a courier", { status: 400 });
	const { data: items } = await supabase.from("order_items").select("product_name, quantity").eq("order_id", order.id);
	const codAmount = calculateCodAmount(order);
	const payload = {
		invoice: order.order_number,
		recipient_name: String(order.customer_name).slice(0, 100),
		recipient_phone: normalizePhone(order.customer_phone),
		recipient_address: fullAddress(order),
		cod_amount: codAmount,
		note: (data.note || order.reseller_note || order.notes || "")?.slice(0, 250) || void 0,
		item_description: (items ?? []).map((i) => `${i.product_name} x${i.quantity}`).join(", ").slice(0, 250) || void 0,
		total_lot: (items ?? []).reduce((s, i) => s + Number(i.quantity || 0), 0) || 1,
		delivery_type: data.deliveryType ?? 0
	};
	const body = await steadfastRequest(conf, "/create_order", {
		method: "POST",
		body: JSON.stringify(payload)
	});
	const c = body.consignment ?? {};
	const trackingId = c.tracking_code || String(c.consignment_id ?? "");
	const trackingUrl = typeof c.tracking_link === "string" && c.tracking_link ? c.tracking_link : null;
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const { data: shipment } = await supabase.from("shipments").insert({
		order_id: order.id,
		provider: "steadfast",
		tracking_id: trackingId,
		tracking_url: trackingUrl,
		consignment_id: String(c.consignment_id ?? ""),
		status: "booked",
		courier_status: String(c.status ?? "in_review"),
		cod_amount: Number(c.cod_amount ?? codAmount),
		request_payload: payload,
		response_payload: body,
		booked_at: nowIso,
		last_event_at: nowIso,
		booked_by: userId
	}).select("id").single();
	await supabase.from("courier_events").insert({
		order_id: order.id,
		shipment_id: shipment?.id ?? null,
		provider: "steadfast",
		source: "sync",
		notification_type: "booking",
		courier_status: String(c.status ?? "in_review"),
		consignment_id: String(c.consignment_id ?? ""),
		tracking_code: trackingId,
		cod_amount: Number(c.cod_amount ?? codAmount),
		note: "Consignment created",
		payload: body,
		event_at: nowIso
	});
	await supabase.from("order_status_history").insert({
		order_id: order.id,
		status: order.status,
		note: `Steadfast booked · ${trackingId}`,
		changed_by: userId
	});
	return {
		success: true,
		trackingId,
		consignmentId: String(c.consignment_id ?? ""),
		status: c.status ?? "in_review"
	};
});
var syncSteadfastStatus_createServerFn_handler = createServerRpc({
	id: "c6c49de3f6491227dbde551eed3b3c2bcc4231efb3b653002613be16142ca04e",
	name: "syncSteadfastStatus",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => syncSteadfastStatus.__executeServer(opts));
var syncSteadfastStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ shipmentId: stringType().uuid() }).parse(d)).handler(syncSteadfastStatus_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const conf = await getCourierConfig(supabase, "steadfast");
	const { data: sh } = await supabase.from("shipments").select("id, consignment_id, tracking_id, order_id, orders(order_number)").eq("id", data.shipmentId).maybeSingle();
	if (!sh) throw new Response("Shipment not found", { status: 404 });
	const body = await steadfastRequest(conf, sh.consignment_id ? `/status_by_cid/${sh.consignment_id}` : sh.tracking_id ? `/status_by_trackingcode/${sh.tracking_id}` : `/status_by_invoice/${sh.orders?.order_number}`);
	const courierStatus = String(body.delivery_status || body.status || "unknown").toLowerCase();
	const result = await applyCourierUpdate(supabase, {
		consignmentId: sh.consignment_id,
		trackingCode: sh.tracking_id,
		invoice: sh.orders?.order_number,
		courierStatus,
		source: "sync",
		notificationType: "manual_sync",
		payload: body,
		bypassFinalLock: true
	});
	return {
		courierStatus,
		shipStatus: result.matched ? result.mapped.ship : null
	};
});
var steadfastBalance_createServerFn_handler = createServerRpc({
	id: "aff1d786710b9d77b701bd384f82b9cb5f8077df2c8ed8bba29d96454eed4d3c",
	name: "steadfastBalance",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => steadfastBalance.__executeServer(opts));
var steadfastBalance = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(steadfastBalance_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const body = await steadfastRequest(await getCourierConfig(supabase, "steadfast"), "/get_balance");
	return { balance: Number(body.current_balance ?? 0) };
});
var steadfastCreateReturn_createServerFn_handler = createServerRpc({
	id: "cbee74248449b8a4d553cd0324b2a8d9655c29f66702f8f06d81f81ef42b0d63",
	name: "steadfastCreateReturn",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => steadfastCreateReturn.__executeServer(opts));
var steadfastCreateReturn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	shipmentId: stringType().uuid(),
	reason: stringType().max(250).optional()
}).parse(d)).handler(steadfastCreateReturn_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const conf = await getCourierConfig(supabase, "steadfast");
	const { data: sh } = await supabase.from("shipments").select("id, consignment_id, tracking_id, order_id").eq("id", data.shipmentId).maybeSingle();
	if (!sh?.consignment_id && !sh?.tracking_id) throw new Response("Shipment is not booked with Steadfast", { status: 400 });
	const body = await steadfastRequest(conf, "/create_return_request", {
		method: "POST",
		body: JSON.stringify({
			...sh.consignment_id ? { consignment_id: Number(sh.consignment_id) } : { tracking_code: sh.tracking_id },
			...data.reason ? { reason: data.reason } : {}
		})
	});
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	await supabase.from("courier_events").insert({
		order_id: sh.order_id,
		shipment_id: sh.id,
		provider: "steadfast",
		source: "sync",
		notification_type: "return_request",
		courier_status: String(body.status ?? body?.data?.status ?? "pending"),
		consignment_id: sh.consignment_id,
		tracking_code: sh.tracking_id,
		note: data.reason ?? "Return requested",
		payload: body,
		event_at: nowIso
	});
	await supabase.from("orders").update({ status: "pending_return" }).eq("id", sh.order_id);
	await supabase.from("order_status_history").insert({
		order_id: sh.order_id,
		status: "pending_return",
		note: `Return requested: ${data.reason ?? "—"}`,
		changed_by: userId
	});
	return { status: String(body.status ?? body?.data?.status ?? "pending") };
});
var steadfastReturnRequests_createServerFn_handler = createServerRpc({
	id: "09a36651d35e563d9fe3b0b7b020c13c911cd416bf36c415a9ad5b688016acb7",
	name: "steadfastReturnRequests",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => steadfastReturnRequests.__executeServer(opts));
var steadfastReturnRequests = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(steadfastReturnRequests_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const body = await steadfastRequest(await getCourierConfig(supabase, "steadfast"), "/get_return_requests");
	return { data: body?.data ?? body ?? [] };
});
var pathaoStores_createServerFn_handler = createServerRpc({
	id: "b18dc65a5f691f980c59625d8d1a51d04d874a911a87888db07e04793dafe02c",
	name: "pathaoStores",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => pathaoStores.__executeServer(opts));
var pathaoStores = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(pathaoStores_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { pathaoStoreList } = await import("./pathao.server-4NwnyfNW.js");
	const { persistCourierStores } = await import("./couriers.server-CvlcvVrG.js");
	const conf = await getCourierConfig(supabase, "pathao");
	const stores = (await pathaoStoreList(supabase, conf)).filter((s) => s.isActive !== false);
	const defaultStoreId = await persistCourierStores(supabase, "pathao", conf, stores);
	if (stores.length === 0) throw new Response("Pathao account e kono active pickup store nei. Pathao panel e store add/active korun.", { status: 400 });
	return {
		stores,
		defaultStoreId
	};
});
var pathaoPricePlan_createServerFn_handler = createServerRpc({
	id: "5ef461c68e087dd3174ea95d6fccedbfbe64a7d53c821807d091838bcf528060",
	name: "pathaoPricePlan",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => pathaoPricePlan.__executeServer(opts));
var pathaoPricePlan = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	cityId: numberType().int().positive(),
	zoneId: numberType().int().positive(),
	itemWeight: numberType().min(.5).max(10).optional(),
	deliveryType: unionType([literalType(48), literalType(12)]).optional()
}).parse(d)).handler(pathaoPricePlan_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { pathaoPricePlanRequest } = await import("./pathao.server-4NwnyfNW.js");
	const conf = await getCourierConfig(supabase, "pathao");
	if (!conf.store_id) throw new Response("Pathao store id set korun", { status: 400 });
	return pathaoPricePlanRequest(supabase, conf, {
		storeId: conf.store_id,
		...data
	});
});
var bookPathao_createServerFn_handler = createServerRpc({
	id: "3e1e835105145ed11d6462bb9008fc961d3864f55f9dfb385a0607be31e6a8e9",
	name: "bookPathao",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => bookPathao.__executeServer(opts));
var bookPathao = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	orderId: stringType().uuid(),
	deliveryType: unionType([literalType(48), literalType(12)]).optional(),
	itemWeight: numberType().min(.5).max(10).optional(),
	storeId: stringType().min(1).optional(),
	note: stringType().max(250).optional()
}).parse(d)).handler(bookPathao_createServerFn_handler, async ({ data, context }) => {
	const { userId } = context;
	const supabase = await courierActorClient(context.supabase, userId, data.orderId);
	const { pathaoRequest } = await import("./pathao.server-4NwnyfNW.js");
	const { courierStoreName, assertCourierStore } = await import("./couriers.server-CvlcvVrG.js");
	const conf = await getCourierConfig(supabase, "pathao");
	const storeId = data.storeId || conf.store_id;
	if (!storeId) throw new Response("Pathao store select korun", { status: 400 });
	assertCourierStore(conf, "Pathao", storeId);
	const order = await getOrderForBooking(supabase, data.orderId);
	const { data: existing } = await supabase.from("shipments").select("id").eq("order_id", order.id).not("consignment_id", "is", null).maybeSingle();
	if (existing) throw new Response("This order is already booked with a courier", { status: 400 });
	const { data: items } = await supabase.from("order_items").select("product_name, quantity").eq("order_id", order.id);
	const quantity = (items ?? []).reduce((s, i) => s + Number(i.quantity || 0), 0) || 1;
	const codAmount = calculateCodAmount(order);
	const payload = {
		store_id: Number(storeId),
		merchant_order_id: order.order_number,
		recipient_name: String(order.customer_name).slice(0, 100),
		recipient_phone: normalizePhone(order.customer_phone),
		recipient_address: fullAddress(order).padEnd(10, " ").slice(0, 220),
		delivery_type: data.deliveryType ?? 48,
		item_type: 2,
		item_quantity: quantity,
		item_weight: String(data.itemWeight ? data.itemWeight > 10 ? data.itemWeight / 1e3 : data.itemWeight : .2),
		amount_to_collect: codAmount,
		item_description: (items ?? []).map((i) => `${i.product_name} x${i.quantity}`).join(", ").slice(0, 250) || `Order ${order.order_number}`,
		special_instruction: (data.note || order.reseller_note || order.notes || "")?.slice(0, 250) || void 0
	};
	const body = await pathaoRequest(supabase, conf, "/aladdin/api/v1/orders", {
		method: "POST",
		body: JSON.stringify(payload)
	});
	const d = body?.data ?? {};
	const consignmentId = String(d.consignment_id ?? "");
	const courierStatus = String(d.order_status ?? "pending");
	const deliveryFee = d.delivery_fee != null ? Number(d.delivery_fee) : null;
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const { data: shipment } = await supabase.from("shipments").insert({
		order_id: order.id,
		provider: "pathao",
		tracking_id: consignmentId,
		consignment_id: consignmentId,
		status: "booked",
		courier_status: courierStatus.toLowerCase(),
		cod_amount: codAmount,
		delivery_charge: deliveryFee,
		cost: deliveryFee ?? 0,
		request_payload: payload,
		response_payload: body,
		booked_at: nowIso,
		last_event_at: nowIso,
		booked_by: userId
	}).select("id").single();
	await supabase.from("courier_events").insert({
		order_id: order.id,
		shipment_id: shipment?.id ?? null,
		provider: "pathao",
		source: "sync",
		notification_type: "booking",
		courier_status: courierStatus.toLowerCase(),
		consignment_id: consignmentId,
		tracking_code: consignmentId,
		cod_amount: codAmount,
		delivery_charge: deliveryFee,
		note: `Consignment created${courierStoreName(conf, storeId) ? ` · Pickup: ${courierStoreName(conf, storeId)}` : ""}`,
		payload: body,
		event_at: nowIso
	});
	await supabase.from("order_status_history").insert({
		order_id: order.id,
		status: order.status,
		note: `Pathao booked · ${consignmentId}${courierStoreName(conf, storeId) ? ` · ${courierStoreName(conf, storeId)}` : ""}`,
		changed_by: userId
	});
	return {
		success: true,
		trackingId: consignmentId,
		consignmentId,
		deliveryFee: deliveryFee ?? 0
	};
});
var syncPathaoStatus_createServerFn_handler = createServerRpc({
	id: "bf9fef4de90b0c28b27f72e812816bf09ba4d58c398bb34af3a5cd424483b5a2",
	name: "syncPathaoStatus",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => syncPathaoStatus.__executeServer(opts));
var syncPathaoStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ shipmentId: stringType().uuid() }).parse(d)).handler(syncPathaoStatus_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { pathaoOrderInfo } = await import("./pathao.server-4NwnyfNW.js");
	const conf = await getCourierConfig(supabase, "pathao");
	const { data: sh } = await supabase.from("shipments").select("id, consignment_id, tracking_id, order_id").eq("id", data.shipmentId).maybeSingle();
	const cid = sh?.consignment_id || sh?.tracking_id;
	if (!cid) throw new Response("Shipment is not booked with Pathao", { status: 400 });
	const info = await pathaoOrderInfo(supabase, conf, cid);
	const result = await applyCourierUpdate(supabase, {
		provider: "pathao",
		consignmentId: sh?.consignment_id ?? cid,
		trackingCode: sh?.tracking_id ?? null,
		invoice: info.merchantOrderId,
		courierStatus: info.status,
		source: "sync",
		notificationType: "manual_sync",
		payload: info,
		bypassFinalLock: true
	});
	return {
		courierStatus: info.status,
		shipStatus: result.matched ? result.mapped.ship : null
	};
});
var carrybeeStores_createServerFn_handler = createServerRpc({
	id: "efa9c1cc7e47e394a824fe343d7aec5795c6ffd99d57a9bb24b4fe67ce773ea1",
	name: "carrybeeStores",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => carrybeeStores.__executeServer(opts));
var carrybeeStores = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(carrybeeStores_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { carrybeeRequest } = await import("./carrybee.server-Cru9cHfp.js");
	const { persistCourierStores } = await import("./couriers.server-CvlcvVrG.js");
	const conf = await getCourierConfig(supabase, "carrybee");
	const body = await carrybeeRequest(conf, "/api/v2/stores");
	const usable = (Array.isArray(body?.data?.stores) ? body.data.stores : Array.isArray(body?.data?.items) ? body.data.items : Array.isArray(body?.data) ? body.data : []).map((s) => ({
		id: String(s.id ?? s.store_id ?? ""),
		name: String(s.name ?? s.store_name ?? ""),
		isApproved: Boolean(s.is_approved),
		isActive: Boolean(s.is_active),
		isDefaultPickup: Boolean(s.is_default_pickup_store)
	})).filter((s) => s.id).filter((s) => s.isActive !== false);
	const defaultStoreId = await persistCourierStores(supabase, "carrybee", conf, usable);
	if (usable.length === 0) throw new Response("Carrybee account e kono active pickup store nei. Carrybee panel e store add/active korun.", { status: 400 });
	return {
		stores: usable,
		defaultStoreId
	};
});
var bookCarrybee_createServerFn_handler = createServerRpc({
	id: "c26c98eccbf050f9e75273e64ae1e834863c11cb55676e87694e5630f398daf9",
	name: "bookCarrybee",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => bookCarrybee.__executeServer(opts));
var bookCarrybee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	orderId: stringType().uuid(),
	deliveryType: unionType([literalType(1), literalType(2)]).optional(),
	productType: unionType([
		literalType(1),
		literalType(2),
		literalType(3)
	]).optional(),
	itemWeight: numberType().int().min(1).max(25e3).optional(),
	storeId: stringType().min(1).optional(),
	isExchange: booleanType().optional(),
	note: stringType().max(250).optional()
}).parse(d)).handler(bookCarrybee_createServerFn_handler, async ({ data, context }) => {
	const { userId } = context;
	const supabase = await courierActorClient(context.supabase, userId, data.orderId);
	const { carrybeeRequest, carrybeeResolveLocation } = await import("./carrybee.server-Cru9cHfp.js");
	const { courierStoreName, assertCourierStore } = await import("./couriers.server-CvlcvVrG.js");
	const conf = await getCourierConfig(supabase, "carrybee");
	const storeId = data.storeId || conf.store_id;
	if (!storeId) throw new Response("Carrybee store select korun", { status: 400 });
	assertCourierStore(conf, "Carrybee", storeId);
	const order = await getOrderForBooking(supabase, data.orderId);
	const { data: existing } = await supabase.from("shipments").select("id").eq("order_id", order.id).not("consignment_id", "is", null).maybeSingle();
	if (existing) throw new Response("This order is already booked with a courier", { status: 400 });
	const { data: items } = await supabase.from("order_items").select("product_name, quantity").eq("order_id", order.id);
	const quantity = (items ?? []).reduce((s, i) => s + Number(i.quantity || 0), 0) || 1;
	const address = fullAddress(order);
	const loc = await carrybeeResolveLocation(conf, {
		address,
		city: order.city,
		area: order.area
	});
	const codAmount = calculateCodAmount(order);
	const payload = {
		store_id: storeId,
		merchant_order_id: order.order_number,
		delivery_type: data.deliveryType ?? 1,
		product_type: data.productType ?? 1,
		recipient_phone: normalizePhone(order.customer_phone),
		recipient_name: String(order.customer_name).slice(0, 99),
		recipient_address: address.padEnd(10, " ").slice(0, 200),
		city_id: loc.cityId,
		zone_id: loc.zoneId,
		...loc.areaId ? { area_id: loc.areaId } : {},
		item_weight: data.itemWeight ?? 200,
		item_quantity: Math.min(200, quantity),
		collectable_amount: Math.min(1e5, codAmount),
		product_description: (items ?? []).map((i) => `${i.product_name} x${i.quantity}`).join(", ").slice(0, 255) || void 0,
		special_instruction: (data.note || order.reseller_note || order.notes || "")?.slice(0, 255) || void 0,
		...data.isExchange ? { is_exchange: true } : {}
	};
	const body = await carrybeeRequest(conf, "/api/v2/orders", {
		method: "POST",
		body: JSON.stringify(payload)
	});
	const o = body?.data?.order ?? body?.data ?? {};
	const consignmentId = String(o.consignment_id ?? "");
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const { data: shipment } = await supabase.from("shipments").insert({
		order_id: order.id,
		provider: "carrybee",
		tracking_id: consignmentId,
		consignment_id: consignmentId,
		status: "booked",
		courier_status: "created",
		cod_amount: Number(o.collectable_amount ?? codAmount),
		delivery_charge: o.delivery_fee != null ? Number(o.delivery_fee) : null,
		cost: o.delivery_fee != null ? Number(o.delivery_fee) : 0,
		request_payload: payload,
		response_payload: body,
		booked_at: nowIso,
		last_event_at: nowIso,
		booked_by: userId
	}).select("id").single();
	await supabase.from("courier_events").insert({
		order_id: order.id,
		shipment_id: shipment?.id ?? null,
		provider: "carrybee",
		source: "sync",
		notification_type: "booking",
		courier_status: "created",
		consignment_id: consignmentId,
		tracking_code: consignmentId,
		cod_amount: Number(o.collectable_amount ?? codAmount),
		delivery_charge: o.delivery_fee != null ? Number(o.delivery_fee) : null,
		note: `Consignment created${courierStoreName(conf, storeId) ? ` · Pickup: ${courierStoreName(conf, storeId)}` : ""}`,
		payload: body,
		event_at: nowIso
	});
	await supabase.from("order_status_history").insert({
		order_id: order.id,
		status: order.status,
		note: `Carrybee booked · ${consignmentId}${courierStoreName(conf, storeId) ? ` · ${courierStoreName(conf, storeId)}` : ""}`,
		changed_by: userId
	});
	return {
		success: true,
		trackingId: consignmentId,
		consignmentId,
		deliveryFee: Number(o.delivery_fee ?? 0)
	};
});
var syncCarrybeeStatus_createServerFn_handler = createServerRpc({
	id: "f6aedff16c5414dd6af4bbe284597f8a5ec8f2970dcd28e0deddc7b1a23b3ad1",
	name: "syncCarrybeeStatus",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => syncCarrybeeStatus.__executeServer(opts));
var syncCarrybeeStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ shipmentId: stringType().uuid() }).parse(d)).handler(syncCarrybeeStatus_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { carrybeeRequest } = await import("./carrybee.server-Cru9cHfp.js");
	const conf = await getCourierConfig(supabase, "carrybee");
	const { data: sh } = await supabase.from("shipments").select("id, consignment_id, tracking_id, order_id").eq("id", data.shipmentId).maybeSingle();
	const cid = sh?.consignment_id || sh?.tracking_id;
	if (!cid) throw new Response("Shipment is not booked with Carrybee", { status: 400 });
	const body = await carrybeeRequest(conf, `/api/v2/orders/${encodeURIComponent(cid)}/details`);
	const d = body?.data ?? {};
	const courierStatus = String(d.transfer_status ?? "unknown");
	const result = await applyCourierUpdate(supabase, {
		provider: "carrybee",
		consignmentId: sh?.consignment_id ?? cid,
		trackingCode: sh?.tracking_id ?? null,
		courierStatus,
		source: "sync",
		notificationType: "manual_sync",
		codAmount: d.collected_amount != null ? Number(d.collected_amount) : null,
		deliveryCharge: d.delivery_fee != null ? Number(d.delivery_fee) : null,
		note: d.reason ?? null,
		payload: body,
		bypassFinalLock: true
	});
	return {
		courierStatus,
		shipStatus: result.matched ? result.mapped.ship : null
	};
});
var cancelCarrybee_createServerFn_handler = createServerRpc({
	id: "06f673abc878ba68cd29da9f7f659e38d51f02519774e4f1f86005a1b0922cef",
	name: "cancelCarrybee",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => cancelCarrybee.__executeServer(opts));
var cancelCarrybee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	shipmentId: stringType().uuid(),
	reason: stringType().min(2).max(200)
}).parse(d)).handler(cancelCarrybee_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { carrybeeRequest } = await import("./carrybee.server-Cru9cHfp.js");
	const conf = await getCourierConfig(supabase, "carrybee");
	const { data: sh } = await supabase.from("shipments").select("id, consignment_id, tracking_id, order_id").eq("id", data.shipmentId).maybeSingle();
	const cid = sh?.consignment_id || sh?.tracking_id;
	if (!cid) throw new Response("Shipment is not booked with Carrybee", { status: 400 });
	const body = await carrybeeRequest(conf, `/api/v2/orders/${encodeURIComponent(cid)}/cancel`, {
		method: "POST",
		body: JSON.stringify({ cancellation_reason: data.reason })
	});
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	await supabase.from("courier_events").insert({
		order_id: sh.order_id,
		shipment_id: sh.id,
		provider: "carrybee",
		source: "sync",
		notification_type: "cancel",
		courier_status: "pickup-cancelled",
		consignment_id: sh.consignment_id,
		tracking_code: sh.tracking_id,
		note: data.reason,
		payload: body,
		event_at: nowIso
	});
	await supabase.from("shipments").update({
		status: "cancelled",
		courier_status: "pickup-cancelled",
		last_event_at: nowIso
	}).eq("id", sh.id);
	return { ok: true };
});
var carrybeeReversePickup_createServerFn_handler = createServerRpc({
	id: "97475f4e40a1db424670c9b39d952f4cf25210e54fcc58f1c87fddaa47984a70",
	name: "carrybeeReversePickup",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => carrybeeReversePickup.__executeServer(opts));
var carrybeeReversePickup = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	shipmentId: stringType().uuid(),
	reason: stringType().max(255).optional(),
	itemWeight: numberType().int().min(1).max(25e3).optional()
}).parse(d)).handler(carrybeeReversePickup_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { carrybeeRequest } = await import("./carrybee.server-Cru9cHfp.js");
	const conf = await getCourierConfig(supabase, "carrybee");
	const { data: sh } = await supabase.from("shipments").select("id, consignment_id, tracking_id, order_id").eq("id", data.shipmentId).maybeSingle();
	const cid = sh?.consignment_id || sh?.tracking_id;
	if (!cid) throw new Response("Shipment is not booked with Carrybee", { status: 400 });
	const body = await carrybeeRequest(conf, `/api/v2/orders/${encodeURIComponent(cid)}/reverse-pickup`, {
		method: "POST",
		body: JSON.stringify({
			...conf.store_id ? { store_id: conf.store_id } : {},
			...data.itemWeight ? { item_weight: data.itemWeight } : {},
			...data.reason ? { special_instruction: data.reason } : {}
		})
	});
	const newCid = String(body?.data?.consignment_id ?? "");
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	await supabase.from("courier_events").insert({
		order_id: sh.order_id,
		shipment_id: sh.id,
		provider: "carrybee",
		source: "sync",
		notification_type: "reverse_pickup",
		courier_status: "returned-in-transit",
		consignment_id: newCid || sh.consignment_id,
		tracking_code: sh.tracking_id,
		note: `Reverse pickup created${newCid ? ` · ${newCid}` : ""}${data.reason ? ` · ${data.reason}` : ""}`,
		payload: body,
		event_at: nowIso
	});
	await supabase.from("orders").update({ status: "pending_return" }).eq("id", sh.order_id);
	await supabase.from("order_status_history").insert({
		order_id: sh.order_id,
		status: "pending_return",
		note: `Carrybee reverse pickup${newCid ? ` · ${newCid}` : ""}`,
		changed_by: userId
	});
	return { consignmentId: newCid };
});
var carrybeeExchange_createServerFn_handler = createServerRpc({
	id: "e3d33cd807c704c01bb2e3fb9ae87fed5f52f1b93e3a5af134dbffd0d3a9cfe0",
	name: "carrybeeExchange",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => carrybeeExchange.__executeServer(opts));
var carrybeeExchange = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	shipmentId: stringType().uuid(),
	collectableAmount: numberType().int().min(0).max(1e5).optional(),
	itemWeight: numberType().int().min(1).max(25e3).optional(),
	note: stringType().max(255).optional()
}).parse(d)).handler(carrybeeExchange_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { carrybeeRequest } = await import("./carrybee.server-Cru9cHfp.js");
	const conf = await getCourierConfig(supabase, "carrybee");
	const { data: sh } = await supabase.from("shipments").select("id, consignment_id, tracking_id, order_id").eq("id", data.shipmentId).maybeSingle();
	const cid = sh?.consignment_id || sh?.tracking_id;
	if (!cid) throw new Response("Shipment is not booked with Carrybee", { status: 400 });
	const body = await carrybeeRequest(conf, `/api/v2/orders/${encodeURIComponent(cid)}/exchange`, {
		method: "POST",
		body: JSON.stringify({
			...data.collectableAmount != null ? { collectable_amount: data.collectableAmount } : {},
			...data.itemWeight ? { item_weight: data.itemWeight } : {},
			...data.note ? { special_instruction: data.note } : {}
		})
	});
	const o = body?.data?.order ?? body?.data ?? {};
	const newCid = String(o.consignment_id ?? "");
	await supabase.from("courier_events").insert({
		order_id: sh.order_id,
		shipment_id: sh.id,
		provider: "carrybee",
		source: "sync",
		notification_type: "exchange",
		courier_status: "exchange",
		consignment_id: newCid || sh.consignment_id,
		tracking_code: sh.tracking_id,
		note: `Exchange order created${newCid ? ` · ${newCid}` : ""}`,
		payload: body,
		event_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	return { consignmentId: newCid };
});
var receiveReturn_createServerFn_handler = createServerRpc({
	id: "f58ccdc3f930a666d9481586d8f27f89c5fb10084df43473a57064dd6763c684",
	name: "receiveReturn",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => receiveReturn.__executeServer(opts));
var receiveReturn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	orderId: stringType().uuid(),
	note: stringType().max(250).optional()
}).parse(d)).handler(receiveReturn_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	await supabase.from("orders").update({ status: "returned" }).eq("id", data.orderId);
	await supabase.from("order_status_history").insert({
		order_id: data.orderId,
		status: "returned",
		note: data.note ? `Return received: ${data.note}` : "Return received by admin",
		changed_by: userId
	});
	await supabase.from("shipments").update({
		status: "returned",
		last_event_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("order_id", data.orderId);
	await supabase.from("courier_events").insert({
		order_id: data.orderId,
		provider: "manual",
		source: "sync",
		notification_type: "return_received",
		courier_status: "returned",
		note: data.note ?? "Return parcel received",
		payload: {},
		event_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	return { ok: true };
});
var autoSyncCourierStatuses_createServerFn_handler = createServerRpc({
	id: "af4a642ab2d69f88752b6f42a86d288f49c60e668c186ad36570e8c718a6ef64",
	name: "autoSyncCourierStatuses",
	filename: "src/lib/couriers.functions.ts"
}, (opts) => autoSyncCourierStatuses.__executeServer(opts));
var autoSyncCourierStatuses = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(autoSyncCourierStatuses_createServerFn_handler, async ({ context }) => {
	const { syncPendingShipments } = await import("./couriers.server-CvlcvVrG.js");
	const { supabaseAdmin } = await import("./client.server-HpfUw6UU.js");
	try {
		return await syncPendingShipments(supabaseAdmin, 15, 5);
	} catch {
		return {
			checked: 0,
			synced: 0,
			errors: []
		};
	}
});
//#endregion
export { autoSyncCourierStatuses_createServerFn_handler, bookCarrybee_createServerFn_handler, bookPathao_createServerFn_handler, bookSteadfast_createServerFn_handler, cancelCarrybee_createServerFn_handler, carrybeeExchange_createServerFn_handler, carrybeeReversePickup_createServerFn_handler, carrybeeStores_createServerFn_handler, pathaoPricePlan_createServerFn_handler, pathaoStores_createServerFn_handler, receiveReturn_createServerFn_handler, steadfastBalance_createServerFn_handler, steadfastCreateReturn_createServerFn_handler, steadfastReturnRequests_createServerFn_handler, syncCarrybeeStatus_createServerFn_handler, syncPathaoStatus_createServerFn_handler, syncSteadfastStatus_createServerFn_handler };
