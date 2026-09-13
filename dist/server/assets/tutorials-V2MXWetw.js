import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { t as TutorialLibrary } from "./tutorial-library--w6moMOR.js";
//#region src/routes/_authenticated/reseller/tutorials.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
function ResellerTutorialsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Video tutorials",
			description: "Topic onujai sajano video guide — click korlei ekhanei play hobe."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorialLibrary, { compact: true })]
	});
}
//#endregion
export { ResellerTutorialsPage as component };
