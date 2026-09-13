import { useRef, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon, GripVertical, Star } from "lucide-react";
import { supabase } from "@/integrations/laravel/client";
import { validateAndCompress, blobToDataUrl } from "@/lib/image-upload";
import { saveUploadedFileServer } from "@/lib/upload.functions";
import { toast } from "sonner";
import { MediaLibraryModal } from "@/components/MediaLibraryModal";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  path: string;
  url: string;
  bytes: number;
}

export function ImageUploader({
  bucket,
  folder,
  value,
  onChange,
  multiple = false,
  label = "Upload image",
  variant = "square",
  square = false,
  maxImages,
  hint,
}: {
  bucket: "product-images" | "branding" | string;
  folder: string;
  value: UploadedImage[];
  onChange: (v: UploadedImage[]) => void;
  multiple?: boolean;
  label?: string;
  variant?: "square" | "wide" | "hero";
  square?: boolean;
  maxImages?: number;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  const remaining = maxImages ? Math.max(0, maxImages - value.length) : Infinity;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const list = Array.from(files).slice(0, remaining === Infinity ? files.length : remaining);
      if (maxImages && files.length > remaining) {
        toast.message(`Max ${maxImages} images — extra files skipped.`);
      }
      const out: UploadedImage[] = [];
      for (const f of list) {
        const compressed = await validateAndCompress(f, { square });
        const base64 = await blobToDataUrl(compressed.blob);
        const filename = `${crypto.randomUUID()}.webp`;
        
        // Save to physical disk in public/uploads/<folder>/<filename>
        const saved = await saveUploadedFileServer({
          data: {
            base64,
            folder: folder || "products",
            filename,
          },
        });

        out.push({
          path: saved.path,
          url: saved.url,
          bytes: compressed.bytes,
        });
      }
      onChange(multiple ? [...value, ...out] : out.slice(0, 1));
      toast.success("Image uploaded & saved to folder successfully!");
    } catch (e: any) {
      toast.error(e?.message || "Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  const handleGallerySelect = (selected: { url: string; path: string }[]) => {
    const newItems: UploadedImage[] = selected.map((s) => ({
      url: s.url,
      path: s.path,
      bytes: 0,
    }));

    if (multiple) {
      // Avoid duplicate urls
      const existingUrls = new Set(value.map((v) => v.url));
      const uniqueNew = newItems.filter((item) => !existingUrls.has(item.url));
      onChange([...value, ...uniqueNew].slice(0, maxImages || undefined));
    } else {
      onChange(newItems.slice(0, 1));
    }
    toast.success("Gallery images inserted!");
  };

  async function remove(img: UploadedImage) {
    onChange(value.filter((v) => v.path !== img.path || v.url !== img.url));
  }

  const makePrimary = (idx: number) => {
    if (idx === 0) return;
    const item = value[idx];
    const next = [item, ...value.filter((_, i) => i !== idx)];
    onChange(next);
    toast.success("Primary image updated!");
  };

  // Drag and drop reordering
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    const newItems = [...value];
    const draggedItem = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedIdx(index);
    onChange(newItems);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const previewClass =
    variant === "hero"
      ? "h-44 w-full max-w-3xl"
      : variant === "wide"
      ? "h-32 w-full max-w-xl"
      : square
      ? "aspect-square w-28"
      : "h-24 w-24";

  const canAdd = (multiple || value.length === 0) && (maxImages ? value.length < maxImages : true);

  return (
    <div className="space-y-3">
      {/* Upload & Gallery Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {canAdd && (
          <>
            <button
              type="button"
              onClick={() => ref.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:border-primary hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-50 cursor-pointer"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              <span>{busy ? "Uploading..." : label}</span>
            </button>

            <button
              type="button"
              onClick={() => setGalleryOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary shadow-xs hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Pick from Gallery</span>
            </button>
          </>
        )}
      </div>

      {/* Image Thumbnails with Drag & Drop Reordering */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-1">
          {value.map((img, idx) => (
            <div
              key={(img.path || img.url) + idx}
              draggable={multiple}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={cn(
                "group relative overflow-hidden rounded-xl border bg-muted shadow-xs transition-all",
                previewClass,
                draggedIdx === idx ? "opacity-40 scale-95 border-primary ring-2 ring-primary" : "border-border/70 hover:border-primary/60",
                multiple && "cursor-grab active:cursor-grabbing"
              )}
            >
              <img
                src={img.url}
                className={cn("h-full w-full select-none", square ? "object-cover" : "object-contain")}
                alt=""
              />

              {/* Drag Handle Icon on hover */}
              {multiple && (
                <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-md p-1 text-white shadow-xs">
                  <GripVertical className="h-3 w-3" />
                </div>
              )}

              {/* Primary Badge or Make Primary action */}
              {idx === 0 && multiple ? (
                <div className="absolute bottom-1.5 left-1.5 rounded-md bg-primary/95 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground shadow-xs flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 fill-current" /> Primary
                </div>
              ) : multiple ? (
                <button
                  type="button"
                  onClick={() => makePrimary(idx)}
                  className="absolute bottom-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-white hover:bg-primary shadow-xs"
                >
                  Set Primary
                </button>
              ) : null}

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => remove(img)}
                className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive shadow-xs"
                title="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Hint */}
      {hint !== "" && (
        <p className="text-xs text-muted-foreground">
          {hint ??
            (multiple
              ? "💡 Drag & drop images to reorder serial. First image is used as primary thumbnail."
              : "Auto-optimized for ultra-fast loading.")}
        </p>
      )}

      {/* Gallery Modal Picker */}
      <MediaLibraryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onSelect={handleGallerySelect}
        multiple={multiple}
        folder={folder}
      />
    </div>
  );
}
