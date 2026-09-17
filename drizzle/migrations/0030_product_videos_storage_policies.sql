CREATE POLICY "product_videos_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'product-videos');

CREATE POLICY "Staff upload product videos by permission" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-videos' AND has_permission(auth.uid(), 'products.manage'));

CREATE POLICY "Staff update product videos by permission" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-videos' AND has_permission(auth.uid(), 'products.manage'))
  WITH CHECK (bucket_id = 'product-videos' AND has_permission(auth.uid(), 'products.manage'));

CREATE POLICY "Staff delete product videos by permission" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-videos' AND has_permission(auth.uid(), 'products.manage'));
