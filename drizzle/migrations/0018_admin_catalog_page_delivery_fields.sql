CREATE OR REPLACE FUNCTION public.admin_catalog_page()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'staff')) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  RETURN jsonb_build_object(
    'products', (
      SELECT COALESCE(jsonb_agg(to_jsonb(p) ORDER BY p.created_at DESC), '[]'::jsonb)
      FROM (
        SELECT id, product_code, name, buying_price, reseller_price, suggested_price, stock,
               is_active, is_featured, og_image_url, brand_id, category_id, created_at,
               supplier_id, supplier_price, approval_status, approval_note, pending_changes,
               packaging_cost, weight_grams,
               delivery_mode, delivery_flat, delivery_inside, delivery_outside, delivery_sub
        FROM public.products
      ) p
    ),
    'brands', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'name', name) ORDER BY name), '[]'::jsonb) FROM public.brands),
    'categories', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'name', name) ORDER BY name), '[]'::jsonb) FROM public.categories),
    'suppliers', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'name', display_name, 'code', code, 'status', status) ORDER BY display_name), '[]'::jsonb) FROM public.suppliers)
  );
END $function$;