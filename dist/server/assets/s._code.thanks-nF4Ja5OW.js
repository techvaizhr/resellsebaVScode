import { t as createServerFn } from "./createServerFn-CIHAFgYl.js";
import { r as supabase, s as createSsrRpc } from "./client-BpJCBCUq.js";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.js";
import { t as Route } from "./s._code.thanks-CzZ8gmYX.js";
import { o as verifyGatewayPayment } from "./gateways.functions-CXGwAmYF.js";
import { a as PrimaryButton, d as useStore, l as cx, m as trackPurchase, r as Heading, u as muted } from "./ui-CzBr4gZE.js";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { z } from "zod";
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from "lucide-react";
//#region src/lib/capi.functions.ts
var input = z.object({
	orderNumber: z.string().min(1),
	code: z.string().min(1),
	eventId: z.string().optional(),
	/** Storefront origin of the buyer's browser — keeps event URLs domain-agnostic. */
	origin: z.string().url().optional()
});
/**
* Server-side purchase tracking: fires Facebook CAPI + TikTok Events API
* using per-reseller marketing_configs. Public (no auth) but only accepts
* a real order_number and derives all values server-side, so it cannot be
* spammed with fake totals.
*/
var trackPurchaseServer = createServerFn({ method: "POST" }).inputValidator((d) => input.parse(d)).handler(createSsrRpc("8bb5e209c418913d27ff81a0997bec8bfe2a2d6ed727ae8e1f4b1f36eecb9bf7"));
//#endregion
//#region src/routes/s.$code.thanks.tsx?tsr-split=component
function Thanks() {
	const { code } = Route.useParams();
	const { n, pay, txn } = Route.useSearch();
	const fired = useRef(false);
	const { content } = useStore();
	const capi = useServerFn(trackPurchaseServer);
	const verifyPayment = useServerFn(verifyGatewayPayment);
	const [payState, setPayState] = useState(pay ? "checking" : "idle");
	/** An online payment came back — re-confirm with the gateway, never trust the URL. */
	useEffect(() => {
		if (!pay || !n) return;
		if (pay === "cancelled") {
			setPayState("cancelled");
			return;
		}
		setPayState("checking");
		verifyPayment({ data: { orderNumber: n } }).then((r) => setPayState(r.status === "paid" ? "paid" : r.status === "partial" ? "partial" : "failed")).catch(() => setPayState("failed"));
	}, [
		pay,
		n,
		verifyPayment
	]);
	useEffect(() => {
		if (!n || fired.current) return;
		fired.current = true;
		(async () => {
			const { data } = await supabase.from("orders").select("id,total,order_items(product_id,product_name,reseller_price,quantity)").eq("order_number", n).maybeSingle();
			if (!data) return;
			const eventId = `purchase_${data.id}`;
			trackPurchase({
				orderNumber: n,
				total: Number(data.total),
				items: (data.order_items ?? []).map((i) => ({
					id: i.product_id ?? "",
					name: i.product_name,
					price: Number(i.reseller_price),
					qty: i.quantity
				})),
				eventId
			});
			capi({ data: {
				orderNumber: n,
				code,
				eventId,
				origin: window.location.origin
			} }).catch(() => {});
		})();
	}, [
		n,
		code,
		capi
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-md px-4 py-20 text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--st-primary)]/15 text-[var(--st-primary)]",
				children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-8 w-8" })
			}),
			/* @__PURE__ */ jsx(Heading, {
				as: "h1",
				className: "mt-5 text-2xl md:text-3xl",
				children: content.text("co_success")
			}),
			/* @__PURE__ */ jsxs("p", {
				className: cx("mt-3 text-sm", muted),
				children: ["Order number: ", /* @__PURE__ */ jsx("span", {
					className: "font-mono font-semibold text-[var(--st-fg)]",
					children: n
				})]
			}),
			payState !== "idle" && /* @__PURE__ */ jsx(PaymentBanner, {
				state: payState,
				txn
			}),
			/* @__PURE__ */ jsx("p", {
				className: cx("mt-2 text-sm leading-relaxed", muted),
				children: content.text("co_success_note")
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-7 flex justify-center",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/s/$code",
					params: { code },
					children: /* @__PURE__ */ jsx(PrimaryButton, { children: "Continue shopping" })
				})
			})
		]
	});
}
/** Online-payment outcome, shown only when the customer returns from a gateway. */
function PaymentBanner({ state, txn }) {
	const m = {
		checking: {
			icon: /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
			title: "Confirming your payment…",
			tone: "border-[var(--st-border)] text-[var(--st-fg)]"
		},
		paid: {
			icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
			title: "Payment received",
			tone: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
		},
		failed: {
			icon: /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }),
			title: "Payment was not completed — the order is saved as unpaid",
			tone: "border-red-500/40 bg-red-500/10 text-red-600"
		},
		cancelled: {
			icon: /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }),
			title: "Payment cancelled — the order is saved as unpaid",
			tone: "border-amber-500/40 bg-amber-500/10 text-amber-600"
		},
		partial: {
			icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4" }),
			title: "Part of the bill is paid — the rest is due on delivery",
			tone: "border-amber-500/40 bg-amber-500/10 text-amber-600"
		}
	}[state];
	return /* @__PURE__ */ jsxs("div", {
		className: cx("mx-auto mt-5 flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold", m.tone),
		children: [
			m.icon,
			/* @__PURE__ */ jsx("span", { children: m.title }),
			txn && state === "paid" && /* @__PURE__ */ jsxs("span", {
				className: "font-mono font-normal opacity-80",
				children: ["#", txn]
			})
		]
	});
}
//#endregion
export { Thanks as component };
