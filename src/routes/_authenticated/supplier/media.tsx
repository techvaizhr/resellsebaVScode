import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui-kit";
import {
  Image as ImageIcon,
  Trash2,
  Upload,
  Search,
  Loader2,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { validateAndCompress, blobToDataUrl } from "@/lib/image-upload";
import { listUploadedFilesServer, saveUploadedFileServer, deleteUploadedFileServer } from "@/lib/upload.functions";
import type { MediaItem } from "@/components/MediaLibraryModal";
import { Pagination, usePaginated } from "@/components/data-list";

export const Route = createFileRoute("/_authenticated/supplier/media")({
  component: SupplierMediaPage,
});

function SupplierMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unusedOnly, setUnusedOnly] = useState(false);
  const [unusedCount, setUnusedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
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
          folder: "products",
          unused_only: unusedOnly,
          search,
        },
      });
      setItems(res?.data ?? []);
      setUnusedCount(res?.unused_count ?? 0);
      setTotalCount(res?.total ?? (res?.data ?? []).length);
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
  }, [unusedOnly, search, perPage]);

  const pagedItems = usePaginated(
    items.filter((item) => item.filename.toLowerCase().includes(search.toLowerCase())),
    page,
    perPage
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const compressed = await validateAndCompress(file);
        const base64 = await blobToDataUrl(compressed.blob);
        await saveUploadedFileServer({
          data: {
            base64,
            folder: "products",
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
    if (!confirm(`Are you sure you want to permanently delete ${selectedPaths.size} selected image(s)?`)) return;
    setBusy(true);
    try {
      for (const p of Array.from(selectedPaths)) {
        await deleteUploadedFileServer({ data: { path: p } });
      }
      toast.success(`${selectedPaths.size} images deleted.`);
      setSelectedPaths(new Set());
      await loadMedia();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const toggleSelect = (path: string) => {
    setSelectedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const filteredItems = items.filter((item) =>
    item.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Supplier Media Gallery"
          description="Manage your uploaded product images, clear unused media, and save storage space."
        />
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:bg-primary/90 cursor-pointer">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>Upload Images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
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
            <div className="text-xl font-bold text-foreground">{totalCount}</div>
            <div className="text-xs text-muted-foreground">Total Images</div>
          </div>
        </div>
        <div className="surface-card p-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">{Math.max(0, totalCount - unusedCount)}</div>
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
            <div className="text-xl font-bold text-foreground">
              {(items.reduce((acc, i) => acc + (i.size || 0), 0) / (1024 * 1024)).toFixed(1)} MB
            </div>
            <div className="text-xs text-muted-foreground">Disk Space</div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="surface-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search images by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setUnusedOnly(!unusedOnly)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all",
                unusedOnly
                  ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "border-border/80 text-muted-foreground hover:bg-muted"
              )}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Unused Only</span>
              {unusedCount > 0 && (
                <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                  {unusedCount}
                </span>
              )}
            </button>

            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="rounded-xl border border-border/80 bg-background px-2.5 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              title="Items per page"
            >
              {[24, 48, 96, 120].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
              <option value={-1}>All</option>
            </select>

            {selectedPaths.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={busy}
                className="rounded-xl text-xs font-semibold gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Selected ({selectedPaths.size})</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="surface-card p-6 min-h-[350px]">
        {loading ? (
          <div className="grid place-items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground mb-3">
              <ImageIcon className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">No media files found</p>
            <p className="text-xs text-muted-foreground mt-1">Upload images to populate your product gallery.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {pagedItems.map((item) => {
                const isSelected = selectedPaths.has(item.path);
                return (
                  <div
                    key={item.path}
                    onClick={() => toggleSelect(item.path)}
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
                        <span>{item.folder}</span>
                        <span>{formatSize(item.size)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination
              page={page}
              perPage={perPage}
              total={filteredItems.length}
              onPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
