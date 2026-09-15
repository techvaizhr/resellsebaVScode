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
  CheckSquare,
  Square,
  Sparkles,
  ExternalLink,
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
  const [statusFilter, setStatusFilter] = useState<"all" | "unused" | "used">("all");
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
          unused_only: statusFilter === "unused",
          search,
        },
      });
      let data = res?.data ?? [];
      if (statusFilter === "used") {
        data = data.filter((i) => i.is_used);
      }
      setItems(data);
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
  }, [selectedFolder, statusFilter, search, perPage]);

  const pagedItems = usePaginated(items, page, perPage === -1 ? 9999 : perPage);

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
    if (!confirm(`Delete image "${item.filename}" from server?`)) return;
    try {
      await deleteUploadedFileServer({ path: item.path });
      toast.success("Image deleted successfully!");
      setItems((prev) => prev.filter((i) => i.path !== item.path));
      setSelectedPaths((prev) => {
        const next = new Set(prev);
        next.delete(item.path);
        return next;
      });
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPaths.size === 0) return;
    if (!confirm(`Are you sure you want to permanently delete ${selectedPaths.size} selected image(s)?`)) return;
    setBusy(true);
    try {
      const pathsArray = Array.from(selectedPaths);
      await deleteUploadedFileServer({ paths: pathsArray });
      toast.success(`${pathsArray.length} image(s) deleted successfully!`);
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
      toast.info("No unused images found in current view!");
      return;
    }
    if (
      !confirm(
        `Are you sure you want to delete all ${unusedItems.length} unused image(s)? This will free up storage space.`
      )
    )
      return;

    setBusy(true);
    try {
      const pathsArray = unusedItems.map((i) => i.path);
      await deleteUploadedFileServer({ paths: pathsArray });
      toast.success(`Cleaned ${pathsArray.length} unused images!`);
      setSelectedPaths(new Set());
      await loadMedia();
    } catch (err: any) {
      toast.error(err.message || "Cleanup failed");
    } finally {
      setBusy(false);
    }
  };

  const toggleSelectAll = () => {
    const visiblePaths = pagedItems.map((i) => i.path);
    const allSelected = visiblePaths.every((p) => selectedPaths.has(p));

    if (allSelected) {
      // Deselect all visible
      const next = new Set(selectedPaths);
      visiblePaths.forEach((p) => next.delete(p));
      setSelectedPaths(next);
    } else {
      // Select all visible
      const next = new Set(selectedPaths);
      visiblePaths.forEach((p) => next.add(p));
      setSelectedPaths(next);
    }
  };

  const isAllVisibleSelected =
    pagedItems.length > 0 && pagedItems.every((i) => selectedPaths.has(i.path));

  const totalSizeMB = (items.reduce((acc, i) => acc + (i.size || 0), 0) / (1024 * 1024)).toFixed(1);
  const totalDisplay = totalCount || items.length;
  const inUseCount = Math.max(0, totalDisplay - unusedCount);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          title="Media Library & Asset Manager"
          description="Manage, organize, filter, and clean up product, brand, and platform assets."
        />
        <div className="flex items-center gap-2.5">
          {unusedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCleanUnused}
              disabled={busy}
              className="rounded-xl border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-semibold gap-1.5 shadow-xs"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Clean All ({unusedCount}) Unused</span>
            </Button>
          )}

          <label className="btn-brand inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span>Upload Media</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="surface-card p-3.5 sm:p-4 flex items-center gap-3 rounded-2xl border border-border/70 shadow-xs">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-bold text-foreground">{totalDisplay}</div>
            <div className="text-[11px] text-muted-foreground truncate">Total Images</div>
          </div>
        </div>

        <div className="surface-card p-3.5 sm:p-4 flex items-center gap-3 rounded-2xl border border-border/70 shadow-xs">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-bold text-foreground">{inUseCount}</div>
            <div className="text-[11px] text-muted-foreground truncate">In-Use Assets</div>
          </div>
        </div>

        <div className="surface-card p-3.5 sm:p-4 flex items-center gap-3 rounded-2xl border border-border/70 shadow-xs">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-bold text-foreground">{unusedCount}</div>
            <div className="text-[11px] text-muted-foreground truncate">Unused / Orphans</div>
          </div>
        </div>

        <div className="surface-card p-3.5 sm:p-4 flex items-center gap-3 rounded-2xl border border-border/70 shadow-xs">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600">
            <HardDrive className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-bold text-foreground">{totalSizeMB} MB</div>
            <div className="text-[11px] text-muted-foreground truncate">Storage Used</div>
          </div>
        </div>
      </div>

      {/* Folders & Filters Toolbar */}
      <div className="surface-card p-4 space-y-3.5 rounded-2xl border border-border/80 shadow-xs">
        {/* Folder Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-border/50 pb-3">
          {FOLDERS.map((f) => {
            const count = folderCounts[f.id] ?? (f.id === "all" ? totalCount : 0);
            const isCurrent = selectedFolder === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFolder(f.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <span>{f.label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular-nums",
                    isCurrent
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

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Select All Toggle */}
            <button
              type="button"
              onClick={toggleSelectAll}
              disabled={pagedItems.length === 0}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer",
                isAllVisibleSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/80 text-muted-foreground hover:bg-muted"
              )}
            >
              {isAllVisibleSelected ? (
                <CheckSquare className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Square className="h-3.5 w-3.5" />
              )}
              <span>{isAllVisibleSelected ? "Deselect All" : "Select All"}</span>
            </button>

            {/* Status Filter (All / Unused / In-Use) */}
            <div className="inline-flex rounded-xl border border-border/80 bg-background p-0.5">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                  statusFilter === "all"
                    ? "bg-muted text-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                All Status
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("unused")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                  statusFilter === "unused"
                    ? "bg-amber-500 text-white font-bold shadow-2xs"
                    : "text-amber-600 dark:text-amber-400 hover:text-amber-500"
                )}
              >
                <span>Unused (অব্যবহৃত)</span>
                <span className="text-[10px] tabular-nums font-bold">({unusedCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("used")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                  statusFilter === "used"
                    ? "bg-emerald-600 text-white font-bold shadow-2xs"
                    : "text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"
                )}
              >
                In-Use
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search by filename..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadMedia()}
                className="rounded-xl border border-border/80 bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Pagination Size */}
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="rounded-xl border border-border/80 bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              {[24, 48, 96, 120].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
              <option value={-1}>All Items</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar (when selected) */}
        {selectedPaths.size > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-destructive/10 px-4 py-2.5 border border-destructive/20 text-destructive text-xs animate-in fade-in">
            <span className="font-semibold">
              {selectedPaths.size} image(s) selected from current list
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPaths(new Set())}
                className="rounded-lg text-xs h-7 text-foreground border-border/80 hover:bg-muted"
              >
                Cancel Selection
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={busy}
                className="rounded-lg text-xs font-bold gap-1.5 h-7 shadow-xs"
              >
                {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                <span>Delete Selected ({selectedPaths.size})</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Media Gallery Grid */}
      <div className="surface-card p-4 sm:p-6 rounded-2xl border border-border/80 min-h-[400px] shadow-xs">
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
              {statusFilter === "unused"
                ? "Awesome! There are no orphaned or unused images in this folder."
                : "Upload product photos, store logos, or banners to see them in this library."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
                      "group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all cursor-pointer select-none",
                      isSelected
                        ? "border-primary ring-2 ring-primary/80 shadow-md scale-[0.99]"
                        : "border-border/70 hover:border-primary/50 hover:shadow-sm"
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

                      {/* Visible Checkbox Indicator */}
                      <div className="absolute top-2 left-2 z-10">
                        <div
                          className={cn(
                            "grid h-5 w-5 place-items-center rounded-md border transition-all shadow-xs",
                            isSelected
                              ? "bg-primary border-primary text-primary-foreground"
                              : "bg-black/40 border-white/60 text-transparent group-hover:border-white"
                          )}
                        >
                          <CheckSquare className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                        {!item.is_used ? (
                          <span className="rounded-md bg-amber-500/95 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                            Unused
                          </span>
                        ) : (
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity rounded-md bg-emerald-600/90 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                            In-Use
                          </span>
                        )}
                      </div>

                      {/* Hover Actions Bar */}
                      <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-lg bg-black/60 p-1.5 text-white hover:bg-black/90 shadow-xs"
                          title="Open full image"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSingleDelete(item);
                          }}
                          className="rounded-lg bg-destructive/90 p-1.5 text-destructive-foreground hover:bg-destructive shadow-xs"
                          title="Delete image"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 bg-card">
                      <div className="truncate text-xs font-semibold text-foreground" title={item.filename}>
                        {item.filename}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                        <span className="capitalize font-medium">{item.folder}</span>
                        <span>{Math.round(item.size / 1024)} KB</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {perPage !== -1 && (
              <Pagination
                page={page}
                perPage={perPage}
                total={items.length}
                onPage={setPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
