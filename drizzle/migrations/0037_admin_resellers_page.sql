CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_resellers_created ON public.resellers (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resellers_name_trgm ON public.resellers USING gin (business_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_resellers_phone ON public.resellers (contact_phone);
CREATE INDEX IF NOT EXISTS idx_orders_reseller_status_profit ON public.orders (reseller_id, status) INCLUDE (reseller_profit);

CREATE OR REPLACE FUNCTION public.admin_resellers_page()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE r jsonb;
BEGIN
  IF NOT public.has_permission(auth.uid(), 'resellers.manage') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  WITH o AS (
    SELECT reseller_id, COUNT(*)::bigint orders,
      COALESCE(SUM(CASE WHEN status IN ('delivered','partial','returned','cancelled') THEN reseller_profit ELSE 0 END),0) dp
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
        GREATEST(COALESCE(o.dp,0)+COALESCE(d.db,0)-COALESCE(p.pp,0)-COALESCE(p.po,0)-COALESCE(rs.frozen_amount,0),0) m_av,
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