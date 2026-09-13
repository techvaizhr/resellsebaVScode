import { t as useStore } from "./useStore-B1pEtgmS.js";
import { t as useRouter } from "./useRouter-D2hJ-wMP.js";
import { n as useStructuralSharing } from "./useMatch-6WhSbXQm.js";
//#region node_modules/@tanstack/react-router/dist/esm/useLocation.js
/**
* Read the current location from the router state with optional selection.
* Useful for subscribing to just the pieces of location you care about.
*
* Options:
* - `select`: Project the `location` object to a derived value
* - `structuralSharing`: Enable structural sharing for stable references
*
* @returns The current location (or selected value).
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useLocationHook
*/
function useLocation(opts) {
	const router = useRouter();
	{
		const location = router.stores.location.get();
		return opts?.select ? opts.select(location) : location;
	}
	return useStore(router.stores.location, useStructuralSharing(opts, router));
}
//#endregion
export { useLocation as t };
