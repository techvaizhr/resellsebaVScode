import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { ImportedProduct } from "@/lib/product-import.server";

/** Catalog staff OR an active supplier may pull product data from a link. */
async function assertImporter(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase
    .from("suppliers")
    .select("id")
    .eq("user_id", context.userId)
    .eq("status", "active")
    .maybeSingle();
  if (data?.id) return;
  const { assertAnyPermission } = await import("@/lib/admin-users.server");
  await assertAnyPermission(context.supabase, context.userId, ["products.manage"]);
}

/** Reads a marketplace product page and returns plain, sanitized fields. */
export const importProductFromUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { url: string }) => {
    if (typeof input?.url !== "string" || input.url.length < 8 || input.url.length > 2000)
      throw new Error("Paste a valid product link.");
    return { url: input.url };
  })
  .handler(async ({ data, context }): Promise<ImportedProduct> => {
    await assertImporter(context);
    const { scrapeProduct } = await import("@/lib/product-import.server");
    return scrapeProduct(data.url);
  });

/** Downloads one remote image server-side (CORS-safe) and returns verified bytes. */
export const fetchImportImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { url: string }) => {
    if (typeof input?.url !== "string" || input.url.length > 2000) throw new Error("Invalid image link.");
    return { url: input.url };
  })
  .handler(async ({ data, context }): Promise<{ base64: string; mime: string }> => {
    await assertImporter(context);
    const { fetchRemoteImage } = await import("@/lib/product-import.server");
    return fetchRemoteImage(data.url);
  });
