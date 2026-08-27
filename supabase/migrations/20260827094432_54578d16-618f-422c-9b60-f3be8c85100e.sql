-- 1. approval columns -------------------------------------------------------
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS pending_changes jsonb,
  ADD COLUMN IF NOT EXISTS submitted_by uuid,
  ADD COLUMN IF NOT EXISTS approval_note text,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz;

DO $$ BEGIN
  ALTER TABLE public.products
    ADD CONSTRAINT products_approval_status_chk
    CHECK (approval_status IN ('approved','pending','rejected'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS products_supplier_idx ON public.products(supplier_id);
CREATE INDEX IF NOT EXISTS products_approval_idx ON public.products(approval_status);

-- 2. helpers -----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.product_slugify(_name text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT COALESCE(NULLIF(regexp_replace(lower(trim(_name)), '[^a-z0-9]+', '-', 'g'), '-'), 'product');
$$;

-- apply a jsonb patch onto a product row
CREATE OR REPLACE FUNCTION public.apply_product_patch(_id uuid, _patch jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
END $$;

-- 3. supplier writes ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.supplier_save_product(_id uuid, _payload jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  sid uuid := public.current_supplier_id();
  st text;
  new_id uuid;
  base text;
  slug text;
  price numeric := COALESCE((_payload->>'supplier_price')::numeric, 0);
BEGIN
  IF sid IS NULL THEN RAISE EXCEPTION 'Not a supplier'; END IF;
  IF (SELECT status FROM public.suppliers WHERE id = sid) <> 'active' THEN
    RAISE EXCEPTION 'Supplier account is not active';
  END IF;
  IF COALESCE(trim(_payload->>'name'),'') = '' THEN RAISE EXCEPTION 'Product name required'; END IF;

  IF _id IS NULL THEN
    base := public.product_slugify(_payload->>'name');
    slug := base;
    WHILE EXISTS (SELECT 1 FROM public.products WHERE products.slug = slug) LOOP
      slug := base || '-' || substr(md5(random()::text), 1, 5);
    END LOOP;

    INSERT INTO public.products (name, slug, supplier_id, supplier_price, buying_price,
                                 reseller_price, suggested_price, stock, is_active,
                                 approval_status, submitted_by)
    VALUES (_payload->>'name', slug, sid, price, price, price, price,
            COALESCE((_payload->>'stock')::int, 0), false, 'pending', auth.uid())
    RETURNING id INTO new_id;

    PERFORM public.apply_product_patch(new_id, _payload);
    RETURN jsonb_build_object('id', new_id, 'approval_status', 'pending');
  END IF;

  SELECT approval_status INTO st FROM public.products WHERE id = _id AND supplier_id = sid;
  IF st IS NULL THEN RAISE EXCEPTION 'Product not found'; END IF;

  IF st <> 'approved' THEN
    -- never approved yet: edit the draft row directly, keep it pending
    PERFORM public.apply_product_patch(_id, _payload);
    UPDATE public.products
      SET approval_status = 'pending', approval_note = NULL, submitted_by = auth.uid(), updated_at = now()
      WHERE id = _id;
  ELSE
    -- live product: park the changes until an admin approves them
    UPDATE public.products
      SET pending_changes = _payload, approval_status = 'pending',
          approval_note = NULL, submitted_by = auth.uid(), updated_at = now()
      WHERE id = _id;
  END IF;

  RETURN jsonb_build_object('id', _id, 'approval_status', 'pending');
END $$;

CREATE OR REPLACE FUNCTION public.supplier_products()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE sid uuid := public.current_supplier_id();
BEGIN
  IF sid IS NULL THEN RAISE EXCEPTION 'Not a supplier'; END IF;
  RETURN jsonb_build_object(
    'products', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', p.id, 'product_code', p.product_code, 'name', p.name, 'sku', p.sku,
        'short_description', p.short_description, 'description', p.description,
        'brand_id', p.brand_id, 'category_id', p.category_id,
        'supplier_price', p.supplier_price, 'reseller_price', p.reseller_price,
        'suggested_price', p.suggested_price, 'stock', p.stock,
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
END $$;

-- 4. admin review ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_review_product(_id uuid, _approve boolean, _note text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE patch jsonb;
BEGIN
  IF NOT (public.is_super_admin(auth.uid()) OR public.has_permission(auth.uid(), 'products.manage')) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  SELECT pending_changes INTO patch FROM public.products WHERE id = _id;

  IF _approve THEN
    PERFORM public.apply_product_patch(_id, patch);
    UPDATE public.products
      SET approval_status = 'approved', pending_changes = NULL, approval_note = _note,
          approved_at = now(), is_active = true, updated_at = now()
      WHERE id = _id;
  ELSE
    UPDATE public.products
      SET approval_status = 'rejected', approval_note = _note, updated_at = now()
      WHERE id = _id;
  END IF;

  RETURN jsonb_build_object('id', _id, 'approval_status', CASE WHEN _approve THEN 'approved' ELSE 'rejected' END);
END $$;

CREATE OR REPLACE FUNCTION public.admin_set_product_supplier(_id uuid, _supplier uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT (public.is_super_admin(auth.uid()) OR public.has_permission(auth.uid(), 'products.manage')) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  IF _supplier IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.suppliers WHERE id = _supplier) THEN
    RAISE EXCEPTION 'Supplier not found';
  END IF;

  UPDATE public.products
    SET supplier_id = _supplier,
        supplier_price = CASE WHEN _supplier IS NULL THEN 0 ELSE buying_price END,
        updated_at = now()
    WHERE id = _id;

  RETURN jsonb_build_object('id', _id, 'supplier_id', _supplier);
END $$;

-- 5. admin catalog page carries supplier + approval data ----------------------
CREATE OR REPLACE FUNCTION public.admin_catalog_page()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
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
               supplier_id, supplier_price, approval_status, approval_note, pending_changes
        FROM public.products
      ) p
    ),
    'brands', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'name', name) ORDER BY name), '[]'::jsonb) FROM public.brands),
    'categories', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'name', name) ORDER BY name), '[]'::jsonb) FROM public.categories),
    'suppliers', (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'name', display_name, 'code', code, 'status', status) ORDER BY display_name), '[]'::jsonb) FROM public.suppliers)
  );
END $$;

REVOKE EXECUTE ON FUNCTION public.apply_product_patch(uuid, jsonb) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.supplier_save_product(uuid, jsonb) FROM anon;
REVOKE EXECUTE ON FUNCTION public.supplier_products() FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_review_product(uuid, boolean, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_set_product_supplier(uuid, uuid) FROM anon;