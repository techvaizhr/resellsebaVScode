import { r as supabase } from "./client-Be051lUg.js";
import { n as PageHeader, r as StatCard } from "./ui-kit-D-uo76H8.js";
import { n as bdtNum, p as supplierAvailable } from "./supplier-BI6E4snM.js";
import { n as useSupplier } from "./supplier-context-C2IdSO3T.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { CheckCircle2, Clock, Loader2, TrendingUp, Wallet } from "lucide-react";
//#region src/routes/_authenticated/supplier/payouts.tsx?tsr-split=component
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function statusStyle(s) {
	return s === "paid" ? "bg-success/20 text-success" : s === "approved" ? "bg-primary/15 text-primary" : s === "rejected" ? "bg-destructive/20 text-destructive" : "bg-warning/20 text-warning-foreground";
}
function SupplierPayoutsPage() {
	const { data, reload } = useSupplier();
	const supplier = data.supplier;
	const t = data.totals;
	const available = supplierAvailable(t);
	const [amount, setAmount] = useState("");
	const [note, setNote] = useState("");
	const [busy, setBusy] = useState(false);
	const hasAccount = Boolean(supplier.payout_method && supplier.payout_account_number);
	const rows = data.payouts;
	async function request(e) {
		e.preventDefault();
		if (!hasAccount) return toast.error("Please save your payout details in your profile first.");
		const amt = Number(amount);
		if (!amt || amt <= 0) return toast.error("Please enter a valid amount");
		if (amt > available) return toast.error(`Maximum withdrawable is ${bdtNum(available)}`);
		setBusy(true);
		const reference = supplier.payout_method === "bank" ? `${supplier.payout_bank_name ?? ""} · ${supplier.payout_account_number} · ${supplier.payout_account_name ?? ""}` : `${supplier.payout_account_number} · ${supplier.payout_account_name ?? ""}`;
		const { error } = await supabase.from("supplier_payouts").insert({
			supplier_id: supplier.id,
			amount: amt,
			method: supplier.payout_method,
			reference,
			note: note || null
		});
		setBusy(false);
		if (error) return toast.error(error.message);
		setAmount("");
		setNote("");
		toast.success("Payout request submitted");
		await reload();
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Payouts",
			description: "Withdraw money earned from delivered items here."
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "Total earning",
					value: bdtNum(t.earning),
					icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Available",
					value: bdtNum(available),
					hint: "Ready to request",
					icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" }),
					tone: "violet"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "In request",
					value: bdtNum(t.pending_payout),
					icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
					tone: "amber"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Paid out",
					value: bdtNum(t.paid),
					icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
					tone: "emerald"
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "surface-card mb-4 grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(Info$1, {
					label: "Method",
					value: /* @__PURE__ */ jsx("span", {
						className: "capitalize",
						children: supplier.payout_method ?? "—"
					})
				}),
				/* @__PURE__ */ jsx(Info$1, {
					label: "Account name",
					value: supplier.payout_account_name ?? "—"
				}),
				/* @__PURE__ */ jsx(Info$1, {
					label: "Account number",
					value: supplier.payout_account_number ?? "—"
				}),
				/* @__PURE__ */ jsx(Info$1, {
					label: "Bank / branch",
					value: [supplier.payout_bank_name, supplier.payout_branch].filter(Boolean).join(" · ") || "—"
				})
			]
		}),
		/* @__PURE__ */ jsxs("p", {
			className: "mb-4 rounded-lg border bg-muted/30 px-4 py-2 text-[11px] leading-relaxed text-muted-foreground",
			children: [
				"Calculation: Total earning (",
				bdtNum(t.earning),
				") − Paid (",
				bdtNum(t.paid),
				") − Pending request (",
				bdtNum(t.pending_payout),
				") =",
				" ",
				/* @__PURE__ */ jsx("span", {
					className: "font-bold text-foreground",
					children: bdtNum(available)
				}),
				" is withdrawable."
			]
		}),
		!hasAccount && /* @__PURE__ */ jsxs("div", {
			className: "mb-4 rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-xs",
			children: [
				"Please save your bank/mobile account details on the ",
				/* @__PURE__ */ jsx("b", { children: "My profile" }),
				" page before requesting a payout."
			]
		}),
		/* @__PURE__ */ jsxs("form", {
			onSubmit: request,
			className: "surface-card mb-6 grid gap-3 p-4 sm:p-5 md:grid-cols-[1fr_1fr_auto]",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-medium",
						children: "Amount (৳)"
					}),
					/* @__PURE__ */ jsx("input", {
						value: amount,
						onChange: (e) => setAmount(e.target.value),
						type: "number",
						min: 1,
						max: available > 0 ? available : void 0,
						className: inp,
						required: true
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							"Maximum withdrawable",
							" ",
							/* @__PURE__ */ jsx("span", {
								className: "font-semibold text-foreground",
								children: bdtNum(available)
							}),
							t.pending_payout > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [" · in request ", bdtNum(t.pending_payout)] })
						]
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					className: "mb-1 block text-xs font-medium",
					children: "Note (optional)"
				}), /* @__PURE__ */ jsx("input", {
					value: note,
					onChange: (e) => setNote(e.target.value),
					className: inp
				})] }),
				/* @__PURE__ */ jsx("div", {
					className: "flex items-end",
					children: /* @__PURE__ */ jsxs("button", {
						disabled: busy || available <= 0,
						className: "btn-brand inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-2 text-sm font-medium disabled:opacity-50",
						children: [busy && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Request payout"]
					})
				})
			]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "space-y-2 md:hidden",
			children: rows.length === 0 ? /* @__PURE__ */ jsx("div", {
				className: "surface-card p-8 text-center text-sm text-muted-foreground",
				children: "No payouts yet."
			}) : rows.map((p) => /* @__PURE__ */ jsxs("div", {
				className: "surface-card p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "font-semibold tabular-nums",
						children: bdtNum(Number(p.amount))
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-[11px] capitalize text-muted-foreground",
						children: [
							p.method ?? "—",
							" · ",
							new Date(p.created_at).toLocaleDateString()
						]
					})] }), /* @__PURE__ */ jsx("span", {
						className: "rounded-full px-2 py-0.5 text-[10px] capitalize " + statusStyle(p.status),
						children: p.status
					})]
				}), p.admin_note && /* @__PURE__ */ jsxs("p", {
					className: "mt-2 rounded-md border border-dashed p-2 text-[11px] text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "font-medium text-foreground",
							children: "Admin note:"
						}),
						" ",
						p.admin_note
					]
				})]
			}, p.id))
		}),
		/* @__PURE__ */ jsx("div", {
			className: "surface-card hidden overflow-x-auto md:block",
			children: /* @__PURE__ */ jsxs("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ jsx("thead", {
					className: "bg-muted/40 text-left text-xs uppercase text-muted-foreground",
					children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Date"
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
							children: "Status"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Paid at"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "p-3",
							children: "Admin note"
						})
					] })
				}), /* @__PURE__ */ jsxs("tbody", { children: [rows.map((p) => /* @__PURE__ */ jsxs("tr", {
					className: "border-t",
					children: [
						/* @__PURE__ */ jsx("td", {
							className: "p-3",
							children: new Date(p.created_at).toLocaleDateString()
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-3 font-medium tabular-nums",
							children: bdtNum(Number(p.amount))
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-3 capitalize",
							children: p.method ?? "—"
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-3",
							children: /* @__PURE__ */ jsx("span", {
								className: "rounded-full px-2 py-0.5 text-[10px] capitalize " + statusStyle(p.status),
								children: p.status
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-3 text-xs text-muted-foreground",
							children: p.paid_at ? new Date(p.paid_at).toLocaleDateString() : "—"
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-3 text-xs text-muted-foreground",
							children: p.admin_note || p.reference || "—"
						})
					]
				}, p.id)), rows.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
					colSpan: 6,
					className: "p-8 text-center text-muted-foreground",
					children: "No payouts yet."
				}) })] })]
			})
		})
	] });
}
function Info$1({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-md border bg-muted/30 px-3 py-2",
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-[10px] uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("div", {
			className: "text-sm",
			children: value
		})]
	});
}
//#endregion
export { SupplierPayoutsPage as component };
