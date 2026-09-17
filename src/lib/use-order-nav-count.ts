import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { NavEntry } from "@/components/AppShell";

/**
 * Live "actionable orders" badge for the panel nav (sidebar + bottom nav).
 * The meaning is role-based (resolved in the DB function `order_nav_count`):
 * - admin/staff → orders sent to admin (forwarded)
 * - reseller    → new orders (draft/pending)
 * - supplier    → confirmed orders containing their products
 * Refreshes on mount, on window focus, and every 60s.
 */
export function useOrderNavCount(enabled = true) {
  const [count, setCount] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.rpc("order_nav_count" as never);
    if (!error && typeof data === "number") setCount(data);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void load();
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    timer.current = setInterval(load, 60_000);
    return () => {
      window.removeEventListener("focus", onFocus);
      if (timer.current) clearInterval(timer.current);
    };
  }, [enabled, load]);

  return count;
}

/** Returns a copy of the nav with the count badge attached to the orders entry. */
export function applyOrderBadge(nav: NavEntry[], ordersTo: string, count: number): NavEntry[] {
  return applyNavBadges(nav, { [ordersTo]: count });
}

/** Attach count badges to any nav routes (`{ "/admin/orders": 4 }`). */
export function applyNavBadges(nav: NavEntry[], counts: Record<string, number>): NavEntry[] {
  const badgeFor = (to: string) => {
    const value = counts[to];
    return value && value > 0 ? value : undefined;
  };
  return nav.map((entry) => {
    if ("items" in entry) {
      return {
        ...entry,
        items: entry.items.map((it) => {
          const badge = badgeFor(it.to);
          return badge ? { ...it, badge } : it;
        }),
      };
    }
    const badge = badgeFor(entry.to);
    return badge ? { ...entry, badge } : entry;
  });
}

export interface PanelNavCounts {
  orders: number;
  rider: number;
  payouts: number;
  supplierPayouts: number;
}

/**
 * Live badge counts for the panel nav, role-scoped in `panel_nav_counts`:
 * actionable orders, orders waiting on a rider, and pending payout requests.
 */
export function usePanelNavCounts(enabled = true): PanelNavCounts {
  const [counts, setCounts] = useState<PanelNavCounts>({ orders: 0, rider: 0, payouts: 0, supplierPayouts: 0 });
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.rpc("panel_nav_counts" as never);
    if (error || !data || typeof data !== "object") return;
    const row = data as Record<string, unknown>;
    setCounts({
      orders: Number(row.orders ?? 0),
      rider: Number(row.rider ?? 0),
      payouts: Number(row.payouts ?? 0),
      supplierPayouts: Number(row.supplier_payouts ?? 0),
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void load();
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    timer.current = setInterval(load, 60_000);
    return () => {
      window.removeEventListener("focus", onFocus);
      if (timer.current) clearInterval(timer.current);
    };
  }, [enabled, load]);

  return counts;
}
