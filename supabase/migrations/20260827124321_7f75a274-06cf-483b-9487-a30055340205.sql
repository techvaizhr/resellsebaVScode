create or replace function public.lock_order_status_after_courier()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
BEGIN
  IF auth.uid() IS NULL
     OR coalesce(current_setting('app.supplier_status_update', true), '') = 'on'
     OR public.is_super_admin(auth.uid())
     OR public.has_permission(auth.uid(), 'orders.edit')
     OR public.has_permission(auth.uid(), 'couriers.manage') THEN
    RETURN NEW;
  END IF;

  IF OLD.status NOT IN ('draft','pending','forwarded') THEN
    RAISE EXCEPTION 'Admin order ti confirm kore felecche — ekhon shudhu admin staff change korte parbe';
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status
     AND NEW.status NOT IN ('pending','forwarded','cancelled') THEN
    RAISE EXCEPTION 'Reseller shudhu order admin ke pathate ba cancel korte parbe';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.shipments s
    WHERE s.order_id = NEW.id
      AND (s.consignment_id IS NOT NULL OR s.tracking_id IS NOT NULL)
  ) THEN
    RAISE EXCEPTION 'Order courier e chole gese — status only authorized admin staff change korte parbe';
  END IF;
  RETURN NEW;
END $$;

create or replace function public.supplier_set_order_status(_order uuid, _status text)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  sid uuid := public.current_supplier_id();
  cur text;
begin
  if sid is null then raise exception 'Not a supplier'; end if;
  if not exists (select 1 from public.order_items oi where oi.order_id = _order and oi.supplier_id = sid) then
    raise exception 'Not allowed';
  end if;
  select o.status::text into cur from public.orders o where o.id = _order;
  if cur is null then raise exception 'Order not found'; end if;

  if not (
      (cur in ('pending', 'forwarded') and _status = 'confirmed')
   or (cur = 'confirmed' and _status = 'packaging')
   or (cur = 'packaging' and _status = 'ready_to_ship')
  ) then
    raise exception 'Status change not allowed';
  end if;

  perform set_config('app.supplier_status_update', 'on', true);
  update public.orders set status = _status::order_status, updated_at = now() where id = _order;
  insert into public.order_status_history(order_id, status, note, changed_by)
  values (_order, _status::order_status, 'Supplier update', auth.uid());
  perform set_config('app.supplier_status_update', 'off', true);
end $$;

grant execute on function public.supplier_set_order_status(uuid, text) to authenticated;