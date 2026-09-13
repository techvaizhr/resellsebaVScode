//#region src/lib/panel-bootstrap.ts
var current = null;
var pending = null;
var settle = null;
/** Called when the bootstrap request starts, so other caches can wait for it. */
function markPanelBootstrapPending() {
	if (pending) return;
	pending = new Promise((resolve) => {
		settle = resolve;
	});
}
var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/** True when a signed-in session is stored, so a bootstrap call is expected. */
function hasStoredSession() {
	try {
		for (let i = 0; i < localStorage.length; i++) {
			const k = localStorage.key(i);
			if (k && k.startsWith("sb-") && k.endsWith("-auth-token")) return true;
		}
	} catch {}
	return false;
}
/**
* Waits briefly for the panel bootstrap when a session exists, so shared caches
* reuse its payload instead of firing their own duplicate query. Public pages
* (no session) return immediately.
*/
async function waitForPanelBootstrap(maxMs = 800) {
	if (current) return current;
	if (typeof window === "undefined" || !hasStoredSession()) return null;
	const deadline = Date.now() + maxMs;
	while (Date.now() < deadline) {
		if (current) return current;
		if (pending) {
			await Promise.race([pending, sleep(Math.max(deadline - Date.now(), 0))]);
			return current;
		}
		await sleep(40);
	}
	return current;
}
function finishPending() {
	settle?.();
	settle = null;
	pending = null;
}
/** Latest bootstrap payload (null before sign-in completes). */
function getPanelBootstrapPayload() {
	return current;
}
function setPanelBootstrapPayload(payload) {
	current = payload;
	finishPending();
}
function clearPanelBootstrapPayload() {
	current = null;
	finishPending();
}
//#endregion
export { waitForPanelBootstrap as a, setPanelBootstrapPayload as i, getPanelBootstrapPayload as n, markPanelBootstrapPending as r, clearPanelBootstrapPayload as t };
