import { t as TutorialLibrary } from "./tutorial-library-B1ig68ff.js";
import { n as PublicHeader } from "./public-header-C5Iac7PR.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { GraduationCap } from "lucide-react";
//#region src/routes/tutorials.tsx?tsr-split=component
function TutorialsPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ jsx(PublicHeader, {}), /* @__PURE__ */ jsxs("main", {
			className: "mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14",
			children: [/* @__PURE__ */ jsxs("header", {
				className: "mb-8 text-center",
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary",
						children: [/* @__PURE__ */ jsx(GraduationCap, { className: "h-4 w-4" }), " Video Tutorial"]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-3 text-3xl font-black sm:text-4xl",
						children: "Learn step by step"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mx-auto mt-2 max-w-2xl text-sm text-muted-foreground",
						children: "Video tutorials organized by topic — click any video to watch it right here."
					})
				]
			}), /* @__PURE__ */ jsx(TutorialLibrary, {})]
		})]
	});
}
//#endregion
export { TutorialsPage as component };
