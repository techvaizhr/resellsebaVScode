import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { En as Download, Kn as CircleCheck } from "./vendor-icons-BEaCFqaT.js";
import { t as cn } from "./utils-UzdMQEyF.js";
//#region src/components/pwa-install.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var deferredPrompt = null;
/** Tracks installability of the app (manifest-only PWA). */
function usePwaInstall() {
	const [canInstall, setCanInstall] = (0, import_react.useState)(false);
	const [installed, setInstalled] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true) setInstalled(true);
		if (deferredPrompt) setCanInstall(true);
		const onPrompt = (e) => {
			e.preventDefault();
			deferredPrompt = e;
			setCanInstall(true);
		};
		const onInstalled = () => {
			deferredPrompt = null;
			setCanInstall(false);
			setInstalled(true);
		};
		window.addEventListener("beforeinstallprompt", onPrompt);
		window.addEventListener("appinstalled", onInstalled);
		return () => {
			window.removeEventListener("beforeinstallprompt", onPrompt);
			window.removeEventListener("appinstalled", onInstalled);
		};
	}, []);
	const install = async () => {
		if (!deferredPrompt) return;
		const evt = deferredPrompt;
		await evt.prompt();
		if ((await evt.userChoice).outcome === "accepted") {
			deferredPrompt = null;
			setCanInstall(false);
			setInstalled(true);
		}
	};
	return {
		canInstall,
		installed,
		install
	};
}
/**
* Install icon button. Hidden entirely when the app is already installed or
* the browser has not offered installability.
*/
function PwaInstallButton({ className, variant = "icon", label = "Install App" }) {
	const { canInstall, installed, install } = usePwaInstall();
	if (installed) {
		if (variant === "inline") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cn("inline-flex items-center gap-1.5 text-sm text-muted-foreground", className),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Installed"]
		});
		return null;
	}
	if (!canInstall) return null;
	if (variant === "inline") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: install,
		className: cn("inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }),
			" ",
			label
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: install,
		title: label,
		"aria-label": label,
		className: cn("grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-primary", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-5 w-5" })
	});
}
//#endregion
export { PwaInstallButton as t };
