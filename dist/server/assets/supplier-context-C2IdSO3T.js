import { createContext, useContext } from "react";
//#region src/components/supplier-context.tsx
var Ctx = createContext(null);
var SupplierProvider = Ctx.Provider;
function useSupplier() {
	const ctx = useContext(Ctx);
	if (!ctx) throw new Error("useSupplier must be used inside the supplier panel");
	return ctx;
}
//#endregion
export { useSupplier as n, SupplierProvider as t };
