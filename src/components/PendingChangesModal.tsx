import { useEffect, useState } from "react";
import { supabase } from "@/integrations/laravel/client";
import { AppModal } from "@/components/ui-kit/AppModal";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import { reviewProduct } from "@/lib/supplier";
import { toast } from "sonner";
import { stripHtml } from "@/components/store/reseller-tools";

const LABELS: Record<string, string> = {
  name: "Product name",
  sku: "SKU",
  short_description: "Short description",
  description: "Description",
  brand_id: "Brand",
  category_id: "Category",
  supplier_price: "Supplier price",
  stock: "Stock",
  weight_grams: "Weight (kg)",
  meta_title: "Meta title",
  meta_description: "Meta description",
  keywords: "Keywords",
  og_image_url: "OG image",
  images: "Images",
};

type Opt = { id: string; name: string };

export function PendingChangesModal({
  productId,
  productName,
  pendingChanges,
  brands = [],
  categories = [],
  onClose,
  onReviewed,
}: {
  productId: string;
  productName: string;
  pendingChanges: Record<string, unknown> | null;
  brands?: Opt[];
  categories?: Opt[];
  onClose: () => void;
  onReviewed: () => void;
}) {
  const [current, setCurrent] = useState<Record<string, any> | null>(null);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [busy, setBusy] = useState<null | "approve" | "reject">(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [{ data: p }, { data: imgs }] = await Promise.all([
        supabase.from("products").select("*").eq("id", productId).maybeSingle(),
        supabase.from("product_images").select("url,sort_order").eq("product_id", productId).order("sort_order"),
      ]);
      if (!alive) return;
      setCurrent((p ?? {}) as Record<string, any>);
      setCurrentImages(((imgs ?? []) as { url: string }[]).map((i) => i.url));
    })();
    return () => {
      alive = false;
    };
  }, [productId]);

  const changes = pendingChanges ?? {};
  const keys = Object.keys(changes);

  function label(key: string, value: unknown): string {
    if (value === null || value === undefined || value === "") return "—";
    if (key === "brand_id") return brands.find((b) => b.id === value)?.name ?? String(value);
    if (key === "category_id") return categories.find((c) => c.id === value)?.name ?? String(value);
    if (key === "description" || key === "short_description") {
      const text = stripHtml(String(value));
      return text.length > 400 ? `${text.slice(0, 400)}…` : text || "—";
    }
    if (key === "images") {
      const arr = Array.isArray(value) ? value : [];
      return `${arr.length} image${arr.length === 1 ? "" : "s"}`;
    }
    if (key === "weight_grams") return `${Number(value) / 1000} kg`;
    return String(value);
  }

  function currentValue(key: string): unknown {
    if (key === "images") return currentImages.map((url) => ({ url }));
    return current?.[key] ?? null;
  }

  async function act(approve: boolean) {
    setBusy(approve ? "approve" : "reject");
    try {
      await reviewProduct(productId, approve);
      toast.success(approve ? "Changes approved" : "Changes rejected");
      onReviewed();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <AppModal open onClose={onClose} title="Review supplier changes" subtitle={productName} size="lg">
      {!current ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : keys.length === 0 ? (
        <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
          This product is waiting for first-time approval — no field-level change list, the whole product is new.
        </div>
      ) : (
        <div className="space-y-2">
          {keys.map((k) => {
            const before = currentValue(k);
            const after = (changes as Record<string, unknown>)[k];
            return (
              <div key={k} className="rounded-lg border p-3">
                <div className="mb-1.5 text-xs font-medium text-muted-foreground">{LABELS[k] ?? k}</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-md bg-muted/40 p-2 text-sm">
                    <div className="mb-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">Current</div>
                    <div className="break-words line-through decoration-muted-foreground/50">{label(k, before)}</div>
                  </div>
                  <div className="rounded-md bg-emerald-500/10 p-2 text-sm">
                    <div className="mb-0.5 text-[10px] uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                      Requested
                    </div>
                    <div className="break-words font-medium">{label(k, after)}</div>
                  </div>
                </div>
                {k === "images" && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(Array.isArray(after) ? (after as { url: string }[]) : []).slice(0, 8).map((im, idx) => (
                      <img key={idx} src={im.url} alt="" className="h-14 w-14 rounded border object-cover" />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={!!busy}>
          Close
        </Button>
        <Button
          variant="outline"
          className="border-red-500/40 text-red-600 hover:bg-red-500/10"
          onClick={() => act(false)}
          disabled={!!busy}
        >
          {busy === "reject" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
          Reject
        </Button>
        <Button onClick={() => act(true)} disabled={!!busy}>
          {busy === "approve" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
          Approve
        </Button>
      </div>
    </AppModal>
  );
}
