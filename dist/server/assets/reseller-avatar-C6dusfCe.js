import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
//#region src/components/reseller-avatar.tsx
var import_jsx_runtime = require_jsx_runtime();
/**
* Shared reseller profile picture.
* Falls back to initials when no image is uploaded, so every list/report
* can render the same visual identity without extra branching.
*/
function ResellerAvatar({ url, name, size = 40, className = "" }) {
	const initials = (name ?? "").trim().slice(0, 2) || "R";
	const style = {
		width: size,
		height: size,
		fontSize: Math.max(10, Math.round(size * .36))
	};
	if (url) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt: name ? `${name} profile picture` : "Profile picture",
		loading: "lazy",
		style,
		className: "shrink-0 rounded-full border object-cover " + className
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style,
		className: "grid shrink-0 place-items-center rounded-full bg-primary/10 font-semibold uppercase text-primary " + className,
		children: initials
	});
}
//#endregion
export { ResellerAvatar as t };
