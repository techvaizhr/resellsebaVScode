import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/laravel/client";
import { resolveDelivery } from "@/lib/delivery";
import initialData from "@/lib/initial-data.json";

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

/** Public master catalog — active products only, no cost/profit leak beyond reseller price. */
export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data } = await supabase.rpc("reseller_catalog_page");
    if (data && (data as any).products && (data as any).products.length > 0) {
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
    console.error("getCatalog rpc error, falling back to initialData:", err);
  }

  // Resilient fallback using initialData
  const cats = (initialData.categories || []).filter((c: any) => c.is_active !== false);
  const brands = (initialData.brands || []).filter((b: any) => b.is_active !== false);
  const prods = (initialData.products || []).filter((p: any) => p.is_active !== false);

  const products = prods.map((row: any) => {
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
});

export const getCatalogProduct = createServerFn({ method: "GET" })
  .validator((d: { slug: string }) => ({ slug: String(d.slug) }))
  .handler(async ({ data }) => {
    let prodsList = (initialData.products || []) as any[];
    let catsList = (initialData.categories || []) as any[];
    let brandsList = (initialData.brands || []) as any[];

    try {
      if (typeof window !== "undefined") {
        const sP = localStorage.getItem("mock:products");
        if (sP) prodsList = JSON.parse(sP);
        const sC = localStorage.getItem("mock:categories");
        if (sC) catsList = JSON.parse(sC);
        const sB = localStorage.getItem("mock:brands");
        if (sB) brandsList = JSON.parse(sB);
      }
    } catch {}

    const row = prodsList.find((p: any) => p.slug === data.slug || p.id === data.slug);
    if (!row) return null;

    const imgs = extractImages(row);
    const cat = catsList.find((c: any) => c.id === row.category_id);
    const brand = brandsList.find((b: any) => b.id === row.brand_id);

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
  });
