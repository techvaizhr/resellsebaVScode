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
               packaging_cost, weight_grams
        FROM public.products
      ) p
    ),
    'brands', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'name', name) ORDER BY name), '[]'::jsonb) FROM public.brands),
    'categories', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'name', name) ORDER BY name), '[]'::jsonb) FROM public.categories),
    'suppliers', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'name', display_name, 'code', code, 'status', status) ORDER BY display_name), '[]'::jsonb) FROM public.suppliers)
  );
END $function$;

CREATE OR REPLACE FUNCTION public.supplier_products()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE sid uuid := public.current_supplier_id();
BEGIN
  IF sid IS NULL THEN RAISE EXCEPTION 'Not a supplier'; END IF;
  RETURN jsonb_build_object(
    'products', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', p.id, 'product_code', p.product_code, 'name', p.name, 'sku', p.sku,
        'short_description', p.short_description, 'description', p.description,
        'brand_id', p.brand_id, 'category_id', p.category_id,
        'supplier_price', p.supplier_price, 'stock', p.stock, 'weight_grams', p.weight_grams,
        'is_active', p.is_active, 'approval_status', p.approval_status,
        'approval_note', p.approval_note, 'pending_changes', p.pending_changes,
        'og_image_url', p.og_image_url, 'meta_title', p.meta_title,
        'meta_description', p.meta_description, 'keywords', p.keywords,
        'created_at', p.created_at, 'updated_at', p.updated_at,
        'images', (SELECT COALESCE(jsonb_agg(jsonb_build_object('url', i.url) ORDER BY i.sort_order), '[]'::jsonb)
                   FROM public.product_images i WHERE i.product_id = p.id)
      ) ORDER BY p.created_at DESC), '[]'::jsonb)
      FROM public.products p WHERE p.supplier_id = sid
    ),
    'brands', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'name', name) ORDER BY name), '[]'::jsonb) FROM public.brands WHERE is_active),
    'categories', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'name', name) ORDER BY name), '[]'::jsonb) FROM public.categories WHERE is_active)
  );
END $function$;