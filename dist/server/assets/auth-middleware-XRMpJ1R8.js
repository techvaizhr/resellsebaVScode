import { t as getRequest } from "./request-response-sNnPQJu-.js";
import { t as createMiddleware } from "./createMiddleware-B_4t7rW1.js";
import { n as db } from "./client-DipTEthi.js";
var requireSupabaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const authHeader = getRequest()?.headers?.get("authorization");
	let userId = "";
	if (authHeader && authHeader.startsWith("Bearer ")) {
		const token = authHeader.replace("Bearer ", "");
		try {
			if (token.startsWith("local-sanctum-token-")) {
				const payload = JSON.parse(atob(token.replace("local-sanctum-token-", "")));
				userId = payload.id || payload.sub || payload.user_id || payload.reseller?.id || "";
			} else {
				const parts = token.split(".");
				if (parts.length === 3) {
					const payload = JSON.parse(atob(parts[1]));
					userId = payload.sub || payload.id || "";
				}
			}
		} catch {}
	}
	return next({ context: {
		db,
		supabase: db,
		userId: userId || "authenticated-user",
		claims: { sub: userId }
	} });
});
//#endregion
export { requireSupabaseAuth as t };
