import { t as ConfirmModal } from "./ConfirmModal-CPm0pZdA.js";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
//#region src/lib/confirm.tsx
var push = null;
/**
* Global confirmation popup. Replaces window.confirm() everywhere.
* Usage: if (!(await confirmAction({ description: "..." }))) return;
*/
function confirmAction(options) {
	if (!push) {
		if (typeof window !== "undefined") return Promise.resolve(window.confirm(options.description));
		return Promise.resolve(false);
	}
	return new Promise((resolve) => push({
		...options,
		resolve
	}));
}
function GlobalConfirmHost() {
	const [pending, setPending] = React.useState(null);
	React.useEffect(() => {
		push = (p) => setPending(p);
		return () => {
			push = null;
		};
	}, []);
	const settle = (ok) => {
		pending?.resolve(ok);
		setPending(null);
	};
	return /* @__PURE__ */ jsx(ConfirmModal, {
		isOpen: !!pending,
		onClose: () => settle(false),
		onConfirm: () => settle(true),
		title: pending?.title ?? "Are you sure?",
		description: pending?.description ?? "",
		...pending?.detail ? { detail: pending.detail } : {},
		confirmText: pending?.confirmText ?? "Confirm",
		cancelText: pending?.cancelText ?? "Cancel",
		variant: pending?.variant ?? "danger"
	});
}
//#endregion
export { confirmAction as n, GlobalConfirmHost as t };
