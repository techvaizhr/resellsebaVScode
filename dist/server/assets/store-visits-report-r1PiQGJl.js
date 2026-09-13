import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-DdbbmuGT.js";
import { J as RefreshCw, Mt as LoaderCircle, c as Users, gt as MousePointerClick, hn as Eye, yr as Activity } from "./vendor-icons-BWIzFOtW.js";
import { r as StatCard } from "./ui-kit-QFWJ0cl0.js";
import { a as visitRangeBounds, n as VISIT_RANGES, r as useLiveRefresh, t as LIVE_REFRESH_MS } from "./store-visits-C9kxJfEL.js";
//#region src/components/store-visits-report.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var rpc = (name, args) => supabase.rpc(name, args);
function RangeTabs({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1.5 rounded-xl border bg-card p-1.5",
		children: VISIT_RANGES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onChange(r.id),
			className: `rounded-lg px-3 py-1.5 text-xs font-semibold transition ${value === r.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`,
			children: r.label
		}, r.id))
	});
}
/**
* Visitor report for one reseller (or all resellers when `resellerId` is null and
* the viewer is an admin). Data is fetched on mount + on range change, then softly
* polled every 15s while the tab is visible — no realtime sockets, no extra load.
*/
function StoreVisitsReport({ resellerId, range, extraHeader }) {
	const [summary, setSummary] = (0, import_react.useState)(null);
	const [daily, setDaily] = (0, import_react.useState)([]);
	const [pages, setPages] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [updatedAt, setUpdatedAt] = (0, import_react.useState)(null);
	const inFlight = (0, import_react.useRef)(false);
	const bounds = (0, import_react.useMemo)(() => visitRangeBounds(range), [range]);
	const load = (0, import_react.useCallback)(async (soft = false) => {
		if (inFlight.current) return;
		inFlight.current = true;
		if (!soft) setLoading(true);
		else setBusy(true);
		const args = {
			_reseller_id: resellerId,
			_from: bounds.from,
			_to: bounds.to
		};
		const [s, d, p] = await Promise.all([
			rpc("store_visit_summary", args),
			rpc("store_visit_daily", args),
			rpc("store_visit_pages", {
				...args,
				_limit: 12
			})
		]);
		const srow = s.data?.[0] ?? null;
		setSummary(srow);
		setDaily((d.data ?? []).slice(-30));
		setPages(p.data ?? []);
		setUpdatedAt(/* @__PURE__ */ new Date());
		setLoading(false);
		setBusy(false);
		inFlight.current = false;
	}, [
		bounds.from,
		bounds.to,
		resellerId
	]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	useLiveRefresh((0, import_react.useCallback)(() => {
		load(true);
	}, [load]), true, LIVE_REFRESH_MS);
	const max = Math.max(1, ...daily.map((d) => Number(d.visits)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [extraHeader, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-3 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative flex h-2 w-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-emerald-500" })]
								}),
								"Live · auto refresh ",
								LIVE_REFRESH_MS / 1e3,
								"s"
							]
						}),
						updatedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Updated ", updatedAt.toLocaleTimeString()] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => void load(true),
							className: "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-semibold hover:border-primary hover:text-primary",
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Refresh"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Live visitors (5 min)",
						value: Number(summary?.live ?? 0),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pageviews",
						value: Number(summary?.visits ?? 0),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Unique visitors",
						value: Number(summary?.visitors ?? 0),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Views today",
						value: Number(summary?.today_visits ?? 0),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointerClick, { className: "h-4 w-4" })
					})
				]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid place-items-center py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-bold",
						children: "Daily traffic"
					}), daily.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm text-muted-foreground",
						children: "No visits in this period yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 flex h-40 items-end gap-1.5",
						children: daily.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group flex flex-1 flex-col items-center justify-end gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold text-muted-foreground opacity-0 group-hover:opacity-100",
									children: d.visits
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full rounded-t bg-primary/80",
									style: { height: `${Math.max(4, Number(d.visits) / max * 100)}%` },
									title: `${d.day} · ${d.visits} views · ${d.visitors} visitors`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] text-muted-foreground",
									children: d.day.slice(5)
								})
							]
						}, d.day))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b px-5 py-3 text-sm font-bold",
						children: "Top pages"
					}), pages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-5 py-6 text-sm text-muted-foreground",
						children: "No page data yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y",
						children: pages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 px-5 py-2.5 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate font-mono text-xs",
								children: p.path
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "text-foreground",
										children: p.visits
									}),
									" views · ",
									p.visitors,
									" visitors"
								]
							})]
						}, p.path))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Only the last 30 days of visit data is kept — older records are removed automatically."
			})
		]
	});
}
function useLeaderboard(range) {
	const [rows, setRows] = (0, import_react.useState)([]);
	const bounds = (0, import_react.useMemo)(() => visitRangeBounds(range), [range]);
	const load = (0, import_react.useCallback)(async () => {
		const { data } = await rpc("store_visit_leaderboard", {
			_from: bounds.from,
			_to: bounds.to,
			_limit: 100
		});
		setRows(data ?? []);
	}, [bounds.from, bounds.to]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	useLiveRefresh((0, import_react.useCallback)(() => {
		load();
	}, [load]), true, LIVE_REFRESH_MS);
	return {
		rows,
		reload: load
	};
}
//#endregion
export { StoreVisitsReport as n, useLeaderboard as r, RangeTabs as t };
