import { n as extractGatewayError, t as GATEWAYS } from "./registry-UF_sjTj7.js";
import { admin, depositAsOrder, getCredentials, getPlatformCredentials, loadOrder, newDepositCode, resolveGatewayRow, resolveReturnTarget, returnUrl, settlePayment, signTargets, siteOrigin, spaUrls } from "./core.server-CCQ4QOJl.js";
import { adapterFor } from "./adapters.server-ZQIEsFyD.js";
import { platformOrigin } from "./bridge.server-c7Pb_dyX.js";
//#region src/lib/gateways/flows.server.ts
/** Callback (return/IPN) URLs must land where the privileged key exists. */
async function callbackBase() {
	return await platformOrigin(siteOrigin());
}
/**
* The storefront/dashboard origin the person is actually browsing. The browser
* sends it (the request may have been proxied, so headers can point at the
* platform host), and it is validated against the hosts we own before use.
*/
async function shopperOrigin(raw) {
	const here = siteOrigin();
	if (!raw) return here.replace(/\/+$/, "");
	return (await resolveReturnTarget(raw, here)).replace(/\/+$/, "");
}
function ipnFor(provider, origin, params) {
	if (provider === "sslcommerz") return `${origin}/api/public/payment/sslcommerz-ipn`;
	if (provider === "epayseba") return `${origin}/api/public/payment/epayseba-webhook`;
	return returnUrl(origin, provider, {
		...params,
		t: "ipn"
	});
}
async function startOrderPaymentFlow(input) {
	const order = await loadOrder(input.orderNumber);
	if (order.payment_status === "paid") throw new Response("This order is already paid", { status: 400 });
	{
		const { data: store } = await (await admin()).from("resellers").select("id").eq("code", input.code).maybeSingle();
		const storeId = store?.id ?? null;
		if ((order.reseller_id ?? null) !== storeId) throw new Response("Order not found", { status: 404 });
	}
	const creds = await getCredentials(input.provider, order.reseller_id);
	if (!creds) throw new Response("This payment gateway is not available", { status: 400 });
	const store = await shopperOrigin(input.storeOrigin);
	const cb = await callbackBase();
	const spa = spaUrls(store, input.code, order.order_number);
	const params = {
		on: order.order_number,
		su: spa.success,
		cu: spa.cancel,
		code: input.code,
		sig: await signTargets(spa.success, spa.cancel)
	};
	const urls = {
		returnUrl: returnUrl(cb, input.provider, {
			...params,
			t: "success"
		}),
		failUrl: returnUrl(cb, input.provider, {
			...params,
			t: "fail"
		}),
		cancelUrl: returnUrl(cb, input.provider, {
			...params,
			t: "cancel"
		}),
		ipnUrl: ipnFor(input.provider, cb, params)
	};
	try {
		const res = await adapterFor(input.provider).create(creds, order, urls);
		await (await admin()).from("orders").update({
			payment_provider: input.provider,
			transaction_id: res.ref || order.transaction_id || null
		}).eq("id", order.id);
		return { redirectUrl: res.paymentUrl };
	} catch (err) {
		throw new Response(extractGatewayError(err), { status: 502 });
	}
}
async function verifyOrderPaymentFlow(input) {
	const order = await loadOrder(input.orderNumber);
	if (order.payment_status === "paid") return {
		status: "paid",
		amount: Number(order.paid_amount ?? order.total)
	};
	const provider = order.payment_provider;
	if (!provider) return {
		status: "unpaid",
		amount: 0
	};
	const creds = await getCredentials(provider, order.reseller_id);
	if (!creds) return {
		status: "unpaid",
		amount: 0
	};
	try {
		const v = await adapterFor(provider).verifyReturn(creds, order, {});
		const outcome = await settlePayment({
			order,
			provider,
			paid: v.paid,
			amount: v.amount,
			txnId: v.txnId,
			owner: creds.owner
		});
		return {
			status: outcome === "already" ? "paid" : outcome,
			amount: v.amount
		};
	} catch {
		return {
			status: "unpaid",
			amount: 0
		};
	}
}
async function listStoreGatewaysFlow(input) {
	const db = await admin();
	const { data: reseller } = await db.from("resellers").select("id").eq("code", input.code).maybeSingle();
	const resellerId = reseller?.id ?? null;
	const { data: rows } = await db.from("payment_gateway_configs").select("provider,label,is_active,reseller_id,mode");
	const out = [];
	for (const spec of GATEWAYS) {
		const row = resolveGatewayRow((rows ?? []).filter((r) => r.provider === spec.provider), resellerId);
		if (row) out.push({
			provider: spec.provider,
			label: row.label || spec.label,
			method: spec.method
		});
	}
	return out;
}
async function listDepositGatewaysFlow() {
	const { data: rows } = await (await admin()).from("payment_gateway_configs").select("provider,label,is_active,reseller_id").is("reseller_id", null).eq("is_active", true);
	const out = [];
	for (const spec of GATEWAYS) {
		const row = (rows ?? []).find((r) => r.provider === spec.provider);
		if (row) out.push({
			provider: spec.provider,
			label: row.label || spec.label
		});
	}
	return out;
}
/**
* Starts a reseller security-deposit payment. `userId` is always a verified
* caller identity (auth middleware on this origin, or a validated bearer token
* on the bridge route).
*/
async function startDepositFlow(input) {
	const db = await admin();
	const { data: reseller } = await db.from("resellers").select("id,business_name,contact_phone").eq("user_id", input.userId).maybeSingle();
	if (!reseller) throw new Response("Reseller account not found", { status: 400 });
	const creds = await getPlatformCredentials(input.provider);
	if (!creds) throw new Response("This payment gateway is not available", { status: 400 });
	const code = newDepositCode();
	const { data: intentRow, error } = await db.from("deposit_requests").insert({
		reseller_id: reseller.id,
		amount: input.amount,
		code,
		provider: input.provider,
		method: input.provider,
		status: "pending",
		note: "Online payment (awaiting gateway confirmation)"
	}).select("id,code,reseller_id,amount,status,provider,txn_id").single();
	if (error || !intentRow) throw new Response("Could not start the payment", { status: 500 });
	const store = await shopperOrigin(input.storeOrigin);
	const cb = await callbackBase();
	const back = `${store}/reseller/payouts`;
	const params = {
		on: code,
		su: back,
		cu: back,
		k: "deposit",
		code,
		sig: await signTargets(back, back)
	};
	const urls = {
		returnUrl: returnUrl(cb, input.provider, {
			...params,
			t: "success"
		}),
		failUrl: returnUrl(cb, input.provider, {
			...params,
			t: "fail"
		}),
		cancelUrl: returnUrl(cb, input.provider, {
			...params,
			t: "cancel"
		}),
		ipnUrl: ipnFor(input.provider, cb, params)
	};
	const pseudo = depositAsOrder(intentRow, {
		name: reseller.business_name ?? void 0,
		phone: reseller.contact_phone ?? void 0
	});
	try {
		const res = await adapterFor(input.provider).create(creds, pseudo, urls);
		await db.from("deposit_requests").update({ txn_id: res.ref || null }).eq("id", intentRow.id);
		return {
			redirectUrl: res.paymentUrl,
			code
		};
	} catch (err) {
		await db.from("deposit_requests").delete().eq("id", intentRow.id);
		throw new Response(extractGatewayError(err), { status: 502 });
	}
}
//#endregion
export { listDepositGatewaysFlow, listStoreGatewaysFlow, startDepositFlow, startOrderPaymentFlow, verifyOrderPaymentFlow };
