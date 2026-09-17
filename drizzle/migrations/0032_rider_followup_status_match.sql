CREATE OR REPLACE FUNCTION public.rider_followup_orders()
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_rows jsonb;
  v_is_admin boolean;
  v_reseller uuid;
  v_supplier uuid;
begin
  v_is_admin := public.has_role(auth.uid(), 'super_admin') or public.has_role(auth.uid(), 'staff');
  v_reseller := public.current_reseller_id();
  v_supplier := public.current_supplier_id();

  if not v_is_admin and v_reseller is null and v_supplier is null then
    raise exception 'not authorized';
  end if;

  select coalesce(jsonb_agg(to_jsonb(t) order by t.rider_assigned_at nulls last), '[]'::jsonb)
    into v_rows
  from (
    select o.id as order_id,
           o.order_number,
           o.customer_name,
           o.customer_phone,
           o.city,
           o.area::text as area,
           o.status::text as status,
           o.total,
           o.advance_amount,
           case when o.payment_method = 'cod'
                then greatest(o.total - coalesce(o.advance_amount, 0), 0)
                else 0 end as cod_amount,
           r.business_name as reseller_name,
           r.code as reseller_code,
           s.provider::text as provider,
           s.consignment_id,
           s.tracking_id,
           s.tracking_url,
           s.courier_status,
           coalesce(s.rider_assigned_at, s.last_event_at, s.updated_at) as rider_assigned_at,
           s.last_event_at
    from public.shipments s
    join public.orders o on o.id = s.order_id
    left join public.resellers r on r.id = o.reseller_id
    where regexp_replace(lower(trim(coalesce(s.courier_status, ''))), '[^a-z0-9]+', '-', 'g') in
            ('assigned-for-delivery', 'assigned-to-rider', 'ready-for-delivery',
             'out-for-delivery', 'rider-assigned', 'on-delivery', 'delivery-in-progress',
             'delivering', 'in-delivery', 'agent-assigned')
      and o.status::text not in ('delivered', 'cancelled', 'returned', 'partial', 'partial_full', 'partial_item', 'partial_delivery', 'damaged')
      and (
        v_is_admin
        or (v_reseller is not null and o.reseller_id = v_reseller)
        or (v_supplier is not null and exists (
              select 1 from public.order_items oi
              where oi.order_id = o.id and oi.supplier_id = v_supplier))
      )
  ) t;

  return jsonb_build_object('orders', v_rows, 'now', now());
end;
$function$;

GRANT EXECUTE ON FUNCTION public.rider_followup_orders() TO authenticated;