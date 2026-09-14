import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown } from "lucide-react";
//#region src/components/status-tabs.tsx
/**
* Global status-tab strip used across admin / reseller / supplier list pages.
* - Mobile: a compact dropdown that fits inside the filter grid.
* - Desktop: wrapping pills, never a horizontal scroller.
*/
function StatusTabs({ tabs, tab, onChange, count, className = "mb-4 w-full min-w-0" }) {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);
	const active = tabs.find((t) => t.key === tab);
	useEffect(() => {
		function onDoc(e) {
			if (ref.current?.contains(e.target)) return;
			setOpen(false);
		}
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className,
		children: [/* @__PURE__ */ jsxs("div", {
			ref,
			className: "relative sm:hidden",
			children: [/* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => setOpen((v) => !v),
				"aria-expanded": open,
				className: "flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "min-w-0 truncate font-medium",
					children: [active?.label ?? "All", /* @__PURE__ */ jsx("span", {
						className: "ml-1.5 text-xs opacity-70",
						children: count(tab)
					})]
				}), /* @__PURE__ */ jsx(ChevronDown, { className: `h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}` })]
			}), open && /* @__PURE__ */ jsx("div", {
				className: "absolute left-0 right-0 z-50 mt-1.5 max-h-72 overflow-y-auto rounded-md border bg-popover p-2 shadow-lg modal-scroll",
				children: tabs.map((t) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => {
						onChange(t.key);
						setOpen(false);
					},
					className: `flex w-full items-center justify-between rounded px-2.5 py-2 text-sm ${t.key === tab ? "bg-primary/10 font-semibold text-primary" : "hover:bg-accent"}`,
					children: [/* @__PURE__ */ jsx("span", {
						className: "truncate",
						children: t.label
					}), /* @__PURE__ */ jsx("span", {
						className: "ml-2 text-xs opacity-70",
						children: count(t.key)
					})]
				}, t.key))
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "hidden flex-wrap gap-2 sm:flex",
			children: tabs.map((t) => /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => onChange(t.key),
				className: "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " + (t.key === tab ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-muted"),
				children: [
					t.label,
					" ",
					/* @__PURE__ */ jsxs("span", {
						className: "opacity-70",
						children: [
							"(",
							count(t.key),
							")"
						]
					})
				]
			}, t.key))
		})]
	});
}
//#endregion
export { StatusTabs as t };
