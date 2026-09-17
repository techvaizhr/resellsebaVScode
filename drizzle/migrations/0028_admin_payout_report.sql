CREATE OR REPLACE FUNCTION public.admin_payout_report()
RETURNS TABLE (
  reseller_id uuid,
  code text,
  business_name text,
  status text,
  payout_method text,
  payout_account_number text,
  earned_profit numeric,
  deposit_balance numeric,
  frozen_amount numeric,
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
  IF NOT public.has_any_permission(auth.uid(), ARRAY['dashboard.view','finance.view','reports.view','payouts.manage']) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  WITH prof AS (
    SELECT o.reseller_id AS rid, COALESCE(SUM(o.reseller_profit),0) AS amt
    FROM public.orders o
    WHERE o.reseller_id IS NOT NULL
      AND o.status IN ('delivered','partial','partial_full','partial_item','partial_delivery','damaged','returned','cancelled')
    GROUP BY o.reseller_id
  ), pay AS (
    SELECT py.reseller_id AS rid,
           COALESCE(SUM(CASE WHEN py.status = 'pending' THEN py.amount ELSE 0 END),0) AS pending,
           COALESCE(SUM(CASE WHEN py.status = 'approved' THEN py.amount ELSE 0 END),0) AS approved,
           COALESCE(SUM(CASE WHEN py.status = 'paid' THEN py.amount ELSE 0 END),0) AS paid,
           COALESCE(SUM(CASE WHEN py.status = 'rejected' THEN py.amount ELSE 0 END),0) AS rejected,
           MAX(py.created_at) AS last_req,
           MAX(py.paid_at) AS last_paid,
           COUNT(*)::int AS cnt
    FROM public.payouts py
    GROUP BY py.reseller_id
  ), dep AS (
    SELECT rd.reseller_id AS rid, COALESCE(SUM(rd.amount),0) AS bal
    FROM public.reseller_deposits rd
    GROUP BY rd.reseller_id
  )
  SELECT r.id,
         r.code,
         r.business_name,
         r.status::text,
         r.payout_method,
         r.payout_account_number,
         COALESCE(prof.amt,0),
         COALESCE(dep.bal,0),
         COALESCE(r.frozen_amount,0),
         COALESCE(pay.pending,0),
         COALESCE(pay.approved,0),
         COALESCE(pay.paid,0),
         COALESCE(pay.rejected,0),
         GREATEST(
           COALESCE(prof.amt,0) + COALESCE(dep.bal,0)
           - COALESCE(pay.pending,0) - COALESCE(pay.approved,0)
           - COALESCE(pay.paid,0) - COALESCE(r.frozen_amount,0), 0),
         pay.last_req,
         pay.last_paid,
         COALESCE(pay.cnt,0)
  FROM public.resellers r
  LEFT JOIN prof ON prof.rid = r.id
  LEFT JOIN pay ON pay.rid = r.id
  LEFT JOIN dep ON dep.rid = r.id
  WHERE COALESCE(prof.amt,0) <> 0 OR pay.rid IS NOT NULL OR COALESCE(dep.bal,0) <> 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_payout_report() TO authenticated;