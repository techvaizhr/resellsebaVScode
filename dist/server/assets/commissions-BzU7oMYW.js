import { r as supabase } from "./client-Be051lUg.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-D-uo76H8.js";
import { r as useCan } from "./use-auth-DJu3SP6g.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
//#region src/routes/_authenticated/admin/commissions.tsx?tsr-split=component
function CommissionsPage() {
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(true);
	const canManage = useCan()("commissions.manage");
	async function load() {
		setLoading(true);
		const { data } = await supabase.from("leader_commissions").select("id,amount,base_profit,rate,status,created_at,paid_at,leader:resellers!leader_commissions_leader_id_fkey(business_name,code),reseller:resellers!leader_commissions_reseller_id_fkey(business_name,code),order:orders(order_number)").order("created_at", { ascending: false });
		setRows(data ?? []);
		setLoading(false);
	}
	useEffect(() => {
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
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Leader commissions",
		description: "Auto-calculated from downline resellers' delivered orders."
	}), loading ? /* @__PURE__ */ jsx("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	}) : rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
		title: "No commissions yet",
		description: "Appears once a leader-assigned reseller's order is delivered."
	}) : /* @__PURE__ */ jsxs("div", {
		className: "surface-card overflow-hidden",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "hidden grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground md:grid",
			children: [
				/* @__PURE__ */ jsx("div", { children: "Order" }),
				/* @__PURE__ */ jsx("div", { children: "Leader" }),
				/* @__PURE__ */ jsx("div", { children: "Reseller" }),
				/* @__PURE__ */ jsx("div", { children: "Profit" }),
				/* @__PURE__ */ jsx("div", { children: "Rate" }),
				/* @__PURE__ */ jsx("div", { children: "Commission" }),
				/* @__PURE__ */ jsx("div", {})
			]
		}), rows.map((r) => /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 items-center gap-2 border-b px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto]",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "font-mono text-xs",
					children: r.order?.order_number
				}),
				/* @__PURE__ */ jsx("div", { children: r.leader?.business_name }),
				/* @__PURE__ */ jsx("div", { children: r.reseller?.business_name }),
				/* @__PURE__ */ jsxs("div", { children: ["৳", Number(r.base_profit).toFixed(0)] }),
				/* @__PURE__ */ jsxs("div", { children: [r.rate, "%"] }),
				/* @__PURE__ */ jsxs("div", {
					className: "font-semibold",
					children: ["৳", Number(r.amount).toFixed(0)]
				}),
				/* @__PURE__ */ jsx("div", { children: r.status === "paid" ? /* @__PURE__ */ jsx("span", {
					className: "rounded-full bg-success/20 px-2 py-0.5 text-xs text-success",
					children: "Paid"
				}) : canManage ? /* @__PURE__ */ jsx("button", {
					onClick: () => markPaid(r.id),
					className: "rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground",
					children: "Mark paid"
				}) : /* @__PURE__ */ jsx("span", {
					className: "text-xs text-muted-foreground",
					children: "—"
				}) })
			]
		}, r.id))]
	})] });
}
//#endregion
export { CommissionsPage as component };
