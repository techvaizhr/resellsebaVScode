import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { At as Lock, I as ShieldCheck, h as TriangleAlert } from "./vendor-icons-BWIzFOtW.js";
import { i as useDepositSettings, n as fillText } from "./deposit-settings-BaoY12xF.js";
//#region src/components/deposit-notice.tsx
var import_jsx_runtime = require_jsx_runtime();
/** Reseller-side banner: shows the pending security deposit, or a calm "all clear" line. */
function DepositNotice({ status, compact, place = "payouts" }) {
	const { texts } = useDepositSettings();
	if (!status.required && status.frozenAmount <= 0) return null;
	if (place === "dashboard" && !status.blocked) return null;
	const vars = {
		due: status.due,
		required: status.requiredAmount,
		balance: status.balance,
		frozen: status.frozenAmount
	};
	if (status.blocked) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-col gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-bold text-amber-700 dark:text-amber-300",
					children: fillText(texts.dueTitle, vars)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs text-amber-700/80 dark:text-amber-200/80",
					children: fillText(texts.dueBody, vars)
				})]
			})]
		}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/reseller/payouts",
			className: "shrink-0 rounded-lg border border-amber-600/40 bg-background px-3 py-2 text-center text-xs font-bold text-amber-700 hover:bg-amber-500/10 dark:text-amber-300",
			children: "View deposit info"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border bg-muted/30 px-4 py-3 text-xs",
		children: [status.required && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-1.5 font-medium text-success",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }),
				" ",
				fillText(texts.okText, vars)
			]
		}), status.frozenAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-1.5 text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }),
				" ",
				fillText(texts.frozenText, vars)
			]
		})]
	});
}
//#endregion
export { DepositNotice as t };
