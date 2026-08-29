create or replace function public.admin_delete_supplier(_supplier_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid;
begin
  if not (public.is_super_admin(auth.uid()) or public.has_permission(auth.uid(), 'suppliers.manage')) then
    raise exception 'Not allowed';
  end if;

  delete from public.suppliers
  where id = _supplier_id
  returning user_id into _uid;

  if _uid is null then
    raise exception 'Supplier not found';
  end if;

  return _uid;
end;
$$;

revoke all on function public.admin_delete_supplier(uuid) from public, anon;
grant execute on function public.admin_delete_supplier(uuid) to authenticated;