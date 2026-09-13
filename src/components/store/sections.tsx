import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Undo2,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "./store-context";
import { borderc, cx, GhostButton, Heading, muted, PrimaryButton, SectionHead } from "./ui";

/* ------------------------------------------------------------------ helpers */

function whatsappHref(n?: string | null) {
  return n ? `https://wa.me/${n.replace(/[^\d]/g, "")}` : undefined;
}

function useHeroMedia() {
  const { content, listings, image } = useStore();
  const custom = content.text("hero_image");
  const spotlight = listings[0];
  return custom || (spotlight ? image(spotlight) : undefined);
}

/* --------------------------------------------------------------------- hero */

export function Hero() {
  const store = useStore();
  const { code, theme, content, settings, listings, name } = store;
  const media = useHeroMedia();
  const firstSlug = listings[0]?.product?.slug;
  const wa = whatsappHref(settings?.whatsapp);
  if (!content.flag("hero_show")) return null;

  const badge = content.text("hero_badge");
  const headline = content.text("hero_headline");
  const sub = content.text("hero_sub");
  const cta = content.text("hero_cta");
  const cta2 = content.text("hero_cta2");
  const note = content.text("hero_note");

  const buttons = (
    <div className="flex flex-wrap items-center gap-3">
      {firstSlug ? (
        <Link to="/s/$code/p/$slug" params={{ code, slug: firstSlug }}>
          <PrimaryButton>
            {cta} <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
        </Link>
      ) : null}
      {wa && cta2 ? (
        <a href={wa} target="_blank" rel="noreferrer">
          <GhostButton>{cta2}</GhostButton>
        </a>
      ) : null}
    </div>
  );

  /* -------------------------------------------------------------
   * THEME 3: BAZAAR (হাটবাজার / মার্কেটপ্লেস সুপার ডিল হিরো)
   * High-energy BD marketplace banner with flash deal urgency
   * ------------------------------------------------------------- */
  if (theme.layout.hero === "banner")
    return (
      <section className="mx-auto max-w-6xl px-4 pt-4">
        <div className={cx("overflow-hidden rounded-2xl border-2 bg-[var(--st-surface)] shadow-md", borderc)}>
          {/* Top Deal Banner Ticker */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[var(--st-primary)] to-amber-600 px-4 py-2 text-xs font-bold text-white tracking-wide">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> 🔥 আজকের সেরা অফার — স্টক শেষ হওয়ার আগেই অর্ডার করুন!
            </span>
            <span className="hidden sm:inline bg-black/20 px-2 py-0.5 rounded text-[11px]">
              সারা দেশে ক্যাশ অন ডেলিভারি
            </span>
          </div>

          <div className="grid md:grid-cols-[1.2fr_1fr] items-center">
            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--st-primary)]/15 px-3 py-1 text-xs font-bold text-[var(--st-primary)]">
                  <BadgeCheck className="h-3.5 w-3.5" /> {badge || "সারা দেশে ক্যাশ অন ডেলিভারি"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <Truck className="h-3 w-3" /> দ্রুততম ডেলিভারি
                </span>
              </div>

              <Heading as="h2" className="mt-4 text-2xl font-extrabold leading-tight md:text-4xl text-[var(--st-fg)]">
                {headline}
              </Heading>
              <p className={cx("mt-3 max-w-md text-sm md:text-base leading-relaxed", muted)}>{sub}</p>

              <div className="mt-6">{buttons}</div>

              {/* Bangladesh Trust Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[var(--st-border)] pt-4 text-xs font-medium text-[var(--st-fg)]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> পণ্য দেখে মূল্য পরিশোধ
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-[var(--st-primary)]" /> ২৪-৭২ ঘণ্টায় ডেলিভারি
                </span>
              </div>
            </div>

            <div className="relative min-h-[260px] md:min-h-[340px] bg-[var(--st-bg-alt)] overflow-hidden">
              {media && (
                <img
                  src={media}
                  alt={name}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    );

  /* -------------------------------------------------------------
   * THEME 2: NOIR LUXE (প্রিমিয়াম লাক্সারি বুটিক হিরো)
   * High-fashion cinema spotlight hero with serif headlines
   * ------------------------------------------------------------- */
  if (theme.layout.hero === "spotlight")
    return (
      <section className="relative overflow-hidden border-b border-[var(--st-border)]">
        {media && (
          <img
            src={media}
            alt={name}
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-30 filter brightness-90"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--st-bg)] via-[var(--st-bg)]/80 to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center md:py-32">
          {badge && (
            <span className="inline-block rounded-xs border border-[var(--st-border)] bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-[#d9c08a] backdrop-blur-md">
              {badge}
            </span>
          )}
          <Heading as="h2" className="mt-5 font-serif text-4xl leading-[1.1] md:text-6xl text-[var(--st-fg)]">
            {headline}
          </Heading>
          <p className={cx("mx-auto mt-5 max-w-xl text-sm md:text-base leading-relaxed tracking-wide", muted)}>
            {sub}
          </p>
          <div className="mt-8 flex justify-center">{buttons}</div>
          {note && <p className={cx("mt-4 text-xs font-serif italic", muted)}>{note}</p>}
        </div>
      </section>
    );

  /* -------------------------------------------------------------
   * THEME 4: ATELIER (অর্গানিক ও ক্রাফট স্টোরিটেলিং হিরো)
   * Warm natural editorial split hero with artisanal feel
   * ------------------------------------------------------------- */
  if (theme.layout.hero === "split")
    return (
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div>
          {badge && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--st-surface)] border border-[var(--st-border)] px-3 py-1 text-xs font-medium text-[var(--st-primary)] shadow-xs">
              <Leaf className="h-3.5 w-3.5 text-emerald-600" /> {badge}
            </span>
          )}
          <Heading as="h2" className="mt-4 text-3xl font-serif leading-[1.15] md:text-5xl text-[var(--st-fg)]">
            {headline}
          </Heading>
          <p className={cx("mt-4 max-w-md text-base leading-relaxed", muted)}>{sub}</p>
          <div className="mt-8">{buttons}</div>
          {note && <p className={cx("mt-3 text-xs", muted)}>{note}</p>}
        </div>
        <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--st-border)] bg-[var(--st-bg-alt)] shadow-lg">
          {media && (
            <img
              src={media}
              alt={name}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          )}
        </div>
      </section>
    );

  /* -------------------------------------------------------------
   * THEME 1: AURORA (মডার্ন ট্রেন্ডি গ্যাজেট হিরো — DEFAULT)
   * Modern glow with live satisfaction pills & high-tech badge
   * ------------------------------------------------------------- */
  const stat1 = content.text("aurora_stat1");
  const stat2 = content.text("aurora_stat2");
  const offer = content.text("aurora_offer");

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          background:
            "radial-gradient(1000px 420px at 12% -10%, var(--st-primary), transparent 60%), radial-gradient(820px 420px at 92% 0%, var(--st-accent), transparent 62%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div>
          {badge && (
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--st-border)] bg-[var(--st-surface)] px-3 py-1.5 text-[11px] font-medium shadow-xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[var(--st-primary)]" /> {badge}
            </span>
          )}
          <Heading as="h2" className="mt-4 text-3xl font-extrabold leading-[1.12] md:text-5xl text-[var(--st-fg)]">
            {headline}
          </Heading>
          <p className={cx("mt-4 max-w-md text-sm md:text-base leading-relaxed", muted)}>{sub}</p>
          <div className="mt-7">{buttons}</div>
          {note && <p className={cx("mt-3 text-xs", muted)}>{note}</p>}
          {(stat1 || stat2) && (
            <div className="mt-7 flex flex-wrap items-center gap-6">
              {[stat1, stat2].filter(Boolean).map((s) => (
                <div key={s} className="flex items-center gap-2 text-sm font-semibold">
                  <BadgeCheck className="h-4 w-4 text-[var(--st-primary)]" /> {s}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-[var(--st-border)] bg-[var(--st-bg-alt)] shadow-xl">
          {media && (
            <img
              src={media}
              alt={name}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          )}
          {offer && (
            <span className="absolute -bottom-3 left-4 rounded-full bg-[var(--st-primary)] px-4 py-2 text-xs font-bold text-[var(--st-on-primary)] shadow-lg">
              {offer}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- benefit strip */

export function BenefitStrip() {
  const { content } = useStore();
  if (!content.flag("usp_show")) return null;
  const icons = [Truck, ShieldCheck, BadgeCheck, Undo2];
  const items = [1, 2, 3, 4]
    .map((i, n) => ({
      t: content.text(`usp${i}_t`),
      d: content.text(`usp${i}_d`),
      Icon: icons[n],
    }))
    .filter((i) => i.t);
  if (!items.length) return null;

  return (
    <section className={cx("border-y bg-[var(--st-bg-alt)]", borderc)}>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
        {items.map(({ t, d, Icon }) => (
          <div key={t} className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--st-primary)]/12 text-[var(--st-primary)]">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[var(--st-fg)]">{t}</div>
              {d && <div className={cx("text-xs", muted)}>{d}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- categories */

export function CategoryStrip() {
  const { code, categories, content, theme } = useStore();
  if (!content.flag("cat_show") || !categories.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <SectionHead title={content.text("cat_title")} subtitle={content.text("cat_sub")} />
      <div
        className={cx(
          "grid gap-4",
          theme.layout.grid === "dense"
            ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
        )}
      >
        {categories.map((c) => (
          <Link
            key={c.id}
            to="/s/$code/c/$slug"
            params={{ code, slug: c.slug }}
            className={cx(
              "group overflow-hidden rounded-[var(--st-radius)] border bg-[var(--st-surface)] transition-all hover:-translate-y-0.5 hover:border-[var(--st-primary)]",
              borderc,
            )}
          >
            <div className="aspect-[4/3] bg-[var(--st-bg-alt)]">
              {c.image_url ? (
                <img
                  src={c.image_url}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className={cx("grid h-full w-full place-items-center text-2xl font-semibold", muted)}>
                  {c.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 text-sm font-medium">
              {c.name}
              <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ promo banner */

export function PromoBanner() {
  const { code, content, settings } = useStore();
  if (!content.flag("promo_show")) return null;
  const title = content.text("promo_title");
  const text = content.text("promo_text");
  const cta = content.text("promo_cta");
  const image = content.text("promo_image");
  if (!title && !text) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div
        className={cx(
          "grid overflow-hidden rounded-[var(--st-radius)] border bg-[var(--st-surface)] md:grid-cols-[1.2fr_1fr]",
          borderc,
        )}
      >
        <div className="relative p-6 md:p-9">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              background: "radial-gradient(600px 240px at 0% 0%, var(--st-primary), transparent 60%)",
            }}
          />
          <div className="relative">
            <Heading className="text-xl md:text-2xl">{title}</Heading>
            <p className={cx("mt-2 max-w-md text-sm leading-relaxed", muted)}>{text}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {cta && (
                <Link to="/s/$code" params={{ code }}>
                  <PrimaryButton>{cta}</PrimaryButton>
                </Link>
              )}
              {settings?.support_phone && (
                <a href={`tel:${settings.support_phone}`}>
                  <GhostButton>Call {settings.support_phone}</GhostButton>
                </a>
              )}
            </div>
          </div>
        </div>
        {image && (
          <div className="min-h-[180px] bg-[var(--st-bg-alt)]">
            <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ why us */

export function WhyUs() {
  const { content } = useStore();
  if (!content.flag("why_show")) return null;
  const items = [1, 2, 3].map((i) => ({ t: content.text(`why${i}_t`), d: content.text(`why${i}_d`) })).filter((i) => i.t);
  if (!items.length) return null;
  return (
    <section className={cx("border-y bg-[var(--st-bg-alt)]", borderc)}>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <SectionHead title={content.text("why_title")} />
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((i, n) => (
            <div
              key={i.t}
              className={cx("rounded-[var(--st-radius)] border bg-[var(--st-surface)] p-5", borderc)}
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--st-primary)] text-sm font-bold text-[var(--st-on-primary)]">
                {n + 1}
              </span>
              <div className="mt-3 text-base font-semibold text-[var(--st-fg)]">{i.t}</div>
              <p className={cx("mt-1.5 text-sm leading-relaxed", muted)}>{i.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- reviews */

export function Reviews() {
  const { content } = useStore();
  if (!content.flag("review_show")) return null;
  const items = [1, 2, 3]
    .map((i) => ({ text: content.text(`review${i}_text`), name: content.text(`review${i}_name`) }))
    .filter((i) => i.text);
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <SectionHead title={content.text("review_title")} />
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((i) => (
          <figure
            key={i.name + i.text}
            className={cx("rounded-[var(--st-radius)] border bg-[var(--st-surface)] p-5", borderc)}
          >
            <div className="flex items-center gap-1 text-[var(--st-primary)]">
              {[0, 1, 2, 3, 4].map((s) => (
                <Star key={s} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <Quote className={cx("mt-3 h-4 w-4", muted)} />
            <blockquote className="mt-2 text-sm leading-relaxed text-[var(--st-fg)]">{i.text}</blockquote>
            {i.name && <figcaption className={cx("mt-3 text-xs font-medium", muted)}>{i.name}</figcaption>}
          </figure>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- faq */

export function Faq() {
  const { content } = useStore();
  const [open, setOpen] = useState(0);
  if (!content.flag("faq_show")) return null;
  const items = [1, 2, 3].map((i) => ({ q: content.text(`faq${i}_q`), a: content.text(`faq${i}_a`) })).filter((i) => i.q);
  if (!items.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };

  return (
    <section className={cx("border-t bg-[var(--st-bg-alt)]", borderc)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-4 py-14">
        <SectionHead title={content.text("faq_title")} />
        <div className={cx("divide-y overflow-hidden rounded-[var(--st-radius)] border bg-[var(--st-surface)]", borderc)}>
          {items.map((i, n) => (
            <div key={i.q}>
              <button
                onClick={() => setOpen(open === n ? -1 : n)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium"
              >
                {i.q}
                <ChevronDown className={cx("h-4 w-4 transition-transform", open === n && "rotate-180")} />
              </button>
              {open === n && <p className={cx("px-4 pb-4 text-sm leading-relaxed", muted)}>{i.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------- theme signature section */

/**
 * Renders the active theme's own content fields, so every field shown in the
 * panel has a matching place on the storefront.
 */
export function ThemeSignature({ slot = "mid" }: { slot?: "top" | "mid" }) {
  const { theme, content } = useStore();

  /* Bazaar Top Deal Strip */
  if (theme.id === "bazaar" && slot === "top") {
    const title = content.text("bazaar_deal_title") || "আজকের সেরা ধামাকা ডিল";
    const note = content.text("bazaar_deal_note") || "সীমিত সময়ের স্টক — আগে আসলে আগে পাবেন!";
    return (
      <section className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 px-4 py-3 text-white shadow-md">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <Sparkles className="h-4 w-4 animate-pulse" /> {title}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold opacity-95">{note}</span>
            <span className="hidden md:inline-flex items-center gap-1 rounded-md bg-black/25 px-2 py-0.5 text-[11px] font-bold">
              ক্যাশ অন ডেলিভারি
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (slot === "top") return null;

  /* Aurora Tech & Lifestyle Signature */
  if (theme.id === "aurora") {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-[var(--st-border)] bg-[var(--st-surface)] p-6 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--st-primary)]/10 text-[var(--st-primary)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--st-fg)]">১০০% অথেনটিক গ্যাজেট</div>
              <div className={cx("text-xs mt-0.5", muted)}>প্রতিটি পণ্য ল্যাব পরীক্ষিত ও ভেরিফাইড</div>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--st-fg)]">সুপারফাস্ট হোম ডেলিভারি</div>
              <div className={cx("text-xs mt-0.5", muted)}>সারা দেশে দ্রুততম সময়ে ডেলিভারি</div>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--st-fg)]">ক্যাশ অন ডেলিভারি</div>
              <div className={cx("text-xs mt-0.5", muted)}>পণ্য হাতে পেয়ে চেক করে টাকা দিন</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* Noir Luxe Boutique Signature */
  if (theme.id === "noir") {
    const eyebrow = content.text("noir_eyebrow") || "THE SIGNATURE COLLECTION";
    const story = content.text("noir_story") || "Curated luxury pieces crafted for those who appreciate distinction, elegance, and superior quality.";
    return (
      <section className={cx("border-y bg-[var(--st-bg-alt)]", borderc)}>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <span className="inline-block rounded-xs border border-[#d9c08a]/30 px-3 py-1 text-[10px] uppercase tracking-[0.4em] text-[#d9c08a]">
            {eyebrow}
          </span>
          <Heading as="h2" className="mt-5 font-serif text-2xl leading-snug md:text-3xl text-[var(--st-fg)]">
            “{story}”
          </Heading>
          <div className="mx-auto mt-6 h-px w-16 bg-[#d9c08a]/40" />
        </div>
      </section>
    );
  }

  /* Atelier Organic Signature */
  if (theme.id === "atelier") {
    const quote = content.text("atelier_quote") || "প্রকৃতির নিখাদ দান — প্রতিটি পণ্যে সততা ও শুদ্ধতার ছোঁয়া।";
    const credit = content.text("atelier_credit") || "— আমাদের পারিবারিক প্রতিশ্রুতি";
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Heading as="h2" className="font-serif text-2xl leading-relaxed md:text-4xl text-[var(--st-fg)]">
          {quote}
        </Heading>
        {credit && <p className={cx("mt-4 text-xs font-medium uppercase tracking-[0.25em]", muted)}>{credit}</p>}
      </section>
    );
  }

  return null;
}
