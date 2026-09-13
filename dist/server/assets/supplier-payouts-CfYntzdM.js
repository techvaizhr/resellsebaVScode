import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-DdbbmuGT.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Fn as CircleX, Mt as LoaderCircle, Vn as CircleCheck, a as Wallet, et as Plus, jn as Clock } from "./vendor-icons-BWIzFOtW.js";
import { n as PageHeader, r as StatCard, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { r as useCan } from "./use-auth-BsApJ5EH.js";
import { i as usePaginated, n as DataToolbar, r as Pagination } from "./data-list-CbGEMtW0.js";
import { i as loadAdminSupplierOverview, n as bdtNum } from "./supplier-CsU73uC9.js";
import { t as StatusTabs } from "./status-tabs-N_K_7Ycs.js";
//#region src/routes/_authenticated/admin/supplier-payouts.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("all");
	const [search, setSearch] = (0, import_react.useState)("");
	const [supplierFilter, setSupplierFilter] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [perPage, setPerPage] = (0, import_react.useState)(20);
	const [supplierId, setSupplierId] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)("");
	const [reference, setReference] = (0, import_react.useState)("");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const canManage = useCan()("suppliers.manage", "payouts.manage");
	const load = (0, import_react.useCallback)(async () => {
		try {
			setData(await loadAdminSupplierOverview());
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Load failed");
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const suppliers = data?.suppliers ?? [];
	const all = data?.payouts ?? [];
	const scoped = (0, import_react.useMemo)(() => {
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
	const rows = (0, import_react.useMemo)(() => tab === "all" ? scoped : scoped.filter((p) => p.status === tab), [scoped, tab]);
	const count = (0, import_react.useCallback)((k) => k === "all" ? scoped.length : scoped.filter((p) => p.status === k).length, [scoped]);
	const totals = (0, import_react.useMemo)(() => ({
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
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const selected = suppliers.find((s) => s.id === supplierId);
	const available = selected ? Math.max(selected.earning - selected.paid - selected.pending_payout, 0) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Supplier payouts",
			description: "Approve/pay supplier withdrawal requests, or record a payment directly."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Payable now",
					value: bdtNum(totals.due),
					tone: "violet",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Pending requests",
					value: bdtNum(totals.pending),
					tone: "amber",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Approved",
					value: bdtNum(totals.approved),
					tone: "sky",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Paid",
					value: bdtNum(totals.paid),
					tone: "emerald",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
				})
			]
		}),
		canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: createPayout,
			className: "surface-card mb-4 grid gap-3 p-4 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium",
						children: "Supplier"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: supplierId,
						onChange: (e) => setSupplierId(e.target.value),
						className: inp,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "— Select —"
						}), suppliers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: s.id,
							children: [
								s.display_name,
								" (",
								s.code,
								")"
							]
						}, s.id))]
					}),
					selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: ["Payable: ", bdtNum(available)]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs font-medium",
					children: "Amount (৳)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: amount,
					onChange: (e) => setAmount(e.target.value),
					type: "number",
					min: 0,
					className: inp
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs font-medium",
					children: "Method"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: method,
					onChange: (e) => setMethod(e.target.value),
					placeholder: "bkash / bank",
					className: inp
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs font-medium",
					children: "Reference / note"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: reference,
					onChange: (e) => setReference(e.target.value),
					className: inp
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: creating,
						className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
						children: [
							creating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
							" ",
							"Record payment"
						]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusTabs, {
			tabs: TABS,
			tab,
			onChange: (k) => {
				setTab(k);
				setPage(1);
			},
			count
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataToolbar, {
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
		rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No payouts",
			description: "No payout records."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 md:hidden",
				children: paged.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium",
									children: p.supplier_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground",
									children: [
										new Date(p.created_at).toLocaleDateString(),
										" · ",
										p.method ?? "—"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold tabular-nums",
									children: bdtNum(Number(p.amount))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize " + (TONE[p.status] ?? "bg-muted"),
									children: p.status
								})]
							})]
						}),
						(p.reference || p.note) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 rounded-md border border-dashed p-2 text-[11px] text-muted-foreground",
							children: p.reference ?? p.note
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
							p,
							busy: busyId === p.id,
							setStatus,
							canManage,
							className: "mt-3 justify-end"
						})
					]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card hidden overflow-x-auto md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/40 text-left uppercase text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Supplier"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Method"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Reference"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y",
						children: paged.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "whitespace-nowrap p-3",
								children: new Date(p.created_at).toLocaleDateString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-medium",
								children: p.supplier_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-semibold tabular-nums",
								children: bdtNum(Number(p.amount))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 capitalize text-muted-foreground",
								children: p.method ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-muted-foreground",
								children: p.reference ?? p.note ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize " + (TONE[p.status] ?? "bg-muted"),
									children: p.status
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
				page,
				perPage,
				total: rows.length,
				onPage: setPage
			})
		] })
	] });
}
function Actions({ p, busy, setStatus, canManage, className = "" }) {
	if (p.status === "paid" || p.status === "rejected" || !canManage) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-[11px] text-muted-foreground",
		children: "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex flex-wrap gap-1 " + className,
		children: [p.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			busy,
			onClick: () => setStatus(p.id, "approved"),
			label: "Approve",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			busy,
			onClick: () => setStatus(p.id, "rejected"),
			label: "Reject",
			danger: true,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3 w-3" })
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			busy,
			onClick: () => setStatus(p.id, "paid"),
			label: "Mark paid",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-3 w-3" })
		})]
	});
}
function Btn({ label, onClick, busy, danger, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		disabled: busy,
		className: "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors disabled:opacity-50 " + (danger ? "border-destructive/40 text-destructive hover:bg-destructive/10" : "hover:bg-muted"),
		children: [
			busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : icon,
			" ",
			label
		]
	});
}
//#endregion
export { AdminSupplierPayoutsPage as component };
