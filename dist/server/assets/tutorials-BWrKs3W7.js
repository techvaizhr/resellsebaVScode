import { n as PageHeader } from "./ui-kit-D-uo76H8.js";
import { t as TutorialLibrary } from "./tutorial-library-EHitMGCX.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/_authenticated/reseller/tutorials.tsx?tsr-split=component
function ResellerTutorialsPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ jsx(PageHeader, {
			title: "Video tutorials",
			description: "Topic onujai sajano video guide — click korlei ekhanei play hobe."
		}), /* @__PURE__ */ jsx(TutorialLibrary, { compact: true })]
	});
}
//#endregion
export { ResellerTutorialsPage as component };
