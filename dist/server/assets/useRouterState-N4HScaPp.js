import { t as useStore } from "./useStore-B1pEtgmS.js";
import { t as useRouter } from "./useRouter-D2hJ-wMP.js";
import { n as useStructuralSharing } from "./useMatch-6WhSbXQm.js";
//#region node_modules/@tanstack/react-router/dist/esm/useRouterState.js
/**
* Subscribe to the router's state store with optional selection and
* structural sharing for render optimization.
*
* Options:
* - `select`: Project the full router state to a derived slice
* - `structuralSharing`: Replace-equal semantics for stable references
* - `router`: Read state from a specific router instance instead of context
*
* @returns The selected router state (or the full state by default).
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useRouterStateHook
*/
function useRouterState(opts) {
	const contextRouter = useRouter({ warn: opts?.router === void 0 });
	const router = opts?.router || contextRouter;
	{
		const state = router.stores.__store.get();
		return opts?.select ? opts.select(state) : state;
	}
	return useStore(router.stores.__store, useStructuralSharing(opts, router));
}
//#endregion
export { useRouterState as t };
