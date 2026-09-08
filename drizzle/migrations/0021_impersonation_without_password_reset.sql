create or replace function public.admin_impersonation_begin(_user_id uuid, _password text)
returns table(email text, prev_hash text)
language plpgsql
security definer
set search_path to 'public'
as $$
declare v_email text; v_hash text;
begin
  perform public.assert_admin_permission(array['staff.manage','resellers.manage','resellers.impersonate','suppliers.manage','products.manage']);
  if _password is null or length(_password) < 12 then
    raise exception 'Temporary password too weak';
  end if;
  select u.email::text, u.encrypted_password into v_email, v_hash
  from auth.users u where u.id = _user_id;
  if v_email is null and v_hash is null then
    raise exception 'Account not found';
  end if;
  if v_email is null or v_email = '' then
    raise exception 'This account has no login email';
  end if;
  update auth.users
     set encrypted_password = extensions.crypt(_password, extensions.gen_salt('bf')),
         email_confirmed_at = coalesce(email_confirmed_at, now()),
         updated_at = now()
   where id = _user_id;
  return query select v_email, v_hash;
end;
$$;

create or replace function public.admin_impersonation_finish(_user_id uuid, _prev_hash text)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  perform public.assert_admin_permission(array['staff.manage','resellers.manage','resellers.impersonate','suppliers.manage','products.manage']);
  update auth.users set encrypted_password = _prev_hash, updated_at = now() where id = _user_id;
end;
$$;

revoke all on function public.admin_impersonation_begin(uuid, text) from public, anon;
revoke all on function public.admin_impersonation_finish(uuid, text) from public, anon;
grant execute on function public.admin_impersonation_begin(uuid, text) to authenticated, service_role;
grant execute on function public.admin_impersonation_finish(uuid, text) to authenticated, service_role;