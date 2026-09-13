import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppModal } from "@/components/ui-kit/AppModal";
import { Hint } from "@/components/Hint";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ImageUploader, type UploadedImage } from "@/components/ImageUploader";
import { SearchableSelect } from "@/components/searchable-select";

/**
 * Global product form modal — same sections/layout as the admin product page
 * (Basics · Images · Pricing · SEO). Role only changes which pricing fields
 * are visible: admin sees platform pricing, supplier sees only its own price.
 */
export type ProductFormRole = "admin" | "supplier";

export type ProductFormValues = {
  name: string;
  sku: string;
  description: string;
  brand_id: string;
  category_id: string;
  price: string;
  stock: string;
  weight: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  images: UploadedImage[];
};

export const emptyProductForm: ProductFormValues = {
  name: "",
  sku: "",
  description: "",
  brand_id: "",
  category_id: "",
  price: "",
  stock: "0",
  weight: "",
  meta_title: "",
  meta_description: "",
  keywords: "",
  images: [],
};

const inputCls =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

export function ProductFormModal({
  role,
  title,
  subtitle,
  submitLabel,
  imageFolder,
  brands,
  categories,
  initial,
  notice,
  onClose,
  onSubmit,
}: {
  role: ProductFormRole;
  title: string;
  subtitle?: string;
  submitLabel: string;
  imageFolder: string;
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  initial?: Partial<ProductFormValues>;
  notice?: React.ReactNode;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => Promise<void>;
}) {
  const [v, setV] = useState<ProductFormValues>({ ...emptyProductForm, ...initial });
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setV((p) => ({ ...p, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!v.name.trim()) return toast.error("Please enter a product name");
    if (!(Number(v.price) > 0)) return toast.error(role === "supplier" ? "Please enter a supplier price" : "Please enter a price");
    setBusy(true);
    try {
      await onSubmit({ ...v, name: v.name.trim() });
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
      size="xl"
      title={title}
      subtitle={subtitle}
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
            Cancel
          </button>
          <button
            form="product-form"
            disabled={busy}
            className="btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} {submitLabel}
          </button>
        </div>
      }
    >
      <form id="product-form" onSubmit={submit} className="space-y-4">
        {notice}

        <div className="surface-card p-4 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold">Basics</h3>
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Product name" required>
                <input required value={v.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
              </Field>
              <Field label="SKU (optional)">
                <input
                  value={v.sku}
                  onChange={(e) => set("sku", e.target.value)}
                  className={inputCls}
                  placeholder="Auto if empty"
                />
              </Field>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Brand">
                <SearchableSelect
                  options={brands.map((b) => ({ value: b.id, label: b.name }))}
                  value={v.brand_id}
                  onChange={(id) => set("brand_id", id)}
                  placeholder="— None —"
                  searchPlaceholder="Search brand…"
                />
              </Field>
              <Field label="Category">
                <SearchableSelect
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  value={v.category_id}
                  onChange={(id) => set("category_id", id)}
                  placeholder="— None —"
                  searchPlaceholder="Search category…"
                />
              </Field>
            </div>
            <Field label="Description">
              <RichTextEditor value={v.description} onChange={(html) => set("description", html)} uploadFolder={`${imageFolder}/descriptions`} />
            </Field>
          </div>
        </div>

        <div className="surface-card p-4 sm:p-6">
          <h3 className="mb-3 text-sm font-semibold">Images</h3>
          <ImageUploader
            bucket="product-images"
            folder={imageFolder}
            value={v.images}
            onChange={(imgs) => set("images", imgs)}
            multiple
            square
            maxImages={8}
            variant="square"
            label="Add image"
          />
        </div>

        <div className="surface-card p-4 sm:p-6">
          <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
            Pricing & stock
            {role === "supplier" && (
              <Hint side="right">
                The amount you receive per unit is the <b>Supplier price</b>. Customer price, delivery, and packaging will be set by the admin.
              </Hint>
            )}
          </h3>
          <div className="grid gap-3 md:grid-cols-3">
            <Field
              label={role === "supplier" ? "Supplier price (৳)" : "Buying price (৳)"}
              required
              hint={role === "supplier" ? "Your earning per delivered unit." : undefined}
            >
              <input
                required
                type="number"
                min={0}
                value={v.price}
                onChange={(e) => set("price", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Stock">
              <input
                type="number"
                min={0}
                value={v.stock}
                onChange={(e) => set("stock", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Weight (kg)" hint="Used for courier booking weight. You can enter decimals, e.g. 0.5 for 500 g.">
              <input
                type="number"
                min={0}
                step={0.1}
                value={v.weight}
                onChange={(e) => set("weight", e.target.value)}
                className={inputCls}
                placeholder="e.g. 0.5"
              />
            </Field>
          </div>
        </div>

        <div className="surface-card p-4 sm:p-6">
          <h3 className="mb-3 text-sm font-semibold">SEO</h3>
          <div className="space-y-3">
            <Field label="Meta title (≤ 60 chars)">
              <input
                maxLength={60}
                value={v.meta_title}
                onChange={(e) => set("meta_title", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Meta description (≤ 160 chars)">
              <textarea
                maxLength={160}
                rows={2}
                value={v.meta_description}
                onChange={(e) => set("meta_description", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Keywords (comma separated)">
              <input value={v.keywords} onChange={(e) => set("keywords", e.target.value)} className={inputCls} />
            </Field>
          </div>
        </div>
      </form>
    </AppModal>
  );
}

function Field({
  label,
  children,
  required,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-1 text-xs font-medium">
        {label} {required && <span className="text-destructive">*</span>}
        {hint && <Hint>{hint}</Hint>}
      </label>
      {children}
    </div>
  );
}
