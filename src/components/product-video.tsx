import { useState } from "react";
import { Check, Copy, Download, Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import { youtubeEmbed } from "@/lib/tutorials";

function safeName(base: string) {
  return (
    base
      .toLowerCase()
      .replace(/[^a-z0-9\u0980-\u09FF]+/g, "-")
      .replace(/^-+|-+$/g, "") || "product"
  );
}

export function VideoDownloadButton({
  fileUrl,
  baseName,
  className,
}: {
  fileUrl: string;
  baseName: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function download(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    try {
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const ext = (fileUrl.split("?")[0]?.split(".").pop() || "mp4").slice(0, 5);
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `${safeName(baseName)}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
      toast.success("Video downloaded");
    } catch {
      toast.error("Could not download the video");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={busy}
      title="Download video"
      className={
        className ??
        "inline-flex items-center gap-1 rounded-lg border bg-card/90 px-2 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur hover:border-primary/50 hover:text-primary disabled:opacity-60"
      }
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} Video
    </button>
  );
}

export function CopyVideoLinkButton({ url }: { url: string }) {
  const [done, setDone] = useState(false);

  async function copy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setDone(true);
      toast.success("Video link copied");
      setTimeout(() => setDone(false), 1600);
    } catch {
      toast.error("Could not copy the link");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy video link"
      className="btn-brand inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold shadow-sm"
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copy video link
    </button>
  );
}

/**
 * Product video block: YouTube embed and/or uploaded file with 1-click download.
 * Renders nothing when the product has no video.
 */
export function ProductVideo({
  youtubeUrl,
  fileUrl,
  name,
  className,
}: {
  youtubeUrl?: string | null;
  fileUrl?: string | null;
  name: string;
  className?: string;
}) {
  const embed = youtubeUrl ? youtubeEmbed(youtubeUrl) : null;
  if (!embed && !fileUrl) return null;

  return (
    <div className={className ?? "space-y-2"}>
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
          <Play className="h-3 w-3" /> Product video
        </span>
        {fileUrl && <VideoDownloadButton fileUrl={fileUrl} baseName={name} />}
      </div>
      <div className="overflow-hidden rounded-xl border bg-black">
        {embed ? (
          <iframe
            src={embed}
            title={`${name} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="aspect-video w-full"
          />
        ) : (
          <video src={fileUrl!} controls preload="metadata" className="aspect-video w-full bg-black" />
        )}
      </div>
      {embed && fileUrl && (
        <video src={fileUrl} controls preload="metadata" className="aspect-video w-full rounded-xl border bg-black" />
      )}
    </div>
  );
}
