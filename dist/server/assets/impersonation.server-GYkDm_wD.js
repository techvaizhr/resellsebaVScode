import { r as supabase } from "./client-fziyWHNw.js";
//#region src/lib/impersonation.server.ts
async function mintImpersonationSession(supabaseClient, userId) {
	const client = supabaseClient || supabase;
	const password = `imp-${crypto.randomUUID()}-${crypto.randomUUID()}`;
	const { data, error } = await client.rpc("admin_impersonation_begin", {
		_user_id: userId,
		_password: password
	});
	if (error) {
		const message = error.message?.replace(/^.*?(?:ERROR|error):\s*/i, "") || "Could not open that account";
		throw new Response(message, { status: /forbidden|not signed in/i.test(message) ? 403 : 400 });
	}
	const row = Array.isArray(data) ? data[0] : data;
	const directToken = row?.accessToken || row?.token || row?.access_token;
	if (directToken) return {
		ok: true,
		email: row?.email || "",
		accessToken: directToken,
		refreshToken: row?.refreshToken || row?.refresh_token || directToken,
		user: row?.user || null
	};
	try {
		const { data: signIn, error: signInError } = await client.auth.signInWithPassword({
			email: row?.email,
			password
		});
		if (signInError || !signIn?.session?.access_token) throw new Response(signInError?.message || "Could not open that account", { status: 400 });
		return {
			ok: true,
			email: row.email,
			accessToken: signIn.session.access_token,
			refreshToken: signIn.session.refresh_token || signIn.session.access_token,
			user: signIn.user
		};
	} finally {
		try {
			await client.rpc("admin_impersonation_finish", {
				_user_id: userId,
				_prev_hash: row?.prev_hash ?? null
			});
		} catch (err) {
			console.error("[impersonation] failed to restore password hash", err);
		}
	}
}
//#endregion
export { mintImpersonationSession };
