import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useRouter } from "./useRouter-D2hJ-wMP.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Nt as LoaderCircle, Sr as ArrowLeft, u as UserCog } from "./vendor-icons-DF2A5Z8S.js";
import { i as rememberImpersonationReturnTarget, o as stopImpersonation, r as readImpersonation } from "./impersonation-BwCyUj37.js";
//#region src/components/impersonation-banner.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/** Shown while an admin is browsing a reseller panel through "Login as reseller". */
function ImpersonationBanner() {
	useRouter();
	const [snapshot, setSnapshot] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setSnapshot(readImpersonation());
	}, []);
	if (!snapshot) return null;
	async function back() {
		setBusy(true);
		try {
			const to = await stopImpersonation();
			rememberImpersonationReturnTarget(to);
			setSnapshot(null);
			window.location.href = to || "/admin";
		} catch (e) {
			setBusy(false);
			toast.error(e?.message ?? "Could not return to admin");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-2 font-medium",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-4 w-4" }),
				" Viewing as ",
				snapshot.label
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => void back(),
			disabled: busy,
			className: "inline-flex items-center gap-2 rounded-md border border-amber-400 bg-background px-2.5 py-1.5 text-xs font-semibold transition hover:bg-muted disabled:opacity-60",
			children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Back to admin"]
		})]
	});
}
//#endregion
export { ImpersonationBanner as t };
