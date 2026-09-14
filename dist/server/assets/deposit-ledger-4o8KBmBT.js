import { r as supabase } from "./client-Be051lUg.js";
import { t as ConfirmModal } from "./ConfirmModal-CPm0pZdA.js";
import { t as SearchableSelect } from "./searchable-select-CJDs5oIk.js";
import { i as formatTime, t as formatDate } from "./date-zfkEdx3e.js";
import { r as useCan } from "./use-auth-DJu3SP6g.js";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Search, Trash2, Wallet, X } from "lucide-react";
//#region src/components/deposit-ledger.tsx
var METHODS = [
	"bkash",
	"nagad",
	"rocket",
	"bank",
	"cash",
	"adjustment"
];
var bdt = (v) => `৳${Number(v || 0).toLocaleString("en-US")}`;
/**
* Deposit transaction list with edit + delete.
* Pass `resellerId` to scope it to a single reseller (deposit modal),
* omit it for the platform-wide admin list.
*/
function DepositLedger({ resellerId, onChanged, compact }) {
	const canManage = useCan()("deposits.manage");
	const [rows, setRows] = useState([]);
	const [names, setNames] = useState({});
	const [resellers, setResellers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [filterReseller, setFilterReseller] = useState("");
	const [showAdd, setShowAdd] = useState(false);
	const [editRow, setEditRow] = useState(null);
	const [deleteRow, setDeleteRow] = useState(null);
	async function load() {
		setLoading(true);
		let q = supabase.from("reseller_deposits").select("id,reseller_id,amount,method,reference,note,created_at").order("created_at", { ascending: false }).limit(500);
		if (resellerId) q = q.eq("reseller_id", resellerId);
		const { data, error } = await q;
		if (error) toast.error(error.message);
		setRows(data ?? []);
		setLoading(false);
	}
	useEffect(() => {
		load();
	}, [resellerId]);
	useEffect(() => {
		if (resellerId) return;
		supabase.from("resellers").select("id,business_name,code").order("business_name").then(({ data }) => {
			const map = {};
			const list = (data ?? []).map((r) => {
				map[r.id] = `${r.business_name} · ${r.code}`;
				return {
					id: r.id,
					label: `${r.business_name} · ${r.code}`
				};
			});
			setNames(map);
			setResellers(list);
		});
	}, [resellerId]);
	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return rows.filter((r) => {
			if (filterReseller && r.reseller_id !== filterReseller) return false;
			if (!q) return true;
			return [
				names[r.reseller_id],
				r.method,
				r.reference,
				r.note,
				String(r.amount)
			].filter(Boolean).join(" ").toLowerCase().includes(q);
		});
	}, [
		rows,
		search,
		filterReseller,
		names
	]);
	const total = filtered.reduce((n, r) => n + Number(r.amount), 0);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [
			!compact && /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-end gap-2",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex min-w-[220px] flex-1 flex-col gap-1",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[11px] font-medium text-muted-foreground",
							children: "Search"
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex h-9 items-center rounded-md border bg-background px-2 focus-within:ring-2 focus-within:ring-ring",
							children: [
								/* @__PURE__ */ jsx(Search, { className: "mr-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
								/* @__PURE__ */ jsx("input", {
									value: search,
									onChange: (e) => setSearch(e.target.value),
									placeholder: "Reseller, method, reference, note…",
									className: "h-full w-full bg-transparent text-sm outline-none"
								}),
								search && /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setSearch(""),
									className: "rounded p-0.5 hover:bg-accent",
									children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
								})
							]
						})]
					}),
					/* @__PURE__ */ jsx(SearchableSelect, {
						label: "Reseller",
						placeholder: "All resellers",
						value: filterReseller,
						onChange: setFilterReseller,
						options: [{
							value: "",
							label: "All resellers"
						}, ...resellers.map((r) => ({
							value: r.id,
							label: r.label
						}))],
						className: "min-w-[180px] flex-1"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex h-9 items-center gap-2 rounded-md border bg-muted/40 px-3 text-xs font-semibold",
						children: [
							/* @__PURE__ */ jsx(Wallet, { className: "h-3.5 w-3.5 text-primary" }),
							" ",
							bdt(total),
							/* @__PURE__ */ jsxs("span", {
								className: "font-normal text-muted-foreground",
								children: [
									"· ",
									filtered.length,
									" entries"
								]
							})
						]
					}),
					canManage && /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setShowAdd(true),
						className: "btn-brand inline-flex h-9 items-center gap-1.5 rounded-md px-3.5 text-xs font-semibold",
						children: [/* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }), " Add entry"]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto rounded-md border",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-xs",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-muted/40 text-left uppercase text-muted-foreground",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "p-2",
								children: "Date"
							}),
							!resellerId && /* @__PURE__ */ jsx("th", {
								className: "p-2",
								children: "Reseller"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-2",
								children: "Amount"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-2",
								children: "Method"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-2",
								children: "Reference"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-2",
								children: "Note"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-2 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ jsxs("tbody", { children: [
						filtered.map((r) => /* @__PURE__ */ jsxs("tr", {
							className: "border-t align-top",
							children: [
								/* @__PURE__ */ jsxs("td", {
									className: "whitespace-nowrap p-2",
									children: [formatDate(r.created_at), /* @__PURE__ */ jsx("div", {
										className: "text-[10px] text-muted-foreground",
										children: formatTime(r.created_at)
									})]
								}),
								!resellerId && /* @__PURE__ */ jsx("td", {
									className: "p-2",
									children: names[r.reseller_id] ?? "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "whitespace-nowrap p-2 font-semibold " + (Number(r.amount) < 0 ? "text-destructive" : "text-success"),
									children: bdt(Number(r.amount))
								}),
								/* @__PURE__ */ jsx("td", {
									className: "p-2 capitalize",
									children: r.method ?? "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "p-2 text-muted-foreground",
									children: r.reference ?? "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "p-2 text-muted-foreground",
									children: r.note ?? "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "whitespace-nowrap p-2 text-right",
									children: canManage ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setEditRow(r),
										className: "rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground",
										"aria-label": "Edit entry",
										children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setDeleteRow(r),
										className: "ml-1 rounded-md p-1 text-destructive hover:bg-destructive/10",
										"aria-label": "Delete entry",
										children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
									})] }) : /* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "—"
									})
								})
							]
						}, r.id)),
						loading && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 7,
							className: "p-6 text-center",
							children: /* @__PURE__ */ jsx(Loader2, { className: "mx-auto h-4 w-4 animate-spin text-muted-foreground" })
						}) }),
						!loading && filtered.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 7,
							className: "p-6 text-center text-muted-foreground",
							children: "No deposit transactions yet."
						}) })
					] })]
				})
			}),
			showAdd && /* @__PURE__ */ jsx(AddDepositModal, {
				resellers,
				preselectedResellerId: resellerId || filterReseller,
				onClose: () => setShowAdd(false),
				onSaved: () => {
					setShowAdd(false);
					load();
					onChanged?.();
				}
			}),
			editRow && /* @__PURE__ */ jsx(EditDepositModal, {
				row: editRow,
				onClose: () => setEditRow(null),
				onSaved: () => {
					setEditRow(null);
					load();
					onChanged?.();
				}
			}),
			deleteRow && /* @__PURE__ */ jsx(ConfirmModal, {
				isOpen: true,
				variant: "danger",
				title: "Delete deposit entry?",
				description: "Deleting this entry will reduce the reseller's deposit balance and can block order confirmation if a deposit becomes due.",
				detail: `${bdt(Number(deleteRow.amount))} · ${deleteRow.method ?? "—"}`,
				confirmText: "Delete",
				cancelText: "Cancel",
				onClose: () => setDeleteRow(null),
				onConfirm: async () => {
					const row = deleteRow;
					setDeleteRow(null);
					if (!row) return;
					const { error } = await supabase.from("reseller_deposits").delete().eq("id", row.id);
					if (error) {
						toast.error(error.message);
						return;
					}
					toast.success("Entry deleted");
					load();
					onChanged?.();
				}
			})
		]
	});
}
function EditDepositModal({ row, onClose, onSaved }) {
	const [amount, setAmount] = useState(String(row.amount));
	const [method, setMethod] = useState(row.method ?? "bkash");
	const [reference, setReference] = useState(row.reference ?? "");
	const [note, setNote] = useState(row.note ?? "");
	const [busy, setBusy] = useState(false);
	const cls = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
	async function save(e) {
		e.preventDefault();
		const amt = Number(amount);
		if (!amt) return toast.error("Enter an amount (use − for a refund)");
		setBusy(true);
		const { error } = await supabase.from("reseller_deposits").update({
			amount: amt,
			method: method || null,
			reference: reference || null,
			note: note || null
		}).eq("id", row.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Deposit entry updated");
		onSaved();
	}
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[60] grid place-items-center bg-black/50 p-3",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: save,
			onClick: (e) => e.stopPropagation(),
			className: "w-full max-w-md space-y-3 rounded-xl border bg-background p-4 shadow-xl sm:p-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-sm font-semibold",
						children: "Edit deposit entry"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-md p-1 hover:bg-muted",
						"aria-label": "Close",
						children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-medium",
							children: "Amount (৳) — use − for refund"
						}), /* @__PURE__ */ jsx("input", {
							type: "number",
							value: amount,
							onChange: (e) => setAmount(e.target.value),
							className: cls
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-medium",
							children: "Method"
						}), /* @__PURE__ */ jsx("select", {
							value: method,
							onChange: (e) => setMethod(e.target.value),
							className: cls,
							children: METHODS.map((m) => /* @__PURE__ */ jsx("option", {
								value: m,
								className: "capitalize",
								children: m
							}, m))
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-medium",
							children: "Reference / TrxID"
						}), /* @__PURE__ */ jsx("input", {
							value: reference,
							onChange: (e) => setReference(e.target.value),
							className: cls
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-medium",
							children: "Note"
						}), /* @__PURE__ */ jsx("input", {
							value: note,
							onChange: (e) => setNote(e.target.value),
							className: cls
						})] })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-end gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-md border px-4 py-1.5 text-xs hover:bg-muted",
						children: "Cancel"
					}), /* @__PURE__ */ jsxs("button", {
						disabled: busy,
						className: "btn-brand inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-semibold disabled:opacity-50",
						children: [busy && /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }), " Save changes"]
					})]
				})
			]
		})
	});
}
function AddDepositModal({ resellers, preselectedResellerId, onClose, onSaved }) {
	const [resellerId, setResellerId] = useState(preselectedResellerId || (resellers[0]?.id ?? ""));
	const [amount, setAmount] = useState("");
	const [method, setMethod] = useState("bkash");
	const [reference, setReference] = useState("");
	const [note, setNote] = useState("");
	const [busy, setBusy] = useState(false);
	const cls = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
	async function save(e) {
		e.preventDefault();
		if (!resellerId) return toast.error("Please select a reseller");
		const amt = Number(amount);
		if (!amt) return toast.error("Enter a valid amount (positive for deposit, negative for deduction)");
		setBusy(true);
		const { error } = await supabase.from("reseller_deposits").insert({
			reseller_id: resellerId,
			amount: amt,
			method: method || null,
			reference: reference.trim() || null,
			note: note.trim() || null
		});
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Deposit entry added successfully");
		onSaved();
	}
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[60] grid place-items-center bg-black/50 p-3",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: save,
			onClick: (e) => e.stopPropagation(),
			className: "w-full max-w-md space-y-3 rounded-xl border bg-background p-4 shadow-xl sm:p-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-sm font-semibold",
						children: "Add deposit / adjustment entry"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-md p-1 hover:bg-muted",
						"aria-label": "Close",
						children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-medium",
						children: "Reseller *"
					}), /* @__PURE__ */ jsx(SearchableSelect, {
						value: resellerId,
						onChange: setResellerId,
						options: resellers.map((r) => ({
							value: r.id,
							label: r.label
						})),
						placeholder: "Select a reseller",
						className: "w-full"
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Amount (৳) * (use − for refund)"
							}), /* @__PURE__ */ jsx("input", {
								type: "number",
								value: amount,
								onChange: (e) => setAmount(e.target.value),
								placeholder: "5000",
								className: cls,
								required: true
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Method"
							}), /* @__PURE__ */ jsx("select", {
								value: method,
								onChange: (e) => setMethod(e.target.value),
								className: cls,
								children: METHODS.map((m) => /* @__PURE__ */ jsx("option", {
									value: m,
									className: "capitalize",
									children: m
								}, m))
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Reference / TrxID"
							}), /* @__PURE__ */ jsx("input", {
								value: reference,
								onChange: (e) => setReference(e.target.value),
								placeholder: "Optional",
								className: cls
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Note"
							}), /* @__PURE__ */ jsx("input", {
								value: note,
								onChange: (e) => setNote(e.target.value),
								placeholder: "Optional remark",
								className: cls
							})] })
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-end gap-2 pt-2",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-md border px-4 py-1.5 text-xs hover:bg-muted",
						children: "Cancel"
					}), /* @__PURE__ */ jsxs("button", {
						disabled: busy,
						className: "btn-brand inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-semibold disabled:opacity-50",
						children: [busy && /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }), " Add entry"]
					})]
				})
			]
		})
	});
}
//#endregion
export { DepositLedger as t };
