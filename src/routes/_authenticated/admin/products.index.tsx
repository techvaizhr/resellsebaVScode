import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/laravel/client";
import { PageHeader, EmptyState } from "@/components/ui-kit";
import {
  Plus,
  Loader2,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  CheckSquare,
  Square,
  Copy,
  Download,
  CloudDownload,
  Lock,
  Unlock,
} from "lucide-react";
import { toast } from "sonner";
import {
  DataToolbar,
  Pagination,
  ActionMenu,
  usePaginated,
  type FilterDef,
} from "@/components/data-list";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CopyButton, ImageDownloadTools, stripHtml } from "@/components/store/reseller-tools";
import { ProductImportModal } from "@/components/ProductImportModal";
import { confirmAction } from "@/lib/confirm";
import { Truck } from "lucide-react";
import { APPROVAL_TONE, reviewProduct, setProductSupplier } from "@/lib/supplier";
import { AppModal } from "@/components/ui-kit/AppModal";
import { PendingChangesModal } from "@/components/PendingChangesModal";
import { useCan } from "@/lib/use-auth";
import { BulkValuePanel, computeBulkPatch } from "@/components/bulk-value-panel";
import { useAdvancedSettings } from "@/lib/advanced-settings";
import { deliveryLabel } from "@/lib/delivery";

type Row = {
  id: string;
  product_code: string;
  name: string;
  buying_price: number;
  reseller_price: number;
  suggested_price: number;
  packaging_cost: number;
  stock: number;
  weight_grams: number | null;
  is_active: boolean;
  is_featured: boolean;
  og_image_url: string | null;
  brand_id: string | null;
  category_id: string | null;
  supplier_id: string | null;
  supplier_price: number | null;
  approval_status: "approved" | "pending" | "rejected";
  approval_note: string | null;
  pending_changes: Record<string, unknown> | null;
  created_at?: string | null;
  delivery_mode?: string | null;
  delivery_flat?: number | null;
  delivery_inside?: number | null;
  delivery_outside?: number | null;
  delivery_sub?: number | null;
};

type SupplierOpt = { id: string; name: string; display_name?: string; code: string; status: string };

type Opt = { id: string; name: string };

type ProductSearch = {
  status?: string;
  stock?: string;
  category?: string;
  brand?: string;
  supplier?: string;
  approval?: string;
  /** product id to re-fetch on return (or "all" to reload everything) */
  refresh?: string;
};

const PRODUCT_COLS =
  "id,product_code,name,buying_price,reseller_price,suggested_price,packaging_cost,stock,weight_grams,is_active,is_featured,og_image_url,brand_id,category_id,supplier_id,supplier_price,approval_status,approval_note,pending_changes,delivery_mode,delivery_flat,delivery_inside,delivery_outside,delivery_sub";

/** Keeps the list alive across navigation so editing one product never reloads the page. */
let catalogCache: {
  products: Row[];
  brands: Opt[];
  categories: Opt[];
  suppliers: SupplierOpt[];
} | null = null;

/** Filters / paging survive a trip to the edit page and back. */
type ListState = {
  q: string;
  brand: string;
  category: string;
  status: string;
  stockFilter: string;
  supplierFilter: string;
  sort: string;
  perPage: number;
  page: number;
};
let listStateCache: ListState | null = null;

export const Route = createFileRoute("/_authenticated/admin/products/")({
  validateSearch: (s: Record<string, unknown>): ProductSearch => ({
    status: typeof s.status === "string" ? s.status : undefined,
    stock: typeof s.stock === "string" ? s.stock : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    brand: typeof s.brand === "string" ? s.brand : undefined,
    supplier: typeof s.supplier === "string" ? s.supplier : undefined,
    approval: typeof s.approval === "string" ? s.approval : undefined,
    refresh: typeof s.refresh === "string" ? s.refresh : undefined,
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const nav = useNavigate();
  const search = Route.useSearch();
  const can = useCan();
  const canManage = can("products.manage");
  const canDelete = can("products.delete");
  const { settings } = useAdvancedSettings();
  const [items, setItems] = useState<Row[]>(catalogCache?.products ?? []);
  const [brands, setBrands] = useState<Opt[]>(catalogCache?.brands ?? []);
  const [categories, setCategories] = useState<Opt[]>(catalogCache?.categories ?? []);
  const [suppliers, setSuppliers] = useState<SupplierOpt[]>(catalogCache?.suppliers ?? []);
  const [assignFor, setAssignFor] = useState<Row | null>(null);
  const [loading, setLoading] = useState(!catalogCache);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [inlineEdit, setInlineEdit] = useState(false);
  const [reviewFor, setReviewFor] = useState<Row | null>(null);

  // A link that carries filters in the URL wins; otherwise restore the last state.
  const fromUrl = Boolean(
    search.brand ||
    search.category ||
    search.status ||
    search.approval ||
    search.stock ||
    search.supplier,
  );
  const restored = !fromUrl ? listStateCache : null;

  const [q, setQ] = useState(restored?.q ?? "");
  const [brand, setBrand] = useState(restored?.brand ?? search.brand ?? "");
  const [category, setCategory] = useState(restored?.category ?? search.category ?? "");
  const [status, setStatus] = useState(restored?.status ?? search.status ?? search.approval ?? "");
  const [stockFilter, setStockFilter] = useState(restored?.stockFilter ?? search.stock ?? "");
  const [supplierFilter, setSupplierFilter] = useState(
    restored?.supplierFilter ?? search.supplier ?? "",
  );
  const [sort, setSort] = useState(restored?.sort ?? "");

  const [perPage, setPerPage] = useState(restored?.perPage ?? 20);
  const [page, setPage] = useState(restored?.page ?? 1);

  async function load() {
    setLoading(true);
    // One backend call carries products, brands and categories.
    const { data } = await supabase.rpc("admin_catalog_page");
    const pl = (data ?? {}) as any;
    setItems((pl.products ?? []) as Row[]);
    setBrands((pl.brands ?? []) as Opt[]);
    setCategories((pl.categories ?? []) as Opt[]);
    setSuppliers((pl.suppliers ?? []) as SupplierOpt[]);
    catalogCache = {
      products: (pl.products ?? []) as Row[],
      brands: (pl.brands ?? []) as Opt[],
      categories: (pl.categories ?? []) as Opt[],
      suppliers: (pl.suppliers ?? []) as SupplierOpt[],
    };
    setLoading(false);
  }

  /** Re-fetch a single row (or drop it when deleted) — no full page reload. */
  async function refreshOne(id: string) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    setItems((s) => {
      if (!data) return s.filter((i) => i.id !== id);
      const row = data as unknown as Row;
      return s.some((i) => i.id === id)
        ? s.map((i) => (i.id === id ? { ...i, ...row } : i))
        : [row, ...s];
    });
  }

  const didLoad = useRef(false);
  useEffect(() => {
    if (!catalogCache || !didLoad.current) {
      didLoad.current = true;
      load();
    } else if (search.refresh === "all") {
      load();
    } else if (search.refresh) {
      refreshOne(search.refresh);
    }
    if (search.refresh) {
      void nav({ to: "/admin/products", search: { ...search, refresh: undefined }, replace: true });
    }
  }, [search.refresh]);

  // Keep the cache in sync with any inline/optimistic change.
  useEffect(() => {
    if (catalogCache) catalogCache.products = items;
  }, [items]);

  // Reset to the first page only when a filter actually changes (not on mount,
  // so a restored page number survives coming back from the edit page).
  const firstFilterRun = useRef(true);
  useEffect(() => {
    if (firstFilterRun.current) {
      firstFilterRun.current = false;
      return;
    }
    setPage(1);
  }, [q, brand, category, status, stockFilter, supplierFilter, sort, perPage]);

  // Remember filters + paging for the next mount.
  useEffect(() => {
    listStateCache = {
      q,
      brand,
      category,
      status,
      stockFilter,
      supplierFilter,
      sort,
      perPage,
      page,
    };
  }, [q, brand, category, status, stockFilter, supplierFilter, sort, perPage, page]);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  async function toggle(p: Row) {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !p.is_active })
      .eq("id", p.id);
    if (error) return toast.error(error.message);
    setItems((s) => s.map((i) => (i.id === p.id ? { ...i, is_active: !p.is_active } : i)));
  }
  async function remove(p: Row) {
    if (
      !(await confirmAction({
        title: "Delete product",
        description: "This product will be permanently deleted.",
        detail: p.name,
        confirmText: "Delete",
      }))
    )
      return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setItems((s) => s.filter((i) => i.id !== p.id));
    setSelected((s) => {
      const n = new Set(s);
      n.delete(p.id);
      return n;
    });
  }

  async function review(p: Row, approve: boolean) {
    if (
      !(await confirmAction({
        title: approve ? "Approve submission" : "Reject submission",
        description: approve
          ? "The information submitted by the supplier will go live."
          : "The submission will be rejected; live data will remain unchanged.",
        detail: p.name,
        confirmText: approve ? "Approve" : "Reject",
      }))
    )
      return;
    try {
      await reviewProduct(p.id, approve);
      toast.success(approve ? "Approved" : "Rejected");
      await refreshOne(p.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  async function bulkSetActive(active: boolean) {
    const ids = Array.from(selected);
    if (!ids.length) return;
    setBulkBusy(true);
    const { error } = await supabase.from("products").update({ is_active: active }).in("id", ids);
    setBulkBusy(false);
    if (error) return toast.error(error.message);
    setItems((s) => s.map((i) => (ids.includes(i.id) ? { ...i, is_active: active } : i)));
    toast.success(`${ids.length} product ${active ? "activated" : "hidden"}`);
    setSelected(new Set());
  }
  async function bulkDelete() {
    const ids = Array.from(selected);
    if (!ids.length) return;
    if (
      !(await confirmAction({
        title: "Delete products",
        description: "Products used in orders are protected.",
        detail: `${ids.length} selected`,
        confirmText: "Delete",
      }))
    )
      return;
    setBulkBusy(true);
    const { error } = await supabase.from("products").delete().in("id", ids);
    setBulkBusy(false);
    if (error) return toast.error(error.message);
    setItems((s) => s.filter((i) => !ids.includes(i.id)));
    toast.success(`${ids.length} product deleted`);
    setSelected(new Set());
  }

  /** Approve or reject every selected supplier submission in one go. */
  async function bulkReview(approve: boolean) {
    const ids = Array.from(selected);
    if (!ids.length) return;
    const targets = items.filter(
      (i) =>
        ids.includes(i.id) &&
        ((i.approval_status ?? "approved") !== "approved" || i.pending_changes),
    );
    if (!targets.length) return toast.error("No pending submission in the selection");
    if (
      !(await confirmAction({
        title: approve ? "Approve submissions" : "Reject submissions",
        description: approve
          ? "The selected supplier submissions will go live."
          : "The selected submissions will be rejected; live data stays unchanged.",
        detail: `${targets.length} product${targets.length === 1 ? "" : "s"}`,
        confirmText: approve ? "Approve" : "Reject",
      }))
    )
      return;
    setBulkBusy(true);
    let ok = 0;
    for (const t of targets) {
      try {
        await reviewProduct(t.id, approve);
        ok += 1;
      } catch {
        /* keep going, report the count at the end */
      }
    }
    await Promise.all(targets.map((t) => refreshOne(t.id)));
    setBulkBusy(false);
    if (!ok) return toast.error("Failed");
    toast.success(`${ok} product ${approve ? "approved" : "rejected"}`);
    setSelected(new Set());
  }

  /** Bulk price / stock / packaging setter (admin only). */
  async function bulkApplyValues(state: Parameters<typeof computeBulkPatch>[1]) {
    const ids = Array.from(selected);
    const targets = items.filter((i) => ids.includes(i.id));
    if (!targets.length) return;
    setBulkBusy(true);
    const updated: Record<string, Record<string, number>> = {};
    let failed = 0;
    for (const t of targets) {
      const patch = computeBulkPatch(t, state);
      if (!Object.keys(patch).length) continue;
      const { error } = await supabase
        .from("products")
        .update(patch as never)
        .eq("id", t.id);
      if (error) failed += 1;
      else updated[t.id] = patch;
    }
    setBulkBusy(false);
    const okCount = Object.keys(updated).length;
    if (okCount) {
      setItems((s) => s.map((i) => (updated[i.id] ? ({ ...i, ...updated[i.id] } as Row) : i)));
      toast.success(`${okCount} product updated`);
    }
    if (failed) toast.error(`${failed} product could not be updated`);
  }

  const lowerFiltered = useMemo(() => {
    return items.filter((i) => {
      if (q) {
        const t = q.trim().toLowerCase();
        if (t && !i.name.toLowerCase().includes(t) && !i.product_code.toLowerCase().includes(t))
          return false;
      }
      if (brand && i.brand_id !== brand) return false;
      if (category && i.category_id !== category) return false;
      if (stockFilter === "out" && i.stock > 0) return false;
      if (stockFilter === "low" && (i.stock === 0 || i.stock > 5)) return false;
      if (stockFilter === "in" && i.stock <= 0) return false;
      if (supplierFilter === "admin" && i.supplier_id) return false;
      if (supplierFilter && supplierFilter !== "admin" && i.supplier_id !== supplierFilter)
        return false;
      return true;
    });
  }, [items, q, brand, category, stockFilter, supplierFilter]);

  const filtered = useMemo(() => {
    const list = lowerFiltered.filter((i) => {
      if (status === "active" && !i.is_active) return false;
      if (status === "hidden" && i.is_active) return false;
      if (status === "featured" && !i.is_featured) return false;
      if (status === "pending" && i.approval_status !== "pending") return false;
      if (status === "approved" && (i.approval_status ?? "approved") !== "approved") return false;
      if (status === "rejected" && i.approval_status !== "rejected") return false;
      return true;
    });
    if (sort === "oldest")
      list.sort((a, b) => String(a.created_at ?? "").localeCompare(String(b.created_at ?? "")));
    return list;
  }, [lowerFiltered, status, sort]);

  const statusCounts = useMemo(
    () => ({
      all: lowerFiltered.length,
      active: lowerFiltered.filter((i) => i.is_active).length,
      hidden: lowerFiltered.filter((i) => !i.is_active).length,
      featured: lowerFiltered.filter((i) => i.is_featured).length,
      pending: lowerFiltered.filter((i) => i.approval_status === "pending").length,
      approved: lowerFiltered.filter((i) => (i.approval_status ?? "approved") === "approved")
        .length,
      rejected: lowerFiltered.filter((i) => i.approval_status === "rejected").length,
    }),
    [lowerFiltered],
  );

  const paged = usePaginated(filtered, page, perPage);

  const filters: FilterDef[] = [
    {
      key: "brand",
      label: "Brand",
      value: brand,
      onChange: setBrand,
      options: brands.map((b) => ({ value: b.id, label: b.name })),
    },
    {
      key: "category",
      label: "Category",
      value: category,
      onChange: setCategory,
      options: categories.map((c) => ({ value: c.id, label: c.name })),
    },
    {
      key: "supplier",
      label: "Supplier",
      value: supplierFilter,
      onChange: setSupplierFilter,
      options: [
        { value: "admin", label: "Admin's own" },
        ...suppliers.map((s) => ({ value: s.id, label: s.display_name || s.name || s.code })),
      ],
    },
    {
      key: "stock",
      label: "Stock",
      value: stockFilter,
      onChange: setStockFilter,
      options: [
        { value: "in", label: "In stock" },
        { value: "low", label: "Low (≤5)" },
        { value: "out", label: "Out of stock" },
      ],
    },
    {
      key: "sort",
      label: "Added",
      value: sort,
      onChange: setSort,
      options: [
        { value: "newest", label: "Newest first" },
        { value: "oldest", label: "Oldest first" },
      ],
    },
  ];

  const statusButtons = [
    ["", "All", statusCounts.all],
    ["active", "Active", statusCounts.active],
    ["hidden", "Hidden", statusCounts.hidden],
    ["featured", "Featured", statusCounts.featured],
    ["pending", "Pending", statusCounts.pending],
    ["approved", "Approved", statusCounts.approved],
    ["rejected", "Rejected", statusCounts.rejected],
  ] as const;

  return (
    <div>
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            Products
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-sm font-semibold text-primary">
              {filtered.length}
            </span>
          </span>
        }
        description="Master catalog resellers create listings from."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {canManage && (
              <button
                type="button"
                onClick={() => setInlineEdit((v) => !v)}
                title={
                  inlineEdit
                    ? "Inline editing is ON — click to lock"
                    : "Inline editing is locked — click to enable"
                }
                className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                  inlineEdit
                    ? "border-amber-500/60 bg-amber-500/15 text-amber-700 dark:text-amber-400"
                    : "hover:bg-muted"
                }`}
              >
                {inlineEdit ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {inlineEdit ? "Inline edit: ON" : "Inline edit: OFF"}
              </button>
            )}
            {canManage && (
              <button
                type="button"
                onClick={() => setImportOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                <CloudDownload className="h-4 w-4" /> Import from URL
              </button>
            )}
            {canManage && (
              <Link
                to="/admin/products/new"
                className="btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
              >
                <Plus className="h-4 w-4" /> New product
              </Link>
            )}
          </div>
        }
      />

      <ProductImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onSaved={() => load()}
      />

      <div className="mb-2 flex overflow-x-auto rounded-md border bg-muted/30 p-1">
        <div className="flex min-w-max items-center gap-1 pr-2">
          {statusButtons.map(([value, label, count]) => (
            <button
              key={`status-${value || "all"}`}
              type="button"
              onClick={() => setStatus(value)}
              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                status === value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-background hover:text-foreground"
              }`}
            >
              {label}
              <span className={status === value ? "opacity-90" : "text-foreground/70"}>
                ({count})
              </span>
            </button>
          ))}
        </div>
      </div>

      <DataToolbar
        inline
        search={q}
        onSearch={setQ}
        searchPlaceholder="Search by name or ID…"
        filters={filters}
        perPage={perPage}
        onPerPage={setPerPage}
      />

      {loading ? (
        <div className="grid place-items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No products match"
          description="Try changing filters or add a new product."
          action={
            canManage ? (
              <Link
                to="/admin/products/new"
                className="btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
              >
                <Plus className="h-4 w-4" /> Add product
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          {selected.size > 0 && (
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border bg-primary/5 px-3 py-2 text-sm">
              <span className="font-medium">{selected.size} selected</span>
              <div className="ml-auto flex flex-wrap gap-2">
                {canManage && (
                  <button
                    disabled={bulkBusy}
                    onClick={() => bulkSetActive(true)}
                    className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-background disabled:opacity-50"
                  >
                    <Eye className="h-3.5 w-3.5" /> Activate
                  </button>
                )}
                {canManage && (
                  <button
                    disabled={bulkBusy}
                    onClick={() => bulkSetActive(false)}
                    className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-background disabled:opacity-50"
                  >
                    <EyeOff className="h-3.5 w-3.5" /> Hide
                  </button>
                )}
                {canManage && (
                  <button
                    disabled={bulkBusy}
                    onClick={() => bulkReview(true)}
                    className="inline-flex items-center gap-1 rounded-md border border-emerald-500/50 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-500/10 disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                )}
                {canManage && (
                  <button
                    disabled={bulkBusy}
                    onClick={() => bulkReview(false)}
                    className="inline-flex items-center gap-1 rounded-md border border-amber-500/50 px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-500/10 disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                )}
                {canDelete && (
                  <button
                    disabled={bulkBusy}
                    onClick={bulkDelete}
                    className="inline-flex items-center gap-1 rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                )}
                <button
                  onClick={() => setSelected(new Set())}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              {canManage && (
                <BulkValuePanel count={selected.size} busy={bulkBusy} onApply={bulkApplyValues} />
              )}
            </div>
          )}
          <div className="surface-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="w-8 px-2 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        const pageIds = paged.map((p) => p.id);
                        const allChecked = pageIds.every((id) => selected.has(id));
                        setSelected((s) => {
                          const n = new Set(s);
                          if (allChecked) pageIds.forEach((id) => n.delete(id));
                          else pageIds.forEach((id) => n.add(id));
                          return n;
                        });
                      }}
                      className="text-muted-foreground hover:text-primary"
                      aria-label="Select all on page"
                    >
                      {paged.length > 0 && paged.every((p) => selected.has(p.id)) ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="min-w-[240px] px-3 py-3 text-left">Product</th>
                  <th className="px-3 py-3 text-center">Supplier</th>
                  <th className="px-3 py-3 text-center">Admin cost</th>
                  <th className="px-3 py-3 text-center">Reseller</th>
                  <th className="px-3 py-3 text-center">Suggested</th>
                  <th className="px-3 py-3 text-center">Packaging</th>
                  <th className="px-3 py-3 text-center">Stock</th>
                  <th className="px-3 py-3 text-center">Weight</th>
                  <th className="px-3 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paged.map((p) => (
                  <tr
                    key={p.id}
                    className={`hover:bg-muted/50 ${selected.has(p.id) ? "bg-primary/5" : ""}`}
                  >
                    <td className="px-2 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setSelected((s) => {
                            const n = new Set(s);
                            if (n.has(p.id)) n.delete(p.id);
                            else n.add(p.id);
                            return n;
                          })
                        }
                        className="text-muted-foreground hover:text-primary"
                        aria-label="Select"
                      >
                        {selected.has(p.id) ? (
                          <CheckSquare className="h-4 w-4 text-primary" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="min-w-[240px] px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                          onClick={() => setDetailId(p.id)}
                        >
                          {p.og_image_url && (
                            <img
                              src={p.og_image_url}
                              className="h-full w-full object-cover"
                              alt=""
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className="font-medium leading-snug line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                            onClick={() => setDetailId(p.id)}
                            title={p.name}
                          >
                            {p.name}
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
                            <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 font-medium">
                              ID #{p.product_code}
                            </span>
                            {p.brand_id && brands.find((b) => b.id === p.brand_id) && (
                              <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5">
                                {brands.find((b) => b.id === p.brand_id)!.name}
                              </span>
                            )}
                            {p.category_id && categories.find((c) => c.id === p.category_id) && (
                              <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5">
                                {categories.find((c) => c.id === p.category_id)!.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex justify-center">
                        <SupplierCell row={p} suppliers={suppliers} />
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <PriceCell
                        locked={!inlineEdit || !canManage}
                        row={p}
                        field="buying_price"
                        onSaved={(v) =>
                          setItems((s) =>
                            s.map((i) => (i.id === p.id ? { ...i, buying_price: v } : i)),
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <PriceCell
                        locked={!inlineEdit || !canManage}
                        row={p}
                        field="reseller_price"
                        onSaved={(v) =>
                          setItems((s) =>
                            s.map((i) => (i.id === p.id ? { ...i, reseller_price: v } : i)),
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <PriceCell
                        locked={!inlineEdit || !canManage}
                        row={p}
                        field="suggested_price"
                        onSaved={(v) =>
                          setItems((s) =>
                            s.map((i) => (i.id === p.id ? { ...i, suggested_price: v } : i)),
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <PriceCell
                        locked={!inlineEdit || !canManage}
                        row={p}
                        field="packaging_cost"
                        onSaved={(v) =>
                          setItems((s) =>
                            s.map((i) => (i.id === p.id ? { ...i, packaging_cost: v } : i)),
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <StockCell
                        locked={!inlineEdit || !canManage}
                        row={p}
                        onSaved={(v) =>
                          setItems((s) => s.map((i) => (i.id === p.id ? { ...i, stock: v } : i)))
                        }
                      />
                    </td>
                    <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">
                      <WeightCell
                        locked={!inlineEdit || !canManage}
                        row={p}
                        onSaved={(v) =>
                          setItems((s) =>
                            s.map((i) => (i.id === p.id ? { ...i, weight_grams: v } : i)),
                          )
                        }
                      />
                      <div
                        className="mt-0.5 whitespace-nowrap text-[10px] leading-tight text-muted-foreground"
                        title="Applicable delivery charge"
                      >
                        {deliveryLabel(p, settings.delivery)}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                            p.is_active
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${p.is_active ? "bg-emerald-500" : "bg-muted-foreground"}`}
                          />
                          {p.is_active ? "Active" : "Hidden"}
                        </span>
                        {(p.approval_status ?? "approved") !== "approved" && (
                          <div
                            className={
                              "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize " +
                              (APPROVAL_TONE[p.approval_status] ?? "bg-muted")
                            }
                          >
                            {p.approval_status}
                          </div>
                        )}
                        {canManage &&
                          p.pending_changes &&
                          Object.keys(p.pending_changes).length > 0 && (
                            <button
                              type="button"
                              onClick={() => setReviewFor(p)}
                              className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-700 hover:bg-amber-500/25 dark:text-amber-400"
                            >
                              {Object.keys(p.pending_changes).length} change
                              {Object.keys(p.pending_changes).length === 1 ? "" : "s"} to review
                            </button>
                          )}
                        <ActionMenu vertical>
                          <DropdownMenuItem onSelect={() => setDetailId(p.id)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {canManage && (
                            <DropdownMenuItem
                              onSelect={() =>
                                nav({ to: "/admin/products/$id/edit", params: { id: p.id } })
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                          )}
                          {canManage && (
                            <DropdownMenuItem
                              onSelect={() =>
                                nav({ to: "/admin/products/new", search: { from: p.id } })
                              }
                            >
                              <Copy className="mr-2 h-4 w-4" /> Duplicate
                            </DropdownMenuItem>
                          )}
                          {canManage && (
                            <DropdownMenuItem onSelect={() => setAssignFor(p)}>
                              <Truck className="mr-2 h-4 w-4" />{" "}
                              {p.supplier_id ? "Change / remove supplier" : "Assign supplier"}
                            </DropdownMenuItem>
                          )}
                          {canManage &&
                            ((p.approval_status ?? "approved") !== "approved" ||
                              p.pending_changes) && (
                              <>
                                <DropdownMenuItem onSelect={() => setReviewFor(p)}>
                                  <Eye className="mr-2 h-4 w-4" /> Review changes
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => review(p, true)}>
                                  <Check className="mr-2 h-4 w-4" /> Approve submission
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => review(p, false)}>
                                  <X className="mr-2 h-4 w-4" /> Reject submission
                                </DropdownMenuItem>
                              </>
                            )}
                          {canManage && (
                            <DropdownMenuItem onSelect={() => toggle(p)}>
                              {p.is_active ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" /> Hide
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4" /> Show
                                </>
                              )}
                            </DropdownMenuItem>
                          )}
                          {canDelete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onSelect={() => remove(p)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </ActionMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} perPage={perPage} total={filtered.length} onPage={setPage} />
        </>
      )}
      {assignFor && (
        <AssignSupplierModal
          row={assignFor}
          suppliers={suppliers}
          onClose={() => setAssignFor(null)}
          onSaved={() => {
            const id = assignFor.id;
            setAssignFor(null);
            refreshOne(id);
          }}
        />
      )}
      {reviewFor && (
        <PendingChangesModal
          productId={reviewFor.id}
          productName={reviewFor.name}
          pendingChanges={reviewFor.pending_changes}
          brands={brands}
          categories={categories}
          onClose={() => setReviewFor(null)}
          onReviewed={() => {
            const id = reviewFor.id;
            setReviewFor(null);
            refreshOne(id);
          }}
        />
      )}
      {detailId && (
        <ProductDetailModal
          id={detailId}
          onClose={() => setDetailId(null)}
          brands={brands}
          categories={categories}
        />
      )}
    </div>
  );
}

function ProductDetailModal({
  id,
  onClose,
  brands,
  categories,
}: {
  id: string;
  onClose: () => void;
  brands: Opt[];
  categories: Opt[];
}) {
  const { settings } = useAdvancedSettings();
  const [p, setP] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<{ url: string }[]>([]);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("*, product_images(url)")
        .eq("id", id)
        .single();
      if (data) {
        setP(data);
        setImages(data.product_images || []);
        setActiveUrl(data.og_image_url ?? data.product_images?.[0]?.url ?? null);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading)
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );

  if (!p) return null;

  const brandName = brands.find((b) => b.id === p.brand_id)?.name;
  const categoryName = categories.find((c) => c.id === p.category_id)?.name;
  const imageUrls = [p.og_image_url, ...images.map((i) => i.url)].filter(Boolean) as string[];
  const detailsText = stripHtml([p.short_description, p.description].filter(Boolean).join("\n\n"));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl surface-card max-h-[90dvh] sm:max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 flex items-center justify-between border-b bg-card/95 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-md">
          <h3 className="text-base sm:text-lg font-bold">Product Details</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 sm:p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto modal-scroll p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start min-w-0">
            <div className="space-y-4 min-w-0">
              <div className="relative aspect-square w-full max-w-[420px] mx-auto overflow-hidden rounded-xl border bg-muted/40">
                {activeUrl ? (
                  <img src={activeUrl} className="h-full w-full object-contain sm:object-cover" alt="" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-muted-foreground">
                    No image
                  </div>
                )}
                <div className="absolute right-3 top-3 flex flex-col gap-2">
                  <ImageDownloadTools
                    compact
                    images={imageUrls}
                    activeUrl={activeUrl}
                    baseName={p.name}
                  />
                </div>
              </div>

              {imageUrls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 pt-1 max-w-full no-scrollbar sm:flex-wrap">
                  {imageUrls.map((url, i) => (
                    <button
                      key={url + i}
                      type="button"
                      onClick={() => setActiveUrl(url)}
                      className={`h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition ${url === activeUrl ? "border-primary ring-2 ring-primary/30" : "border-border/60 hover:border-primary/40 opacity-80 hover:opacity-100"}`}
                    >
                      <img src={url} className="h-full w-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-5 min-w-0">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold leading-tight break-words">{p.name}</h1>
                  <CopyButton value={p.name} />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    ID #{p.product_code}
                  </span>
                  {brandName && (
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {brandName}
                    </span>
                  )}
                  {categoryName && (
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {categoryName}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 rounded-xl border bg-muted/30 p-3.5 sm:p-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Buying Price
                  </div>
                  <div className="text-base sm:text-lg font-bold">৳{p.buying_price}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Reseller Price
                  </div>
                  <div className="text-base sm:text-lg font-bold">৳{p.reseller_price}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Suggested Sell
                  </div>
                  <div className="text-base sm:text-lg font-bold">৳{p.suggested_price}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Stock Available
                  </div>
                  <div className={`text-base sm:text-lg font-bold ${p.stock <= 5 ? "text-destructive" : ""}`}>
                    {p.stock} units
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Weight
                  </div>
                  <div className="text-base sm:text-lg font-bold">
                    {p.weight_grams ? `${(p.weight_grams / 1000).toFixed(2)} kg` : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Delivery Charge
                  </div>
                  <div className="text-xs sm:text-sm font-semibold">{deliveryLabel(p, settings.delivery)}</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm">Description</h4>
                  <CopyButton value={detailsText} label="details" />
                </div>
                <div
                  className="prose prose-sm max-w-none text-muted-foreground break-words"
                  dangerouslySetInnerHTML={{
                    __html: p.description || p.short_description || "No description provided.",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StockCell({
  row,
  onSaved,
  locked,
}: {
  row: Row;
  onSaved: (v: number) => void;
  locked?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(row.stock));
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  async function save() {
    const n = Math.max(0, Math.floor(Number(val)));
    if (Number.isNaN(n)) return toast.error("Invalid stock");
    if (n === row.stock) return setEditing(false);
    setBusy(true);
    const { error } = await supabase.from("products").update({ stock: n }).eq("id", row.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    onSaved(n);
    setEditing(false);
    toast.success("Stock updated");
  }

  if (locked) {
    return (
      <span
        className={`px-2 py-0.5 text-xs ${row.stock === 0 ? "text-destructive" : row.stock <= 5 ? "text-warning" : ""}`}
        title="Turn on Inline edit to change stock"
      >
        {row.stock}
      </span>
    );
  }

  if (!editing) {
    return (
      <button
        onClick={() => {
          setVal(String(row.stock));
          setEditing(true);
        }}
        className={`rounded-md border border-dashed px-2 py-0.5 text-xs hover:border-primary hover:text-primary ${
          row.stock === 0 ? "text-destructive" : row.stock <= 5 ? "text-warning" : ""
        }`}
        title="Click to edit stock"
      >
        {row.stock}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        ref={inputRef}
        type="number"
        min={0}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") setEditing(false);
        }}
        className="w-20 rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        onClick={save}
        disabled={busy}
        className="rounded-md p-1 text-primary hover:bg-primary/10"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      </button>
      <button
        onClick={() => setEditing(false)}
        className="rounded-md p-1 text-muted-foreground hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function WeightCell({
  row,
  onSaved,
  locked,
}: {
  row: Row;
  onSaved: (v: number) => void;
  locked?: boolean;
}) {
  const current = row.weight_grams ?? 0;
  const currentKg = current / 1000;
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(currentKg));
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  async function save() {
    const kg = Number(val);
    if (Number.isNaN(kg) || kg < 0) return toast.error("Invalid weight");
    const n = Math.round(kg * 1000);
    if (n === current) return setEditing(false);
    setBusy(true);
    const { error } = await supabase.from("products").update({ weight_grams: n }).eq("id", row.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    onSaved(n);
    setEditing(false);
    toast.success("Weight updated");
  }

  if (locked) {
    return (
      <span
        className="whitespace-nowrap px-2 py-0.5 text-xs"
        title="Turn on Inline edit to change weight"
      >
        {current ? `${currentKg} kg` : "—"}
      </span>
    );
  }

  if (!editing) {
    return (
      <button
        onClick={() => {
          setVal(String(currentKg));
          setEditing(true);
        }}
        className="whitespace-nowrap rounded-md border border-dashed px-2 py-0.5 text-xs hover:border-primary hover:text-primary"
        title="Click to edit weight (kg)"
      >
        {current ? `${currentKg} kg` : "—"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        ref={inputRef}
        type="number"
        min={0}
        step={0.1}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") setEditing(false);
        }}
        className="w-20 rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        onClick={save}
        disabled={busy}
        className="rounded-md p-1 text-primary hover:bg-primary/10"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      </button>
      <button
        onClick={() => setEditing(false)}
        className="rounded-md p-1 text-muted-foreground hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function PriceCell({
  row,
  field,
  onSaved,
  locked,
}: {
  row: Row;
  field: "buying_price" | "reseller_price" | "suggested_price" | "packaging_cost";
  onSaved: (v: number) => void;
  locked?: boolean;
}) {
  const current = row[field] ?? 0;
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(current));
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  async function save() {
    const n = Math.max(0, Number(val));
    if (Number.isNaN(n)) return toast.error("Invalid price");
    if (n === current) return setEditing(false);
    setBusy(true);
    const payload: {
      buying_price?: number;
      reseller_price?: number;
      suggested_price?: number;
      packaging_cost?: number;
    } = {};
    payload[field] = n;
    const { error } = await supabase.from("products").update(payload).eq("id", row.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    onSaved(n);
    setEditing(false);
    toast.success(field === "packaging_cost" ? "Packaging cost updated" : "Price updated");
  }

  if (locked) {
    return (
      <span className="px-2 py-0.5 text-xs" title="Turn on Inline edit to change price">
        ৳{current}
      </span>
    );
  }

  if (!editing) {
    return (
      <button
        onClick={() => {
          setVal(String(current));
          setEditing(true);
        }}
        className="rounded-md border border-dashed px-2 py-0.5 text-xs hover:border-primary hover:text-primary"
        title="Click to edit price"
      >
        ৳{current}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        ref={inputRef}
        type="number"
        min={0}
        step="any"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") setEditing(false);
        }}
        className="w-20 rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        onClick={save}
        disabled={busy}
        className="rounded-md p-1 text-primary hover:bg-primary/10"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      </button>
      <button
        onClick={() => setEditing(false)}
        className="rounded-md p-1 text-muted-foreground hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function SupplierCell({ row, suppliers }: { row: Row; suppliers: SupplierOpt[] }) {
  const s = row.supplier_id ? suppliers.find((x) => x.id === row.supplier_id) : null;
  if (!row.supplier_id)
    return <span className="text-xs text-muted-foreground">Admin&apos;s own</span>;
  return (
    <div className="text-xs">
      <div className="font-medium">{s?.display_name || s?.name || "Supplier"}</div>
      <div className="text-[10px] text-muted-foreground">
        ৳{row.supplier_price ?? row.buying_price}
      </div>
    </div>
  );
}

function AssignSupplierModal({
  row,
  suppliers,
  onClose,
  onSaved,
}: {
  row: Row;
  suppliers: SupplierOpt[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [value, setValue] = useState(row.supplier_id ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await setProductSupplier(row.id, value || null);
      toast.success(value ? "Supplier assigned" : "Supplier removed");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppModal
      open
      onClose={onClose}
      size="sm"
      title="Product supplier"
      subtitle={row.name}
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={busy}
            className="btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save
          </button>
        </div>
      }
    >
      <label className="mb-1 block text-xs font-medium">Supplier</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">— Admin&apos;s own product —</option>
        {suppliers.map((s) => (
          <option key={s.id} value={s.id}>
            {s.display_name || s.name} ({s.code}){s.status !== "active" ? " · " + s.status : ""}
          </option>
        ))}
      </select>
      <p className="mt-2 text-[11px] text-muted-foreground">
        If you select a supplier, the admin cost will be treated as their due amount. Removing it
        will make the product the admin's own.
      </p>
    </AppModal>
  );
}
