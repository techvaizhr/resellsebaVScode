import { r as supabase } from "./client-Be051lUg.js";
import { t as ConfirmModal } from "./ConfirmModal-CPm0pZdA.js";
import { n as PageHeader } from "./ui-kit-D-uo76H8.js";
import { t as SearchableSelect } from "./searchable-select-CJDs5oIk.js";
import { n as formatDateTime } from "./date-zfkEdx3e.js";
import { n as StoreVisitsReport, r as useLeaderboard, t as RangeTabs } from "./store-visits-report-C3rwxokL.js";
import { useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Loader2, Search, Trash2 } from "lucide-react";
//#region src/routes/_authenticated/admin/visitors.tsx?tsr-split=component
function AdminVisitorsPage() {
	const [range, setRange] = useState("today");
	const [resellers, setResellers] = useState([]);
	const [selected, setSelected] = useState(null);
	const [q, setQ] = useState("");
	const [purging, setPurging] = useState(false);
	const [confirm, setConfirm] = useState(false);
	const { rows, reload } = useLeaderboard(range);
	useEffect(() => {
		(async () => {
			const { data } = await supabase.from("resellers").select("id, code, business_name").order("business_name", { ascending: true });
			setResellers(data ?? []);
		})();
	}, []);
	const board = useMemo(() => {
		const term = q.trim().toLowerCase();
		if (!term) return rows;
		return rows.filter((r) => r.business_name?.toLowerCase().includes(term) || r.code?.toLowerCase().includes(term));
	}, [rows, q]);
	async function purge() {
		setPurging(true);
		const { data, error } = await supabase.rpc("purge_store_visits");
		setPurging(false);
		setConfirm(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success(`${Number(data ?? 0)} old visit records deleted`);
		reload();
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Store visitors",
			description: "Live storefront traffic across all resellers. Only the last 30 days is kept."
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ jsx(RangeTabs, {
					value: range,
					onChange: setRange
				}), /* @__PURE__ */ jsx(SearchableSelect, {
					options: resellers.map((r) => ({
						value: r.id,
						label: `${r.business_name} (${r.code})`
					})),
					value: selected ?? "",
					onChange: (v) => setSelected(v || null),
					placeholder: "All resellers",
					searchPlaceholder: "Search reseller…",
					className: "w-full sm:w-[240px]"
				})]
			}), /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => setConfirm(true),
				className: "inline-flex shrink-0 items-center gap-2 rounded-xl border border-rose-500/40 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-500/10",
				children: [purging ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }), " Delete data older than 30 days"]
			})]
		}),
		/* @__PURE__ */ jsx(StoreVisitsReport, {
			resellerId: selected,
			range
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "surface-card mt-8 overflow-hidden",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-sm font-bold",
					children: "Top stores by traffic"
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search reseller / code",
						className: "h-9 w-56 rounded-lg border bg-background pl-9 pr-3 text-sm"
					})]
				})]
			}), board.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "px-5 py-8 text-sm text-muted-foreground",
				children: "No visits recorded in this period."
			}) : /* @__PURE__ */ jsxs("div", {
				className: "divide-y",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "hidden grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-3 bg-muted/40 px-5 py-2 text-xs font-medium text-muted-foreground md:grid",
					children: [
						/* @__PURE__ */ jsx("div", { children: "Reseller" }),
						/* @__PURE__ */ jsx("div", {
							className: "text-center",
							children: "Live"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-center",
							children: "Pageviews"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-center",
							children: "Visitors"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-center",
							children: "Last visit"
						})
					]
				}), board.map((r) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setSelected(r.reseller_id),
					className: "grid w-full grid-cols-2 items-center gap-3 px-5 py-3 text-left text-sm hover:bg-muted/40 md:grid-cols-[2fr_1fr_1fr_1fr_1.2fr]",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "truncate",
							children: [/* @__PURE__ */ jsx("div", {
								className: "font-semibold",
								children: r.business_name
							}), /* @__PURE__ */ jsx("div", {
								className: "font-mono text-[11px] text-muted-foreground",
								children: r.code
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-center font-bold text-emerald-600",
							children: Number(r.live)
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-center font-semibold",
							children: Number(r.visits)
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-center",
							children: Number(r.visitors)
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-center text-xs text-muted-foreground",
							children: formatDateTime(r.last_at)
						})
					]
				}, r.reseller_id))]
			})]
		}),
		/* @__PURE__ */ jsx(ConfirmModal, {
			isOpen: confirm,
			onClose: () => setConfirm(false),
			onConfirm: purge,
			title: "Delete visit data older than 30 days?",
			description: "All storefront visit records older than 30 days will be permanently deleted. This cannot be undone.",
			confirmText: "Delete permanently",
			variant: "danger",
			isLoading: purging
		})
	] });
}
//#endregion
export { AdminVisitorsPage as component };
