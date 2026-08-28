-- Suppliers can see and write notes on orders that contain their products.
CREATE OR REPLACE FUNCTION public.supplier_can_note(_order_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.current_supplier_id() IS NOT NULL
     AND EXISTS (
       SELECT 1 FROM public.order_items oi
       WHERE oi.order_id = _order_id
         AND oi.supplier_id = public.current_supplier_id()
     );
$$;

CREATE OR REPLACE FUNCTION public.order_visible_to_me(_order_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = _order_id
      AND (
        o.reseller_id = public.current_reseller_id()
        OR public.is_super_admin(auth.uid())
        OR public.has_any_permission(auth.uid(), ARRAY['orders.view','orders.edit','orders.create','orders.delete'])
      )
  )
  OR public.supplier_can_note(_order_id)
$$;

DROP POLICY IF EXISTS "Staff write notes" ON public.order_notes;
CREATE POLICY "Staff write notes" ON public.order_notes
FOR INSERT TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND (
    is_super_admin(auth.uid())
    OR has_any_permission(auth.uid(), ARRAY['orders.edit','orders.create'])
    OR reseller_can_note(order_id)
    OR supplier_can_note(order_id)
  )
);

DROP POLICY IF EXISTS "Staff update notes" ON public.order_notes;
CREATE POLICY "Staff update notes" ON public.order_notes
FOR UPDATE TO authenticated
USING (
  is_super_admin(auth.uid())
  OR has_any_permission(auth.uid(), ARRAY['orders.edit'])
  OR (author_id = auth.uid() AND (reseller_can_note(order_id) OR supplier_can_note(order_id)))
)
WITH CHECK (
  is_super_admin(auth.uid())
  OR has_any_permission(auth.uid(), ARRAY['orders.edit'])
  OR (author_id = auth.uid() AND (reseller_can_note(order_id) OR supplier_can_note(order_id)))
);

DROP POLICY IF EXISTS "Staff delete notes" ON public.order_notes;
CREATE POLICY "Staff delete notes" ON public.order_notes
FOR DELETE TO authenticated
USING (
  is_super_admin(auth.uid())
  OR has_any_permission(auth.uid(), ARRAY['orders.edit','orders.delete'])
  OR (author_id = auth.uid() AND (reseller_can_note(order_id) OR supplier_can_note(order_id)))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_notes TO authenticated;
