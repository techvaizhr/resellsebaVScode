CREATE OR REPLACE FUNCTION public.supplier_quick_update(_id uuid, _price numeric DEFAULT NULL, _stock integer DEFAULT NULL, _weight integer DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sid uuid := public.current_supplier_id();
  st text;
  cur_price numeric;
  pend jsonb;
BEGIN
  IF sid IS NULL THEN RAISE EXCEPTION 'Not a supplier'; END IF;
  IF (SELECT status FROM public.suppliers WHERE id = sid) <> 'active' THEN
    RAISE EXCEPTION 'Supplier account is not active';
  END IF;

  SELECT approval_status, supplier_price, pending_changes
    INTO st, cur_price, pend
    FROM public.products WHERE id = _id AND supplier_id = sid;
  IF st IS NULL THEN RAISE EXCEPTION 'Product not found'; END IF;

  -- stock always applies immediately
  IF _stock IS NOT NULL THEN
    UPDATE public.products SET stock = GREATEST(_stock, 0), updated_at = now() WHERE id = _id;
  END IF;

  -- weight applies immediately (not a pricing field)
  IF _weight IS NOT NULL THEN
    UPDATE public.products SET weight_grams = GREATEST(_weight, 0), updated_at = now() WHERE id = _id;
  END IF;

  IF _price IS NULL OR _price < 0 OR _price = cur_price THEN
    RETURN jsonb_build_object('id', _id, 'approval_status', st, 'price_pending', false);
  END IF;

  IF st <> 'approved' THEN
    UPDATE public.products
      SET supplier_price = _price, buying_price = _price,
          approval_status = 'pending', approval_note = NULL,
          submitted_by = auth.uid(), updated_at = now()
      WHERE id = _id;
    RETURN jsonb_build_object('id', _id, 'approval_status', 'pending', 'price_pending', false);
  END IF;

  UPDATE public.products
    SET pending_changes = COALESCE(pend, '{}'::jsonb) || jsonb_build_object('supplier_price', _price),
        approval_status = 'pending', approval_note = NULL,
        submitted_by = auth.uid(), updated_at = now()
    WHERE id = _id;

  RETURN jsonb_build_object('id', _id, 'approval_status', 'pending', 'price_pending', true);
END
$$;

REVOKE ALL ON FUNCTION public.supplier_quick_update(uuid, numeric, integer, integer) FROM public;
GRANT EXECUTE ON FUNCTION public.supplier_quick_update(uuid, numeric, integer, integer) TO authenticated;