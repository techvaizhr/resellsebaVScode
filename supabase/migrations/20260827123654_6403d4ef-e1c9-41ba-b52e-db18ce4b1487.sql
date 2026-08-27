REVOKE ALL ON FUNCTION public.order_item_target_hold(public.order_status, integer, integer) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_order_item_stock(uuid) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.order_items_stock_sync() FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.order_items_stock_release() FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.restore_stock_on_return() FROM public, anon, authenticated;