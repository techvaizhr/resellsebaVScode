CREATE OR REPLACE FUNCTION public.supplier_bootstrap()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE sid uuid := public.current_supplier_id();
BEGIN
  IF sid IS NULL THEN RETURN jsonb_build_object('supplier', NULL); END IF;
  RETURN COALESCE(public.supplier_report(sid, NULL, NULL), jsonb_build_object('supplier', NULL))
    || jsonb_build_object(
      'settings', (SELECT jsonb_build_object('site_name', g.site_name, 'logo_url', g.logo_url,
                                             'primary_color', g.primary_color, 'accent_color', g.accent_color)
                   FROM public.global_settings g WHERE g.id = 1),
      'verify', (SELECT to_jsonb(v) FROM public.verify_state() v),
      'brands', COALESCE((SELECT jsonb_agg(jsonb_build_object('id', b.id, 'name', b.name) ORDER BY b.name)
                          FROM public.brands b), '[]'::jsonb),
      'categories', COALESCE((SELECT jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name) ORDER BY c.name)
                              FROM public.categories c), '[]'::jsonb)
    );
END $function$;