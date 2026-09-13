import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/laravel/auth-middleware";
import type { ImportedProduct } from "@/lib/product-import.server";

/** Reads a marketplace product page and returns plain, sanitized fields. */
export const importProductFromUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { url: string }) => {
    if (typeof input?.url !== "string" || input.url.length < 8 || input.url.length > 2000)
      throw new Error("Paste a valid product link.");
    return { url: input.url };
  })
  .handler(async ({ data, context }): Promise<ImportedProduct> => {
    const { assertImporter, scrapeProduct } = await import("@/lib/product-import.server");
    const role = await assertImporter(context.supabase, context.userId);
    return scrapeProduct(data.url, { includeCosts: role === "staff" });
  });

/** Downloads one remote image server-side (CORS-safe) and returns verified bytes. */
export const fetchImportImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { url: string }) => {
    if (typeof input?.url !== "string" || input.url.length > 2000) throw new Error("Invalid image link.");
    return { url: input.url };
  })
  .handler(async ({ data, context }): Promise<{ base64: string; mime: string }> => {
    const { assertImporter, fetchRemoteImage } = await import("@/lib/product-import.server");
    await assertImporter(context.supabase, context.userId);
    return fetchRemoteImage(data.url);
  });
