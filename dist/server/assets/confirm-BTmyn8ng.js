import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as ConfirmModal } from "./ConfirmModal-D7BYETKw.js";
//#region src/lib/confirm.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
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
	const [pending, setPending] = import_react.useState(null);
	import_react.useEffect(() => {
		push = (p) => setPending(p);
		return () => {
			push = null;
		};
	}, []);
	const settle = (ok) => {
		pending?.resolve(ok);
		setPending(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
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
