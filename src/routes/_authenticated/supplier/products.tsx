import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Pencil, PackageSearch, Clock, CheckCircle2, CloudDownload, Eye } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { fetchImportImage, importProductFromUrl } from "@/lib/product-import.functions";
import { importImagesToStorage } from "@/lib/product-import";
import { toast } from "sonner";
import { PageHeader, StatCard, EmptyState } from "@/components/ui-kit";
import { AppModal } from "@/components/ui-kit/AppModal";
import { DataToolbar, Pagination, ActionMenu, usePaginated, type FilterDef } from "@/components/data-list";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ImageUploader, type UploadedImage } from "@/components/ImageUploader";
import { useSupplier } from "@/components/supplier-context";
import {
  APPROVAL_TONE,
  bdtNum,
  loadSupplierProducts,
  saveSupplierProduct,
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
  }, [q, status, brand, category, live, perPage]);

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
      if (!needle) return true;
      return p.name.toLowerCase().includes(needle) || String(p.product_code).includes(needle);
    });
  }, [products, q, status, brand, category, live]);

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
        title="Products"
        description="আপনার সাবমিট করা প্রোডাক্ট — অ্যাডমিন অ্যাপ্রুভ করলেই লাইভ হবে।"
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
          description="ফিল্টার বদলান অথবা নতুন প্রোডাক্ট যোগ করুন — অ্যাডমিন অ্যাপ্রুভ করলে রিসেলাররা বিক্রি করতে পারবে।"
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
                  <th className="min-w-[240px] px-3 py-3">Product</th>
                  <th className="px-3 py-3">Supply price</th>
                  <th className="px-3 py-3">Stock</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Submitted</th>
                  <th className="px-3 py-3 text-right">Actions</th>
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
                            className="cursor-pointer truncate font-medium transition-colors hover:text-primary"
                            onClick={() => setDetail(p)}
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
                    <td className="px-3 py-3 tabular-nums">{bdtNum(Number(p.supplier_price))}</td>
                    <td className="px-3 py-3 tabular-nums">{p.stock}</td>
                    <td className="px-3 py-3">
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
                          "mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize " +
                          (APPROVAL_TONE[p.approval_status] ?? "bg-muted")
                        }
                      >
                        {p.approval_status}
                      </div>
                      {p.pending_changes && <div className="mt-1 text-[10px] text-amber-600">Edit waiting</div>}
                      {p.approval_note && (
                        <div className="mt-1 text-[10px] text-muted-foreground">{p.approval_note}</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end">
                        <ActionMenu>
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
                        </ActionMenu>
                      </div>
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

export type Prefill = {
  name: string;
  sku: string;
  description: string;
  images: UploadedImage[];
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
      setStep("লিংক পড়া হচ্ছে…");
      const data = await runImport({ data: { url: url.trim() } });
      setStep("ছবি ডাউনলোড হচ্ছে…");
      const images = await importImagesToStorage(
        data.images,
        pullImage,
        6,
        (d, t) => setStep(`ছবি ${d}/${t}…`),
        `suppliers/${supplierId}`,
      );
      onReady({
        name: data.name ?? "",
        sku: data.sku ?? "",
        description: data.description ?? data.shortDescription ?? "",
        images,
      });
      toast.success("ডাটা রেডি — আপনার সাপ্লাই প্রাইস দিয়ে সাবমিট করুন।");
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
      subtitle="যেকোনো প্রোডাক্ট পেজের লিংক দিন — নাম, বর্ণনা ও ছবি স্বয়ংক্রিয়ভাবে আসবে।"
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

  const [name, setName] = useState(prefill?.name || v("name", product?.name ?? ""));
  const [sku, setSku] = useState(prefill?.sku || (v("sku", product?.sku ?? "") ?? ""));
  const [price, setPrice] = useState(String(v("supplier_price", product?.supplier_price ?? "")));
  const [stock, setStock] = useState(String(v("stock", product?.stock ?? 0)));
  const [brandId, setBrandId] = useState(v("brand_id", product?.brand_id ?? "") ?? "");
  const [categoryId, setCategoryId] = useState(v("category_id", product?.category_id ?? "") ?? "");
  const [description, setDescription] = useState(
    prefill?.description || (v("description", product?.description ?? "") ?? ""),
  );
  const [images, setImages] = useState<UploadedImage[]>(
    (prefill?.images ?? (draft.images as UploadedImage[] | undefined) ?? product?.images ?? []).map((i: any) => ({
      url: i.url,
      path: i.path ?? "",
      bytes: i.bytes ?? 0,
    })),
  );
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Product name দিন");
    if (!(Number(price) > 0)) return toast.error("Supplier price দিন");
    setBusy(true);
    try {
      await saveSupplierProduct(product?.id ?? null, {
        name: name.trim(),
        sku: sku || null,
        description: description || null,
        brand_id: brandId || null,
        category_id: categoryId || null,
        supplier_price: Number(price),
        stock: Number(stock) || 0,
        images: images.map((i) => ({ url: i.url })),
      });
      toast.success(product ? "Edit সাবমিট হয়েছে — অ্যাডমিন অ্যাপ্রুভালের অপেক্ষায়" : "প্রোডাক্ট সাবমিট হয়েছে — অ্যাপ্রুভালের অপেক্ষায়");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppModal
      open
      onClose={onClose}
      size="lg"
      title={product ? "Edit product" : "New product"}
      subtitle="অ্যাডমিন অ্যাপ্রুভ করার পরেই পরিবর্তন লাইভ হবে।"
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
            Cancel
          </button>
          <button
            form="supplier-product-form"
            disabled={busy}
            className="btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Submit for approval
          </button>
        </div>
      }
    >
      <form id="supplier-product-form" onSubmit={submit} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Product name">
            <input value={name} onChange={(e) => setName(e.target.value)} className={inp} required />
          </Field>
          <Field label="SKU (optional)">
            <input value={sku} onChange={(e) => setSku(e.target.value)} className={inp} />
          </Field>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Supplier price (৳)" hint="আপনি প্রতি ইউনিটে যত পাবেন।">
            <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min={0} className={inp} required />
          </Field>
          <Field label="Stock">
            <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" min={0} className={inp} />
          </Field>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Brand">
            <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className={inp}>
              <option value="">— None —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inp}>
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Description">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className={inp} />
        </Field>
        <Field label="Images">
          <ImageUploader
            bucket="product-images"
            folder={`suppliers/${supplierId}`}
            value={images}
            onChange={setImages}
            multiple
            maxImages={6}
          />
        </Field>
      </form>
    </AppModal>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
