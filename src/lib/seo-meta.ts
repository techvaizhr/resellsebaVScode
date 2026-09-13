/** Client-safe helpers: turn an SEO payload into route `head()` meta/links. */
export type SeoData = {
  title: string;
  description: string;
  image: string | null;
  url: string | null;
  type: "website" | "product" | "article";
  siteName: string | null;
};

export function seoMeta(seo: SeoData | null | undefined, fallback: SeoData) {
  const s = seo ?? fallback;
  const meta: Record<string, string>[] = [
    { title: s.title },
    { name: "description", content: s.description },
    { property: "og:title", content: s.title },
    { property: "og:description", content: s.description },
    { property: "og:type", content: s.type },
    { name: "twitter:card", content: s.image ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: s.title },
    { name: "twitter:description", content: s.description },
  ];
  if (s.siteName) meta.push({ property: "og:site_name", content: s.siteName });
  if (s.url) meta.push({ property: "og:url", content: s.url });
  if (s.image) {
    meta.push({ property: "og:image", content: s.image });
    meta.push({ property: "og:image:secure_url", content: s.image });
    meta.push({ property: "og:image:width", content: "1200" });
    meta.push({ property: "og:image:height", content: "630" });
    meta.push({ name: "twitter:image", content: s.image });
  }
  return meta;
}

export function seoLinks(seo: SeoData | null | undefined) {
  return seo?.url ? [{ rel: "canonical", href: seo.url }] : [];
}
