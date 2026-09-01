-- panel_bootstrap now carries the subscription state so the shell can gate
-- access without an extra round trip.
CREATE OR REPLACE FUNCTION public.panel_bootstrap()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  uid uuid := auth.uid();
  r record;
  res jsonb;
begin
  if uid is null then
    return jsonb_build_object('signed_in', false);
  end if;

  select * into r from resellers where user_id = uid limit 1;

  res := jsonb_build_object(
    'signed_in', true,
    'settings', (select to_jsonb(g) from global_settings g where g.id = 1),
    'roles', (select coalesce(jsonb_agg(ur.role), '[]'::jsonb) from user_roles ur where ur.user_id = uid),
    'permissions', to_jsonb(public.my_permissions()),
    'verify', (select to_jsonb(v) from public.verify_state() v),
    'reseller', case when r.id is null then null else jsonb_build_object(
      'id', r.id, 'code', r.code, 'business_name', r.business_name, 'status', r.status,
      'avatar_url', r.avatar_url, 'deposit_required', r.deposit_required,
      'deposit_required_amount', r.deposit_required_amount, 'frozen_amount', r.frozen_amount
    ) end,
    'subscription', case when r.id is null then null else public.subscription_state(r.id) end,
    'reseller_settings', case when r.id is null then null else
      (select jsonb_build_object('logo_url', s.logo_url, 'primary_color', s.primary_color)
       from reseller_settings s where s.reseller_id = r.id) end,
    'deposits', case when r.id is null then '[]'::jsonb else
      (select coalesce(jsonb_agg(jsonb_build_object(
          'id', d.id, 'amount', d.amount, 'method', d.method,
          'reference', d.reference, 'note', d.note, 'created_at', d.created_at
        ) order by d.created_at desc), '[]'::jsonb)
       from reseller_deposits d where d.reseller_id = r.id) end,
    'notices', (
      select coalesce(jsonb_agg(to_jsonb(n) order by n.created_at desc), '[]'::jsonb)
      from admin_notices n
      where n.is_active
        and (n.starts_at is null or n.starts_at <= now())
        and (n.ends_at is null or n.ends_at >= now())
        and (coalesce(array_length(n.target_reseller_ids, 1), 0) = 0
             or (r.id is not null and r.id = any (n.target_reseller_ids)))
        and not exists (
          select 1 from admin_notice_dismissals d
          where d.notice_id = n.id and d.user_id = uid
        )
    )
  );

  return res;
end;
$function$;

-- A storefront only exists while the reseller is on a store plan and not expired.
CREATE OR REPLACE FUNCTION public.store_is_open(_reseller_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT COALESCE((public.subscription_state(_reseller_id) ->> 'store_enabled')::boolean, true);
$$;

-- store_bootstrap: closed store => same shape as an unknown store code, plus a reason.
CREATE OR REPLACE FUNCTION public.store_bootstrap(_code text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_store jsonb;
  v_rid uuid;
  v_listings jsonb;
  v_cats jsonb;
  v_menu jsonb;
  v_settings jsonb;
  v_pixels jsonb;
  v_pay jsonb;
begin
  select to_jsonb(s), s.reseller_id into v_store, v_rid
  from public_stores s
  where s.code = _code;

  if v_rid is null then
    return jsonb_build_object('store', null);
  end if;

  if not public.store_is_open(v_rid) then
    return jsonb_build_object('store', null, 'closed', true);
  end if;

  select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) into v_listings from (
    select l.id, l.selling_price, l.custom_title, l.custom_description,
      l.extra_delivery_inside, l.extra_delivery_outside, l.created_at,
      jsonb_build_object(
        'id', p.id, 'name', p.name, 'slug', p.slug,
        'product_code', p.product_code,
        'short_description', p.short_description,
        'description', p.description,
        'stock', p.stock,
        'category_id', p.category_id, 'brand_id', p.brand_id,
        'is_featured', p.is_featured,
        'delivery_mode', p.delivery_mode, 'delivery_flat', p.delivery_flat,
        'delivery_inside', p.delivery_inside, 'delivery_outside', p.delivery_outside,
        'delivery_sub', p.delivery_sub,
        'product_images', coalesce((
          select jsonb_agg(jsonb_build_object('url', i.url, 'is_primary', i.is_primary, 'sort_order', i.sort_order)
                           order by i.sort_order, i.is_primary desc nulls last)
          from product_images i where i.product_id = p.id), '[]'::jsonb)
      ) as product
    from reseller_listings l
    join products p on p.id = l.product_id and p.is_active
    where l.reseller_id = v_rid and l.is_active
    order by l.created_at desc
  ) t;

  select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) into v_cats from (
    select distinct c.id, c.name, c.slug, c.image_url, c.sort_order
    from categories c
    join products p on p.category_id = c.id and p.is_active
    join reseller_listings l on l.product_id = p.id and l.reseller_id = v_rid and l.is_active
    where c.is_active
    order by c.sort_order, c.name
  ) t;

  select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) into v_menu from (
    select m.id, m.parent_id, m.label, m.kind, m.ref_slug, m.url, m.image_url,
           m.description, m.open_new_tab, m.layout, m.sort_order
    from reseller_menu_items m
    where m.reseller_id = v_rid and m.is_active
    order by m.sort_order, m.label
  ) t;

  select jsonb_build_object(
           'id', g.id,
           'site_name', g.site_name,
           'logo_url', g.logo_url,
           'favicon_url', g.favicon_url,
           'primary_color', g.primary_color,
           'accent_color', g.accent_color,
           'contact_email', g.contact_email,
           'contact_phone', g.contact_phone,
           'label_size', g.label_size,
           'privacy_policy', g.privacy_policy,
           'advanced_settings', g.advanced_settings
         )
    into v_settings
  from global_settings g where g.id = 1;

  select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) into v_pixels from (
    select platform, pixel_id, (reseller_id is null) as is_global
    from public_marketing_pixels
    where reseller_id = v_rid or reseller_id is null
  ) t;

  select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) into v_pay from (
    select pc.method, pc.label, pc.instructions, pc.reseller_id
    from payment_configs pc
    where pc.is_active
      and pc.mode = 'manual'
      and (
        pc.reseller_id = v_rid
        or (
          pc.reseller_id is null
          and not exists (
            select 1 from payment_configs x
            where x.reseller_id = v_rid and x.method = pc.method
          )
        )
      )
  ) t;

  return jsonb_build_object(
    'store', v_store,
    'listings', v_listings,
    'categories', v_cats,
    'menu', v_menu,
    'settings', v_settings,
    'delivery', coalesce(v_settings->'advanced_settings'->'delivery', '{}'::jsonb),
    'pixels', v_pixels,
    'payment_methods', v_pay
  );
end;
$function$;

-- Public checkout must refuse orders for a closed store.
CREATE OR REPLACE FUNCTION public.subscription_guard_public_order()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NEW.reseller_id IS NOT NULL AND NOT COALESCE((public.subscription_state(NEW.reseller_id) ->> 'locked')::boolean, false) IS FALSE THEN
    RAISE EXCEPTION 'This store subscription has expired - new orders are paused.';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER subscription_guard_public_order_trg
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.subscription_guard_public_order();

-- Transaction report: subscription fees paid from earnings are money out.
CREATE OR REPLACE FUNCTION public.reseller_ledger(_reseller_id uuid, _limit integer DEFAULT 200)
 RETURNS TABLE(at timestamp with time zone, kind text, direction text, label text, reference text, status text, amount numeric, running numeric)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF NOT public.has_any_permission(auth.uid(), ARRAY['dashboard.view','finance.view','reports.view','payouts.manage'])
     AND NOT EXISTS (SELECT 1 FROM public.resellers r WHERE r.id=_reseller_id AND r.user_id=auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  WITH ev AS (
    SELECT rd.created_at AS at, 'deposit'::text AS kind, 'in'::text AS direction,
           'Security deposit'::text AS label,
           COALESCE(NULLIF(rd.reference,''), rd.method, '-')::text AS reference,
           'confirmed'::text AS status, rd.amount::numeric AS amount,
           rd.amount::numeric AS delta
    FROM public.reseller_deposits rd WHERE rd.reseller_id = _reseller_id
    UNION ALL
    SELECT o.updated_at,
           CASE WHEN o.status IN ('delivered','partial') THEN 'profit' ELSE 'loss' END,
           CASE WHEN o.reseller_profit < 0 THEN 'out' ELSE 'in' END,
           CASE
             WHEN o.status NOT IN ('delivered','partial')
               THEN ('Failed delivery loss (delivery + packaging) - #' || o.order_number)
             WHEN o.status = 'partial'
               THEN ('Partial order profit - #' || o.order_number)
             WHEN o.received_amount IS NOT NULL AND o.received_amount < o.total
               THEN ('Partial order profit - #' || o.order_number)
             ELSE ('Order profit - #' || o.order_number)
           END,
           CASE
             WHEN o.received_amount IS NOT NULL AND o.received_amount < o.total
               THEN (o.customer_name || ' - received ' || round(o.received_amount)::text || ' of ' || round(o.total)::text)
             ELSE o.customer_name
           END,
           o.status::text,
           abs(o.reseller_profit),
           o.reseller_profit
    FROM public.orders o
    WHERE o.reseller_id = _reseller_id
      AND o.status IN ('delivered','partial','returned','cancelled')
      AND o.reseller_profit <> 0
    UNION ALL
    SELECT py.created_at, 'payout',
           CASE WHEN py.status = 'rejected' THEN 'void' ELSE 'out' END,
           'Withdraw request',
           COALESCE(NULLIF(py.notes,''), NULLIF(py.reference,''), '-'),
           py.status::text, py.amount,
           CASE WHEN py.status = 'rejected' THEN 0 ELSE -py.amount END
    FROM public.payouts py WHERE py.reseller_id = _reseller_id
    UNION ALL
    SELECT sp.created_at, 'subscription', 'out',
           'Subscription fee - ' || COALESCE(pl.name, 'plan') || ' (' || sp.cycle_months || ' month)',
           COALESCE(NULLIF(sp.reference,''), sp.method, '-'),
           sp.status, sp.amount, -sp.amount
    FROM public.subscription_payments sp
    LEFT JOIN public.subscription_plans pl ON pl.id = sp.plan_id
    WHERE sp.reseller_id = _reseller_id AND sp.source = 'earning' AND sp.status = 'paid'
  ), ordered AS (
    SELECT ev.*, SUM(ev.delta) OVER (ORDER BY ev.at, ev.kind ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running
    FROM ev
  )
  SELECT ordered.at, ordered.kind, ordered.direction, ordered.label, ordered.reference,
         ordered.status, ordered.amount, ordered.running
  FROM ordered
  ORDER BY ordered.at DESC
  LIMIT GREATEST(_limit, 1);
END $function$;
