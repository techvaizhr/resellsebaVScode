CREATE OR REPLACE FUNCTION public.pathao_webhook_handshake_secret()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NULLIF(BTRIM(config->>'integration_secret'), '')
  FROM public.courier_configs
  WHERE provider = 'pathao'
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.pathao_webhook_handshake_secret() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.pathao_webhook_handshake_secret() TO anon, authenticated, service_role;