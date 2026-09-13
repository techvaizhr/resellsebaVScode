import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { Gt as Info, Mt as LoaderCircle, h as TriangleAlert, r as X, v as Trash2 } from "./vendor-icons-BWIzFOtW.js";
import { $ as DialogTitle$1, J as DialogClose, Q as DialogPortal$1, X as DialogDescription$1, Y as DialogContent$1, Z as DialogOverlay$1, q as Dialog$1 } from "./vendor-ui-C-fytv-F.js";
import { t as cn } from "./utils-UzdMQEyF.js";
//#region src/components/ui/dialog.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("group fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground group-[.hide-close-button]:hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
//#endregion
//#region src/components/ui-kit/ConfirmModal.tsx
var STYLES = {
	danger: {
		ring: "bg-destructive/10 text-destructive ring-destructive/20",
		glow: "from-destructive/15",
		button: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/40",
		Icon: Trash2
	},
	warning: {
		ring: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
		glow: "from-amber-500/15",
		button: "bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500/40",
		Icon: TriangleAlert
	},
	info: {
		ring: "bg-primary/10 text-primary ring-primary/20",
		glow: "from-primary/15",
		button: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/40",
		Icon: Info
	}
};
function ConfirmModal({ isOpen, onClose, onConfirm, title, description, detail, confirmText = "Confirm", cancelText = "Cancel", variant = "danger", isLoading = false }) {
	const s = STYLES[variant];
	const Icon = s.Icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: isOpen,
		onOpenChange: (open) => !isLoading && !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-[26rem] gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl hide-close-button",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${s.glow} to-transparent` }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					disabled: isLoading,
					"aria-label": "Close",
					className: "absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex w-full min-w-0 flex-col items-center px-6 pb-2 pt-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid h-14 w-14 shrink-0 place-items-center rounded-full ring-8 ${s.ring}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "mt-4 w-full min-w-0 break-words text-lg font-black tracking-tight",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "mt-1.5 w-full min-w-0 break-words text-sm leading-relaxed text-muted-foreground",
							children: description
						}),
						detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 w-full min-w-0 break-words rounded-lg bg-muted/60 px-3 py-2 text-xs font-semibold line-clamp-2",
							children: detail
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-col-reverse gap-2 border-t bg-muted/25 p-4 sm:flex-row sm:justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: isLoading,
						onClick: onClose,
						className: "rounded-xl border bg-background px-4 py-2.5 text-sm font-semibold transition hover:bg-muted disabled:opacity-50 sm:min-w-[7rem]",
						children: cancelText
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: isLoading,
						onClick: () => onConfirm(),
						className: `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm transition focus-visible:outline-none focus-visible:ring-4 disabled:opacity-60 sm:min-w-[7rem] ${s.button}`,
						children: [isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), confirmText]
					})]
				})
			]
		})
	});
}
//#endregion
export { DialogFooter as a, DialogDescription as i, Dialog as n, DialogHeader as o, DialogContent as r, DialogTitle as s, ConfirmModal as t };
