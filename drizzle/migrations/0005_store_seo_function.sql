create or replace function public.store_seo(_code text, _slug text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path to 'public'
as $$
declare
  v_store public_stores%rowtype;
  v_product jsonb;
begin
  select * into v_store from public_stores where code = _code;
  if v_store.reseller_id is null then
    return jsonb_build_object('store', null);
  end if;

  if _slug is not null then
    select jsonb_build_object(
      'name', p.name,
      'slug', p.slug,
      'custom_title', l.custom_title,
      'custom_description', l.custom_description,
      'meta_title', l.meta_title,
      'meta_description', l.meta_description,
      'short_description', p.short_description,
      'description', p.description,
      'selling_price', l.selling_price,
      'image', (
        select i.url from product_images i
        where i.product_id = p.id
        order by i.is_primary desc nulls last, i.sort_order
        limit 1
      )
    )
    into v_product
    from reseller_listings l
    join products p on p.id = l.product_id and p.is_active
    where l.reseller_id = v_store.reseller_id and l.is_active and p.slug = _slug;
  end if;

  return jsonb_build_object(
    'store', jsonb_build_object(
      'code', v_store.code,
      'name', coalesce(v_store.store_name, v_store.business_name),
      'tagline', v_store.tagline,
      'meta_description', v_store.meta_description,
      'og_image_url', v_store.og_image_url,
      'hero_image_url', v_store.hero_image_url,
      'logo_url', v_store.logo_url
    ),
    'product', v_product
  );
end;
$$;

grant execute on function public.store_seo(text, text) to anon, authenticated, service_role;