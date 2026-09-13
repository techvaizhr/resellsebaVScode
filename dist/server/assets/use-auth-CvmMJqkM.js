import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { d as clearToken, f as getToken, u as api } from "./client-DipTEthi.js";
import { i as setPanelBootstrapPayload, r as markPanelBootstrapPending, t as clearPanelBootstrapPayload } from "./panel-bootstrap-BcAwhCIE.js";
import { a as primeMyReseller, i as primeGlobalSettings, t as clearAppDataCache } from "./app-data-Di_u0JOy.js";
//#region src/lib/use-auth.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var listeners = /* @__PURE__ */ new Set();
var initialized = false;
var authVersion = 0;
var lastAppliedUser = null;
var authState = {
	session: null,
	user: null,
	roles: [],
	permissions: [],
	loading: true,
	accessError: false
};
function publish(next) {
	authState = next;
	listeners.forEach((listener) => listener(authState));
}
async function loadAccessOnce(userId) {
	const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 1e4));
	try {
		markPanelBootstrapPending();
		const work = api.get("/auth/bootstrap");
		const res = await Promise.race([work, timeout]);
		if (!res) {
			setPanelBootstrapPayload(null);
			console.error("Access lookup timed out");
			return {
				roles: [],
				permissions: [],
				error: true
			};
		}
		const payload = res;
		setPanelBootstrapPayload(payload);
		if (payload?.settings) primeGlobalSettings(payload.settings);
		if (payload?.reseller) primeMyReseller(userId, payload.reseller);
		return {
			roles: payload?.roles ?? [],
			permissions: payload?.permissions ?? [],
			error: false
		};
	} catch (err) {
		setPanelBootstrapPayload(null);
		console.error("Failed to load access data:", err);
		return {
			roles: [],
			permissions: [],
			error: true
		};
	}
}
var accessInflight = null;
async function loadAccess(userId) {
	if (accessInflight && accessInflight.userId === userId) return accessInflight.promise;
	const promise = (async () => {
		let last = await loadAccessOnce(userId);
		for (let attempt = 0; attempt < 2; attempt++) {
			if (!last.error && last.roles.length > 0) return last;
			await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
			const next = await loadAccessOnce(userId);
			if (!next.error && next.roles.length > 0) return next;
			if (!next.error) last = next;
		}
		return last;
	})();
	accessInflight = {
		userId,
		promise
	};
	promise.finally(() => {
		if (accessInflight?.promise === promise) accessInflight = null;
	});
	return promise;
}
async function applySession(session, opts = {}) {
	if (!session?.user) {
		clearAppDataCache();
		clearPanelBootstrapPayload();
		authVersion++;
		lastAppliedUser = null;
		publish({
			session: null,
			user: null,
			roles: [],
			permissions: [],
			loading: false,
			accessError: false
		});
		return authState;
	}
	if (authState.user?.id === session.user.id && !opts.forceAccessReload) {
		publish({
			...authState,
			session
		});
		return authState;
	}
	if (lastAppliedUser !== session.user.id) clearAppDataCache("reseller");
	lastAppliedUser = session.user.id;
	const version = ++authVersion;
	publish({
		session,
		user: session.user,
		roles: [],
		permissions: [],
		loading: true,
		accessError: false
	});
	try {
		const { roles, permissions, error } = await loadAccess(session.user.id);
		if (version !== authVersion) return authState;
		publish({
			session,
			user: session.user,
			roles,
			permissions,
			loading: false,
			accessError: error
		});
	} catch {
		if (version !== authVersion) return authState;
		publish({
			session,
			user: session.user,
			roles: [],
			permissions: [],
			loading: false,
			accessError: true
		});
	}
	return authState;
}
async function fetchCurrentUser() {
	try {
		const user = await api.get("/auth/user");
		const token = getToken();
		if (user && token) return {
			user,
			access_token: token
		};
		return null;
	} catch (error) {
		return null;
	}
}
async function initAuth() {
	if (initialized) return;
	initialized = true;
	markPanelBootstrapPending();
	if (getToken()) {
		const session = await fetchCurrentUser();
		if (session) await applySession(session);
		else {
			clearToken();
			await applySession(null);
		}
	} else await applySession(null);
}
async function refreshAuthState() {
	return applySession(await fetchCurrentUser(), { forceAccessReload: true });
}
function useAuth() {
	const [state, setState] = (0, import_react.useState)(authState);
	(0, import_react.useEffect)(() => {
		initAuth();
		listeners.add(setState);
		setState(authState);
		return () => {
			listeners.delete(setState);
		};
	}, []);
	return state;
}
function useCan() {
	const { roles, permissions } = useAuth();
	const isSuperAdmin = roles.includes("super_admin");
	return (...needed) => isSuperAdmin || needed.some((permission) => permissions.includes(permission));
}
//#endregion
export { useAuth as n, useCan as r, refreshAuthState as t };
