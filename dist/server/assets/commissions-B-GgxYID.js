import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-BAn7XKYw.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Nt as LoaderCircle } from "./vendor-icons-DF2A5Z8S.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { r as useCan } from "./use-auth-zbqaYCVZ.js";
//#region src/routes/_authenticated/admin/commissions.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CommissionsPage() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const canManage = useCan()("commissions.manage");
	async function load() {
		setLoading(true);
		const { data } = await supabase.from("leader_commissions").select("id,amount,base_profit,rate,status,created_at,paid_at,leader:resellers!leader_commissions_leader_id_fkey(business_name,code),reseller:resellers!leader_commissions_reseller_id_fkey(business_name,code),order:orders(order_number)").order("created_at", { ascending: false });
		setRows(data ?? []);
		setLoading(false);
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function markPaid(id) {
		const { error } = await supabase.from("leader_commissions").update({
			status: "paid",
			paid_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Marked paid");
		load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Leader commissions",
		description: "Auto-calculated from downline resellers' delivered orders."
	}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No commissions yet",
		description: "Appears once a leader-assigned reseller's order is delivered."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground md:grid",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Order" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Leader" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Reseller" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Profit" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Rate" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Commission" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})
			]
		}), rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 items-center gap-2 border-b px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-xs",
					children: r.order?.order_number
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: r.leader?.business_name }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: r.reseller?.business_name }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["৳", Number(r.base_profit).toFixed(0)] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [r.rate, "%"] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-semibold",
					children: ["৳", Number(r.amount).toFixed(0)]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: r.status === "paid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-success/20 px-2 py-0.5 text-xs text-success",
					children: "Paid"
				}) : canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => markPaid(r.id),
					className: "rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground",
					children: "Mark paid"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "—"
				}) })
			]
		}, r.id))]
	})] });
}
//#endregion
export { CommissionsPage as component };
