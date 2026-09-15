import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/laravel/client";
import { PageHeader, EmptyState } from "@/components/ui-kit";
import { Plus, Loader2, Trash2, Pencil, X, Sparkles, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader, type UploadedImage } from "@/components/ImageUploader";
import { confirmAction } from "@/lib/confirm";
import { useCan } from "@/lib/use-auth";

type Brand = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  image_url: string | null;
  logo_url?: string | null;
  sort_order: number;
};

export const Route = createFileRoute("/_authenticated/admin/brands")({
  component: BrandsPage,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function BrandsPage() {
  const can = useCan();
  const canManage = can("brands.manage");
  const [items, setItems] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<UploadedImage[]>([]);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("brands")
      .select("id,name,slug,is_active,image_url,sort_order")
      .order("sort_order")
      .order("name");
    if (!error && data) {
      setItems(data as Brand[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreateModal() {
    setEditingBrand(null);
    setName("");
    setSlug("");
    setSortOrder(0);
    setIsActive(true);
    setImages([]);
    setModalOpen(true);
  }

  function openEditModal(b: Brand) {
    setEditingBrand(b);
    setName(b.name);
    setSlug(b.slug);
    setSortOrder(b.sort_order ?? 0);
    setIsActive(b.is_active ?? true);
    const imgUrl = b.image_url || b.logo_url;
    setImages(imgUrl ? [{ url: imgUrl, path: imgUrl, bytes: 0 }] : []);
    setModalOpen(true);
  }

  function closeModal() {
    if (busy) return;
    setModalOpen(false);
    setEditingBrand(null);
  }

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingBrand) {
      setSlug(slugify(val));
    }
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Brand name is required");

    setBusy(true);
    const imageUrl = images[0]?.url || null;
    const finalSlug = slugify(slug || name);

    try {
      if (editingBrand) {
        // Update existing brand
        const { error } = await supabase
          .from("brands")
          .update({
            name: name.trim(),
            slug: finalSlug,
            image_url: imageUrl,
            logo_url: imageUrl,
            sort_order: Number(sortOrder || 0),
            is_active: isActive,
          })
          .eq("id", editingBrand.id);

        if (error) throw error;
        toast.success("Brand updated successfully");
      } else {
        // Create new brand
        const { error } = await supabase.from("brands").insert({
          name: name.trim(),
          slug: finalSlug,
          image_url: imageUrl,
          logo_url: imageUrl,
          sort_order: Number(sortOrder || 0),
          is_active: isActive,
        });

        if (error) throw error;
        toast.success("Brand created successfully");
      }

      closeModal();
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to save brand");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(b: Brand) {
    const nextStatus = !b.is_active;
    const { error } = await supabase
      .from("brands")
      .update({ is_active: nextStatus })
      .eq("id", b.id);
    if (error) toast.error(error.message);
    else {
      setItems((prev) =>
        prev.map((item) => (item.id === b.id ? { ...item, is_active: nextStatus } : item))
      );
    }
  }

  async function remove(b: Brand) {
    if (
      !(await confirmAction({
        title: "Delete brand",
        description: "Are you sure you want to delete this brand? Products linked to it will remain but without brand.",
        detail: b.name,
        confirmText: "Delete",
      }))
    )
      return;

    const { error } = await supabase.from("brands").delete().eq("id", b.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Brand deleted");
      load();
    }
  }

  const filtered = items.filter((b) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brands"
        description="Organize and showcase products by their official brand names and logos."
        actions={
          canManage ? (
            <button
              onClick={openCreateModal}
              className="btn-brand inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" /> Add Brand
            </button>
          ) : undefined
        }
      />

      {!loading && items.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands…"
            className="w-full max-w-sm rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="text-xs text-muted-foreground font-medium">
            Total: {items.length} {items.length === 1 ? "Brand" : "Brands"}
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No brands yet"
          description="Add a brand to start organizing and filtering products."
          action={
            canManage ? (
              <button
                onClick={openCreateModal}
                className="btn-brand inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold"
              >
                <Plus className="h-4 w-4" /> Add First Brand
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="surface-card divide-y rounded-2xl border border-border/80 overflow-hidden shadow-xs">
          {filtered.map((b) => {
            const img = b.image_url || b.logo_url;
            return (
              <div
                key={b.id}
                className="flex items-center gap-3.5 p-3.5 sm:p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-muted/50 grid place-items-center">
                  {img ? (
                    <img src={img} className="h-full w-full object-contain p-1" alt={b.name} />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-foreground">{b.name}</div>
                  <div className="truncate text-xs text-muted-foreground font-mono">/{b.slug}</div>
                </div>

                <div className="flex items-center gap-2">
                  {canManage ? (
                    <button
                      onClick={() => toggle(b)}
                      title={b.is_active ? "Click to deactivate" : "Click to activate"}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                        b.is_active
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                          : "border border-border bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          b.is_active ? "bg-emerald-500" : "bg-muted-foreground/60"
                        }`}
                      />
                      {b.is_active ? "Active" : "Hidden"}
                    </button>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        b.is_active
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "border border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          b.is_active ? "bg-emerald-500" : "bg-muted-foreground/60"
                        }`}
                      />
                      {b.is_active ? "Active" : "Hidden"}
                    </span>
                  )}

                  {canManage && (
                    <button
                      onClick={() => openEditModal(b)}
                      title="Edit brand"
                      className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}

                  {canManage && (
                    <button
                      onClick={() => remove(b)}
                      title="Delete brand"
                      className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Unified Brand Modal (Add & Edit) */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {editingBrand ? "Edit Brand" : "Add New Brand"}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {editingBrand ? "Update brand details and logo" : "Create a new product brand"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  Brand Name <span className="text-destructive">*</span>
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Apple, Samsung, Xiaomi"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  Slug (URL Key)
                </label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. apple"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground font-mono outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-foreground">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-foreground">
                    Status
                  </label>
                  <select
                    value={isActive ? "1" : "0"}
                    onChange={(e) => setIsActive(e.target.value === "1")}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="1">Active</option>
                    <option value="0">Hidden / Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  Brand Logo / Image
                </label>
                <ImageUploader
                  bucket="branding"
                  folder="brands"
                  value={images}
                  onChange={setImages}
                  square
                  label="Upload Brand Logo"
                  hint="PNG, JPG or WebP square logo"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-border/60 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={busy}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="btn-brand inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-xs transition-all active:scale-95 disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  <span>{editingBrand ? "Save Changes" : "Create Brand"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
