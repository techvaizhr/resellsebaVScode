import { t as createServerFn } from "./createServerFn-CIHAFgYl.js";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.js";
import { z } from "zod";
import { createHash } from "crypto";
//#region src/lib/capi.functions.ts?tss-serverfn-split
var input = z.object({
	orderNumber: z.string().min(1),
	code: z.string().min(1),
	eventId: z.string().optional(),
	/** Storefront origin of the buyer's browser — keeps event URLs domain-agnostic. */
	origin: z.string().url().optional()
});
var sha256 = (v) => createHash("sha256").update(v.trim().toLowerCase()).digest("hex");
/**
* Server-side purchase tracking: fires Facebook CAPI + TikTok Events API
* using per-reseller marketing_configs. Public (no auth) but only accepts
* a real order_number and derives all values server-side, so it cannot be
* spammed with fake totals.
*/
var trackPurchaseServer_createServerFn_handler = createServerRpc({
	id: "8bb5e209c418913d27ff81a0997bec8bfe2a2d6ed727ae8e1f4b1f36eecb9bf7",
	name: "trackPurchaseServer",
	filename: "src/lib/capi.functions.ts"
}, (opts) => trackPurchaseServer.__executeServer(opts));
var trackPurchaseServer = createServerFn({ method: "POST" }).inputValidator((d) => input.parse(d)).handler(trackPurchaseServer_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-CVACozxv.js");
	const { data: order } = await supabaseAdmin.from("orders").select("id, order_number, total, customer_phone, customer_name, reseller_id, order_items(product_id,product_name,reseller_price,quantity)").eq("order_number", data.orderNumber).maybeSingle();
	if (!order) return { ok: false };
	const { data: configs } = await supabaseAdmin.from("marketing_configs").select("platform, pixel_id, access_token, test_event_code, is_active, reseller_id").in("platform", ["facebook", "tiktok"]).or(`reseller_id.eq.${order.reseller_id},reseller_id.is.null`);
	const pick = (platform) => {
		const rows = (configs ?? []).filter((c) => c.platform === platform && c.is_active);
		return rows.find((c) => c.reseller_id === order.reseller_id) ?? rows.find((c) => c.reseller_id === null);
	};
	const origin = (data.origin ?? process.env["SITE_URL"] ?? "").replace(/\/$/, "");
	const checkoutUrl = origin ? `${origin}/s/${data.code}/checkout` : void 0;
	const eventId = data.eventId ?? `purchase_${order.id}`;
	const eventTime = Math.floor(Date.now() / 1e3);
	const results = {};
	const fb = pick("facebook");
	if (fb?.pixel_id && fb?.access_token) {
		const payload = {
			data: [{
				event_name: "Purchase",
				event_time: eventTime,
				event_id: eventId,
				event_source_url: checkoutUrl,
				client_user_agent: typeof window !== "undefined" ? window.navigator.userAgent : void 0,
				action_source: "website",
				user_data: {
					ph: order.customer_phone ? [sha256(order.customer_phone)] : void 0,
					fn: order.customer_name ? [sha256(order.customer_name.split(" ")[0])] : void 0,
					external_id: [sha256(order.id)]
				},
				custom_data: {
					currency: "BDT",
					value: Number(order.total),
					order_id: order.order_number,
					contents: (order.order_items ?? []).map((i) => ({
						id: i.product_id,
						quantity: i.quantity,
						item_price: Number(i.reseller_price)
					}))
				}
			}],
			test_event_code: fb.test_event_code || void 0
		};
		const url = `https://graph.facebook.com/v18.0/${fb.pixel_id}/events?access_token=${encodeURIComponent(fb.access_token)}`;
		const r = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		results.facebook = {
			ok: r.ok,
			status: r.status
		};
	}
	const tt = pick("tiktok");
	if (tt?.pixel_id && tt?.access_token) {
		const payload = {
			event_source: "web",
			event_source_id: tt.pixel_id,
			data: [{
				event: "CompletePayment",
				event_time: eventTime,
				event_id: eventId,
				user: { phone: order.customer_phone ? sha256(order.customer_phone) : void 0 },
				context: {
					page: { url: checkoutUrl },
					ad: { callback: void 0 }
				},
				properties: {
					currency: "BDT",
					value: Number(order.total),
					order_id: order.order_number,
					contents: (order.order_items ?? []).map((i) => ({
						content_id: i.product_id,
						quantity: i.quantity,
						price: Number(i.reseller_price),
						content_name: i.product_name
					}))
				}
			}],
			test_event_code: tt.test_event_code || void 0
		};
		const r = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Access-Token": tt.access_token
			},
			body: JSON.stringify(payload)
		});
		results.tiktok = {
			ok: r.ok,
			status: r.status
		};
	}
	return {
		ok: true,
		results
	};
});
//#endregion
export { trackPurchaseServer_createServerFn_handler };
