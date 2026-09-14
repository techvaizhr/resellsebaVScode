import { i as rememberImpersonationReturnTarget, o as stopImpersonation, r as readImpersonation } from "./impersonation-C-f1jb02.js";
import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ArrowLeft, Loader2, UserCog } from "lucide-react";
//#region src/components/impersonation-banner.tsx
/** Shown while an admin is browsing a reseller panel through "Login as reseller". */
function ImpersonationBanner() {
	useRouter();
	const [snapshot, setSnapshot] = useState(null);
	const [busy, setBusy] = useState(false);
	useEffect(() => {
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
	return /* @__PURE__ */ jsxs("div", {
		className: "mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200",
		children: [/* @__PURE__ */ jsxs("span", {
			className: "inline-flex items-center gap-2 font-medium",
			children: [
				/* @__PURE__ */ jsx(UserCog, { className: "h-4 w-4" }),
				" Viewing as ",
				snapshot.label
			]
		}), /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => void back(),
			disabled: busy,
			className: "inline-flex items-center gap-2 rounded-md border border-amber-400 bg-background px-2.5 py-1.5 text-xs font-semibold transition hover:bg-muted disabled:opacity-60",
			children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(ArrowLeft, { className: "h-3.5 w-3.5" }), " Back to admin"]
		})]
	});
}
//#endregion
export { ImpersonationBanner as t };
