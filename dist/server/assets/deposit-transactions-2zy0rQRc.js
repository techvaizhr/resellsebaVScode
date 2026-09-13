import { D as formatDate, r as supabase } from "./client-CdRSQB5v.js";
import { n as confirmAction } from "./confirm-CI5WE9B0.js";
import { n as PageHeader } from "./ui-kit-D-uo76H8.js";
import { r as useCan } from "./use-auth-L4LMIQqu.js";
import { t as DepositLedger } from "./deposit-ledger-E59nwWPG.js";
import { a as methodLabel } from "./payment-methods-CPLs2pOv.js";
import { n as StatusChip } from "./deposit-pay-panel-BK8vSWSA.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Check, Loader2, X } from "lucide-react";
//#region src/components/deposit-requests-admin.tsx
var bdt = (v) => `৳${Number(v || 0).toLocaleString("en-US")}`;
/** Admin review queue for reseller-submitted security deposits. */
function DepositRequestsAdmin({ onChanged }) {
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(true);
	const canManage = useCan()("deposits.manage");
	const [tab, setTab] = useState("pending");
	const [busyId, setBusyId] = useState(null);
	useEffect(() => {
		load();
	}, [tab]);
	async function load() {
		setLoading(true);
		let q = supabase.from("deposit_requests").select("id,reseller_id,amount,method,reference,note,status,admin_note,created_at,resellers(code,business_name)").order("created_at", { ascending: false }).limit(200);
		if (tab === "pending") q = q.eq("status", "pending");
		const { data, error } = await q;
		if (error) toast.error(error.message);
		setRows(data ?? []);
		setLoading(false);
	}
	async function review(row, approve) {
		if (!await confirmAction({
			title: approve ? "Approve deposit" : "Reject & delete",
			description: approve ? `${bdt(row.amount)} will be added to ${row.resellers?.business_name ?? "this reseller"}'s deposit balance.` : `This ${bdt(row.amount)} submission will be removed everywhere. No balance change.`,
			confirmText: approve ? "Approve" : "Reject & delete"
		})) return;
		setBusyId(row.id);
		const { error } = await supabase.rpc("deposit_request_review", {
			_id: row.id,
			_approve: approve
		});
		setBusyId(null);
		if (error) return toast.error(error.message);
		toast.success(approve ? "Deposit approved" : "Submission deleted");
		load();
		onChanged?.();
	}
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: "mb-3 flex items-center gap-2",
		children: ["pending", "all"].map((k) => /* @__PURE__ */ jsx("button", {
			onClick: () => setTab(k),
			className: "rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors " + (tab === k ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-muted"),
			children: k
		}, k))
	}), loading ? /* @__PURE__ */ jsx("div", {
		className: "grid place-items-center py-8",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin text-muted-foreground" })
	}) : rows.length === 0 ? /* @__PURE__ */ jsx("div", {
		className: "rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground",
		children: tab === "pending" ? "No deposit awaiting approval." : "No deposit submission yet."
	}) : /* @__PURE__ */ jsx("div", {
		className: "overflow-hidden rounded-lg border",
		children: /* @__PURE__ */ jsxs("table", {
			className: "w-full text-xs",
			children: [/* @__PURE__ */ jsx("thead", {
				className: "bg-muted/40 text-left uppercase text-muted-foreground",
				children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", {
						className: "p-2",
						children: "Date"
					}),
					/* @__PURE__ */ jsx("th", { children: "Reseller" }),
					/* @__PURE__ */ jsx("th", { children: "Amount" }),
					/* @__PURE__ */ jsx("th", { children: "Method" }),
					/* @__PURE__ */ jsx("th", { children: "TrxID" }),
					/* @__PURE__ */ jsx("th", { children: "Status" }),
					/* @__PURE__ */ jsx("th", {
						className: "text-right",
						children: "Action"
					})
				] })
			}), /* @__PURE__ */ jsx("tbody", { children: rows.map((r) => /* @__PURE__ */ jsxs("tr", {
				className: "border-t align-top",
				children: [
					/* @__PURE__ */ jsx("td", {
						className: "p-2 whitespace-nowrap",
						children: formatDate(r.created_at)
					}),
					/* @__PURE__ */ jsxs("td", { children: [/* @__PURE__ */ jsx("div", {
						className: "font-medium",
						children: r.resellers?.business_name ?? "—"
					}), /* @__PURE__ */ jsx("div", {
						className: "text-muted-foreground",
						children: r.resellers?.code ?? ""
					})] }),
					/* @__PURE__ */ jsx("td", {
						className: "font-semibold tabular-nums",
						children: bdt(r.amount)
					}),
					/* @__PURE__ */ jsx("td", { children: methodLabel(r.method) }),
					/* @__PURE__ */ jsxs("td", {
						className: "text-muted-foreground",
						children: [r.reference ?? "—", r.note && /* @__PURE__ */ jsx("div", { children: r.note })]
					}),
					/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(StatusChip, { status: r.status }) }),
					/* @__PURE__ */ jsx("td", {
						className: "p-2 text-right",
						children: r.status === "pending" && canManage ? /* @__PURE__ */ jsxs("div", {
							className: "inline-flex gap-1.5",
							children: [/* @__PURE__ */ jsxs("button", {
								disabled: busyId === r.id,
								onClick: () => review(r, true),
								className: "inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-1 font-semibold text-success hover:bg-success/25 disabled:opacity-50",
								children: [/* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }), " Approve"]
							}), /* @__PURE__ */ jsxs("button", {
								disabled: busyId === r.id,
								onClick: () => review(r, false),
								className: "inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 font-semibold text-destructive hover:bg-destructive/20 disabled:opacity-50",
								children: [/* @__PURE__ */ jsx(X, { className: "h-3 w-3" }), " Reject"]
							})]
						}) : /* @__PURE__ */ jsx("span", {
							className: "text-muted-foreground",
							children: "—"
						})
					})
				]
			}, r.id)) })]
		})
	})] });
}
//#endregion
//#region src/routes/_authenticated/admin/deposit-transactions.tsx?tsr-split=component
function DepositTransactionsPage() {
	const [refreshKey, setRefreshKey] = useState(0);
	const handleRefresh = () => {
		setRefreshKey((k) => k + 1);
	};
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Deposit transactions",
			description: "Every reseller deposit, refund and adjustment. Edit or delete an entry — balance and due update instantly."
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "surface-card mb-5 p-6",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "mb-1 text-sm font-semibold",
					children: "Reseller submissions"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mb-3 text-xs text-muted-foreground",
					children: "Deposits resellers paid through a manual payment method. Approving one adds it to their deposit balance."
				}),
				/* @__PURE__ */ jsx(DepositRequestsAdmin, { onChanged: handleRefresh })
			]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "surface-card p-6",
			children: /* @__PURE__ */ jsx(DepositLedger, { onChanged: handleRefresh }, refreshKey)
		})
	] });
}
//#endregion
export { DepositTransactionsPage as component };
