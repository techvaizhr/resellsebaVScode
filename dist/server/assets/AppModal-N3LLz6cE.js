import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime, o as require_react_dom } from "./vendor-editor-CeWP4_Ao.js";
import { r as X } from "./vendor-icons-BEaCFqaT.js";
//#region src/components/ui-kit/AppModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
var import_jsx_runtime = require_jsx_runtime();
var SIZE = {
	sm: "max-w-md",
	md: "max-w-xl",
	lg: "max-w-3xl",
	xl: "max-w-5xl"
};
/**
* Global app modal: portal-rendered, sticky header/footer, scrollable body,
* Escape + backdrop close, body scroll lock. Use everywhere for consistency.
*/
function AppModal({ open = true, title, subtitle, badge, size = "md", onClose, footer, children, bodyClassName = "", padded = true }) {
	const [mounted, setMounted] = import_react.useState(false);
	import_react.useEffect(() => setMounted(true), []);
	import_react.useEffect(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
		};
	}, [open, onClose]);
	if (!open || !mounted) return null;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-modal": "true",
		className: "fixed inset-0 z-[120] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border bg-card shadow-2xl sm:rounded-2xl ${SIZE[size]}`,
			onClick: (e) => e.stopPropagation(),
			children: [
				title || badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-start justify-between gap-3 border-b bg-card px-4 py-3 sm:px-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-1",
								children: badge
							}) : null,
							title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "truncate text-base font-bold",
								children: title
							}) : null,
							subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: subtitle
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"aria-label": "Close",
						className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg border text-muted-foreground transition hover:bg-muted hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `min-h-0 flex-1 overflow-y-auto ${padded ? "p-4 sm:p-5" : ""} ${bodyClassName}`,
					children
				}),
				footer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "shrink-0 border-t bg-muted/25 px-4 py-3 sm:px-5",
					children: footer
				}) : null
			]
		})
	}), document.body);
}
//#endregion
export { AppModal as t };
