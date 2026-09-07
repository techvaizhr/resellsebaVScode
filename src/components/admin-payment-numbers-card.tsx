import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, Copy, Info, Landmark } from "lucide-react";
import { cfgString, fetchDepositMethods, type PaymentConfigRow } from "@/lib/payment-methods";
import { PaymentLogo } from "@/components/payments/payment-brand";

/**
 * Compact reseller-dashboard card showing the admin's global bKash / Nagad /
 * Rocket numbers (Personal, Agent, Payment) so a reseller can quickly share
 * one with a customer for an advance / delivery-charge collection, without
 * using their own personal number.
 *
 * Source of truth: the same `payment_configs` rows (reseller_id = null,
 * mode = "manual", is_active = true) that admin manages under
 * Admin → Payments → Manual, and that already power checkout + security
 * deposit. Nothing new to configure — set it once there.
 *
 * Renders nothing when no active method exists, so it never eats space on a
 * store that hasn't set this up yet. Collapsed by default; expands to a
 * small chip grid so it never crowds the rest of the dashboard.
 */
export function AdminPaymentNumbersCard() {
  const [methods, setMethods] = useState<PaymentConfigRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    void fetchDepositMethods().then((list) => {
      if (!alive) return;
      setMethods(list);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (loading || methods.length === 0) return null;

  return (
    <div className="mb-6 overflow-hidden rounded-xl border bg-muted/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Landmark className="h-3.5 w-3.5" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold">
              Payment numbers (advance / delivery charge)
            </span>
            <span className="block truncate text-[10px] text-muted-foreground">
              {open ? "Tap a number to copy it" : `${methods.length} active — tap to view`}
            </span>
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="grid gap-2 border-t p-3 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((m) => {
            const account = cfgString(m.config, "account");
            const accountType = cfgString(m.config, "account_type");
            return (
              <div
                key={m.id}
                className="flex flex-col gap-1.5 rounded-lg border bg-background p-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-md border bg-background p-0.5">
                    <PaymentLogo method={m.method} size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold">{m.label}</span>
                    {accountType && (
                      <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                        {accountType}
                      </span>
                    )}
                  </span>
                </div>

                {account && (
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard.writeText(account);
                      toast.success("Number copied");
                    }}
                    className="flex items-center justify-between gap-2 rounded-md border bg-muted/40 px-2 py-1.5 text-left hover:bg-muted"
                  >
                    <span className="truncate text-xs font-medium tabular-nums">{account}</span>
                    <Copy className="h-3 w-3 shrink-0 text-muted-foreground" />
                  </button>
                )}

                {m.instructions && (
                  <div className="flex items-start gap-1 text-[10px] leading-snug text-muted-foreground">
                    <Info className="mt-0.5 h-2.5 w-2.5 shrink-0" />
                    <span className="line-clamp-2">{m.instructions}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
