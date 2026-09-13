import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as createServerRpc } from "./createServerRpc-BQTLusYf.js";
import { l as stringType, s as objectType } from "./types-CX4iBvKD.js";
import { t as requireSupabaseAuth } from "./auth-middleware-B9l3vJQd.js";
import { assertAnyPermission, assertPermission } from "./admin-users.server-Cj-VRRLO.js";
//#region src/lib/admin-users.functions.ts?tss-serverfn-split
var input = objectType({ userId: stringType().min(1) });
var confirmUserEmail_createServerFn_handler = createServerRpc({
	id: "7a2fc6f207a5ff6162f1eb87faf4af12606a93357fe77592c73a780c9c7a3470",
	name: "confirmUserEmail",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => confirmUserEmail.__executeServer(opts));
var confirmUserEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => input.parse(d)).handler(confirmUserEmail_createServerFn_handler, async ({ data, context }) => {
	await assertPermission(context.supabase, context.userId, "resellers.manage");
	const { confirmEmail } = await import("./auth-admin.server-3mr8Ug0G.js");
	const res = await confirmEmail(context.supabase, data.userId);
	return {
		ok: true,
		alreadyConfirmed: res.alreadyConfirmed,
		email: res.email
	};
});
var listResellerEmailStatus_createServerFn_handler = createServerRpc({
	id: "d8291a8798f81d4da562d493e9e37a818e176a9a438b9e18f1603244e947944d",
	name: "listResellerEmailStatus",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => listResellerEmailStatus.__executeServer(opts));
var listResellerEmailStatus = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listResellerEmailStatus_createServerFn_handler, async ({ context }) => {
	await assertPermission(context.supabase, context.userId, "resellers.manage");
	const { loadAuthUsers } = await import("./auth-admin.server-3mr8Ug0G.js");
	return (await loadAuthUsers(context.supabase)).map((u) => ({
		user_id: u.user_id,
		email: u.email,
		email_confirmed: u.email_confirmed
	}));
});
var deleteAuthUser_createServerFn_handler = createServerRpc({
	id: "991da20e038601bf91e8fbcb431eb8700d1ebdfa16fdacef4672e69af0dc485c",
	name: "deleteAuthUser",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => deleteAuthUser.__executeServer(opts));
var deleteAuthUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => input.parse(d)).handler(deleteAuthUser_createServerFn_handler, async ({ data, context }) => {
	await assertAnyPermission(context.supabase, context.userId, ["staff.manage", "resellers.manage"]);
	const { deleteUser } = await import("./auth-admin.server-3mr8Ug0G.js");
	await deleteUser(context.supabase, data.userId);
	return { ok: true };
});
var listStaffUsers_createServerFn_handler = createServerRpc({
	id: "11f171b815abba951a9e9150a46ba78511c7bf9fac1f490e5c5aa41a9b84a5c1",
	name: "listStaffUsers",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => listStaffUsers.__executeServer(opts));
var listStaffUsers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listStaffUsers_createServerFn_handler, async ({ context }) => {
	await assertPermission(context.supabase, context.userId, "staff.manage");
	const db = context.supabase;
	const { data: roleRows, error: roleErr } = await db.from("user_roles").select("user_id, role, custom_role_id, roles:custom_role_id (name)").in("role", ["super_admin", "staff"]);
	if (roleErr) throw new Response(roleErr.message, { status: 400 });
	const ids = (roleRows ?? []).map((r) => r.user_id);
	if (ids.length === 0) return [];
	const { data: profiles } = await db.from("profiles").select("id, full_name, created_at, phone").in("id", ids);
	const { loadAuthUsers } = await import("./auth-admin.server-3mr8Ug0G.js");
	const authUsers = await loadAuthUsers(db);
	const authUserMap = Object.fromEntries(authUsers.map((u) => [u.user_id, u]));
	const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
	return (roleRows ?? []).map((r) => ({
		id: r.user_id,
		email: authUserMap[r.user_id]?.email ?? null,
		phone: authUserMap[r.user_id]?.phone ?? profileMap[r.user_id]?.phone ?? null,
		full_name: profileMap[r.user_id]?.full_name ?? null,
		role: r.role,
		custom_role_id: r.custom_role_id ?? null,
		custom_role_name: r.roles?.name ?? null,
		created_at: profileMap[r.user_id]?.created_at ?? null
	}));
});
//#endregion
export { confirmUserEmail_createServerFn_handler, deleteAuthUser_createServerFn_handler, listResellerEmailStatus_createServerFn_handler, listStaffUsers_createServerFn_handler };
