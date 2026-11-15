import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let serverClient: SupabaseClient | null = null;

/**
 * Returns a singleton server-side Supabase client initialized with the modern Secret API Key.
 *
 * Requirements:
 * - Operates exclusively on the server (enforced by 'server-only').
 * - Auth persistence and session refresh are disabled for serverless execution.
 * - Fails safely if credentials are not configured in environment variables.
 * - Never logs credentials or exposes secret keys.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (serverClient) {
    return serverClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return null;
  }

  serverClient = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return serverClient;
}
