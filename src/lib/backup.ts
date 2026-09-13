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
    return api.post("admin/backup/create-db");
  },

  async createFiles(): Promise<{ ok: boolean; message: string; filename: string; size: string; files_count: number }> {
    return api.post("admin/backup/create-files");
  },

  async restoreDb(options: { filename?: string; file?: File }): Promise<{ ok: boolean; message: string; queries_executed?: number }> {
    if (options.file) {
      const formData = new FormData();
      formData.append("file", options.file);
      return api.upload("admin/backup/restore-db", formData);
    }
    return api.post("admin/backup/restore-db", { filename: options.filename });
  },

  async restoreFiles(options: { filename?: string; file?: File }): Promise<{ ok: boolean; message: string; files_restored?: number }> {
    if (options.file) {
      const formData = new FormData();
      formData.append("file", options.file);
      return api.upload("admin/backup/restore-files", formData);
    }
    return api.post("admin/backup/restore-files", { filename: options.filename });
  },

  async delete(filename: string): Promise<{ ok: boolean; message: string }> {
    return api.post("admin/backup/delete", { filename });
  },

  async download(filename: string) {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`/api/admin/backup/download/${encodeURIComponent(filename)}`, {
      headers,
    });
    if (!res.ok) {
      throw new Error("Failed to download backup file");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
};
