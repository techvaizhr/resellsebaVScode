import { useRef, useState } from "react";
import { Loader2, Trash2, Upload, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MAX_BYTES = 200 * 1024 * 1024;

/**
 * Single product video file uploader (private bucket, long-lived signed URL).
 * Returns the playable/downloadable URL, or null when cleared.
 */
export function VideoUploader({
  value,
  onChange,
  folder = "master",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function handle(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Please choose a video file");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Video is too large (max 200MB)");
      return;
    }
    setBusy(true);
    try {
      const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("product-videos").upload(path, file, {
        contentType: file.type || "video/mp4",
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) throw error;
      const { data: signed } = await supabase.storage
        .from("product-videos")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
      if (!signed?.signedUrl) throw new Error("Could not create video link");
      onChange(signed.signedUrl);
      toast.success("Video uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Video upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="space-y-2">
          <video src={value} controls preload="metadata" className="max-h-56 w-full rounded-lg border bg-black" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove video
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => ref.current?.click()}
          className="inline-flex items-center gap-2 rounded-md border border-dashed px-4 py-3 text-sm font-medium hover:border-primary/60 hover:text-primary disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? "Uploading…" : "Upload video file"}
        </button>
      )}
      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Video className="h-3 w-3" /> MP4 recommended, max 200MB. Uploaded file is what the 1-click download gives.
      </p>
      <input
        ref={ref}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
      />
    </div>
  );
}
