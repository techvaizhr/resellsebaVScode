import { createServerFn } from "@tanstack/react-start";
import { catalogProductSeo, siteSeo, storeProductSeo, storeSeo } from "@/lib/seo.server";

export const getSiteSeo = createServerFn({ method: "GET" })
  .inputValidator((d?: { path?: string }) => ({ path: d?.path ? String(d.path) : "/" }))
  .handler(async ({ data }) => siteSeo(data.path));

export const getCatalogProductSeo = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => ({ slug: String(d.slug) }))
  .handler(async ({ data }) => catalogProductSeo(data.slug));

export const getStoreSeo = createServerFn({ method: "GET" })
  .inputValidator((d: { code: string }) => ({ code: String(d.code) }))
  .handler(async ({ data }) => storeSeo(data.code));

export const getStoreProductSeo = createServerFn({ method: "GET" })
  .inputValidator((d: { code: string; slug: string }) => ({ code: String(d.code), slug: String(d.slug) }))
  .handler(async ({ data }) => storeProductSeo(data.code, data.slug));
