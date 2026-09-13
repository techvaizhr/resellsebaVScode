//#region src/lib/admin-users.server.ts
async function assertPermission(supabase, userId, permission) {
	const { data, error } = await supabase.rpc("has_permission", {
		_user_id: userId,
		_permission: permission
	});
	if (error || !data) throw new Response("Forbidden", { status: 403 });
}
async function assertAnyPermission(supabase, userId, permissions) {
	const { data, error } = await supabase.rpc("has_any_permission", {
		_user_id: userId,
		_permissions: permissions
	});
	if (error || !data) throw new Response("Forbidden", { status: 403 });
}
//#endregion
export { assertAnyPermission, assertPermission };
