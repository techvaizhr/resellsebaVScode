import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as createServerRpc } from "./createServerRpc-BQTLusYf.js";
import { l as stringType, s as objectType } from "./types-CX4iBvKD.js";
import { t as requireSupabaseAuth } from "./auth-middleware-XRMpJ1R8.js";
//#region src/lib/order-details.functions.ts?tss-serverfn-split
var getOrderDetails_createServerFn_handler = createServerRpc({
	id: "9866f76328537afcd342bb1462aec6c6ae4b18546f6c8c8eb5b12fe84b9c6aa1",
	name: "getOrderDetails",
	filename: "src/lib/order-details.functions.ts"
}, (opts) => getOrderDetails.__executeServer(opts));
var getOrderDetails = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ orderId: stringType() }).parse(data)).handler(getOrderDetails_createServerFn_handler, async ({ data, context }) => {
	const { orderId } = data;
	const { supabase } = context;
	const [orderRes, itemsRes, shipmentsRes, eventsRes] = await Promise.all([
		supabase.from("orders").select("*, resellers(business_name, code, contact_phone, agents(display_name))").eq("id", orderId).maybeSingle(),
		supabase.from("order_items").select("*").eq("order_id", orderId),
		supabase.from("shipments").select("*").eq("order_id", orderId),
		supabase.from("courier_events").select("*").eq("order_id", orderId).order("event_at", { ascending: false })
	]);
	if (orderRes.error) console.error("[getOrderDetails] Order error:", orderRes.error);
	return {
		order: orderRes.data,
		items: itemsRes.data || [],
		shipments: shipmentsRes.data || [],
		events: eventsRes.data || []
	};
});
var recheckCourierStatus_createServerFn_handler = createServerRpc({
	id: "a87394ade9e07fcb6800ba5b6e57ae4c915ca4d0514b5da41cd7c28310de862c",
	name: "recheckCourierStatus",
	filename: "src/lib/order-details.functions.ts"
}, (opts) => recheckCourierStatus.__executeServer(opts));
var recheckCourierStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ orderId: stringType() }).parse(data)).handler(recheckCourierStatus_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { syncShipmentStatus } = await import("./couriers.server-iJ5B3Tmi.js");
	const { data: shipments } = await supabase.from("shipments").select("id, provider, consignment_id, tracking_id, order_id, orders(order_number)").eq("order_id", data.orderId);
	if (!shipments || shipments.length === 0) return {
		success: false,
		message: "No courier booking found for this order."
	};
	const statuses = [];
	const errors = [];
	for (const sh of shipments) try {
		const res = await syncShipmentStatus(supabase, sh, sh.orders?.order_number ?? null);
		statuses.push(res.courierStatus);
	} catch (err) {
		errors.push(err instanceof Response ? await err.clone().text() : err?.message ?? String(err));
	}
	if (statuses.length === 0) return {
		success: false,
		message: errors[0] ?? "Courier status could not be fetched."
	};
	return {
		success: true,
		message: `Courier status: ${statuses.join(", ")}`
	};
});
//#endregion
export { getOrderDetails_createServerFn_handler, recheckCourierStatus_createServerFn_handler };
