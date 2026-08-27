CREATE POLICY "product_images_supplier_write" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images' AND public.current_supplier_id() IS NOT NULL
  AND (storage.foldername(name))[1] = 'suppliers'
  AND (storage.foldername(name))[2] = (public.current_supplier_id())::text);

CREATE POLICY "product_images_supplier_update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'product-images' AND public.current_supplier_id() IS NOT NULL
  AND (storage.foldername(name))[1] = 'suppliers'
  AND (storage.foldername(name))[2] = (public.current_supplier_id())::text)
WITH CHECK (bucket_id = 'product-images' AND public.current_supplier_id() IS NOT NULL
  AND (storage.foldername(name))[1] = 'suppliers'
  AND (storage.foldername(name))[2] = (public.current_supplier_id())::text);

CREATE POLICY "product_images_supplier_delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'product-images' AND public.current_supplier_id() IS NOT NULL
  AND (storage.foldername(name))[1] = 'suppliers'
  AND (storage.foldername(name))[2] = (public.current_supplier_id())::text);