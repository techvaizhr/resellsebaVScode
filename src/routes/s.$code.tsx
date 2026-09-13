import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useStoreVisitLog } from "@/lib/store-visits";
import { storeThemeStyle } from "@/lib/store-theme";
import { useStoreLoader } from "@/components/store/store-context";
import { StoreFooter, StoreHeader, FloatingQuickOrder } from "@/components/store/chrome";
import { getStoreSeo } from "@/lib/seo.functions";
import { seoLinks, seoMeta } from "@/lib/seo-meta";


export const Route = createFileRoute("/s/$code")({
  component: StoreLayout,
  loader: ({ params }) => getStoreSeo({ data: { code: params.code } }),
  head: ({ params, loaderData }) => ({
    meta: seoMeta(loaderData, {
      title: `${params.code} — Online Store`,
      description: `Shop from ${params.code} — genuine products with cash-on-delivery across Bangladesh.`,
      image: null,
      url: null,
      type: "website",
      siteName: null,
    }),
    links: seoLinks(loaderData),
  }),
});


function StoreLayout() {
  const { code } = Route.useParams();
  /** `?theme=` / `?palette=` let the reseller panel preview any combination. */
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const params = new URLSearchParams(searchStr);
  const previewTheme = params.get("theme");
  const previewPalette = params.get("palette");
  const { state, store, Provider } = useStoreLoader(code, previewTheme, previewPalette);

  /** Panel previews (?theme / ?palette) are not counted as customer visits. */
  useStoreVisitLog(code, pathname.replace(`/s/${code}`, "") || "/", Boolean(previewTheme || previewPalette));

  if (state === "loading")
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  if (state === "closed")
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold">Store temporarily unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This shop is not accepting orders right now. Please check back soon.
          </p>
        </div>
      </div>
    );

  if (state === "missing" || !store)
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold">Store not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">No active store exists for this address.</p>
        </div>
      </div>
    );

  const style = storeThemeStyle(store.theme, store.palette.id);

  return (
    <Provider value={store}>
      <div
        data-store-theme={store.theme.id}
        style={{ ...style, fontFamily: "var(--st-font-body)" }}
        className="min-h-screen bg-[var(--st-bg)] text-[var(--st-fg)] antialiased"
      >
        <StoreHeader />
        <main>
          <Outlet />
        </main>
        <StoreFooter />
        <FloatingQuickOrder />
      </div>
    </Provider>
  );
}
