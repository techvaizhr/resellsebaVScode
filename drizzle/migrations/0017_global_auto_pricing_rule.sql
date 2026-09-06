CREATE OR REPLACE FUNCTION public.pricing_rule_apply(_cost numeric)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  r jsonb;
  cost numeric := GREATEST(COALESCE(_cost, 0), 0);
  rp numeric;
  sp numeric;
  pk numeric;
  rd numeric;
BEGIN
  SELECT COALESCE(advanced_settings->'pricing', '{}'::jsonb) INTO r
  FROM public.global_settings WHERE id = 1;

  IF r IS NULL OR COALESCE((r->>'enabled')::boolean, false) = false THEN
    RETURN NULL;
  END IF;

  IF COALESCE(r->>'resellerMode', 'pct') = 'pct' THEN
    rp := cost * (1 + COALESCE((r->>'resellerValue')::numeric, 0) / 100);
  ELSE
    rp := cost + COALESCE((r->>'resellerValue')::numeric, 0);
  END IF;

  pk := GREATEST(COALESCE((r->>'packaging')::numeric, 0), 0);

  IF COALESCE(r->>'suggestedMode', 'pct') = 'pct' THEN
    sp := rp * (1 + COALESCE((r->>'suggestedValue')::numeric, 0) / 100);
  ELSE
    sp := rp + COALESCE((r->>'suggestedValue')::numeric, 0);
  END IF;
  sp := sp + pk;

  rd := COALESCE((r->>'roundTo')::numeric, 0);
  IF rd > 0 THEN
    rp := round(rp / rd) * rd;
    sp := round(sp / rd) * rd;
  ELSE
    rp := round(rp, 2);
    sp := round(sp, 2);
  END IF;

  RETURN jsonb_build_object(
    'reseller_price', GREATEST(rp, 0),
    'suggested_price', GREATEST(sp, 0),
    'packaging_cost', pk
  );
END;
$fn$;

CREATE OR REPLACE FUNCTION public.supplier_product_auto_price()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  p jsonb;
BEGIN
  IF NEW.supplier_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF COALESCE(NEW.approval_status, 'approved') <> 'pending' THEN
      RETURN NEW;
    END IF;
  ELSE
    IF COALESCE(OLD.supplier_price, 0) = COALESCE(NEW.supplier_price, 0) THEN
      RETURN NEW;
    END IF;
  END IF;

  p := public.pricing_rule_apply(NEW.supplier_price);
  IF p IS NULL THEN
    RETURN NEW;
  END IF;

  NEW.buying_price := COALESCE(NEW.supplier_price, 0);
  NEW.reseller_price := (p->>'reseller_price')::numeric;
  NEW.suggested_price := (p->>'suggested_price')::numeric;
  NEW.packaging_cost := (p->>'packaging_cost')::numeric;
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS trg_supplier_product_auto_price ON public.products;
CREATE TRIGGER trg_supplier_product_auto_price
BEFORE INSERT OR UPDATE OF supplier_price ON public.products
FOR EACH ROW EXECUTE FUNCTION public.supplier_product_auto_price();

GRANT EXECUTE ON FUNCTION public.pricing_rule_apply(numeric) TO authenticated, anon, service_role;