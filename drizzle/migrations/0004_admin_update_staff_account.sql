create or replace function public.admin_update_staff_account(
  _user_id uuid,
  _email text,
  _full_name text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(coalesce(_email, '')));
begin
  perform public.assert_admin_permission(array['staff.manage','resellers.manage']);

  if v_email = '' then
    raise exception 'Email is required';
  end if;

  if exists (select 1 from auth.users u where lower(u.email) = v_email and u.id <> _user_id) then
    raise exception 'This email is already registered';
  end if;

  update auth.users
     set email = v_email,
         raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
           || jsonb_build_object('full_name', coalesce(_full_name, '')),
         updated_at = now()
   where id = _user_id;

  if not found then
    raise exception 'User not found';
  end if;

  update auth.identities
     set identity_data = coalesce(identity_data, '{}'::jsonb)
       || jsonb_build_object('email', v_email),
         updated_at = now()
   where user_id = _user_id and provider = 'email';

  update public.profiles
     set full_name = coalesce(nullif(trim(coalesce(_full_name, '')), ''), full_name)
   where id = _user_id;
end;
$$;

revoke all on function public.admin_update_staff_account(uuid, text, text) from public;
grant execute on function public.admin_update_staff_account(uuid, text, text) to authenticated;
grant execute on function public.admin_update_staff_account(uuid, text, text) to service_role;
