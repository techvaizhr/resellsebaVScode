import { E as statusLabel, S as savePlan, T as statusClass, _ as fmtDate, g as fetchSubscriptionOverview, m as cycleLabel, p as CYCLES, w as setResellerSubscription, x as reviewSubscriptionPayment, y as planPrice } from "./client-CdRSQB5v.js";
import { n as PageHeader, r as StatCard, t as EmptyState } from "./ui-kit-D-uo76H8.js";
import { _ as toCsv, a as downloadCsv, r as bdt } from "./finance-report-Dwy2dA23.js";
import { r as useCan } from "./use-auth-L4LMIQqu.js";
import { i as usePaginated, r as Pagination } from "./data-list-Cd6RJIu_.js";
import { t as AppModal } from "./AppModal-C8qUvQNk.js";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { BadgeCheck, Check, Clock, Download, Loader2, Pencil, Plus, Users, Wallet, X } from "lucide-react";
//#region src/routes/_authenticated/admin/subscriptions.tsx?tsr-split=component
function PerPage({ value, onChange }) {
	return /* @__PURE__ */ jsxs("select", {
		value,
		onChange: (e) => onChange(Number(e.target.value)),
		className: "rounded-md border bg-background px-2 py-2 text-xs",
		title: "Per page",
		children: [[
			10,
			20,
			50,
			100
		].map((n) => /* @__PURE__ */ jsxs("option", {
			value: n,
			children: [n, " / page"]
		}, n)), /* @__PURE__ */ jsx("option", {
			value: -1,
			children: "All"
		})]
	});
}
function AdminSubscriptionsPage() {
	const canManage = useCan()("subscriptions.manage");
	const [tab, setTab] = useState("subscribers");
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [editPlan, setEditPlan] = useState(null);
	const [editSub, setEditSub] = useState(null);
	async function load() {
		try {
			setData(await fetchSubscriptionOverview());
		} catch (e) {
			toast.error(e.message);
		} finally {
			setLoading(false);
		}
	}
	useEffect(() => {
		load();
	}, []);
	const plans = data?.plans ?? [];
	const subscribers = data?.subscribers ?? [];
	const payments = data?.payments ?? [];
	const pending = payments.filter((p) => p.status === "pending");
	const paid = payments.filter((p) => p.status === "paid");
	const revenue = paid.reduce((a, p) => a + Number(p.amount), 0);
	const activeCount = subscribers.filter((s) => [
		"active",
		"trial",
		"exempt"
	].includes(s.state?.status)).length;
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "flex items-center justify-center py-20",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				title: "Subscriptions",
				description: "Plans decide what a reseller can use — the panel alone, or the panel plus a public storefront."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(StatCard, {
						label: "Subscribers",
						value: String(subscribers.length),
						hint: "Reseller accounts",
						icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Active access",
						value: String(activeCount),
						hint: "Active, trial or free access",
						icon: /* @__PURE__ */ jsx(BadgeCheck, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Pending payments",
						value: String(pending.length),
						hint: "Waiting for your review",
						icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Collected",
						value: bdt(revenue),
						hint: "All approved subscription payments",
						icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" })
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "inline-flex flex-wrap rounded-xl border bg-muted/30 p-1",
				children: [
					["subscribers", `Subscribers (${subscribers.length})`],
					["payments", `Payment requests (${pending.length})`],
					["plans", `Plans (${plans.length})`],
					["revenue", "Revenue"]
				].map(([key, label]) => /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setTab(key),
					className: "rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors " + (tab === key ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"),
					children: label
				}, key))
			}),
			tab === "subscribers" ? /* @__PURE__ */ jsx(SubscribersTab, {
				rows: subscribers,
				plans,
				canManage,
				onEdit: setEditSub
			}) : tab === "payments" ? /* @__PURE__ */ jsx(PaymentsTab, {
				rows: payments,
				canManage,
				onReload: load
			}) : tab === "plans" ? /* @__PURE__ */ jsx(PlansTab, {
				plans,
				canManage,
				onEdit: setEditPlan
			}) : /* @__PURE__ */ jsx(RevenueTab, { rows: paid }),
			editPlan ? /* @__PURE__ */ jsx(PlanModal, {
				plan: editPlan,
				onClose: () => setEditPlan(null),
				onSaved: () => {
					setEditPlan(null);
					load();
				}
			}) : null,
			editSub ? /* @__PURE__ */ jsx(SubscriberModal, {
				row: editSub,
				plans,
				onClose: () => setEditSub(null),
				onSaved: () => {
					setEditSub(null);
					load();
				}
			}) : null
		]
	});
}
function SubscribersTab({ rows, plans, canManage, onEdit }) {
	const [q, setQ] = useState("");
	const [status, setStatus] = useState("all");
	const [plan, setPlan] = useState("all");
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(20);
	const filtered = useMemo(() => rows.filter((r) => {
		const term = q.trim().toLowerCase();
		const okQ = !term || r.business_name.toLowerCase().includes(term) || r.code.toLowerCase().includes(term);
		const okS = status === "all" || r.state?.status === status;
		const okP = plan === "all" || r.state?.plan_id === plan;
		return okQ && okS && okP;
	}), [
		rows,
		q,
		status,
		plan
	]);
	useEffect(() => setPage(1), [
		q,
		status,
		plan,
		perPage
	]);
	const pageRows = usePaginated(filtered, page, perPage);
	if (rows.length === 0) return /* @__PURE__ */ jsx(EmptyState, {
		title: "No resellers yet",
		description: "Subscriptions appear once resellers sign up."
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ jsx("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search reseller or code",
						className: "w-full rounded-md border bg-background px-3 py-2 text-xs sm:w-64"
					}),
					/* @__PURE__ */ jsxs("select", {
						value: status,
						onChange: (e) => setStatus(e.target.value),
						className: "rounded-md border bg-background px-3 py-2 text-xs",
						children: [/* @__PURE__ */ jsx("option", {
							value: "all",
							children: "All statuses"
						}), [
							"trial",
							"active",
							"grace",
							"expired",
							"exempt",
							"none"
						].map((s) => /* @__PURE__ */ jsx("option", {
							value: s,
							children: statusLabel(s)
						}, s))]
					}),
					/* @__PURE__ */ jsxs("select", {
						value: plan,
						onChange: (e) => setPlan(e.target.value),
						className: "rounded-md border bg-background px-3 py-2 text-xs",
						children: [/* @__PURE__ */ jsx("option", {
							value: "all",
							children: "All plans"
						}), plans.map((p) => /* @__PURE__ */ jsx("option", {
							value: p.id,
							children: p.name
						}, p.id))]
					}),
					/* @__PURE__ */ jsx(PerPage, {
						value: perPage,
						onChange: setPerPage
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "surface-card overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "hidden grid-cols-[1.4fr_1fr_auto_auto_auto_auto] gap-4 border-b bg-muted/40 px-4 py-2 text-center text-xs font-medium text-muted-foreground md:grid",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-left",
							children: "Reseller"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-left",
							children: "Plan"
						}),
						/* @__PURE__ */ jsx("div", { children: "Status" }),
						/* @__PURE__ */ jsx("div", { children: "Ends" }),
						/* @__PURE__ */ jsx("div", { children: "Balance" }),
						/* @__PURE__ */ jsx("div", {})
					]
				}), pageRows.map((r) => /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 items-center gap-1 border-b px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1.4fr_1fr_auto_auto_auto_auto] md:gap-4 md:text-center",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "text-left",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-xs font-semibold",
								children: r.business_name
							}), /* @__PURE__ */ jsx("div", {
								className: "font-mono text-[10px] text-muted-foreground",
								children: r.code
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "text-left text-xs",
							children: [r.state?.plan_name ?? "—", /* @__PURE__ */ jsx("div", {
								className: "text-[10px] text-muted-foreground",
								children: r.state?.includes_store ? "Panel + store" : "Panel only"
							})]
						}),
						/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("span", {
							className: "rounded-full px-2 py-0.5 text-[10px] font-semibold " + statusClass(r.state?.status),
							children: statusLabel(r.state?.status)
						}) }),
						/* @__PURE__ */ jsx("div", {
							className: "text-xs tabular-nums text-muted-foreground",
							children: fmtDate(r.state?.ends_at)
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-xs font-medium tabular-nums",
							children: bdt(Number(r.balance ?? 0))
						}),
						/* @__PURE__ */ jsx("div", { children: canManage ? /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => onEdit(r),
							className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium hover:bg-muted",
							children: [/* @__PURE__ */ jsx(Pencil, { className: "h-3 w-3" }), " Manage"]
						}) : /* @__PURE__ */ jsx("span", {
							className: "text-xs text-muted-foreground",
							children: "—"
						}) })
					]
				}, r.reseller_id))]
			}),
			/* @__PURE__ */ jsx(Pagination, {
				page,
				perPage,
				total: filtered.length,
				onPage: setPage
			})
		]
	});
}
function PaymentsTab({ rows, canManage, onReload }) {
	const [busy, setBusy] = useState(null);
	const [q, setQ] = useState("");
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(20);
	const filtered = useMemo(() => {
		const term = q.trim().toLowerCase();
		if (!term) return rows;
		return rows.filter((p) => [
			p.business_name,
			p.code,
			p.plan_name,
			p.reference
		].some((v) => v?.toLowerCase().includes(term)));
	}, [rows, q]);
	useEffect(() => setPage(1), [q, perPage]);
	const pageRows = usePaginated(filtered, page, perPage);
	async function review(id, approve) {
		setBusy(id);
		try {
			await reviewSubscriptionPayment(id, approve);
			toast.success(approve ? "Payment approved and plan extended" : "Payment rejected");
			await onReload();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(null);
		}
	}
	if (rows.length === 0) return /* @__PURE__ */ jsx(EmptyState, {
		title: "No payments yet",
		description: "Reseller subscription payments show up here."
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ jsx("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search reseller, plan or reference",
					className: "w-full rounded-md border bg-background px-3 py-2 text-xs sm:w-64"
				}), /* @__PURE__ */ jsx(PerPage, {
					value: perPage,
					onChange: setPerPage
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "surface-card overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "hidden grid-cols-[1.2fr_1fr_1fr_auto_auto_auto] gap-4 border-b bg-muted/40 px-4 py-2 text-center text-xs font-medium text-muted-foreground md:grid",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-left",
							children: "Reseller"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-left",
							children: "Plan"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-left",
							children: "Paid with"
						}),
						/* @__PURE__ */ jsx("div", { children: "Amount" }),
						/* @__PURE__ */ jsx("div", { children: "Status" }),
						/* @__PURE__ */ jsx("div", {})
					]
				}), pageRows.map((p) => /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 items-center gap-1 border-b px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1.2fr_1fr_1fr_auto_auto_auto] md:gap-4 md:text-center",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "text-left text-xs font-semibold",
							children: [
								p.business_name ?? "—",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "font-mono text-[10px] text-muted-foreground",
									children: p.code ?? ""
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "text-left text-xs",
							children: [
								p.plan_name ?? "—",
								" ",
								/* @__PURE__ */ jsxs("span", {
									className: "text-muted-foreground",
									children: ["· ", cycleLabel(p.cycle_months)]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "text-left text-xs text-muted-foreground",
							children: [p.source === "earning" ? "From earnings" : p.source === "admin" ? "Added by admin" : p.method ?? "Manual", p.reference ? ` · ${p.reference}` : ""]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-xs font-semibold tabular-nums",
							children: bdt(Number(p.amount))
						}),
						/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("span", {
							className: "rounded-full px-2 py-0.5 text-[10px] font-semibold " + (p.status === "paid" ? "bg-success/15 text-success" : p.status === "rejected" ? "bg-destructive/15 text-destructive" : "bg-amber-500/15 text-amber-700 dark:text-amber-400"),
							children: p.status
						}) }),
						/* @__PURE__ */ jsx("div", {
							className: "flex justify-end gap-1.5 md:justify-center",
							children: p.status === "pending" && canManage ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("button", {
								type: "button",
								disabled: busy === p.id,
								onClick: () => review(p.id, true),
								className: "inline-flex items-center gap-1 rounded-md bg-success px-2 py-1 text-[11px] font-semibold text-success-foreground disabled:opacity-60",
								children: [/* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }), " Approve"]
							}), /* @__PURE__ */ jsxs("button", {
								type: "button",
								disabled: busy === p.id,
								onClick: () => review(p.id, false),
								className: "inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-[11px] font-semibold text-destructive disabled:opacity-60",
								children: [/* @__PURE__ */ jsx(X, { className: "h-3 w-3" }), " Reject"]
							})] }) : /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-muted-foreground",
								children: fmtDate(p.reviewed_at ?? p.created_at)
							})
						})
					]
				}, p.id))]
			}),
			/* @__PURE__ */ jsx(Pagination, {
				page,
				perPage,
				total: filtered.length,
				onPage: setPage
			})
		]
	});
}
function PlansTab({ plans, canManage, onEdit }) {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(20);
	useEffect(() => setPage(1), [perPage]);
	const pagePlans = usePaginated(plans, page, perPage);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [canManage ? /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => onEdit({
						includes_store: false,
						trial_days: 14,
						grace_days: 7,
						is_active: true
					}),
					className: "inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground",
					children: [/* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }), " New plan"]
				}) : null, /* @__PURE__ */ jsx(PerPage, {
					value: perPage,
					onChange: setPerPage
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: pagePlans.map((p) => /* @__PURE__ */ jsxs("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("h3", {
								className: "flex items-center gap-2 text-sm font-semibold",
								children: [p.name, p.is_default ? /* @__PURE__ */ jsx("span", {
									className: "rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary",
									children: "Default"
								}) : null]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: p.description
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: [
									p.includes_store ? "Panel + storefront" : "Panel only",
									" · ",
									p.trial_days,
									"d trial · ",
									p.grace_days,
									"d grace ·",
									" ",
									p.is_active ? "Active" : "Inactive"
								]
							})
						] }), canManage ? /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => onEdit(p),
							className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium hover:bg-muted",
							children: [/* @__PURE__ */ jsx(Pencil, { className: "h-3 w-3" }), " Edit"]
						}) : null]
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-3 grid grid-cols-4 gap-2 text-center",
						children: CYCLES.map((m) => /* @__PURE__ */ jsxs("div", {
							className: "rounded-lg border p-2",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] text-muted-foreground",
								children: cycleLabel(m)
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs font-semibold tabular-nums",
								children: bdt(planPrice(p, m))
							})]
						}, m))
					})]
				}, p.id))
			}),
			/* @__PURE__ */ jsx(Pagination, {
				page,
				perPage,
				total: plans.length,
				onPage: setPage
			})
		]
	});
}
function RevenueTab({ rows }) {
	const byMonth = useMemo(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of rows) {
			const key = new Date(p.created_at).toISOString().slice(0, 7);
			const cur = map.get(key) ?? {
				earning: 0,
				manual: 0,
				total: 0
			};
			const amt = Number(p.amount);
			if (p.source === "earning") cur.earning += amt;
			else cur.manual += amt;
			cur.total += amt;
			map.set(key, cur);
		}
		return [...map.entries()].sort((a, b) => a[0] < b[0] ? 1 : -1);
	}, [rows]);
	function exportCsv() {
		downloadCsv("subscription-revenue.csv", toCsv([
			"Month",
			"From earnings",
			"Wallet / bank",
			"Total"
		], byMonth.map(([m, v]) => [
			m,
			v.earning,
			v.manual,
			v.total
		])));
	}
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(20);
	useEffect(() => setPage(1), [perPage]);
	const pageRows = usePaginated(byMonth, page, perPage);
	if (byMonth.length === 0) return /* @__PURE__ */ jsx(EmptyState, {
		title: "No revenue yet",
		description: "Approved subscription payments are summarised here."
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: exportCsv,
					className: "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted",
					children: [/* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }), " Export CSV"]
				}), /* @__PURE__ */ jsx(PerPage, {
					value: perPage,
					onChange: setPerPage
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "surface-card overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-4 gap-4 border-b bg-muted/40 px-4 py-2 text-center text-xs font-medium text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-left",
							children: "Month"
						}),
						/* @__PURE__ */ jsx("div", { children: "From earnings" }),
						/* @__PURE__ */ jsx("div", { children: "Wallet / bank" }),
						/* @__PURE__ */ jsx("div", { children: "Total" })
					]
				}), pageRows.map(([m, v]) => /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-4 gap-4 border-b px-4 py-3 text-center text-sm last:border-b-0",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-left text-xs font-medium",
							children: m
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-xs tabular-nums",
							children: bdt(v.earning)
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-xs tabular-nums",
							children: bdt(v.manual)
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-xs font-semibold tabular-nums",
							children: bdt(v.total)
						})
					]
				}, m))]
			}),
			/* @__PURE__ */ jsx(Pagination, {
				page,
				perPage,
				total: byMonth.length,
				onPage: setPage
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
		className: "mb-1 block text-xs font-medium",
		children: label
	}), children] });
}
var inputCls = "w-full rounded-md border bg-background px-3 py-2 text-xs";
function PlanModal({ plan, onClose, onSaved }) {
	const [form, setForm] = useState({ ...plan });
	const [busy, setBusy] = useState(false);
	const set = (patch) => setForm((f) => ({
		...f,
		...patch
	}));
	async function submit() {
		setBusy(true);
		try {
			if (!form.code?.trim() || !form.name?.trim()) throw new Error("Code and name are required");
			await savePlan(form);
			toast.success("Plan saved");
			onSaved();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ jsx(AppModal, {
		title: plan.id ? "Edit plan" : "New plan",
		subtitle: "Prices apply to every reseller unless a per-reseller override is set.",
		onClose,
		footer: /* @__PURE__ */ jsxs("div", {
			className: "flex justify-end gap-2",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: onClose,
				className: "rounded-md border px-3 py-1.5 text-xs font-medium",
				children: "Cancel"
			}), /* @__PURE__ */ jsxs("button", {
				type: "button",
				disabled: busy,
				onClick: submit,
				className: "inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60",
				children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : null, " Save plan"]
			})]
		}),
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ jsx(Field, {
					label: "Code",
					children: /* @__PURE__ */ jsx("input", {
						className: inputCls,
						value: form.code ?? "",
						onChange: (e) => set({ code: e.target.value })
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "Name",
					children: /* @__PURE__ */ jsx("input", {
						className: inputCls,
						value: form.name ?? "",
						onChange: (e) => set({ name: e.target.value })
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "sm:col-span-2",
					children: /* @__PURE__ */ jsx(Field, {
						label: "Description",
						children: /* @__PURE__ */ jsx("input", {
							className: inputCls,
							value: form.description ?? "",
							onChange: (e) => set({ description: e.target.value })
						})
					})
				}),
				[
					["price_1m", "Price · 1 month"],
					["price_3m", "Price · 3 months"],
					["price_6m", "Price · 6 months"],
					["price_12m", "Price · 12 months"],
					["trial_days", "Trial days"],
					["grace_days", "Grace days"],
					["sort_order", "Sort order"]
				].map(([key, label]) => /* @__PURE__ */ jsx(Field, {
					label,
					children: /* @__PURE__ */ jsx("input", {
						type: "number",
						className: inputCls,
						value: String(form[key] ?? 0),
						onChange: (e) => set({ [key]: Number(e.target.value) })
					})
				}, key)),
				/* @__PURE__ */ jsxs("label", {
					className: "flex items-center gap-2 text-xs font-medium",
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: Boolean(form.includes_store),
						onChange: (e) => set({ includes_store: e.target.checked })
					}), "Includes public storefront"]
				}),
				/* @__PURE__ */ jsxs("label", {
					className: "flex items-center gap-2 text-xs font-medium",
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: form.is_active ?? true,
						onChange: (e) => set({ is_active: e.target.checked })
					}), "Plan is active"]
				}),
				/* @__PURE__ */ jsxs("label", {
					className: "flex items-center gap-2 text-xs font-medium",
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: Boolean(form.is_default),
						onChange: (e) => set({ is_default: e.target.checked })
					}), "Default plan for new signups"]
				})
			]
		})
	});
}
function SubscriberModal({ row, plans, onClose, onSaved }) {
	const sub = row.subscription ?? {};
	const [planId, setPlanId] = useState(sub.plan_id ?? row.state?.plan_id ?? plans[0]?.id ?? "");
	const [isExempt, setIsExempt] = useState(Boolean(sub.is_exempt));
	const [extendMonths, setExtendMonths] = useState(0);
	const [note, setNote] = useState(sub.admin_note ?? "");
	const [overrides, setOverrides] = useState({
		override_price_1m: sub.override_price_1m ?? null,
		override_price_3m: sub.override_price_3m ?? null,
		override_price_6m: sub.override_price_6m ?? null,
		override_price_12m: sub.override_price_12m ?? null,
		override_grace_days: sub.override_grace_days ?? null
	});
	const [busy, setBusy] = useState(false);
	async function submit() {
		setBusy(true);
		try {
			await setResellerSubscription(row.reseller_id, {
				plan_id: planId,
				is_exempt: isExempt,
				admin_note: note,
				...overrides,
				...extendMonths > 0 ? { extend_months: extendMonths } : {}
			});
			toast.success("Subscription updated");
			onSaved();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}
	const num = (v) => v === null || v === void 0 ? "" : String(v);
	return /* @__PURE__ */ jsx(AppModal, {
		title: row.business_name,
		subtitle: `${statusLabel(row.state?.status)} · ends ${fmtDate(row.state?.ends_at)}`,
		onClose,
		footer: /* @__PURE__ */ jsxs("div", {
			className: "flex justify-end gap-2",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: onClose,
				className: "rounded-md border px-3 py-1.5 text-xs font-medium",
				children: "Cancel"
			}), /* @__PURE__ */ jsxs("button", {
				type: "button",
				disabled: busy,
				onClick: submit,
				className: "inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60",
				children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : null, " Save changes"]
			})]
		}),
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ jsx(Field, {
					label: "Plan",
					children: /* @__PURE__ */ jsx("select", {
						className: inputCls,
						value: planId,
						onChange: (e) => setPlanId(e.target.value),
						children: plans.map((p) => /* @__PURE__ */ jsx("option", {
							value: p.id,
							children: p.name
						}, p.id))
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "Extend by",
					children: /* @__PURE__ */ jsxs("select", {
						className: inputCls,
						value: extendMonths,
						onChange: (e) => setExtendMonths(Number(e.target.value)),
						children: [/* @__PURE__ */ jsx("option", {
							value: 0,
							children: "Do not extend"
						}), CYCLES.map((m) => /* @__PURE__ */ jsx("option", {
							value: m,
							children: cycleLabel(m)
						}, m))]
					})
				}),
				[
					["override_price_1m", "Custom price · 1 month"],
					["override_price_3m", "Custom price · 3 months"],
					["override_price_6m", "Custom price · 6 months"],
					["override_price_12m", "Custom price · 12 months"],
					["override_grace_days", "Custom grace days"]
				].map(([key, label]) => /* @__PURE__ */ jsx(Field, {
					label,
					children: /* @__PURE__ */ jsx("input", {
						type: "number",
						placeholder: "Global value",
						className: inputCls,
						value: num(overrides[key]),
						onChange: (e) => setOverrides((o) => ({
							...o,
							[key]: e.target.value === "" ? null : Number(e.target.value)
						}))
					})
				}, key)),
				/* @__PURE__ */ jsx("div", {
					className: "sm:col-span-2",
					children: /* @__PURE__ */ jsx(Field, {
						label: "Admin note",
						children: /* @__PURE__ */ jsx("input", {
							className: inputCls,
							value: note,
							onChange: (e) => setNote(e.target.value)
						})
					})
				}),
				/* @__PURE__ */ jsxs("label", {
					className: "flex items-center gap-2 text-xs font-medium sm:col-span-2",
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: isExempt,
						onChange: (e) => setIsExempt(e.target.checked)
					}), "Free access — never lock this reseller out"]
				})
			]
		})
	});
}
//#endregion
export { AdminSubscriptionsPage as component };
