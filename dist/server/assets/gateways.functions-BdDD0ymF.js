import { t as createServerFn } from "./createServerFn-CIHAFgYl.js";
import { s as createSsrRpc } from "./client-Be051lUg.js";
import { t as requireSupabaseAuth } from "./auth-middleware-l7OTet94.js";
import { z } from "zod";
//#region src/lib/gateways.functions.ts
/**
* Automatic payment gateway server functions.
*
* - startGatewayPayment / verifyGatewayPayment are public: they only accept an
*   order number and derive every amount server-side, so nothing can be tampered.
* - testGatewayConnection is admin-only.
*/
var startGatewayPayment = createServerFn({ method: "POST" }).inputValidator((d) => z.object({
	orderNumber: z.string().min(3),
	code: z.string().min(1),
	provider: z.string().min(2),
	storeOrigin: z.string().url().optional()
}).parse(d)).handler(createSsrRpc("cc007cf8ae2a66d9f97322ac2249116a514a5c0cf420d3fdb9c5b408a9499ee5"));
/** Called by the storefront success page after the browser comes back. */
var verifyGatewayPayment = createServerFn({ method: "POST" }).inputValidator((d) => z.object({ orderNumber: z.string().min(3) }).parse(d)).handler(createSsrRpc("c6f99ee48e8966e2cf5d9809672b059b3eee14dd1a20f71e0a9e7958484aec51"));
var testGatewayConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
	provider: z.string().min(2),
	api_key: z.string().optional(),
	api_secret: z.string().optional(),
	merchant_id: z.string().optional(),
	config: z.record(z.string(), z.any()).optional()
}).parse(d)).handler(createSsrRpc("61be1c0e51703e4f38365275edd8a61e225ee9cf23862305e2715de694202738"));
/** Public: which automatic gateways a storefront may show (no credentials leak). */
var listActiveGateways = createServerFn({ method: "GET" }).inputValidator((d) => z.object({ code: z.string().min(1) }).parse(d)).handler(createSsrRpc("6ac466176123e702a9e1862b22d0b9ef078301e8886b40cb1f9908f5060c1ead"));
/** Reseller: which automatic gateways the admin keeps active for deposits. */
var listDepositGateways = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("7a3a61ebdab3f94d6b070d574b3b774d65713c6f8bc2cefca575d230ccf835ac"));
/**
* Reseller: start an online security-deposit payment.
* The amount is taken from the request, but the payment is only credited after
* the gateway itself confirms it on the return endpoint.
*/
var startDepositPayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
	provider: z.string().min(2),
	amount: z.number().positive().max(1e7),
	storeOrigin: z.string().url().optional()
}).parse(d)).handler(createSsrRpc("b0c7ea11b96f2e34c093f44892c4072d9d211f574f6f6d096d007888e9a227c8"));
//#endregion
export { testGatewayConnection as a, startGatewayPayment as i, listDepositGateways as n, verifyGatewayPayment as o, startDepositPayment as r, listActiveGateways as t };
