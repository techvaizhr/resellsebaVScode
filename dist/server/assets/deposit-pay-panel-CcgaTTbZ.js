import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-BZQd8T2B.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { i as gatewayLabel } from "./registry-I6SFzk_W.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { H as Send, Ln as Clock, Nt as LoaderCircle, Vn as CircleX, _r as BadgeCheck, jn as Copy, t as Zap } from "./vendor-icons-DF2A5Z8S.js";
import { t as formatDate } from "./date-zfkEdx3e.js";
import { i as fetchDepositMethods, r as cfgString } from "./payment-methods-DogjUk3P.js";
import { r as startDepositPayment } from "./gateways.functions-Bxj5KN4I.js";
import { t as PaymentLogo } from "./payment-brand-DOxAYgjm.js";
//#region src/components/deposit-pay-panel.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
var bdt = (v) => `৳${Number(v || 0).toLocaleString("en-US")}`;
/** Reseller-facing: pay the security deposit with any active method. */
function DepositPayPanel({ resellerId, due, onSubmitted }) {
	const [methods, setMethods] = (0, import_react.useState)([]);
	const [requests, setRequests] = (0, import_react.useState)([]);
	const [selectedId, setSelectedId] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)(due && due > 0 ? String(due) : "");
	const [reference, setReference] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [gateways, setGateways] = (0, import_react.useState)([]);
	const startOnline = useServerFn(startDepositPayment);
	(0, import_react.useEffect)(() => {
		(async () => {
			const [list, gw] = await Promise.all([fetchDepositMethods(), supabase.rpc("get_active_payment_gateways")]);
			setMethods(list);
			setGateways((gw.data ?? []).map((g) => ({
				provider: g.provider,
				label: g.label || gatewayLabel(g.provider)
			})));
			setLoading(false);
		})();
	}, []);
	/** Unified, deduplicated list — manual first, then online gateways. */
	const unified = (0, import_react.useMemo)(() => {
		const manual = methods.map((m) => ({
			id: m.id,
			label: m.label,
			kind: "manual",
			method: m.method,
			account: cfgString(m.config, "account") || void 0,
			accountType: cfgString(m.config, "account_type") || void 0,
			instructions: m.instructions
		}));
		const online = gateways.map((g) => ({
			id: `gw:${g.provider}`,
			label: g.label,
			kind: "online",
			method: g.provider
		}));
		return [...manual, ...online];
	}, [methods, gateways]);
	(0, import_react.useEffect)(() => {
		if (!selectedId && unified.length > 0) setSelectedId(unified[0].id);
	}, [unified, selectedId]);
	const selected = unified.find((m) => m.id === selectedId) ?? null;
	(0, import_react.useEffect)(() => {
		if (resellerId) loadRequests();
	}, [resellerId]);
	async function loadRequests() {
		const { data } = await supabase.from("deposit_requests").select("id,amount,method,payment_config_id,reference,note,status,admin_note,created_at").eq("reseller_id", resellerId).order("created_at", { ascending: false }).limit(30);
		setRequests(data ?? []);
	}
	async function payOnline() {
		const amt = Number(amount);
		if (!(amt > 0)) return toast.error("Enter a valid amount");
		if (!selected || selected.kind !== "online") return toast.error("Select a payment method");
		const provider = selected.id.replace(/^gw:/, "");
		setBusy(true);
		try {
			const res = await startOnline({ data: {
				provider,
				amount: amt,
				storeOrigin: window.location.origin
			} });
			if (res?.redirectUrl) window.location.href = res.redirectUrl;
			else toast.error("Could not start the payment");
		} catch (err) {
			toast.error(typeof err?.message === "string" ? err.message : "Could not start the payment");
		} finally {
			setBusy(false);
		}
	}
	async function submitManual(e) {
		e.preventDefault();
		if (!resellerId) return;
		const amt = Number(amount);
		if (!(amt > 0)) return toast.error("Enter a valid amount");
		if (!selected || selected.kind !== "manual") return toast.error("Select a payment method");
		if (!reference.trim()) return toast.error("Transaction ID (TrxID) is required");
		setBusy(true);
		const { error } = await supabase.from("deposit_requests").insert({
			reseller_id: resellerId,
			amount: amt,
			method: selected.method,
			payment_config_id: selected.id,
			reference: reference.trim(),
			note: note.trim() || null
		});
		setBusy(false);
		if (error) return toast.error(error.message);
		setReference("");
		setNote("");
		toast.success("Deposit submitted — waiting for admin verification");
		loadRequests();
		onSubmitted?.();
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
	});
	if (unified.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground",
		children: "No payment method is active yet. Please contact support."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: unified.map((m) => {
					const active = m.id === selectedId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setSelectedId(m.id),
						className: "rounded-xl border p-3 text-left transition-colors " + (active ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "hover:bg-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex min-w-0 items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg border bg-background p-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentLogo, {
										method: m.method,
										size: 24
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-sm font-semibold",
										children: m.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide " + (m.kind === "online" ? "text-primary" : "text-muted-foreground"),
										children: m.kind === "online" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3 w-3" }), " Automatic"] }) : "Manual"
									})]
								})]
							}), active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-4 w-4 shrink-0 text-primary" })]
						}), m.account && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: m.account
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									role: "button",
									tabIndex: 0,
									onClick: (e) => {
										e.stopPropagation();
										navigator.clipboard.writeText(m.account);
										toast.success("Number copied");
									},
									onKeyDown: () => {},
									className: "rounded p-0.5 hover:bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
								}),
								m.accountType && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", m.accountType] })
							]
						})]
					}, m.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 grid gap-3 sm:grid-cols-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium",
						children: "Amount *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: amount,
						onChange: (e) => setAmount(e.target.value),
						className: inp,
						inputMode: "decimal",
						placeholder: "5000"
					})] }), selected?.kind === "manual" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium",
						children: "TrxID / reference *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: reference,
						onChange: (e) => setReference(e.target.value),
						className: inp,
						placeholder: "8N7A2K9QX1"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium",
						children: "Note"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: note,
						onChange: (e) => setNote(e.target.value),
						className: inp,
						placeholder: "Optional"
					})] })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end justify-end sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "You'll be taken to the gateway. The deposit is credited automatically once payment is confirmed — no admin approval needed."
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: selected?.kind === "manual" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: busy,
						onClick: (e) => void submitManual(e),
						className: "btn-brand inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold disabled:opacity-50",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), " Submit deposit"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: busy,
						onClick: () => void payOnline(),
						className: "btn-brand inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold disabled:opacity-50",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5" }), " Pay now"]
					})
				})]
			}),
			requests.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b bg-muted/30 px-4 py-2 text-xs font-semibold",
					children: "My deposit submissions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y",
					children: requests.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold tabular-nums",
								children: bdt(r.amount)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: r.reference ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: formatDate(r.created_at)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: r.status })
							}),
							r.admin_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full text-muted-foreground",
								children: ["Admin: ", r.admin_note]
							})
						]
					}, r.id))
				})]
			})
		]
	});
}
function StatusChip({ status }) {
	const map = {
		pending: {
			cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
			label: "Pending verification"
		},
		approved: {
			cls: "bg-success/15 text-success",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-3 w-3" }),
			label: "Approved"
		},
		rejected: {
			cls: "bg-destructive/15 text-destructive",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3 w-3" }),
			label: "Rejected"
		}
	};
	const it = map[status] ?? map.pending;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold " + it.cls,
		children: [
			it.icon,
			" ",
			it.label
		]
	});
}
//#endregion
export { StatusChip as n, DepositPayPanel as t };
