import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as createServerRpc } from "./createServerRpc-BQTLusYf.js";
import { c as recordType, l as stringType, o as numberType, s as objectType, t as anyType } from "./types-CX4iBvKD.js";
import { t as requireSupabaseAuth } from "./auth-middleware-f2jdqIGt.js";
//#region src/lib/gateways.functions.ts?tss-serverfn-split
/**
* Automatic payment gateway server functions.
*
* - startGatewayPayment / verifyGatewayPayment are public: they only accept an
*   order number and derive every amount server-side, so nothing can be tampered.
* - testGatewayConnection is admin-only.
*/
var startGatewayPayment_createServerFn_handler = createServerRpc({
	id: "cc007cf8ae2a66d9f97322ac2249116a514a5c0cf420d3fdb9c5b408a9499ee5",
	name: "startGatewayPayment",
	filename: "src/lib/gateways.functions.ts"
}, (opts) => startGatewayPayment.__executeServer(opts));
var startGatewayPayment = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	orderNumber: stringType().min(3),
	code: stringType().min(1),
	provider: stringType().min(2),
	storeOrigin: stringType().url().optional()
}).parse(d)).handler(startGatewayPayment_createServerFn_handler, async ({ data }) => {
	const bridge = await import("./bridge.server-CnhwbLXz.js");
	if (!bridge.hasPrivilegedDb()) return await bridge.forwardToPlatform("order-start", {
		...data,
		origin: data.storeOrigin
	});
	return await (await import("./flows.server-DPFb5hlC.js")).startOrderPaymentFlow(data);
});
var verifyGatewayPayment_createServerFn_handler = createServerRpc({
	id: "c6f99ee48e8966e2cf5d9809672b059b3eee14dd1a20f71e0a9e7958484aec51",
	name: "verifyGatewayPayment",
	filename: "src/lib/gateways.functions.ts"
}, (opts) => verifyGatewayPayment.__executeServer(opts));
var verifyGatewayPayment = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ orderNumber: stringType().min(3) }).parse(d)).handler(verifyGatewayPayment_createServerFn_handler, async ({ data }) => {
	const bridge = await import("./bridge.server-CnhwbLXz.js");
	if (!bridge.hasPrivilegedDb()) return await bridge.forwardToPlatform("order-verify", data);
	return await (await import("./flows.server-DPFb5hlC.js")).verifyOrderPaymentFlow(data);
});
var testGatewayConnection_createServerFn_handler = createServerRpc({
	id: "61be1c0e51703e4f38365275edd8a61e225ee9cf23862305e2715de694202738",
	name: "testGatewayConnection",
	filename: "src/lib/gateways.functions.ts"
}, (opts) => testGatewayConnection.__executeServer(opts));
var testGatewayConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	provider: stringType().min(2),
	api_key: stringType().optional(),
	api_secret: stringType().optional(),
	merchant_id: stringType().optional(),
	config: recordType(stringType(), anyType()).optional()
}).parse(d)).handler(testGatewayConnection_createServerFn_handler, async ({ data, context }) => {
	const { data: isAdmin } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "super_admin"
	});
	const { data: resellerId } = isAdmin ? { data: null } : await context.supabase.rpc("current_reseller_id");
	if (!isAdmin && !resellerId) throw new Response("Forbidden", { status: 403 });
	const { adapterFor } = await import("./adapters.server-DMOFLAEk.js");
	const { credsFromRaw } = await import("./core.server-Ciil5J1N.js");
	const { extractGatewayError } = await import("./registry-I6SFzk_W.js").then((n) => n.a);
	try {
		await adapterFor(data.provider).test(credsFromRaw(data.provider, data));
		return { success: true };
	} catch (err) {
		return {
			success: false,
			error: extractGatewayError(err)
		};
	}
});
var listActiveGateways_createServerFn_handler = createServerRpc({
	id: "6ac466176123e702a9e1862b22d0b9ef078301e8886b40cb1f9908f5060c1ead",
	name: "listActiveGateways",
	filename: "src/lib/gateways.functions.ts"
}, (opts) => listActiveGateways.__executeServer(opts));
var listActiveGateways = createServerFn({ method: "GET" }).inputValidator((d) => objectType({ code: stringType().min(1) }).parse(d)).handler(listActiveGateways_createServerFn_handler, async ({ data }) => {
	const bridge = await import("./bridge.server-CnhwbLXz.js");
	if (!bridge.hasPrivilegedDb()) return await bridge.forwardToPlatform("list-store", data);
	return await (await import("./flows.server-DPFb5hlC.js")).listStoreGatewaysFlow(data);
});
var listDepositGateways_createServerFn_handler = createServerRpc({
	id: "7a3a61ebdab3f94d6b070d574b3b774d65713c6f8bc2cefca575d230ccf835ac",
	name: "listDepositGateways",
	filename: "src/lib/gateways.functions.ts"
}, (opts) => listDepositGateways.__executeServer(opts));
var listDepositGateways = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listDepositGateways_createServerFn_handler, async () => {
	const bridge = await import("./bridge.server-CnhwbLXz.js");
	if (!bridge.hasPrivilegedDb()) return await bridge.forwardToPlatform("list-deposit", {}, bridge.incomingAuthorization());
	return await (await import("./flows.server-DPFb5hlC.js")).listDepositGatewaysFlow();
});
var startDepositPayment_createServerFn_handler = createServerRpc({
	id: "b0c7ea11b96f2e34c093f44892c4072d9d211f574f6f6d096d007888e9a227c8",
	name: "startDepositPayment",
	filename: "src/lib/gateways.functions.ts"
}, (opts) => startDepositPayment.__executeServer(opts));
var startDepositPayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	provider: stringType().min(2),
	amount: numberType().positive().max(1e7),
	storeOrigin: stringType().url().optional()
}).parse(d)).handler(startDepositPayment_createServerFn_handler, async ({ data, context }) => {
	const bridge = await import("./bridge.server-CnhwbLXz.js");
	if (!bridge.hasPrivilegedDb()) return await bridge.forwardToPlatform("deposit-start", {
		...data,
		origin: data.storeOrigin
	}, bridge.incomingAuthorization());
	return await (await import("./flows.server-DPFb5hlC.js")).startDepositFlow({
		...data,
		userId: context.userId
	});
});
//#endregion
export { listActiveGateways_createServerFn_handler, listDepositGateways_createServerFn_handler, startDepositPayment_createServerFn_handler, startGatewayPayment_createServerFn_handler, testGatewayConnection_createServerFn_handler, verifyGatewayPayment_createServerFn_handler };
