import { f as getToken, r as supabase } from "./client-Be051lUg.js";
import { t as refreshAuthState } from "./use-auth-DJu3SP6g.js";
//#region src/lib/impersonation.ts
var KEY = "impersonation:admin-session";
var RETURN_KEY = "impersonation:return-to";
function readImpersonation() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function clearImpersonation() {
	if (typeof window !== "undefined") localStorage.removeItem(KEY);
}
function consumeImpersonationReturnTarget() {
	if (typeof window === "undefined") return null;
	const target = sessionStorage.getItem(RETURN_KEY);
	if (target) sessionStorage.removeItem(RETURN_KEY);
	return target;
}
function rememberImpersonationReturnTarget(target) {
	if (typeof window !== "undefined") sessionStorage.setItem(RETURN_KEY, target);
}
/**
* Swaps the current admin session for the target account's session, remembering
* where the admin came from. The target account's own password is untouched —
* the server hands us a ready session instead of temporary credentials.
*/
async function startImpersonation(opts) {
	const { data: current } = await supabase.auth.getSession();
	const session = current?.session;
	const currentToken = session?.access_token || getToken();
	if (!currentToken) throw new Error("Your admin session expired — sign in again.");
	const snapshot = {
		access_token: currentToken,
		refresh_token: session?.refresh_token || currentToken,
		returnTo: opts.returnTo,
		label: opts.label
	};
	localStorage.setItem(KEY, JSON.stringify(snapshot));
	const { error } = await supabase.auth.setSession({
		access_token: opts.accessToken,
		refresh_token: opts.refreshToken || opts.accessToken
	});
	if (error) {
		clearImpersonation();
		throw new Error(error.message);
	}
	await refreshAuthState();
}
/** Restores the stored admin session and returns the page the admin left. */
async function stopImpersonation() {
	const snapshot = readImpersonation();
	if (!snapshot) return "/admin";
	rememberImpersonationReturnTarget(snapshot.returnTo || "/admin");
	const { error } = await supabase.auth.setSession({
		access_token: snapshot.access_token,
		refresh_token: snapshot.refresh_token
	});
	clearImpersonation();
	if (error) throw new Error(error.message);
	await refreshAuthState();
	return snapshot.returnTo || "/admin";
}
//#endregion
export { startImpersonation as a, rememberImpersonationReturnTarget as i, consumeImpersonationReturnTarget as n, stopImpersonation as o, readImpersonation as r, clearImpersonation as t };
