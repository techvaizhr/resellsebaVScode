import { t as cn } from "./utils-C_uf36nf.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, Info, Loader2, Trash2, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
//#region src/components/ui/dialog.tsx
var Dialog = DialogPrimitive.Root;
var DialogPortal = DialogPrimitive.Portal;
var DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [/* @__PURE__ */ jsx(DialogOverlay, {}), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
	ref,
	className: cn("group fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ jsxs(DialogPrimitive.Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground group-[.hide-close-button]:hidden",
		children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
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
		Icon: AlertTriangle
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
	return /* @__PURE__ */ jsx(Dialog, {
		open: isOpen,
		onOpenChange: (open) => !isLoading && !open && onClose(),
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-w-[26rem] gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl hide-close-button",
			children: [
				/* @__PURE__ */ jsx("div", { className: `pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${s.glow} to-transparent` }),
				/* @__PURE__ */ jsx("button", {
					onClick: onClose,
					disabled: isLoading,
					"aria-label": "Close",
					className: "absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40",
					children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative flex w-full min-w-0 flex-col items-center px-6 pb-2 pt-8 text-center",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: `grid h-14 w-14 shrink-0 place-items-center rounded-full ring-8 ${s.ring}`,
							children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ jsx(DialogTitle, {
							className: "mt-4 w-full min-w-0 break-words text-lg font-black tracking-tight",
							children: title
						}),
						/* @__PURE__ */ jsx(DialogDescription, {
							className: "mt-1.5 w-full min-w-0 break-words text-sm leading-relaxed text-muted-foreground",
							children: description
						}),
						detail && /* @__PURE__ */ jsx("div", {
							className: "mt-3 w-full min-w-0 break-words rounded-lg bg-muted/60 px-3 py-2 text-xs font-semibold line-clamp-2",
							children: detail
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-5 flex flex-col-reverse gap-2 border-t bg-muted/25 p-4 sm:flex-row sm:justify-center",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						disabled: isLoading,
						onClick: onClose,
						className: "rounded-xl border bg-background px-4 py-2.5 text-sm font-semibold transition hover:bg-muted disabled:opacity-50 sm:min-w-[7rem]",
						children: cancelText
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						disabled: isLoading,
						onClick: () => onConfirm(),
						className: `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm transition focus-visible:outline-none focus-visible:ring-4 disabled:opacity-60 sm:min-w-[7rem] ${s.button}`,
						children: [isLoading && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), confirmText]
					})]
				})
			]
		})
	});
}
//#endregion
export { DialogFooter as a, DialogDescription as i, Dialog as n, DialogHeader as o, DialogContent as r, DialogTitle as s, ConfirmModal as t };
