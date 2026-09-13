//#region src/lib/auth-admin.server.ts
/** All accounts with email + confirmation status (permission checked in SQL). */
async function loadAuthUsers(supabase) {
	const { data, error } = await supabase.rpc("admin_auth_users");
	if (error) {
		console.error("[auth-admin] admin_auth_users failed", error.message);
		return [];
	}
	return (data ?? []).map((r) => ({
		user_id: r.user_id,
		email: r.email ?? null,
		phone: r.phone ?? null,
		email_confirmed: !!r.email_confirmed,
		created_at: r.created_at ?? null
	}));
}
async function loadAuthEmails(supabase) {
	const rows = await loadAuthUsers(supabase);
	return Object.fromEntries(rows.map((r) => [r.user_id, r.email]));
}
function fail(error) {
	const message = error.message.replace(/^.*?(?:ERROR|error):\s*/i, "");
	throw new Response(message || "Request failed", { status: /forbidden|not signed in/i.test(message) ? 403 : 400 });
}
async function confirmEmail(supabase, userId) {
	const { data, error } = await supabase.rpc("admin_confirm_user_email", { _user_id: userId });
	if (error) fail(error);
	const row = Array.isArray(data) ? data[0] : data;
	return {
		email: row?.email ?? null,
		alreadyConfirmed: !!row?.already_confirmed
	};
}
async function setPassword(supabase, userId, password) {
	const { error } = await supabase.rpc("admin_set_user_password", {
		_user_id: userId,
		_password: password
	});
	if (error) fail(error);
}
/** Updates the account's login email, display name, and phone. */
async function updateAccount(supabase, userId, email, fullName, phone) {
	const { error } = await supabase.rpc("admin_update_staff_account", {
		_user_id: userId,
		_email: email,
		_full_name: fullName,
		_phone: phone
	});
	if (error) fail(error);
}
async function assignRole(supabase, userId, role, customRoleId) {
	const { error } = await supabase.rpc("admin_assign_role", {
		_user_id: userId,
		_role: role,
		_custom_role_id: customRoleId
	});
	if (error) fail(error);
}
async function createStaffUser(supabase, input) {
	const { data, error } = await supabase.rpc("admin_create_staff_user", {
		_email: input.email,
		_password: input.password,
		_full_name: input.fullName,
		_phone: input.phone,
		_role: input.role,
		_custom_role_id: input.customRoleId
	});
	if (error) fail(error);
	return data;
}
async function deleteUser(supabase, userId) {
	const { error } = await supabase.rpc("admin_delete_user", { _user_id: userId });
	if (error) fail(error);
}
/** Splits a role selection that may be a system role name or a custom role UUID. */
function splitRoleSelection(role) {
	if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(role)) return {
		role: "staff",
		customRoleId: role
	};
	return {
		role: role || "staff",
		customRoleId: null
	};
}
//#endregion
export { assignRole, confirmEmail, createStaffUser, deleteUser, loadAuthEmails, loadAuthUsers, setPassword, splitRoleSelection, updateAccount };
