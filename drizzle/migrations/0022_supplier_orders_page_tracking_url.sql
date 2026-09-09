CREATE OR REPLACE FUNCTION public.supplier_orders_page(_status text DEFAULT NULL::text, _q text DEFAULT NULL::text, _limit integer DEFAULT 300)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  sid uuid := public.current_supplier_id();
  res jsonb;
begin
  if sid is null then
    return jsonb_build_object('orders', '[]'::jsonb, 'counts', '{}'::jsonb);
  end if;

  with mine as (
    select oi.order_id,
           sum(oi.quantity)::int as qty,
           sum(oi.quantity * coalesce(oi.buying_price, 0))::numeric as amount,
           jsonb_agg(jsonb_build_object(
             'id', oi.id,
             'product_name', oi.product_name,
             'product_image', oi.product_image,
             'quantity', oi.quantity,
             'returned_qty', coalesce(oi.returned_qty, 0),
             'unit_price', coalesce(oi.buying_price, 0),
             'line_total', oi.quantity * coalesce(oi.buying_price, 0)
           ) order by oi.created_at) as items
    from public.order_items oi
    where oi.supplier_id = sid
    group by oi.order_id
  ),
  base as (
    select o.id, o.order_number, o.status, o.created_at, o.updated_at,
           o.customer_name, o.customer_phone, o.address_line, o.city, o.area,
           o.payment_method, m.qty, m.amount, m.items
    from public.orders o
    join mine m on m.order_id = o.id
    where o.status not in ('draft', 'pending', 'forwarded')
  ),
  sel as (
    select * from base b
    where (_status is null or _status = '' or b.status::text = _status)
      and (
        _q is null or _q = ''
        or b.order_number ilike '%' || _q || '%'
        or b.customer_phone ilike '%' || _q || '%'
        or b.customer_name ilike '%' || _q || '%'
      )
    order by b.created_at desc
    limit greatest(coalesce(_limit, 300), 1)
  )
  select jsonb_build_object(
    'counts', coalesce((select jsonb_object_agg(s, c) from (select b.status::text as s, count(*) as c from base b group by 1) t), '{}'::jsonb),
    'orders', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id,
        'order_number', s.order_number,
        'status', s.status,
        'created_at', s.created_at,
        'updated_at', s.updated_at,
        'customer_name', s.customer_name,
        'customer_phone', s.customer_phone,
        'address_line', s.address_line,
        'city', s.city,
        'area', s.area,
        'payment_method', s.payment_method,
        'my_qty', s.qty,
        'my_amount', s.amount,
        'items', s.items,
        'shipment', (
          select jsonb_build_object(
            'provider', sh.provider,
            'tracking_id', sh.tracking_id,
            'consignment_id', sh.consignment_id,
            'tracking_url', sh.tracking_url,
            'status', sh.status,
            'courier_status', sh.courier_status,
            'booked_at', sh.booked_at
          )
          from public.shipments sh where sh.order_id = s.id order by sh.created_at desc limit 1
        )
      ) order by s.created_at desc)
      from sel s
    ), '[]'::jsonb)
  ) into res;

  return res;
end $function$;