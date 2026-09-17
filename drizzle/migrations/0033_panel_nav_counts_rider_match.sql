create or replace function public.panel_nav_counts()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_is_admin boolean;
  v_reseller uuid;
  v_supplier uuid;
  v_orders integer := 0;
  v_rider integer := 0;
  v_payouts integer := 0;
begin
  if auth.uid() is null then
    return jsonb_build_object('orders', 0, 'rider', 0, 'payouts', 0);
  end if;

  v_is_admin := public.is_super_admin(auth.uid()) or public.has_role(auth.uid(), 'staff');
  v_reseller := public.current_reseller_id();
  v_supplier := public.current_supplier_id();

  v_orders := coalesce(public.order_nav_count(), 0);

  select count(distinct o.id)::integer into v_rider
  from public.shipments s
  join public.orders o on o.id = s.order_id
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
    );

  if v_is_admin then
    select count(*)::integer into v_payouts
    from public.payouts where status = 'pending';
  elsif v_reseller is not null then
    select count(*)::integer into v_payouts
    from public.payouts where reseller_id = v_reseller and status = 'pending';
  elsif v_supplier is not null then
    select count(*)::integer into v_payouts
    from public.supplier_payouts where supplier_id = v_supplier and status = 'pending';
  end if;

  return jsonb_build_object(
    'orders', coalesce(v_orders, 0),
    'rider', coalesce(v_rider, 0),
    'payouts', coalesce(v_payouts, 0)
  );
end;
$$;

grant execute on function public.panel_nav_counts() to authenticated;