import { jsx } from "react/jsx-runtime";
//#region src/assets/payments/bkash.png
var bkash_default = "/assets/bkash-Bpdzx_zW.png";
//#endregion
//#region src/assets/payments/nagad.png
var nagad_default = "/assets/nagad-jxz1g9vP.png";
//#endregion
//#region src/assets/payments/rocket.png
var rocket_default = "/assets/rocket-fFN0uXjE.png";
//#endregion
//#region src/assets/payments/other.png
var other_default = "/assets/other-CV-XLDti.png";
//#endregion
//#region src/components/payments/payment-brand.tsx
/**
* Hardcoded payment brand logos (transparent PNG, uniform square).
* Keyed by manual method value and by automatic gateway provider,
* so a single lookup covers both families.
*/
var PAYMENT_LOGOS = {
	bkash: bkash_default,
	nagad: nagad_default,
	rocket: rocket_default,
	other: other_default,
	bank: other_default,
	cash: other_default,
	sslcommerz: "/assets/sslcommerz-Bh5zxik7.png",
	shurjopay: "/assets/shurjopay-BofEcCij.png",
	eps: "/assets/eps-CnPOVO4N.png",
	aamarpay: "/assets/aamarpay-BB-_85Od.png",
	epayseba: "/assets/epayseba-fCWLjva0.png"
};
function paymentLogo(key) {
	if (!key) return null;
	return PAYMENT_LOGOS[String(key).trim().toLowerCase().replace(/[\s_-]+/g, "")] ?? null;
}
/** Logo tile. Falls back to `null` so callers can render their own icon.
*  Brand logos are wide (landscape) content painted onto square canvases with
*  heavy vertical padding, so `fit="cover"` in a landscape box shows the actual
*  mark much larger than the old square `contain` tile. */
function PaymentLogo({ method, size = 36, width, height, fit = "contain", className, alt }) {
	const src = paymentLogo(method);
	if (!src) return null;
	const w = width ?? size;
	const h = height ?? size;
	return /* @__PURE__ */ jsx("img", {
		src,
		alt: alt ?? `${method} logo`,
		loading: "eager",
		decoding: "async",
		width: w,
		height: h,
		className: className ?? "shrink-0 rounded-lg",
		style: {
			width: w,
			height: h,
			objectFit: fit
		}
	});
}
//#endregion
export { paymentLogo as n, PaymentLogo as t };
