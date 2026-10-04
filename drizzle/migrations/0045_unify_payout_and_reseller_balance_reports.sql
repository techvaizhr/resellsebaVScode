-- 1. Unify admin_payout_report with complete status set and consistent payout dates
CREATE OR REPLACE FUNCTION public.admin_payout_report()
 RETURNS TABLE(reseller_id uuid, code text, business_name text, status text, payout_method text, payout_account_number text, earned_profit numeric, deposit_balance numeric, frozen_amount numeric, pending_payout numeric, approved_payout numeric, paid_out numeric, rejected_payout numeric, due_balance numeric, last_request_at timestamp with time zone, last_paid_at timestamp with time zone, request_count integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF NOT public.has_any_permission(auth.uid(), ARRAY['dashboard.view','finance.view','reports.view','payouts.manage','resellers.manage']) THEN
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
           MAX(COALESCE(py.paid_at, py.created_at)) AS last_paid,
           COUNT(*)::int AS cnt
    FROM public.payouts py
    GROUP BY py.reseller_id
  ), dep AS (
    SELECT rd.reseller_id AS rid, COALESCE(SUM(rd.amount),0) AS bal
    FROM public.reseller_deposits rd
    GROUP BY rd.reseller_id
  )
  SELECT r.id, r.code, r.business_name, r.status::text, r.payout_method, r.payout_account_number,
         COALESCE(prof.amt,0), COALESCE(dep.bal,0), COALESCE(r.frozen_amount,0),
         COALESCE(pay.pending,0), COALESCE(pay.approved,0), COALESCE(pay.paid,0), COALESCE(pay.rejected,0),
         (COALESCE(prof.amt,0) + COALESCE(dep.bal,0)
           - COALESCE(pay.pending,0) - COALESCE(pay.approved,0)
           - COALESCE(pay.paid,0) - COALESCE(r.frozen_amount,0)),
         pay.last_req, pay.last_paid, COALESCE(pay.cnt,0)
  FROM public.resellers r
  LEFT JOIN prof ON prof.rid = r.id
  LEFT JOIN pay ON pay.rid = r.id
  LEFT JOIN dep ON dep.rid = r.id
  WHERE COALESCE(prof.amt,0) <> 0 OR pay.rid IS NOT NULL OR COALESCE(dep.bal,0) <> 0;
END;
$function$;
REVOKE ALL ON FUNCTION public.admin_payout_report() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_payout_report() TO authenticated;

-- 2. Unify admin_resellers_page with all realized & returned statuses matching payout reports
CREATE OR REPLACE FUNCTION public.admin_resellers_page()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE r jsonb;
BEGIN
  IF NOT public.has_any_permission(auth.uid(), ARRAY['resellers.manage','payouts.manage','finance.view','reports.view']) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  WITH o AS (
    SELECT reseller_id, COUNT(*)::bigint orders,
      COALESCE(SUM(CASE WHEN status IN ('delivered','partial','partial_full','partial_item','partial_delivery','damaged','returned','cancelled') THEN reseller_profit ELSE 0 END),0) dp
    FROM orders GROUP BY reseller_id
  ), p AS (
    SELECT reseller_id,
      COALESCE(SUM(CASE WHEN status IN ('pending','approved') THEN amount ELSE 0 END),0) pp,
      COALESCE(SUM(CASE WHEN status='paid' THEN amount ELSE 0 END),0) po
    FROM payouts GROUP BY reseller_id
  ), d AS (
    SELECT reseller_id, COALESCE(SUM(amount),0) db FROM reseller_deposits GROUP BY reseller_id
  )
  SELECT jsonb_build_object(
    'resellers', COALESCE((SELECT jsonb_agg(x ORDER BY x.created_at DESC) FROM (
      SELECT rs.id,rs.user_id,rs.avatar_url,rs.business_name,rs.code,rs.contact_phone,rs.address,rs.nid_number,rs.status,
        rs.commission_rate,rs.leader_id,rs.agent_id,rs.notes,rs.approved_at,rs.created_at,rs.payout_method,rs.payout_account_name,
        rs.payout_account_number,rs.payout_bank_name,rs.payout_branch,rs.payout_routing,rs.deposit_required,
        rs.deposit_required_amount,rs.frozen_amount,
        COALESCE(o.orders,0) m_orders, COALESCE(o.dp,0) m_dp, COALESCE(p.pp,0) m_pp, COALESCE(p.po,0) m_po,
        COALESCE(d.db,0) m_db,
        (COALESCE(o.dp,0)+COALESCE(d.db,0)-COALESCE(p.pp,0)-COALESCE(p.po,0)-COALESCE(rs.frozen_amount,0)) m_av,
        pr.email_verified_at IS NOT NULL p_email, pr.phone_verified_at IS NOT NULL p_phone,
        u.email a_email, u.email_confirmed_at IS NOT NULL a_confirmed
      FROM resellers rs
      LEFT JOIN o ON o.reseller_id=rs.id
      LEFT JOIN p ON p.reseller_id=rs.id
      LEFT JOIN d ON d.reseller_id=rs.id
      LEFT JOIN profiles pr ON pr.id=rs.user_id
      LEFT JOIN auth.users u ON u.id=rs.user_id
    ) x), '[]'::jsonb),
    'agents', COALESCE((SELECT jsonb_agg(jsonb_build_object('id',id,'display_name',display_name) ORDER BY display_name) FROM agents), '[]'::jsonb)
  ) INTO r;
  RETURN r;
END $$;
REVOKE ALL ON FUNCTION public.admin_resellers_page() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_resellers_page() TO authenticated;

-- 3. Unify reseller_profit_summary with identical calculation rules
CREATE OR REPLACE FUNCTION public.reseller_profit_summary(_reseller_id uuid)
RETURNS TABLE(
  delivered_profit numeric,
  deposit_balance numeric,
  frozen_amount numeric,
  pending_payout numeric,
  paid_out numeric,
  available numeric
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_dp numeric := 0;
  v_db numeric := 0;
  v_fa numeric := 0;
  v_pp numeric := 0;
  v_po numeric := 0;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF NOT public.has_any_permission(auth.uid(), ARRAY['dashboard.view','finance.view','reports.view','payouts.manage','resellers.manage'])
     AND NOT EXISTS (SELECT 1 FROM public.resellers r WHERE r.id = _reseller_id AND r.user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT COALESCE(SUM(o.reseller_profit), 0) INTO v_dp
  FROM public.orders o
  WHERE o.reseller_id = _reseller_id
    AND o.status IN ('delivered','partial','partial_full','partial_item','partial_delivery','damaged','returned','cancelled');

  SELECT COALESCE(SUM(rd.amount), 0) INTO v_db
  FROM public.reseller_deposits rd
  WHERE rd.reseller_id = _reseller_id;

  SELECT COALESCE(r.frozen_amount, 0) INTO v_fa
  FROM public.resellers r
  WHERE r.id = _reseller_id;

  SELECT
    COALESCE(SUM(CASE WHEN py.status IN ('pending', 'approved') THEN py.amount ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN py.status = 'paid' THEN py.amount ELSE 0 END), 0)
  INTO v_pp, v_po
  FROM public.payouts py
  WHERE py.reseller_id = _reseller_id;

  RETURN QUERY SELECT
    v_dp,
    v_db,
    v_fa,
    v_pp,
    v_po,
    (v_dp + v_db - v_pp - v_po - v_fa) AS available;
END;
$$;
REVOKE ALL ON FUNCTION public.reseller_profit_summary(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.reseller_profit_summary(uuid) TO authenticated;
