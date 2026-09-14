import { jsx } from "react/jsx-runtime";
//#region src/components/reseller-avatar.tsx
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
	if (url) return /* @__PURE__ */ jsx("img", {
		src: url,
		alt: name ? `${name} profile picture` : "Profile picture",
		loading: "lazy",
		style,
		className: "shrink-0 rounded-full border object-cover " + className
	});
	return /* @__PURE__ */ jsx("div", {
		style,
		className: "grid shrink-0 place-items-center rounded-full bg-primary/10 font-semibold uppercase text-primary " + className,
		children: initials
	});
}
//#endregion
export { ResellerAvatar as t };
