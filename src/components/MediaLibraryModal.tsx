import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, Image as ImageIcon, Trash2, Check, Upload, Loader2, Filter } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { validateAndCompress, blobToDataUrl } from "@/lib/image-upload";
import { listUploadedFilesServer, saveUploadedFileServer, deleteUploadedFileServer } from "@/lib/upload.functions";
import { Pagination, usePaginated } from "@/components/data-list";

export interface MediaItem {
  filename: string;
  path: string;
  url: string;
  folder: string;
  size: number;
  last_modified: string;
  is_used?: boolean;
}

const CATEGORIES = [
  { id: "all", label: "All Media" },
  { id: "products", label: "Products" },
  { id: "branding", label: "Branding" },
  { id: "brands", label: "Brands" },
  { id: "categories", label: "Categories" },
  { id: "stores", label: "Reseller Stores" },
  { id: "avatars", label: "Avatars" },
  { id: "notices", label: "Notices" },
  { id: "tutorials", label: "Tutorials" },
];

export function MediaLibraryModal({
  open,
  onClose,
  onSelect,
  multiple = false,
  folder = "products",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (selected: { url: string; path: string }[]) => void;
  multiple?: boolean;
  folder?: string;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState(folder || "all");
  const [unusedOnly, setUnusedOnly] = useState(false);
  const [unusedCount, setUnusedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [folderCounts, setFolderCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(30);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await listUploadedFilesServer({
        data: {
          folder: selectedFolder,
          search,
          unused_only: unusedOnly,
        },
      });
      setItems(res?.data ?? []);
      setUnusedCount(res?.unused_count ?? 0);
      setTotalCount(res?.total ?? (res?.data ?? []).length);
      setFolderCounts(res?.folder_counts ?? {});
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadMedia();
      setSelectedUrls(new Set());
      setPage(1);
    }
  }, [open, selectedFolder, unusedOnly, search, perPage]);

  const pagedItems = usePaginated(items, page, perPage);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const targetFolder = selectedFolder === "all" ? "products" : selectedFolder;
      for (const file of Array.from(files)) {
        const compressed = await validateAndCompress(file);
        const base64 = await blobToDataUrl(compressed.blob);
        await saveUploadedFileServer({
          data: {
            base64,
            folder: targetFolder,
          },
        });
      }
      toast.success("Image uploaded & saved successfully!");
      await loadMedia();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Are you sure you want to delete ${item.filename}?`)) return;
    setDeleting(item.path);
    try {
      await deleteUploadedFileServer({ data: { path: item.path } });
      toast.success("Image deleted successfully!");
      setItems((prev) => prev.filter((i) => i.path !== item.path));
      if (selectedUrls.has(item.url)) {
        const next = new Set(selectedUrls);
        next.delete(item.url);
        setSelectedUrls(next);
      }
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const toggleSelect = (item: MediaItem) => {
    if (!multiple) {
      onSelect([{ url: item.url, path: item.path }]);
      onClose();
      return;
    }
    const next = new Set(selectedUrls);
    if (next.has(item.url)) next.delete(item.url);
    else next.add(item.url);
    setSelectedUrls(next);
  };

  const handleConfirmMulti = () => {
    const selected = items
      .filter((i) => selectedUrls.has(i.url))
      .map((i) => ({ url: i.url, path: i.path }));
    onSelect(selected);
    onClose();
  };

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200">
      <div className="surface-card relative flex h-[85vh] max-h-[720px] w-full max-w-4xl flex-col overflow-hidden border border-border/80 shadow-2xl bg-card rounded-2xl mx-auto my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-4 sm:px-6 py-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-foreground">Media Library & Gallery</h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Pick from existing uploads or add new images.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="btn-brand inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-xs cursor-pointer">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              <span>Upload New</span>
              <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Category tabs, Unused filter, Search */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border/50 bg-muted/20 px-4 sm:px-6 py-2.5 shrink-0">
          <div className="flex flex-wrap items-center gap-1">
            {CATEGORIES.map((cat) => {
              const count = folderCounts[cat.id] ?? (cat.id === "all" ? totalCount : 0);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFolder(cat.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                    selectedFolder === cat.id
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <span>{cat.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular-nums",
                      selectedFolder === cat.id
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setUnusedOnly(!unusedOnly)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium border transition-all",
                unusedOnly
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold shadow-xs"
                  : "border-border/60 text-muted-foreground hover:bg-muted"
              )}
            >
              <Filter className="h-3 w-3" />
              <span>Unused Only</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular-nums",
                  unusedOnly
                    ? "bg-amber-500 text-white"
                    : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                )}
              >
                {unusedCount}
              </span>
            </button>

            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search images..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadMedia()}
                className="w-32 sm:w-44 rounded-lg border border-border/60 bg-background pl-8 pr-3 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>

            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="rounded-lg border border-border/60 bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
              title="Items per page"
            >
              {[18, 30, 60, 120].map((n) => (
                <option key={n} value={n}>
                  {n}/p
                </option>
              ))}
              <option value={-1}>All</option>
            </select>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 no-scrollbar flex flex-col justify-between">
          {loading ? (
            <div className="grid h-full place-items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground mb-3">
                <ImageIcon className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">No media found</p>
              <p className="text-xs text-muted-foreground mt-1">Upload images or change your filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {pagedItems.map((item) => {
                  const isSelected = selectedUrls.has(item.url);
                  return (
                    <div
                      key={item.path}
                      onClick={() => toggleSelect(item)}
                      className={cn(
                        "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all cursor-pointer select-none",
                        isSelected
                          ? "border-primary ring-2 ring-primary shadow-md"
                          : "border-border/60 hover:border-primary/50 hover:shadow-sm"
                      )}
                    >
                      <div className="relative aspect-square w-full overflow-hidden bg-muted/40">
                        <img
                          src={item.url}
                          alt={item.filename}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex items-center justify-center">
                            <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground shadow-md">
                              <Check className="h-4 w-4 stroke-[3]" />
                            </div>
                          </div>
                        )}
                        {!item.is_used && (
                          <span className="absolute top-1.5 left-1.5 rounded-md bg-amber-500/90 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                            Unused
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item);
                          }}
                          disabled={deleting === item.path}
                          className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-destructive/90 p-1.5 text-destructive-foreground hover:bg-destructive shadow-xs"
                        >
                          {deleting === item.path ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      <div className="p-2 bg-card">
                        <div className="truncate text-[11px] font-medium text-foreground">{item.filename}</div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-0.5">
                          <span>{item.folder}</span>
                          <span>{Math.round(item.size / 1024)} KB</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Pagination
                page={page}
                perPage={perPage}
                total={items.length}
                onPage={setPage}
              />
            </div>
          )}
        </div>

        {/* Footer (for multiple selection) */}
        {multiple && (
          <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-6 py-3">
            <span className="text-xs font-medium text-muted-foreground">
              {selectedUrls.size} image(s) selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmMulti}
                disabled={selectedUrls.size === 0}
                className="btn-brand rounded-xl text-xs font-bold"
              >
                Insert Selected ({selectedUrls.size})
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
