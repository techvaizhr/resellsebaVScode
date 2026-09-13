import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as createServerRpc } from "./createServerRpc-BQTLusYf.js";
import { l as stringType, n as arrayType, s as objectType } from "./types-CX4iBvKD.js";
import { t as requireSupabaseAuth } from "./auth-middleware-D5tC10BX.js";
import { assertPermission } from "./admin-users.server-Cj-VRRLO.js";
//#region src/lib/roles-permissions.functions.ts?tss-serverfn-split
var getRoles_createServerFn_handler = createServerRpc({
	id: "a649084848d150e1b203a2c66abd3fbfae058d55017c2c8f8b69b4fcef3c0d14",
	name: "getRoles",
	filename: "src/lib/roles-permissions.functions.ts"
}, (opts) => getRoles.__executeServer(opts));
var getRoles = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getRoles_createServerFn_handler, async ({ context }) => {
	await assertPermission(context.supabase, context.userId, "staff.manage");
	const { data, error } = await context.supabase.from("roles").select(`
        *,
        role_permissions (
          permission_id
        )
      `);
	if (error) throw new Response(error.message, { status: 400 });
	return data;
});
var getPermissions_createServerFn_handler = createServerRpc({
	id: "a7122c479165993c9847f8ed25ac7808c73036e56e6cc39481cd1e8428bb2ae9",
	name: "getPermissions",
	filename: "src/lib/roles-permissions.functions.ts"
}, (opts) => getPermissions.__executeServer(opts));
var getPermissions = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getPermissions_createServerFn_handler, async ({ context }) => {
	await assertPermission(context.supabase, context.userId, "staff.manage");
	const { data, error } = await context.supabase.from("permissions").select("*");
	if (error) throw new Response(error.message, { status: 400 });
	return data;
});
var saveRoleInput = objectType({
	id: stringType().min(1).optional(),
	name: stringType().min(2),
	description: stringType().optional(),
	permissionIds: arrayType(stringType().min(1))
});
var saveRole_createServerFn_handler = createServerRpc({
	id: "7b3562bbc912086c55329f1cccc8e0a1d2108aeaf4fa9fc6cfdb4859cb91413a",
	name: "saveRole",
	filename: "src/lib/roles-permissions.functions.ts"
}, (opts) => saveRole.__executeServer(opts));
var saveRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => saveRoleInput.parse(d)).handler(saveRole_createServerFn_handler, async ({ data, context }) => {
	await assertPermission(context.supabase, context.userId, "staff.manage");
	const db = context.supabase;
	let roleId = data.id;
	if (roleId) {
		const { error } = await db.from("roles").update({
			name: data.name,
			description: data.description
		}).eq("id", roleId);
		if (error) throw new Response(error.message, { status: 400 });
	} else {
		const { data: newRole, error } = await db.from("roles").insert({
			name: data.name,
			description: data.description
		}).select("id").single();
		if (error) throw new Response(error.message, { status: 400 });
		roleId = newRole.id;
	}
	await db.from("role_permissions").delete().eq("role_id", roleId);
	if (data.permissionIds.length > 0) {
		const { error: permError } = await db.from("role_permissions").insert(data.permissionIds.map((pid) => ({
			role_id: roleId,
			permission_id: pid
		})));
		if (permError) throw new Response(permError.message, { status: 400 });
	}
	return {
		ok: true,
		id: roleId
	};
});
var deleteRole_createServerFn_handler = createServerRpc({
	id: "8fe8ad3eb41b179115dbad77ceb6946368cd1edd70577f36cff92291c6657f25",
	name: "deleteRole",
	filename: "src/lib/roles-permissions.functions.ts"
}, (opts) => deleteRole.__executeServer(opts));
var deleteRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().min(1) }).parse(d)).handler(deleteRole_createServerFn_handler, async ({ data, context }) => {
	await assertPermission(context.supabase, context.userId, "staff.manage");
	const { error } = await context.supabase.from("roles").delete().eq("id", data.id).eq("is_system", false);
	if (error) throw new Response(error.message, { status: 400 });
	return { ok: true };
});
//#endregion
export { deleteRole_createServerFn_handler, getPermissions_createServerFn_handler, getRoles_createServerFn_handler, saveRole_createServerFn_handler };
