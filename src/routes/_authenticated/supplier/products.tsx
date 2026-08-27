import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Pencil, Search, PackageSearch, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard, EmptyState } from "@/components/ui-kit";
import { AppModal } from "@/components/ui-kit/AppModal";
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
  const [page, setPage] = useState<SupplierProductsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<SupplierProduct | null | undefined>(undefined);

  const load = useCallback(async () => {
    try {
      setPage(await loadSupplierProducts());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const products = page?.products ?? [];
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      if (status && p.approval_status !== status) return false;
      if (!needle) return true;
      return p.name.toLowerCase().includes(needle) || String(p.product_code).includes(needle);
    });
  }, [products, q, status]);

  const stats = useMemo(
    () => ({
      total: products.length,
      pending: products.filter((p) => p.approval_status === "pending").length,
      live: products.filter((p) => p.approval_status === "approved" && p.is_active).length,
    }),
    [products],
  );

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
        title="My products"
        description="নতুন প্রোডাক্ট যোগ করুন বা এডিট করুন — অ্যাডমিন অ্যাপ্রুভ করলেই লাইভ হবে।"
        actions={
          <button
            onClick={() => setEditing(null)}
            className="btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" /> New product
          </button>
        }
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Products" value={stats.total} icon={<PackageSearch className="h-4 w-4" />} />
        <StatCard label="Pending approval" value={stats.pending} tone="amber" icon={<Clock className="h-4 w-4" />} />
        <StatCard label="Live" value={stats.live} tone="emerald" icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className={inp + " pl-8"} />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inp + " w-auto"}>
          <option value="">All status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No products" description="নতুন প্রোডাক্ট যোগ করুন — অ্যাডমিন অ্যাপ্রুভ করলে রিসেলাররা বিক্রি করতে পারবে।" />
      ) : (
        <div className="surface-card overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 text-left uppercase text-muted-foreground">
              <tr>
                <th className="p-2">Product</th>
                <th>Supplier price</th>
                <th>Stock</th>
                <th>Approval</th>
                <th>Live</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-muted/40">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                        {p.og_image_url && <img src={p.og_image_url} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-[10px] text-muted-foreground">ID #{p.product_code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="tabular-nums">{bdtNum(Number(p.supplier_price))}</td>
                  <td className="tabular-nums">{p.stock}</td>
                  <td>
                    <span className={"rounded-full px-2 py-0.5 text-[11px] font-medium capitalize " + (APPROVAL_TONE[p.approval_status] ?? "bg-muted")}>
                      {p.approval_status}
                    </span>
                    {p.pending_changes && (
                      <div className="mt-1 text-[10px] text-amber-600">Edit waiting for approval</div>
                    )}
                    {p.approval_note && <div className="mt-1 text-[10px] text-muted-foreground">{p.approval_note}</div>}
                  </td>
                  <td className="text-muted-foreground">{p.is_active ? "Yes" : "No"}</td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => setEditing(p)}
                      className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-medium hover:bg-muted"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing !== undefined && (
        <ProductForm
          product={editing}
          supplierId={supplierId}
          brands={page?.brands ?? []}
          categories={page?.categories ?? []}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined);
            void load();
          }}
        />
      )}
    </div>
  );
}

function ProductForm({
  product,
  supplierId,
  brands,
  categories,
  onClose,
  onSaved,
}: {
  product: SupplierProduct | null;
  supplierId: string;
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const draft = (product?.pending_changes ?? {}) as Record<string, any>;
  const v = <T,>(key: string, fallback: T): T => (draft[key] ?? fallback) as T;

  const [name, setName] = useState(v("name", product?.name ?? ""));
  const [sku, setSku] = useState(v("sku", product?.sku ?? "") ?? "");
  const [price, setPrice] = useState(String(v("supplier_price", product?.supplier_price ?? "")));
  const [stock, setStock] = useState(String(v("stock", product?.stock ?? 0)));
  const [brandId, setBrandId] = useState(v("brand_id", product?.brand_id ?? "") ?? "");
  const [categoryId, setCategoryId] = useState(v("category_id", product?.category_id ?? "") ?? "");
  const [description, setDescription] = useState(v("description", product?.description ?? "") ?? "");
  const [images, setImages] = useState<UploadedImage[]>(
    ((draft.images as UploadedImage[] | undefined) ?? product?.images ?? []).map((i: any) => ({
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
