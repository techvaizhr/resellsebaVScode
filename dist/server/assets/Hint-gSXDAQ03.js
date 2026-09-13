import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime, o as require_react_dom } from "./vendor-editor-CeWP4_Ao.js";
import { Hn as CircleQuestionMark } from "./vendor-icons-BEaCFqaT.js";
//#region src/components/Hint.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* Hint icon — shows an explanation on hover (desktop) or tap (mobile).
* Uses a portal to ensure it stays above all other elements and doesn't get clipped.
*/
function Hint({ children, className = "", side = "top" }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [coords, setCoords] = (0, import_react.useState)({
		top: 0,
		left: 0
	});
	const triggerRef = (0, import_react.useRef)(null);
	const updatePosition = () => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			const scrollY = window.scrollY;
			const scrollX = window.scrollX;
			let top = 0;
			let left = 0;
			if (side === "top") {
				top = rect.top + scrollY - 8;
				left = rect.left + scrollX + rect.width / 2;
			} else if (side === "bottom") {
				top = rect.bottom + scrollY + 8;
				left = rect.left + scrollX + rect.width / 2;
			} else if (side === "left") {
				top = rect.top + scrollY + rect.height / 2;
				left = rect.left + scrollX - 8;
			} else if (side === "right") {
				top = rect.top + scrollY + rect.height / 2;
				left = rect.right + scrollX + 8;
			}
			setCoords({
				top,
				left
			});
		}
	};
	(0, import_react.useEffect)(() => {
		if (open) {
			updatePosition();
			window.addEventListener("scroll", updatePosition);
			window.addEventListener("resize", updatePosition);
		}
		return () => {
			window.removeEventListener("scroll", updatePosition);
			window.removeEventListener("resize", updatePosition);
		};
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onDoc = (e) => {
			if (triggerRef.current && !triggerRef.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, [open]);
	const translate = side === "top" ? "translate(-50%, -100%)" : side === "bottom" ? "translate(-50%, 0)" : side === "left" ? "translate(-100%, -50%)" : "translate(0, -50%)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `relative inline-flex align-middle ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			ref: triggerRef,
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				e.stopPropagation();
				setOpen((v) => !v);
			},
			onMouseEnter: () => setOpen(true),
			onMouseLeave: () => setOpen(false),
			className: "inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:text-primary transition-colors",
			"aria-label": "Hint",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5" })
		}), open && typeof document !== "undefined" && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none fixed z-[99999] px-3 py-2",
			style: {
				top: coords.top - window.scrollY,
				left: coords.left - window.scrollX,
				transform: translate
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-max max-w-[200px] break-words rounded-lg border border-white/20 bg-black/90 backdrop-blur-xl px-3 py-2 text-[11px] font-medium leading-tight text-white shadow-2xl ring-1 ring-white/10",
				ref: (el) => {
					if (el) {
						const rect = el.getBoundingClientRect();
						const padding = 12;
						let offset = 0;
						if (rect.left < padding) offset = padding - rect.left;
						else if (rect.right > window.innerWidth - padding) offset = window.innerWidth - padding - rect.right;
						if (offset !== 0) el.style.transform = `translateX(${offset}px)`;
					}
				},
				children
			})
		}), document.body)]
	});
}
//#endregion
export { Hint as t };
