CREATE OR REPLACE FUNCTION public.transaction_report_page(_reseller_id uuid, _from timestamptz, _to timestamptz)
RETURNS jsonb LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'rows', COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM public.transaction_report(_reseller_id, _from, _to, 2147483647) t), '[]'::jsonb),
    'opening', CASE WHEN _from IS NULL THEN '{}'::jsonb ELSE COALESCE((
      SELECT jsonb_object_agg(x.rid, x.bal) FROM (
        SELECT t.reseller_id::text rid,
          SUM(CASE WHEN t.direction='in' THEN t.amount WHEN t.direction='out' THEN -t.amount ELSE 0 END) bal
        FROM public.transaction_report(_reseller_id, NULL, _from, 2147483647) t
        WHERE t.reseller_id IS NOT NULL
        GROUP BY t.reseller_id) x), '{}'::jsonb) END,
    'resellers', CASE WHEN public.has_any_permission(auth.uid(), ARRAY['finance.view','reports.view','payouts.manage','resellers.manage','orders.view'])
      THEN COALESCE((SELECT jsonb_agg(jsonb_build_object('id',id,'business_name',business_name,'code',code,'avatar_url',avatar_url) ORDER BY business_name) FROM public.resellers), '[]'::jsonb)
      ELSE '[]'::jsonb END
  );
$$;
REVOKE ALL ON FUNCTION public.transaction_report_page(uuid, timestamptz, timestamptz) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.transaction_report_page(uuid, timestamptz, timestamptz) TO authenticated;