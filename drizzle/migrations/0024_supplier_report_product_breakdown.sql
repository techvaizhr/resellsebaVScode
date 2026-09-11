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
    SELECT oi.id, oi.order_id, oi.product_id, oi.product_name, oi.quantity, oi.returned_qty,
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
           SUM(CASE WHEN kept_qty = 0 AND ret_qty = 0 THEN quantity ELSE 0 END) AS pending_qty,
           SUM(CASE WHEN kept_qty = 0 AND ret_qty = 0 THEN quantity * unit_price ELSE 0 END) AS pending_value,
           SUM(ret_qty) AS returned_qty,
           SUM(ret_qty * unit_price) AS returned_value,
           COUNT(DISTINCT order_id) AS orders
    FROM live
    GROUP BY product_name, unit_price
  )
  SELECT jsonb_build_object(
    'supplier', (SELECT to_jsonb(s) FROM public.suppliers s WHERE s.id = sid),
    'totals', jsonb_build_object(
      'sold_qty', (SELECT COALESCE(SUM(kept_qty),0) FROM sold),
      'earning', (SELECT COALESCE(SUM(kept_qty * unit_price),0) FROM sold),
      'upcoming_qty', (SELECT COALESCE(SUM(quantity),0) FROM pending),
      'upcoming_amount', (SELECT COALESCE(SUM(quantity * unit_price),0) FROM pending),
      'supplied_qty', (SELECT COALESCE(SUM(quantity),0) FROM live),
      'supplied_value', (SELECT COALESCE(SUM(quantity * unit_price),0) FROM live),
      'returned_qty', (SELECT COALESCE(SUM(ret_qty),0) FROM items WHERE ret_qty > 0),
      'returned_amount', (SELECT COALESCE(SUM(ret_qty * unit_price),0) FROM items WHERE ret_qty > 0),
      'returns_received_qty', (SELECT COALESCE(SUM(r.quantity),0) FROM public.supplier_returns r WHERE r.supplier_id = sid AND r.status = 'handed_over'),
      'returns_received_amount', (SELECT COALESCE(SUM(r.quantity * r.unit_price),0) FROM public.supplier_returns r WHERE r.supplier_id = sid AND r.status = 'handed_over'),
      'returns_pending_qty', (SELECT COALESCE(SUM(r.quantity),0) FROM public.supplier_returns r WHERE r.supplier_id = sid AND r.status = 'pending_handover'),
      'returns_pending_amount', (SELECT COALESCE(SUM(r.quantity * r.unit_price),0) FROM public.supplier_returns r WHERE r.supplier_id = sid AND r.status = 'pending_handover'),
      'returns_pending_handover', (SELECT COUNT(*) FROM public.supplier_returns r WHERE r.supplier_id = sid AND r.status = 'pending_handover'),
      'paid', (SELECT COALESCE(SUM(amount),0) FROM public.supplier_payouts p WHERE p.supplier_id = sid AND p.status = 'paid'),
      'pending_payout', (SELECT COALESCE(SUM(amount),0) FROM public.supplier_payouts p WHERE p.supplier_id = sid AND p.status IN ('pending','approved'))
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
        'pending_qty', p.pending_qty,
        'pending_value', p.pending_value,
        'returned_qty', p.returned_qty,
        'returned_value', p.returned_value
      ) ORDER BY p.delivered_value DESC, p.supplied_value DESC), '[]'::jsonb)
      FROM prod p
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
           o.status,
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
           COALESCE(SUM(ret_qty * unit_price),0) AS returned_amount,
           COALESCE(SUM(CASE WHEN status NOT IN ('cancelled','draft') THEN quantity ELSE 0 END),0) AS supplied_qty,
           COALESCE(SUM(CASE WHEN status NOT IN ('cancelled','draft') THEN quantity * unit_price ELSE 0 END),0) AS supplied_value,
           COALESCE(SUM(CASE WHEN status NOT IN ('cancelled','draft') AND kept_qty = 0 AND ret_qty = 0 THEN quantity ELSE 0 END),0) AS pending_qty,
           COALESCE(SUM(CASE WHEN status NOT IN ('cancelled','draft') AND kept_qty = 0 AND ret_qty = 0 THEN quantity * unit_price ELSE 0 END),0) AS pending_amount
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
      'supplied_qty', COALESCE(a.supplied_qty,0), 'supplied_value', COALESCE(a.supplied_value,0),
      'pending_qty', COALESCE(a.pending_qty,0), 'pending_amount', COALESCE(a.pending_amount,0),
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