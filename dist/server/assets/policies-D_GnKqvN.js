import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as fetchActivePolicies } from "./policies-BG-wKL3W.js";
import { I as ShieldCheck, Nt as LoaderCircle, U as Search, qn as CircleCheck } from "./vendor-icons-DF2A5Z8S.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
//#region src/routes/_authenticated/reseller/policies.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PoliciesPage() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		fetchActivePolicies().then(setRows).catch(() => setRows([])).finally(() => setLoading(false));
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		if (!search.trim()) return rows;
		const q = search.toLowerCase();
		return rows.filter((r) => r.title.toLowerCase().includes(q) || r.summary && r.summary.toLowerCase().includes(q) || r.points.some((p) => p.toLowerCase().includes(q)));
	}, [rows, search]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[350px] place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-6xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Platform Rules & Policies",
				description: "ডেলিভারি চার্জ, কমিশন উইথড্র, রিটার্ন ও রিসেলিং সংক্রান্ত অফিসিয়াল নীতিমালা।"
			}), rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full sm:w-64",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					placeholder: "Search rules...",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "w-full rounded-xl border border-border/80 bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
				})]
			})]
		}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "কোনো পলিসি প্রকাশিত হয়নি",
			description: "প্ল্যাটফর্ম অ্যাডমিন পলিসি যোগ করলে তা এখানে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে।"
		}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card p-10 text-center rounded-2xl border border-border/80",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-foreground",
				children: "কোনো ফলাফল পাওয়া যায়নি"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-1",
				children: "ভিন্ন শব্দ দিয়ে সার্চ করুন।"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 md:grid-cols-2",
			children: filtered.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "surface-card rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs hover:border-primary/40 transition-all flex flex-col justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-sm",
						children: p.sort_order || i + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-bold text-foreground leading-snug",
							children: p.title
						}), p.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground font-medium",
							children: p.summary
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2.5 pl-1",
					children: p.points.map((point, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground/90",
							children: point
						})]
					}, idx))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 border-t border-border/40 pt-3 flex items-center justify-between text-[11px] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 font-semibold text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "অফিসিয়াল নীতি" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [p.points.length, "টি নিয়মাবলী"] })]
				})]
			}, p.id))
		})]
	});
}
//#endregion
export { PoliciesPage as component };
