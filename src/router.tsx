import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: false, // Extra measure to prevent unexpected loops
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultViewTransition: true,
  });

  // TanStack Router v1 has an internal onFocus handler that re-evaluates beforeLoad.
  // We disable it here to prevent re-runs when switching browser tabs.
  // @ts-ignore
  router.onFocus = () => {};

  // Guarantee getMatchedRoutes always returns an object with an iterable matchedRoutes array
  const origGetMatchedRoutes = router.getMatchedRoutes?.bind(router);
  if (origGetMatchedRoutes) {
    router.getMatchedRoutes = (pathname: string) => {
      try {
        const res = origGetMatchedRoutes(pathname);
        if (Array.isArray(res)) {
          return {
            matchedRoutes: res,
            foundRoute: res[res.length - 1],
            routeParams: {},
          };
        }
        if (res) {
          if (!Array.isArray(res.matchedRoutes)) {
            res.matchedRoutes = res.matchedRoutes ? [res.matchedRoutes] : [];
          }
          if (!res.routeParams) {
            res.routeParams = {};
          }
          return res;
        }
      } catch (err) {
        console.error("Error in getMatchedRoutes wrapper:", err);
      }
      return {
        matchedRoutes: [],
        foundRoute: undefined,
        routeParams: {},
      };
    };
  }

  return router;
};

