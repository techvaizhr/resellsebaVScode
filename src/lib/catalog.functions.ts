import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/laravel/client";
import { resolveDelivery } from "@/lib/delivery";

function extractImages(row: any): string[] {
  const rawImgs = row.product_images || row.images || [];
  const sortedImgs = [...rawImgs].sort(
    (a: any, b: any) =>
      Number(!!b.is_primary) - Number(!!a.is_primary) ||
      Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)
  );
  const primaryImg =
    (typeof sortedImgs[0] === "string" ? sortedImgs[0] : sortedImgs[0]?.url) ||
    row.main_image ||
    row.image_url ||
    row.og_image_url ||
    null;

  const all = [
    ...(primaryImg ? [primaryImg] : []),
    ...sortedImgs.map((i: any) => (typeof i === "string" ? i : i.url)),
    ...(row.og_image_url ? [row.og_image_url] : []),
    ...(row.main_image ? [row.main_image] : []),
  ].filter(Boolean);

  return [...new Set(all)];
}

/** Public master catalog — active products only from live database. */
export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data } = await supabase.rpc("reseller_catalog_page");
    if (data && (data as any).products) {
      const payload = data as any;
      const cats = (payload.categories ?? []) as any[];
      const brands = (payload.brands ?? []) as any[];
      const prods = (payload.products ?? []) as any[];

      const products = prods
        .filter((p: any) => p.is_active !== false)
        .map((row: any) => {
          const imgs = extractImages(row);
          return {
            id: row.id as string,
            name: row.name as string,
            slug: row.slug as string,
            code: (row.product_code || "") as string,
            short: (row.short_description ?? "") as string,
            price: Number(row.suggested_price ?? 0),
            resellerPrice: Number(row.reseller_price ?? 0),
            categoryId: (row.category_id as string | null) ?? null,
            brandId: (row.brand_id as string | null) ?? null,
            featured: Boolean(row.is_featured),
            createdAt: (row.created_at ?? null) as string | null,
            image: imgs[0] || null,
            images: imgs,
          };
        });

      return {
        categories: cats.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          image_url: c.image_url || null,
          count: products.filter((p) => p.categoryId === c.id).length,
        })),
        brands: brands.map((b: any) => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
        })),
        products,
      };
    }
  } catch (err) {
    console.error("getCatalog error from live database:", err);
  }

  // Live data only: if database is empty or disconnected, return empty
  return {
    categories: [],
    brands: [],
    products: [],
  };
});

export const getCatalogProduct = createServerFn({ method: "GET" })
  .validator((d: { slug: string }) => ({ slug: String(d.slug) }))
  .handler(async ({ data }) => {
    try {
      let query = supabase.from("products").select("*, product_images(*), categories(*), brands(*)");
      let { data: row } = await query.eq("slug", data.slug).maybeSingle();

      if (!row) {
        const { data: rowById } = await supabase.from("products").select("*, product_images(*), categories(*), brands(*)").eq("id", data.slug).maybeSingle();
        row = rowById;
      }

      if (!row) return null;

      const imgs = extractImages(row);
      const cat = row.categories || null;
      const brand = row.brands || null;

      const globalDelivery = {
        inside_dhaka: 60,
        outside_dhaka: 120,
        sub_dhaka: 100,
      };
      const resolved = resolveDelivery(row as any, globalDelivery as any);

      return {
        id: row.id as string,
        name: row.name as string,
        slug: row.slug as string,
        code: (row.product_code || "") as string,
        short: (row.short_description ?? "") as string,
        description: (row.description ?? "") as string,
        price: Number(row.suggested_price ?? 0),
        resellerPrice: Number(row.reseller_price ?? 0),
        stock: Number(row.stock ?? 0),
        weight: (row.weight_grams as number | null) ?? null,
        deliveryMode: resolved.mode,
        deliverySource: resolved.source,
        deliveryInside: resolved.charges.inside_dhaka,
        deliverySub: resolved.charges.sub_dhaka,
        deliveryOutside: resolved.charges.outside_dhaka,
        deliveryFlat: resolved.mode === "custom" ? resolved.custom : resolved.flat,
        category: cat?.name ?? null,
        categorySlug: cat?.slug ?? null,
        brand: brand?.name ?? null,
        images: imgs,
      };
    } catch (err) {
      console.error("getCatalogProduct error from live database:", err);
      return null;
    }
  });
