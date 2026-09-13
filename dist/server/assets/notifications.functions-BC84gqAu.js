import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as createServerRpc } from "./createServerRpc-BQTLusYf.js";
import { l as stringType, s as objectType } from "./types-CX4iBvKD.js";
import { t as requireSupabaseAuth } from "./auth-middleware-CwgILtb5.js";
import { pickConfig, sendEmail, sendSms } from "./notifications.server-ULDUirAK.js";
//#region src/lib/notifications.functions.ts?tss-serverfn-split
var notifyOrderStatus_createServerFn_handler = createServerRpc({
	id: "6d957b9ba12c3420c9630abe8ef0652bbdf5e9715365b43336be564eb0b88891",
	name: "notifyOrderStatus",
	filename: "src/lib/notifications.functions.ts"
}, (opts) => notifyOrderStatus.__executeServer(opts));
var notifyOrderStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	orderId: stringType().uuid(),
	template: stringType().optional()
}).parse(d)).handler(notifyOrderStatus_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { data: order, error } = await supabase.from("orders").select("id, order_number, status, customer_name, customer_phone, customer_email, reseller_id, total, resellers(store_name)").eq("id", data.orderId).maybeSingle();
	if (error || !order) throw new Error("Order not found");
	const storeName = order.resellers?.store_name || "Store";
	const template = data.template || `status_${order.status}`;
	const message = `${storeName}: Order #${order.order_number} status - ${order.status}. Total: ৳${order.total}. Thank you!`;
	const results = [];
	if (order.customer_phone) {
		const cfg = await pickConfig(supabase, order.reseller_id, "sms");
		if (cfg) {
			const r = await sendSms(cfg, order.customer_phone, message);
			await supabase.from("notification_logs").insert({
				reseller_id: order.reseller_id,
				order_id: order.id,
				channel: "sms",
				recipient: order.customer_phone,
				template,
				status: r.ok ? "sent" : "failed",
				error: r.error || null,
				payload: r.raw ?? null
			});
			results.push({
				channel: "sms",
				ok: r.ok,
				error: r.error
			});
		}
	}
	if (order.customer_email) {
		const cfg = await pickConfig(supabase, order.reseller_id, "email");
		if (cfg) {
			const html = `<p>Hi ${order.customer_name || ""},</p><p>${message}</p>`;
			const r = await sendEmail(cfg, order.customer_email, `Order #${order.order_number} - ${order.status}`, html);
			await supabase.from("notification_logs").insert({
				reseller_id: order.reseller_id,
				order_id: order.id,
				channel: "email",
				recipient: order.customer_email,
				template,
				status: r.ok ? "sent" : "failed",
				error: r.error || null,
				payload: r.raw ?? null
			});
			results.push({
				channel: "email",
				ok: r.ok,
				error: r.error
			});
		}
	}
	return { results };
});
var sendTestNotification_createServerFn_handler = createServerRpc({
	id: "b3f65dc7e408d66c19ba4b4808a75ccd758898f7c3060c9742d56016735f0843",
	name: "sendTestNotification",
	filename: "src/lib/notifications.functions.ts"
}, (opts) => sendTestNotification.__executeServer(opts));
var sendTestNotification = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	configId: stringType().uuid(),
	to: stringType().min(3)
}).parse(d)).handler(sendTestNotification_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { data: cfg, error } = await supabase.from("notification_configs").select("*").eq("id", data.configId).maybeSingle();
	if (error || !cfg) throw new Error("Config not found");
	const msg = "Test message from your reseller platform.";
	const r = cfg.channel === "sms" ? await sendSms(cfg, data.to, msg) : await sendEmail(cfg, data.to, "Test", `<p>${msg}</p>`);
	await supabase.from("notification_logs").insert({
		reseller_id: cfg.reseller_id,
		channel: cfg.channel,
		recipient: data.to,
		template: "test",
		status: r.ok ? "sent" : "failed",
		error: r.error || null,
		payload: r.raw ?? null
	});
	if (!r.ok) throw new Error(r.error || "Send failed");
	return { ok: true };
});
//#endregion
export { notifyOrderStatus_createServerFn_handler, sendTestNotification_createServerFn_handler };
