import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { H as Search, Jn as ChevronDown, r as X } from "./vendor-icons-BWIzFOtW.js";
//#region src/components/searchable-select.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* Global searchable dropdown. Used for every reseller filter (and any other
* long option list) so the behaviour and look stay identical everywhere.
* Mobile: full-width trigger + panel that never overflows the viewport.
*/
function SearchableSelect({ options, value, onChange, label, placeholder = "All", searchPlaceholder = "Search…", className, align = "start" }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const boxRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		function onDoc(e) {
			if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
		}
		function onKey(e) {
			if (e.key === "Escape") setOpen(false);
		}
		document.addEventListener("mousedown", onDoc);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDoc);
			document.removeEventListener("keydown", onKey);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!open) setQ("");
	}, [open]);
	const filtered = (0, import_react.useMemo)(() => {
		const list = options.filter((o) => o.value !== "");
		const t = q.trim().toLowerCase();
		return t ? list.filter((o) => o.label.toLowerCase().includes(t)) : list;
	}, [options, q]);
	const selected = options.find((o) => o.value === value);
	const trigger = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: boxRef,
		className: "relative min-w-0 w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			className: "flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-background px-2 text-xs font-medium outline-none focus:ring-1 focus:ring-primary",
			title: label ?? placeholder,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children: selected ? selected.label : placeholder
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 opacity-60" })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `absolute z-40 mt-1 w-[min(320px,calc(100vw-2rem))] min-w-full rounded-md border bg-popover p-2 shadow-lg ${align === "end" ? "right-0" : "left-0"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center gap-2 rounded-md border px-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 shrink-0 opacity-60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: searchPlaceholder,
						className: "h-8 w-full bg-transparent text-sm outline-none"
					}),
					q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setQ(""),
						className: "rounded p-0.5 hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-60 overflow-y-auto overscroll-contain",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							onChange("");
							setOpen(false);
						},
						className: `w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted ${!value ? "bg-muted font-medium" : ""}`,
						children: placeholder
					}),
					filtered.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							onChange(o.value);
							setOpen(false);
						},
						className: `w-full truncate rounded px-2 py-1.5 text-left text-sm hover:bg-muted ${value === o.value ? "bg-muted font-medium" : ""}`,
						children: o.label
					}, o.value)),
					filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 py-2 text-xs text-muted-foreground",
						children: "Nothing found."
					})
				]
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `min-w-0 ${className ?? "w-full"}`,
		children: [label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1 block text-[11px] font-medium text-muted-foreground",
			children: label
		}), trigger]
	});
}
//#endregion
export { SearchableSelect as t };
