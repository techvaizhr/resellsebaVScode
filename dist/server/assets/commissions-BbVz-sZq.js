import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-B8ZbbxaQ.js";
import { Nt as LoaderCircle, a as Wallet, c as Users } from "./vendor-icons-DF2A5Z8S.js";
import { n as PageHeader, r as StatCard, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
//#region src/routes/_authenticated/reseller/commissions.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LeaderCommissionsPage() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.from("leader_commissions").select("id,amount,base_profit,rate,status,created_at,reseller:resellers!leader_commissions_reseller_id_fkey(business_name,code),order:orders(order_number)").order("created_at", { ascending: false });
			setRows(data ?? []);
			setLoading(false);
		})();
	}, []);
	const pending = rows.filter((r) => r.status === "pending").reduce((s, r) => s + Number(r.amount), 0);
	const paid = rows.filter((r) => r.status === "paid").reduce((s, r) => s + Number(r.amount), 0);
	const downlines = new Set(rows.map((r) => r.reseller?.code).filter(Boolean)).size;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "My leader commissions",
			description: "Commission earned from your downline resellers."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Pending",
					value: `৳${pending.toLocaleString()}`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Paid to date",
					value: `৳${paid.toLocaleString()}`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Active downlines",
					value: downlines,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
				})
			]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid place-items-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No commissions yet",
			description: "Appears here once your downline resellers' orders are delivered."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-4 border-b bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground md:grid",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Order" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Reseller" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Base profit" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Rate" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Commission" })
				]
			}), rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 items-center gap-2 border-b px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1fr_1fr_1fr_1fr_1fr]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-xs",
						children: r.order?.order_number
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: r.reseller?.business_name }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["৳", Number(r.base_profit).toFixed(0)] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [r.rate, "%"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-semibold",
						children: [
							"৳",
							Number(r.amount).toFixed(0),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2 py-0.5 text-[10px] ${r.status === "paid" ? "bg-success/20 text-success" : "bg-muted"}`,
								children: r.status
							})
						]
					})
				]
			}, r.id))]
		})
	] });
}
//#endregion
export { LeaderCommissionsPage as component };
