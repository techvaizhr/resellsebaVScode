import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { canAccessResellerPanel } from "@/lib/reseller-status";

import {
  Activity,
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  Palette,
  Globe,
  Wallet,
  Package,
  Award,
  Megaphone,
  GraduationCap,
  Loader2,
  ExternalLink,
  Store,
  Rocket,
  TrendingUp,
  Headphones,
  UserCircle,
  ListTree,
  CreditCard,
  BadgeCheck,
  Lock,
  ScrollText,


} from "lucide-react";
import { AppShell, type NavEntry } from "@/components/AppShell";
import { ImpersonationBanner } from "@/components/impersonation-banner";
import { useAuth } from "@/lib/use-auth";
import { useVerification } from "@/lib/use-verification";
import { useBrandingTheme } from "@/lib/branding";
import { getGlobalSettings, getMyReseller } from "@/lib/app-data";
import { getPanelBootstrapPayload } from "@/lib/panel-bootstrap";
import { fmtDate, statusLabel, type SubscriptionState } from "@/lib/subscription";
import { consumeImpersonationReturnTarget } from "@/lib/impersonation";
import { useOrderNavCount, applyOrderBadge } from "@/lib/use-order-nav-count";

export const Route = createFileRoute("/_authenticated/reseller")({
  component: ResellerLayout,
});

const NAV: NavEntry[] = [
  { label: "Dashboard", to: "/reseller", icon: <LayoutDashboard className="h-4 w-4" />, end: true },
  {
    label: "Products",
    icon: <Package className="h-4 w-4" />,
    items: [
      { label: "Catalog", to: "/reseller/catalog", icon: <Package className="h-4 w-4" /> },
      { label: "My listings", to: "/reseller/listings", icon: <ShoppingBag className="h-4 w-4" /> },
    ],
  },
  { label: "Orders", to: "/reseller/orders", icon: <ClipboardList className="h-4 w-4" /> },
  { label: "Customers", to: "/reseller/customers", icon: <Users className="h-4 w-4" /> },

  {
    label: "Finance",
    icon: <Wallet className="h-4 w-4" />,
    items: [
      { label: "Transactions", to: "/reseller/transactions", icon: <TrendingUp className="h-4 w-4" /> },
      { label: "Payouts", to: "/reseller/payouts", icon: <Wallet className="h-4 w-4" /> },
      { label: "Leader commissions", to: "/reseller/commissions", icon: <Award className="h-4 w-4" /> },
      { label: "My subscription", to: "/reseller/subscription", icon: <BadgeCheck className="h-4 w-4" /> },
    ],
  },
  {
    label: "Growth",
    icon: <Rocket className="h-4 w-4" />,
    items: [
      { label: "Marketing", to: "/reseller/marketing", icon: <Megaphone className="h-4 w-4" /> },
      { label: "Video tutorials", to: "/reseller/tutorials", icon: <GraduationCap className="h-4 w-4" /> },
    ],
  },
  {
    label: "Store",
    icon: <Store className="h-4 w-4" />,
    items: [
      { label: "General settings", to: "/reseller/settings", icon: <Store className="h-4 w-4" /> },
      { label: "Payment methods", to: "/reseller/payments", icon: <CreditCard className="h-4 w-4" /> },
      { label: "Theme", to: "/reseller/theme", icon: <Palette className="h-4 w-4" /> },
      { label: "Header menu", to: "/reseller/menus", icon: <ListTree className="h-4 w-4" /> },
      { label: "Domain", to: "/reseller/domain", icon: <Globe className="h-4 w-4" /> },

      { label: "Visitors", to: "/reseller/visitors", icon: <Activity className="h-4 w-4" /> },
    ],
  },
  { label: "My profile", to: "/reseller/profile", icon: <UserCircle className="h-4 w-4" /> },
  { label: "Policies", to: "/reseller/policies", icon: <ScrollText className="h-4 w-4" /> },
  { label: "Support", to: "/reseller/support", icon: <Headphones className="h-4 w-4" /> },
];


function ResellerLayout() {
  const { user, roles, loading } = useAuth();
  const orderNavCount = useOrderNavCount();
  const [subscription, setSubscription] = useState<SubscriptionState | null>(null);
  const navWithBadge = useMemo(() => {
    // A panel-only plan has no public storefront, so its settings stay hidden.
    const base = subscription && subscription.store_enabled === false
      ? NAV.filter((n) => n.label !== "Store")
      : NAV;
    return applyOrderBadge(base, "/reseller/orders", orderNavCount);
  }, [orderNavCount, subscription]);
  const { required: needsVerify, loading: verifyLoading } = useVerification();
  const location = useLocation();
  const nav = useNavigate();
  const [storeName, setStoreName] = useState("My store");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [storeCode, setStoreCode] = useState<string | null>(null);
  const [primary, setPrimary] = useState<string | null>(null);
  const [accent, setAccent] = useState<string | null>(null);
  const [radius, setRadius] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [approved, setApproved] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading || verifyLoading || !user) return;
    if (needsVerify) {
      nav({ to: "/verify", replace: true });
      return;
    }
    if (roles.includes("super_admin") || roles.includes("staff")) {
      nav({ to: (consumeImpersonationReturnTarget() ?? "/admin") as never, replace: true });
      return;
    }
    if (approved === null) return;
    if (approved === false) {
      nav({ to: "/onboarding", replace: true });
    }
  }, [approved, loading, roles, nav, needsVerify, verifyLoading, user]);

  useEffect(() => {
    if (approved === false) nav({ to: "/onboarding", replace: true });
  }, [approved, nav]);

  useEffect(() => {
    if (!user) return;
    let alive = true;

    const loadBranding = async () => {
      const [g, r] = await Promise.all([getGlobalSettings(), getMyReseller(user.id)]);
      if (!alive) return;
      let logo: string | null = g?.logo_url ?? null;
      let color: string | null = g?.primary_color ?? null;
      let acc: string | null = (g as any)?.accent_color ?? null;
      let rad: string | null = (g as any)?.border_radius ?? null;

      if (r) {
        setApproved(canAccessResellerPanel(r.status));

        setStoreName(r.business_name);
        setStoreCode(r.code);
        setAvatarUrl(r.avatar_url ?? null);
        // Store branding rides along with the panel bootstrap.
        const boot = getPanelBootstrapPayload();
        setSubscription(boot?.subscription ?? null);
        const s = boot?.reseller_settings ?? null;
        if (s?.logo_url) logo = s.logo_url;
        if (s?.primary_color) color = s.primary_color;
      } else {
        setApproved(false);
      }
      setLogoUrl(logo);
      setPrimary(color);
      setAccent(acc);
      setRadius(rad);
    };

    void loadBranding();

    const onBrandUpdate = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail) {
        if (detail.primary_color) setPrimary(detail.primary_color);
        if (detail.accent_color) setAccent(detail.accent_color);
        if (detail.border_radius) setRadius(detail.border_radius);
        if (detail.logo_url !== undefined) setLogoUrl(detail.logo_url);
      } else {
        void loadBranding();
      }
    };

    window.addEventListener("brand_settings_updated", onBrandUpdate);
    return () => {
      alive = false;
      window.removeEventListener("brand_settings_updated", onBrandUpdate);
    };
  }, [user]);

  useBrandingTheme(primary, accent, { radius });


  if (
    loading ||
    !user ||
    verifyLoading ||
    approved !== true
  ) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }


  const allowedWhileLocked = ["/reseller/subscription", "/reseller/profile", "/reseller/support"];
  const locked =
    Boolean(subscription?.locked) && !allowedWhileLocked.some((p) => location.pathname.startsWith(p));

  return (
    <AppShell
      title="Reseller panel"
      homeTo="/reseller"
      bottomNav={{
        homeTo: "/reseller",
        left: { label: "Orders", to: "/reseller/orders", icon: ClipboardList, badge: orderNavCount },
        right: { label: "Catalog", to: "/reseller/catalog", icon: Package },
      }}
      brand={{ name: storeName, sub: storeCode ? `/${storeCode}` : "Reseller", logoUrl }}
      nav={navWithBadge}
      user={{
        name: storeName || (user as any).user_metadata?.full_name || user.name || "Reseller",
        email: user.email ?? "",
        avatarUrl,
      }}
      headerRight={
        <>
          <Link
            to="/reseller/catalog"
            title="Catalog"
            className="hidden md:inline-flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-sm font-medium transition hover:bg-muted sm:px-3"
          >
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Catalog</span>
          </Link>
          {storeCode ? (
            <a
              href={`/s/${storeCode}`}
              target="_blank"
              rel="noreferrer"
              title="Visit store"
              className="inline-flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-sm font-medium transition hover:bg-muted sm:px-3"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Visit store</span>
            </a>
          ) : null}
        </>
      }
    >
      <ImpersonationBanner />
      {subscription?.status === "grace" ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-700 dark:text-amber-400">
          <span>
            Your subscription ended on {fmtDate(subscription.current_period_end ?? subscription.ends_at)} —{" "}
            {subscription.grace_days_left ?? 0} day(s) of grace access left.
          </span>
          <Link to="/reseller/subscription" className="rounded-md bg-amber-500 px-2.5 py-1 font-semibold text-white">
            Renew now
          </Link>
        </div>
      ) : null}
      {locked ? <SubscriptionLock state={subscription} /> : <Outlet />}
    </AppShell>
  );
}


/** Shown instead of the page when the plan has expired past its grace period. */
function SubscriptionLock({ state }: { state: SubscriptionState | null }) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <Lock className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold">Your subscription has ended</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {statusLabel(state?.status)} · {state?.plan_name ?? "No plan"} — the panel, your storefront and new orders stay
        paused until the plan is renewed.
      </p>
      <Link
        to="/reseller/subscription"
        className="mt-5 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Renew subscription
      </Link>
    </div>
  );
}
