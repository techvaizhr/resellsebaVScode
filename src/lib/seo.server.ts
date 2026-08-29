/**
 * Server-only SEO helpers.
 *
 * Social crawlers (Facebook, WhatsApp, Twitter/X) never run JavaScript, so
 * every shareable page must ship real Open Graph tags in the server-rendered
 * HTML. These helpers fetch the minimum fields needed and build an absolute
 * URL for `og:image` / `og:url`.
 */
import { getRequest } from "@tanstack/react-start/server";
import { supabase } from "@/integrations/supabase/client";

export type SeoPayload = {
  title: string;
  description: string;
  image: string | null;
  url: string | null;
  type: "website" | "product" | "article";
  siteName: string | null;
};

export function currentOrigin(): string | null {
  try {
    const req = getRequest();
    if (!req) return null;
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    if (host) return `${proto}://${host}`;
    return new URL(req.url).origin;
  } catch {
    return null;
  }
}

export function absolute(url: string | null | undefined, origin: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (!origin) return null;
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function plain(html: string | null | undefined, max = 155): string {
  const text = String(html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

function firstImage(imgs: { url: string; is_primary: boolean | null; sort_order: number | null }[] | null) {
  const list = [...(imgs ?? [])].sort(
    (a, b) => Number(!!b.is_primary) - Number(!!a.is_primary) || Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
  );
  return list[0]?.url ?? null;
}

async function globalSettings() {
  const { data } = await supabase
    .from("global_settings")
    .select("site_name, meta_description, og_image_url, logo_url, meta_title_template")
    .eq("id", 1)
    .maybeSingle();
  return (data ?? null) as Record<string, any> | null;
}

/** Landing page / platform-level share card. */
export async function siteSeo(path = "/"): Promise<SeoPayload> {
  const origin = currentOrigin();
  const gs = await globalSettings();
  const name = gs?.site_name ?? "Reseller Platform";
  return {
    title: name,
    description: plain(gs?.meta_description) || `${name} — start your own online store with zero investment.`,
    image: absolute(gs?.og_image_url ?? gs?.logo_url ?? null, origin),
    url: origin ? `${origin}${path}` : null,
    type: "website",
    siteName: name,
  };
}

/** Master catalog product page. */
export async function catalogProductSeo(slug: string): Promise<SeoPayload> {
  const origin = currentOrigin();
  const [gs, res] = await Promise.all([
    globalSettings(),
    supabase
      .from("products")
      .select(
        "name, slug, short_description, description, meta_title, meta_description, og_image_url, product_images(url, is_primary, sort_order)",
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle(),
  ]);
  const site = gs?.site_name ?? "Catalog";
  const p = res.data as Record<string, any> | null;
  if (!p) {
    return {
      title: `Product not found — ${site}`,
      description: "This product is no longer available.",
      image: absolute(gs?.og_image_url ?? null, origin),
      url: origin ? `${origin}/catalog/${slug}` : null,
      type: "website",
      siteName: site,
    };
  }
  return {
    title: p.meta_title || `${p.name} — ${site}`,
    description:
      plain(p.meta_description) || plain(p.short_description) || plain(p.description) || `${p.name} — ${site}`,
    image: absolute(firstImage(p.product_images) ?? p.og_image_url ?? gs?.og_image_url ?? null, origin),
    url: origin ? `${origin}/catalog/${p.slug}` : null,
    type: "product",
    siteName: site,
  };
}

async function resellerByCode(code: string) {
  const { data } = await supabase
    .from("resellers")
    .select("id, code, business_name, status")
    .eq("code", code)
    .maybeSingle();
  return (data ?? null) as { id: string; code: string; business_name: string; status: string } | null;
}

async function storeSettings(resellerId: string) {
  const { data } = await supabase
    .from("reseller_settings")
    .select("store_name, tagline, meta_description, og_image_url, logo_url, hero_image_url")
    .eq("reseller_id", resellerId)
    .maybeSingle();
  return (data ?? null) as Record<string, any> | null;
}

/** Reseller storefront home. */
export async function storeSeo(code: string): Promise<SeoPayload> {
  const origin = currentOrigin();
  const r = await resellerByCode(code);
  if (!r) {
    return {
      title: "Store not found",
      description: "No active store exists for this address.",
      image: null,
      url: origin ? `${origin}/s/${code}` : null,
      type: "website",
      siteName: null,
    };
  }
  const s = await storeSettings(r.id);
  const name = s?.store_name || r.business_name;
  return {
    title: s?.tagline ? `${name} — ${s.tagline}` : `${name} — Online Store`,
    description:
      plain(s?.meta_description) || `Shop from ${name} — genuine products with cash on delivery across Bangladesh.`,
    image: absolute(s?.og_image_url ?? s?.hero_image_url ?? s?.logo_url ?? null, origin),
    url: origin ? `${origin}/s/${r.code}` : null,
    type: "website",
    siteName: name,
  };
}

/** Reseller storefront product page. */
export async function storeProductSeo(code: string, slug: string): Promise<SeoPayload> {
  const origin = currentOrigin();
  const r = await resellerByCode(code);
  if (!r) return storeSeo(code);
  const [s, listRes] = await Promise.all([
    storeSettings(r.id),
    supabase
      .from("reseller_listings")
      .select(
        "custom_title, custom_description, meta_title, meta_description, selling_price, products!inner(name, slug, short_description, description, og_image_url, product_images(url, is_primary, sort_order))",
      )
      .eq("reseller_id", r.id)
      .eq("is_active", true)
      .eq("products.slug", slug)
      .maybeSingle(),
  ]);

  const storeName = s?.store_name || r.business_name;
  const l = listRes.data as Record<string, any> | null;
  const product = l ? (Array.isArray(l.products) ? l.products[0] : l.products) : null;
  if (!product) {
    const base = await storeSeo(code);
    return { ...base, url: origin ? `${origin}/s/${code}/p/${slug}` : base.url };
  }

  const title = l?.custom_title || product.name;
  const price = Number(l?.selling_price ?? 0);
  return {
    title: l?.meta_title || `${title} — ${storeName}`,
    description:
      plain(l?.meta_description) ||
      plain(l?.custom_description) ||
      plain(product.short_description) ||
      plain(product.description) ||
      `Order ${title}${price ? ` at ৳${price}` : ""} with cash on delivery across Bangladesh.`,
    image: absolute(firstImage(product.product_images) ?? product.og_image_url ?? s?.og_image_url ?? null, origin),
    url: origin ? `${origin}/s/${r.code}/p/${product.slug}` : null,
    type: "product",
    siteName: storeName,
  };
}
