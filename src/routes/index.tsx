import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getLpBootstrap, type LpBootstrap } from "@/lib/bootstrap";
import { bdt } from "@/lib/finance-report";
import {
  ArrowRight,
  Boxes,
  Sparkles,
  Check,
  ShoppingBag,
  Layers,
  Users,
  HelpCircle,
} from "lucide-react";
import { APP_ICONS } from "@/lib/icons";
import { PwaInstallButton, PwaFooterOption } from "@/components/pwa-install";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { CountUp } from "@/components/count-up";
import { PublicHeader, Brand } from "@/components/public-header";
import { getSiteSeo } from "@/lib/seo.functions";
import { seoLinks, seoMeta } from "@/lib/seo-meta";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return await getSiteSeo({ data: { path: "/" } });
    } catch (err) {
      console.warn("Index loader fallback:", err);
      return {
        title: "Reseller Platform — Your own online store, zero investment",
        description: "Product listing, courier, payment and marketing — everything in one panel for resellers in Bangladesh.",
        image: null,
        url: null,
        type: "website" as const,
        siteName: "ResellSeba",
      };
    }
  },
  head: ({ loaderData }) => ({
    meta: seoMeta(loaderData, {
      title: "Reseller Platform — Your own online store, zero investment",
      description:
        "Product listing, courier, payment and marketing — everything in one panel for resellers in Bangladesh.",
      image: null,
      url: null,
      type: "website",
      siteName: null,
    }),
    links: seoLinks(loaderData),
  }),
  component: RootResolver,
});

const ICON_MAP = APP_ICONS;

import {
  DEFAULT_LANDING_CONTENT,
  mergeLandingContent,
  type LandingContent,
  type Feature,
  type Step,
  type FlowStep,
  type FaqItem,
  type StatItem,
  type HeroImage,
} from "@/lib/landing-content";

type LandingStats = LpBootstrap["stats"] & {
  categories: LpBootstrap["categories"];
  products: LpBootstrap["products"];
};

function RootResolver() {
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);
  const [content, setContent] = useState<LandingContent>(DEFAULT_LANDING_CONTENT);
  const [siteName, setSiteName] = useState("Reseller");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<LandingStats | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const host = typeof window !== "undefined" ? window.location.hostname : "";
      const isPlatformHost =
        !host ||
        host === "localhost" ||
        host.endsWith(".lovable.app") ||
        host.endsWith(".lovableproject.com");

      // ONE call: branding + landing content + stats + categories + products,
      // and (for custom domains) the reseller this hostname belongs to.
      const data = await getLpBootstrap(isPlatformHost ? "" : host);
      if (!alive) return;

      const store = data?.store;
      if (!isPlatformHost && store && store.status === "active") {
        nav({ to: "/s/$code", params: { code: store.code }, replace: true });
        return;
      }

      const s = data?.settings as
        | { site_name?: string | null; logo_url?: string | null; landing_content?: unknown }
        | null
        | undefined;
      if (s) {
        setSiteName(s.site_name ?? "Reseller");
        setLogoUrl(s.logo_url ?? null);
        if (s.landing_content) {
          setContent(mergeLandingContent(s.landing_content));
        }
      }
      setStats(
        data
          ? { ...data.stats, categories: data.categories ?? [], products: data.products ?? [] }
          : null,
      );
      setChecking(false);
    })();
    return () => {
      alive = false;
    };
  }, [nav]);

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-8 w-8 animate-pulse rounded-full bg-primary/20" />
      </div>
    );
  }

  return <Landing c={content} siteName={siteName} logoUrl={logoUrl} stats={stats} />;
}

function Landing({
  c,
  siteName,
  logoUrl,
  stats,
}: {
  c: LandingContent;
  siteName: string;
  logoUrl: string | null;
  stats: LandingStats | null;
}) {
  const copy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    toast.success("Copied to clipboard");
  };

  const [bannerError, setBannerError] = useState(false);
  const banner = c.hero.bannerImage?.url || "/uploads/branding/1746e3c9-7c6f-49cb-95a3-a18724e47970.webp";

  const statIcons = [Boxes, Layers, ShoppingBag, Users];
  const customStats = c.stats?.items?.filter((s) => s.value?.trim() || s.label?.trim()) ?? [];
  const autoStats: StatItem[] = stats
    ? [
        { value: `${stats.totalProducts}+`, label: "Products" },
        { value: `${stats.totalCategories}+`, label: "Categories" },
        { value: `${stats.totalSales}+`, label: "Total sales" },
        { value: "24/7", label: "Support" },
      ]
    : [];
  const statItems = customStats.length ? customStats : autoStats;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Nav ─────────────────────────────────────────── */}
      <PublicHeader siteName={siteName} logoUrl={logoUrl} content={c} />

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--gradient-hero)]" />
        <div className="pointer-events-none absolute -top-40 -left-32 -z-10 h-96 w-96 rounded-full bg-primary/25 blur-3xl animate-blob-drift" />
        <div className="pointer-events-none absolute -bottom-40 -right-24 -z-10 h-96 w-96 rounded-full bg-accent/25 blur-3xl animate-blob-drift-slow" />

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-14 sm:px-6 sm:pt-20 sm:pb-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold text-primary sm:text-xs animate-fade-in-up animation-delay-100">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{c.hero.badge}</span>
            </div>

            <h1 className="mt-5 text-balance text-[30px] font-black leading-[1.22] tracking-tight sm:text-5xl sm:leading-[1.12] lg:text-[56px] animate-fade-in-up animation-delay-200">
              {c.hero.titleStart}{" "}
              <span className="bg-[image:var(--gradient-brand)] bg-clip-text text-transparent">
                {c.hero.titleHighlight}
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base lg:mx-0 lg:text-lg animate-fade-in-up animation-delay-300">
              {c.hero.subtitle}
            </p>

            <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start animate-fade-in-up animation-delay-400">
              <Link
                to="/login"
                search={{ mode: "signup" }}
                className="btn-brand btn-live inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold sm:text-base"
              >
                {c.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="btn-live inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-bold transition hover:border-primary/50 hover:text-primary sm:text-base"
              >
                {c.hero.ctaSecondary}
              </Link>
            </div>

            {c.hero.badges.length > 0 && (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold sm:text-xs lg:justify-start animate-fade-in-up animation-delay-500">
                {c.hero.badges.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5"
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-primary" /> {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="relative animate-scale-in-slow animation-delay-300">
            {/* soft ambient glow behind the banner so any image blends in */}
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[image:var(--gradient-brand)] opacity-20 blur-2xl" />
            <div className="animate-float relative overflow-hidden rounded-2xl shadow-[var(--shadow-elegant)]">
              {banner && !bannerError ? (
                <>
                  <img
                    src={banner}
                    alt={siteName}
                    className="aspect-[4/3] w-full object-cover"
                    onError={() => setBannerError(true)}
                  />
                  {/* gentle vignette + tint keeps bright, dark or busy images looking consistent */}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/35 via-transparent to-background/10" />
                </>
              ) : (
                <div className="grid aspect-[4/3] w-full place-items-center bg-[image:var(--gradient-brand)] text-primary-foreground">
                  <Boxes className="h-16 w-16 opacity-80" />
                </div>
              )}
              {/* hairline inner ring instead of a hard border */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats band ──────────────────────────────────── */}
      {statItems.length > 0 && (
        <section className="border-y border-border/60 bg-card">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 md:py-12">
            {statItems.slice(0, 4).map((s, i) => {
              const Icon = statIcons[i] ?? Sparkles;
              return (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground sm:text-sm">
                      {s.label}
                    </span>
                  </div>
                  <div className="mt-2 text-2xl font-black sm:text-3xl">
                    <CountUp value={s.value ?? ""} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Features ────────────────────────────────────── */}
      <section id="features" className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            {c.features.title && (
              <h2 className="text-xl font-extrabold sm:text-3xl">{c.features.title}</h2>
            )}
            {c.features.subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {c.features.subtitle}
              </p>
            )}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.features.items.map((f, i) => {
              const Icon = ICON_MAP[f.icon] ?? Sparkles;
              return (
                <div
                  key={i}
                  className="surface-card surface-card-hover group relative flex flex-col overflow-hidden p-4"
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/20 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
                  <div className="relative flex items-start gap-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[image:var(--gradient-brand)] text-primary-foreground">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <h3 className="flex-1 pt-0.5 text-[13px] font-bold leading-tight">{f.title}</h3>
                  </div>
                  <p className="relative mt-2 text-xs leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How we work (flow) ──────────────────────────── */}
      {((c.about?.flow?.length ?? 0) > 0 || c.about?.title || c.about?.body) && (
        <section id="about" className="relative overflow-hidden py-14 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-brand)] opacity-[0.06]" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              {c.about?.title && (
                <h2 className="mt-3 text-xl font-extrabold leading-snug sm:text-3xl">
                  {c.about.title}
                </h2>
              )}
              {c.about?.body && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.about.body}</p>
              )}
            </div>

            <div className="relative mt-10 sm:mt-14">
              {/* Desktop connecting line */}
              <div className="pointer-events-none absolute top-10 left-0 right-0 hidden h-1 rounded-full flow-line lg:block" />

              {/* Mobile connecting line — runs through the centre of the icon bubbles */}
              <div className="pointer-events-none absolute top-5 bottom-5 left-5 hidden w-1 rounded-full flow-line-vertical lg:hidden" />

              <ol className="relative flex flex-col gap-6 lg:flex-row lg:justify-between lg:gap-4">
                {(c.about?.flow ?? []).map((f, i) => {
                  const Icon = ICON_MAP[f.icon] ?? Sparkles;
                  const stepLabel =
                    ["01", "02", "03", "04", "05"][i] ?? String(i + 1).padStart(2, "0");
                  const iconClass =
                    ["flow-icon-1", "flow-icon-2", "flow-icon-3", "flow-icon-4", "flow-icon-5"][
                      i
                    ] ?? "flow-icon-1";

                  return (
                    <li
                      key={i}
                      className="group relative z-10 flex w-full items-start gap-3 lg:w-[18%] lg:max-w-[240px] lg:flex-col lg:items-center lg:gap-0"
                      style={{ animationDelay: `${(i + 1) * 100}ms` }}
                    >
                      {/* Icon bubble — smaller on mobile, stacked above on desktop */}
                      <div
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl shadow-lg shadow-primary/10 transition-transform duration-300 group-hover:scale-105 lg:h-20 lg:w-20 lg:group-hover:-translate-y-2 ${iconClass}`}
                      >
                        <Icon className="h-5 w-5 lg:h-9 lg:w-9" />
                      </div>

                      {/* Card — side-by-side with icon on mobile, below icon on desktop */}
                      <div className="flow-card flex-1 px-4 py-4 text-left transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-elegant lg:mt-6 lg:w-full lg:px-5 lg:py-5 lg:text-center">
                        <span
                          className={`mb-1 block text-[11px] font-bold uppercase tracking-wider`}
                          style={{ color: `var(--flow-step-${i + 1})` }}
                        >
                          Step {stepLabel}
                        </span>
                        <h3 className="text-sm font-bold leading-tight sm:text-[15px]">
                          {f.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                          {f.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/login"
                search={{ mode: "signup" }}
                className="btn-brand btn-live inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold"
              >
                {c.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/catalog"
                search={{}}
                className="btn-live inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold hover:bg-muted"
              >
                View Master Catalog
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── How it works ────────────────────────────────── */}
      <section id="how" className="relative overflow-hidden border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-2xl text-center">
            {c.how.title && <h2 className="text-xl font-extrabold sm:text-3xl">{c.how.title}</h2>}
            {c.how.subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.how.subtitle}</p>
            )}
          </div>
          <div className="relative mt-10 grid gap-6 md:grid-cols-3">
            {c.how.steps.map((s, i) => (
              <div key={i} className="surface-card surface-card-hover relative p-6 pt-8">
                <div className="absolute -top-5 left-6 grid h-11 w-11 place-items-center rounded-xl bg-[image:var(--gradient-brand)] text-base font-black text-primary-foreground ring-4 ring-background">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-base font-bold sm:text-lg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────── */}
      {!!stats?.categories?.length && (
        <section id="categories" className="border-y border-border/60 bg-muted/30 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-xl font-extrabold sm:text-3xl">Categories</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pick a category that matches your niche and start listing products
              </p>
            </div>
            <div className="mt-8 grid grid-cols-5 gap-2 sm:grid-cols-6 sm:gap-3 md:grid-cols-8 lg:grid-cols-10">
              {(stats?.categories ?? []).map((cat: any) => (
                <CategoryCardItem key={cat.id} cat={cat} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Products ────────────────────────────────────── */}
      {stats?.products && stats.products.length > 0 && (
        <section id="products" className="border-y border-border/60 bg-muted/30 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-xl font-extrabold sm:text-3xl">Featured Products</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The best-selling products of the month
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {stats.products.map((p: any) => (
                <div
                  key={p.id}
                  className="group surface-card surface-card-hover flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden bg-primary/5">
                    {p.main_image ? (
                      <img
                        src={p.main_image}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-2xl font-black text-primary">
                        {p.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight">{p.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {p.description}
                    </p>
                    <div className="mt-auto pt-3">
                      <span className="text-sm font-black text-primary">{bdt(p.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                to="/catalog"
                search={{}}
                className="btn-live inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-bold hover:border-primary/50 hover:text-primary"
              >
                <ShoppingBag className="h-4 w-4" /> View all products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ─────────────────────────────────────────── */}

      {c.faq && c.faq.items.length > 0 && (
        <section id="faq" className="border-t border-border/60 bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-2xl text-center">
              {c.faq.title && <h2 className="text-xl font-extrabold sm:text-3xl">{c.faq.title}</h2>}
              {c.faq.subtitle && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {c.faq.subtitle}
                </p>
              )}
            </div>
            <div className="mt-8">
              <Accordion type="single" collapsible className="w-full">
                {c.faq.items.map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-sm font-semibold sm:text-base">
                      <span className="flex items-center gap-2 text-left">
                        <HelpCircle className="h-4 w-4 shrink-0 text-primary" />
                        {item.q}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────── */}
      <section id="pricing" className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[image:var(--gradient-brand)] px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            {c.cta.title && (
              <h2 className="text-2xl font-extrabold text-primary-foreground sm:text-3xl">
                {c.cta.title}
              </h2>
            )}
            {c.cta.subtitle && (
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/85">
                {c.cta.subtitle}
              </p>
            )}
          </div>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/login"
              search={{ mode: "signup" }}
              className="btn-live inline-flex items-center gap-2 rounded-xl bg-background px-7 py-3.5 text-sm font-bold text-foreground sm:text-base"
            >
              {c.cta.button} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/catalog"
              search={{}}
              className="btn-live inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-7 py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 sm:text-base"
            >
              <Layers className="h-4 w-4" /> Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-border/60 bg-card">
        <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
          <PwaFooterOption />
        </div>
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Brand siteName={siteName} logoUrl={logoUrl} size="sm" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {c.footer.tagline}
            </p>
            <div className="mt-4">
              <PwaInstallButton variant="footer" label="মোবাইল অ্যাপ ইনস্টল করুন" />
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Platform
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary">
                  How we work
                </a>
              </li>
              <li>
                <a href="#features" className="text-muted-foreground hover:text-primary">
                  {c.nav.features}
                </a>
              </li>
              <li>
                <a href="#how" className="text-muted-foreground hover:text-primary">
                  {c.nav.how}
                </a>
              </li>
              <li>
                <a href="#faq" className="text-muted-foreground hover:text-primary">
                  {c.nav.faq || "FAQ"}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Account
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  to="/login"
                  search={{ mode: "signup" }}
                  className="text-muted-foreground hover:text-primary"
                >
                  {c.nav.cta}
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary">
                  {c.nav.signIn}
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  search={{}}
                  className="text-muted-foreground hover:text-primary"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-muted-foreground hover:text-primary">
                  Video tutorials
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60 px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function CategoryCardItem({ cat }: { cat: any }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link
      to="/catalog"
      search={{ category: cat.slug }}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-2 text-center transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-primary/5">
        {cat.image_url && !imgFailed ? (
          <img
            src={cat.image_url}
            alt={cat.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-primary/10 text-lg font-black text-primary">
            {(cat.name || "C").charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <span className="line-clamp-2 min-w-0 text-[11px] font-bold leading-tight group-hover:text-primary sm:text-xs">
        {cat.name}
      </span>
    </Link>
  );
}

