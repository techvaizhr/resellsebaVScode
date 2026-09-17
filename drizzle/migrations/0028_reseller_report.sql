CREATE OR REPLACE FUNCTION public.is_reseller_report_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT public.is_super_admin(auth.uid())
      OR public.has_any_permission(auth.uid(), ARRAY['resellers.view','resellers.manage','finance.view','reports.view','payouts.manage']);
$function$;

CREATE OR REPLACE FUNCTION public.reseller_report(_reseller uuid DEFAULT NULL::uuid, _from date DEFAULT NULL::date, _to date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  rid uuid;
  res jsonb;
BEGIN
  rid := COALESCE(_reseller, public.current_reseller_id());
  IF rid IS NULL THEN RETURN NULL; END IF;
  IF rid <> COALESCE(public.current_reseller_id(), '00000000-0000-0000-0000-000000000000'::uuid)
     AND NOT public.is_reseller_report_admin() THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  WITH items AS (
    SELECT oi.id, oi.order_id, oi.product_id, oi.product_name, oi.quantity, oi.returned_qty,
           COALESCE(oi.reseller_price,0) AS unit_price,
           CASE WHEN COALESCE(oi.quantity,0) > 0
                THEN COALESCE(oi.profit,0) / oi.quantity ELSE 0 END AS unit_profit,
           o.order_number, o.status, o.created_at, o.updated_at,
           public.supplier_kept_qty(o.status, oi.quantity, oi.returned_qty) AS kept_qty,
           public.supplier_return_qty(o.status, oi.quantity, oi.returned_qty) AS ret_qty
    FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    WHERE o.reseller_id = rid
      AND (_from IS NULL OR o.created_at >= _from::timestamptz)
      AND (_to IS NULL OR o.created_at < (_to + 1)::timestamptz)
  ),
  live AS (SELECT * FROM items WHERE status NOT IN ('cancelled','draft')),
  sold AS (SELECT * FROM items WHERE kept_qty > 0),
  pending AS (
    SELECT * FROM items
    WHERE kept_qty = 0 AND ret_qty = 0 AND status NOT IN ('cancelled','draft')
  ),
  prod AS (
    SELECT product_name,
           unit_price,
           SUM(quantity) AS supplied_qty,
           SUM(quantity * unit_price) AS supplied_value,
           SUM(kept_qty) AS delivered_qty,
           SUM(kept_qty * unit_price) AS delivered_value,
           SUM(kept_qty * unit_profit) AS delivered_profit,
           SUM(CASE WHEN kept_qty = 0 AND ret_qty = 0 THEN quantity ELSE 0 END) AS pending_qty,
           SUM(CASE WHEN kept_qty = 0 AND ret_qty = 0 THEN quantity * unit_price ELSE 0 END) AS pending_value,
           SUM(ret_qty) AS returned_qty,
           SUM(ret_qty * unit_price) AS returned_value,
           COUNT(DISTINCT order_id) AS orders
    FROM live
    GROUP BY product_name, unit_price
  ),
  ordagg AS (
    SELECT
      COALESCE(SUM(CASE WHEN o.status IN ('delivered','partial','partial_full','partial_item','partial_delivery','damaged','returned','cancelled')
                        THEN COALESCE(o.reseller_profit,0) ELSE 0 END),0) AS settled_profit,
      COALESCE(SUM(CASE WHEN o.status NOT IN ('cancelled','draft') THEN 1 ELSE 0 END),0) AS live_orders,
      COALESCE(SUM(CASE WHEN o.status IN ('delivered','partial_full','partial_item','partial_delivery') THEN 1 ELSE 0 END),0) AS delivered_orders,
      COALESCE(SUM(CASE WHEN o.status IN ('returned','damaged') THEN 1 ELSE 0 END),0) AS returned_orders,
      COALESCE(SUM(CASE WHEN o.status NOT IN ('cancelled','draft','delivered','partial','partial_full','partial_item','partial_delivery','damaged','returned')
                        THEN COALESCE(o.reseller_profit,0) ELSE 0 END),0) AS upcoming_profit,
      COALESCE(SUM(CASE WHEN o.status NOT IN ('cancelled','draft') THEN COALESCE(o.total,0) ELSE 0 END),0) AS order_value,
      COALESCE(SUM(CASE WHEN o.advance_by = 'reseller' THEN COALESCE(o.advance_amount,0) ELSE 0 END),0) AS advance_held
    FROM public.orders o
    WHERE o.reseller_id = rid
      AND (_from IS NULL OR o.created_at >= _from::timestamptz)
      AND (_to IS NULL OR o.created_at < (_to + 1)::timestamptz)
  )
  SELECT jsonb_build_object(
    'reseller', (SELECT to_jsonb(r) FROM public.resellers r WHERE r.id = rid),
    'totals', jsonb_build_object(
      'sold_qty', (SELECT COALESCE(SUM(kept_qty),0) FROM sold),
      'sold_value', (SELECT COALESCE(SUM(kept_qty * unit_price),0) FROM sold),
      'earning', (SELECT settled_profit FROM ordagg),
      'upcoming_qty', (SELECT COALESCE(SUM(quantity),0) FROM pending),
      'upcoming_amount', (SELECT COALESCE(SUM(quantity * unit_price),0) FROM pending),
      'upcoming_profit', (SELECT upcoming_profit FROM ordagg),
      'supplied_qty', (SELECT COALESCE(SUM(quantity),0) FROM live),
      'supplied_value', (SELECT COALESCE(SUM(quantity * unit_price),0) FROM live),
      'order_value', (SELECT order_value FROM ordagg),
      'orders', (SELECT live_orders FROM ordagg),
      'delivered_orders', (SELECT delivered_orders FROM ordagg),
      'returned_orders', (SELECT returned_orders FROM ordagg),
      'returned_qty', (SELECT COALESCE(SUM(ret_qty),0) FROM items WHERE ret_qty > 0),
      'returned_amount', (SELECT COALESCE(SUM(ret_qty * unit_price),0) FROM items WHERE ret_qty > 0),
      'advance_held', (SELECT advance_held FROM ordagg),
      'deposit_balance', (SELECT COALESCE(SUM(rd.amount),0) FROM public.reseller_deposits rd WHERE rd.reseller_id = rid),
      'paid', (SELECT COALESCE(SUM(amount),0) FROM public.payouts p WHERE p.reseller_id = rid AND p.status = 'paid'),
      'pending_payout', (SELECT COALESCE(SUM(amount),0) FROM public.payouts p WHERE p.reseller_id = rid AND p.status IN ('pending','approved'))
    ),
    'products', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'product_name', p.product_name,
        'unit_price', p.unit_price,
        'orders', p.orders,
        'supplied_qty', p.supplied_qty,
        'supplied_value', p.supplied_value,
        'delivered_qty', p.delivered_qty,
        'delivered_value', p.delivered_value,
        'delivered_profit', p.delivered_profit,
        'pending_qty', p.pending_qty,
        'pending_value', p.pending_value,
        'returned_qty', p.returned_qty,
        'returned_value', p.returned_value
      ) ORDER BY p.delivered_value DESC, p.supplied_value DESC), '[]'::jsonb)
      FROM prod p
    ),
    'sold', (SELECT COALESCE(jsonb_agg(to_jsonb(s) ORDER BY s.updated_at DESC), '[]'::jsonb) FROM sold s),
    'upcoming', (SELECT COALESCE(jsonb_agg(to_jsonb(p) ORDER BY p.created_at DESC), '[]'::jsonb) FROM pending p),
    'returns', (SELECT COALESCE(jsonb_agg(to_jsonb(i) ORDER BY i.updated_at DESC), '[]'::jsonb) FROM items i WHERE i.ret_qty > 0),
    'payouts', (
      SELECT COALESCE(jsonb_agg(to_jsonb(p) ORDER BY p.created_at DESC), '[]'::jsonb)
      FROM public.payouts p WHERE p.reseller_id = rid
    )
  ) INTO res;

  RETURN res;
END $function$;

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
      'phone', r.phone, 'email', r.email,
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

GRANT EXECUTE ON FUNCTION public.is_reseller_report_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.reseller_report(uuid, date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_reseller_overview(date, date) TO authenticated;