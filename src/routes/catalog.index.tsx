import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getCatalog } from "@/lib/catalog.functions";
import { CopyBtn, useCatalogBrand, useCatalogPrices } from "@/components/catalog/shell";
import { ImagePickerButton } from "@/components/catalog/image-picker";
import { ProductCodeChip } from "@/components/product-code";
import { bdt } from "@/lib/finance-report";
import { Pagination, usePaginated } from "@/components/data-list";
import { Boxes, ChevronDown, Layers, Loader2, Search, Sparkles, Tag } from "lucide-react";
import { getSiteSeo } from "@/lib/seo.functions";
import { seoLinks, seoMeta } from "@/lib/seo-meta";

import { supabase } from "@/integrations/laravel/client";

type Search = { category?: string; brand?: string; q?: string; page?: number; sort?: string };

export const Route = createFileRoute("/catalog/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: typeof s.category === "string" && s.category ? s.category : undefined,
    brand: typeof s.brand === "string" && s.brand ? s.brand : undefined,
    q: typeof s.q === "string" && s.q ? s.q : undefined,
    page: typeof s.page === "number" && s.page > 1 ? s.page : undefined,
    sort: s.sort === "oldest" ? "oldest" : undefined,
  }),
  loader: () => getSiteSeo({ data: { path: "/catalog" } }),
  head: ({ loaderData }) => {
    const site = loaderData?.siteName ?? "Master Catalog";
    return {
      meta: seoMeta(
        loaderData
          ? {
              ...loaderData,
              title: `Master Catalog — ${site}`,
              description:
                "Complete product catalog by category — with images, descriptions, and resell prices.",
            }
          : null,
        {
          title: "Master Catalog — All products in one place",
          description:
            "Complete product catalog by category — with images, descriptions, and resell prices.",
          image: null,
          url: null,
          type: "website",
          siteName: null,
        },
      ),
      links: seoLinks(loaderData),
    };
  },
  component: CatalogIndex,
});

type Prod = {
  id: string;
  name: string;
  slug: string;
  code: string;
  short: string;
  price: number;
  resellerPrice: number;
  categoryId: string | null;
  brandId: string | null;
  createdAt: string | null;
  image: string | null;
  images: string[];
};

type Cat = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  count: number;
};

function CatalogIndex() {
  const { category, brand, q, page, sort } = Route.useSearch();
  const { banner, siteName, logoUrl } = useCatalogBrand();
  const navigate = useNavigate();
  const fetchCatalog = useServerFn(getCatalog);
  const [data, setData] = useState<{
    categories: Cat[];
    brands: { id: string; name: string; slug: string }[];
    products: Prod[];
  }>({
    categories: [],
    brands: [],
    products: [],
  });
  const [term, setTerm] = useState(q ?? "");
  const [showSuggest, setShowSuggest] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  // Price/profit shown only when logged in as admin/staff/reseller/leader.
  const showPrices = useCatalogPrices();
  const perPage = 100;
  const currentPage = page ?? 1;

  useEffect(() => {
    let mounted = true;
    fetchCatalog()
      .then((d) => {
        if (mounted && d) setData(d as never);
      })
      .catch(async () => {
        try {
          const { data: res } = await supabase.rpc("reseller_catalog_page");
          if (mounted && res) {
            const prods = ((res as any).products ?? []).filter((p: any) => p.is_active !== false);
            const cats = ((res as any).categories ?? []).filter((c: any) => c.is_active !== false);
            const brands = ((res as any).brands ?? []).filter((b: any) => b.is_active !== false);
            setData({
              categories: cats.map((c: any) => ({
                ...c,
                count: prods.filter((p: any) => p.category_id === c.id).length,
              })),
              brands,
              products: prods.map((p: any) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                code: p.product_code || "",
                short: p.short_description || "",
                price: Number(p.suggested_price ?? 0),
                resellerPrice: Number(p.reseller_price ?? 0),
                categoryId: p.category_id,
                brandId: p.brand_id,
                createdAt: p.created_at || null,
                image: p.main_image || p.image_url || p.og_image_url || null,
                images: p.product_images?.map((i: any) => i.url) || (p.main_image ? [p.main_image] : []),
              })),
            });
          }
        } catch {}
      });
    return () => {
      mounted = false;
    };
  }, []);

  const activeCat = data?.categories.find((c) => c.slug === category) ?? null;
  const activeBrand = data?.brands.find((b) => b.slug === brand) ?? null;

  const rows = useMemo(() => {
    let list = data?.products ?? [];
    if (activeCat) list = list.filter((p) => p.categoryId === activeCat.id);
    if (activeBrand) list = list.filter((p) => p.brandId === activeBrand.id);
    const t = (q ?? "").trim().toLowerCase();
    if (t) list = list.filter((p) => p.name.toLowerCase().includes(t) || p.code.includes(t));
    if (sort === "oldest")
      list = [...list].sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""));
    return list;
  }, [data, activeCat, activeBrand, q, sort]);

  const searchSuggestions = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t || !data) return [];
    return data.products
      .filter((p) => p.name.toLowerCase().includes(t) || p.code.toLowerCase().includes(t))
      .slice(0, 6);
  }, [term, data]);

  const pagedRows = usePaginated(rows, currentPage, perPage);

  const setPage = (p: number) =>
    void navigate({
      to: "/catalog",
      search: { category, brand, q, sort, page: p > 1 ? p : undefined },
    });

  return (
    <div>
      <section className="relative isolate border-b border-border/60">
        {banner ? (
          <div className="pointer-events-none absolute inset-0 z-0">
            <img src={banner} alt="" aria-hidden className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65" />
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        )}
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur ${
              banner
                ? "border-white/30 bg-white/15 text-white"
                : "border-primary/25 bg-primary/10 text-primary"
            }`}
          >
            <Sparkles className="h-3 w-3" /> Master Catalog
          </span>
          <h1
            className={`mt-4 text-balance text-3xl font-extrabold tracking-tight sm:text-5xl ${banner ? "text-white" : ""}`}
            style={banner ? { textShadow: "0 2px 20px rgba(0,0,0,.55)" } : undefined}
          >
            {activeCat ? activeCat.name : `${siteName} Product Catalog`}
          </h1>
          <p
            className={`mx-auto mt-3 max-w-xl text-sm sm:text-base ${banner ? "text-white/90" : "text-muted-foreground"}`}
          >
            {activeCat
              ? `${rows.length} products in this category`
              : "See images, descriptions, and resell prices — get the full picture before you list."}
          </p>

          <form
            className="relative mx-auto mt-7 max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              setShowSuggest(false);
              void navigate({
                to: "/catalog",
                search: { category, brand, q: term.trim() || undefined, sort, page: undefined },
              });
            }}
          >
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value);
                    setShowSuggest(true);
                  }}
                  onFocus={() => term.trim() && setShowSuggest(true)}
                  onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
                  placeholder="Search products…"
                  aria-label="Search products"
                  autoComplete="off"
                  className="w-full rounded-xl border bg-card/95 py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <button
                type="submit"
                className="btn-brand rounded-xl px-4 py-2.5 text-sm font-semibold"
              >
                Search
              </button>
            </div>

            {showSuggest && term.trim() && (
              <div className="absolute inset-x-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border bg-card text-left shadow-elegant">
                {searchSuggestions.length === 0 ? (
                  <div className="px-4 py-4 text-center text-xs text-muted-foreground">
                    No matching products
                  </div>
                ) : (
                  searchSuggestions.map((p) => (
                    <Link
                      key={p.id}
                      to="/catalog/$slug"
                      params={{ slug: p.slug }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowSuggest(false)}
                      className="flex items-center gap-3 border-b px-3 py-2.5 text-sm last:border-b-0 hover:bg-accent"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border bg-muted">
                        {p.image ? (
                          <img src={p.image} alt="" className="h-full w-full object-cover" />
                        ) : logoUrl ? (
                          <img src={logoUrl} alt="" className="h-6 w-6 object-contain opacity-60" />
                        ) : (
                          <Boxes className="h-4 w-4 text-muted-foreground" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-foreground">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground">{p.code}</div>
                      </div>
                    </Link>
                  ))
                )}
                {searchSuggestions.length > 0 && (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setShowSuggest(false);
                      void navigate({
                        to: "/catalog",
                        search: {
                          category,
                          brand,
                          q: term.trim() || undefined,
                          sort,
                          page: undefined,
                        },
                      });
                    }}
                    className="block w-full px-3 py-2.5 text-center text-xs font-semibold text-primary hover:bg-accent"
                  >
                    See all results for "{term.trim()}"
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </section>

      {!data ? (
        <div className="grid place-items-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat
                icon={<Boxes className="h-4 w-4" />}
                label="Products"
                value={data.products.length}
              />
              <Stat
                icon={<Layers className="h-4 w-4" />}
                label="Categories"
                value={data.categories.length}
              />
              <Stat icon={<Tag className="h-4 w-4" />} label="Brands" value={data.brands.length} />
              <Stat icon={<Sparkles className="h-4 w-4" />} label="Showing" value={rows.length} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Link
                to="/catalog"
                search={{ category, brand, q, sort: undefined, page: undefined }}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  !sort
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:border-primary/50"
                }`}
              >
                Newest
              </Link>
              <Link
                to="/catalog"
                search={{ category, brand, q, sort: "oldest", page: undefined }}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  sort === "oldest"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:border-primary/50"
                }`}
              >
                Oldest
              </Link>
            </div>

            <div className="surface-card mt-4 p-4">
              <button
                type="button"
                onClick={() => setCatOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-2"
              >
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" /> Categories
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground">
                    {data.categories.length}
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${catOpen ? "rotate-180" : ""}`}
                />
              </button>

              {catOpen && (
                <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                  <Link
                    to="/catalog"
                    search={{ sort, page: undefined }}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      !category
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:border-primary/50"
                    }`}
                  >
                    All ({data.products.length})
                  </Link>
                  {data.categories.map((c) => (
                    <Link
                      key={c.id}
                      to="/catalog"
                      search={{ category: c.slug, sort, page: undefined }}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        category === c.slug
                          ? "border-primary bg-primary text-primary-foreground"
                          : "hover:border-primary/50"
                      }`}
                    >
                      {c.name} ({c.count})
                    </Link>
                  ))}
                </div>
              )}

              {!catOpen && activeCat && (
                <div className="mt-3 border-t pt-3">
                  <span className="rounded-full border border-primary bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                    {activeCat.name} ({activeCat.count})
                  </span>
                </div>
              )}
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            {rows.length === 0 ? (
              <div className="surface-card grid place-items-center p-16 text-center text-sm text-muted-foreground">
                No products found.
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {pagedRows.map((p) => (
                    <div key={p.id} className="group surface-card flex flex-col overflow-hidden">
                      <Link
                        to="/catalog/$slug"
                        params={{ slug: p.slug }}
                        className="relative block aspect-square overflow-hidden bg-muted"
                      >
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex items-center justify-between gap-2">
                          <ProductCodeChip code={p.code} />
                          <Link
                            to="/catalog/$slug"
                            params={{ slug: p.slug }}
                            className="rounded-lg border px-2.5 py-1 text-[11px] font-semibold hover:border-primary/50 hover:text-primary"
                          >
                            Details
                          </Link>
                        </div>
                        <Link
                          to="/catalog/$slug"
                          params={{ slug: p.slug }}
                          className="mt-2 line-clamp-2 text-sm font-bold leading-tight hover:text-primary"
                        >
                          {p.name}
                        </Link>
                        {showPrices ? (
                          <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border bg-muted/40 p-2.5 text-[11px]">
                            <div>
                              <div className="font-bold uppercase tracking-wide text-muted-foreground">
                                Wholesale
                              </div>
                              <div className="text-sm font-bold">{bdt(p.resellerPrice)}</div>
                            </div>
                            <div>
                              <div className="font-bold uppercase tracking-wide text-muted-foreground">
                                Sale
                              </div>
                              <div className="text-sm font-black text-primary">{bdt(p.price)}</div>
                            </div>
                            <div>
                              <div className="font-bold uppercase tracking-wide text-muted-foreground">
                                Profit
                              </div>
                              <div className="text-sm font-bold text-emerald-600">
                                {bdt(Math.max(0, p.price - p.resellerPrice))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 rounded-xl border border-dashed bg-muted/30 p-2.5 text-[11px] font-semibold text-muted-foreground">
                            Log in as a reseller to see prices
                          </div>
                        )}
                        <div className="mt-3 flex flex-wrap gap-1.5 border-t pt-3">
                          <CopyBtn text={p.name} title="Title" label="Title copied" />
                          <CopyBtn
                            text={
                              showPrices
                                ? `${p.name}\n\n${p.short}\n\nPrice: ${bdt(p.price)}`
                                : `${p.name}\n\n${p.short}`
                            }
                            title="Details"
                            label="Details copied"
                          />
                          <ImagePickerButton
                            images={p.images ?? (p.image ? [p.image] : [])}
                            baseName={p.name}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  page={currentPage}
                  perPage={perPage}
                  total={rows.length}
                  onPage={setPage}
                />
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="surface-card flex items-center gap-3 p-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-lg font-black leading-none">{value}</div>
        <div className="truncate text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
}
