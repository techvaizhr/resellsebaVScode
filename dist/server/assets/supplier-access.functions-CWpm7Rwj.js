import { t as createServerFn } from "./createServerFn-CIHAFgYl.js";
import { s as createSsrRpc } from "./client-Be051lUg.js";
import { t as requireSupabaseAuth } from "./auth-middleware-l7OTet94.js";
import { z } from "zod";
//#region src/lib/supplier-access.functions.ts
/** Sets an easy, readable password for a supplier and returns it once to the admin. */
var resetSupplierPassword = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
	userId: z.string().min(1),
	password: z.string().min(6).max(64).optional()
}).parse(d)).handler(createSsrRpc("bef903bab9cf2b0f29f9fa1bfc90eb8b722537c0da4b2a8ed9c0698ec8d2b581"));
/** Deletes a supplier account (row + auth user). Order/product history is kept. */
var deleteSupplier = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ supplierId: z.string().min(1) }).parse(d)).handler(createSsrRpc("2d9d8cfdcf6b19c8238cf8cd192bbd5d9b4662f1786108f32222e3212ca125d2"));
/** Mints temporary credentials so an admin can enter the supplier panel. */
var impersonateSupplier = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ userId: z.string().min(1) }).parse(d)).handler(createSsrRpc("9d6e794ab8f26c61a73ea28db60b7d61d269e41358ad3761d166fd9eb8f96658"));
//#endregion
export { impersonateSupplier as n, resetSupplierPassword as r, deleteSupplier as t };
