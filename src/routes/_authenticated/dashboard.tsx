import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/use-auth";
import { useVerification } from "@/lib/use-verification";
import { supabase } from "@/integrations/laravel/client";
import { Loader2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardRouter,
});

function DashboardRouter() {
  const { roles, permissions, loading, user, accessError } = useAuth();
  const { required: needsVerify, loading: verifyLoading } = useVerification();
  const nav = useNavigate();
  const done = useRef(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    if (loading || verifyLoading || !user || done.current) return;

    if (needsVerify) {
      done.current = true;
      nav({ to: "/verify", replace: true });
      return;
    }

    const userRole = (user as any)?.role;
    const userRoles: string[] = Array.from(
      new Set([
        ...roles,
        ...(Array.isArray((user as any)?.roles) ? (user as any).roles : []),
        userRole,
      ].filter(Boolean))
    );

    const isSuperAdmin = userRoles.includes("super_admin") || userRoles.includes("admin") || user?.email === "admin@resellseba.com";
    const isStaff = userRoles.includes("staff");
    const isReseller = userRoles.includes("reseller") || userRoles.includes("leader");
    const isSupplier = userRoles.includes("supplier") || Boolean((user as any)?.supplier);

    if (isSuperAdmin || isStaff) {
      done.current = true;
      nav({ to: "/admin", replace: true });
      return;
    }
    if (isSupplier) {
      done.current = true;
      nav({ to: "/supplier", replace: true });
      return;
    }
    if (isReseller) {
      done.current = true;
      nav({ to: "/reseller", replace: true });
      return;
    }

    done.current = true;
    void (async () => {
      try {
        if (!accessError) {
          try {
            await (supabase.rpc as unknown as (fn: string) => PromiseLike<unknown>)(
              "bootstrap_current_user",
            );
          } catch {
            /* non-fatal */
          }
          const { data: sup } = await supabase
            .from("suppliers")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();
          if (sup) {
            nav({ to: "/supplier", replace: true });
            return;
          }
          const { data, error } = await supabase
            .from("resellers")
            .select("status")
            .eq("user_id", user.id)
            .maybeSingle();
          if (!error && data) {
            if (data.status === "active") {
              nav({ to: "/reseller", replace: true });
            } else {
              nav({ to: "/onboarding", replace: true });
            }
            return;
          }
        }
      } catch {
        /* fall through to default navigation */
      }

      // Default safe redirect if roles could not be resolved
      if (user.email === "admin@resellseba.com") {
        nav({ to: "/admin", replace: true });
      } else {
        nav({ to: "/reseller", replace: true });
      }
    })();
  }, [roles, permissions, loading, user, nav, needsVerify, verifyLoading, accessError]);

  if (stuck) {
    return (
      <div className="grid min-h-screen place-items-center px-4 bg-background">
        <div className="surface-card max-w-sm p-8 text-center rounded-xl shadow-lg border border-border">
          <h1 className="text-lg font-semibold text-foreground">Could not load your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't find your panel due to a network issue. Please try again.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
            <button
              onClick={() => {
                supabase.auth.signOut().then(() => {
                  window.location.href = "/login";
                });
              }}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
