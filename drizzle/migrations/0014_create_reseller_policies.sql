CREATE TABLE public.reseller_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  points jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reseller_policies TO authenticated;
GRANT ALL ON public.reseller_policies TO service_role;

ALTER TABLE public.reseller_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage policies" ON public.reseller_policies
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Users read active policies" ON public.reseller_policies
  FOR SELECT TO authenticated
  USING (is_active);

CREATE INDEX reseller_policies_sort_idx ON public.reseller_policies (sort_order, created_at);