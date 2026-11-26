import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, key };
}

/**
 * Browser-side Supabase client configured with @supabase/ssr cookies.
 * Returns null gracefully if Supabase env vars are missing.
 */
export function createClient(): SupabaseClient | null {
  const { url, key } = getSupabaseEnv();
  if (!url || !key) return null;

  if (!browserClient) {
    browserClient = createBrowserClient(url, key);
  }
  return browserClient;
}
