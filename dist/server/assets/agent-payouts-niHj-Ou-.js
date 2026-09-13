import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { O as formatDateTime, k as formatMonthYear, r as supabase } from "./client-BAn7XKYw.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { $t as History, In as Clock, J as RefreshCw, Mt as LoaderCircle, _ as TrendingDown, a as Wallet, at as Percent, er as Check, et as Plus, gr as BadgeCheck, hr as Ban, r as X, v as Trash2 } from "./vendor-icons-BEaCFqaT.js";
import { t as ConfirmModal } from "./ConfirmModal-D7BYETKw.js";
import { n as PageHeader, r as StatCard, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { t as SearchableSelect } from "./searchable-select-Bqfi4mWb.js";
import { t as LedgerTimeline } from "./ledger-timeline-Ct1rLo_v.js";
import { a as bdt, c as buildAgentSettlement, i as agentCommissionMonths, o as buildAgentLedger, s as buildAgentPerformance, t as AGENT_COMMISSION_HINT } from "./agents-BjKc5KSO.js";
import { r as useCan } from "./use-auth-zbqaYCVZ.js";
//#region src/routes/_authenticated/admin/agent-payouts.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var cls = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
var STATUS_TONE = {
	paid: "bg-emerald-500/15 text-emerald-600",
	approved: "bg-primary/15 text-primary",
	pending: "bg-amber-500/15 text-amber-600",
	rejected: "bg-destructive/15 text-destructive"
};
function AgentPayoutsPage() {
	const [agents, setAgents] = (0, import_react.useState)([]);
	const [resellers, setResellers] = (0, import_react.useState)([]);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [payouts, setPayouts] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [agentId, setAgentId] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("summary");
	const [paying, setPaying] = (0, import_react.useState)(null);
	const [removing, setRemoving] = (0, import_react.useState)(null);
	const canManage = useCan()("agents.manage", "payouts.manage");
	async function load() {
		setLoading(true);
		const [a, r, o, p] = await Promise.all([
			supabase.from("agents").select("*").order("display_name"),
			supabase.from("resellers").select("id,business_name,code,status,contact_phone,agent_id"),
			supabase.from("orders").select("id,reseller_id,status,created_at,total,shipping_cost,sa_cost_total,received_amount,packaging_total").order("created_at", { ascending: false }).limit(5e3),
			supabase.from("agent_payouts").select("*").order("created_at", { ascending: false })
		]);
		if (o.error) toast.error(o.error.message);
		if (p.error) toast.error(p.error.message);
		setAgents(a.data ?? []);
		setResellers(r.data ?? []);
		setOrders(o.data ?? []);
		setPayouts(p.data ?? []);
		setLoading(false);
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const view = (0, import_react.useMemo)(() => {
		return agents.filter((a) => !agentId || a.id === agentId).map((a) => {
			const mine = resellers.filter((r) => r.agent_id === a.id);
			const ids = new Set(mine.map((r) => r.id));
			const agentOrders = orders.filter((o) => o.reseller_id && ids.has(o.reseller_id));
			const perf = buildAgentPerformance(a, mine, agentOrders);
			const rows = payouts.filter((p) => p.agent_id === a.id);
			return {
				agent: a,
				perf,
				orders: agentOrders,
				payouts: rows,
				settle: buildAgentSettlement(perf.commission, rows),
				months: agentCommissionMonths(agentOrders, a.commission_rate),
				ledger: buildAgentLedger(agentOrders, a.commission_rate, rows)
			};
		}).sort((x, y) => y.settle.earned - x.settle.earned);
	}, [
		agents,
		resellers,
		orders,
		payouts,
		agentId
	]);
	const totals = (0, import_react.useMemo)(() => view.reduce((acc, v) => ({
		earned: acc.earned + v.settle.earned,
		paid: acc.paid + v.settle.paid,
		due: acc.due + Math.max(v.settle.balance, 0),
		advance: acc.advance + v.settle.advance,
		pending: acc.pending + v.settle.pending + v.settle.approved
	}), {
		earned: 0,
		paid: 0,
		due: 0,
		advance: 0,
		pending: 0
	}), [view]);
	async function setStatus(p, status, extra = {}) {
		const patch = {
			status,
			...extra
		};
		if (status === "approved") patch.approved_at = (/* @__PURE__ */ new Date()).toISOString();
		if (status === "paid") {
			patch.paid_at = (/* @__PURE__ */ new Date()).toISOString();
			patch.approved_at = p.approved_at ?? (/* @__PURE__ */ new Date()).toISOString();
		}
		const { error } = await supabase.from("agent_payouts").update(patch).eq("id", p.id);
		if (error) return toast.error(error.message);
		toast.success(`Payment ${status}`);
		load();
	}
	async function remove(p) {
		const { error } = await supabase.from("agent_payouts").delete().eq("id", p.id);
		setRemoving(null);
		if (error) return toast.error(error.message);
		toast.success("Payment record deleted");
		load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Agent commission & payouts",
				description: "Commission is calculated on the delivered (received) money of every assigned reseller, exactly like the reseller earning report. Pay flexibly — part now, rest later, or advance.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: load,
					className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 " + (loading ? "animate-spin" : "") }), " Refresh"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex rounded-lg border p-1 text-xs font-semibold",
					children: [
						["summary", "Commission summary"],
						["payouts", "Payment requests"],
						["timeline", "History timeline"]
					].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTab(k),
						className: "rounded-md px-3 py-1.5 transition " + (tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"),
						children: label
					}, k))
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
						label: "Commission earned",
						value: bdt(totals.earned),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "h-4 w-4" }),
						hint: AGENT_COMMISSION_HINT
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Paid out",
						value: bdt(totals.paid),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "In process",
						value: bdt(totals.pending),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
						hint: "Payment requests that are pending or approved but not paid yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Due to pay",
						value: bdt(totals.due),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Advance given",
						value: bdt(totals.advance),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-4 w-4" }),
						hint: "Paid more than the commission earned so far. It settles automatically as new delivered orders add commission."
					})
				]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid place-items-center py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
			}) : view.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No agents yet",
				description: "Create an agent, set the commission percent and assign resellers to start tracking commission."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: view.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card overflow-hidden shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3 border-b p-4 sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-base font-bold",
									children: v.agent.display_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										v.perf.resellerCount,
										" reseller(s) · commission rate ",
										v.agent.commission_rate || 0,
										"% · settled net profit ",
										bdt(v.perf.commissionBase)
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-lg font-black " + (v.settle.balance >= 0 ? "text-primary" : "text-destructive"),
										children: [v.settle.balance < 0 ? "−" : "", bdt(Math.abs(v.settle.balance))]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground",
										children: v.settle.balance < 0 ? "advance adjusted later" : "current balance"
									})]
								}), canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setPaying(v.agent),
									className: "btn-brand inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " New payment"]
								})]
							})]
						}),
						tab === "summary" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 p-4 sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
										label: "Earned",
										value: bdt(v.settle.earned),
										hint: "Commission = agent rate % × settled net profit of the assigned resellers' orders. Net profit uses the same formula everywhere: final delivered (received) amount − delivery charge − product cost − packaging cost. Returned / cancelled orders reduce the base, so commission is always paid on real delivered money."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
										label: "Paid",
										value: bdt(v.settle.paid),
										tone: "text-emerald-600"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
										label: "Approved (unpaid)",
										value: bdt(v.settle.approved)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
										label: "Payable now",
										value: bdt(v.settle.payable),
										tone: "text-primary",
										hint: "Earned commission minus already paid and approved amounts."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground",
								children: "Month wise commission"
							}), v.months.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground",
								children: "No delivered order yet, so no commission is earned."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "overflow-hidden rounded-lg border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden grid-cols-4 gap-2 bg-muted/40 px-3 py-2 text-[11px] font-bold uppercase text-muted-foreground sm:grid",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Month" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-right",
											children: "Settled orders"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-right",
											children: "Net profit"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-right",
											children: "Commission"
										})
									]
								}), v.months.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 border-t px-3 py-2 text-sm sm:grid-cols-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: formatMonthYear(m.key)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-right tabular-nums text-muted-foreground",
											children: m.orders
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-right tabular-nums",
											children: bdt(m.base)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-right font-bold tabular-nums text-primary",
											children: bdt(m.commission)
										})
									]
								}, m.key))]
							})] })]
						}),
						tab === "payouts" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 p-3 sm:p-4",
							children: [v.payouts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "py-4 text-center text-xs text-muted-foreground",
								children: "No payment record yet."
							}), v.payouts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border bg-card p-3 shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm font-bold tabular-nums",
														children: bdt(Number(p.amount))
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase " + (STATUS_TONE[p.status] ?? "bg-muted text-muted-foreground"),
														children: p.status
													}),
													p.kind === "advance" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-600",
														children: "Advance"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 text-[11px] text-muted-foreground",
												children: [
													formatDateTime(p.created_at),
													p.period_from && p.period_to ? ` · period ${p.period_from} → ${p.period_to}` : "",
													p.method ? ` · ${p.method}` : "",
													p.reference ? ` · ${p.reference}` : ""
												]
											}),
											(p.note || p.admin_note) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 text-[11px] text-muted-foreground",
												children: [p.note, p.admin_note].filter(Boolean).join(" · ")
											})
										]
									}), canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-1.5",
										children: [
											p.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => setStatus(p, "approved"),
												className: "inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Approve"]
											}),
											p.status !== "paid" && p.status !== "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => setStatus(p, "paid"),
												className: "btn-brand inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-3.5 w-3.5" }), " Mark paid"]
											}),
											p.status !== "rejected" && p.status !== "paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													const note = window.prompt("Reject reason (optional)") ?? "";
													setStatus(p, "rejected", note ? { admin_note: note } : {});
												},
												className: "inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-3.5 w-3.5" }), " Reject"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setRemoving(p),
												title: "Delete record",
												className: "grid h-7 w-7 place-items-center rounded-md border text-destructive hover:bg-destructive/10",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
											})
										]
									})]
								})
							}, p.id))]
						}),
						tab === "timeline" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 sm:p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mb-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-3.5 w-3.5" }), " Commission in, payments out — same money timeline format as the reseller ledger."]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LedgerTimeline, {
								ledger: v.ledger,
								frozen: v.settle.approved,
								available: Math.max(v.settle.balance, 0),
								emptyText: "No commission or payment yet."
							})]
						})
					]
				}, v.agent.id))
			}),
			paying && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentModal, {
				agent: paying,
				suggested: view.find((v) => v.agent.id === paying.id)?.settle.payable ?? 0,
				onClose: () => setPaying(null),
				onSaved: () => {
					setPaying(null);
					load();
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
				isOpen: !!removing,
				title: "Delete this payment record?",
				description: "The amount will no longer count against the agent's commission balance.",
				confirmText: "Delete",
				variant: "danger",
				onClose: () => setRemoving(null),
				onConfirm: async () => {
					if (removing) await remove(removing);
				}
			})
		]
	});
}
function PaymentModal({ agent, suggested, onClose, onSaved }) {
	const [amount, setAmount] = (0, import_react.useState)(String(Math.max(Math.round(suggested), 0) || ""));
	const [kind, setKind] = (0, import_react.useState)("payment");
	const [status, setStatus] = (0, import_react.useState)("pending");
	const [method, setMethod] = (0, import_react.useState)("");
	const [reference, setReference] = (0, import_react.useState)("");
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save(e) {
		e.preventDefault();
		const value = Number(amount);
		if (!value || value <= 0) return toast.error("Enter a payment amount");
		setBusy(true);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const { data: auth } = await supabase.auth.getUser();
		const { error } = await supabase.from("agent_payouts").insert({
			agent_id: agent.id,
			amount: value,
			kind,
			status,
			method: method.trim() || null,
			reference: reference.trim() || null,
			note: note.trim() || null,
			period_from: from || null,
			period_to: to || null,
			created_by: auth?.user?.id ?? null,
			approved_at: status === "approved" || status === "paid" ? now : null,
			paid_at: status === "paid" ? now : null
		});
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Payment record created");
		onSaved();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/40 sm:items-center sm:p-4",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onClick: (e) => e.stopPropagation(),
			onSubmit: save,
			className: "surface-card flex max-h-[92dvh] w-full max-w-lg flex-col rounded-b-none sm:max-h-[88dvh] sm:rounded-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-6 sm:py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "truncate text-base font-semibold",
							children: "Pay commission"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: [
								agent.display_name,
								" · payable now ",
								bdt(suggested)
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-md p-1 hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-medium",
									children: "Amount (৳)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									value: amount,
									onChange: (e) => setAmount(e.target.value),
									className: cls,
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: "Pay any amount — the rest stays as balance. Paying more than earned shows as advance (minus) and settles automatically later."
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: kind,
								onChange: (e) => setKind(e.target.value),
								className: cls,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "payment",
									children: "Commission payment"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "advance",
									children: "Advance"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: status,
								onChange: (e) => setStatus(e.target.value),
								className: cls,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "pending",
										children: "Pending (needs approval)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "approved",
										children: "Approved"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "paid",
										children: "Paid now"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Method"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: method,
								onChange: (e) => setMethod(e.target.value),
								placeholder: "bKash / Nagad / Bank",
								className: cls
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Reference / TrxID"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: reference,
								onChange: (e) => setReference(e.target.value),
								className: cls
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-medium",
									children: "Period from"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: from,
									onChange: (e) => setFrom(e.target.value),
									className: cls
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-medium",
									children: "Period to"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: to,
									onChange: (e) => setTo(e.target.value),
									className: cls
								})] })]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium",
						children: "Note"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 2,
						value: note,
						onChange: (e) => setNote(e.target.value),
						className: cls
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col-reverse gap-2 border-t px-4 py-3 sm:flex-row sm:justify-end sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-md border px-4 py-2 text-sm",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: busy,
						className: "btn-brand inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold",
						children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Save payment"]
					})]
				})
			]
		})
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
export { AgentPayoutsPage as component };
