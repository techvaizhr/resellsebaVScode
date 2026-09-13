//#region src/lib/reseller-access.server.ts
var WORDS = [
	"shop",
	"sell",
	"store",
	"order",
	"reseller",
	"market"
];
/** Easy to type/read temporary password, e.g. "shop4821". */
function easyPassword() {
	return `${WORDS[Math.floor(Math.random() * WORDS.length)]}${String(Math.floor(1e3 + Math.random() * 9e3))}`;
}
/** Keeps legacy/edge-case active reseller accounts from landing on onboarding. */
async function ensureActiveResellerRole(supabase, userId) {
	let { data: reseller, error: resellerError } = await supabase.from("resellers").select("id,user_id,status,business_name").eq("user_id", userId).maybeSingle();
	if (!reseller) {
		const { data: byId } = await supabase.from("resellers").select("id,user_id,status,business_name").eq("id", userId).maybeSingle();
		if (byId) reseller = byId;
	}
	if (resellerError && !reseller) throw new Response(resellerError.message, { status: 400 });
	if (!reseller) throw new Response("Reseller profile not found", { status: 404 });
	if (reseller.status !== "active") throw new Response("Only active resellers can be opened", { status: 400 });
	const effectiveUserId = reseller.user_id || userId;
	const { error } = await supabase.from("user_roles").upsert({
		user_id: effectiveUserId,
		role: "reseller"
	}, { onConflict: "user_id,role" });
	if (error) throw new Response(error.message, { status: 400 });
	return reseller;
}
/** Opens a reseller session for the admin without changing the reseller's password. */
async function createImpersonationLogin(supabase, userId) {
	await ensureActiveResellerRole(supabase, userId);
	const { mintImpersonationSession } = await import("./impersonation.server-GYkDm_wD.js");
	return mintImpersonationSession(supabase, userId);
}
//#endregion
export { createImpersonationLogin, easyPassword };
