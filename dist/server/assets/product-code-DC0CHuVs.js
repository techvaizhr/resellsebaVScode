import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
//#region src/components/product-code.tsx
/**
* Shared product ID chip with copy icon.
* Used everywhere a product code is shown (catalog, reseller panel, storefront).
*/
function ProductCodeChip({ code, className = "", size = "sm" }) {
	const [done, setDone] = useState(false);
	if (!code) return null;
	async function copy(e) {
		e.preventDefault();
		e.stopPropagation();
		try {
			await navigator.clipboard.writeText(String(code));
			setDone(true);
			toast.success(`Product ID ${code} copied`);
			setTimeout(() => setDone(false), 1200);
		} catch {
			toast.error("Copy failed");
		}
	}
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick: copy,
		title: "Copy product ID",
		className: `inline-flex items-center gap-1 rounded-md border border-border/70 bg-muted/60 font-bold tabular-nums tracking-wide text-muted-foreground transition hover:border-primary/50 hover:text-primary ${size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[11px]"} ${className}`,
		children: [/* @__PURE__ */ jsxs("span", { children: ["ID #", code] }), done ? /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 text-emerald-600" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3 opacity-70" })]
	});
}
//#endregion
export { ProductCodeChip as t };
