import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as createServerRpc } from "./createServerRpc-BQTLusYf.js";
import { l as stringType, s as objectType } from "./types-CX4iBvKD.js";
import { t as requireSupabaseAuth } from "./auth-middleware-D5tC10BX.js";
import { assertPermission } from "./admin-users.server-Cj-VRRLO.js";
//#region src/lib/user-management.functions.ts?tss-serverfn-split
var createUserInput = objectType({
	email: stringType().email(),
	password: stringType().min(6),
	fullName: stringType().min(2),
	phone: stringType().optional().nullable(),
	role: stringType()
});
var createAdminUser_createServerFn_handler = createServerRpc({
	id: "3a50e23ae2b20d88409e8a62e7626f41b7e47f3f6ee2a5a806856ef3b1c0b9f2",
	name: "createAdminUser",
	filename: "src/lib/user-management.functions.ts"
}, (opts) => createAdminUser.__executeServer(opts));
var createAdminUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => createUserInput.parse(d)).handler(createAdminUser_createServerFn_handler, async ({ data, context }) => {
	await assertPermission(context.supabase, context.userId, "staff.manage");
	const { createStaffUser, splitRoleSelection } = await import("./auth-admin.server-3mr8Ug0G.js");
	const { role, customRoleId } = splitRoleSelection(data.role);
	return {
		ok: true,
		userId: await createStaffUser(context.supabase, {
			email: data.email,
			password: data.password,
			fullName: data.fullName,
			phone: data.phone,
			role,
			customRoleId
		})
	};
});
var updatePasswordInput = objectType({
	userId: stringType().min(1),
	password: stringType().min(6)
});
var updateAdminUserPassword_createServerFn_handler = createServerRpc({
	id: "a5de8b020430b7345a07814f917cefc9f643090a71a3becd5e4f611c50f9d888",
	name: "updateAdminUserPassword",
	filename: "src/lib/user-management.functions.ts"
}, (opts) => updateAdminUserPassword.__executeServer(opts));
var updateAdminUserPassword = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => updatePasswordInput.parse(d)).handler(updateAdminUserPassword_createServerFn_handler, async ({ data, context }) => {
	await assertPermission(context.supabase, context.userId, "staff.manage");
	const { setPassword } = await import("./auth-admin.server-3mr8Ug0G.js");
	await setPassword(context.supabase, data.userId, data.password);
	return { ok: true };
});
var updateRoleInput = objectType({
	userId: stringType().min(1),
	role: stringType()
});
var updateAdminUserRole_createServerFn_handler = createServerRpc({
	id: "b1692f83eddd1d94d500e5008624c86decb80d533d3107b5819fdcc9069fcba5",
	name: "updateAdminUserRole",
	filename: "src/lib/user-management.functions.ts"
}, (opts) => updateAdminUserRole.__executeServer(opts));
var updateAdminUserRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => updateRoleInput.parse(d)).handler(updateAdminUserRole_createServerFn_handler, async ({ data, context }) => {
	await assertPermission(context.supabase, context.userId, "staff.manage");
	const { assignRole, splitRoleSelection } = await import("./auth-admin.server-3mr8Ug0G.js");
	const { role, customRoleId } = splitRoleSelection(data.role);
	await assignRole(context.supabase, data.userId, role, customRoleId);
	return { ok: true };
});
var updateAccountInput = objectType({
	userId: stringType().min(1),
	email: stringType().email(),
	fullName: stringType().min(2),
	phone: stringType().optional().nullable(),
	role: stringType().optional(),
	password: stringType().min(6).max(72).optional()
});
/** One-shot staff account edit: name, email, phone, role and (optionally) a new password. */
var updateAdminUserAccount_createServerFn_handler = createServerRpc({
	id: "19348ddd96363e7d06426e105c0307ed9efe1817718075ff9b76d7d1c68d71cd",
	name: "updateAdminUserAccount",
	filename: "src/lib/user-management.functions.ts"
}, (opts) => updateAdminUserAccount.__executeServer(opts));
var updateAdminUserAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => updateAccountInput.parse(d)).handler(updateAdminUserAccount_createServerFn_handler, async ({ data, context }) => {
	await assertPermission(context.supabase, context.userId, "staff.manage");
	const { assignRole, setPassword, splitRoleSelection, updateAccount } = await import("./auth-admin.server-3mr8Ug0G.js");
	await updateAccount(context.supabase, data.userId, data.email, data.fullName, data.phone);
	if (data.role) {
		const { role, customRoleId } = splitRoleSelection(data.role);
		await assignRole(context.supabase, data.userId, role, customRoleId);
	}
	if (data.password) await setPassword(context.supabase, data.userId, data.password);
	return { ok: true };
});
//#endregion
export { createAdminUser_createServerFn_handler, updateAdminUserAccount_createServerFn_handler, updateAdminUserPassword_createServerFn_handler, updateAdminUserRole_createServerFn_handler };
