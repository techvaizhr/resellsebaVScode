import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
//#region src/components/supplier-context.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var Ctx = (0, import_react.createContext)(null);
var SupplierProvider = Ctx.Provider;
function useSupplier() {
	const ctx = (0, import_react.useContext)(Ctx);
	if (!ctx) throw new Error("useSupplier must be used inside the supplier panel");
	return ctx;
}
//#endregion
export { useSupplier as n, SupplierProvider as t };
