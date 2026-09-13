import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as createServerRpc } from "./createServerRpc-BQTLusYf.js";
import { t as requireSupabaseAuth } from "./auth-middleware-CNexUu6x.js";
//#region src/lib/courier-config.functions.ts?tss-serverfn-split
function parseStores(config) {
	const raw = config?.stores_json;
	if (!raw) return [];
	try {
		const list = typeof raw === "string" ? JSON.parse(raw) : raw;
		if (!Array.isArray(list)) return [];
		return list.map((s) => ({
			id: String(s?.id ?? ""),
			name: String(s?.name ?? s?.id ?? "")
		})).filter((s) => s.id);
	} catch {
		return [];
	}
}
async function loadConfigs(supabase) {
	const { data } = await supabase.from("courier_configs").select("provider, is_active, config").eq("is_active", true);
	if (data && data.length) return data;
	const { data: opts } = await supabase.rpc("courier_booking_options");
	return (Array.isArray(opts) ? opts : []).map((o) => ({
		provider: o.provider,
		is_active: true,
		config: {
			stores_json: o.stores ?? [],
			...o.defaultStoreId ? { store_id: o.defaultStoreId } : {}
		}
	}));
}
var getActiveCouriers_createServerFn_handler = createServerRpc({
	id: "02213bd497c0eaf0a2687ab1b01d71f96e5763da0a2546216be66a5f5f034170",
	name: "getActiveCouriers",
	filename: "src/lib/courier-config.functions.ts"
}, (opts) => getActiveCouriers.__executeServer(opts));
var getActiveCouriers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getActiveCouriers_createServerFn_handler, async ({ context }) => {
	return (await loadConfigs(context.supabase)).map((c) => String(c.provider));
});
var getCourierBookingOptions_createServerFn_handler = createServerRpc({
	id: "c73cecbaf7348f9b524e70bab5e2011554ed424328568749bec2a7e553ed6610",
	name: "getCourierBookingOptions",
	filename: "src/lib/courier-config.functions.ts"
}, (opts) => getCourierBookingOptions.__executeServer(opts));
var getCourierBookingOptions = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getCourierBookingOptions_createServerFn_handler, async ({ context }) => {
	return (await loadConfigs(context.supabase)).map((c) => ({
		provider: String(c.provider),
		stores: parseStores(c.config),
		defaultStoreId: c.config?.store_id ? String(c.config.store_id) : null
	}));
});
//#endregion
export { getActiveCouriers_createServerFn_handler, getCourierBookingOptions_createServerFn_handler };
