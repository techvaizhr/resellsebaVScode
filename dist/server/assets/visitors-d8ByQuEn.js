import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { n as formatDateTime } from "./date-zfkEdx3e.js";
import { r as supabase } from "./client-CI2ZnE4F.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Nt as LoaderCircle, U as Search, v as Trash2 } from "./vendor-icons-DF2A5Z8S.js";
import { t as ConfirmModal } from "./ConfirmModal-DSu87j9m.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { t as SearchableSelect } from "./searchable-select-BnAjxEDw.js";
import { n as StoreVisitsReport, r as useLeaderboard, t as RangeTabs } from "./store-visits-report-D2pMwR2F.js";
//#region src/routes/_authenticated/admin/visitors.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminVisitorsPage() {
	const [range, setRange] = (0, import_react.useState)("today");
	const [resellers, setResellers] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)("");
	const [purging, setPurging] = (0, import_react.useState)(false);
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const { rows, reload } = useLeaderboard(range);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.from("resellers").select("id, code, business_name").order("business_name", { ascending: true });
			setResellers(data ?? []);
		})();
	}, []);
	const board = (0, import_react.useMemo)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Store visitors",
			description: "Live storefront traffic across all resellers. Only the last 30 days is kept."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeTabs, {
					value: range,
					onChange: setRange
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchableSelect, {
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
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setConfirm(true),
				className: "inline-flex shrink-0 items-center gap-2 rounded-xl border border-rose-500/40 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-500/10",
				children: [purging ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), " Delete data older than 30 days"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreVisitsReport, {
			resellerId: selected,
			range
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card mt-8 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold",
					children: "Top stores by traffic"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search reseller / code",
						className: "h-9 w-56 rounded-lg border bg-background pl-9 pr-3 text-sm"
					})]
				})]
			}), board.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-5 py-8 text-sm text-muted-foreground",
				children: "No visits recorded in this period."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "divide-y",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-3 bg-muted/40 px-5 py-2 text-xs font-medium text-muted-foreground md:grid",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Reseller" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center",
							children: "Live"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center",
							children: "Pageviews"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center",
							children: "Visitors"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center",
							children: "Last visit"
						})
					]
				}), board.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSelected(r.reseller_id),
					className: "grid w-full grid-cols-2 items-center gap-3 px-5 py-3 text-left text-sm hover:bg-muted/40 md:grid-cols-[2fr_1fr_1fr_1fr_1.2fr]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "truncate",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: r.business_name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[11px] text-muted-foreground",
								children: r.code
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center font-bold text-emerald-600",
							children: Number(r.live)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center font-semibold",
							children: Number(r.visits)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center",
							children: Number(r.visitors)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center text-xs text-muted-foreground",
							children: formatDateTime(r.last_at)
						})
					]
				}, r.reseller_id))]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
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
