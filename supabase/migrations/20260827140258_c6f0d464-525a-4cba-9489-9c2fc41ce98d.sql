CREATE OR REPLACE FUNCTION public.admin_supplier_overview(_from date DEFAULT NULL::date, _to date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE res jsonb;
BEGIN
  IF NOT public.is_supplier_admin() THEN RAISE EXCEPTION 'Not allowed'; END IF;

  WITH items AS (
    SELECT oi.supplier_id, oi.quantity, oi.returned_qty, COALESCE(oi.buying_price,0) AS unit_price,
           public.supplier_kept_qty(o.status, oi.quantity, oi.returned_qty) AS kept_qty,
           public.supplier_return_qty(o.status, oi.quantity, oi.returned_qty) AS ret_qty
    FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    WHERE oi.supplier_id IS NOT NULL
      AND (_from IS NULL OR o.created_at >= _from::timestamptz)
      AND (_to IS NULL OR o.created_at < (_to + 1)::timestamptz)
  ),
  agg AS (
    SELECT supplier_id,
           COALESCE(SUM(kept_qty),0) AS sold_qty,
           COALESCE(SUM(kept_qty * unit_price),0) AS earning,
           COALESCE(SUM(ret_qty),0) AS returned_qty,
           COALESCE(SUM(ret_qty * unit_price),0) AS returned_amount
    FROM items GROUP BY supplier_id
  )
  SELECT jsonb_build_object(
    'suppliers', COALESCE(jsonb_agg(jsonb_build_object(
      'id', s.id, 'user_id', s.user_id, 'code', s.code, 'display_name', s.display_name, 'status', s.status,
      'contact_phone', s.contact_phone, 'email', s.email, 'whatsapp', s.whatsapp,
      'payout_method', s.payout_method, 'payout_account_number', s.payout_account_number,
      'payout_account_name', s.payout_account_name, 'payout_bank_name', s.payout_bank_name,
      'created_at', s.created_at,
      'products', (SELECT COUNT(*) FROM public.products p WHERE p.supplier_id = s.id),
      'sold_qty', COALESCE(a.sold_qty,0), 'earning', COALESCE(a.earning,0),
      'returned_qty', COALESCE(a.returned_qty,0), 'returned_amount', COALESCE(a.returned_amount,0),
      'paid', (SELECT COALESCE(SUM(amount),0) FROM public.supplier_payouts p WHERE p.supplier_id = s.id AND p.status = 'paid'),
      'pending_payout', (SELECT COALESCE(SUM(amount),0) FROM public.supplier_payouts p WHERE p.supplier_id = s.id AND p.status IN ('pending','approved')),
      'pending_returns', (SELECT COUNT(*) FROM public.supplier_returns r WHERE r.supplier_id = s.id AND r.status = 'pending_handover')
    ) ORDER BY s.created_at DESC), '[]'::jsonb),
    'returns', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', r.id, 'supplier_id', r.supplier_id, 'supplier_name', sp.display_name,
        'order_id', r.order_id, 'order_number', o.order_number,
        'product_name', r.product_name, 'quantity', r.quantity, 'unit_price', r.unit_price,
        'order_status', r.order_status, 'status', r.status, 'note', r.note,
        'handed_over_at', r.handed_over_at, 'created_at', r.created_at,
        'updated_at', r.updated_at,
        'product_image', COALESCE(oi.product_image, pi.url)
      ) ORDER BY r.updated_at DESC), '[]'::jsonb)
      FROM public.supplier_returns r
      JOIN public.orders o ON o.id = r.order_id
      JOIN public.suppliers sp ON sp.id = r.supplier_id
      LEFT JOIN public.order_items oi ON oi.id = r.order_item_id
      LEFT JOIN LATERAL (
        SELECT p2.url FROM public.product_images p2
        WHERE p2.product_id = r.product_id
        ORDER BY p2.is_primary DESC, p2.sort_order ASC LIMIT 1
      ) pi ON true
    ),
    'payouts', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', p.id, 'supplier_id', p.supplier_id, 'supplier_name', sp.display_name,
        'amount', p.amount, 'status', p.status, 'method', p.method, 'reference', p.reference,
        'note', p.note, 'admin_note', p.admin_note, 'created_at', p.created_at,
        'approved_at', p.approved_at, 'paid_at', p.paid_at
      ) ORDER BY p.created_at DESC), '[]'::jsonb)
      FROM public.supplier_payouts p JOIN public.suppliers sp ON sp.id = p.supplier_id
    )
  ) INTO res
  FROM public.suppliers s LEFT JOIN agg a ON a.supplier_id = s.id;

  RETURN res;
END $function$;

CREATE OR REPLACE FUNCTION public.admin_handover_returns(_ids uuid[], _undo boolean DEFAULT false)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE n integer;
BEGIN
  IF NOT public.is_supplier_admin() THEN RAISE EXCEPTION 'Not allowed'; END IF;
  IF _undo THEN
    UPDATE public.supplier_returns
       SET status = 'pending_handover', handed_over_at = NULL, handed_over_by = NULL, updated_at = now()
     WHERE id = ANY(_ids) AND status = 'handed_over';
  ELSE
    UPDATE public.supplier_returns
       SET status = 'handed_over', handed_over_at = now(), handed_over_by = auth.uid(), updated_at = now()
     WHERE id = ANY(_ids) AND status <> 'handed_over';
  END IF;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END $function$;

GRANT EXECUTE ON FUNCTION public.admin_handover_returns(uuid[], boolean) TO authenticated;