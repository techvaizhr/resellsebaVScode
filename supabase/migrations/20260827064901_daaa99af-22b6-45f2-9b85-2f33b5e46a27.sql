INSERT INTO public.global_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.brands (name, slug, sort_order) VALUES
  ('Aura', 'aura', 1),
  ('NovaTech', 'novatech', 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Gadgets', 'gadgets', 1),
  ('Lifestyle', 'lifestyle', 2),
  ('Beauty', 'beauty', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, sku, brand_id, category_id, short_description, description, buying_price, packaging_cost, reseller_price, suggested_price, stock, weight_grams, is_active, is_featured)
SELECT v.name, v.slug, v.sku,
       (SELECT id FROM public.brands WHERE slug = v.brand),
       (SELECT id FROM public.categories WHERE slug = v.cat),
       v.short_description, v.description,
       v.buying_price, v.packaging_cost, v.reseller_price, v.suggested_price, v.stock, v.weight, true, v.featured
FROM (VALUES
  ('Wireless Earbuds Pro', 'wireless-earbuds-pro', 'GAD-001', 'novatech', 'gadgets', 'ANC সহ ব্লুটুথ ৫.৩ ইয়ারবাডস', 'দীর্ঘ ব্যাটারি লাইফ, নয়েজ ক্যান্সেলেশন আর ক্রিস্টাল ক্লিয়ার কল কোয়ালিটি।', 950::numeric, 30::numeric, 1150::numeric, 1690::numeric, 50, 180, true),
  ('Smart Fitness Band', 'smart-fitness-band', 'GAD-002', 'novatech', 'gadgets', 'হার্ট রেট ও স্লিপ ট্র্যাকিং', 'AMOLED ডিসপ্লে, ওয়াটার রেজিস্ট্যান্ট, ৭ দিনের ব্যাটারি।', 780::numeric, 25::numeric, 950::numeric, 1390::numeric, 40, 90, true),
  ('Portable Power Bank 20000mAh', 'portable-power-bank-20000mah', 'GAD-003', 'novatech', 'gadgets', 'ফাস্ট চার্জিং পাওয়ার ব্যাংক', 'ডুয়াল আউটপুট, টাইপ-সি ইনপুট, LED ইন্ডিকেটর।', 1100::numeric, 40::numeric, 1350::numeric, 1890::numeric, 30, 420, false),
  ('Ceramic Coffee Mug Set', 'ceramic-coffee-mug-set', 'LIF-001', 'aura', 'lifestyle', '২ পিস প্রিমিয়াম সিরামিক মগ', 'মাইক্রোওয়েভ ও ডিশওয়াশার সেফ, গিফট বক্স সহ।', 420::numeric, 35::numeric, 560::numeric, 850::numeric, 60, 700, false),
  ('Organic Face Serum', 'organic-face-serum', 'BEA-001', 'aura', 'beauty', 'ভিটামিন সি ফেস সিরাম', 'ডেইলি ব্রাইটেনিং সিরাম, সব স্কিন টাইপের জন্য।', 520::numeric, 20::numeric, 690::numeric, 1050::numeric, 80, 60, true),
  ('Aroma Diffuser Mini', 'aroma-diffuser-mini', 'LIF-002', 'aura', 'lifestyle', 'USB অ্যারোমা ডিফিউজার', 'সফট LED লাইট সহ ২০০ml আল্ট্রাসনিক ডিফিউজার।', 640::numeric, 30::numeric, 820::numeric, 1250::numeric, 25, 350, false)
) AS v(name, slug, sku, brand, cat, short_description, description, buying_price, packaging_cost, reseller_price, suggested_price, stock, weight, featured)
WHERE NOT EXISTS (SELECT 1 FROM public.products p WHERE p.slug = v.slug);

INSERT INTO public.product_images (product_id, url, sort_order)
SELECT p.id, v.url, 0
FROM (VALUES
  ('wireless-earbuds-pro', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'),
  ('smart-fitness-band', 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80'),
  ('portable-power-bank-20000mah', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80'),
  ('ceramic-coffee-mug-set', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80'),
  ('organic-face-serum', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'),
  ('aroma-diffuser-mini', 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800&q=80')
) AS v(slug, url)
JOIN public.products p ON p.slug = v.slug
WHERE NOT EXISTS (SELECT 1 FROM public.product_images i WHERE i.product_id = p.id);