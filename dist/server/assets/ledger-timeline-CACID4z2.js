import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { O as formatDateTime } from "./client-CLBrUPi_.js";
//#region src/components/ledger-timeline.tsx
var import_jsx_runtime = require_jsx_runtime();
function LedgerTotals({ ledger, frozen, available, className = "" }) {
	const inflow = ledger.filter((e) => e.direction === "in").reduce((s, e) => s + Number(e.amount), 0);
	const outflow = ledger.filter((e) => e.direction === "out").reduce((s, e) => s + Number(e.amount), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-2 gap-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-5 " + className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TotalCell, {
				label: "Total in",
				value: inflow,
				tone: "good"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TotalCell, {
				label: "Total out",
				value: outflow,
				tone: "bad"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TotalCell, {
				label: "Balance",
				value: inflow - outflow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TotalCell, {
				label: "Frozen",
				value: frozen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TotalCell, {
				label: "Withdrawable",
				value: available,
				tone: "good"
			})
		]
	});
}
function TotalCell({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-[10px] uppercase tracking-wide text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-sm font-bold tabular-nums " + (tone === "good" ? "text-success" : tone === "bad" ? "text-destructive" : ""),
		children: ["৳", Number(value || 0).toLocaleString()]
	})] });
}
function LedgerTimeline({ ledger, frozen, available, emptyText = "No transactions yet." }) {
	if (ledger.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground",
		children: emptyText
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LedgerTotals, {
			ledger,
			frozen,
			available
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "relative mt-4 space-y-3 border-l pl-5",
			children: ledger.map((e, i) => {
				const inflow = e.direction === "in";
				const voided = e.direction === "void";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-[26px] top-1.5 h-3 w-3 rounded-full ring-4 ring-background " + (voided ? "bg-muted-foreground/40" : inflow ? "bg-success" : "bg-destructive") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-2 rounded-lg border bg-muted/20 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium",
									children: e.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground",
									children: [
										formatDateTime(e.at),
										" · ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "capitalize",
											children: e.status
										})
									]
								}),
								e.reference && e.reference !== "—" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 break-words text-[11px] text-muted-foreground",
									children: e.reference
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm font-bold tabular-nums " + (voided ? "text-muted-foreground line-through" : inflow ? "text-success" : "text-destructive"),
								children: [
									inflow ? "+" : "−",
									"৳",
									Number(e.amount).toLocaleString()
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground tabular-nums",
								children: ["Balance ৳", Number(e.running).toLocaleString()]
							})]
						})]
					})]
				}, i);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LedgerTotals, {
			ledger,
			frozen,
			available,
			className: "mt-4"
		})
	] });
}
//#endregion
export { LedgerTimeline as t };
