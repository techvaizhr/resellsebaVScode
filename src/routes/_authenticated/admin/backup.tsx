import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { PageHeader, StatCard, EmptyState } from "@/components/ui-kit";
import { ConfirmModal } from "@/components/ui-kit/ConfirmModal";
import { backupApi, type BackupItem, type BackupStats } from "@/lib/backup";
import {
  Database,
  Archive,
  Download,
  RotateCcw,
  Trash2,
  Upload,
  RefreshCw,
  HardDrive,
  ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileCode2,
  FolderArchive,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/backup")({
  component: AdminBackupPage,
  head: () => ({
    meta: [
      { title: "Backup & Restore · Admin" },
      {
        name: "description",
        content: "Dynamic full database and uploads image backup and restore system.",
      },
    ],
  }),
});

function AdminBackupPage() {
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingDb, setCreatingDb] = useState(false);
  const [creatingFiles, setCreatingFiles] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "database" | "files">("all");

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    detail?: string;
    variant: "danger" | "warning" | "info";
    confirmText: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    description: "",
    variant: "warning",
    confirmText: "Confirm",
    onConfirm: async () => {},
  });
  const [actionLoading, setActionLoading] = useState(false);

  // File upload inputs
  const dbFileInputRef = useRef<HTMLInputElement | null>(null);
  const filesInputRef = useRef<HTMLInputElement | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const res = await backupApi.list();
      if (res.ok) {
        setBackups(res.backups || []);
        setStats(res.stats || null);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to load backups list");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // 1. Create DB Backup
  async function handleCreateDb() {
    setCreatingDb(true);
    try {
      const res = await backupApi.createDb();
      toast.success(res.message || `Database backup created! (${res.size})`);
      await loadData();
    } catch (e: any) {
      toast.error(e?.message || "Failed to create database backup");
    } finally {
      setCreatingDb(false);
    }
  }

  // 2. Create Files/Images Backup
  async function handleCreateFiles() {
    setCreatingFiles(true);
    try {
      const res = await backupApi.createFiles();
      toast.success(res.message || `Images backup created! (${res.files_count} files, ${res.size})`);
      await loadData();
    } catch (e: any) {
      toast.error(e?.message || "Failed to create media backup");
    } finally {
      setCreatingFiles(false);
    }
  }

  // 3. Download Backup
  async function handleDownload(item: BackupItem) {
    try {
      toast.loading(`Downloading ${item.filename}...`, { id: "download" });
      await backupApi.download(item.filename);
      toast.success("Download started!", { id: "download" });
    } catch (e: any) {
      toast.error(e?.message || "Download failed", { id: "download" });
    }
  }

  // 4. Restore from Server Backup
  function confirmRestoreServer(item: BackupItem) {
    const isDb = item.type === "database";
    setConfirmModal({
      isOpen: true,
      title: isDb ? "Restore Database" : "Restore Media & Images",
      description: isDb
        ? "Warning: Restoring the database will overwrite current tables and records with the data from this backup file. Are you sure you want to proceed?"
        : "Warning: Restoring media will extract and overwrite files in public/uploads with files from this archive. Are you sure?",
      detail: `File: ${item.filename} (${item.size})`,
      variant: "danger",
      confirmText: "Yes, Restore Now",
      onConfirm: async () => {
        setActionLoading(true);
        try {
          if (isDb) {
            const res = await backupApi.restoreDb({ filename: item.filename });
            toast.success(res.message || "Database restored successfully!");
          } else {
            const res = await backupApi.restoreFiles({ filename: item.filename });
            toast.success(res.message || "Media images restored successfully!");
          }
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          await loadData();
        } catch (e: any) {
          toast.error(e?.message || "Restore operation failed");
        } finally {
          setActionLoading(false);
        }
      },
    });
  }

  // 5. Delete Server Backup
  function confirmDelete(item: BackupItem) {
    setConfirmModal({
      isOpen: true,
      title: "Delete Backup File",
      description: "Are you sure you want to permanently delete this backup file? This action cannot be undone.",
      detail: `${item.filename} (${item.size})`,
      variant: "danger",
      confirmText: "Delete File",
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const res = await backupApi.delete(item.filename);
          toast.success(res.message || "Backup deleted successfully");
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          await loadData();
        } catch (e: any) {
          toast.error(e?.message || "Failed to delete backup");
        } finally {
          setActionLoading(false);
        }
      },
    });
  }

  // 6. Restore from Uploaded File (DB or ZIP)
  async function handleFileUpload(file: File, type: "database" | "files") {
    const isDb = type === "database";
    setConfirmModal({
      isOpen: true,
      title: isDb ? "Restore Database from Upload" : "Restore Images from Upload",
      description: isDb
        ? `You are about to restore the database using uploaded file "${file.name}". Current database tables will be updated. Proceed?`
        : `You are about to restore uploaded archive "${file.name}" into public/uploads/. Existing images with same names will be overwritten. Proceed?`,
      detail: `Upload: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
      variant: "danger",
      confirmText: "Upload & Restore",
      onConfirm: async () => {
        setActionLoading(true);
        try {
          if (isDb) {
            const res = await backupApi.restoreDb({ file });
            toast.success(res.message || "Database restored successfully from uploaded file!");
          } else {
            const res = await backupApi.restoreFiles({ file });
            toast.success(res.message || "Media images restored successfully from uploaded archive!");
          }
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          await loadData();
        } catch (e: any) {
          toast.error(e?.message || "Restore from upload failed");
        } finally {
          setActionLoading(false);
          if (dbFileInputRef.current) dbFileInputRef.current.value = "";
          if (filesInputRef.current) filesInputRef.current.value = "";
        }
      },
    });
  }

  const filteredBackups = backups.filter((b) => {
    if (filterType === "all") return true;
    return b.type === filterType;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Backup & Restore"
        description="Dynamic 1-click database SQL backup, uploads media ZIP archive, and safe restoration."
        actions={
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <RefreshCw className={"h-4 w-4 " + (loading ? "animate-spin" : "")} /> Refresh
          </button>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Database Size"
          value={stats ? `${stats.db_size_mb} MB` : "—"}
          hint="MySQL live database tables"
          icon={<Database className="h-5 w-5 text-indigo-500" />}
        />
        <StatCard
          title="Uploads & Images Storage"
          value={stats?.uploads_size || "—"}
          hint={`${stats?.uploads_files_count?.toLocaleString() || 0} product images & media`}
          icon={<ImageIcon className="h-5 w-5 text-emerald-500" />}
        />
        <StatCard
          title="Saved Backups"
          value={stats ? `${stats.total_backups} files` : "—"}
          hint={`Total storage: ${stats?.total_backup_size || "0 MB"}`}
          icon={<HardDrive className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* Action Panels: Create Backup & Upload Restore */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Database Backup & Restore Box */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Database Backup & Restore</h3>
              <p className="text-xs text-muted-foreground">
                Dynamic SQL dump of all schemas, products, orders & settings.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <button
              onClick={handleCreateDb}
              disabled={creatingDb}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
            >
              {creatingDb ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Exporting Database...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" /> Create Database Backup (.sql)
                </>
              )}
            </button>

            <div className="relative">
              <input
                ref={dbFileInputRef}
                type="file"
                accept=".sql"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "database");
                }}
              />
              <button
                type="button"
                onClick={() => dbFileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Upload className="h-3.5 w-3.5 text-indigo-500" /> Upload & Restore .SQL File
              </button>
            </div>
          </div>
        </div>

        {/* Media / Images Backup & Restore Box */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Archive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Media & Images Backup & Restore</h3>
              <p className="text-xs text-muted-foreground">
                Zip archive of all product photos, brand logos, banners & uploads.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <button
              onClick={handleCreateFiles}
              disabled={creatingFiles}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
            >
              {creatingFiles ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Packing Images Archive...
                </>
              ) : (
                <>
                  <FolderArchive className="h-4 w-4" /> Create Images Backup (.zip)
                </>
              )}
            </button>

            <div className="relative">
              <input
                ref={filesInputRef}
                type="file"
                accept=".zip"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "files");
                }}
              />
              <button
                type="button"
                onClick={() => filesInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Upload className="h-3.5 w-3.5 text-emerald-500" /> Upload & Restore .ZIP Archive
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backup History Table */}
      <div className="rounded-xl border border-border bg-card shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Backup Files on Server</h3>
            <p className="text-xs text-muted-foreground">
              Stored securely in backend storage. Download or restore anytime.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1 text-xs font-medium">
            <button
              onClick={() => setFilterType("all")}
              className={`rounded-md px-3 py-1.5 transition-all ${
                filterType === "all"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({backups.length})
            </button>
            <button
              onClick={() => setFilterType("database")}
              className={`rounded-md px-3 py-1.5 transition-all ${
                filterType === "database"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Database ({backups.filter((b) => b.type === "database").length})
            </button>
            <button
              onClick={() => setFilterType("files")}
              className={`rounded-md px-3 py-1.5 transition-all ${
                filterType === "files"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Images ({backups.filter((b) => b.type === "files").length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-sm">Loading backup files...</p>
          </div>
        ) : filteredBackups.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No backup files yet"
              description="Click 'Create Database Backup' or 'Create Images Backup' above to generate your first backup."
              icon={<HardDrive className="h-10 w-10 text-muted-foreground/60" />}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Date Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBackups.map((item) => {
                  const isDb = item.type === "database";
                  return (
                    <tr key={item.filename} className="transition-colors hover:bg-muted/30">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${
                            isDb
                              ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {isDb ? <FileCode2 className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
                          {isDb ? "Database SQL" : "Images ZIP"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs font-medium text-foreground">
                        {item.filename}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">{item.size}</td>
                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                        {item.created_at}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Download */}
                          <button
                            type="button"
                            onClick={() => handleDownload(item)}
                            title="Download to PC"
                            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                          >
                            <Download className="h-3.5 w-3.5 text-primary" /> Download
                          </button>

                          {/* Restore */}
                          <button
                            type="button"
                            onClick={() => confirmRestoreServer(item)}
                            title="Restore this backup"
                            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-500/10 dark:text-amber-400"
                          >
                            <RotateCcw className="h-3.5 w-3.5" /> Restore
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => confirmDelete(item)}
                            title="Delete backup"
                            className="inline-flex items-center rounded-md border border-border bg-card p-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Safety Notice Card */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-900 dark:text-amber-200">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div>
          <h4 className="font-semibold">Important Backup & Restore Instructions</h4>
          <p className="mt-1 text-xs leading-relaxed opacity-90">
            • Database backups contain exact MySQL table definitions and data. Restoring an SQL backup will update all tables with the backup contents.
            <br />
            • Image backups package all product, store, brand, and category media into a unified `.zip` file.
            <br />
            • Backups are safely saved in backend storage and protected from direct unauthorized browser access.
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => {
          if (!actionLoading) setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        detail={confirmModal.detail}
        variant={confirmModal.variant}
        confirmText={confirmModal.confirmText}
        isLoading={actionLoading}
      />
    </div>
  );
}
