import { db as supabase } from "@/integrations/laravel/client";

export function gatewayDatabase() {
  return supabase;
}