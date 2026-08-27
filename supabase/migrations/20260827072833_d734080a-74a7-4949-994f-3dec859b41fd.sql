
-- 1. suppliers -------------------------------------------------------------
CREATE TABLE public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  display_name text NOT NULL,
  contact_phone text,
  whatsapp text,
  email text,
  address text,
  status public.reseller_status NOT NULL DEFAULT 'pending',
  notes text,
  payout_method text,
  payout_account_name text,
  payout_account_number text,
  payout_bank_name text,
  payout_branch text,
  payout_notes text,
  approved_at timestamptz,
  approved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suppliers TO authenticated;
GRANT ALL ON public.suppliers TO service_role;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_supplier_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_super_admin(auth.uid())
      OR public.has_any_permission(auth.uid(), ARRAY['suppliers.view','suppliers.manage']);
$$;

CREATE OR REPLACE FUNCTION public.is_supplier_manager()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_super_admin(auth.uid())
      OR public.has_permission(auth.uid(), 'suppliers.manage');
$$;

CREATE OR REPLACE FUNCTION public.current_supplier_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.suppliers WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE POLICY "suppliers self read" ON public.suppliers FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_supplier_admin());
CREATE POLICY "suppliers self update" ON public.suppliers FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_supplier_manager())
  WITH CHECK (user_id = auth.uid() OR public.is_supplier_manager());
CREATE POLICY "suppliers admin insert" ON public.suppliers FOR INSERT TO authenticated
  WITH CHECK (public.is_supplier_manager());
CREATE POLICY "suppliers admin delete" ON public.suppliers FOR DELETE TO authenticated
  USING (public.is_supplier_manager());

-- suppliers may not promote themselves
CREATE OR REPLACE FUNCTION public.protect_supplier_admin_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_supplier_manager() THEN
    NEW.status := OLD.status;
    NEW.user_id := OLD.user_id;
    NEW.code := OLD.code;
    NEW.approved_at := OLD.approved_at;
    NEW.approved_by := OLD.approved_by;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER trg_suppliers_protect BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.protect_supplier_admin_fields();

CREATE OR REPLACE FUNCTION public.generate_supplier_code(_seed text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE base text; candidate text; i int := 0; ex boolean;
BEGIN
  base := lower(regexp_replace(coalesce(_seed,''), '[^a-zA-Z0-9]+', '-', 'g'));
  base := regexp_replace(base, '(^-+|-+$)', '', 'g');
  IF base IS NULL OR length(base) < 2 THEN base := 'supplier'; END IF;
  base := left(base, 20);
  candidate := base;
  LOOP
    SELECT EXISTS(SELECT 1 FROM public.suppliers WHERE code = candidate) INTO ex;
    EXIT WHEN NOT ex;
    i := i + 1;
    candidate := base || '-' || lpad((floor(random()*9000)+1000)::int::text, 4, '0');
    IF i > 20 THEN candidate := base || '-' || substr(md5(random()::text || clock_timestamp()::text), 1, 6); EXIT; END IF;
  END LOOP;
  RETURN candidate;
END $$;

-- 2. product + order item supplier link -------------------------------------
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS supplier_price numeric(12,2) NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_products_supplier ON public.products(supplier_id);

CREATE OR REPLACE FUNCTION public.sync_product_supplier_price()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.supplier_price := COALESCE(NEW.buying_price, 0);
  RETURN NEW;
END $$;
CREATE TRIGGER trg_products_supplier_price BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.sync_product_supplier_price();
UPDATE public.products SET supplier_price = COALESCE(buying_price, 0);

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_order_items_supplier ON public.order_items(supplier_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

CREATE OR REPLACE FUNCTION public.snapshot_order_item_costs()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_buy numeric(12,2);
  v_pack numeric(12,2);
  v_sup uuid;
BEGIN
  IF NEW.product_id IS NOT NULL THEN
    SELECT COALESCE(buying_price, 0), COALESCE(packaging_cost, 0), supplier_id
      INTO v_buy, v_pack, v_sup
    FROM public.products WHERE id = NEW.product_id;
    IF COALESCE(NEW.buying_price, 0) = 0 THEN NEW.buying_price := COALESCE(v_buy, 0); END IF;
    IF COALESCE(NEW.packaging_cost, 0) = 0 THEN NEW.packaging_cost := COALESCE(v_pack, 0); END IF;
    IF NEW.supplier_id IS NULL THEN NEW.supplier_id := v_sup; END IF;
  END IF;
  RETURN NEW;
END $$;

-- 3. kept / returned quantity rules -----------------------------------------
CREATE OR REPLACE FUNCTION public.supplier_kept_qty(_status public.order_status, _qty int, _returned int)
RETURNS int LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE
    WHEN _status IN ('delivered','partial_full') THEN GREATEST(COALESCE(_qty,0), 0)
    WHEN _status = 'partial_item' THEN GREATEST(COALESCE(_qty,0) - COALESCE(_returned,0), 0)
    ELSE 0
  END;
$$;

CREATE OR REPLACE FUNCTION public.supplier_return_qty(_status public.order_status, _qty int, _returned int)
RETURNS int LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE
    WHEN _status IN ('returned','partial_delivery','damaged') THEN GREATEST(COALESCE(_qty,0), 0)
    WHEN _status = 'partial_item' THEN GREATEST(LEAST(COALESCE(_returned,0), COALESCE(_qty,0)), 0)
    ELSE 0
  END;
$$;

-- 4. supplier returns ledger -------------------------------------------------
CREATE TABLE public.supplier_returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id uuid NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  product_id uuid,
  product_name text NOT NULL,
  quantity int NOT NULL DEFAULT 0,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  order_status public.order_status NOT NULL,
  status text NOT NULL DEFAULT 'pending_handover',
  note text,
  handed_over_by uuid,
  handed_over_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (order_item_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.supplier_returns TO authenticated;
GRANT ALL ON public.supplier_returns TO service_role;
ALTER TABLE public.supplier_returns ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_supplier_returns_supplier ON public.supplier_returns(supplier_id, status);
CREATE INDEX idx_supplier_returns_order ON public.supplier_returns(order_id);

CREATE POLICY "supplier returns read" ON public.supplier_returns FOR SELECT TO authenticated
  USING (supplier_id = public.current_supplier_id() OR public.is_supplier_admin());
CREATE POLICY "supplier returns manage" ON public.supplier_returns FOR UPDATE TO authenticated
  USING (public.is_supplier_manager()) WITH CHECK (public.is_supplier_manager());
CREATE POLICY "supplier returns insert" ON public.supplier_returns FOR INSERT TO authenticated
  WITH CHECK (public.is_supplier_manager());
CREATE POLICY "supplier returns delete" ON public.supplier_returns FOR DELETE TO authenticated
  USING (public.is_supplier_manager());

CREATE OR REPLACE FUNCTION public.sync_supplier_returns(_order_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_status public.order_status;
  it record;
  q int;
BEGIN
  SELECT status INTO v_status FROM public.orders WHERE id = _order_id;
  IF v_status IS NULL THEN RETURN; END IF;
  FOR it IN SELECT * FROM public.order_items WHERE order_id = _order_id AND supplier_id IS NOT NULL LOOP
    q := public.supplier_return_qty(v_status, it.quantity, it.returned_qty);
    IF q > 0 THEN
      INSERT INTO public.supplier_returns
        (supplier_id, order_id, order_item_id, product_id, product_name, quantity, unit_price, order_status)
      VALUES (it.supplier_id, _order_id, it.id, it.product_id, it.product_name, q,
              COALESCE(it.buying_price, 0), v_status)
      ON CONFLICT (order_item_id) DO UPDATE
        SET quantity = EXCLUDED.quantity,
            unit_price = EXCLUDED.unit_price,
            order_status = EXCLUDED.order_status,
            supplier_id = EXCLUDED.supplier_id,
            updated_at = now();
    ELSE
      DELETE FROM public.supplier_returns
        WHERE order_item_id = it.id AND status <> 'handed_over';
    END IF;
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.supplier_returns_on_order_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.sync_supplier_returns(NEW.id);
  RETURN NULL;
END $$;
CREATE TRIGGER trg_orders_supplier_returns AFTER UPDATE OF status ON public.orders
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.supplier_returns_on_order_change();

CREATE OR REPLACE FUNCTION public.supplier_returns_on_item_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.sync_supplier_returns(NEW.order_id);
  RETURN NULL;
END $$;
CREATE TRIGGER trg_order_items_supplier_returns AFTER UPDATE OF returned_qty ON public.order_items
  FOR EACH ROW WHEN (OLD.returned_qty IS DISTINCT FROM NEW.returned_qty)
  EXECUTE FUNCTION public.supplier_returns_on_item_change();

-- 5. supplier payouts --------------------------------------------------------
CREATE TABLE public.supplier_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  method text,
  reference text,
  note text,
  admin_note text,
  created_by uuid,
  approved_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.supplier_payouts TO authenticated;
GRANT ALL ON public.supplier_payouts TO service_role;
ALTER TABLE public.supplier_payouts ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_supplier_payouts_supplier ON public.supplier_payouts(supplier_id, status);

CREATE POLICY "supplier payouts read" ON public.supplier_payouts FOR SELECT TO authenticated
  USING (supplier_id = public.current_supplier_id() OR public.is_supplier_admin());
CREATE POLICY "supplier payouts request" ON public.supplier_payouts FOR INSERT TO authenticated
  WITH CHECK (supplier_id = public.current_supplier_id() OR public.is_supplier_manager());
CREATE POLICY "supplier payouts manage" ON public.supplier_payouts FOR UPDATE TO authenticated
  USING (public.is_supplier_manager()) WITH CHECK (public.is_supplier_manager());
CREATE POLICY "supplier payouts delete" ON public.supplier_payouts FOR DELETE TO authenticated
  USING (public.is_supplier_manager());

CREATE OR REPLACE FUNCTION public.protect_supplier_payout()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NOT public.is_supplier_manager() THEN
    NEW.status := 'pending';
    NEW.approved_at := NULL;
    NEW.paid_at := NULL;
    NEW.admin_note := NULL;
    NEW.created_by := auth.uid();
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER trg_supplier_payouts_protect BEFORE INSERT OR UPDATE ON public.supplier_payouts
  FOR EACH ROW EXECUTE FUNCTION public.protect_supplier_payout();

-- 6. permissions -------------------------------------------------------------
INSERT INTO public.permissions (name, description) VALUES
  ('suppliers.view', 'View suppliers, supplier report and returns'),
  ('suppliers.manage', 'Manage suppliers, returns handover and supplier payouts')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.name ILIKE 'super admin' AND p.name IN ('suppliers.view','suppliers.manage')
ON CONFLICT DO NOTHING;

-- 7. signup: supplier accounts ------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_name text;
  v_phone text;
  v_email_prefix text;
  v_business text;
  v_code text;
  v_is_admin boolean;
  v_is_staff boolean;
  v_is_supplier boolean;
  v_dep_on boolean := false;
  v_dep_amt numeric := 0;
  v_frozen numeric := 0;
BEGIN
  v_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');
  v_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  v_email_prefix := split_part(COALESCE(NEW.email,''), '@', 1);

  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, v_name, v_phone)
  ON CONFLICT (id) DO NOTHING;

  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = NEW.id AND role IN ('super_admin','staff'))
    INTO v_is_admin;
  v_is_staff := COALESCE(NEW.raw_user_meta_data->>'is_staff', 'false') = 'true';
  IF v_is_admin OR v_is_staff THEN
    RETURN NEW;
  END IF;

  v_is_supplier := COALESCE(NEW.raw_user_meta_data->>'account_type', '') = 'supplier';

  IF v_is_supplier THEN
    IF NOT EXISTS (SELECT 1 FROM public.suppliers WHERE user_id = NEW.id) THEN
      v_business := COALESCE(NULLIF(trim(v_name), ''), NULLIF(trim(v_email_prefix), ''), 'New supplier');
      v_code := public.generate_supplier_code(COALESCE(v_email_prefix, v_business));
      INSERT INTO public.suppliers (user_id, display_name, code, contact_phone, email, status)
      VALUES (NEW.id, v_business, v_code, NULLIF(v_phone,''), NEW.email, 'pending');
    END IF;
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'supplier')
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN NEW;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.resellers WHERE user_id = NEW.id) THEN
    v_business := NULLIF(trim(v_name), '');
    IF v_business IS NULL THEN v_business := NULLIF(trim(v_email_prefix), ''); END IF;
    IF v_business IS NULL THEN v_business := 'New reseller'; END IF;
    v_code := public.generate_reseller_code(COALESCE(v_email_prefix, v_business));

    SELECT COALESCE(deposit_trigger_default_on,false), COALESCE(deposit_default_amount,0), COALESCE(deposit_default_frozen,0)
      INTO v_dep_on, v_dep_amt, v_frozen
      FROM public.global_settings WHERE id = 1;

    INSERT INTO public.resellers (user_id, business_name, code, contact_phone, status,
                                  deposit_required, deposit_required_amount, frozen_amount)
    VALUES (NEW.id, v_business, v_code, NULLIF(v_phone,''), 'pending',
            COALESCE(v_dep_on,false), COALESCE(v_dep_amt,0), COALESCE(v_frozen,0));
  END IF;

  RETURN NEW;
END $$;
