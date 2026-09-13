import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Pencil, PackageSearch, Clock, CheckCircle2, CloudDownload, Eye, Copy } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { fetchImportImage, importProductFromUrl } from "@/lib/product-import.functions";
import { importImagesToStorage } from "@/lib/product-import";
import { toast } from "sonner";
import { PageHeader, StatCard, EmptyState } from "@/components/ui-kit";
import { AppModal } from "@/components/ui-kit/AppModal";
import { DataToolbar, Pagination, ActionMenu, usePaginated, type FilterDef } from "@/components/data-list";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { type UploadedImage } from "@/components/ImageUploader";
import { ProductFormModal } from "@/components/product-form-modal";

import { useSupplier } from "@/components/supplier-context";
import {
  APPROVAL_TONE,
  bdtNum,
  loadSupplierProducts,
  saveSupplierProduct,
  supplierQuickUpdate,
  type SupplierProduct,
  type SupplierProductsPage,
} from "@/lib/supplier";

export const Route = createFileRoute("/_authenticated/supplier/products")({
  component: SupplierProductsPage_,
});

const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function SupplierProductsPage_() {
  const { data: boot } = useSupplier();
  const supplierId = boot.supplier?.id ?? "";
  const [data, setData] = useState<SupplierProductsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [live, setLive] = useState("");
  const [stock, setStock] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<SupplierProduct | null | undefined>(undefined);
  const [prefill, setPrefill] = useState<Prefill | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [detail, setDetail] = useState<SupplierProduct | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await loadSupplierProducts());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [q, status, brand, category, live, stock, perPage]);

  const products = data?.products ?? [];
  const brands = data?.brands ?? [];
  const categories = data?.categories ?? [];

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      if (status && p.approval_status !== status) return false;
      if (brand && p.brand_id !== brand) return false;
      if (category && p.category_id !== category) return false;
      if (live === "active" && !p.is_active) return false;
      if (live === "hidden" && p.is_active) return false;
      if (stock === "in" && Number(p.stock) <= 0) return false;
      if (stock === "low" && Number(p.stock) > 0 && Number(p.stock) < 5) return false;
      if (stock === "out" && Number(p.stock) > 0) return false;
      if (!needle) return true;
      return p.name.toLowerCase().includes(needle) || String(p.product_code).includes(needle);
    });
  }, [products, q, status, brand, category, live, stock]);

  const paged = usePaginated(rows, page, perPage);

  const stats = useMemo(
    () => ({
      total: products.length,
      pending: products.filter((p) => p.approval_status === "pending" || p.pending_changes).length,
      live: products.filter((p) => p.approval_status === "approved" && p.is_active).length,
    }),
    [products],
  );

  const filters: FilterDef[] = [
    {
      key: "approval",
      label: "Approval",
      value: status,
      onChange: setStatus,
      options: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
      ],
    },
    {
      key: "live",
      label: "Visibility",
      value: live,
      onChange: setLive,
      options: [
        { value: "active", label: "Live" },
        { value: "hidden", label: "Hidden" },
      ],
    },
    {
      key: "stock",
      label: "Stock",
      value: stock,
      onChange: setStock,
      options: [
        { value: "in", label: "In stock" },
        { value: "low", label: "Low (<5)" },
        { value: "out", label: "Out of stock" },
      ],
    },
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
  ];

  if (loading) {
    return (
      <div className="grid place-items-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            Products
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-sm font-semibold text-primary">
              {rows.length}
            </span>
          </span>
        }
        description="Products you have submitted — they go live once approved by admin."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setImportOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <CloudDownload className="h-4 w-4" /> Import from URL
            </button>
            <button
              onClick={() => {
                setPrefill(null);
                setEditing(null);
              }}
              className="btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
            >
              <Plus className="h-4 w-4" /> New product
            </button>
          </div>
        }
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Products" value={stats.total} icon={<PackageSearch className="h-4 w-4" />} />
        <StatCard label="Waiting approval" value={stats.pending} tone="amber" icon={<Clock className="h-4 w-4" />} />
        <StatCard label="Live" value={stats.live} tone="emerald" icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <DataToolbar
        search={q}
        onSearch={setQ}
        searchPlaceholder="Search by name or ID…"
        filters={filters}
        perPage={perPage}
        onPerPage={setPerPage}
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No products match"
          description="Change filters or add a new product — once approved by admin, resellers will be able to sell it."
          action={
            <button
              onClick={() => {
                setPrefill(null);
                setEditing(null);
              }}
              className="btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
            >
              <Plus className="h-4 w-4" /> Add product
            </button>
          }
        />
      ) : (
        <>
          <div className="surface-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="min-w-[240px] px-3 py-3 text-left">Product</th>
                  <th className="px-3 py-3 text-center">Supply price</th>
                  <th className="px-3 py-3 text-center">Stock</th>
                  <th className="px-3 py-3 text-center">Weight</th>
                  <th className="px-3 py-3 text-center">Status</th>
                  <th className="px-3 py-3 text-center">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paged.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/50">
                    <td className="min-w-[240px] px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-md border bg-muted transition-all hover:ring-2 hover:ring-primary/50"
                          onClick={() => setDetail(p)}
                        >
                          {p.og_image_url && <img src={p.og_image_url} className="h-full w-full object-cover" alt="" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className="cursor-pointer font-medium leading-snug line-clamp-2 transition-colors hover:text-primary"
                            onClick={() => setDetail(p)}
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
                    <td className="px-3 py-3 text-center tabular-nums">
                       <InlineNumber
                         value={Number(p.supplier_price)}
                         prefix="৳"
                         onSave={async (val) => {
                           const res = await supplierQuickUpdate(p.id, { price: val });
                           toast.success(
                             res.price_pending
                               ? "Price change sent for admin approval"
                               : "Price updated — awaiting approval",
                           );
                           await load();
                         }}
                       />
                       {typeof (p.pending_changes as any)?.supplier_price !== "undefined" && (
                         <div className="mt-1 text-[10px] text-amber-600">
                           Pending ৳{Number((p.pending_changes as any).supplier_price)}
                         </div>
                       )}
                    </td>
                    <td className="px-3 py-3 text-center tabular-nums">
                      <InlineNumber
                        value={Number(p.stock)}
                        onSave={async (val) => {
                          await supplierQuickUpdate(p.id, { stock: val });
                          toast.success("Stock updated");
                          await load();
                        }}
                      />
                    </td>
                    <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">
                      <InlineNumber
                        value={Number(p.weight_grams ?? 0) / 1000}
                        suffix=" kg"
                        onSave={async (val) => {
                          await supplierQuickUpdate(p.id, { weight: Math.round(val * 1000) });
                          toast.success("Weight updated");
                          await load();
                        }}
                      />
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
                          <span className={`h-1.5 w-1.5 rounded-full ${p.is_active ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                          {p.is_active ? "Live" : "Hidden"}
                        </span>
                        <div
                          className={
                            "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize " +
                            (APPROVAL_TONE[p.approval_status] ?? "bg-muted")
                          }
                        >
                          {p.approval_status}
                        </div>
                        {p.pending_changes && <div className="text-[10px] text-amber-600">Edit waiting</div>}
                        {p.approval_note && (
                          <div className="text-[10px] text-muted-foreground">{p.approval_note}</div>
                        )}
                        <ActionMenu vertical>
                          <DropdownMenuItem onSelect={() => setDetail(p)}>
                            <Eye className="mr-2 h-4 w-4" /> View details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setPrefill(null);
                              setEditing(p);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit (needs approval)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setPrefill(duplicatePrefill(p));
                              setEditing(null);
                            }}
                          >
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                        </ActionMenu>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} perPage={perPage} total={rows.length} onPage={setPage} />
        </>
      )}

      {detail && (
        <SupplierProductDetail
          product={detail}
          brands={brands}
          categories={categories}
          onClose={() => setDetail(null)}
          onEdit={() => {
            setPrefill(null);
            setEditing(detail);
            setDetail(null);
          }}
        />
      )}



      {importOpen && (
        <ImportModal
          supplierId={supplierId}
          onClose={() => setImportOpen(false)}
          onReady={(data) => {
            setImportOpen(false);
            setPrefill(data);
            setEditing(null);
          }}
        />
      )}

      {editing !== undefined && (
        <ProductForm
          product={editing}
          prefill={prefill}
          supplierId={supplierId}
          brands={brands}
          categories={categories}
          onClose={() => {
            setEditing(undefined);
            setPrefill(null);
          }}
          onSaved={() => {
            setEditing(undefined);
            setPrefill(null);
            void load();
          }}
        />
      )}
    </div>
  );
}

/** Read-only product detail — same layout language as the admin product detail modal, without platform pricing. */
function SupplierProductDetail({
  product,
  brands,
  categories,
  onClose,
  onEdit,
}: {
  product: SupplierProduct;
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  onClose: () => void;
  onEdit: () => void;
}) {
  const draft = (product.pending_changes ?? {}) as Record<string, any>;
  const images = ((draft.images as { url: string }[] | undefined) ?? product.images ?? []) as { url: string }[];
  const brandName = brands.find((b) => b.id === product.brand_id)?.name ?? "—";
  const categoryName = categories.find((c) => c.id === product.category_id)?.name ?? "—";

  return (
    <AppModal
      open
      onClose={onClose}
      title={product.name}
      subtitle={`ID #${product.product_code}`}
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
            Close
          </button>
          <button onClick={onEdit} className="btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium">
            <Pencil className="h-4 w-4" /> Edit (needs approval)
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((im, i) => (
              <img key={i} src={im.url} alt="" className="h-20 w-20 rounded-md border object-cover" />
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <DetailField label="Supply price" value={bdtNum(Number(product.supplier_price))} />
          <DetailField label="Stock" value={String(product.stock)} />
          <DetailField label="Visibility" value={product.is_active ? "Live" : "Hidden"} />
          <DetailField label="Brand" value={brandName} />
          <DetailField label="Category" value={categoryName} />
          <DetailField label="Approval" value={product.approval_status} />
        </div>
        {product.pending_changes && (
          <div className="rounded-md border border-amber-500/40 bg-amber-500/5 px-3 py-2 text-xs text-amber-700">
            An edit is pending admin approval.
          </div>
        )}
        {product.approval_note && (
          <div className="rounded-md border px-3 py-2 text-xs text-muted-foreground">{product.approval_note}</div>
        )}
        {product.description && (
          <div
            className="prose prose-sm max-w-none text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}
      </div>
    </AppModal>
  );
}

/** Click-to-edit number cell — saves on blur/Enter, reverts on Escape. */
function InlineNumber({
  value,
  prefix,
  suffix,
  onSave,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  onSave: (val: number) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!editing) setDraft(String(value));
  }, [value, editing]);

  async function commit() {
    setEditing(false);
    const next = Number(draft);
    if (!Number.isFinite(next) || next < 0 || next === value) {
      setDraft(String(value));
      return;
    }
    setBusy(true);
    try {
      await onSave(next);
    } catch (e) {
      setDraft(String(value));
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  if (!editing) {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={() => setEditing(true)}
        className="inline-flex items-center gap-1 whitespace-nowrap rounded border border-transparent px-1.5 py-0.5 text-sm hover:border-border hover:bg-muted disabled:opacity-50"
      >
        {busy && <Loader2 className="h-3 w-3 animate-spin" />}
        {prefix}
        {value}
        {suffix}
        <Pencil className="h-3 w-3 shrink-0 text-muted-foreground" />
      </button>
    );
  }

  return (
    <input
      autoFocus
      type="number"
      min={0}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => void commit()}
      onKeyDown={(e) => {
        if (e.key === "Enter") void commit();
        if (e.key === "Escape") {
          setDraft(String(value));
          setEditing(false);
        }
      }}
      className="w-24 rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate text-sm font-medium capitalize">{value}</div>
    </div>
  );
}



/** Copy every field of a product into a new-product draft — SKU is left blank. */
function duplicatePrefill(p: SupplierProduct): Prefill {
  return {
    name: p.name,
    sku: "",
    description: p.description ?? "",
    images: (p.images ?? []).map((i: any) => ({ url: i.url, path: i.path ?? "", bytes: i.bytes ?? 0 })),
    brand_id: p.brand_id ?? "",
    category_id: p.category_id ?? "",
    price: String(p.supplier_price ?? ""),
    stock: String(p.stock ?? 0),
    weight: p.weight_grams == null ? "" : String(p.weight_grams / 1000),
    meta_title: p.meta_title ?? "",
    meta_description: p.meta_description ?? "",
    keywords: p.keywords ?? "",
  };
}

export type Prefill = {
  name: string;
  sku: string;
  description: string;
  images: UploadedImage[];
  /** Duplicate flow carries the rest of the product too (SKU is never copied). */
  brand_id?: string;
  category_id?: string;
  price?: string;
  stock?: string;
  weight?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
};

function ImportModal({
  supplierId,
  onClose,
  onReady,
}: {
  supplierId: string;
  onClose: () => void;
  onReady: (data: Prefill) => void;
}) {
  const runImport = useServerFn(importProductFromUrl);
  const pullImage = useServerFn(fetchImportImage);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("");

  async function go(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      setStep("Reading link…");
      const data = await runImport({ data: { url: url.trim() } });
      setStep("Downloading images…");
      const images = await importImagesToStorage(
        data.images,
        pullImage,
        6,
        (d, t) => setStep(`Image ${d}/${t}…`),
        `suppliers/${supplierId}`,
      );
      onReady({
        name: data.name ?? "",
        sku: data.sku ?? "",
        description: data.description ?? data.shortDescription ?? "",
        images,
      });
      toast.success("Data ready — submit with your supply price.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    } finally {
      setBusy(false);
      setStep("");
    }
  }

  return (
    <AppModal
      open
      onClose={onClose}
      title="Import product from link"
      subtitle="Enter any product page link — name, description and images will be fetched automatically."
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
            Cancel
          </button>
          <button
            form="supplier-import-form"
            disabled={busy || !url.trim()}
            className="btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudDownload className="h-4 w-4" />} Fetch
          </button>
        </div>
      }
    >
      <form id="supplier-import-form" onSubmit={go} className="space-y-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          className={inp}
          autoFocus
        />
        {step && <p className="text-xs text-muted-foreground">{step}</p>}
      </form>
    </AppModal>
  );
}

function ProductForm({
  product,
  prefill,
  supplierId,
  brands,
  categories,
  onClose,
  onSaved,
}: {
  product: SupplierProduct | null;
  prefill?: Prefill | null;
  supplierId: string;
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const draft = (product?.pending_changes ?? {}) as Record<string, any>;
  const v = <T,>(key: string, fallback: T): T => (draft[key] ?? fallback) as T;

  const initial = {
    name: prefill?.name || v("name", product?.name ?? ""),
    sku: prefill?.sku || (v("sku", product?.sku ?? "") ?? ""),
    description: prefill?.description || (v("description", product?.description ?? "") ?? ""),
    brand_id: prefill?.brand_id ?? (v("brand_id", product?.brand_id ?? "") ?? ""),
    category_id: prefill?.category_id ?? (v("category_id", product?.category_id ?? "") ?? ""),
    price: prefill?.price ?? String(v("supplier_price", product?.supplier_price ?? "")),
    stock: prefill?.stock ?? String(v("stock", product?.stock ?? 0)),
    weight:
      prefill?.weight ??
      (() => { const w = v<number | null>("weight_grams", product?.weight_grams ?? null); return w == null ? "" : String(w / 1000); })(),
    meta_title: prefill?.meta_title ?? (v("meta_title", product?.meta_title ?? "") ?? ""),
    meta_description: prefill?.meta_description ?? (v("meta_description", product?.meta_description ?? "") ?? ""),
    keywords: prefill?.keywords ?? (v("keywords", product?.keywords ?? "") ?? ""),
    images: (prefill?.images ?? (draft.images as UploadedImage[] | undefined) ?? product?.images ?? []).map(
      (i: any) => ({ url: i.url, path: i.path ?? "", bytes: i.bytes ?? 0 }),
    ),
  };

  return (
    <ProductFormModal
      role="supplier"
      title={product ? "Edit product" : "New product"}
      subtitle="Changes go live only after admin approval."
      submitLabel="Submit for approval"
      imageFolder={`products/suppliers/${supplierId}`}
      brands={brands}
      categories={categories}
      initial={initial}
      onClose={onClose}
      onSubmit={async (values) => {
        await saveSupplierProduct(product?.id ?? null, {
          name: values.name,
          sku: values.sku || null,
          description: values.description || null,
          brand_id: values.brand_id || null,
          category_id: values.category_id || null,
          supplier_price: Number(values.price),
          stock: Number(values.stock) || 0,
          weight_grams: values.weight === "" ? null : Math.round(Number(values.weight) * 1000) || 0,
          meta_title: values.meta_title || null,
          meta_description: values.meta_description || null,
          keywords: values.keywords || null,
          images: values.images.map((i) => ({ url: i.url })),
        });
        toast.success(
          product
            ? "Edit submitted — awaiting admin approval"
            : "Product submitted — awaiting approval",
        );
        onSaved();
      }}
    />
  );
}

