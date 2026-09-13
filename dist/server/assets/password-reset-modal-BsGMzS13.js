import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Check, Copy, KeyRound, Loader2, RefreshCw, X } from "lucide-react";
//#region src/components/password-reset-modal.tsx
var WORDS = [
	"shop",
	"sell",
	"store",
	"order",
	"reseller",
	"market"
];
function easyPassword() {
	return `${WORDS[Math.floor(Math.random() * WORDS.length)]}${Math.floor(1e3 + Math.random() * 9e3)}`;
}
/**
* Shows the new password up-front. The admin must copy it before the reset
* button becomes active, so the password is never lost.
*/
function PasswordResetModal({ label, onClose, onReset }) {
	const [password, setPassword] = useState(() => easyPassword());
	const [copied, setCopied] = useState(false);
	const [busy, setBusy] = useState(false);
	async function copy() {
		try {
			await navigator.clipboard.writeText(password);
		} catch {}
		setCopied(true);
		toast.success("Password copied");
	}
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4",
		onClick: busy ? void 0 : onClose,
		children: /* @__PURE__ */ jsxs("div", {
			onClick: (e) => e.stopPropagation(),
			className: "surface-card w-full max-w-md rounded-b-none sm:rounded-lg",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between gap-3 border-b px-4 py-3",
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "flex items-center gap-2 text-base font-semibold",
						children: [/* @__PURE__ */ jsx(KeyRound, { className: "h-4 w-4 text-amber-500" }), " Reset password"]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-md p-1 hover:bg-muted",
						children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-3 px-4 py-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"New password for ",
								/* @__PURE__ */ jsx("span", {
									className: "font-medium text-foreground",
									children: label
								}),
								". Copy it first — it will not be shown again."
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex-1 rounded-md border bg-muted/40 px-3 py-2 font-mono text-lg tracking-wider",
								children: password
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => {
									setPassword(easyPassword());
									setCopied(false);
								},
								disabled: busy,
								title: "Generate another",
								className: "rounded-md border p-2 hover:bg-muted disabled:opacity-50",
								children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => void copy(),
							disabled: busy,
							className: "inline-flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium hover:bg-muted disabled:opacity-50",
							children: [copied ? /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 text-emerald-500" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" }), copied ? "Copied" : "Copy password"]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-end gap-2 border-t px-4 py-3",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						disabled: busy,
						className: "rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50",
						children: "Cancel"
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						disabled: !copied || busy,
						onClick: async () => {
							setBusy(true);
							try {
								await onReset(password);
							} finally {
								setBusy(false);
							}
						},
						className: "inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50",
						children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(KeyRound, { className: "h-3.5 w-3.5" }), copied ? "Reset password" : "Copy first"]
					})]
				})
			]
		})
	});
}
//#endregion
export { PasswordResetModal as t };
