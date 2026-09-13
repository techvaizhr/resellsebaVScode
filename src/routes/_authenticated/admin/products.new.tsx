import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/laravel/client";
import { PageHeader } from "@/components/ui-kit";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader, type UploadedImage } from "@/components/ImageUploader";
import { SearchableSelect } from "@/components/searchable-select";
import { RichTextEditor } from "@/components/RichTextEditor";
import { uniqueProductSlug } from "@/lib/slug";
import { Hint } from "@/components/Hint";
import { AdminProductCalc } from "@/components/price-breakdown";
import { areaLabel, deliverySettingsSummary, globalDelivery, resolveDelivery, resolvedCharge, type ProductDeliveryMode } from "@/lib/delivery";
import { ProductImportModal } from "@/components/ProductImportModal";
import { takeImportDraft } from "@/lib/product-import";
import { CloudDownload } from "lucide-react";
import { useCan } from "@/lib/use-auth";
import { useAdvancedSettings } from "@/lib/advanced-settings";
import { applyPricingRule, pricingRuleSummary } from "@/lib/pricing-rule";
import { Wand2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/products/new")({
  validateSearch: (s: Record<string, unknown>): { from?: string } => ({
    from: typeof s.from === "string" ? s.from : undefined,
  }),
  component: NewProduct,
});

function NewProduct() {
  const nav = useNavigate();
  const { from } = Route.useSearch();
  const can = useCan();
  const [name, setName] = useState("");
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
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [cats, setCats] = useState<{ id: string; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; display_name: string; code: string }[]>([]);
  const [supplierId, setSupplierId] = useState("");

  const { settings: advanced } = useAdvancedSettings();
  const rule = advanced.pricing;
  /** Fields the admin typed by hand — auto pricing never overwrites them. */
  const [priceTouched, setPriceTouched] = useState(false);

  const [busy, setBusy] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [source, setSource] = useState<{ label: string; url: string } | null>(null);

  /** Prefill from an "Import from URL" draft (edit-before-save mode). */
  useEffect(() => {
    const d = takeImportDraft();
    if (!d) return;
    setName(d.name);
    if (d.sku) setSku(d.sku);
    if (d.description) setDescription(d.description);
    // Own-panel imports carry real admin/buying prices; marketplace links only a sale price.
    const admin = d.adminPrice ?? d.price;
    const buy = d.buyingPrice ?? admin;
    if (buy) setBuying(String(buy));
    if (admin) setResellerPrice(String(admin));
    if (d.price || admin) setSuggested(String(d.price || admin));
    if (d.images.length) setImages(d.images);
    if (d.metaTitle) setMetaTitle(d.metaTitle);
    if (d.metaDescription) setMetaDesc(d.metaDescription);
    setSource({ label: d.source, url: d.url });
    toast.message(`${d.source} theke data prefilled — check kore save korun.`);
  }, []);

  /** Duplicate: copy every field of the source product except SKU / slug. */
  useEffect(() => {
    if (!from) return;
    let cancelled = false;
    (async () => {
      const { data: p } = await supabase
        .from("products")
        .select(
          "name, description, brand_id, category_id, supplier_id, buying_price, reseller_price, packaging_cost, delivery_mode, delivery_flat, delivery_inside, delivery_outside, delivery_sub, suggested_price, stock, weight_grams, meta_title, meta_description, keywords, product_images(url, is_primary, sort_order)",
        )
        .eq("id", from)
        .maybeSingle();
      if (!p || cancelled) return;
      const row = p as any;
      setName(row.name ?? "");
      setSku("");
      setDescription(row.description ?? "");
      setBrandId(row.brand_id ?? "");
      setCategoryId(row.category_id ?? "");
      setSupplierId(row.supplier_id ?? "");
      setBuying(String(row.buying_price ?? ""));
      setResellerPrice(String(row.reseller_price ?? ""));
      setPackaging(String(row.packaging_cost ?? 0));
      setDeliveryMode((row.delivery_mode ?? "global") as ProductDeliveryMode);
      setDeliveryFlat(String(row.delivery_flat ?? 0));
      setDeliveryIn(String(row.delivery_inside ?? 0));
      setDeliveryOut(String(row.delivery_outside ?? 0));
      setDeliverySub(String(row.delivery_sub ?? 0));
      setSuggested(String(row.suggested_price ?? ""));
      setStock(String(row.stock ?? 0));
      setWeight(row.weight_grams == null ? "" : String(row.weight_grams / 1000));
      setMetaTitle(row.meta_title ?? "");
      setMetaDesc(row.meta_description ?? "");
      setKeywords(row.keywords ?? "");
      const imgs = [...((row.product_images ?? []) as any[])].sort(
        (a, b) => Number(!!b.is_primary) - Number(!!a.is_primary) || (a.sort_order ?? 0) - (b.sort_order ?? 0),
      );
      setImages(imgs.map((i) => ({ url: i.url, path: "", bytes: 0 })));
      toast.message("Duplicated — a new SKU and link will be generated on save.");
    })();
    return () => {
      cancelled = true;
    };
  }, [from]);

  useEffect(() => {
    supabase.from("brands").select("id,name").order("name").then(({ data }) => setBrands(data ?? []));
    supabase.from("categories").select("id,name").order("name").then(({ data }) => setCats(data ?? []));
    supabase
      .from("suppliers")
      .select("id,display_name,code")
      .eq("status", "active")
      .order("display_name")
      .then(({ data }) => setSuppliers(data ?? []));

  }, []);

  /** Fill reseller / suggested / packaging from the global rule. */
  function autoFill(cost: number) {
    if (!rule.enabled || !(cost > 0)) return;
    const r = applyPricingRule(cost, rule);
    setResellerPrice(String(r.resellerPrice));
    setSuggested(String(r.suggestedPrice));
    setPackaging(String(r.packaging));
  }

  const calc = useMemo(() => {
    const buy = Number(buying) || 0;
    const rp = Number(resellerPrice) || 0;
    const pkg = Number(packaging) || 0;
    const r = resolveDelivery(
      {
        brand_id: brandId || null,
        category_id: categoryId || null,
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
    const saProfit = rp - buy;
    // Reseller's minimum sell = reseller_price + packaging (delivery is charged separately to customer)
    const resellerMinSell = rp + pkg;
    const resellerBaseIn = rp + pkg + di; // total customer cost inside dhaka (for reference)
    const resellerBaseOut = rp + pkg + dOut;
    const resellerProfitAtSuggested = sug - rp - pkg;
    return { saProfit, resellerMinSell, resellerBaseIn, resellerBaseOut, resellerProfitAtSuggested };
  }, [buying, resellerPrice, packaging, deliveryIn, deliveryOut, deliveryMode, deliveryFlat, deliverySub, suggested]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (Number(resellerPrice) < Number(buying)) {
      toast.error("Reseller price cannot be less than buying price.");
      return;
    }
    if (Number(suggested) < calc.resellerMinSell) {
      toast.error(`Suggested sell price must be ≥ ৳${calc.resellerMinSell} (reseller price + packaging).`);
      return;
    }
    setBusy(true);
    try {
      const slug = await uniqueProductSlug(name);
      
      const { data: p, error } = await supabase
        .from("products")
        .insert({
          name,
          slug,
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
          og_image_url: images[0]?.url ?? null,
          meta_title: metaTitle || null,
          meta_description: metaDesc || null,
          keywords: keywords || null,
        })
        .select("id")
        .single();
      
      if (error) {
        console.error("Database insert error:", error);
        throw new Error(error.message || "Failed to create product in database");
      }

      if (images.length && p) {
        const { error: ie } = await supabase.from("product_images").insert(
          images.map((im, i) => ({
            product_id: p.id,
            url: im.url,
            is_primary: i === 0,
            sort_order: i,
          })),
        );
        if (ie) {
          console.error("Image insert error:", ie);
          throw new Error(ie.message || "Product created, but failed to save images");
        }
      }
      
      toast.success("Product created successfully");
      nav({ to: "/admin/products", search: { refresh: p?.id ?? "all" } });
    } catch (err) {
      console.error("Save product catch block:", err);
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setBusy(false);
    }
  }

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
        title="New product"
        description="Resellers will create listings from this product."
        actions={
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <CloudDownload className="h-4 w-4" /> Import from URL
          </button>
        }
      />
      <ProductImportModal open={importOpen} onClose={() => setImportOpen(false)} />
      {source && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs">
          <CloudDownload className="h-3.5 w-3.5 text-primary" />
          Imported from <b>{source.label}</b>
          <a href={source.url} target="_blank" rel="noreferrer" className="underline">
            view source
          </a>
          <span className="text-muted-foreground">— prices are source values, adjust before saving.</span>
        </div>
      )}
      <form onSubmit={save} className="space-y-4">
        <div className="surface-card p-6">
          <h3 className="mb-4 text-sm font-semibold">Basics</h3>
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Product name" required>
                <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
              </Field>
              <Field label="SKU (optional)">
                <input value={sku} onChange={(e) => setSku(e.target.value)} className={inputCls} placeholder="Auto if empty" />
              </Field>
            </div>
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
          {rule.enabled && (
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs">
              <Wand2 className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="min-w-0">{pricingRuleSummary(rule)}</span>
              <button
                type="button"
                onClick={() => {
                  setPriceTouched(false);
                  autoFill(Number(buying) || 0);
                }}
                className="ml-auto rounded-md border bg-background px-2 py-1 text-[11px] font-medium hover:bg-muted"
              >
                Apply rule
              </button>
            </div>
          )}
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
              <input
                required
                type="number"
                min={0}
                value={buying}
                onChange={(e) => {
                  setBuying(e.target.value);
                  if (!priceTouched) autoFill(Number(e.target.value) || 0);
                }}
                className={inputCls}
              />
            </Field>

            <Field label="Reseller price (৳)" required hint="Resellers see this as the product price and cannot sell below it.">
              <input
                required
                type="number"
                min={0}
                value={resellerPrice}
                onChange={(e) => {
                  setPriceTouched(true);
                  setResellerPrice(e.target.value);
                }}
                className={inputCls}
              />
            </Field>
            <Field label="Packaging cost (৳)" hint="Per-order packaging cost, deducted from the reseller.">
              <input
                type="number"
                min={0}
                value={packaging}
                onChange={(e) => {
                  setPriceTouched(true);
                  setPackaging(e.target.value);
                }}
                className={inputCls}
              />
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
            <Field label="Suggested sell price (৳)" required hint="Suggested to resellers. Must be at least reseller price + packaging.">
              <input
                required
                type="number"
                min={0}
                value={suggested}
                onChange={(e) => {
                  setPriceTouched(true);
                  setSuggested(e.target.value);
                }}
                className={inputCls}
              />
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
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save product
          </button>
        </div>
      </form>
    </div>
  );
}

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

