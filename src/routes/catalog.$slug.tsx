import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getCatalogProduct } from "@/lib/catalog.functions";
import { getCatalogProductSeo } from "@/lib/seo.functions";
import { seoLinks, seoMeta } from "@/lib/seo-meta";
import { CopyBtn, useCatalogPrices } from "@/components/catalog/shell";
import { ImagePickerButton } from "@/components/catalog/image-picker";
import { bdt } from "@/lib/finance-report";
import { areaLabel } from "@/lib/delivery";
import { ArrowLeft, Loader2, Truck } from "lucide-react";


export const Route = createFileRoute("/catalog/$slug")({
  loader: ({ params }) => getCatalogProductSeo({ data: { slug: params.slug } }),
  head: ({ params, loaderData }) => {
    const rawSlugTitle = params.slug.replace(/-/g, " ");
    const defaultTitle = `${rawSlugTitle.charAt(0).toUpperCase() + rawSlugTitle.slice(1)} — Master Catalog`;
    const title = loaderData?.title && !loaderData.title.startsWith("Product not found")
      ? loaderData.title
      : defaultTitle;
    return {
      meta: seoMeta(
        loaderData
          ? {
              ...loaderData,
              title,
            }
          : null,
        {
          title,
          description: `${rawSlugTitle} — images, description, and resell price.`,
          image: null,
          url: null,
          type: "product",
          siteName: "ResellSeba",
        },
      ),
      links: seoLinks(loaderData),
    };
  },
  component: CatalogDetails,
});


type P = Awaited<ReturnType<typeof getCatalogProduct>>;

function CatalogDetails() {
  const { slug } = Route.useParams();
  const fetchProduct = useServerFn(getCatalogProduct);
  const [p, setP] = useState<P>(null);
  const [state, setState] = useState<"loading" | "done">("loading");
  const [idx, setIdx] = useState(0);
  // Price/profit/delivery shown only when logged in as admin/staff/reseller/leader.
  const showPrices = useCatalogPrices();

  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setState("loading");
    setLoadError(null);
    fetchProduct({ data: { slug } })
      .then((d) => {
        if (mounted) {
          setP(d as P);
          setIdx(0);
          setState("done");
        }
      })
      .catch((err: any) => {
        if (mounted) {
          console.error("Product load error from live database:", err);
          setLoadError(err?.message || "Failed to load product from live database.");
          setState("done");
        }
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (state === "loading")
    return (
      <div className="grid place-items-center py-28">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  if (loadError)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20 text-destructive text-xl">
            ⚠️
          </div>
          <h2 className="text-lg font-bold text-destructive">ডাটাবেজ কানেকশন এরর</h2>
          <p className="mt-2 text-xs text-muted-foreground">{loadError}</p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center rounded-xl bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90"
            >
              পুনরায় চেষ্টা করুন (Reload)
            </button>
            <Link to="/catalog" search={{}} className="text-xs font-semibold text-primary hover:underline">
              ← Back to catalog
            </Link>
          </div>
        </div>
      </div>
    );

  if (!p)
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The requested product could not be found in the live catalog.</p>
        <Link to="/catalog" search={{}} className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
          ← Back to catalog
        </Link>
      </div>
    );

  const detailText = [
    p.name,
    p.short,
    p.description?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    showPrices ? `Price: ${bdt(p.price)}` : "",
    `Code: #${p.code}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        to="/catalog"
        search={p.categorySlug ? { category: p.categorySlug } : {}}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Catalog
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="surface-card aspect-square overflow-hidden">
            {p.images[idx] ? (
              <img src={p.images[idx]} alt={p.name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">No image</div>
            )}
          </div>
          {p.images.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {p.images.map((u, i) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${i === idx ? "border-primary" : "border-transparent"}`}
                >
                  <img src={u} alt={`${p.name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="rounded-full bg-muted px-2.5 py-1">#{p.code}</span>
            {p.category && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{p.category}</span>}
            {p.brand && <span className="rounded-full bg-accent/15 px-2.5 py-1">{p.brand}</span>}
            <span className={`rounded-full px-2.5 py-1 ${p.stock > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
              {p.stock > 0 ? `Stock ${p.stock}` : "Stock out"}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">{p.name}</h1>
          {p.short && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.short}</p>}

          {showPrices ? (
            <>
          <div className="surface-card mt-6 flex flex-wrap items-end gap-6 p-5">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sale price (suggested)</div>
              <div className="text-3xl font-black text-primary">{bdt(p.price)}</div>
            </div>
            {showPrices && (
              <>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Wholesale price</div>
                  <div className="text-xl font-black">{bdt(p.resellerPrice)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Your profit</div>
                  <div className="text-xl font-black text-emerald-600">{bdt(Math.max(0, p.price - p.resellerPrice))}</div>
                </div>
              </>
            )}
            {p.weight ? (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Weight</div>
                <div className="text-base font-bold">{p.weight} g</div>
              </div>
            ) : null}
          </div>

          <div className="surface-card mt-4 p-5">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Truck className="h-4 w-4 text-primary" /> Delivery charge
            </div>
            <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {p.deliveryMode === "free" ? (
                <span className="font-semibold text-emerald-600">Free delivery</span>
              ) : p.deliveryMode === "flat" || p.deliveryMode === "custom" ? (
                <span>{p.deliveryMode === "flat" ? "Flat" : "Custom"}: {bdt(p.deliveryFlat)}</span>
              ) : (
                <>
                  <span>{areaLabel("inside_dhaka")}: {bdt(p.deliveryInside)}</span>
                  <span>{areaLabel("sub_dhaka")}: {bdt(p.deliverySub)}</span>
                  <span>{areaLabel("outside_dhaka")}: {bdt(p.deliveryOutside)}</span>
                </>
              )}
            </div>
          </div>
            </>
          ) : (
            <div className="surface-card mt-6 p-5">
              <p className="text-sm font-semibold">Log in to see prices and delivery charges</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in with a reseller account to see the admin price, sale price, profit, and delivery charge.
              </p>
              <Link
                to="/login"
                search={{ mode: "signup" }}
                className="btn-brand mt-4 inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold"
              >
                Reseller signup / login
              </Link>
            </div>
          )}

          <div className="surface-card mt-5 p-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Reseller tools</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyBtn text={p.name} title="Title" label="Title copied" />
              <CopyBtn text={detailText} title="Details" label="Details copied" />
              <ImagePickerButton images={p.images} baseName={p.name} />
            </div>
          </div>

          <div className="surface-card mt-6 p-5 text-sm">
            <p className="font-semibold">Want to sell this product?</p>
            <p className="mt-1 text-muted-foreground">Sign up as a reseller and list it in your own store.</p>
            <Link
              to="/login"
              search={{ mode: "signup" }}
              className="btn-brand mt-4 inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold"
            >
              Reseller signup
            </Link>
          </div>
        </div>
      </div>

      {p.description && (
        <section className="mt-10 lg:mt-14">
          <h2 className="text-lg font-bold">Product details</h2>
          <div
            className="prose prose-sm mt-4 max-w-none text-sm leading-relaxed text-foreground/90 [&_img]:rounded-lg"
            dangerouslySetInnerHTML={{ __html: p.description }}
          />
        </section>
      )}
    </div>
  );
}
