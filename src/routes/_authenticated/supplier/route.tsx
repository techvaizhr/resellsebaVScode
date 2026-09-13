import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  PackageSearch,
  Undo2,
  Wallet,
  Loader2,
  ShieldAlert,
  Image as ImageIcon,
  UserCircle,
} from "lucide-react";
import { AppShell, type NavEntry } from "@/components/AppShell";
import { useAuth } from "@/lib/use-auth";
import { useVerification } from "@/lib/use-verification";
import { useBrandingTheme } from "@/lib/branding";
import { getGlobalSettings } from "@/lib/app-data";
import { supabase } from "@/integrations/laravel/client";
import { loadSupplierBootstrap, type SupplierReport } from "@/lib/supplier";
import { SupplierProvider } from "@/components/supplier-context";
import { useOrderNavCount, applyOrderBadge } from "@/lib/use-order-nav-count";
import { ImpersonationBanner } from "@/components/impersonation-banner";


export const Route = createFileRoute("/_authenticated/supplier")({
  component: SupplierLayout,
});

const NAV: NavEntry[] = [
  { label: "Dashboard", to: "/supplier", icon: <LayoutDashboard className="h-4 w-4" />, end: true },
  { label: "My products", to: "/supplier/products", icon: <Package className="h-4 w-4" /> },
  { label: "Media Library", to: "/supplier/media", icon: <ImageIcon className="h-4 w-4" /> },
  { label: "My orders", to: "/supplier/orders", icon: <ShoppingCart className="h-4 w-4" /> },
  { label: "Sales report", to: "/supplier/report", icon: <PackageSearch className="h-4 w-4" /> },
  { label: "Returns", to: "/supplier/returns", icon: <Undo2 className="h-4 w-4" /> },
  { label: "Payouts", to: "/supplier/payouts", icon: <Wallet className="h-4 w-4" /> },
  { label: "My profile", to: "/supplier/profile", icon: <UserCircle className="h-4 w-4" /> },
];

function SupplierLayout() {
  const { user, roles, loading } = useAuth();
  const orderNavCount = useOrderNavCount();
  const navWithBadge = useMemo(
    () => applyOrderBadge(NAV, "/supplier/orders", orderNavCount),
    [orderNavCount],
  );
  const { required: needsVerify, loading: verifyLoading } = useVerification();
  const nav = useNavigate();
  const [data, setData] = useState<SupplierReport | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "none">("loading");
  const [reloading, setReloading] = useState(false);
  const [primary, setPrimary] = useState<string | null>(null);
  const [accent, setAccent] = useState<string | null>(null);
  const [radius, setRadius] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [boot, g] = await Promise.all([loadSupplierBootstrap(), getGlobalSettings()]);
      if (boot?.supplier) {
        setData(boot);
        setState("ready");
      } else {
        setState("none");
      }
      const prim = g?.primary_color || boot?.settings?.primary_color || null;
      const acc = g?.accent_color || (boot?.settings as any)?.accent_color || null;
      const rad = (g as any)?.border_radius || (boot?.settings as any)?.border_radius || null;
      setPrimary(prim);
      setAccent(acc);
      setRadius(rad);
    } catch {
      setState("none");
    }
  }, []);

  const reload = useCallback(async () => {
    setReloading(true);
    try {
      await load();
    } finally {
      setReloading(false);
    }
  }, [load]);

  useEffect(() => {
    if (loading || !user) return;
    void load();

    const onBrandUpdate = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail) {
        if (detail.primary_color) setPrimary(detail.primary_color);
        if (detail.accent_color) setAccent(detail.accent_color);
        if (detail.border_radius) setRadius(detail.border_radius);
      } else {
        void load();
      }
    };

    window.addEventListener("brand_settings_updated", onBrandUpdate);
    return () => {
      window.removeEventListener("brand_settings_updated", onBrandUpdate);
    };
  }, [loading, user, load]);

  useEffect(() => {
    if (loading || verifyLoading || !user) return;
    if (needsVerify) {
      nav({ to: "/verify", replace: true });
      return;
    }
    if (
      (roles.includes("super_admin") || roles.includes("staff")) &&
      !roles.includes("supplier") &&
      state === "none"
    ) {
      nav({ to: "/admin", replace: true });
      return;
    }
    if (state === "none" && !roles.includes("supplier") && !roles.includes("super_admin")) {
      nav({ to: "/dashboard", replace: true });
    }
  }, [loading, verifyLoading, user, needsVerify, roles, nav, state]);

  useBrandingTheme(primary, accent, { radius });

  if (loading || verifyLoading || !user || state === "loading" || !data?.supplier) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const supplier = data.supplier;

  if (supplier.status !== "active") {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="surface-card max-w-md p-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-amber-500/10 text-amber-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-semibold">
            {supplier.status === "pending" ? "Account pending approval" : "Account suspended"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {supplier.status === "pending"
              ? "Your supplier account is under review. The dashboard will be enabled once the admin approves it."
              : "Your supplier account is currently inactive. Please contact the admin."}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">Supplier code: {supplier.code}</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            className="mt-6 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <SupplierProvider value={{ data, reload, reloading }}>
      <AppShell
        title="Supplier panel"
        homeTo="/supplier"
        bottomNav={{
          homeTo: "/supplier",
          left: { label: "Orders", to: "/supplier/orders", icon: ShoppingCart, badge: orderNavCount },
          right: { label: "Products", to: "/supplier/products", icon: Package },
        }}
        brand={{
          name: data.settings?.site_name ?? "Supplier",
          sub: supplier.code,
          logoUrl: data.settings?.logo_url ?? null,
        }}
        nav={navWithBadge}
        user={{ name: supplier.display_name, email: user.email ?? "" }}
      >
        <ImpersonationBanner />
        <Outlet />

      </AppShell>
    </SupplierProvider>
  );
}
