import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { D as formatDate, r as supabase } from "./client-DdbbmuGT.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { J as RefreshCw, Jn as ChevronDown, M as ShoppingCart, Mt as LoaderCircle, Tn as Copy, a as Wallet, c as Users, g as TrendingUp, rt as Phone, xt as MessageCircle, y as Target } from "./vendor-icons-BWIzFOtW.js";
import { n as PageHeader, r as StatCard, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { t as SearchableSelect } from "./searchable-select-Tf5ZWsr9.js";
import { a as bdt, l as waNumber, n as AGENT_SALES_HINT, s as buildAgentPerformance, t as AGENT_COMMISSION_HINT } from "./agents-CdVUfwxt.js";
import { n as DateRangeBar, r as inRange, t as DEFAULT_DATE_RANGE } from "./date-range-filter-oaWrNeww.js";
//#region src/routes/_authenticated/admin/agent-report.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AgentReportPage() {
	const [range, setRange] = (0, import_react.useState)(DEFAULT_DATE_RANGE);
	const [agentId, setAgentId] = (0, import_react.useState)("");
	const [agents, setAgents] = (0, import_react.useState)([]);
	const [resellers, setResellers] = (0, import_react.useState)([]);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [open, setOpen] = (0, import_react.useState)(null);
	async function load() {
		setLoading(true);
		const [a, r, o] = await Promise.all([
			supabase.from("agents").select("*").order("display_name"),
			supabase.from("resellers").select("id,business_name,code,status,contact_phone,agent_id"),
			supabase.from("orders").select("id,reseller_id,status,created_at,total,shipping_cost,sa_cost_total,received_amount,packaging_total").order("created_at", { ascending: false }).limit(5e3)
		]);
		if (o.error) toast.error(o.error.message);
		setAgents(a.data ?? []);
		setResellers(r.data ?? []);
		setOrders(o.data ?? []);
		setLoading(false);
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const scoped = (0, import_react.useMemo)(() => orders.filter((o) => inRange(o.created_at, range)), [orders, range]);
	const perf = (0, import_react.useMemo)(() => {
		return agents.filter((a) => !agentId || a.id === agentId).map((a) => buildAgentPerformance(a, resellers.filter((r) => r.agent_id === a.id), scoped)).sort((x, y) => y.sales - x.sales);
	}, [
		agents,
		resellers,
		scoped,
		agentId
	]);
	const totals = (0, import_react.useMemo)(() => perf.reduce((acc, p) => ({
		resellers: acc.resellers + p.resellerCount,
		orders: acc.orders + p.orders,
		sales: acc.sales + p.sales,
		profit: acc.profit + p.profit,
		target: acc.target + p.target
	}), {
		resellers: 0,
		orders: 0,
		sales: 0,
		profit: 0,
		target: 0
	}), [perf]);
	const agentName = (id) => agents.find((a) => a.id === id)?.display_name ?? "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Agent performance report",
				description: "Sales target vs achievement for every commission agent, plus how each assigned reseller is performing.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: load,
					className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 " + (loading ? "animate-spin" : "") }), " Refresh"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateRangeBar, {
					value: range,
					onChange: setRange
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full md:w-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchableSelect, {
						value: agentId,
						onChange: setAgentId,
						placeholder: "All agents",
						options: [{
							value: "",
							label: "All agents"
						}, ...agents.map((a) => ({
							value: a.id,
							label: a.display_name
						}))]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Agents",
						value: String(perf.length),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Assigned resellers",
						value: String(totals.resellers),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Orders",
						value: String(totals.orders),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Sales received",
						value: bdt(totals.sales),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
						hint: AGENT_SALES_HINT
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Target",
						value: bdt(totals.target),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4" }),
						hint: "Combined sale target set for the agents in view. Achievement is measured against sales received in the selected period."
					})
				]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid place-items-center py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
			}) : perf.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No agent data",
				description: "Create an agent and assign resellers to see the follow-up performance report here."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: perf.map((p) => {
					const pct = Math.min(p.achievedPct, 100);
					const expanded = open === p.agentId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card overflow-hidden shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4 p-4 sm:p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-base font-bold",
											children: agentName(p.agentId)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [
												p.resellerCount,
												" reseller(s) · ",
												p.activeResellers,
												" active · ",
												p.sellingResellers,
												" ordering in this period"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-lg font-black text-primary",
											children: bdt(p.sales)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [
												"of ",
												bdt(p.target),
												" target"
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 w-full overflow-hidden rounded-full bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full transition-all " + (p.achievedPct >= 100 ? "bg-emerald-500" : p.achievedPct >= 50 ? "bg-primary" : "bg-amber-500"),
										style: { width: `${pct}%` }
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										title: "Sales received divided by the sale target.",
										children: [p.achievedPct, "% achieved"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.gap > 0 ? `${bdt(p.gap)} to go` : "Target reached" })]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 sm:grid-cols-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
											label: "Orders",
											value: String(p.orders)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
											label: "Delivered",
											value: String(p.delivered)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
											label: "Failed / returned",
											value: String(p.failed)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
											label: "Net profit",
											value: bdt(p.profit),
											tone: p.profit >= 0 ? "text-emerald-600" : "text-destructive",
											hint: "Received amount − delivery charge − product cost − packaging cost. Failed orders subtract delivery and packaging as loss."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
											label: `Commission (${p.rate}%)`,
											value: bdt(p.commission),
											tone: "text-primary",
											hint: AGENT_COMMISSION_HINT
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setOpen(expanded ? null : p.agentId),
										className: "inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold hover:bg-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 transition " + (expanded ? "rotate-180" : "") }), expanded ? "Hide resellers" : "Reseller performance"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/admin/agent-payouts",
										className: "inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold hover:bg-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-3.5 w-3.5" }), " Commission & payout history"]
									})]
								})
							]
						}), expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 border-t bg-muted/20 p-3 sm:p-4",
							children: [p.resellers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "py-4 text-center text-xs text-muted-foreground",
								children: "No reseller assigned yet."
							}), p.resellers.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border bg-card p-3 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin/orders",
											search: { reseller: r.reseller_id },
											className: "truncate text-sm font-semibold hover:underline",
											children: r.business_name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-0.5 text-[11px] text-muted-foreground",
											children: [
												"#",
												r.code,
												" · ",
												r.status,
												r.lastOrderAt ? ` · last order ${formatDate(r.lastOrderAt)}` : " · no order in range"
											]
										})]
									}), r.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: `tel:${r.phone}`,
												className: "grid h-7 w-7 place-items-center rounded-md border hover:bg-muted",
												"aria-label": "Call reseller",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: `https://wa.me/${waNumber(r.phone)}`,
												target: "_blank",
												rel: "noreferrer",
												className: "grid h-7 w-7 place-items-center rounded-md border text-emerald-600 hover:bg-muted",
												"aria-label": "WhatsApp reseller",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3.5 w-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													navigator.clipboard.writeText(r.phone);
													toast.success("Phone copied");
												},
												className: "grid h-7 w-7 place-items-center rounded-md border hover:bg-muted",
												"aria-label": "Copy phone",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
											label: "Orders",
											value: String(r.orders)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
											label: "Delivered",
											value: String(r.delivered)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
											label: "Sales",
											value: bdt(r.sales),
											hint: "Sales = money actually received for the orders of this agent's resellers in the selected period. Profit uses the same formula as every report: received amount − delivery charge − product cost − packaging cost."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
											label: "Profit",
											value: bdt(r.profit),
											tone: r.profit >= 0 ? "text-emerald-600" : "text-destructive"
										})
									]
								})]
							}, r.reseller_id))]
						})]
					}, p.agentId);
				})
			})
		]
	});
}
function Mini({ label, value, tone, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border bg-background p-2.5",
		title: hint,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] font-bold uppercase leading-tight tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 text-sm font-black " + (tone ?? ""),
			children: value
		})]
	});
}
//#endregion
export { AgentReportPage as component };
