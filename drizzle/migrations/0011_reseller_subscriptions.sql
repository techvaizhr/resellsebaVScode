-- ============ Subscription plans ============
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  includes_store boolean NOT NULL DEFAULT false,
  price_1m numeric NOT NULL DEFAULT 0,
  price_3m numeric NOT NULL DEFAULT 0,
  price_6m numeric NOT NULL DEFAULT 0,
  price_12m numeric NOT NULL DEFAULT 0,
  trial_days integer NOT NULL DEFAULT 0,
  grace_days integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscription_plans TO authenticated;
GRANT ALL ON public.subscription_plans TO service_role;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed in reads plans" ON public.subscription_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage plans" ON public.subscription_plans FOR ALL TO authenticated
  USING (public.has_any_permission(auth.uid(), ARRAY['subscriptions.manage']) OR public.is_super_admin(auth.uid()))
  WITH CHECK (public.has_any_permission(auth.uid(), ARRAY['subscriptions.manage']) OR public.is_super_admin(auth.uid()));

-- ============ Per-reseller subscription ============
CREATE TABLE public.reseller_subscriptions (
  reseller_id uuid PRIMARY KEY REFERENCES public.resellers(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  cycle_months integer NOT NULL DEFAULT 1,
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  is_exempt boolean NOT NULL DEFAULT false,
  override_price_1m numeric,
  override_price_3m numeric,
  override_price_6m numeric,
  override_price_12m numeric,
  override_trial_days integer,
  override_grace_days integer,
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reseller_subscriptions TO authenticated;
GRANT ALL ON public.reseller_subscriptions TO service_role;
ALTER TABLE public.reseller_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reseller reads own subscription" ON public.reseller_subscriptions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.resellers r WHERE r.id = reseller_id AND r.user_id = auth.uid())
         OR public.has_any_permission(auth.uid(), ARRAY['subscriptions.view','subscriptions.manage'])
         OR public.is_super_admin(auth.uid()));
CREATE POLICY "Admins manage subscriptions" ON public.reseller_subscriptions FOR ALL TO authenticated
  USING (public.has_any_permission(auth.uid(), ARRAY['subscriptions.manage']) OR public.is_super_admin(auth.uid()))
  WITH CHECK (public.has_any_permission(auth.uid(), ARRAY['subscriptions.manage']) OR public.is_super_admin(auth.uid()));

-- ============ Payments ============
CREATE TABLE public.subscription_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  cycle_months integer NOT NULL DEFAULT 1,
  amount numeric NOT NULL DEFAULT 0,
  source text NOT NULL DEFAULT 'manual',
  status text NOT NULL DEFAULT 'pending',
  payment_config_id uuid REFERENCES public.payment_configs(id) ON DELETE SET NULL,
  method text,
  reference text,
  note text,
  admin_note text,
  period_from timestamptz,
  period_to timestamptz,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX subscription_payments_reseller_idx ON public.subscription_payments(reseller_id, created_at DESC);
GRANT SELECT, INSERT ON public.subscription_payments TO authenticated;
GRANT ALL ON public.subscription_payments TO service_role;
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reseller reads own payments" ON public.subscription_payments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.resellers r WHERE r.id = reseller_id AND r.user_id = auth.uid())
         OR public.has_any_permission(auth.uid(), ARRAY['subscriptions.view','subscriptions.manage'])
         OR public.is_super_admin(auth.uid()));
CREATE POLICY "Admins manage payments" ON public.subscription_payments FOR ALL TO authenticated
  USING (public.has_any_permission(auth.uid(), ARRAY['subscriptions.manage']) OR public.is_super_admin(auth.uid()))
  WITH CHECK (public.has_any_permission(auth.uid(), ARRAY['subscriptions.manage']) OR public.is_super_admin(auth.uid()));

-- ============ Helpers ============
CREATE OR REPLACE FUNCTION public.subscription_price(_plan public.subscription_plans, _sub public.reseller_subscriptions, _months integer)
RETURNS numeric LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE _months
    WHEN 1 THEN COALESCE(_sub.override_price_1m, _plan.price_1m)
    WHEN 3 THEN COALESCE(_sub.override_price_3m, _plan.price_3m)
    WHEN 6 THEN COALESCE(_sub.override_price_6m, _plan.price_6m)
    WHEN 12 THEN COALESCE(_sub.override_price_12m, _plan.price_12m)
    ELSE 0 END;
$$;

CREATE OR REPLACE FUNCTION public.reseller_balance(_reseller_id uuid)
RETURNS numeric LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT COALESCE((SELECT SUM(d.amount) FROM public.reseller_deposits d WHERE d.reseller_id = _reseller_id), 0)
       + COALESCE((SELECT SUM(o.reseller_profit) FROM public.orders o
                   WHERE o.reseller_id = _reseller_id
                     AND o.status IN ('delivered','partial','partial_full','partial_item','partial_delivery','returned','cancelled','damaged')), 0)
       - COALESCE((SELECT SUM(p.amount) FROM public.payouts p WHERE p.reseller_id = _reseller_id AND p.status <> 'rejected'), 0)
       - COALESCE((SELECT SUM(s.amount) FROM public.subscription_payments s
                   WHERE s.reseller_id = _reseller_id AND s.source = 'earning' AND s.status = 'paid'), 0);
$$;

CREATE OR REPLACE FUNCTION public.subscription_state(_reseller_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  s public.reseller_subscriptions;
  p public.subscription_plans;
  v_grace integer;
  v_end timestamptz;
  v_grace_end timestamptz;
  v_status text;
BEGIN
  SELECT * INTO s FROM public.reseller_subscriptions WHERE reseller_id = _reseller_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('has_subscription', false, 'status', 'none', 'store_enabled', true, 'locked', false);
  END IF;
  SELECT * INTO p FROM public.subscription_plans WHERE id = s.plan_id;

  v_grace := COALESCE(s.override_grace_days, p.grace_days, 0);
  v_end := GREATEST(COALESCE(s.current_period_end, 'epoch'::timestamptz), COALESCE(s.trial_ends_at, 'epoch'::timestamptz));
  IF v_end = 'epoch'::timestamptz THEN v_end := NULL; END IF;
  v_grace_end := v_end + make_interval(days => v_grace);

  IF s.is_exempt THEN
    v_status := 'exempt';
  ELSIF v_end IS NULL THEN
    v_status := 'expired';
  ELSIF now() <= v_end THEN
    v_status := CASE WHEN s.current_period_end IS NULL OR s.current_period_end < now() THEN 'trial' ELSE 'active' END;
  ELSIF now() <= v_grace_end THEN
    v_status := 'grace';
  ELSE
    v_status := 'expired';
  END IF;

  RETURN jsonb_build_object(
    'has_subscription', true,
    'status', v_status,
    'locked', v_status = 'expired',
    'plan_id', s.plan_id,
    'plan_code', p.code,
    'plan_name', p.name,
    'includes_store', COALESCE(p.includes_store, false),
    'store_enabled', COALESCE(p.includes_store, false) AND v_status <> 'expired',
    'cycle_months', s.cycle_months,
    'trial_ends_at', s.trial_ends_at,
    'current_period_end', s.current_period_end,
    'ends_at', v_end,
    'grace_ends_at', v_grace_end,
    'grace_days', v_grace,
    'days_left', CASE WHEN v_end IS NULL THEN 0 ELSE GREATEST(0, CEIL(EXTRACT(EPOCH FROM (v_end - now())) / 86400))::int END,
    'grace_days_left', CASE WHEN v_grace_end IS NULL THEN 0 ELSE GREATEST(0, CEIL(EXTRACT(EPOCH FROM (v_grace_end - now())) / 86400))::int END,
    'is_exempt', s.is_exempt,
    'price', jsonb_build_object(
      '1', public.subscription_price(p, s, 1), '3', public.subscription_price(p, s, 3),
      '6', public.subscription_price(p, s, 6), '12', public.subscription_price(p, s, 12))
  );
END $$;

CREATE OR REPLACE FUNCTION public.my_subscription()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_rid uuid;
BEGIN
  SELECT id INTO v_rid FROM public.resellers WHERE user_id = auth.uid() LIMIT 1;
  IF v_rid IS NULL THEN RETURN jsonb_build_object('reseller_id', null); END IF;
  RETURN jsonb_build_object(
    'reseller_id', v_rid,
    'state', public.subscription_state(v_rid),
    'balance', public.reseller_balance(v_rid),
    'frozen', (SELECT frozen_amount FROM public.resellers WHERE id = v_rid),
    'plans', (SELECT COALESCE(jsonb_agg(to_jsonb(pl) ORDER BY pl.sort_order, pl.name), '[]'::jsonb)
              FROM public.subscription_plans pl WHERE pl.is_active),
    'payments', (SELECT COALESCE(jsonb_agg(to_jsonb(sp) ORDER BY sp.created_at DESC), '[]'::jsonb)
                 FROM public.subscription_payments sp WHERE sp.reseller_id = v_rid),
    'methods', (SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', pc.id, 'method', pc.method, 'label', pc.label,
                    'instructions', pc.instructions, 'config', pc.config) ORDER BY pc.created_at), '[]'::jsonb)
                 FROM public.payment_configs pc
                 WHERE pc.reseller_id IS NULL AND pc.is_active AND pc.mode = 'manual')
  );
END $$;

CREATE OR REPLACE FUNCTION public.subscription_extend(_reseller_id uuid, _plan_id uuid, _months integer)
RETURNS timestamptz LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_from timestamptz; v_to timestamptz;
BEGIN
  SELECT GREATEST(now(), COALESCE(GREATEST(current_period_end, trial_ends_at), now()))
    INTO v_from FROM public.reseller_subscriptions WHERE reseller_id = _reseller_id;
  IF v_from IS NULL THEN v_from := now(); END IF;
  v_to := v_from + make_interval(months => GREATEST(_months, 1));
  UPDATE public.reseller_subscriptions
     SET plan_id = COALESCE(_plan_id, plan_id),
         cycle_months = GREATEST(_months, 1),
         current_period_end = v_to,
         updated_at = now()
   WHERE reseller_id = _reseller_id;
  RETURN v_to;
END $$;

CREATE OR REPLACE FUNCTION public.subscription_pay_from_earning(_plan_id uuid, _months integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_rid uuid; s public.reseller_subscriptions; p public.subscription_plans;
  v_amount numeric; v_available numeric; v_from timestamptz; v_to timestamptz;
BEGIN
  SELECT id INTO v_rid FROM public.resellers WHERE user_id = auth.uid() LIMIT 1;
  IF v_rid IS NULL THEN RAISE EXCEPTION 'No reseller account'; END IF;
  SELECT * INTO s FROM public.reseller_subscriptions WHERE reseller_id = v_rid;
  SELECT * INTO p FROM public.subscription_plans WHERE id = _plan_id AND is_active;
  IF p.id IS NULL THEN RAISE EXCEPTION 'Plan not found'; END IF;
  v_amount := public.subscription_price(p, s, _months);
  IF v_amount <= 0 THEN RAISE EXCEPTION 'This cycle is not available for the selected plan'; END IF;
  v_available := public.reseller_balance(v_rid) - COALESCE((SELECT frozen_amount FROM public.resellers WHERE id = v_rid), 0);
  IF v_available < v_amount THEN RAISE EXCEPTION 'Not enough balance - available %, needed %', round(v_available), round(v_amount); END IF;

  v_from := GREATEST(now(), COALESCE(GREATEST(s.current_period_end, s.trial_ends_at), now()));
  v_to := public.subscription_extend(v_rid, p.id, _months);

  INSERT INTO public.subscription_payments(reseller_id, plan_id, cycle_months, amount, source, status,
                                           method, note, period_from, period_to, reviewed_at)
  VALUES (v_rid, p.id, _months, v_amount, 'earning', 'paid', 'earning',
          p.name || ' - ' || _months || ' month(s)', v_from, v_to, now());

  RETURN jsonb_build_object('ok', true, 'amount', v_amount, 'period_to', v_to);
END $$;

CREATE OR REPLACE FUNCTION public.subscription_request_manual(_plan_id uuid, _months integer, _payment_config_id uuid, _reference text, _note text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_rid uuid; s public.reseller_subscriptions; p public.subscription_plans; v_amount numeric; v_id uuid;
BEGIN
  SELECT id INTO v_rid FROM public.resellers WHERE user_id = auth.uid() LIMIT 1;
  IF v_rid IS NULL THEN RAISE EXCEPTION 'No reseller account'; END IF;
  SELECT * INTO s FROM public.reseller_subscriptions WHERE reseller_id = v_rid;
  SELECT * INTO p FROM public.subscription_plans WHERE id = _plan_id AND is_active;
  IF p.id IS NULL THEN RAISE EXCEPTION 'Plan not found'; END IF;
  v_amount := public.subscription_price(p, s, _months);
  INSERT INTO public.subscription_payments(reseller_id, plan_id, cycle_months, amount, source, status,
                                           payment_config_id, method, reference, note)
  VALUES (v_rid, p.id, _months, v_amount, 'manual', 'pending', _payment_config_id,
          (SELECT method::text FROM public.payment_configs WHERE id = _payment_config_id),
          NULLIF(_reference,''), NULLIF(_note,''))
  RETURNING id INTO v_id;
  RETURN jsonb_build_object('ok', true, 'id', v_id, 'amount', v_amount);
END $$;

CREATE OR REPLACE FUNCTION public.subscription_review_payment(_payment_id uuid, _approve boolean, _admin_note text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE r public.subscription_payments; v_to timestamptz; v_from timestamptz;
BEGIN
  IF NOT (public.has_any_permission(auth.uid(), ARRAY['subscriptions.manage']) OR public.is_super_admin(auth.uid())) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  SELECT * INTO r FROM public.subscription_payments WHERE id = _payment_id;
  IF r.id IS NULL THEN RAISE EXCEPTION 'Payment not found'; END IF;
  IF r.status <> 'pending' THEN RAISE EXCEPTION 'Already reviewed'; END IF;

  IF _approve THEN
    SELECT GREATEST(now(), COALESCE(GREATEST(current_period_end, trial_ends_at), now())) INTO v_from
      FROM public.reseller_subscriptions WHERE reseller_id = r.reseller_id;
    v_to := public.subscription_extend(r.reseller_id, r.plan_id, r.cycle_months);
    UPDATE public.subscription_payments
       SET status='paid', period_from=v_from, period_to=v_to, admin_note=NULLIF(_admin_note,''),
           reviewed_by=auth.uid(), reviewed_at=now(), updated_at=now()
     WHERE id = _payment_id;
  ELSE
    UPDATE public.subscription_payments
       SET status='rejected', admin_note=NULLIF(_admin_note,''), reviewed_by=auth.uid(),
           reviewed_at=now(), updated_at=now()
     WHERE id = _payment_id;
  END IF;
  RETURN jsonb_build_object('ok', true);
END $$;

CREATE OR REPLACE FUNCTION public.admin_set_subscription(_reseller_id uuid, _patch jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NOT (public.has_any_permission(auth.uid(), ARRAY['subscriptions.manage']) OR public.is_super_admin(auth.uid())) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  INSERT INTO public.reseller_subscriptions(reseller_id) VALUES (_reseller_id)
  ON CONFLICT (reseller_id) DO NOTHING;

  UPDATE public.reseller_subscriptions SET
    plan_id = COALESCE(NULLIF(_patch->>'plan_id','')::uuid, plan_id),
    cycle_months = COALESCE((_patch->>'cycle_months')::int, cycle_months),
    trial_ends_at = CASE WHEN _patch ? 'trial_ends_at' THEN NULLIF(_patch->>'trial_ends_at','')::timestamptz ELSE trial_ends_at END,
    current_period_end = CASE WHEN _patch ? 'current_period_end' THEN NULLIF(_patch->>'current_period_end','')::timestamptz ELSE current_period_end END,
    is_exempt = COALESCE((_patch->>'is_exempt')::boolean, is_exempt),
    override_price_1m = CASE WHEN _patch ? 'override_price_1m' THEN NULLIF(_patch->>'override_price_1m','')::numeric ELSE override_price_1m END,
    override_price_3m = CASE WHEN _patch ? 'override_price_3m' THEN NULLIF(_patch->>'override_price_3m','')::numeric ELSE override_price_3m END,
    override_price_6m = CASE WHEN _patch ? 'override_price_6m' THEN NULLIF(_patch->>'override_price_6m','')::numeric ELSE override_price_6m END,
    override_price_12m = CASE WHEN _patch ? 'override_price_12m' THEN NULLIF(_patch->>'override_price_12m','')::numeric ELSE override_price_12m END,
    override_trial_days = CASE WHEN _patch ? 'override_trial_days' THEN NULLIF(_patch->>'override_trial_days','')::int ELSE override_trial_days END,
    override_grace_days = CASE WHEN _patch ? 'override_grace_days' THEN NULLIF(_patch->>'override_grace_days','')::int ELSE override_grace_days END,
    admin_note = CASE WHEN _patch ? 'admin_note' THEN NULLIF(_patch->>'admin_note','') ELSE admin_note END,
    updated_at = now()
  WHERE reseller_id = _reseller_id;

  IF COALESCE((_patch->>'extend_months')::int, 0) > 0 THEN
    PERFORM public.subscription_extend(_reseller_id, NULLIF(_patch->>'plan_id','')::uuid, (_patch->>'extend_months')::int);
    INSERT INTO public.subscription_payments(reseller_id, plan_id, cycle_months, amount, source, status,
                                             method, note, period_to, reviewed_by, reviewed_at)
    SELECT _reseller_id, s.plan_id, (_patch->>'extend_months')::int,
           COALESCE((_patch->>'extend_amount')::numeric, 0), 'admin', 'paid', 'admin',
           NULLIF(_patch->>'admin_note',''), s.current_period_end, auth.uid(), now()
      FROM public.reseller_subscriptions s WHERE s.reseller_id = _reseller_id;
  END IF;

  RETURN public.subscription_state(_reseller_id);
END $$;

CREATE OR REPLACE FUNCTION public.subscription_overview()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NOT (public.has_any_permission(auth.uid(), ARRAY['subscriptions.view','subscriptions.manage']) OR public.is_super_admin(auth.uid())) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN jsonb_build_object(
    'plans', (SELECT COALESCE(jsonb_agg(to_jsonb(pl) ORDER BY pl.sort_order, pl.name), '[]'::jsonb) FROM public.subscription_plans pl),
    'subscribers', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'reseller_id', r.id, 'code', r.code, 'business_name', r.business_name,
        'status', r.status, 'avatar_url', r.avatar_url,
        'subscription', to_jsonb(s), 'state', public.subscription_state(r.id),
        'balance', public.reseller_balance(r.id)
      ) ORDER BY r.business_name), '[]'::jsonb)
      FROM public.resellers r LEFT JOIN public.reseller_subscriptions s ON s.reseller_id = r.id),
    'payments', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', sp.id, 'reseller_id', sp.reseller_id, 'code', r.code, 'business_name', r.business_name,
        'plan_name', pl.name, 'cycle_months', sp.cycle_months, 'amount', sp.amount,
        'source', sp.source, 'status', sp.status, 'method', sp.method, 'reference', sp.reference,
        'note', sp.note, 'admin_note', sp.admin_note, 'period_from', sp.period_from,
        'period_to', sp.period_to, 'created_at', sp.created_at, 'reviewed_at', sp.reviewed_at
      ) ORDER BY sp.created_at DESC), '[]'::jsonb)
      FROM public.subscription_payments sp
      JOIN public.resellers r ON r.id = sp.reseller_id
      LEFT JOIN public.subscription_plans pl ON pl.id = sp.plan_id)
  );
END $$;

CREATE OR REPLACE FUNCTION public.reseller_start_subscription()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE p public.subscription_plans;
BEGIN
  SELECT * INTO p FROM public.subscription_plans WHERE is_active ORDER BY sort_order, name LIMIT 1;
  INSERT INTO public.reseller_subscriptions(reseller_id, plan_id, trial_ends_at)
  VALUES (NEW.id, p.id, now() + make_interval(days => COALESCE(p.trial_days, 0)))
  ON CONFLICT (reseller_id) DO NOTHING;
  RETURN NEW;
END $$;

CREATE TRIGGER reseller_start_subscription_trg
AFTER INSERT ON public.resellers
FOR EACH ROW EXECUTE FUNCTION public.reseller_start_subscription();

INSERT INTO public.permissions(name, description) VALUES
  ('subscriptions.view', 'View subscription plans, subscribers and revenue'),
  ('subscriptions.manage', 'Edit plans, approve payments and change reseller subscriptions')
ON CONFLICT (name) DO NOTHING;
