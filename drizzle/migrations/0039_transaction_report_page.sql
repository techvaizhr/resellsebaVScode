CREATE INDEX IF NOT EXISTS idx_orders_settled_updated ON public.orders (updated_at DESC)
  WHERE status IN ('delivered','partial','partial_full','partial_item','partial_delivery','damaged','returned') AND reseller_profit <> 0;
CREATE INDEX IF NOT EXISTS idx_orders_settled_reseller_updated ON public.orders (reseller_id, updated_at DESC)
  WHERE status IN ('delivered','partial','partial_full','partial_item','partial_delivery','damaged','returned') AND reseller_profit <> 0;
CREATE INDEX IF NOT EXISTS idx_reseller_deposits_reseller_created ON public.reseller_deposits (reseller_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reseller_deposits_created ON public.reseller_deposits (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payouts_created ON public.payouts (created_at DESC);

-- One call, one JSON value: no API row cap, all rows in range.
CREATE OR REPLACE FUNCTION public.transaction_report_page(_reseller_id uuid, _from timestamptz, _to timestamptz)
RETURNS jsonb LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'rows', COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM public.transaction_report(_reseller_id, _from, _to, 2147483647) t), '[]'::jsonb),
    'resellers', CASE WHEN public.has_any_permission(auth.uid(), ARRAY['finance.view','reports.view','payouts.manage','resellers.manage','orders.view'])
      THEN COALESCE((SELECT jsonb_agg(jsonb_build_object('id',id,'business_name',business_name,'code',code,'avatar_url',avatar_url) ORDER BY business_name) FROM public.resellers), '[]'::jsonb)
      ELSE '[]'::jsonb END
  );
$$;
REVOKE ALL ON FUNCTION public.transaction_report_page(uuid, timestamptz, timestamptz) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.transaction_report_page(uuid, timestamptz, timestamptz) TO authenticated;