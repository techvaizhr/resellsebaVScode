CREATE OR REPLACE FUNCTION public.supplier_save_product(_id uuid, _payload jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  sid uuid := public.current_supplier_id();
  st text;
  new_id uuid;
  v_base text;
  v_slug text;
  price numeric := COALESCE((_payload->>'supplier_price')::numeric, 0);
BEGIN
  IF sid IS NULL THEN RAISE EXCEPTION 'Not a supplier'; END IF;
  IF (SELECT status FROM public.suppliers WHERE id = sid) <> 'active' THEN
    RAISE EXCEPTION 'Supplier account is not active';
  END IF;
  IF COALESCE(trim(_payload->>'name'),'') = '' THEN RAISE EXCEPTION 'Product name required'; END IF;

  IF _id IS NULL THEN
    v_base := public.product_slugify(_payload->>'name');
    IF COALESCE(v_base,'') = '' THEN v_base := 'product'; END IF;
    v_slug := v_base;
    WHILE EXISTS (SELECT 1 FROM public.products p WHERE p.slug = v_slug) LOOP
      v_slug := v_base || '-' || substr(md5(random()::text), 1, 5);
    END LOOP;

    INSERT INTO public.products (name, slug, supplier_id, supplier_price, buying_price,
                                 reseller_price, suggested_price, stock, is_active,
                                 approval_status, submitted_by)
    VALUES (_payload->>'name', v_slug, sid, price, price, price, price,
            COALESCE((_payload->>'stock')::int, 0), false, 'pending', auth.uid())
    RETURNING id INTO new_id;

    PERFORM public.apply_product_patch(new_id, _payload);
    RETURN jsonb_build_object('id', new_id, 'approval_status', 'pending');
  END IF;

  SELECT approval_status INTO st FROM public.products WHERE id = _id AND supplier_id = sid;
  IF st IS NULL THEN RAISE EXCEPTION 'Product not found'; END IF;

  IF st <> 'approved' THEN
    PERFORM public.apply_product_patch(_id, _payload);
    UPDATE public.products
      SET approval_status = 'pending', approval_note = NULL, submitted_by = auth.uid(), updated_at = now()
      WHERE id = _id;
  ELSE
    UPDATE public.products
      SET pending_changes = _payload, approval_status = 'pending',
          approval_note = NULL, submitted_by = auth.uid(), updated_at = now()
      WHERE id = _id;
  END IF;

  RETURN jsonb_build_object('id', _id, 'approval_status', 'pending');
END $function$;