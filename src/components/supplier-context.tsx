import { createContext, useContext } from "react";
import type { SupplierReport } from "@/lib/supplier";

export type SupplierCtx = {
  data: SupplierReport;
  reload: () => Promise<void>;
  reloading: boolean;
};

const Ctx = createContext<SupplierCtx | null>(null);

export const SupplierProvider = Ctx.Provider;

export function useSupplier(): SupplierCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSupplier must be used inside the supplier panel");
  return ctx;
}
