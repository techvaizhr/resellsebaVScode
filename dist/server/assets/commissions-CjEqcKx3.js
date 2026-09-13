import { r as supabase } from "./client-CdRSQB5v.js";
import { n as PageHeader, r as StatCard, t as EmptyState } from "./ui-kit-D-uo76H8.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Loader2, Users, Wallet } from "lucide-react";
//#region src/routes/_authenticated/reseller/commissions.tsx?tsr-split=component
function LeaderCommissionsPage() {
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			const { data } = await supabase.from("leader_commissions").select("id,amount,base_profit,rate,status,created_at,reseller:resellers!leader_commissions_reseller_id_fkey(business_name,code),order:orders(order_number)").order("created_at", { ascending: false });
			setRows(data ?? []);
			setLoading(false);
		})();
	}, []);
	const pending = rows.filter((r) => r.status === "pending").reduce((s, r) => s + Number(r.amount), 0);
	const paid = rows.filter((r) => r.status === "paid").reduce((s, r) => s + Number(r.amount), 0);
	const downlines = new Set(rows.map((r) => r.reseller?.code).filter(Boolean)).size;
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "My leader commissions",
			description: "Commission earned from your downline resellers."
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mb-6 grid gap-4 md:grid-cols-3",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "Pending",
					value: `৳${pending.toLocaleString()}`,
					icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Paid to date",
					value: `৳${paid.toLocaleString()}`,
					icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Active downlines",
					value: downlines,
					icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" })
				})
			]
		}),
		loading ? /* @__PURE__ */ jsx("div", {
			className: "grid place-items-center py-12",
			children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
			title: "No commissions yet",
			description: "Appears here once your downline resellers' orders are delivered."
		}) : /* @__PURE__ */ jsxs("div", {
			className: "surface-card overflow-hidden",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "hidden grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-4 border-b bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground md:grid",
				children: [
					/* @__PURE__ */ jsx("div", { children: "Order" }),
					/* @__PURE__ */ jsx("div", { children: "Reseller" }),
					/* @__PURE__ */ jsx("div", { children: "Base profit" }),
					/* @__PURE__ */ jsx("div", { children: "Rate" }),
					/* @__PURE__ */ jsx("div", { children: "Commission" })
				]
			}), rows.map((r) => /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 items-center gap-2 border-b px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1fr_1fr_1fr_1fr_1fr]",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "font-mono text-xs",
						children: r.order?.order_number
					}),
					/* @__PURE__ */ jsx("div", { children: r.reseller?.business_name }),
					/* @__PURE__ */ jsxs("div", { children: ["৳", Number(r.base_profit).toFixed(0)] }),
					/* @__PURE__ */ jsxs("div", { children: [r.rate, "%"] }),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 font-semibold",
						children: [
							"৳",
							Number(r.amount).toFixed(0),
							/* @__PURE__ */ jsx("span", {
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
