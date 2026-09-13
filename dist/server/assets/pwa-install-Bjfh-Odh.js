import { t as cn } from "./utils-C_uf36nf.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, Download } from "lucide-react";
//#region src/components/pwa-install.tsx
var deferredPrompt = null;
/** Tracks installability of the app (manifest-only PWA). */
function usePwaInstall() {
	const [canInstall, setCanInstall] = useState(false);
	const [installed, setInstalled] = useState(false);
	useEffect(() => {
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
		if (variant === "inline") return /* @__PURE__ */ jsxs("span", {
			className: cn("inline-flex items-center gap-1.5 text-sm text-muted-foreground", className),
			children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }), " Installed"]
		});
		return null;
	}
	if (!canInstall) return null;
	if (variant === "inline") return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick: install,
		className: cn("inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary", className),
		children: [
			/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
			" ",
			label
		]
	});
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		onClick: install,
		title: label,
		"aria-label": label,
		className: cn("grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-primary", className),
		children: /* @__PURE__ */ jsx(Download, { className: "h-5 w-5" })
	});
}
//#endregion
export { PwaInstallButton as t };
