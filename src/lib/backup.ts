import { api } from "@/lib/api-client";
import { getToken } from "@/integrations/auth/token";

export interface BackupItem {
  filename: string;
  type: "database" | "files";
  extension: string;
  size: string;
  size_bytes: number;
  created_at: string;
  created_at_raw: number;
}

export interface BackupStats {
  total_backups: number;
  total_backup_size: string;
  total_backup_bytes: number;
  db_size_mb: number;
  uploads_size: string;
  uploads_bytes: number;
  uploads_files_count: number;
}

export interface BackupListResponse {
  ok: boolean;
  backups: BackupItem[];
  stats: BackupStats;
}

export const backupApi = {
  async list(): Promise<BackupListResponse> {
    return api.get<BackupListResponse>("admin/backup/list");
  },

  async createDb(): Promise<{ ok: boolean; message: string; filename: string; size: string }> {
    return api.post("admin/backup/create-db", undefined, { timeout: 300000 });
  },

  async createFiles(): Promise<{ ok: boolean; message: string; filename: string; size: string; files_count: number }> {
    return api.post("admin/backup/create-files", undefined, { timeout: 300000 });
  },

  async restoreDb(options: { filename?: string; file?: File }): Promise<{ ok: boolean; message: string; queries_executed?: number; warnings?: number }> {
    if (options.file) {
      const formData = new FormData();
      formData.append("file", options.file);
      return api.upload("admin/backup/restore-db", formData, { timeout: 300000 });
    }
    return api.post("admin/backup/restore-db", { filename: options.filename }, { timeout: 300000 });
  },

  async restoreFiles(options: { filename?: string; file?: File }): Promise<{ ok: boolean; message: string; files_restored?: number }> {
    if (options.file) {
      const formData = new FormData();
      formData.append("file", options.file);
      return api.upload("admin/backup/restore-files", formData, { timeout: 300000 });
    }
    return api.post("admin/backup/restore-files", { filename: options.filename }, { timeout: 300000 });
  },

  async delete(filename: string): Promise<{ ok: boolean; message: string }> {
    return api.post("admin/backup/delete", { filename });
  },

  async download(filename: string) {
    const token = getToken();
    const qs = token ? `?token=${encodeURIComponent(token)}` : "";
    const downloadUrl = `/api/admin/backup/download/${encodeURIComponent(filename)}${qs}`;

    // Direct browser streaming download (memory-efficient for large archives)
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 150);
  },
};
