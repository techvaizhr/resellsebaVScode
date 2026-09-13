import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-KjQ-na90.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Mt as LoaderCircle, Sn as Download, X as Receipt, a as Wallet, et as Plus, nr as CalendarDays, ot as Pencil, v as Trash2 } from "./vendor-icons-BWIzFOtW.js";
import { t as ConfirmModal } from "./ConfirmModal-B_9J8UhI.js";
import { n as PageHeader, r as StatCard } from "./ui-kit-QFWJ0cl0.js";
import { _ as toCsv, a as downloadCsv, r as bdt } from "./finance-report-Dwy2dA23.js";
import { r as useCan } from "./use-auth-BdX1T6s2.js";
import { i as DEFAULT_ORDER_FILTERS, l as resolveDateRange, r as DATE_PRESET_OPTIONS } from "./order-filters-Ct-Q13Z2.js";
import { i as usePaginated, n as DataToolbar, r as Pagination } from "./data-list-CbGEMtW0.js";
import { n as ReportCard } from "./report-blocks-D0S7vpGP.js";
import { n as EXPENSE_CATEGORIES } from "./business-report-DlB3Zbm8.js";
//#region src/routes/_authenticated/admin/expenses.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyForm = () => ({
	title: "",
	category: "other",
	amount: "",
	spent_on: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
	method: "",
	reference: "",
	note: ""
});
var input = "h-9 w-full rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring";
var th = "px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground";
function ExpensesPage() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(null);
	const [del, setDel] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("");
	const [preset, setPreset] = (0, import_react.useState)("lifetime");
	const [page, setPage] = (0, import_react.useState)(1);
	const [perPage, setPerPage] = (0, import_react.useState)(20);
	const canManage = useCan()("expenses.manage");
	const load = async () => {
		setLoading(true);
		const { data, error } = await supabase.from("expenses").select("*").order("spent_on", { ascending: false });
		if (error) toast.error(error.message);
		setRows(data ?? []);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		const { fromTs, toTs } = resolveDateRange({
			...DEFAULT_ORDER_FILTERS,
			datePreset: preset
		});
		const needle = q.trim().toLowerCase();
		return rows.filter((e) => {
			if (cat && e.category !== cat) return false;
			if (needle) {
				if (![
					e.title,
					e.category,
					e.method ?? "",
					e.reference ?? "",
					e.note ?? ""
				].join(" ").toLowerCase().includes(needle)) return false;
			}
			const ts = (/* @__PURE__ */ new Date(`${e.spent_on}T12:00:00`)).getTime();
			if (fromTs != null && ts < fromTs) return false;
			if (toTs != null && ts > toTs) return false;
			return true;
		});
	}, [
		rows,
		q,
		cat,
		preset
	]);
	const total = filtered.reduce((t, e) => t + Number(e.amount ?? 0), 0);
	const byCat = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const e of filtered) m.set(e.category, (m.get(e.category) ?? 0) + Number(e.amount ?? 0));
		return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
	}, [filtered]);
	const paged = usePaginated(filtered, page, perPage);
	const save = async () => {
		if (!form) return;
		if (!form.title.trim()) return toast.error("Expense title is required.");
		const amount = Number(form.amount);
		if (!Number.isFinite(amount) || amount <= 0) return toast.error("Enter a valid amount.");
		setSaving(true);
		const payload = {
			title: form.title.trim(),
			category: form.category,
			amount,
			spent_on: form.spent_on,
			method: form.method.trim() || null,
			reference: form.reference.trim() || null,
			note: form.note.trim() || null
		};
		const { error } = form.id ? await supabase.from("expenses").update(payload).eq("id", form.id) : await supabase.from("expenses").insert(payload);
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success(form.id ? "Expense updated." : "Expense added.");
		setForm(null);
		load();
	};
	const remove = async () => {
		if (!del) return;
		const { error } = await supabase.from("expenses").delete().eq("id", del.id);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Expense deleted.");
		setDel(null);
		load();
	};
	const exportCsv = () => downloadCsv("business-expenses.csv", toCsv([
		"Date",
		"Title",
		"Category",
		"Amount",
		"Method",
		"Reference",
		"Note"
	], filtered.map((e) => [
		e.spent_on,
		e.title,
		e.category,
		Number(e.amount ?? 0),
		e.method ?? "",
		e.reference ?? "",
		e.note ?? ""
	])));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Business expenses",
			description: "Every cost you pay from your own pocket. These totals are deducted in the admin profit & loss report.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: exportCsv,
					className: "inline-flex items-center rounded-md border px-2.5 py-1.5 text-xs hover:bg-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), " Export"]
				}), canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setForm(emptyForm()),
					className: "inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-3.5 w-3.5" }), " Add expense"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Total expense",
				value: bdt(total),
				hint: `${filtered.length} entries in this range`,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }),
				tone: "rose"
			}), byCat.slice(0, 3).map(([c, amt]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: `${c} expense`,
				value: bdt(amt),
				hint: "Category total in this range",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4" }),
				tone: "violet"
			}, c))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataToolbar, {
			inline: true,
			search: q,
			onSearch: (v) => {
				setQ(v);
				setPage(1);
			},
			searchPlaceholder: "Search title, reference, note…",
			perPage,
			onPerPage: (n) => {
				setPerPage(n);
				setPage(1);
			},
			filters: [{
				key: "cat",
				label: "Category",
				value: cat,
				onChange: (v) => {
					setCat(v);
					setPage(1);
				},
				options: EXPENSE_CATEGORIES.map((c) => ({
					value: c,
					label: c
				}))
			}],
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "inline-flex items-center gap-1 rounded-md border bg-background px-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: preset,
					onChange: (e) => {
						setPreset(e.target.value);
						setPage(1);
					},
					className: "h-9 bg-transparent text-xs outline-none",
					children: DATE_PRESET_OPTIONS.filter((o) => o.value !== "custom").map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: o.value,
						children: o.label
					}, o.value))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
			title: "Expense ledger",
			hint: "Newest first — edit or delete any entry.",
			children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[820px] text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: th,
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: th,
								children: "Title"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: th,
								children: "Category"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground text-right",
								children: "Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: th,
								children: "Method / ref"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: th,
								children: "Note"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground text-right",
								children: "Actions"
							})
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [paged.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 whitespace-nowrap font-mono text-xs",
								children: e.spent_on
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-medium",
								children: e.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-muted px-2 py-0.5 text-[11px] capitalize",
									children: e.category
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2 text-right font-semibold tabular-nums text-destructive",
								children: ["−", bdt(Number(e.amount ?? 0))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2 text-xs text-muted-foreground",
								children: [e.method || "—", e.reference ? ` · ${e.reference}` : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-xs text-muted-foreground",
								children: e.note || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-right",
								children: canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										title: "Edit",
										onClick: () => setForm({
											id: e.id,
											title: e.title,
											category: e.category,
											amount: String(e.amount ?? ""),
											spent_on: e.spent_on,
											method: e.method ?? "",
											reference: e.reference ?? "",
											note: e.note ?? ""
										}),
										className: "rounded-md border p-1.5 hover:bg-accent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										title: "Delete",
										onClick: () => setDel(e),
										className: "rounded-md border p-1.5 text-destructive hover:bg-destructive/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "—"
								})
							})
						]
					}, e.id)), paged.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 7,
						className: "px-3 py-10 text-center text-xs text-muted-foreground",
						children: "No expense recorded in this range."
					}) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
						className: "border-t bg-muted/30 font-semibold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								colSpan: 3,
								children: "Total"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2 text-right tabular-nums text-destructive",
								children: ["−", bdt(total)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { colSpan: 3 })
						] })
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
			page,
			perPage,
			total: filtered.length,
			onPage: setPage
		}),
		form && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card w-full max-w-lg space-y-3 rounded-t-2xl p-5 sm:rounded-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-black uppercase tracking-widest text-muted-foreground",
						children: form.id ? "Edit expense" : "Add expense"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "sm:col-span-2 flex flex-col gap-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-muted-foreground",
									children: "Title"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input,
									value: form.title,
									onChange: (e) => setForm({
										...form,
										title: e.target.value
									}),
									placeholder: "e.g. Facebook ad boost"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-muted-foreground",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: input,
									value: form.category,
									onChange: (e) => setForm({
										...form,
										category: e.target.value
									}),
									children: EXPENSE_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c,
										children: c
									}, c))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-muted-foreground",
									children: "Amount (৳)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input,
									type: "number",
									min: "0",
									value: form.amount,
									onChange: (e) => setForm({
										...form,
										amount: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-muted-foreground",
									children: "Spent on"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input,
									type: "date",
									value: form.spent_on,
									onChange: (e) => setForm({
										...form,
										spent_on: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-muted-foreground",
									children: "Method"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input,
									value: form.method,
									onChange: (e) => setForm({
										...form,
										method: e.target.value
									}),
									placeholder: "bKash / cash / bank"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-muted-foreground",
									children: "Reference"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input,
									value: form.reference,
									onChange: (e) => setForm({
										...form,
										reference: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-muted-foreground",
									children: "Note"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input,
									value: form.note,
									onChange: (e) => setForm({
										...form,
										note: e.target.value
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setForm(null),
							className: "rounded-md border px-3 py-1.5 text-xs hover:bg-accent",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => void save(),
							disabled: saving,
							className: "inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60",
							children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }), " Save"]
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
			isOpen: !!del,
			onClose: () => setDel(null),
			onConfirm: remove,
			title: "Delete this expense?",
			description: "The amount will no longer be deducted from the admin profit & loss report.",
			detail: del ? `${del.title} · ${bdt(Number(del.amount ?? 0))}` : void 0,
			confirmText: "Delete",
			variant: "danger"
		})
	] });
}
//#endregion
export { ExpensesPage as component };
