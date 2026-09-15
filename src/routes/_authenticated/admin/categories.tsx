import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/laravel/client";
import { PageHeader, EmptyState } from "@/components/ui-kit";
import { Plus, Loader2, Trash2, ChevronRight, Pencil, X, Sparkles, FolderTree, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader, type UploadedImage } from "@/components/ImageUploader";
import { confirmAction } from "@/lib/confirm";
import { useCan } from "@/lib/use-auth";

type Cat = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  parent_id: string | null;
  image_url: string | null;
  sort_order?: number;
};

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: CatsPage,
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function CatsPage() {
  const can = useCan();
  const canManage = can("categories.manage");
  const [items, setItems] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  // Modal State (Add & Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Cat | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parent, setParent] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<UploadedImage[]>([]);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,slug,is_active,parent_id,image_url,sort_order")
      .order("sort_order")
      .order("name");
    if (!error && data) {
      setItems(data as Cat[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const { parents, childrenByParent } = useMemo(() => {
    const parents = items.filter((i) => !i.parent_id);
    const map = new Map<string, Cat[]>();
    for (const c of items) {
      if (c.parent_id) {
        const arr = map.get(c.parent_id) ?? [];
        arr.push(c);
        map.set(c.parent_id, arr);
      }
    }
    return { parents, childrenByParent: map };
  }, [items]);

  function openCreateModal(parentId: string = "") {
    setEditingCat(null);
    setName("");
    setSlug("");
    setParent(parentId);
    setSortOrder(0);
    setIsActive(true);
    setImages([]);
    setModalOpen(true);
  }

  function openEditModal(c: Cat) {
    setEditingCat(c);
    setName(c.name);
    setSlug(c.slug);
    setParent(c.parent_id || "");
    setSortOrder(c.sort_order ?? 0);
    setIsActive(c.is_active ?? true);
    setImages(c.image_url ? [{ url: c.image_url, path: c.image_url, bytes: 0 }] : []);
    setModalOpen(true);
  }

  function closeModal() {
    if (busy) return;
    setModalOpen(false);
    setEditingCat(null);
  }

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCat) {
      setSlug(slugify(val));
    }
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name is required");

    setBusy(true);
    const imageUrl = images[0]?.url || null;
    const finalSlug = slugify(slug || name);
    const parentId = parent ? parent : null;

    try {
      if (editingCat) {
        const { error } = await supabase
          .from("categories")
          .update({
            name: name.trim(),
            slug: finalSlug,
            parent_id: parentId,
            image_url: imageUrl,
            sort_order: Number(sortOrder || 0),
            is_active: isActive,
          })
          .eq("id", editingCat.id);

        if (error) throw error;
        toast.success("Category updated successfully");
      } else {
        const { error } = await supabase.from("categories").insert({
          name: name.trim(),
          slug: finalSlug,
          parent_id: parentId,
          image_url: imageUrl,
          sort_order: Number(sortOrder || 0),
          is_active: isActive,
        });

        if (error) throw error;
        toast.success("Category added successfully");
        if (parentId) {
          setExpanded((s) => new Set(s).add(parentId));
        }
      }

      closeModal();
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to save category");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(c: Cat) {
    const nextStatus = !c.is_active;
    const { error } = await supabase
      .from("categories")
      .update({ is_active: nextStatus })
      .eq("id", c.id);
    if (error) toast.error(error.message);
    else {
      setItems((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, is_active: nextStatus } : item))
      );
    }
  }

  async function remove(c: Cat) {
    if (
      !(await confirmAction({
        title: "Delete category",
        description: "Are you sure you want to delete this category? Subcategories will be unlinked.",
        detail: c.name,
        confirmText: "Delete",
      }))
    )
      return;

    const { error } = await supabase.from("categories").delete().eq("id", c.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Category deleted");
      load();
    }
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filteredParents = parents.filter((p) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    const matchesParent = p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    const children = childrenByParent.get(p.id) ?? [];
    const matchesChild = children.some(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
    return matchesParent || matchesChild;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize catalog with main and subcategories for easy product browsing."
        actions={
          canManage ? (
            <button
              onClick={() => openCreateModal()}
              className="btn-brand inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" /> Add Category
            </button>
          ) : undefined
        }
      />

      {!loading && items.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories…"
            className="w-full max-w-sm rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="text-xs text-muted-foreground font-medium">
            Total: {items.length} {items.length === 1 ? "Category" : "Categories"} ({parents.length} Main)
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create your first catalog category to start organizing products."
          action={
            canManage ? (
              <button
                onClick={() => openCreateModal()}
                className="btn-brand inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold"
              >
                <Plus className="h-4 w-4" /> Add First Category
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="surface-card divide-y rounded-2xl border border-border/80 overflow-hidden shadow-xs">
          {filteredParents.map((p) => {
            const children = childrenByParent.get(p.id) ?? [];
            const isExpanded = expanded.has(p.id) || !!search.trim();

            return (
              <div key={p.id} className="divide-y divide-border/40">
                <CategoryRow
                  cat={p}
                  canManage={canManage}
                  childCount={children.length}
                  expanded={isExpanded}
                  onToggleExpand={children.length > 0 ? () => toggleExpand(p.id) : undefined}
                  onToggleActive={() => toggle(p)}
                  onEdit={() => openEditModal(p)}
                  onDelete={() => remove(p)}
                  onAddChild={() => openCreateModal(p.id)}
                />

                {isExpanded &&
                  children.map((c) => (
                    <CategoryRow
                      key={c.id}
                      cat={c}
                      indent
                      canManage={canManage}
                      onToggleActive={() => toggle(c)}
                      onEdit={() => openEditModal(c)}
                      onDelete={() => remove(c)}
                    />
                  ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Unified Category Modal (Add & Edit) */}
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
                  <FolderTree className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {editingCat ? "Edit Category" : "Add New Category"}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {editingCat ? "Update category details and icon" : "Create a new catalog category"}
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
                  Category Name <span className="text-destructive">*</span>
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Electronics, Fashion, Home & Kitchen"
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
                  placeholder="e.g. electronics"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground font-mono outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  Parent Category (Optional)
                </label>
                <select
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  <option value="">— Top Level (Main Category) —</option>
                  {parents
                    .filter((p) => p.id !== editingCat?.id)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
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
                  Category Image / Icon
                </label>
                <ImageUploader
                  bucket="branding"
                  folder="categories"
                  value={images}
                  onChange={setImages}
                  square
                  label="Upload Category Image"
                  hint="PNG, JPG or WebP image"
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
                  <span>{editingCat ? "Save Changes" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryRow({
  cat,
  indent,
  onToggleActive,
  onDelete,
  onEdit,
  onAddChild,
  onToggleExpand,
  expanded,
  childCount,
  canManage,
}: {
  cat: Cat;
  indent?: boolean;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
  onAddChild?: () => void;
  onToggleExpand?: () => void;
  expanded?: boolean;
  childCount?: number;
  canManage: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3.5 p-3.5 sm:p-4 hover:bg-muted/30 transition-colors ${
        indent ? "pl-10 sm:pl-12 bg-muted/10" : ""
      }`}
    >
      {onToggleExpand ? (
        <button
          onClick={onToggleExpand}
          className="rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors"
          title={expanded ? "Collapse subcategories" : "Expand subcategories"}
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform duration-150 ${expanded ? "rotate-90 text-primary" : ""}`}
          />
        </button>
      ) : (
        <span className="w-6" />
      )}

      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-muted/50 grid place-items-center">
        {cat.image_url ? (
          <img src={cat.image_url} className="h-full w-full object-contain p-1" alt={cat.name} />
        ) : (
          <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-bold text-foreground">{cat.name}</span>
          {childCount ? (
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
              {childCount} {childCount === 1 ? "Sub" : "Subs"}
            </span>
          ) : null}
        </div>
        <div className="truncate text-xs text-muted-foreground font-mono">/{cat.slug}</div>
      </div>

      <div className="flex items-center gap-2">
        {onAddChild && canManage && (
          <button
            onClick={onAddChild}
            title="Add Subcategory under this category"
            className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-border/80 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Plus className="h-3.5 w-3.5 text-primary" />
            <span>Add Sub</span>
          </button>
        )}

        {canManage ? (
          <button
            onClick={onToggleActive}
            title={cat.is_active ? "Click to deactivate" : "Click to activate"}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              cat.is_active
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                : "border border-border bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                cat.is_active ? "bg-emerald-500" : "bg-muted-foreground/60"
              }`}
            />
            {cat.is_active ? "Active" : "Hidden"}
          </button>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              cat.is_active
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                : "border border-border bg-muted text-muted-foreground"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                cat.is_active ? "bg-emerald-500" : "bg-muted-foreground/60"
              }`}
            />
            {cat.is_active ? "Active" : "Hidden"}
          </span>
        )}

        {canManage && (
          <button
            onClick={onEdit}
            title="Edit category"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}

        {canManage && (
          <button
            onClick={onDelete}
            title="Delete category"
            className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
