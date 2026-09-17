CREATE OR REPLACE FUNCTION public.admin_supplier_payout_report()
RETURNS TABLE (
  supplier_id uuid,
  code text,
  display_name text,
  status text,
  payout_method text,
  payout_account_name text,
  payout_account_number text,
  payout_bank_name text,
  payout_branch text,
  earned_amount numeric,
  pending_payout numeric,
  approved_payout numeric,
  paid_out numeric,
  rejected_payout numeric,
  due_balance numeric,
  last_request_at timestamptz,
  last_paid_at timestamptz,
  request_count integer
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF NOT public.is_supplier_admin() THEN RAISE EXCEPTION 'Not allowed'; END IF;

  RETURN QUERY
  WITH item_earnings AS (
    SELECT oi.supplier_id AS sid,
           COALESCE(SUM(
             public.supplier_kept_qty(o.status, oi.quantity, oi.returned_qty)
             * COALESCE(oi.buying_price, 0)
           ), 0) AS earned
    FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    WHERE oi.supplier_id IS NOT NULL
    GROUP BY oi.supplier_id
  ), payout_totals AS (
    SELECT p.supplier_id AS sid,
           COALESCE(SUM(CASE WHEN p.status = 'pending' THEN p.amount ELSE 0 END), 0) AS pending,
           COALESCE(SUM(CASE WHEN p.status = 'approved' THEN p.amount ELSE 0 END), 0) AS approved,
           COALESCE(SUM(CASE WHEN p.status = 'paid' THEN p.amount ELSE 0 END), 0) AS paid,
           COALESCE(SUM(CASE WHEN p.status = 'rejected' THEN p.amount ELSE 0 END), 0) AS rejected,
           MAX(p.created_at) AS last_request,
           MAX(p.paid_at) AS last_paid,
           COUNT(*)::integer AS requests
    FROM public.supplier_payouts p
    GROUP BY p.supplier_id
  )
  SELECT s.id,
         s.code,
         s.display_name,
         s.status::text,
         s.payout_method,
         s.payout_account_name,
         s.payout_account_number,
         s.payout_bank_name,
         s.payout_branch,
         COALESCE(e.earned, 0),
         COALESCE(p.pending, 0),
         COALESCE(p.approved, 0),
         COALESCE(p.paid, 0),
         COALESCE(p.rejected, 0),
         GREATEST(
           COALESCE(e.earned, 0)
           - COALESCE(p.pending, 0)
           - COALESCE(p.approved, 0)
           - COALESCE(p.paid, 0),
           0
         ),
         p.last_request,
         p.last_paid,
         COALESCE(p.requests, 0)
  FROM public.suppliers s
  LEFT JOIN item_earnings e ON e.sid = s.id
  LEFT JOIN payout_totals p ON p.sid = s.id
  WHERE COALESCE(e.earned, 0) <> 0 OR p.sid IS NOT NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_supplier_payout_report() TO authenticated;