import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { s as createSsrRpc } from "./client-DipTEthi.js";
import { a as literalType, l as stringType, o as numberType, r as booleanType, s as objectType, u as unionType } from "./types-CX4iBvKD.js";
import { t as requireSupabaseAuth } from "./auth-middleware-XRMpJ1R8.js";
//#region src/lib/couriers.functions.ts
objectType({ orderId: stringType().uuid() });
var bookSteadfast = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	orderId: stringType().uuid(),
	deliveryType: unionType([literalType(0), literalType(1)]).optional(),
	note: stringType().max(250).optional()
}).parse(d)).handler(createSsrRpc("001f301805823a9a33fb895039f6966747c37e6b00cf9d0ff65f0b2b1dc177f4"));
var syncSteadfastStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ shipmentId: stringType().uuid() }).parse(d)).handler(createSsrRpc("c6c49de3f6491227dbde551eed3b3c2bcc4231efb3b653002613be16142ca04e"));
var steadfastBalance = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("aff1d786710b9d77b701bd384f82b9cb5f8077df2c8ed8bba29d96454eed4d3c"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	shipmentId: stringType().uuid(),
	reason: stringType().max(250).optional()
}).parse(d)).handler(createSsrRpc("cbee74248449b8a4d553cd0324b2a8d9655c29f66702f8f06d81f81ef42b0d63"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("09a36651d35e563d9fe3b0b7b020c13c911cd416bf36c415a9ad5b688016acb7"));
var pathaoStores = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("b18dc65a5f691f980c59625d8d1a51d04d874a911a87888db07e04793dafe02c"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	cityId: numberType().int().positive(),
	zoneId: numberType().int().positive(),
	itemWeight: numberType().min(.5).max(10).optional(),
	deliveryType: unionType([literalType(48), literalType(12)]).optional()
}).parse(d)).handler(createSsrRpc("5ef461c68e087dd3174ea95d6fccedbfbe64a7d53c821807d091838bcf528060"));
var bookPathao = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	orderId: stringType().uuid(),
	deliveryType: unionType([literalType(48), literalType(12)]).optional(),
	itemWeight: numberType().min(.5).max(10).optional(),
	storeId: stringType().min(1).optional(),
	note: stringType().max(250).optional()
}).parse(d)).handler(createSsrRpc("3e1e835105145ed11d6462bb9008fc961d3864f55f9dfb385a0607be31e6a8e9"));
var syncPathaoStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ shipmentId: stringType().uuid() }).parse(d)).handler(createSsrRpc("bf9fef4de90b0c28b27f72e812816bf09ba4d58c398bb34af3a5cd424483b5a2"));
var carrybeeStores = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("efa9c1cc7e47e394a824fe343d7aec5795c6ffd99d57a9bb24b4fe67ce773ea1"));
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
}).parse(d)).handler(createSsrRpc("c26c98eccbf050f9e75273e64ae1e834863c11cb55676e87694e5630f398daf9"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ shipmentId: stringType().uuid() }).parse(d)).handler(createSsrRpc("f6aedff16c5414dd6af4bbe284597f8a5ec8f2970dcd28e0deddc7b1a23b3ad1"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	shipmentId: stringType().uuid(),
	reason: stringType().min(2).max(200)
}).parse(d)).handler(createSsrRpc("06f673abc878ba68cd29da9f7f659e38d51f02519774e4f1f86005a1b0922cef"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	shipmentId: stringType().uuid(),
	reason: stringType().max(255).optional(),
	itemWeight: numberType().int().min(1).max(25e3).optional()
}).parse(d)).handler(createSsrRpc("97475f4e40a1db424670c9b39d952f4cf25210e54fcc58f1c87fddaa47984a70"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	shipmentId: stringType().uuid(),
	collectableAmount: numberType().int().min(0).max(1e5).optional(),
	itemWeight: numberType().int().min(1).max(25e3).optional(),
	note: stringType().max(255).optional()
}).parse(d)).handler(createSsrRpc("e3d33cd807c704c01bb2e3fb9ae87fed5f52f1b93e3a5af134dbffd0d3a9cfe0"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	orderId: stringType().uuid(),
	note: stringType().max(250).optional()
}).parse(d)).handler(createSsrRpc("f58ccdc3f930a666d9481586d8f27f89c5fb10084df43473a57064dd6763c684"));
/**
* Background safety net: whenever an order list is opened, refresh the courier
* status of shipments that were not synced in the last few minutes. Keeps order
* statuses correct even when a courier webhook never arrives.
*/
var autoSyncCourierStatuses = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("af4a642ab2d69f88752b6f42a86d288f49c60e668c186ad36570e8c718a6ef64"));
//#endregion
//#region src/assets/couriers/steadfast-mark.png
var steadfast_mark_default = "/assets/steadfast-mark-Diw_GgYE.png";
//#endregion
//#region src/assets/couriers/steadfast-wordmark.png
var steadfast_wordmark_default = "/assets/steadfast-wordmark-DHX2TqLv.png";
//#endregion
//#region src/assets/couriers/pathao-mark.png
var pathao_mark_default = "/assets/pathao-mark-D88dviss.png";
//#endregion
//#region src/assets/couriers/pathao-wordmark.png
var pathao_wordmark_default = "/assets/pathao-wordmark-CCltI6Ge.png";
//#endregion
//#region src/assets/couriers/carrybee-mark.png
var carrybee_mark_default = "/assets/carrybee-mark-5-op3OiH.png";
//#endregion
//#region src/assets/couriers/carrybee-wordmark.png
var carrybee_wordmark_default = "/assets/carrybee-wordmark-D3ca_14W.png";
//#endregion
//#region src/components/courier-brand.tsx
var import_jsx_runtime = require_jsx_runtime();
var COURIER_BRANDS = {
	steadfast: {
		id: "steadfast",
		label: "Steadfast Courier",
		mark: steadfast_mark_default,
		wordmark: steadfast_wordmark_default
	},
	pathao: {
		id: "pathao",
		label: "Pathao Courier",
		mark: pathao_mark_default,
		wordmark: pathao_wordmark_default
	},
	carrybee: {
		id: "carrybee",
		label: "CarryBee",
		mark: carrybee_mark_default,
		wordmark: carrybee_wordmark_default
	}
};
COURIER_BRANDS.steadfast, COURIER_BRANDS.pathao, COURIER_BRANDS.carrybee;
function courierBrand(provider) {
	if (!provider) return null;
	const id = {
		steadfast: "steadfast",
		steadfastcourier: "steadfast",
		pathao: "pathao",
		pathaocourier: "pathao",
		carrybee: "carrybee",
		carybee: "carrybee"
	}[String(provider).trim().toLowerCase().replace(/[\s_-]+/g, "")];
	return id ? COURIER_BRANDS[id] : null;
}
function courierLabel(provider) {
	return courierBrand(provider)?.label ?? (provider ? String(provider) : "—");
}
/** Logo image only. `variant="mark"` = square icon, `variant="wordmark"` = full logo. */
function CourierLogo({ provider, variant = "mark", className, size = 20 }) {
	const brand = courierBrand(provider);
	if (!brand) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: variant === "wordmark" ? brand.wordmark : brand.mark,
		alt: `${brand.label} logo`,
		loading: "lazy",
		className: className ?? "object-contain",
		style: variant === "wordmark" ? {
			height: size,
			width: "auto"
		} : {
			height: size,
			width: size
		}
	});
}
//#endregion
export { autoSyncCourierStatuses as a, bookSteadfast as c, steadfastBalance as d, syncPathaoStatus as f, courierLabel as i, carrybeeStores as l, CourierLogo as n, bookCarrybee as o, syncSteadfastStatus as p, courierBrand as r, bookPathao as s, COURIER_BRANDS as t, pathaoStores as u };
