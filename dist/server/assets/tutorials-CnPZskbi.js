import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { cn as GraduationCap } from "./vendor-icons-DF2A5Z8S.js";
import { t as TutorialLibrary } from "./tutorial-library-DVj2T80m.js";
import { n as PublicHeader } from "./public-header-OD7K_RGB.js";
//#region src/routes/tutorials.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
function TutorialsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-4 w-4" }), " Video Tutorial"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 text-3xl font-black sm:text-4xl",
						children: "Learn step by step"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-2xl text-sm text-muted-foreground",
						children: "Video tutorials organized by topic — click any video to watch it right here."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorialLibrary, {})]
		})]
	});
}
//#endregion
export { TutorialsPage as component };
