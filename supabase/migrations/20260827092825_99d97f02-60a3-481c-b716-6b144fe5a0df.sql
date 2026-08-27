CREATE OR REPLACE FUNCTION public.bootstrap_current_user()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  u record;
  v_name text;
  v_phone text;
  v_email_prefix text;
  v_business text;
  v_code text;
  v_is_supplier boolean;
  v_dep_on boolean := false;
  v_dep_amt numeric := 0;
  v_frozen numeric := 0;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  SELECT id, email, raw_user_meta_data INTO u FROM auth.users WHERE id = auth.uid();
  IF u.id IS NULL THEN RAISE EXCEPTION 'User not found'; END IF;

  v_name := COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '');
  v_phone := COALESCE(u.raw_user_meta_data->>'phone', '');
  v_email_prefix := split_part(COALESCE(u.email,''), '@', 1);

  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (u.id, v_name, v_phone)
  ON CONFLICT (id) DO NOTHING;

  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = u.id AND role IN ('super_admin','staff')) THEN
    RETURN 'admin';
  END IF;

  IF EXISTS (SELECT 1 FROM public.suppliers WHERE user_id = u.id) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (u.id, 'supplier')
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN 'supplier';
  END IF;
  IF EXISTS (SELECT 1 FROM public.resellers WHERE user_id = u.id) THEN
    RETURN 'reseller';
  END IF;

  v_is_supplier := COALESCE(u.raw_user_meta_data->>'account_type', '') = 'supplier';

  IF v_is_supplier THEN
    v_business := COALESCE(NULLIF(trim(v_name), ''), NULLIF(trim(v_email_prefix), ''), 'New supplier');
    v_code := public.generate_supplier_code(COALESCE(v_email_prefix, v_business));
    INSERT INTO public.suppliers (user_id, display_name, code, contact_phone, email, status)
    VALUES (u.id, v_business, v_code, NULLIF(v_phone,''), u.email, 'pending');
    INSERT INTO public.user_roles (user_id, role) VALUES (u.id, 'supplier')
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN 'supplier';
  END IF;

  v_business := COALESCE(NULLIF(trim(v_name), ''), NULLIF(trim(v_email_prefix), ''), 'New reseller');
  v_code := public.generate_reseller_code(COALESCE(v_email_prefix, v_business));
  SELECT COALESCE(deposit_trigger_default_on,false), COALESCE(deposit_default_amount,0), COALESCE(deposit_default_frozen,0)
    INTO v_dep_on, v_dep_amt, v_frozen FROM public.global_settings WHERE id = 1;

  INSERT INTO public.resellers (user_id, business_name, code, contact_phone, status,
                                deposit_required, deposit_required_amount, frozen_amount)
  VALUES (u.id, v_business, v_code, NULLIF(v_phone,''), 'pending',
          COALESCE(v_dep_on,false), COALESCE(v_dep_amt,0), COALESCE(v_frozen,0));
  RETURN 'reseller';
END
$$;

REVOKE ALL ON FUNCTION public.bootstrap_current_user() FROM public;
GRANT EXECUTE ON FUNCTION public.bootstrap_current_user() TO authenticated;

-- Backfill the supplier that registered while no signup hook existed
DO $$
DECLARE r record; v_code text;
BEGIN
  FOR r IN SELECT id, email, raw_user_meta_data FROM auth.users
           WHERE COALESCE(raw_user_meta_data->>'account_type','') = 'supplier'
             AND NOT EXISTS (SELECT 1 FROM public.suppliers s WHERE s.user_id = auth.users.id)
  LOOP
    v_code := public.generate_supplier_code(split_part(COALESCE(r.email,''),'@',1));
    INSERT INTO public.profiles (id, full_name, phone)
    VALUES (r.id, COALESCE(r.raw_user_meta_data->>'full_name',''), COALESCE(r.raw_user_meta_data->>'phone',''))
    ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.suppliers (user_id, display_name, code, contact_phone, email, status)
    VALUES (r.id,
            COALESCE(NULLIF(trim(r.raw_user_meta_data->>'full_name'),''), split_part(COALESCE(r.email,''),'@',1)),
            v_code, NULLIF(COALESCE(r.raw_user_meta_data->>'phone',''),''), r.email, 'pending');
    INSERT INTO public.user_roles (user_id, role) VALUES (r.id, 'supplier') ON CONFLICT (user_id, role) DO NOTHING;
  END LOOP;
END $$;