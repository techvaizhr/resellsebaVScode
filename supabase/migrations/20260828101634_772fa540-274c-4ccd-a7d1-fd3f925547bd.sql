INSERT INTO public.courier_configs (provider, display_name, is_active, config)
SELECT v.provider::courier_provider, v.name, false, '{}'::jsonb
FROM (VALUES ('steadfast','Steadfast Courier'),('pathao','Pathao Courier'),('carrybee','CarryBee')) AS v(provider,name)
WHERE NOT EXISTS (SELECT 1 FROM public.courier_configs c WHERE c.provider = v.provider::courier_provider);