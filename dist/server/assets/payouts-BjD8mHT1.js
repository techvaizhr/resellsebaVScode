import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { D as formatDate, O as formatDateTime, r as supabase } from "./client-BAn7XKYw.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Nt as LoaderCircle, Wt as Landmark, a as Wallet, it as Phone, jn as Copy, r as X, tr as Check, v as Trash2 } from "./vendor-icons-DF2A5Z8S.js";
import { t as ConfirmModal } from "./ConfirmModal-DSu87j9m.js";
import { t as Route } from "./payouts-ngUS4Hoq.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { t as SearchableSelect } from "./searchable-select-BnAjxEDw.js";
import { n as useAuth, r as useCan } from "./use-auth-zbqaYCVZ.js";
import { i as usePaginated, n as DataToolbar, r as Pagination } from "./data-list-D-TkvXUz.js";
//#region src/routes/_authenticated/admin/payouts.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	"pending",
	"approved",
	"paid",
	"rejected",
	"all"
];
async function copy(text, label) {
	try {
		await navigator.clipboard.writeText(text);
		toast.success(`${label} copied`);
	} catch {
		toast.error("Copy failed");
	}
}
function CopyChip({ value, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => copy(value, label),
		title: `Copy ${label}`,
		className: "inline-flex max-w-full items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] hover:bg-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3 shrink-0 opacity-70" })]
	});
}
function PayoutAccount({ r, fallback }) {
	if (!r?.payout_account_number) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs text-muted-foreground",
		children: fallback || "No account saved"
	});
	const isBank = r.payout_method === "bank";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-xs font-medium capitalize",
				children: [isBank ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "h-3.5 w-3.5 opacity-70" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5 opacity-70" }), r.payout_method ?? "—"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyChip, {
				value: r.payout_account_number,
				label: isBank ? "Account number" : "Mobile number"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[11px] text-muted-foreground",
				children: [
					r.payout_account_name || "—",
					isBank && r.payout_bank_name ? ` · ${r.payout_bank_name}` : "",
					isBank && r.payout_branch ? ` · ${r.payout_branch}` : "",
					isBank && r.payout_routing ? ` · Routing ${r.payout_routing}` : ""
				]
			})
		]
	});
}
function StatusPill({ s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full px-2 py-0.5 text-[10px] capitalize " + statusStyle(s),
		children: s
	});
}
function AdminPayouts() {
	const sp = Route.useSearch();
	const [allRows, setAllRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filter, setFilter] = (0, import_react.useState)(FILTERS.includes(sp.status ?? "") ? sp.status : "pending");
	const [resellerFilter, setResellerFilter] = (0, import_react.useState)(sp.reseller ?? "");
	const [query, setQuery] = (0, import_react.useState)("");
	const [perPage, setPerPage] = (0, import_react.useState)(20);
	const [page, setPage] = (0, import_react.useState)(1);
	const [action, setAction] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const { roles } = useAuth();
	const isSuperAdmin = roles.includes("super_admin");
	const canManage = useCan()("payouts.manage");
	const [toDelete, setToDelete] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function load() {
		setLoading(true);
		const { data, error } = await supabase.from("payouts").select("*, reseller:resellers(code, business_name, payout_method, payout_account_name, payout_account_number, payout_bank_name, payout_branch, payout_routing)").order("created_at", { ascending: false });
		if (error) toast.error(error.message);
		setAllRows(data ?? []);
		setLoading(false);
	}
	const resellerOptions = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const r of allRows) if (r.reseller_id && r.reseller) m.set(r.reseller_id, `${r.reseller.business_name} (${r.reseller.code})`);
		return [...m].map(([id, label]) => ({
			id,
			label
		})).sort((a, b) => a.label.localeCompare(b.label));
	}, [allRows]);
	const scoped = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return allRows.filter((r) => {
			if (resellerFilter && r.reseller_id !== resellerFilter) return false;
			if (!q) return true;
			return [
				r.reseller?.business_name,
				r.reseller?.code,
				r.reference,
				r.method,
				String(r.amount)
			].join(" ").toLowerCase().includes(q);
		});
	}, [
		allRows,
		resellerFilter,
		query
	]);
	const counts = FILTERS.reduce((acc, f) => {
		acc[f] = f === "all" ? scoped.length : scoped.filter((r) => r.status === f).length;
		return acc;
	}, {});
	const filteredRows = filter === "all" ? scoped : scoped.filter((r) => r.status === filter);
	const rows = usePaginated(filteredRows, page, perPage);
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [
		filter,
		resellerFilter,
		query,
		perPage
	]);
	async function submitAction() {
		if (!action) return;
		const { row, status } = action;
		if (status === "rejected" && !note.trim()) return toast.error("Please write a reason for rejection");
		const patch = { status };
		if (status === "paid") patch.paid_at = (/* @__PURE__ */ new Date()).toISOString();
		if (note.trim()) patch.notes = note.trim();
		setBusy(true);
		const { error } = await supabase.from("payouts").update(patch).eq("id", row.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success(`Marked ${status}`);
		setAction(null);
		setNote("");
		load();
	}
	async function confirmDelete() {
		if (!toDelete) return;
		setDeleting(true);
		const { error } = await supabase.from("payouts").delete().eq("id", toDelete.id);
		setDeleting(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Payout deleted");
		setToDelete(null);
		load();
	}
	function open(row, status) {
		setAction({
			row,
			status
		});
		setNote(row.notes ?? "");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Payout Management",
			description: "Review withdrawal requests, check payout accounts and process payments."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataToolbar, {
			search: query,
			onSearch: setQuery,
			searchPlaceholder: "Search reseller, account, reference…",
			perPage,
			onPerPage: setPerPage,
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchableSelect, {
				options: resellerOptions.map((o) => ({
					value: o.id,
					label: o.label
				})),
				value: resellerFilter,
				onChange: setResellerFilter,
				placeholder: "All resellers",
				searchPlaceholder: "Search reseller…",
				className: "w-full sm:w-[240px]",
				align: "end"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setFilter(f),
				className: "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs capitalize transition-colors " + (filter === f ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-muted"),
				children: [f, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full px-1.5 py-0 text-[10px] font-semibold tabular-nums " + (filter === f ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"),
					children: counts[f]
				})]
			}, f))
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid place-items-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : filteredRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card p-12 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "mx-auto h-8 w-8 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					"No ",
					filter,
					" payouts."
				]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3 lg:hidden",
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-semibold",
									children: r.reseller?.business_name ?? "—"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground",
									children: formatDateTime(r.created_at)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold tabular-nums",
									children: ["৳", Number(r.amount).toLocaleString()]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: r.status })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 rounded-md border bg-muted/30 p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayoutAccount, {
								r: r.reseller,
								fallback: r.reference
							})
						}),
						r.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 rounded-md border border-dashed p-2 text-[11px] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: "Admin note:"
								}),
								" ",
								r.notes
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: actions(r)
						})
					]
				}, r.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card hidden overflow-x-auto lg:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/40 text-left text-xs uppercase text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Reseller"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Payout account"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Admin note"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t align-top",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: r.reseller?.business_name ?? "—"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-3 font-semibold tabular-nums",
								children: ["৳", Number(r.amount).toLocaleString()]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayoutAccount, {
									r: r.reseller,
									fallback: r.reference
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: r.status })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 max-w-[220px] text-xs text-muted-foreground",
								children: r.notes || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-xs text-muted-foreground",
								children: formatDate(r.created_at)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: actions(r)
							})
						]
					}, r.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
				page,
				perPage,
				total: filteredRows.length,
				onPage: setPage
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
			isOpen: !!toDelete,
			onClose: () => !deleting && setToDelete(null),
			onConfirm: confirmDelete,
			isLoading: deleting,
			variant: "danger",
			title: "Delete this payout?",
			description: toDelete ? `${toDelete.reseller?.business_name ?? "Reseller"} · BDT ${Number(toDelete.amount).toLocaleString()} (${toDelete.status}). This permanently removes the record from payout history and the reseller timeline, and the amount becomes withdrawable again. This cannot be undone.` : "",
			confirmText: "Delete payout"
		}),
		action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4",
			onClick: () => !busy && setAction(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md rounded-xl border bg-card p-5 shadow-xl",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm font-semibold capitalize",
						children: ["Mark payout ", action.status]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							action.row.reseller?.business_name,
							" · ৳",
							Number(action.row.amount).toLocaleString()
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 mb-1 block text-xs font-medium",
						children: ["Admin note ", action.status === "rejected" ? "(reason — required)" : "(optional)"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: note,
						onChange: (e) => setNote(e.target.value),
						rows: 3,
						placeholder: action.status === "rejected" ? "Why is this request rejected?" : "Transaction ID or remarks…",
						className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: "The reseller will see this note in their payout list and timeline."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setAction(null),
							disabled: busy,
							className: "rounded-md border px-3 py-1.5 text-xs",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: submitAction,
							disabled: busy,
							className: "btn-brand inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium disabled:opacity-50",
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Confirm"]
						})]
					})
				]
			})
		})
	] });
	function actions(r) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-1.5",
			children: [
				canManage && r.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => open(r, "approved"),
					className: "rounded-md border px-2 py-1 text-xs hover:bg-muted",
					children: "Approve"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => open(r, "rejected"),
					className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-destructive hover:bg-destructive/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" }), " Reject"]
				})] }),
				canManage && r.status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => open(r, "paid"),
					className: "btn-brand inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " Mark paid"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => open(r, "rejected"),
					className: "rounded-md border px-2 py-1 text-xs text-destructive hover:bg-destructive/10",
					children: "Reject"
				})] }),
				(r.status === "paid" || r.status === "rejected") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-muted-foreground",
					children: r.paid_at ? `Paid ${formatDate(r.paid_at)}` : "Closed"
				}),
				isSuperAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setToDelete(r),
					title: "Delete payout (super admin only)",
					className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-destructive hover:bg-destructive/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" }), " Delete"]
				})
			]
		});
	}
}
function statusStyle(s) {
	return s === "paid" ? "bg-success/20 text-success" : s === "approved" ? "bg-primary/15 text-primary" : s === "rejected" ? "bg-destructive/20 text-destructive" : "bg-warning/20 text-warning-foreground";
}
//#endregion
export { AdminPayouts as component };
