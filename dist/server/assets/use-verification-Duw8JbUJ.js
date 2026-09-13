import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { r as supabase } from "./client-CI2ZnE4F.js";
import { n as getPanelBootstrapPayload } from "./panel-bootstrap-BcAwhCIE.js";
import { a as pendingChannels, o as useAdvancedSettings } from "./advanced-settings-_gzo5-LS.js";
import { n as useAuth } from "./use-auth-CygHuric.js";
//#region src/lib/use-verification.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var EMPTY = {
	emailVerified: false,
	phoneVerified: false,
	emailSentAt: null,
	smsSentAt: null
};
/** Shared per-user lookup so several mounted screens cost one call, not one each. */
var cached = null;
function fetchVerifyState(userId, force = false) {
	if (!force && cached && cached.userId === userId) return cached.promise;
	const promise = (async () => {
		const primed = force ? null : getPanelBootstrapPayload()?.verify;
		const { data } = primed ? { data: primed } : await supabase.rpc("verify_state");
		const row = Array.isArray(data) ? data[0] : data;
		return {
			emailVerified: Boolean(row?.email_verified_at),
			phoneVerified: Boolean(row?.phone_verified_at),
			emailSentAt: row?.email_sent_at ?? null,
			smsSentAt: row?.sms_sent_at ?? null
		};
	})().catch((e) => {
		if (cached?.promise === promise) cached = null;
		throw e;
	});
	cached = {
		userId,
		promise
	};
	return promise;
}
/**
* Verification gate for reseller-side screens.
* Admin / staff accounts are never blocked.
*/
function useVerification() {
	const { settings, loading: settingsLoading } = useAdvancedSettings();
	const { user, roles, loading: authLoading } = useAuth();
	const [state, setState] = (0, import_react.useState)(EMPTY);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const isStaff = roles.includes("super_admin") || roles.includes("staff");
	const refresh = (0, import_react.useCallback)(async (force = true) => {
		if (!user) return;
		setState(await fetchVerifyState(user.id, force));
		setLoading(false);
	}, [user]);
	(0, import_react.useEffect)(() => {
		if (authLoading) return;
		if (!user || isStaff) {
			setLoading(false);
			return;
		}
		refresh(false);
	}, [
		authLoading,
		user,
		isStaff,
		refresh
	]);
	const pending = roles.includes("super_admin") || roles.includes("staff") ? [] : pendingChannels(settings, state);
	return {
		settings,
		state,
		pending,
		refresh,
		/** true while we still don't know whether the user must verify */
		loading: loading || settingsLoading || authLoading,
		required: pending.length > 0
	};
}
//#endregion
export { useVerification as t };
