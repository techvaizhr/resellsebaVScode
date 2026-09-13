import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui-kit";
import {
  Image as ImageIcon,
  Trash2,
  Upload,
  Search,
  Filter,
  Loader2,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { validateAndCompress, blobToDataUrl } from "@/lib/image-upload";
import { listUploadedFilesServer, saveUploadedFileServer, deleteUploadedFileServer } from "@/lib/upload.functions";
import type { MediaItem } from "@/components/MediaLibraryModal";
import { Pagination, usePaginated } from "@/components/data-list";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: AdminMediaPage,
});

const FOLDERS = [
  { id: "all", label: "All Media", icon: FolderOpen },
  { id: "products", label: "Products", icon: ImageIcon },
  { id: "branding", label: "Branding", icon: ImageIcon },
  { id: "brands", label: "Brands", icon: ImageIcon },
  { id: "categories", label: "Categories", icon: ImageIcon },
  { id: "stores", label: "Reseller Stores", icon: ImageIcon },
  { id: "avatars", label: "Avatars", icon: ImageIcon },
  { id: "notices", label: "Notices", icon: ImageIcon },
  { id: "tutorials", label: "Tutorials", icon: ImageIcon },
];

function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [unusedOnly, setUnusedOnly] = useState(false);
  const [unusedCount, setUnusedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [folderCounts, setFolderCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(48);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await listUploadedFilesServer({
        data: {
          folder: selectedFolder,
          unused_only: unusedOnly,
          search,
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
    loadMedia();
    setSelectedPaths(new Set());
    setPage(1);
  }, [selectedFolder, unusedOnly, search, perPage]);

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
      toast.success("Images uploaded to Media Library!");
      await loadMedia();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSingleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete image ${item.filename}?`)) return;
    try {
      await deleteUploadedFileServer({ data: { path: item.path } });
      toast.success("Image deleted successfully!");
      setItems((prev) => prev.filter((i) => i.path !== item.path));
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPaths.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedPaths.size} selected image(s)?`)) return;
    setBusy(true);
    try {
      for (const p of Array.from(selectedPaths)) {
        await deleteUploadedFileServer({ data: { path: p } });
      }
      toast.success(`${selectedPaths.size} image(s) deleted successfully!`);
      setSelectedPaths(new Set());
      await loadMedia();
    } catch (err: any) {
      toast.error(err.message || "Bulk delete failed");
    } finally {
      setBusy(false);
    }
  };

  const handleCleanUnused = async () => {
    const unusedItems = items.filter((i) => !i.is_used);
    if (unusedItems.length === 0) {
      toast.info("No unused images to clean!");
      return;
    }
    if (!confirm(`Delete all ${unusedItems.length} unused image(s) to free up storage space?`)) return;
    setBusy(true);
    try {
      for (const i of unusedItems) {
        await deleteUploadedFileServer({ data: { path: i.path } });
      }
      toast.success(`Cleaned ${unusedItems.length} unused images!`);
      await loadMedia();
    } catch (err: any) {
      toast.error(err.message || "Cleanup failed");
    } finally {
      setBusy(false);
    }
  };

  const totalSizeMB = (items.reduce((acc, i) => acc + (i.size || 0), 0) / (1024 * 1024)).toFixed(1);
  const totalDisplay = totalCount || items.length;
  const inUseCount = Math.max(0, totalDisplay - unusedCount);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          title="Media Library & Asset Manager"
          description="Manage, categorize, and clean up product and brand assets."
        />
        <div className="flex items-center gap-2">
          {unusedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCleanUnused}
              disabled={busy}
              className="rounded-xl border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 text-xs font-semibold gap-1.5"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Clean {unusedCount} Unused</span>
            </Button>
          )}

          <label className="btn-brand inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-md cursor-pointer">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span>Upload Media</span>
            <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="surface-card p-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">{totalDisplay}</div>
            <div className="text-xs text-muted-foreground">Total Images</div>
          </div>
        </div>
        <div className="surface-card p-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">{inUseCount}</div>
            <div className="text-xs text-muted-foreground">In-Use Assets</div>
          </div>
        </div>
        <div className="surface-card p-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">{unusedCount}</div>
            <div className="text-xs text-muted-foreground">Unused / Orphans</div>
          </div>
        </div>
        <div className="surface-card p-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">{totalSizeMB} MB</div>
            <div className="text-xs text-muted-foreground">Disk Space</div>
          </div>
        </div>
      </div>

      {/* Filter and Category Bar */}
      <div className="surface-card p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {FOLDERS.map((f) => {
              const count = folderCounts[f.id] ?? (f.id === "all" ? totalCount : 0);
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFolder(f.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                    selectedFolder === f.id
                      ? "bg-primary text-primary-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <span>{f.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular-nums",
                      selectedFolder === f.id
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
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all",
                unusedOnly
                  ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-xs"
                  : "border-border/70 text-muted-foreground hover:bg-muted"
              )}
            >
              <Filter className="h-3.5 w-3.5" />
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
              <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search file name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadMedia()}
                className="rounded-xl border border-border/70 bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="rounded-xl border border-border/70 bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
              title="Items per page"
            >
              {[24, 48, 96, 120].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
              <option value={-1}>All</option>
            </select>
          </div>
        </div>

        {selectedPaths.size > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-destructive/10 px-4 py-2 border border-destructive/20 text-destructive text-xs">
            <span>{selectedPaths.size} image(s) selected</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={busy}
              className="rounded-lg text-xs font-bold gap-1.5 h-8"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete Selected ({selectedPaths.size})
            </Button>
          </div>
        )}
      </div>

      {/* Media Grid */}
      <div className="surface-card p-6 min-h-[400px]">
        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground mb-3">
              <ImageIcon className="h-7 w-7" />
            </div>
            <h3 className="text-sm font-bold text-foreground">No media files found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Upload product photos, store logos or banners to see them in this library.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {pagedItems.map((item) => {
                const isSelected = selectedPaths.has(item.path);
                return (
                  <div
                    key={item.path}
                    onClick={() => {
                      const next = new Set(selectedPaths);
                      if (next.has(item.path)) next.delete(item.path);
                      else next.add(item.path);
                      setSelectedPaths(next);
                    }}
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
                      {!item.is_used && (
                        <span className="absolute top-1.5 left-1.5 rounded-md bg-amber-500/90 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                          Unused
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSingleDelete(item);
                        }}
                        className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-destructive/90 p-1.5 text-destructive-foreground hover:bg-destructive shadow-xs"
                        title="Delete image"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="p-2.5 bg-card">
                      <div className="truncate text-xs font-semibold text-foreground">{item.filename}</div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                        <span className="capitalize">{item.folder}</span>
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
    </div>
  );
}
