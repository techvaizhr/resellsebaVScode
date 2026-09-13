import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as createServerRpc } from "./createServerRpc-BQTLusYf.js";
import { t as requireSupabaseAuth } from "./auth-middleware-CuZqyT13.js";
import { assertAnyPermission } from "./admin-users.server-Cj-VRRLO.js";
//#region src/lib/agents.functions.ts?tss-serverfn-split
var listAgentCandidates_createServerFn_handler = createServerRpc({
	id: "d8978ff6672fba1f7d9bfef74a7e9a0a679ddbc8c54dad6e4c22e2039f485e49",
	name: "listAgentCandidates",
	filename: "src/lib/agents.functions.ts"
}, (opts) => listAgentCandidates.__executeServer(opts));
var listAgentCandidates = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listAgentCandidates_createServerFn_handler, async ({ context }) => {
	await assertAnyPermission(context.supabase, context.userId, ["agents.manage", "staff.manage"]);
	const db = context.supabase;
	const { data: roleRows, error } = await db.from("user_roles").select("user_id, role").in("role", ["super_admin", "staff"]);
	if (error) throw new Response(error.message, { status: 400 });
	const ids = Array.from(new Set((roleRows ?? []).map((r) => String(r.user_id))));
	if (ids.length === 0) return [];
	const { data: profiles } = await db.from("profiles").select("id, full_name").in("id", ids);
	const nameMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.full_name ?? null]));
	const { loadAuthEmails } = await import("./auth-admin.server-3mr8Ug0G.js");
	const emails = await loadAuthEmails(db);
	return ids.map((id) => ({
		user_id: id,
		email: emails[id] ?? null,
		full_name: nameMap[id] ?? null,
		role: (roleRows ?? []).find((r) => r.user_id === id)?.role ?? "staff"
	}));
});
//#endregion
export { listAgentCandidates_createServerFn_handler };
