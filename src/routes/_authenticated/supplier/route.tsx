import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  PackageSearch,
  Undo2,
  Wallet,
  Loader2,
  ShieldAlert,
  UserCircle,
} from "lucide-react";
import { AppShell, type NavEntry } from "@/components/AppShell";
import { useAuth } from "@/lib/use-auth";
import { useVerification } from "@/lib/use-verification";
import { useBrandingTheme } from "@/lib/branding";
import { supabase } from "@/integrations/supabase/client";
import { loadSupplierBootstrap, type SupplierReport } from "@/lib/supplier";
import { SupplierProvider } from "@/components/supplier-context";
import { ImpersonationBanner } from "@/components/impersonation-banner";


export const Route = createFileRoute("/_authenticated/supplier")({
  component: SupplierLayout,
});

const NAV: NavEntry[] = [
  { label: "Dashboard", to: "/supplier", icon: <LayoutDashboard className="h-4 w-4" />, end: true },
  { label: "My products", to: "/supplier/products", icon: <Package className="h-4 w-4" /> },
  { label: "My orders", to: "/supplier/orders", icon: <ShoppingCart className="h-4 w-4" /> },
  { label: "Sales report", to: "/supplier/report", icon: <PackageSearch className="h-4 w-4" /> },
  { label: "Returns", to: "/supplier/returns", icon: <Undo2 className="h-4 w-4" /> },
  { label: "Payouts", to: "/supplier/payouts", icon: <Wallet className="h-4 w-4" /> },
  { label: "My profile", to: "/supplier/profile", icon: <UserCircle className="h-4 w-4" /> },
];

function SupplierLayout() {
  const { user, roles, loading } = useAuth();
  const { required: needsVerify, loading: verifyLoading } = useVerification();
  const nav = useNavigate();
  const [data, setData] = useState<SupplierReport | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "none">("loading");
  const [reloading, setReloading] = useState(false);

  const load = useCallback(async () => {
    const boot = await loadSupplierBootstrap().catch(() => null);
    setData(boot);
    setState(boot?.supplier ? "ready" : "none");
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
  }, [loading, user, load]);

  useEffect(() => {
    if (loading || verifyLoading || !user) return;
    if (needsVerify) {
      nav({ to: "/verify", replace: true });
      return;
    }
    if (roles.includes("super_admin") || roles.includes("staff")) {
      nav({ to: "/admin", replace: true });
      return;
    }
    if (state === "none") nav({ to: "/dashboard", replace: true });
  }, [loading, verifyLoading, user, needsVerify, roles, nav, state]);

  useBrandingTheme(data?.settings?.primary_color ?? null);

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
            {supplier.status === "pending" ? "অ্যাকাউন্ট অনুমোদনের অপেক্ষায়" : "অ্যাকাউন্ট বন্ধ আছে"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {supplier.status === "pending"
              ? "আপনার সাপ্লায়ার অ্যাকাউন্ট রিভিউ করা হচ্ছে। অ্যাডমিন অনুমোদন দিলেই ড্যাশবোর্ড চালু হবে।"
              : "আপনার সাপ্লায়ার অ্যাকাউন্টটি বর্তমানে নিষ্ক্রিয়। অ্যাডমিনের সাথে যোগাযোগ করুন।"}
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
        brand={{
          name: data.settings?.site_name ?? "Supplier",
          sub: supplier.code,
          logoUrl: data.settings?.logo_url ?? null,
        }}
        nav={NAV}
        user={{ name: supplier.display_name, email: user.email ?? "" }}
      >
        <ImpersonationBanner />
        <Outlet />

      </AppShell>
    </SupplierProvider>
  );
}
