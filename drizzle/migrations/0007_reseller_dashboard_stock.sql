CREATE OR REPLACE FUNCTION public.reseller_dashboard(_from timestamp with time zone DEFAULT NULL::timestamp with time zone, _to timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_rid uuid;
  v_reseller jsonb;
  v_orders jsonb;
  v_items jsonb;
  v_payouts jsonb;
  v_comm jsonb;
  v_summary jsonb;
  v_listings jsonb;
  v_products jsonb;
  v_total int;
  v_active int;
begin
  v_rid := public.current_reseller_id();
  if v_rid is null then
    return jsonb_build_object('reseller', null);
  end if;

  select to_jsonb(r) into v_reseller from resellers r where r.id = v_rid;

  select coalesce(jsonb_agg(to_jsonb(o)), '[]'::jsonb) into v_orders
  from (
    select id, order_number, reseller_id, status, created_at, subtotal, shipping_cost, discount,
           total, sa_cost_total, reseller_profit, received_amount, packaging_total, delivery_cost,
           advance_amount, advance_by
    from orders
    where reseller_id = v_rid
      and (_from is null or created_at >= _from)
      and (_to is null or created_at <= _to)
    order by created_at desc
    limit 5000
  ) o;

  select coalesce(jsonb_agg(to_jsonb(i)), '[]'::jsonb) into v_items
  from (
    select oi.order_id, oi.product_id, oi.product_name, oi.quantity, oi.sa_price,
           oi.reseller_price, oi.line_total, oi.profit
    from order_items oi
    join orders o on o.id = oi.order_id
    where o.reseller_id = v_rid
      and (_from is null or o.created_at >= _from)
      and (_to is null or o.created_at <= _to)
  ) i;

  select coalesce(jsonb_agg(jsonb_build_object('amount', p.amount, 'status', p.status, 'created_at', p.created_at)), '[]'::jsonb)
    into v_payouts from payouts p where p.reseller_id = v_rid;

  select coalesce(jsonb_agg(jsonb_build_object('amount', c.amount, 'status', c.status, 'created_at', c.created_at)), '[]'::jsonb)
    into v_comm from leader_commissions c where c.leader_id = v_rid;

  select to_jsonb(s) into v_summary from public.reseller_profit_summary(v_rid) s limit 1;

  select count(*), count(*) filter (where is_active) into v_total, v_active
  from reseller_listings where reseller_id = v_rid;

  select coalesce(jsonb_agg(jsonb_build_object(
      'id', l.id,
      'selling_price', l.selling_price,
      'products', jsonb_build_object(
        'id', p.id, 'brand_id', p.brand_id, 'category_id', p.category_id, 'name', p.name,
        'product_code', p.product_code, 'reseller_price', p.reseller_price,
        'packaging_cost', p.packaging_cost, 'delivery_inside', p.delivery_inside,
        'delivery_outside', p.delivery_outside, 'delivery_mode', p.delivery_mode,
        'delivery_flat', p.delivery_flat, 'og_image_url', p.og_image_url,
        'stock', p.stock)
    )), '[]'::jsonb)
    into v_listings
  from reseller_listings l
  join products p on p.id = l.product_id
  where l.reseller_id = v_rid and l.is_active;

  select coalesce(jsonb_agg(to_jsonb(p)), '[]'::jsonb) into v_products
  from (
    select id, brand_id, category_id, name, slug, product_code, reseller_price, packaging_cost,
           delivery_inside, delivery_outside, delivery_mode, delivery_flat, og_image_url,
           suggested_price, stock, created_at
    from products where is_active
    order by created_at desc
  ) p;

  return jsonb_build_object(
    'reseller', v_reseller,
    'orders', v_orders,
    'items', v_items,
    'payouts', v_payouts,
    'commissions', v_comm,
    'summary', v_summary,
    'listings', v_listings,
    'listings_total', v_total,
    'listings_active', v_active,
    'products', v_products
  );
end;
$function$;