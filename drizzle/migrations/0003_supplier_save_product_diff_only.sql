CREATE OR REPLACE FUNCTION public.supplier_save_product(_id uuid, _payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sid uuid := public.current_supplier_id();
  st text;
  new_id uuid;
  v_base text;
  v_slug text;
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

  SELECT * INTO cur FROM public.products WHERE id = _id AND supplier_id = sid;
  IF cur.id IS NULL THEN RAISE EXCEPTION 'Product not found'; END IF;
  st := cur.approval_status;

  IF st <> 'approved' THEN
    -- still awaiting first approval: edits apply directly to the draft row
    PERFORM public.apply_product_patch(_id, _payload);
    UPDATE public.products
      SET approval_status = 'pending', approval_note = NULL, submitted_by = auth.uid(), updated_at = now()
      WHERE id = _id;
    RETURN jsonb_build_object('id', _id, 'approval_status', 'pending', 'changed', true);
  END IF;

  -- live product: keep ONLY the fields that actually changed, so admin sees a clean diff
  FOREACH k IN ARRAY ARRAY['name','sku','short_description','description','brand_id','category_id',
                           'supplier_price','stock','weight_grams','meta_title','meta_description',
                           'keywords','og_image_url'] LOOP
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

  -- stock is not a pricing field: apply it right away and drop from the diff
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
$$;