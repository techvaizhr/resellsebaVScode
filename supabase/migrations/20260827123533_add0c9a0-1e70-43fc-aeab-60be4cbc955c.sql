-- 1. Per-item bookkeeping of how many units are currently deducted from product stock
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS stock_held integer NOT NULL DEFAULT 0;

-- 2. Target hold for an item, based on the order status
CREATE OR REPLACE FUNCTION public.order_item_target_hold(_status public.order_status, _qty integer, _returned integer)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE
    -- everything came back to the warehouse
    WHEN _status IN ('returned','cancelled','partial_delivery') THEN 0
    -- only the returned units came back
    WHEN _status IN ('partial','partial_item') THEN GREATEST(COALESCE(_qty,0) - GREATEST(COALESCE(_returned,0),0), 0)
    -- delivered / damaged / in-flight: units stay out of stock
    ELSE GREATEST(COALESCE(_qty,0), 0)
  END
$$;

-- 3. Sync one order item's hold with the target and move product stock by the difference
CREATE OR REPLACE FUNCTION public.sync_order_item_stock(_item_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  it RECORD;
  target integer;
  delta integer;
BEGIN
  SELECT oi.id, oi.product_id, oi.quantity, oi.returned_qty, oi.stock_held, o.status
    INTO it
    FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
   WHERE oi.id = _item_id;

  IF NOT FOUND OR it.product_id IS NULL THEN RETURN; END IF;

  target := public.order_item_target_hold(it.status, it.quantity, it.returned_qty);
  delta := target - COALESCE(it.stock_held, 0);
  IF delta = 0 THEN RETURN; END IF;

  UPDATE public.products SET stock = stock - delta, updated_at = now() WHERE id = it.product_id;
  UPDATE public.order_items SET stock_held = target WHERE id = it.id;
END
$$;

-- 4. Item-level trigger: insert / quantity or returned_qty change
CREATE OR REPLACE FUNCTION public.order_items_stock_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.sync_order_item_stock(NEW.id);
  RETURN NULL;
END
$$;

DROP TRIGGER IF EXISTS trg_order_items_stock ON public.order_items;
CREATE TRIGGER trg_order_items_stock
AFTER INSERT OR UPDATE OF quantity, returned_qty, product_id ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.order_items_stock_sync();

-- 5. Item removed (or order deleted → cascade): give held units back
CREATE OR REPLACE FUNCTION public.order_items_stock_release()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.product_id IS NOT NULL AND COALESCE(OLD.stock_held,0) <> 0 THEN
    UPDATE public.products SET stock = stock + OLD.stock_held, updated_at = now() WHERE id = OLD.product_id;
  END IF;
  RETURN OLD;
END
$$;

DROP TRIGGER IF EXISTS trg_order_items_stock_release ON public.order_items;
CREATE TRIGGER trg_order_items_stock_release
AFTER DELETE ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.order_items_stock_release();

-- 6. Order status change → re-sync every item (replaces the old one-way restore)
CREATE OR REPLACE FUNCTION public.restore_stock_on_return()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT id FROM public.order_items WHERE order_id = NEW.id LOOP
    PERFORM public.sync_order_item_stock(r.id);
  END LOOP;

  UPDATE public.orders
     SET stock_restored = NOT EXISTS (
           SELECT 1 FROM public.order_items oi WHERE oi.order_id = NEW.id AND COALESCE(oi.stock_held,0) > 0
         )
   WHERE id = NEW.id AND stock_restored IS DISTINCT FROM NOT EXISTS (
           SELECT 1 FROM public.order_items oi WHERE oi.order_id = NEW.id AND COALESCE(oi.stock_held,0) > 0
         );
  RETURN NULL;
END
$$;

DROP TRIGGER IF EXISTS trg_restore_stock_on_return ON public.orders;
CREATE TRIGGER trg_restore_stock_on_return
AFTER UPDATE OF status ON public.orders
FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION public.restore_stock_on_return();

-- 7. Public store checkout: refuse out-of-stock items
CREATE OR REPLACE FUNCTION public.create_public_order(
  _reseller_code text, _customer_name text, _customer_phone text, _customer_email text,
  _address_line text, _city text, _area public.delivery_area, _landmark text,
  _payment_method public.payment_method, _notes text, _items jsonb)
RETURNS TABLE(order_id uuid, order_number text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reseller RECORD;
  v_order_id UUID;
  v_order_number TEXT;
  v_subtotal NUMERIC(12,2) := 0;
  v_sa_cost NUMERIC(12,2) := 0;
  v_ship NUMERIC(12,2) := 0;
  v_item_ship NUMERIC(12,2);
  v_profit NUMERIC(12,2) := 0;
  v_item JSONB;
  v_listing RECORD;
  v_qty INT;
  v_line NUMERIC(12,2);
  v_sa_line NUMERIC(12,2);
BEGIN
  IF _customer_name IS NULL OR length(trim(_customer_name)) < 2 THEN RAISE EXCEPTION 'Invalid name'; END IF;
  IF _customer_phone IS NULL OR length(trim(_customer_phone)) < 6 THEN RAISE EXCEPTION 'Invalid phone'; END IF;
  IF _address_line IS NULL OR length(trim(_address_line)) < 3 THEN RAISE EXCEPTION 'Invalid address'; END IF;
  IF _items IS NULL OR jsonb_array_length(_items) = 0 THEN RAISE EXCEPTION 'No items'; END IF;

  SELECT r.* INTO v_reseller FROM public.resellers r WHERE r.code = _reseller_code AND r.status = 'active' LIMIT 1;
  IF NOT FOUND THEN RAISE EXCEPTION 'Store not found'; END IF;

  INSERT INTO public.orders AS o (
    reseller_id, customer_name, customer_phone, customer_email, address_line, city, area, landmark,
    payment_method, notes, status
  ) VALUES (
    v_reseller.id, trim(_customer_name), trim(_customer_phone), _customer_email, trim(_address_line),
    _city, _area, _landmark, _payment_method, _notes, 'pending'
  ) RETURNING o.id, o.order_number INTO v_order_id, v_order_number;

  FOR v_item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    v_qty := GREATEST(1, COALESCE((v_item->>'quantity')::int, 1));
    SELECT l.*, p.name AS product_name, p.reseller_price, p.packaging_cost, p.stock,
           p.delivery_inside, p.delivery_outside, p.delivery_sub, p.delivery_mode, p.delivery_flat, p.og_image_url
      INTO v_listing
      FROM public.reseller_listings l
      JOIN public.products p ON p.id = l.product_id
      WHERE l.id = (v_item->>'listing_id')::uuid
        AND l.reseller_id = v_reseller.id
        AND l.is_active = true
        AND p.is_active = true;
    IF NOT FOUND THEN RAISE EXCEPTION 'Listing unavailable'; END IF;
    IF COALESCE(v_listing.stock, 0) < v_qty THEN
      RAISE EXCEPTION 'Out of stock: %', v_listing.product_name;
    END IF;

    v_line := v_listing.selling_price * v_qty;
    v_sa_line := (v_listing.reseller_price + v_listing.packaging_cost) * v_qty;
    v_subtotal := v_subtotal + v_line;
    v_sa_cost := v_sa_cost + v_sa_line;

    v_item_ship := public.resolve_delivery_charge_for(
      v_listing.product_id, v_listing.delivery_mode, v_listing.delivery_flat, v_listing.delivery_inside,
      v_listing.delivery_outside, v_listing.delivery_sub, _area::text);

    IF v_item_ship > 0 THEN
      v_item_ship := v_item_ship + CASE WHEN _area = 'inside_dhaka'
        THEN COALESCE(v_listing.extra_delivery_inside, 0)
        ELSE COALESCE(v_listing.extra_delivery_outside, 0) END;
    END IF;

    IF v_item_ship > v_ship THEN v_ship := v_item_ship; END IF;

    INSERT INTO public.order_items(
      order_id, listing_id, product_id, product_name, product_image, sku, quantity,
      sa_price, reseller_price, profit, line_total
    ) VALUES (
      v_order_id, v_listing.id, v_listing.product_id, v_listing.product_name, v_listing.og_image_url, NULL, v_qty,
      v_listing.reseller_price + v_listing.packaging_cost, v_listing.selling_price,
      v_line - v_sa_line, v_line
    );
  END LOOP;

  v_profit := v_subtotal - v_sa_cost;

  UPDATE public.orders o
     SET subtotal = v_subtotal,
         shipping_cost = v_ship,
         total = v_subtotal + v_ship,
         sa_cost_total = v_sa_cost,
         reseller_profit = v_profit
   WHERE o.id = v_order_id;

  RETURN QUERY SELECT v_order_id, v_order_number;
END
$$;