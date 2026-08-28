CREATE OR REPLACE FUNCTION public.supplier_available(_supplier uuid, _exclude uuid DEFAULT NULL)
RETURNS numeric
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT GREATEST(
    COALESCE((
      SELECT SUM(public.supplier_kept_qty(o.status, oi.quantity, oi.returned_qty) * COALESCE(oi.buying_price,0))
      FROM public.order_items oi JOIN public.orders o ON o.id = oi.order_id
      WHERE oi.supplier_id = _supplier
    ),0)
    - COALESCE((
      SELECT SUM(p.amount) FROM public.supplier_payouts p
      WHERE p.supplier_id = _supplier
        AND p.status IN ('pending','approved','paid')
        AND (_exclude IS NULL OR p.id <> _exclude)
    ),0)
  , 0);
$$;

CREATE OR REPLACE FUNCTION public.protect_supplier_payout()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE v_avail numeric;
BEGIN
  IF TG_OP = 'INSERT' AND NOT public.is_supplier_manager() THEN
    NEW.status := 'pending';
    NEW.approved_at := NULL;
    NEW.paid_at := NULL;
    NEW.admin_note := NULL;
    NEW.created_by := auth.uid();

    IF COALESCE(NEW.amount,0) <= 0 THEN
      RAISE EXCEPTION 'Payout amount must be greater than zero.';
    END IF;

    v_avail := public.supplier_available(NEW.supplier_id, NEW.id);
    IF NEW.amount > v_avail THEN
      RAISE EXCEPTION 'Withdraw limit: maximum %.2f BDT is available right now.', v_avail;
    END IF;
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END $function$;