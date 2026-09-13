import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { An as Copy } from "./vendor-icons-BEaCFqaT.js";
//#region src/components/CopyOrderNumber.tsx
var import_jsx_runtime = require_jsx_runtime();
function CopyOrderNumber({ orderNumber, prefix = true, showText = true, className = "", iconClassName = "h-3 w-3" }) {
	const safeNumber = orderNumber && orderNumber !== "undefined" ? String(orderNumber) : "—";
	const label = safeNumber === "—" ? "—" : `${prefix ? "#" : ""}${safeNumber}`;
	const handleCopy = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (safeNumber === "—") return;
		try {
			await navigator.clipboard.writeText(safeNumber);
			toast.success("Order number copied");
		} catch {
			toast.error("Failed to copy");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1 ${className}`,
		children: [showText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: handleCopy,
			title: "Copy order number",
			className: "shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: iconClassName })
		})]
	});
}
//#endregion
export { CopyOrderNumber as t };
