import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as cn } from "./utils-UzdMQEyF.js";
//#region src/components/ui-kit.tsx
var import_jsx_runtime = require_jsx_runtime();
function PageHeader({ title, description, actions, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl",
				children: title
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm font-medium text-muted-foreground/70 sm:text-base md:text-lg",
				children: description
			})]
		}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center gap-2 sm:gap-3",
			children: actions
		})]
	});
}
var TONES = {
	primary: {
		text: "text-primary",
		ring: "hover:border-primary/50",
		glow: "from-primary/15"
	},
	emerald: {
		text: "text-emerald-500",
		ring: "hover:border-emerald-500/50",
		glow: "from-emerald-500/15"
	},
	amber: {
		text: "text-amber-500",
		ring: "hover:border-amber-500/50",
		glow: "from-amber-500/15"
	},
	violet: {
		text: "text-violet-500",
		ring: "hover:border-violet-500/50",
		glow: "from-violet-500/15"
	},
	sky: {
		text: "text-sky-500",
		ring: "hover:border-sky-500/50",
		glow: "from-sky-500/15"
	},
	rose: {
		text: "text-rose-500",
		ring: "hover:border-rose-500/50",
		glow: "from-rose-500/15"
	}
};
function StatCard({ label, value, hint, icon, trend, tone = "primary", to, search }) {
	const t = TONES[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(to ? Link : "div", {
		...to ? {
			to,
			search
		} : {},
		title: hint,
		className: cn("group relative block rounded-xl border bg-card px-3 py-2.5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg", t.ring),
		children: [
			icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("pointer-events-none absolute -right-1 top-1/2 -translate-y-1/2 opacity-[0.06] [&_svg]:h-12 [&_svg]:w-12", t.text),
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-r to-transparent opacity-0 transition-opacity group-hover:opacity-100", t.glow) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-center justify-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-black uppercase leading-tight tracking-[0.14em] text-muted-foreground/70",
					children: label
				}), trend && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("shrink-0 text-[10px] font-bold", trend.positive ? "text-emerald-500" : "text-rose-500"),
					children: [
						trend.positive ? "↑" : "↓",
						" ",
						trend.value
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("relative mt-0.5 text-lg font-black leading-tight tracking-tight break-words sm:text-2xl", t.text),
				children: value
			})
		]
	});
}
function EmptyState({ title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card grid place-items-center gap-3 p-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-lg font-semibold",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-sm text-muted-foreground",
				children: description
			}),
			action
		]
	});
}
//#endregion
export { PageHeader as n, StatCard as r, EmptyState as t };
