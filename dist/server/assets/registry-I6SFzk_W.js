import { n as __exportAll } from "./rolldown-runtime-JspESFgx.js";
//#region src/lib/gateways/registry.ts
var registry_exports = /* @__PURE__ */ __exportAll({
	GATEWAYS: () => GATEWAYS,
	extractGatewayError: () => extractGatewayError,
	gatewayBase: () => gatewayBase,
	gatewayByProvider: () => gatewayByProvider,
	gatewayLabel: () => gatewayLabel
});
var GATEWAYS = [
	{
		provider: "sslcommerz",
		label: "SSLCommerz",
		tagline: "Cards, all mobile wallets and net banking in one hosted checkout.",
		docs: "https://developer.sslcommerz.com/doc/v4/",
		method: "sslcommerz",
		hosts: { live: "https://securepay.sslcommerz.com" },
		fields: [{
			path: "api_key",
			label: "Store ID",
			placeholder: "yourstore0live",
			required: true,
			hint: "Merchant panel → API / Integration"
		}, {
			path: "api_secret",
			label: "Store password",
			placeholder: "yourstore0live@ssl",
			secret: true,
			required: true
		}],
		callbacks: [{
			path: "/api/public/payment/sslcommerz/return",
			label: "Return URL (success / fail / cancel)"
		}, {
			path: "/api/public/payment/sslcommerz-ipn",
			label: "IPN URL"
		}],
		returnFlag: "sslcommerz"
	},
	{
		provider: "bkash",
		label: "bKash (Tokenized Checkout)",
		tagline: "Customer pays inside bKash; payment is executed and confirmed automatically.",
		docs: "https://developer.bka.sh/",
		method: "bkash",
		hosts: { live: "https://tokenized.pay.bka.sh/v1.2.0-beta" },
		fields: [
			{
				path: "api_key",
				label: "App key",
				required: true
			},
			{
				path: "api_secret",
				label: "App secret",
				secret: true,
				required: true
			},
			{
				path: "merchant_id",
				label: "Merchant username",
				placeholder: "01700000000",
				required: true
			},
			{
				path: "config.password",
				label: "Merchant password",
				secret: true,
				required: true
			}
		],
		callbacks: [{
			path: "/api/public/payment/bkash/return",
			label: "Callback URL"
		}],
		returnFlag: "bkash"
	},
	{
		provider: "nagad",
		label: "Nagad",
		tagline: "Nagad merchant checkout signed and encrypted with your RSA key pair.",
		docs: "https://nagad.com.bd/",
		method: "nagad",
		hosts: { live: "https://api.mynagad.com/api/dfs" },
		fields: [
			{
				path: "merchant_id",
				label: "Merchant ID",
				placeholder: "683002007104225",
				required: true
			},
			{
				path: "api_key",
				label: "Merchant number",
				placeholder: "01700000000",
				required: true
			},
			{
				path: "api_secret",
				label: "Merchant private key (PKCS8 base64)",
				secret: true,
				multiline: true,
				required: true,
				hint: "Raw base64 only — no PEM header/footer and no line breaks"
			},
			{
				path: "config.pg_public_key",
				label: "Nagad PG public key (base64)",
				secret: true,
				multiline: true,
				required: true,
				hint: "Raw base64 only — no PEM header/footer and no line breaks"
			}
		],
		callbacks: [{
			path: "/api/public/payment/nagad/return",
			label: "Callback URL"
		}],
		returnFlag: "nagad"
	},
	{
		provider: "shurjopay",
		label: "ShurjoPay",
		tagline: "ShurjoPay aggregator — cards and every wallet through one checkout.",
		docs: "https://docs.shurjopay.com.bd/",
		method: "shurjopay",
		hosts: { live: "https://engine.shurjopayment.com/api" },
		fields: [
			{
				path: "api_key",
				label: "Username",
				required: true
			},
			{
				path: "api_secret",
				label: "Password",
				secret: true,
				required: true
			},
			{
				path: "merchant_id",
				label: "Prefix",
				placeholder: "sp",
				required: true
			}
		],
		callbacks: [{
			path: "/api/public/payment/shurjopay/return",
			label: "Return URL"
		}],
		returnFlag: "shurjopay"
	},
	{
		provider: "eps",
		label: "EPS",
		tagline: "EPS payment engine — token based initialize plus status check.",
		docs: "https://epsbd.com/",
		method: "eps",
		hosts: { live: "https://pgapi.eps.com.bd" },
		fields: [
			{
				path: "api_key",
				label: "Username",
				required: true
			},
			{
				path: "api_secret",
				label: "Password",
				secret: true,
				required: true
			},
			{
				path: "merchant_id",
				label: "Merchant ID (UUID)",
				required: true
			},
			{
				path: "config.store_id",
				label: "Store ID (UUID)",
				required: true
			}
		],
		callbacks: [{
			path: "/api/public/payment/eps/return",
			label: "Success / fail / cancel URL"
		}],
		returnFlag: "eps"
	},
	{
		provider: "aamarpay",
		label: "aamarPay",
		tagline: "aamarPay hosted checkout verified with the signature key.",
		docs: "https://aamarpay.readme.io/",
		method: "aamarpay",
		hosts: { live: "https://secure.aamarpay.com" },
		fields: [{
			path: "api_key",
			label: "Store ID",
			placeholder: "aamarpaytest",
			required: true
		}, {
			path: "api_secret",
			label: "Signature key",
			secret: true,
			required: true
		}],
		callbacks: [{
			path: "/api/public/payment/aamarpay/return",
			label: "Success / fail / cancel URL"
		}],
		returnFlag: "aamarpay"
	},
	{
		provider: "epayseba",
		label: "ePaySeba",
		tagline: "ePaySeba hosted checkout with webhook confirmation.",
		docs: "https://epayseba.com/developers/docs",
		method: "epayseba",
		hosts: { live: "https://pay.epayseba.com" },
		fields: [
			{
				path: "api_key",
				label: "API key (Brand key)",
				secret: true,
				required: true,
				hint: "ePaySeba panel → Brand Setting → copy your brand’s Brand Key and paste it here"
			},
			{
				path: "merchant_id",
				label: "Account Api Key (optional)",
				hint: "The panel’s Api Key — optional, not required"
			},
			{
				path: "api_secret",
				label: "Secret key (optional)",
				secret: true,
				hint: "Only used for webhook signature verification"
			}
		],
		callbacks: [{
			path: "/api/public/payment/epayseba/return",
			label: "Return URL"
		}, {
			path: "/api/public/payment/epayseba-webhook",
			label: "Webhook URL"
		}],
		returnFlag: "epayseba"
	}
];
GATEWAYS.map((g) => g.provider);
function gatewayByProvider(provider) {
	return GATEWAYS.find((g) => g.provider === provider);
}
/**
* API base URL for a gateway: the admin override from `config.base_url` when
* present, otherwise the production host from the registry. Trailing slashes
* are trimmed so adapters can always append a path.
*/
function gatewayBase(provider, config) {
	return ((typeof config?.base_url === "string" ? config.base_url.trim() : "") || gatewayByProvider(provider)?.hosts.live || "").replace(/\/+$/, "");
}
function gatewayLabel(provider) {
	return gatewayByProvider(provider)?.label ?? provider;
}
/** Turns provider/HTML noise into a short, user-friendly message. */
function extractGatewayError(raw) {
	const clean = (typeof raw === "string" ? raw : raw instanceof Error ? raw.message : String(raw ?? "")).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
	if (!clean) return "Payment could not be started. Please try again.";
	if (/request rejected|access denied|forbidden/i.test(clean)) return "Gateway rejected the request. Please try another payment method.";
	if (/timeout|timed out|aborted/i.test(clean)) return "Gateway did not respond in time. Please try again or choose another method.";
	return clean.slice(0, 220);
}
//#endregion
export { registry_exports as a, gatewayLabel as i, extractGatewayError as n, gatewayBase as r, GATEWAYS as t };
