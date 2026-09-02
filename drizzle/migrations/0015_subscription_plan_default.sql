ALTER TABLE public.subscription_plans
  ADD COLUMN IF NOT EXISTS is_default boolean NOT NULL DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS subscription_plans_one_default
  ON public.subscription_plans (is_default) WHERE is_default;

CREATE OR REPLACE FUNCTION public.reseller_start_subscription()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE p public.subscription_plans;
BEGIN
  SELECT * INTO p FROM public.subscription_plans
   WHERE is_active
   ORDER BY is_default DESC, sort_order, name
   LIMIT 1;
  INSERT INTO public.reseller_subscriptions(reseller_id, plan_id, trial_ends_at)
  VALUES (NEW.id, p.id, now() + make_interval(days => COALESCE(p.trial_days, 0)))
  ON CONFLICT (reseller_id) DO NOTHING;
  RETURN NEW;
END
$function$;