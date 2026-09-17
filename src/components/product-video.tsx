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
      className="btn-brand inline-flex max-w-full shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-semibold shadow-sm sm:px-2.5 sm:text-[11px]"
    >
      {done ? <Check className="h-3.5 w-3.5 shrink-0" /> : <Copy className="h-3.5 w-3.5 shrink-0" />}
      <span className="hidden sm:inline">Copy video link</span>
      <span className="sm:hidden">Link</span>
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

  const vertical = !!youtubeUrl && /\/shorts\/|\/reel|[?&]feature=shorts/i.test(youtubeUrl);
  const ratio = vertical
    ? "aspect-[9/16] w-full max-w-[240px] sm:max-w-[280px]"
    : "aspect-video w-full";

  return (
    <div className={className ?? "space-y-2"}>
      <div className="relative overflow-hidden rounded-xl border bg-black">
        {embed ? (
          <iframe
            src={embed}
            title={`${name} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className={`block ${ratio}`}
          />
        ) : (
          <video src={fileUrl!} controls preload="metadata" className={`block bg-black ${ratio}`} />
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
            <Play className="h-3 w-3" /> Video
          </span>
          <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-1.5">
            {fileUrl && <VideoDownloadButton fileUrl={fileUrl} baseName={name} />}
            {!fileUrl && youtubeUrl && <CopyVideoLinkButton url={youtubeUrl} />}
          </div>
        </div>
      </div>
      {embed && fileUrl && (
        <video src={fileUrl} controls preload="metadata" className="aspect-video w-full rounded-xl border bg-black" />
      )}
    </div>
  );
}
