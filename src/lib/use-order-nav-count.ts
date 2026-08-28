import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
