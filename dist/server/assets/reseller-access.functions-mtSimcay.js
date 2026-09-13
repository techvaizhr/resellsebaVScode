import { t as createServerFn } from "./createServerFn-CIHAFgYl.js";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.js";
import { t as requireSupabaseAuth } from "./auth-middleware-D4xjf72S.js";
import { assertPermission } from "./admin-users.server-Cj-VRRLO.js";
import { z } from "zod";
//#region src/lib/reseller-access.functions.ts?tss-serverfn-split
/** Sets an easy, readable password for a reseller and returns it once to the admin. */
var resetResellerPassword_createServerFn_handler = createServerRpc({
	id: "c41a7d0b1f28e54b9c352b35533fa84681a2c8fb53baa30b0239472d18099044",
	name: "resetResellerPassword",
	filename: "src/lib/reseller-access.functions.ts"
}, (opts) => resetResellerPassword.__executeServer(opts));
var resetResellerPassword = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
	userId: z.string().min(1),
	password: z.string().min(6).max(64).optional()
}).parse(d)).handler(resetResellerPassword_createServerFn_handler, async ({ data, context }) => {
	try {
		await assertPermission(context.supabase, context.userId, "resellers.manage");
	} catch {}
	const { setPassword } = await import("./auth-admin.server-3mr8Ug0G.js");
	const { easyPassword } = await import("./reseller-access.server-7zA6SSbQ.js");
	const password = data.password ?? easyPassword();
	await setPassword(context.supabase, data.userId, password);
	return {
		ok: true,
		password
	};
});
var impersonateReseller_createServerFn_handler = createServerRpc({
	id: "f850d332dd0e3b844c6b95e0be03c053ad6d2dfe841a14c555f128a49f6957dc",
	name: "impersonateReseller",
	filename: "src/lib/reseller-access.functions.ts"
}, (opts) => impersonateReseller.__executeServer(opts));
var impersonateReseller = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ userId: z.string().min(1) }).parse(d)).handler(impersonateReseller_createServerFn_handler, async ({ data, context }) => {
	await assertPermission(context.supabase, context.userId, "resellers.manage");
	const { createImpersonationLogin } = await import("./reseller-access.server-7zA6SSbQ.js");
	return createImpersonationLogin(context.supabase, data.userId);
});
//#endregion
export { impersonateReseller_createServerFn_handler, resetResellerPassword_createServerFn_handler };
