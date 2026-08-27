
-- backfill existing data
UPDATE public.order_items oi
SET supplier_id = p.supplier_id
FROM public.products p
WHERE oi.product_id = p.id AND oi.supplier_id IS NULL AND p.supplier_id IS NOT NULL;

DO $$
DECLARE o record;
BEGIN
  FOR o IN SELECT id FROM public.orders WHERE status IN ('returned','partial_delivery','damaged','partial_item') LOOP
    PERFORM public.sync_supplier_returns(o.id);
  END LOOP;
END $$;

-- supplier dashboard + report -------------------------------------------------
CREATE OR REPLACE FUNCTION public.supplier_report(_supplier uuid DEFAULT NULL, _from date DEFAULT NULL, _to date DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
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
        'handed_over_at', r.handed_over_at, 'created_at', r.created_at
      ) ORDER BY r.created_at DESC), '[]'::jsonb)
      FROM public.supplier_returns r JOIN public.orders o ON o.id = r.order_id
      WHERE r.supplier_id = sid
    ),
    'payouts', (
      SELECT COALESCE(jsonb_agg(to_jsonb(p) ORDER BY p.created_at DESC), '[]'::jsonb)
      FROM public.supplier_payouts p WHERE p.supplier_id = sid
    )
  ) INTO res;

  RETURN res;
END $$;

CREATE OR REPLACE FUNCTION public.supplier_bootstrap()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE sid uuid := public.current_supplier_id();
BEGIN
  IF sid IS NULL THEN RETURN jsonb_build_object('supplier', NULL); END IF;
  RETURN COALESCE(public.supplier_report(sid, NULL, NULL), jsonb_build_object('supplier', NULL))
    || jsonb_build_object(
      'settings', (SELECT jsonb_build_object('site_name', g.site_name, 'logo_url', g.logo_url,
                                             'primary_color', g.primary_color, 'accent_color', g.accent_color)
                   FROM public.global_settings g WHERE g.id = 1),
      'verify', (SELECT to_jsonb(v) FROM public.verify_state() v)
    );
END $$;

CREATE OR REPLACE FUNCTION public.admin_supplier_overview(_from date DEFAULT NULL, _to date DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
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
      'id', s.id, 'code', s.code, 'display_name', s.display_name, 'status', s.status,
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
        'handed_over_at', r.handed_over_at, 'created_at', r.created_at
      ) ORDER BY r.created_at DESC), '[]'::jsonb)
      FROM public.supplier_returns r
      JOIN public.orders o ON o.id = r.order_id
      JOIN public.suppliers sp ON sp.id = r.supplier_id
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
END $$;

REVOKE EXECUTE ON FUNCTION public.supplier_report(uuid, date, date) FROM anon;
REVOKE EXECUTE ON FUNCTION public.supplier_bootstrap() FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_supplier_overview(date, date) FROM anon;
REVOKE EXECUTE ON FUNCTION public.current_supplier_id() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_supplier_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_supplier_manager() FROM anon;
REVOKE EXECUTE ON FUNCTION public.generate_supplier_code(text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_supplier_returns(uuid) FROM anon, authenticated;
