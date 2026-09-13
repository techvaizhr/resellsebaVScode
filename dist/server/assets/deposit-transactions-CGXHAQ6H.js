import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { D as formatDate, r as supabase } from "./client-DdbbmuGT.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Mt as LoaderCircle, Yn as Check, r as X } from "./vendor-icons-BWIzFOtW.js";
import { n as confirmAction } from "./confirm-bFSBJqSt.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { r as useCan } from "./use-auth-BsApJ5EH.js";
import { t as DepositLedger } from "./deposit-ledger-Bxka7WMD.js";
import { a as methodLabel } from "./payment-methods-BwrfSLAJ.js";
import { n as StatusChip } from "./deposit-pay-panel-DNXUfcJH.js";
//#region src/components/deposit-requests-admin.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var bdt = (v) => `৳${Number(v || 0).toLocaleString("en-US")}`;
/** Admin review queue for reseller-submitted security deposits. */
function DepositRequestsAdmin({ onChanged }) {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const canManage = useCan()("deposits.manage");
	const [tab, setTab] = (0, import_react.useState)("pending");
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-3 flex items-center gap-2",
		children: ["pending", "all"].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setTab(k),
			className: "rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors " + (tab === k ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-muted"),
			children: k
		}, k))
	}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
	}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground",
		children: tab === "pending" ? "No deposit awaiting approval." : "No deposit submission yet."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-lg border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-muted/40 text-left uppercase text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2",
						children: "Date"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Reseller" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Amount" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Method" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "TrxID" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-right",
						children: "Action"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t align-top",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-2 whitespace-nowrap",
						children: formatDate(r.created_at)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: r.resellers?.business_name ?? "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-muted-foreground",
						children: r.resellers?.code ?? ""
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "font-semibold tabular-nums",
						children: bdt(r.amount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: methodLabel(r.method) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "text-muted-foreground",
						children: [r.reference ?? "—", r.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: r.note })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: r.status }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-2 text-right",
						children: r.status === "pending" && canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: busyId === r.id,
								onClick: () => review(r, true),
								className: "inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-1 font-semibold text-success hover:bg-success/25 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " Approve"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: busyId === r.id,
								onClick: () => review(r, false),
								className: "inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 font-semibold text-destructive hover:bg-destructive/20 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" }), " Reject"]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
	const [refreshKey, setRefreshKey] = (0, import_react.useState)(0);
	const handleRefresh = () => {
		setRefreshKey((k) => k + 1);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Deposit transactions",
			description: "Every reseller deposit, refund and adjustment. Edit or delete an entry — balance and due update instantly."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card mb-5 p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 text-sm font-semibold",
					children: "Reseller submissions"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-xs text-muted-foreground",
					children: "Deposits resellers paid through a manual payment method. Approving one adds it to their deposit balance."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepositRequestsAdmin, { onChanged: handleRefresh })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepositLedger, { onChanged: handleRefresh }, refreshKey)
		})
	] });
}
//#endregion
export { DepositTransactionsPage as component };
