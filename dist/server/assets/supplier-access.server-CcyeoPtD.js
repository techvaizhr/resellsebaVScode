//#region src/lib/supplier-access.server.ts
var WORDS = [
	"shop",
	"sell",
	"store",
	"order",
	"supply",
	"market"
];
/** Easy to type/read temporary password, e.g. "supply4821". */
function easyPassword() {
	return `${WORDS[Math.floor(Math.random() * WORDS.length)]}${String(Math.floor(1e3 + Math.random() * 9e3))}`;
}
/** Keeps edge-case active supplier accounts from landing on reseller onboarding. */
async function ensureActiveSupplierRole(supabase, userId) {
	let { data: supplier, error } = await supabase.from("suppliers").select("id,user_id,status,display_name").eq("user_id", userId).maybeSingle();
	if (!supplier) {
		const { data: byId } = await supabase.from("suppliers").select("id,user_id,status,display_name").eq("id", userId).maybeSingle();
		if (byId) supplier = byId;
	}
	if (error && !supplier) throw new Response(error.message, { status: 400 });
	if (!supplier) throw new Response("Supplier profile not found", { status: 404 });
	if (supplier.status !== "active") throw new Response("Only active suppliers can be opened", { status: 400 });
	const effectiveUserId = supplier.user_id || userId;
	const { error: roleError } = await supabase.from("user_roles").upsert({
		user_id: effectiveUserId,
		role: "supplier"
	}, { onConflict: "user_id,role" });
	if (roleError) throw new Response(roleError.message, { status: 400 });
	return supplier;
}
/** Opens a supplier session for the admin without changing the supplier's password. */
async function createSupplierImpersonationLogin(supabase, userId) {
	await ensureActiveSupplierRole(supabase, userId);
	const { mintImpersonationSession } = await import("./impersonation.server-B86iS3vz.js");
	return mintImpersonationSession(supabase, userId);
}
//#endregion
export { createSupplierImpersonationLogin, easyPassword };
