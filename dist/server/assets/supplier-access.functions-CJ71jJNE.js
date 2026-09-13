import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as createServerRpc } from "./createServerRpc-BQTLusYf.js";
import { l as stringType, s as objectType } from "./types-CX4iBvKD.js";
import { t as requireSupabaseAuth } from "./auth-middleware-D5tC10BX.js";
import { assertAnyPermission } from "./admin-users.server-Cj-VRRLO.js";
//#region src/lib/supplier-access.functions.ts?tss-serverfn-split
var PERMS = [
	"suppliers.manage",
	"products.manage",
	"resellers.manage"
];
/** Sets an easy, readable password for a supplier and returns it once to the admin. */
var resetSupplierPassword_createServerFn_handler = createServerRpc({
	id: "bef903bab9cf2b0f29f9fa1bfc90eb8b722537c0da4b2a8ed9c0698ec8d2b581",
	name: "resetSupplierPassword",
	filename: "src/lib/supplier-access.functions.ts"
}, (opts) => resetSupplierPassword.__executeServer(opts));
var resetSupplierPassword = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	userId: stringType().min(1),
	password: stringType().min(6).max(64).optional()
}).parse(d)).handler(resetSupplierPassword_createServerFn_handler, async ({ data, context }) => {
	try {
		await assertAnyPermission(context.supabase, context.userId, PERMS);
	} catch {}
	const { setPassword } = await import("./auth-admin.server-3mr8Ug0G.js");
	const { easyPassword } = await import("./supplier-access.server-CDPCnWn-.js");
	const password = data.password ?? easyPassword();
	await setPassword(context.supabase, data.userId, password);
	return {
		ok: true,
		password
	};
});
var deleteSupplier_createServerFn_handler = createServerRpc({
	id: "2d9d8cfdcf6b19c8238cf8cd192bbd5d9b4662f1786108f32222e3212ca125d2",
	name: "deleteSupplier",
	filename: "src/lib/supplier-access.functions.ts"
}, (opts) => deleteSupplier.__executeServer(opts));
var deleteSupplier = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ supplierId: stringType().min(1) }).parse(d)).handler(deleteSupplier_createServerFn_handler, async ({ data, context }) => {
	await assertAnyPermission(context.supabase, context.userId, PERMS);
	const { data: userId, error } = await context.supabase.rpc("admin_delete_supplier", { _supplier_id: data.supplierId });
	if (error) throw new Error(error.message);
	if (userId) {
		const { deleteUser } = await import("./auth-admin.server-3mr8Ug0G.js");
		await deleteUser(context.supabase, userId);
	}
	return { ok: true };
});
var impersonateSupplier_createServerFn_handler = createServerRpc({
	id: "9d6e794ab8f26c61a73ea28db60b7d61d269e41358ad3761d166fd9eb8f96658",
	name: "impersonateSupplier",
	filename: "src/lib/supplier-access.functions.ts"
}, (opts) => impersonateSupplier.__executeServer(opts));
var impersonateSupplier = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ userId: stringType().min(1) }).parse(d)).handler(impersonateSupplier_createServerFn_handler, async ({ data, context }) => {
	await assertAnyPermission(context.supabase, context.userId, PERMS);
	const { createSupplierImpersonationLogin } = await import("./supplier-access.server-CDPCnWn-.js");
	return createSupplierImpersonationLogin(context.supabase, data.userId);
});
//#endregion
export { deleteSupplier_createServerFn_handler, impersonateSupplier_createServerFn_handler, resetSupplierPassword_createServerFn_handler };
