CREATE OR REPLACE FUNCTION public.apply_product_patch(_id uuid, _patch jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE imgs jsonb;
BEGIN
  IF _patch IS NULL THEN RETURN; END IF;

  UPDATE public.products p SET
    name              = COALESCE(_patch->>'name', p.name),
    sku               = COALESCE(_patch->>'sku', p.sku),
    short_description = COALESCE(_patch->>'short_description', p.short_description),
    description       = COALESCE(_patch->>'description', p.description),
    brand_id          = CASE WHEN _patch ? 'brand_id' THEN NULLIF(_patch->>'brand_id','')::uuid ELSE p.brand_id END,
    category_id       = CASE WHEN _patch ? 'category_id' THEN NULLIF(_patch->>'category_id','')::uuid ELSE p.category_id END,
    supplier_price    = COALESCE((_patch->>'supplier_price')::numeric, p.supplier_price),
    buying_price      = COALESCE((_patch->>'supplier_price')::numeric, p.buying_price),
    stock             = COALESCE((_patch->>'stock')::int, p.stock),
    weight_grams      = COALESCE((_patch->>'weight_grams')::int, p.weight_grams),
    meta_title        = COALESCE(_patch->>'meta_title', p.meta_title),
    meta_description  = COALESCE(_patch->>'meta_description', p.meta_description),
    keywords          = COALESCE(_patch->>'keywords', p.keywords),
    og_image_url      = COALESCE(_patch->>'og_image_url', p.og_image_url),
    video_url         = CASE WHEN _patch ? 'video_url' THEN NULLIF(_patch->>'video_url','') ELSE p.video_url END,
    updated_at        = now()
  WHERE p.id = _id;

  imgs := _patch->'images';
  IF imgs IS NOT NULL AND jsonb_typeof(imgs) = 'array' AND jsonb_array_length(imgs) > 0 THEN
    DELETE FROM public.product_images WHERE product_id = _id;
    INSERT INTO public.product_images (product_id, url, is_primary, sort_order)
    SELECT _id, e.value->>'url', e.ordinality = 1, (e.ordinality - 1)::int
    FROM jsonb_array_elements(imgs) WITH ORDINALITY AS e(value, ordinality)
    WHERE COALESCE(e.value->>'url','') <> '';
    UPDATE public.products SET og_image_url = (imgs->0->>'url') WHERE id = _id;
  END IF;
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
        'video_url', p.video_url, 'video_file_url', p.video_file_url,
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
  v_n int := 0;
  price numeric := COALESCE((_payload->>'supplier_price')::numeric, 0);
  cur RECORD;
  diff jsonb := '{}'::jsonb;
  k text;
  cur_txt text;
  new_txt text;
  cur_imgs jsonb;
  new_imgs jsonb;
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
      v_n := v_n + 1;
      v_slug := v_base || '-' || v_n;
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

  SELECT * INTO cur FROM public.products WHERE id = _id AND supplier_id = sid;
  IF cur.id IS NULL THEN RAISE EXCEPTION 'Product not found'; END IF;
  st := cur.approval_status;

  IF st <> 'approved' THEN
    PERFORM public.apply_product_patch(_id, _payload);
    UPDATE public.products
      SET approval_status = 'pending', approval_note = NULL, submitted_by = auth.uid(), updated_at = now()
      WHERE id = _id;
    RETURN jsonb_build_object('id', _id, 'approval_status', 'pending', 'changed', true);
  END IF;

  FOREACH k IN ARRAY ARRAY['name','sku','short_description','description','brand_id','category_id',
                           'supplier_price','stock','weight_grams','meta_title','meta_description',
                           'keywords','og_image_url','video_url'] LOOP
    IF _payload ? k THEN
      new_txt := NULLIF(_payload->>k, '');
      cur_txt := CASE k
        WHEN 'name' THEN cur.name
        WHEN 'sku' THEN cur.sku
        WHEN 'short_description' THEN cur.short_description
        WHEN 'description' THEN cur.description
        WHEN 'brand_id' THEN cur.brand_id::text
        WHEN 'category_id' THEN cur.category_id::text
        WHEN 'supplier_price' THEN cur.supplier_price::text
        WHEN 'stock' THEN cur.stock::text
        WHEN 'weight_grams' THEN cur.weight_grams::text
        WHEN 'meta_title' THEN cur.meta_title
        WHEN 'meta_description' THEN cur.meta_description
        WHEN 'keywords' THEN cur.keywords
        WHEN 'og_image_url' THEN cur.og_image_url
        WHEN 'video_url' THEN cur.video_url
      END;
      cur_txt := NULLIF(cur_txt, '');
      IF k IN ('supplier_price','stock','weight_grams') THEN
        IF COALESCE(new_txt::numeric, -1) IS DISTINCT FROM COALESCE(cur_txt::numeric, -1) THEN
          diff := diff || jsonb_build_object(k, _payload->k);
        END IF;
      ELSIF new_txt IS DISTINCT FROM cur_txt THEN
        diff := diff || jsonb_build_object(k, _payload->k);
      END IF;
    END IF;
  END LOOP;

  new_imgs := _payload->'images';
  IF new_imgs IS NOT NULL AND jsonb_typeof(new_imgs) = 'array' AND jsonb_array_length(new_imgs) > 0 THEN
    SELECT COALESCE(jsonb_agg(url ORDER BY sort_order), '[]'::jsonb) INTO cur_imgs
      FROM public.product_images WHERE product_id = _id;
    IF (SELECT COALESCE(jsonb_agg(e.value->>'url'), '[]'::jsonb)
          FROM jsonb_array_elements(new_imgs) e) IS DISTINCT FROM COALESCE(cur_imgs, '[]'::jsonb) THEN
      diff := diff || jsonb_build_object('images', new_imgs);
    END IF;
  END IF;

  IF diff ? 'stock' THEN
    UPDATE public.products SET stock = GREATEST(COALESCE((diff->>'stock')::int, cur.stock), 0), updated_at = now() WHERE id = _id;
    diff := diff - 'stock';
  END IF;

  IF diff = '{}'::jsonb THEN
    UPDATE public.products SET updated_at = now() WHERE id = _id;
    RETURN jsonb_build_object('id', _id, 'approval_status', st, 'changed', false);
  END IF;

  UPDATE public.products
    SET pending_changes = diff, approval_status = 'pending',
        approval_note = NULL, submitted_by = auth.uid(), updated_at = now()
    WHERE id = _id;

  RETURN jsonb_build_object('id', _id, 'approval_status', 'pending', 'changed', true);
END
$function$;