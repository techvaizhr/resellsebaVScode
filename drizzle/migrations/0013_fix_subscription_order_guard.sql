CREATE OR REPLACE FUNCTION public.subscription_guard_public_order()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NEW.reseller_id IS NOT NULL
     AND COALESCE((public.subscription_state(NEW.reseller_id) ->> 'locked')::boolean, false) THEN
    RAISE EXCEPTION 'Subscription expired - new orders are paused until the plan is renewed.';
  END IF;
  RETURN NEW;
END $$;