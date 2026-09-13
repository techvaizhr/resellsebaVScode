import { r as supabase } from "./client-BpJCBCUq.js";
import { n as PageHeader, r as StatCard, t as EmptyState } from "./ui-kit-D-uo76H8.js";
import { r as useCan } from "./use-auth-BPiZPMVq.js";
import { i as usePaginated, n as DataToolbar, r as Pagination } from "./data-list-Cd6RJIu_.js";
import { i as loadAdminSupplierOverview, n as bdtNum } from "./supplier-mecKsJzM.js";
import { t as StatusTabs } from "./status-tabs-CgmdNN1k.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { CheckCircle2, Clock, Loader2, Plus, Wallet, XCircle } from "lucide-react";
//#region src/routes/_authenticated/admin/supplier-payouts.tsx?tsr-split=component
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
var TONE = {
	pending: "bg-amber-500/10 text-amber-600",
	approved: "bg-sky-500/10 text-sky-600",
	paid: "bg-emerald-500/10 text-emerald-600",
	rejected: "bg-destructive/10 text-destructive"
};
var TABS = [
	{
		key: "all",
		label: "All"
	},
	{
		key: "pending",
		label: "Pending"
	},
	{
		key: "approved",
		label: "Approved"
	},
	{
		key: "paid",
		label: "Paid"
	},
	{
		key: "rejected",
		label: "Rejected"
	}
];
function AdminSupplierPayoutsPage() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [busyId, setBusyId] = useState(null);
	const [tab, setTab] = useState("all");
	const [search, setSearch] = useState("");
	const [supplierFilter, setSupplierFilter] = useState("");
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(20);
	const [supplierId, setSupplierId] = useState("");
	const [amount, setAmount] = useState("");
	const [method, setMethod] = useState("");
	const [reference, setReference] = useState("");
	const [creating, setCreating] = useState(false);
	const canManage = useCan()("suppliers.manage", "payouts.manage");
	const load = useCallback(async () => {
		try {
			setData(await loadAdminSupplierOverview());
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Load failed");
		} finally {
			setLoading(false);
		}
	}, []);
	useEffect(() => {
		load();
	}, [load]);
	const suppliers = data?.suppliers ?? [];
	const all = data?.payouts ?? [];
	const scoped = useMemo(() => {
		let out = all;
		if (supplierFilter) out = out.filter((p) => p.supplier_id === supplierFilter);
		const q = search.trim().toLowerCase();
		if (q) out = out.filter((p) => (p.supplier_name ?? "").toLowerCase().includes(q) || (p.method ?? "").toLowerCase().includes(q) || (p.reference ?? "").toLowerCase().includes(q));
		return out;
	}, [
		all,
		supplierFilter,
		search
	]);
	const rows = useMemo(() => tab === "all" ? scoped : scoped.filter((p) => p.status === tab), [scoped, tab]);
	const count = useCallback((k) => k === "all" ? scoped.length : scoped.filter((p) => p.status === k).length, [scoped]);
	const totals = useMemo(() => ({
		pending: all.filter((p) => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0),
		approved: all.filter((p) => p.status === "approved").reduce((s, p) => s + Number(p.amount), 0),
		paid: all.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0),
		due: suppliers.reduce((s, r) => s + Math.max(r.earning - r.paid - r.pending_payout, 0), 0)
	}), [all, suppliers]);
	const paged = usePaginated(rows, page, perPage);
	async function setStatus(id, status) {
		setBusyId(id);
		const patch = { status };
		if (status === "approved") patch.approved_at = (/* @__PURE__ */ new Date()).toISOString();
		if (status === "paid") {
			patch.approved_at = (/* @__PURE__ */ new Date()).toISOString();
			patch.paid_at = (/* @__PURE__ */ new Date()).toISOString();
		}
		const { error } = await supabase.from("supplier_payouts").update(patch).eq("id", id);
		setBusyId(null);
		if (error) return toast.error(error.message);
		toast.success("Payout updated");
		load();
	}
	async function createPayout(e) {
		e.preventDefault();
		if (!supplierId) return toast.error("Please select a supplier");
		const amt = Number(amount);
		if (!amt || amt <= 0) return toast.error("Please enter a valid amount");
		setCreating(true);
		const { error } = await supabase.from("supplier_payouts").insert({
			supplier_id: supplierId,
			amount: amt,
			method: method || null,
			reference: reference || null,
			status: "paid",
			approved_at: (/* @__PURE__ */ new Date()).toISOString(),
			paid_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		setCreating(false);
		if (error) return toast.error(error.message);
		setAmount("");
		setReference("");
		toast.success("Payment recorded");
		load();
	}
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const selected = suppliers.find((s) => s.id === supplierId);
	const available = selected ? Math.max(selected.earning - selected.paid - selected.pending_payout, 0) : 0;
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Supplier payouts",
			description: "Approve/pay supplier withdrawal requests, or record a payment directly."
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mb-4 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "Payable now",
					value: bdtNum(totals.due),
					tone: "violet",
					icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Pending requests",
					value: bdtNum(totals.pending),
					tone: "amber",
					icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Approved",
					value: bdtNum(totals.approved),
					tone: "sky",
					icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Paid",
					value: bdtNum(totals.paid),
					tone: "emerald",
					icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" })
				})
			]
		}),
		canManage && /* @__PURE__ */ jsxs("form", {
			onSubmit: createPayout,
			className: "surface-card mb-4 grid gap-3 p-4 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-medium",
						children: "Supplier"
					}),
					/* @__PURE__ */ jsxs("select", {
						value: supplierId,
						onChange: (e) => setSupplierId(e.target.value),
						className: inp,
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "— Select —"
						}), suppliers.map((s) => /* @__PURE__ */ jsxs("option", {
							value: s.id,
							children: [
								s.display_name,
								" (",
								s.code,
								")"
							]
						}, s.id))]
					}),
					selected && /* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: ["Payable: ", bdtNum(available)]
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					className: "mb-1 block text-xs font-medium",
					children: "Amount (৳)"
				}), /* @__PURE__ */ jsx("input", {
					value: amount,
					onChange: (e) => setAmount(e.target.value),
					type: "number",
					min: 0,
					className: inp
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					className: "mb-1 block text-xs font-medium",
					children: "Method"
				}), /* @__PURE__ */ jsx("input", {
					value: method,
					onChange: (e) => setMethod(e.target.value),
					placeholder: "bkash / bank",
					className: inp
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					className: "mb-1 block text-xs font-medium",
					children: "Reference / note"
				}), /* @__PURE__ */ jsx("input", {
					value: reference,
					onChange: (e) => setReference(e.target.value),
					className: inp
				})] }),
				/* @__PURE__ */ jsx("div", {
					className: "flex items-end",
					children: /* @__PURE__ */ jsxs("button", {
						disabled: creating,
						className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
						children: [
							creating ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
							" ",
							"Record payment"
						]
					})
				})
			]
		}),
		/* @__PURE__ */ jsx(StatusTabs, {
			tabs: TABS,
			tab,
			onChange: (k) => {
				setTab(k);
				setPage(1);
			},
			count
		}),
		/* @__PURE__ */ jsx(DataToolbar, {
			search,
			onSearch: (v) => {
				setSearch(v);
				setPage(1);
			},
			searchPlaceholder: "Search supplier, method, reference…",
			filters: [{
				key: "supplier",
				label: "Supplier",
				value: supplierFilter,
				onChange: (v) => {
					setSupplierFilter(v);
					setPage(1);
				},
				options: [{
					value: "",
					label: "All suppliers"
				}, ...suppliers.map((s) => ({
					value: s.id,
					label: s.display_name
				}))]
			}],
			perPage,
			onPerPage: (n) => {
				setPerPage(n);
				setPage(1);
			}
		}),
		rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
			title: "No payouts",
			description: "No payout records."
		}) : /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx("div", {
				className: "space-y-2 md:hidden",
				children: paged.map((p) => /* @__PURE__ */ jsxs("div", {
					className: "surface-card p-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "truncate text-sm font-medium",
									children: p.supplier_name
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-[11px] text-muted-foreground",
									children: [
										new Date(p.created_at).toLocaleDateString(),
										" · ",
										p.method ?? "—"
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-right",
								children: [/* @__PURE__ */ jsx("div", {
									className: "font-semibold tabular-nums",
									children: bdtNum(Number(p.amount))
								}), /* @__PURE__ */ jsx("span", {
									className: "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize " + (TONE[p.status] ?? "bg-muted"),
									children: p.status
								})]
							})]
						}),
						(p.reference || p.note) && /* @__PURE__ */ jsx("p", {
							className: "mt-2 rounded-md border border-dashed p-2 text-[11px] text-muted-foreground",
							children: p.reference ?? p.note
						}),
						/* @__PURE__ */ jsx(Actions, {
							p,
							busy: busyId === p.id,
							setStatus,
							canManage,
							className: "mt-3 justify-end"
						})
					]
				}, p.id))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "surface-card hidden overflow-x-auto md:block",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-xs",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-muted/40 text-left uppercase text-muted-foreground",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Date"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Supplier"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Amount"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Method"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Reference"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Status"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ jsx("tbody", {
						className: "divide-y",
						children: paged.map((p) => /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("td", {
								className: "whitespace-nowrap p-3",
								children: new Date(p.created_at).toLocaleDateString()
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 font-medium",
								children: p.supplier_name
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 font-semibold tabular-nums",
								children: bdtNum(Number(p.amount))
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 capitalize text-muted-foreground",
								children: p.method ?? "—"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 text-muted-foreground",
								children: p.reference ?? p.note ?? "—"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: /* @__PURE__ */ jsx("span", {
									className: "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize " + (TONE[p.status] ?? "bg-muted"),
									children: p.status
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 text-right",
								children: /* @__PURE__ */ jsx(Actions, {
									p,
									busy: busyId === p.id,
									setStatus,
									canManage,
									className: "justify-end"
								})
							})
						] }, p.id))
					})]
				})
			}),
			/* @__PURE__ */ jsx(Pagination, {
				page,
				perPage,
				total: rows.length,
				onPage: setPage
			})
		] })
	] });
}
function Actions({ p, busy, setStatus, canManage, className = "" }) {
	if (p.status === "paid" || p.status === "rejected" || !canManage) return /* @__PURE__ */ jsx("span", {
		className: "text-[11px] text-muted-foreground",
		children: "—"
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "inline-flex flex-wrap gap-1 " + className,
		children: [p.status === "pending" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Btn, {
			busy,
			onClick: () => setStatus(p.id, "approved"),
			label: "Approve",
			icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3" })
		}), /* @__PURE__ */ jsx(Btn, {
			busy,
			onClick: () => setStatus(p.id, "rejected"),
			label: "Reject",
			danger: true,
			icon: /* @__PURE__ */ jsx(XCircle, { className: "h-3 w-3" })
		})] }), /* @__PURE__ */ jsx(Btn, {
			busy,
			onClick: () => setStatus(p.id, "paid"),
			label: "Mark paid",
			icon: /* @__PURE__ */ jsx(Wallet, { className: "h-3 w-3" })
		})]
	});
}
function Btn({ label, onClick, busy, danger, icon }) {
	return /* @__PURE__ */ jsxs("button", {
		onClick,
		disabled: busy,
		className: "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors disabled:opacity-50 " + (danger ? "border-destructive/40 text-destructive hover:bg-destructive/10" : "hover:bg-muted"),
		children: [
			busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-3 w-3 animate-spin" }) : icon,
			" ",
			label
		]
	});
}
//#endregion
export { AdminSupplierPayoutsPage as component };
