CREATE OR REPLACE FUNCTION public.admin_reseller_overview(_from date DEFAULT NULL::date, _to date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE res jsonb;
BEGIN
  IF NOT public.is_reseller_report_admin() THEN RAISE EXCEPTION 'Not allowed'; END IF;

  WITH items AS (
    SELECT o.reseller_id, oi.quantity, oi.returned_qty, COALESCE(oi.reseller_price,0) AS unit_price,
           o.status,
           public.supplier_kept_qty(o.status, oi.quantity, oi.returned_qty) AS kept_qty,
           public.supplier_return_qty(o.status, oi.quantity, oi.returned_qty) AS ret_qty
    FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    WHERE o.reseller_id IS NOT NULL
      AND (_from IS NULL OR o.created_at >= _from::timestamptz)
      AND (_to IS NULL OR o.created_at < (_to + 1)::timestamptz)
  ),
  agg AS (
    SELECT reseller_id,
           COALESCE(SUM(kept_qty),0) AS sold_qty,
           COALESCE(SUM(kept_qty * unit_price),0) AS sold_value,
           COALESCE(SUM(ret_qty),0) AS returned_qty,
           COALESCE(SUM(ret_qty * unit_price),0) AS returned_amount,
           COALESCE(SUM(CASE WHEN status NOT IN ('cancelled','draft') THEN quantity ELSE 0 END),0) AS supplied_qty,
           COALESCE(SUM(CASE WHEN status NOT IN ('cancelled','draft') THEN quantity * unit_price ELSE 0 END),0) AS supplied_value,
           COALESCE(SUM(CASE WHEN status NOT IN ('cancelled','draft') AND kept_qty = 0 AND ret_qty = 0 THEN quantity ELSE 0 END),0) AS pending_qty,
           COALESCE(SUM(CASE WHEN status NOT IN ('cancelled','draft') AND kept_qty = 0 AND ret_qty = 0 THEN quantity * unit_price ELSE 0 END),0) AS pending_amount
    FROM items GROUP BY reseller_id
  ),
  oagg AS (
    SELECT o.reseller_id,
           COUNT(*) FILTER (WHERE o.status NOT IN ('cancelled','draft')) AS orders,
           COALESCE(SUM(CASE WHEN o.status IN ('delivered','partial','partial_full','partial_item','partial_delivery','damaged','returned','cancelled')
                             THEN COALESCE(o.reseller_profit,0) ELSE 0 END),0) AS earning,
           COALESCE(SUM(CASE WHEN o.status NOT IN ('cancelled','draft','delivered','partial','partial_full','partial_item','partial_delivery','damaged','returned')
                             THEN COALESCE(o.reseller_profit,0) ELSE 0 END),0) AS upcoming_profit
    FROM public.orders o
    WHERE o.reseller_id IS NOT NULL
      AND (_from IS NULL OR o.created_at >= _from::timestamptz)
      AND (_to IS NULL OR o.created_at < (_to + 1)::timestamptz)
    GROUP BY o.reseller_id
  )
  SELECT jsonb_build_object(
    'resellers', COALESCE(jsonb_agg(jsonb_build_object(
      'id', r.id, 'user_id', r.user_id, 'code', r.code,
      'display_name', COALESCE(r.business_name, r.code), 'status', r.status,
      'phone', r.contact_phone,
      'created_at', r.created_at,
      'orders', COALESCE(oa.orders,0),
      'sold_qty', COALESCE(a.sold_qty,0), 'sold_value', COALESCE(a.sold_value,0),
      'earning', COALESCE(oa.earning,0), 'upcoming_profit', COALESCE(oa.upcoming_profit,0),
      'returned_qty', COALESCE(a.returned_qty,0), 'returned_amount', COALESCE(a.returned_amount,0),
      'supplied_qty', COALESCE(a.supplied_qty,0), 'supplied_value', COALESCE(a.supplied_value,0),
      'pending_qty', COALESCE(a.pending_qty,0), 'pending_amount', COALESCE(a.pending_amount,0),
      'paid', (SELECT COALESCE(SUM(amount),0) FROM public.payouts p WHERE p.reseller_id = r.id AND p.status = 'paid'),
      'pending_payout', (SELECT COALESCE(SUM(amount),0) FROM public.payouts p WHERE p.reseller_id = r.id AND p.status IN ('pending','approved')),
      'deposit_balance', (SELECT COALESCE(SUM(rd.amount),0) FROM public.reseller_deposits rd WHERE rd.reseller_id = r.id)
    ) ORDER BY COALESCE(oa.earning,0) DESC), '[]'::jsonb)
  ) INTO res
  FROM public.resellers r
  LEFT JOIN agg a ON a.reseller_id = r.id
  LEFT JOIN oagg oa ON oa.reseller_id = r.id;

  RETURN res;
END $function$;

GRANT EXECUTE ON FUNCTION public.admin_reseller_overview(date, date) TO authenticated;