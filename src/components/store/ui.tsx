import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  CheckCircle2,
  Zap,
  Flame,
  Leaf,
  ShieldCheck,
  ArrowRight,
  Eye,
} from "lucide-react";
import { bdt } from "@/lib/store-cart";
import { deliveryLabel, resolveDelivery } from "@/lib/delivery";
import { useStore, type StoreListing } from "./store-context";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** Shared surface / text helpers driven by theme CSS vars. */
export const surface = "bg-[var(--st-surface)] text-[var(--st-fg)]";
export const muted = "text-[var(--st-muted)]";
export const borderc = "border-[var(--st-border)]";

export function Heading({
  children,
  className,
  as: As = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <As
      className={cx("text-[var(--st-fg)]", className)}
      style={{
        fontFamily: "var(--st-font-head)",
        fontWeight: "var(--st-head-weight)" as unknown as number,
        letterSpacing: "var(--st-track)",
      }}
    >
      {children}
    </As>
  );
}

export function SectionHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  const { theme } = useStore();
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <Heading className={theme.id === "noir" || theme.id === "atelier" ? "text-2xl md:text-3xl font-serif" : "text-xl md:text-2xl font-bold"}>
          {title}
        </Heading>
        {subtitle && <p className={cx("mt-1.5 text-sm", muted)}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PrimaryButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cx(
        "inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 shadow-sm",
        "rounded-[var(--st-radius-sm)] bg-[var(--st-primary)] text-[var(--st-on-primary)] hover:brightness-105",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cx(
        "inline-flex items-center justify-center gap-2 border px-5 py-3 text-sm font-medium transition-colors",
        "rounded-[var(--st-radius-sm)]",
        borderc,
        "hover:bg-[var(--st-bg-alt)] hover:border-[var(--st-primary)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Price({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={cx("text-[var(--st-primary)] font-bold tracking-tight", className)}
      style={{ fontFamily: "var(--st-font-head)" }}
    >
      {bdt(value)}
    </span>
  );
}

export function ProductCard({ listing }: { listing: StoreListing }) {
  const { code, theme, title, image } = useStore();
  const img = image(listing);
  const p = listing.product!;
  const free = resolveDelivery(p).mode === "free";

  const saleCount = useMemo(() => {
    let hash = 0;
    const str = p.id;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 240) + 25;
  }, [p.id]);

  const rating = useMemo(() => {
    const r = 4.7 + (saleCount % 4) * 0.08;
    return Math.min(5.0, r).toFixed(1);
  }, [saleCount]);

  const sellingPrice = Number(listing.selling_price);
  const regularPrice = Math.round(sellingPrice * 1.25);

  /* -------------------------------------------------------------
   * THEME 1: BAZAAR (হাটবাজার / সুপার ফাস্ট ডিল ও মার্কেটপ্লেস)
   * High-density, punchy Bangladeshi marketplace style, 1-click Order Now
   * ------------------------------------------------------------- */
  if (theme.id === "bazaar") {
    return (
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border-2 border-[var(--st-border)] bg-[var(--st-surface)] shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[var(--st-primary)] hover:shadow-lg">
        <Link
          to="/s/$code/p/$slug"
          params={{ code, slug: p.slug }}
          className="block"
        >
          {/* Image Box */}
          <div className="relative aspect-square overflow-hidden bg-[var(--st-bg-alt)]">
            {img ? (
              <img
                src={img}
                alt={title(listing)}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className={cx("grid h-full w-full place-items-center text-xs", muted)}>ছবি নেই</div>
            )}

            {/* Badges */}
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              <span className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                <Flame className="h-3 w-3 animate-pulse" /> স্পেশাল অফার
              </span>
              {free && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  <Truck className="h-2.5 w-2.5" /> ফ্রি ডেলিভারি
                </span>
              )}
            </div>

            {/* Order stats */}
            <div className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
              ★ {rating} ({saleCount}+ বিক্রয়)
            </div>
          </div>

          {/* Details */}
          <div className="p-3">
            <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-[var(--st-fg)] sm:text-sm group-hover:text-[var(--st-primary)] transition-colors">
              {title(listing)}
            </h3>

            {/* Price section */}
            <div className="mt-2 flex items-baseline gap-2">
              <Price value={sellingPrice} className="text-base sm:text-lg" />
              <span className="text-xs text-muted-foreground line-through opacity-70">
                {bdt(regularPrice)}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3 shrink-0" /> ক্যাশ অন ডেলিভারি সুবিধা
            </div>
          </div>
        </Link>

        {/* 1-Click Order Button on Card */}
        <div className="px-3 pb-3">
          <Link
            to="/s/$code/p/$slug"
            params={{ code, slug: p.slug }}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--st-primary)] py-2 text-xs font-bold text-[var(--st-on-primary)] transition-all hover:brightness-110 active:scale-95 shadow-xs"
          >
            <Zap className="h-3.5 w-3.5 fill-current" /> অর্ডার করুন
          </Link>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * THEME 2: NOIR LUXE (প্রিমিয়াম লাক্সারি ও ফ্যাশন বুটিক)
   * Dark/gold elegant boutique style, tall frame, serif typography
   * ------------------------------------------------------------- */
  if (theme.id === "noir") {
    return (
      <Link
        to="/s/$code/p/$slug"
        params={{ code, slug: p.slug }}
        className="group block overflow-hidden rounded-md border border-[var(--st-border)] bg-[var(--st-surface)] p-2 transition-all duration-300 hover:border-[#d9c08a] hover:shadow-xl"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-xs bg-[var(--st-bg-alt)]">
          {img ? (
            <img
              src={img}
              alt={title(listing)}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
          ) : (
            <div className={cx("grid h-full w-full place-items-center text-xs", muted)}>No image</div>
          )}

          {/* Luxury Badge */}
          <div className="absolute left-2.5 top-2.5">
            <span className="inline-flex items-center gap-1 rounded-xs border border-[var(--st-border)] bg-black/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d9c08a] backdrop-blur-md">
              <Sparkles className="h-2.5 w-2.5" /> SIGNATURE
            </span>
          </div>
        </div>

        <div className="p-3 text-center">
          <h3 className="line-clamp-2 font-serif text-sm font-medium tracking-wide text-[var(--st-fg)] transition-colors group-hover:text-[#d9c08a]">
            {title(listing)}
          </h3>

          <div className="mt-2 flex items-center justify-center gap-2">
            <Price value={sellingPrice} className="text-sm font-semibold tracking-wider text-[#d9c08a]" />
          </div>

          <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium tracking-widest uppercase text-muted-foreground group-hover:text-[var(--st-fg)] transition-colors">
            কালেকশন দেখুন <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    );
  }

  /* -------------------------------------------------------------
   * THEME 4: ATELIER (অর্গানিক, হেলথ, বই ও ক্রাফট)
   * Warm paper tone, earthy storytelling card with organic seal
   * ------------------------------------------------------------- */
  if (theme.id === "atelier") {
    return (
      <Link
        to="/s/$code/p/$slug"
        params={{ code, slug: p.slug }}
        className="group block overflow-hidden rounded-2xl border border-[var(--st-border)] bg-[var(--st-surface)] p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
      >
        <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--st-bg-alt)]">
          {img ? (
            <img
              src={img}
              alt={title(listing)}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-106"
            />
          ) : (
            <div className={cx("grid h-full w-full place-items-center text-xs", muted)}>No image</div>
          )}

          <div className="absolute left-2.5 top-2.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--st-surface)]/90 px-2.5 py-0.5 text-[10px] font-medium text-[var(--st-primary)] shadow-xs backdrop-blur-xs">
              <Leaf className="h-3 w-3" /> খাঁটি ও অরিজিনাল
            </span>
          </div>
        </div>

        <div className="pt-3.5 pb-1">
          <h3 className="line-clamp-2 text-sm font-medium text-[var(--st-fg)] group-hover:text-[var(--st-primary)] transition-colors">
            {title(listing)}
          </h3>

          <div className="mt-2 flex items-baseline justify-between gap-2">
            <Price value={sellingPrice} className="text-base font-semibold" />
            <span className="text-[11px] text-muted-foreground">সরাসরি প্রস্তুতকারক</span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[var(--st-border)] pt-2 text-xs text-[var(--st-primary)] font-medium">
            <span>বিস্তারিত দেখুন</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    );
  }

  /* -------------------------------------------------------------
   * THEME 1: AURORA (মডার্ন ট্রেন্ডি ও গ্যাজেট স্টোর — DEFAULT)
   * Sleek glassmorphism, modern rounded curves, glowing gradient pill
   * ------------------------------------------------------------- */
  return (
    <Link
      to="/s/$code/p/$slug"
      params={{ code, slug: p.slug }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--st-border)] bg-[var(--st-surface)] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[var(--st-primary)] hover:shadow-xl hover:shadow-[var(--st-primary)]/10"
    >
      <div>
        <div className="relative aspect-square overflow-hidden bg-[var(--st-bg-alt)]">
          {img ? (
            <img
              src={img}
              alt={title(listing)}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-106"
            />
          ) : (
            <div className={cx("grid h-full w-full place-items-center text-xs", muted)}>No image</div>
          )}

          {/* Pill Badges */}
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--st-surface)]/90 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--st-primary)] shadow-xs backdrop-blur-md">
              <Sparkles className="h-3 w-3" /> ট্রেন্ডিং
            </span>
            {free && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--st-primary)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--st-on-primary)] shadow-xs">
                ফ্রি ডেলিভারি
              </span>
            )}
          </div>

          <div className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" /> {rating}
          </div>
        </div>

        <div className="p-4">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--st-fg)] transition-colors group-hover:text-[var(--st-primary)]">
            {title(listing)}
          </h3>

          <div className="mt-2.5 flex items-baseline justify-between gap-2">
            <Price value={sellingPrice} className="text-lg" />
            <span className={cx("text-[11px]", muted)}>{free ? "Free Delivery" : deliveryLabel(p)}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center justify-between rounded-xl bg-[var(--st-bg)] px-3 py-2 text-xs font-semibold text-[var(--st-primary)] group-hover:bg-[var(--st-primary)] group-hover:text-[var(--st-on-primary)] transition-colors">
          <span>অর্ডার করুন</span>
          <ShoppingCart className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ listings }: { listings: StoreListing[] }) {
  const { theme } = useStore();

  const cols =
    theme.id === "bazaar"
      ? "grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      : theme.id === "noir"
        ? "grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
        : theme.id === "atelier"
          ? "grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={cx("grid", cols)}>
      {listings.map((l) => (
        <ProductCard key={l.id} listing={l} />
      ))}
    </div>
  );
}

export function EmptyState({ title, hint, icon }: { title: string; hint?: string; icon?: React.ReactNode }) {
  return (
    <div className={cx("grid place-items-center rounded-[var(--st-radius)] border border-dashed py-20 text-center", borderc)}>
      <div className="flex flex-col items-center">
        {icon && <div className="mb-3">{icon}</div>}
        <Heading className="text-lg font-semibold">{title}</Heading>
        {hint && <p className={cx("mt-1.5 text-sm", muted)}>{hint}</p>}
      </div>
    </div>
  );
}
