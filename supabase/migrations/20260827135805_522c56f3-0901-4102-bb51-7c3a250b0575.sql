CREATE OR REPLACE FUNCTION public.supplier_report(_supplier uuid DEFAULT NULL::uuid, _from date DEFAULT NULL::date, _to date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  sid uuid;
  res jsonb;
BEGIN
  sid := COALESCE(_supplier, public.current_supplier_id());
  IF sid IS NULL THEN RETURN NULL; END IF;
  IF sid <> COALESCE(public.current_supplier_id(), '00000000-0000-0000-0000-000000000000'::uuid)
     AND NOT public.is_supplier_admin() THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  WITH items AS (
    SELECT oi.id, oi.order_id, oi.product_name, oi.quantity, oi.returned_qty,
           COALESCE(oi.buying_price,0) AS unit_price,
           o.order_number, o.status, o.created_at, o.updated_at,
           public.supplier_kept_qty(o.status, oi.quantity, oi.returned_qty) AS kept_qty,
           public.supplier_return_qty(o.status, oi.quantity, oi.returned_qty) AS ret_qty
    FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    WHERE oi.supplier_id = sid
      AND (_from IS NULL OR o.created_at >= _from::timestamptz)
      AND (_to IS NULL OR o.created_at < (_to + 1)::timestamptz)
  ),
  sold AS (SELECT * FROM items WHERE kept_qty > 0),
  pending AS (
    SELECT * FROM items
    WHERE kept_qty = 0 AND ret_qty = 0 AND status NOT IN ('cancelled','draft')
  )
  SELECT jsonb_build_object(
    'supplier', (SELECT to_jsonb(s) FROM public.suppliers s WHERE s.id = sid),
    'totals', jsonb_build_object(
      'sold_qty', (SELECT COALESCE(SUM(kept_qty),0) FROM sold),
      'earning', (SELECT COALESCE(SUM(kept_qty * unit_price),0) FROM sold),
      'upcoming_qty', (SELECT COALESCE(SUM(quantity),0) FROM pending),
      'upcoming_amount', (SELECT COALESCE(SUM(quantity * unit_price),0) FROM pending),
      'returned_qty', (SELECT COALESCE(SUM(ret_qty),0) FROM items WHERE ret_qty > 0),
      'returned_amount', (SELECT COALESCE(SUM(ret_qty * unit_price),0) FROM items WHERE ret_qty > 0),
      'returns_pending_handover', (SELECT COUNT(*) FROM public.supplier_returns r WHERE r.supplier_id = sid AND r.status = 'pending_handover'),
      'paid', (SELECT COALESCE(SUM(amount),0) FROM public.supplier_payouts p WHERE p.supplier_id = sid AND p.status = 'paid'),
      'pending_payout', (SELECT COALESCE(SUM(amount),0) FROM public.supplier_payouts p WHERE p.supplier_id = sid AND p.status IN ('pending','approved'))
    ),
    'sold', (SELECT COALESCE(jsonb_agg(to_jsonb(s) ORDER BY s.updated_at DESC), '[]'::jsonb) FROM sold s),
    'upcoming', (SELECT COALESCE(jsonb_agg(to_jsonb(p) ORDER BY p.created_at DESC), '[]'::jsonb) FROM pending p),
    'returns', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', r.id, 'order_id', r.order_id, 'order_number', o.order_number,
        'product_name', r.product_name, 'quantity', r.quantity, 'unit_price', r.unit_price,
        'order_status', r.order_status, 'status', r.status, 'note', r.note,
        'handed_over_at', r.handed_over_at, 'created_at', r.created_at,
        'updated_at', r.updated_at,
        'product_image', COALESCE(oi.product_image, pi.url)
      ) ORDER BY r.updated_at DESC), '[]'::jsonb)
      FROM public.supplier_returns r
      JOIN public.orders o ON o.id = r.order_id
      LEFT JOIN public.order_items oi ON oi.id = r.order_item_id
      LEFT JOIN LATERAL (
        SELECT p2.url FROM public.product_images p2
        WHERE p2.product_id = r.product_id
        ORDER BY p2.is_primary DESC, p2.sort_order ASC LIMIT 1
      ) pi ON true
      WHERE r.supplier_id = sid
    ),
    'payouts', (
      SELECT COALESCE(jsonb_agg(to_jsonb(p) ORDER BY p.created_at DESC), '[]'::jsonb)
      FROM public.supplier_payouts p WHERE p.supplier_id = sid
    )
  ) INTO res;

  RETURN res;
END $function$;

CREATE OR REPLACE FUNCTION public.supplier_receive_returns(_ids uuid[])
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE sid uuid := public.current_supplier_id(); n integer;
BEGIN
  IF sid IS NULL THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.supplier_returns r
     SET status = 'handed_over',
         handed_over_at = now(),
         handed_over_by = auth.uid(),
         updated_at = now()
   WHERE r.supplier_id = sid
     AND r.id = ANY(_ids)
     AND r.status <> 'handed_over';
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END $function$;

GRANT EXECUTE ON FUNCTION public.supplier_receive_returns(uuid[]) TO authenticated;