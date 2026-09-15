import { api } from "@/lib/api-client";

export interface ServerUploadedItem {
  filename: string;
  path: string;
  url: string;
  folder: string;
  size: number;
  last_modified: string;
  is_used?: boolean;
}

export function invalidateMediaCache() {}

/**
 * Uploads image to backend via /api/upload/image (zero Node.js Buffer or fs dependency)
 */
export async function saveUploadedFileServer(args: any): Promise<{
  url: string;
  path: string;
  filename: string;
  size: number;
}> {
  const data = args?.data || args;
  const { base64, folder, filename } = data;
  return await api.post<{
    url: string;
    path: string;
    filename: string;
    size: number;
  }>("/upload/image", {
    base64,
    folder: folder || "products",
    filename,
  });
}

/**
 * Lists all uploaded files from the backend filesystem.
 */
export async function listUploadedFilesServer(args?: any): Promise<{
  data: ServerUploadedItem[];
  unused_count: number;
  total: number;
  folder_counts: Record<string, number>;
}> {
  const data = args?.data || args || {};
  const params = new URLSearchParams();
  if (data.folder) params.set("folder", data.folder);
  if (data.search) params.set("search", data.search);
  if (data.unused_only) params.set("unused_only", "1");
  const qs = params.toString();
  return await api.get<{
    data: ServerUploadedItem[];
    unused_count: number;
    total: number;
    folder_counts: Record<string, number>;
  }>(`/upload/list${qs ? `?${qs}` : ""}`);
}

/**
 * Deletes an uploaded file or multiple files from the server.
 */
export async function deleteUploadedFileServer(args: any): Promise<{ success: boolean; ok?: boolean; deleted?: string[] }> {
  const data = args?.data || args;
  return await api.post<{ success: boolean; ok?: boolean; deleted?: string[] }>("/upload/delete", {
    path: data.path,
    paths: data.paths,
  });
}
