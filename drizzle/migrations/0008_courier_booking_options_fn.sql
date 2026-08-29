CREATE OR REPLACE FUNCTION public.courier_booking_options()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _allowed boolean;
  _res jsonb;
BEGIN
  SELECT
    public.is_super_admin(auth.uid())
    OR public.has_any_permission(auth.uid(), ARRAY['couriers.manage','orders.edit'])
    OR public.current_supplier_id() IS NOT NULL
  INTO _allowed;

  IF NOT COALESCE(_allowed, false) THEN
    RETURN '[]'::jsonb;
  END IF;

  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'provider', c.provider,
    'stores', COALESCE(
      CASE
        WHEN jsonb_typeof(c.config -> 'stores_json') = 'array' THEN c.config -> 'stores_json'
        WHEN jsonb_typeof(c.config -> 'stores_json') = 'string' THEN (c.config ->> 'stores_json')::jsonb
        ELSE '[]'::jsonb
      END, '[]'::jsonb),
    'defaultStoreId', c.config ->> 'store_id'
  )), '[]'::jsonb)
  INTO _res
  FROM public.courier_configs c
  WHERE c.is_active = true;

  RETURN _res;
END;
$$;

GRANT EXECUTE ON FUNCTION public.courier_booking_options() TO authenticated;