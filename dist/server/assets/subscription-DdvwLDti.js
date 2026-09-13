import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { a as fmtDate, c as requestManualPayment, d as savingPercent, m as statusLabel, n as cycleLabel, o as payFromEarning, r as fetchMySubscription, s as planPrice, t as CYCLES } from "./subscription-G38XYjIE.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { An as CreditCard, Ht as LayoutDashboard, I as ShieldCheck, Nt as LoaderCircle, S as Store, a as Wallet, tr as Check } from "./vendor-icons-DF2A5Z8S.js";
import { n as PageHeader, r as StatCard, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { r as bdt } from "./finance-report-Dwy2dA23.js";
import { r as cfgString } from "./payment-methods-r79RAKh_.js";
import { t as AppModal } from "./AppModal-BVNHKlfq.js";
//#region src/routes/_authenticated/reseller/subscription.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SubscriptionPage() {
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [checkout, setCheckout] = (0, import_react.useState)(null);
	async function load() {
		try {
			setData(await fetchMySubscription());
		} catch (e) {
			toast.error(e.message);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const state = data?.state;
	const available = Math.max(0, Number(data?.balance ?? 0) - Number(data?.frozen ?? 0));
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "My subscription",
				description: "Your plan decides what stays open — the panel alone, or the panel plus your public store."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Current plan",
						value: state?.plan_name ?? "No plan",
						hint: state?.includes_store ? "Panel + storefront" : "Panel only",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Status",
						value: statusLabel(state?.status),
						hint: state?.status === "grace" ? `${state.grace_days_left ?? 0} day(s) of grace left` : `${state?.days_left ?? 0} day(s) left`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Renews / expires",
						value: fmtDate(state?.ends_at),
						hint: "End of the paid period",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Available balance",
						value: bdt(available),
						hint: "Earnings you can spend",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
					})
				]
			}),
			state?.status === "grace" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card border-amber-500/40 bg-amber-500/10 p-4 text-xs font-medium text-amber-700 dark:text-amber-400",
				children: [
					"Your plan ended on ",
					fmtDate(state.current_period_end ?? state.ends_at),
					". You have",
					" ",
					state.grace_days_left ?? 0,
					" day(s) of grace access left — renew now to avoid losing the panel and your store."
				]
			}) : null,
			state?.status === "expired" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card border-destructive/40 bg-destructive/10 p-4 text-xs font-medium text-destructive",
				children: "Your subscription has expired. Renew below to unlock the panel, your storefront and new orders."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: (data?.plans ?? []).map((plan) => {
					const current = state?.plan_id === plan.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-5 " + (current ? "ring-1 ring-primary" : ""),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-start justify-between gap-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										plan.includes_store ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4 text-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-semibold",
											children: plan.name
										}),
										current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary",
											children: "Current"
										}) : null
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: plan.description
								})] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 space-y-1 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-success" }), " Reseller panel, catalog and orders"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 " + (plan.includes_store ? "text-success" : "text-muted-foreground/40") }),
											"Public storefront and custom domain ",
											plan.includes_store ? "" : "(not included)"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-success" }),
											" ",
											plan.trial_days,
											" day free trial · ",
											plan.grace_days,
											" day grace"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 grid grid-cols-2 gap-2",
								children: CYCLES.map((m) => {
									const save = savingPercent(plan, m);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setCheckout({
											plan,
											months: m
										}),
										className: "rounded-lg border p-3 text-left transition hover:border-primary hover:bg-muted/40",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] font-medium text-muted-foreground",
												children: cycleLabel(m)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-semibold tabular-nums",
												children: bdt(planPrice(plan, m))
											}),
											save > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] font-semibold text-success",
												children: [
													"Save ",
													save,
													"%"
												]
											}) : null
										]
									}, m);
								})
							})
						]
					}, plan.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentHistory, { rows: data?.payments ?? [] }),
			checkout ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutModal, {
				plan: checkout.plan,
				months: checkout.months,
				available,
				methods: data?.methods ?? [],
				onClose: () => setCheckout(null),
				onDone: () => {
					setCheckout(null);
					load();
				}
			}) : null
		]
	});
}
function PaymentHistory({ rows }) {
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No subscription payments yet",
		description: "Your renewals will be listed here."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden grid-cols-[1fr_1fr_auto_auto_auto] gap-4 rounded-t-lg border-b bg-muted/40 px-4 py-2 text-center text-xs font-medium text-muted-foreground md:grid",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-left",
					children: "Plan"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-left",
					children: "Paid with"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Period" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Amount" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Status" })
			]
		}), rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 items-center gap-1 border-b px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1fr_1fr_auto_auto_auto] md:gap-4 md:text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-left text-xs font-medium",
					children: [
						p.note ?? "Subscription",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: ["· ", cycleLabel(p.cycle_months)]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-left text-xs text-muted-foreground",
					children: [p.source === "earning" ? "From earnings" : p.source === "admin" ? "Added by admin" : p.method ?? "Manual", p.reference ? ` · ${p.reference}` : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs tabular-nums text-muted-foreground",
					children: fmtDate(p.period_to)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-semibold tabular-nums",
					children: bdt(Number(p.amount))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full px-2 py-0.5 text-[10px] font-semibold " + (p.status === "paid" ? "bg-success/15 text-success" : p.status === "rejected" ? "bg-destructive/15 text-destructive" : "bg-amber-500/15 text-amber-700 dark:text-amber-400"),
					children: p.status
				}) })
			]
		}, p.id))]
	});
}
function CheckoutModal({ plan, months, available, methods, onClose, onDone }) {
	const amount = planPrice(plan, months);
	const [tab, setTab] = (0, import_react.useState)(available >= amount ? "earning" : "manual");
	const [methodId, setMethodId] = (0, import_react.useState)(methods[0]?.id ?? "");
	const [reference, setReference] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const method = (0, import_react.useMemo)(() => methods.find((m) => m.id === methodId) ?? null, [methods, methodId]);
	async function submit() {
		setBusy(true);
		try {
			if (tab === "earning") {
				await payFromEarning(plan.id, months);
				toast.success("Subscription renewed from your earnings");
			} else {
				if (!reference.trim()) throw new Error("Enter the transaction ID you paid with");
				await requestManualPayment({
					planId: plan.id,
					months,
					paymentConfigId: methodId || null,
					reference,
					note
				});
				toast.success("Payment submitted — admin will verify it shortly");
			}
			onDone();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppModal, {
		title: `${plan.name} · ${cycleLabel(months)}`,
		subtitle: `Total payable ${bdt(amount)}`,
		onClose,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-end gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				className: "rounded-md border px-3 py-1.5 text-xs font-medium",
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: busy,
				onClick: submit,
				className: "inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60",
				children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : null, tab === "earning" ? "Pay from earnings" : "Submit payment"]
			})]
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 inline-flex rounded-xl border bg-muted/30 p-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab("earning"),
				className: "rounded-lg px-3 py-1.5 text-xs font-semibold " + (tab === "earning" ? "bg-card shadow-sm" : "text-muted-foreground"),
				children: "From earnings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab("manual"),
				className: "rounded-lg px-3 py-1.5 text-xs font-semibold " + (tab === "manual" ? "bg-card shadow-sm" : "text-muted-foreground"),
				children: "Wallet / bank payment"
			})]
		}), tab === "earning" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-lg border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Available balance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold tabular-nums",
						children: bdt(available)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-lg border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Subscription fee"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold tabular-nums",
						children: ["-", bdt(amount)]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-lg border bg-muted/30 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Balance after payment"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold tabular-nums",
						children: bdt(available - amount)
					})]
				}),
				available < amount ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-destructive",
					children: "Not enough balance — pay by wallet / bank instead, or wait until more orders are settled."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "The fee is deducted immediately and appears in your transaction report as money out."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block font-medium",
					children: "Payment method"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: methodId,
					onChange: (e) => setMethodId(e.target.value),
					className: "w-full rounded-md border bg-background px-3 py-2 text-xs",
					children: [methods.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "No method configured"
					}) : null, methods.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: m.id,
						children: m.label
					}, m.id))]
				})] }),
				method ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border bg-muted/30 p-3",
					children: [cfgString(method.config, "account") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-semibold",
						children: [
							cfgString(method.config, "account"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: cfgString(method.config, "account_type")
							})
						]
					}) : null, method.instructions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-muted-foreground",
						children: method.instructions
					}) : null]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block font-medium",
					children: "Transaction ID"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: reference,
					onChange: (e) => setReference(e.target.value),
					placeholder: "e.g. 9F7C2K1LMN",
					className: "w-full rounded-md border bg-background px-3 py-2 text-xs"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block font-medium",
					children: "Note (optional)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: note,
					onChange: (e) => setNote(e.target.value),
					className: "w-full rounded-md border bg-background px-3 py-2 text-xs"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Your plan is extended once admin verifies the payment. Manual payments do not touch your earning balance."
				})
			]
		})]
	});
}
//#endregion
export { SubscriptionPage as component };
