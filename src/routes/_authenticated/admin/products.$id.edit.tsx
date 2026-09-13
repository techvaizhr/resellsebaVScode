import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/laravel/client";
import { PageHeader } from "@/components/ui-kit";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader, type UploadedImage } from "@/components/ImageUploader";
import { SearchableSelect } from "@/components/searchable-select";
import { RichTextEditor } from "@/components/RichTextEditor";
import { uniqueProductSlug, slugify } from "@/lib/slug";
import { Hint } from "@/components/Hint";
import { AdminProductCalc } from "@/components/price-breakdown";
import { areaLabel, deliverySettingsSummary, globalDelivery, resolveDelivery, resolvedCharge, type ProductDeliveryMode } from "@/lib/delivery";
import { confirmAction } from "@/lib/confirm";
import { useCan } from "@/lib/use-auth";

export const Route = createFileRoute("/_authenticated/admin/products/$id/edit")({
  component: EditProduct,
});

const inputCls =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({
  label, children, required, hint,
}: {
  label: string; children: React.ReactNode; required?: boolean; hint?: React.ReactNode;
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

function EditProduct() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const can = useCan();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [origName, setOrigName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [buying, setBuying] = useState("");
  const [resellerPrice, setResellerPrice] = useState("");
  const [packaging, setPackaging] = useState("0");
  const [deliveryMode, setDeliveryMode] = useState<ProductDeliveryMode>("global");
  const [deliveryFlat, setDeliveryFlat] = useState("0");
  const [deliveryIn, setDeliveryIn] = useState("60");
  const [deliveryOut, setDeliveryOut] = useState("130");
  const [deliverySub, setDeliverySub] = useState("90");
  const [suggested, setSuggested] = useState("");
  const [stock, setStock] = useState("0");
  const [weight, setWeight] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [cats, setCats] = useState<{ id: string; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; display_name: string; code: string }[]>([]);
  const [supplierId, setSupplierId] = useState("");

  useEffect(() => {
    (async () => {
      const [{ data: p }, { data: bs }, { data: cs }, { data: imgs }, { data: sup }] = await Promise.all([
        supabase.from("products").select("*").eq("id", id).maybeSingle(),
        supabase.from("brands").select("id,name").order("name"),
        supabase.from("categories").select("id,name").order("name"),
        supabase.from("product_images").select("url,sort_order").eq("product_id", id).order("sort_order"),
        supabase.from("suppliers").select("id,display_name,code").eq("status", "active").order("display_name"),
      ]);
      setBrands(bs ?? []);
      setCats(cs ?? []);
      setSuppliers(sup ?? []);
      if (!p) {
        toast.error("Product not found");
        nav({ to: "/admin/products" });
        return;
      }
      const anyP = p as any;
      setName(p.name ?? "");
      setOrigName(p.name ?? "");
      setSlug(p.slug ?? "");
      setSku(p.sku ?? "");
      setDescription(p.description ?? "");
      setBrandId(p.brand_id ?? "");
      setCategoryId(p.category_id ?? "");
      setSupplierId(anyP.supplier_id ?? "");
      setBuying(String(p.buying_price ?? 0));

      setResellerPrice(String(anyP.reseller_price ?? p.buying_price ?? 0));
      setPackaging(String(p.packaging_cost ?? 0));
      setDeliveryMode(((p as any).delivery_mode ?? "global") as ProductDeliveryMode);
      setDeliveryFlat(String((p as any).delivery_flat ?? 0));
      setDeliveryIn(String(p.delivery_inside ?? 0));
      setDeliveryOut(String(p.delivery_outside ?? 0));
      setDeliverySub(String((p as any).delivery_sub ?? p.delivery_outside ?? 0));
      setSuggested(String(p.suggested_price ?? 0));
      setStock(String(p.stock ?? 0));
      setWeight(p.weight_grams == null ? "" : String(p.weight_grams / 1000));
      setIsActive(!!p.is_active);
      setMetaTitle(p.meta_title ?? "");
      setMetaDesc(p.meta_description ?? "");
      setKeywords(p.keywords ?? "");
      const existing: UploadedImage[] = (imgs ?? []).map((r: any) => ({ url: r.url, path: "", bytes: 0 }));
      if (existing.length === 0 && p.og_image_url) existing.push({ url: p.og_image_url, path: "", bytes: 0 });
      setImages(existing);
      setLoading(false);
    })();
  }, [id, nav]);

  const calc = useMemo(() => {
    const buy = Number(buying) || 0;
    const rp = Number(resellerPrice) || 0;
    const pkg = Number(packaging) || 0;
    const r = resolveDelivery(
      {
        brand_id: brandId || null,
        category_id: categoryId || null,
        id,
        delivery_mode: deliveryMode,
        delivery_flat: Number(deliveryFlat) || 0,
        delivery_inside: Number(deliveryIn) || 0,
        delivery_outside: Number(deliveryOut) || 0,
        delivery_sub: Number(deliverySub) || 0,
      },
      globalDelivery(),
    );
    const di = resolvedCharge(r, "inside_dhaka");
    const dOut = resolvedCharge(r, "outside_dhaka");
    const sug = Number(suggested) || 0;
    return {
      saProfit: rp - buy,
      resellerMinSell: rp + pkg,
      resellerBaseIn: rp + pkg + di,
      resellerBaseOut: rp + pkg + dOut,
      resellerProfitAtSuggested: sug - rp - pkg,
    };
  }, [buying, resellerPrice, packaging, deliveryIn, deliveryOut, deliveryMode, deliveryFlat, deliverySub, suggested]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      let finalSlug = slug;
      // regenerate slug if name changed or slug empty
      if (!finalSlug || (name !== origName && slugify(name) !== finalSlug)) {
        finalSlug = await uniqueProductSlug(name, id);
      }
      if (Number(resellerPrice) < Number(buying)) {
        throw new Error("Reseller price cannot be less than buying price.");
      }
      if (Number(suggested) < calc.resellerMinSell) {
        throw new Error(`Suggested sell must be at least ৳${calc.resellerMinSell} (reseller price + packaging).`);
      }
      const { error } = await supabase
        .from("products")
        .update({
          name,
          slug: finalSlug,
          sku: sku || null,
          description: description || null,
          brand_id: brandId || null,
          category_id: categoryId || null,
          supplier_id: supplierId || null,
          buying_price: Number(buying),

          supplier_price: Number(buying),

          reseller_price: Number(resellerPrice),
          packaging_cost: Number(packaging),
          delivery_mode: deliveryMode,
          delivery_flat: deliveryMode === "flat" || deliveryMode === "custom" ? Number(deliveryFlat) || 0 : 0,
          delivery_inside: deliveryMode === "area" ? Number(deliveryIn) || 0 : 0,
          delivery_outside: deliveryMode === "area" ? Number(deliveryOut) || 0 : 0,
          delivery_sub: deliveryMode === "area" ? Number(deliverySub) || 0 : 0,
          suggested_price: Number(suggested),
          stock: Number(stock),
          weight_grams: weight === "" ? null : Math.max(0, Math.round((Number(weight) || 0) * 1000)),
          is_active: isActive,
          og_image_url: images[0]?.url ?? null,
          meta_title: metaTitle || null,
          meta_description: metaDesc || null,
          keywords: keywords || null,
        })
        .eq("id", id);
      
      if (error) {
        console.error("Database update error:", error);
        throw new Error(error.message || "Failed to update product details");
      }

      const { error: de } = await supabase.from("product_images").delete().eq("product_id", id);
      if (de) console.warn("Failed to clean old images:", de);

      if (images.length) {
        const { error: ie } = await supabase.from("product_images").insert(
          images.map((im, i) => ({
            product_id: id,
            url: im.url,
            is_primary: i === 0,
            sort_order: i,
          })),
        );
        if (ie) {
          console.error("Image insert error:", ie);
          throw new Error(ie.message || "Details updated, but failed to save images");
        }
      }
      
      toast.success("Product updated successfully");
      nav({ to: "/admin/products", search: { refresh: id } });
    } catch (err) {
      console.error("Save product catch block:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!(await confirmAction({ title: "Delete product", description: "All related listings may also be removed.", detail: name, confirmText: "Delete" }))) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    nav({ to: "/admin/products", search: { refresh: id } });
  }

  if (loading)
    return (
      <div className="grid place-items-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  if (!can("products.manage")) {
    return (
      <div className="grid place-items-center py-24">
        <div className="surface-card max-w-md p-8 text-center text-sm text-muted-foreground">
          You do not have permission to edit products.
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit product"
        description="Changes here also reflect in reseller listings."
        actions={
          can("products.delete") ? (
            <button
              onClick={remove}
              className="inline-flex items-center gap-2 rounded-md border border-destructive/40 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          ) : undefined
        }
      />
      <form onSubmit={save} className="space-y-4">
        <div className="surface-card p-6">
          <h3 className="mb-4 text-sm font-semibold">Basics</h3>
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Product name" required>
                <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
              </Field>
              <Field label="SKU (optional)">
                <input value={sku} onChange={(e) => setSku(e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label="Slug">
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} placeholder="Auto from name if empty" />
            </Field>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Brand">
                <SearchableSelect
                  options={brands.map((b) => ({ value: b.id, label: b.name }))}
                  value={brandId}
                  onChange={setBrandId}
                  placeholder="— None —"
                  searchPlaceholder="Search brand…"
                />
              </Field>
              <Field label="Category">
                <SearchableSelect
                  options={cats.map((c) => ({ value: c.id, label: c.name }))}
                  value={categoryId}
                  onChange={setCategoryId}
                  placeholder="— None —"
                  searchPlaceholder="Search category…"
                />
              </Field>
            </div>
            <Field label="Description">
              <RichTextEditor value={description} onChange={setDescription} />
            </Field>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Active (visible to resellers)
            </label>
          </div>
        </div>

        <div className="surface-card p-6">
          <h3 className="mb-3 text-sm font-semibold">Images</h3>
          <ImageUploader
            bucket="product-images"
            folder="products"
            value={images}
            onChange={setImages}
            multiple
            square
            maxImages={8}
            variant="square"
            label="Add image"
          />
        </div>

        <div className="surface-card p-6">
          <h3 className="mb-1 flex items-center gap-1.5 text-sm font-semibold">
            Pricing & delivery
            <Hint side="right">
              <b>Buying</b> is your cost. <b>Reseller price</b> is what you charge the reseller.{" "}
              <b>Packaging</b> is the pack cost. <b>Delivery</b> is the courier charge, paid separately by the customer.
              Reseller's minimum sell price is <b>reseller price + packaging</b>, on top of delivery.
            </Hint>
          </h3>
          <div className="grid gap-3 md:grid-cols-3">
            <Field
              label="Supplier"
              hint="Supplier select korle buying price = oi supplier er prapya. Admin er nijer product hole — None — rakhun."
            >
              <SearchableSelect
                options={suppliers.map((s) => ({ value: s.id, label: `${s.display_name} (${s.code})` }))}
                value={supplierId}
                onChange={setSupplierId}
                placeholder="— None (admin's own product) —"
                searchPlaceholder="Search supplier…"
              />
            </Field>
            <Field
              label={supplierId ? "Supplier price / Admin cost (৳)" : "Buying price / Admin cost (৳)"}
              required
              hint={supplierId ? "Supplier ei amount ta pabe (per unit, delivered item)." : "Your cost. Resellers do not see this."}
            >
              <input required type="number" min={0} value={buying} onChange={(e) => setBuying(e.target.value)} className={inputCls} />
            </Field>

            <Field label="Reseller price (৳)" required hint="Resellers see this as the product price.">
              <input required type="number" min={0} value={resellerPrice} onChange={(e) => setResellerPrice(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Packaging cost (৳)" hint="Per-order packaging cost, deducted by admin.">
              <input type="number" min={0} value={packaging} onChange={(e) => setPackaging(e.target.value)} className={inputCls} />
            </Field>
            <Field
              label="Delivery type"
              hint={`Global rule (default) — ${deliverySettingsSummary(globalDelivery())}. Onno kichu select korle ei product er nijer charge priority pabe.`}
            >
              <select value={deliveryMode} onChange={(e) => setDeliveryMode(e.target.value as typeof deliveryMode)} className={inputCls}>
                <option value="global">Global setting (default)</option>
                <option value="area">Area-wise (3 areas)</option>
                <option value="free">Free shipping</option>
                <option value="flat">Flat rate (same everywhere)</option>
              </select>
            </Field>
            {deliveryMode === "flat" && (
              <Field label="Flat delivery charge (৳)" hint="Same delivery charge for every area.">
                <input type="number" min={0} value={deliveryFlat} onChange={(e) => setDeliveryFlat(e.target.value)} className={inputCls} />
              </Field>
            )}
            {deliveryMode === "area" && (
              <>
                <Field label={`Delivery ${areaLabel("inside_dhaka")} (৳)`} hint="Courier charge, paid by customer.">
                  <input type="number" min={0} value={deliveryIn} onChange={(e) => setDeliveryIn(e.target.value)} className={inputCls} />
                </Field>
                <Field label={`Delivery ${areaLabel("sub_dhaka")} (৳)`} hint="Courier charge, paid by customer.">
                  <input type="number" min={0} value={deliverySub} onChange={(e) => setDeliverySub(e.target.value)} className={inputCls} />
                </Field>
                <Field label={`Delivery ${areaLabel("outside_dhaka")} (৳)`} hint="Courier charge, paid by customer.">
                  <input type="number" min={0} value={deliveryOut} onChange={(e) => setDeliveryOut(e.target.value)} className={inputCls} />
                </Field>
              </>
            )}
            {deliveryMode === "custom" && (
              <Field label="Custom delivery charge (৳)" hint="Order add / edit e manual change kora jabe.">
                <input type="number" min={0} value={deliveryFlat} onChange={(e) => setDeliveryFlat(e.target.value)} className={inputCls} />
              </Field>
            )}
            <Field label="Stock">
              <input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Weight (kg)" hint="Used for courier booking weight. Decimals allowed, e.g. 0.5 = 500 g.">
              <input type="number" min={0} step={0.1} value={weight} onChange={(e) => setWeight(e.target.value)} className={inputCls} placeholder="e.g. 0.5" />
            </Field>
            <Field label="Suggested sell price (৳)" required hint="Suggested to resellers, at least reseller price + packaging.">
              <input required type="number" min={0} value={suggested} onChange={(e) => setSuggested(e.target.value)} className={inputCls} />
            </Field>
          </div>

          <div className="mt-5">
            <AdminProductCalc
              input={{
                buying: Number(buying) || 0,
                resellerPrice: Number(resellerPrice) || 0,
                packaging: Number(packaging) || 0,
                deliveryMode,
                deliveryFlat: Number(deliveryFlat) || 0,
                deliveryInside: Number(deliveryIn) || 0,
                deliveryOutside: Number(deliveryOut) || 0,
                deliverySub: Number(deliverySub) || 0,
                sellPrice: Number(suggested) || 0,
              }}
            />
          </div>

        </div>

        <div className="surface-card p-6">
          <h3 className="mb-1 text-sm font-semibold">SEO</h3>
          <div className="space-y-3">
            <Field label="Meta title (≤ 60 chars)">
              <input maxLength={60} value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Meta description (≤ 160 chars)">
              <textarea maxLength={160} rows={2} value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Keywords (comma separated)">
              <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className={inputCls} />
            </Field>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => nav({ to: "/admin/products" })}
            className="rounded-md border px-5 py-2.5 text-sm"
          >
            Cancel
          </button>
          <button
            disabled={busy}
            className="btn-brand inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
          </button>
        </div>
      </form>
    </div>
  );
}

