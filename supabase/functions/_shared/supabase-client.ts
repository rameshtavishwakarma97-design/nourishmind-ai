/**
 * Supabase client factories for Edge Functions.
 * Provides both user-scoped (RLS) and admin (service role) clients.
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

/**
 * Create a Supabase client that runs as the authenticated user.
 * This client respects RLS policies — queries only return the user's own data.
 * 
 * @param req - The incoming request (must have Authorization header)
 */
export function createUserClient(req: Request): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const authHeader = req.headers.get('Authorization')!;

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: authHeader },
    },
  });
}

/**
 * Create an admin Supabase client using the service role key.
 * This client BYPASSES RLS — use only for:
 *   - Inserting into shared tables (usda_cache, ai_conversation_memory)
 *   - Cross-user operations (admin tasks)
 *   - Database function calls
 * 
 * NEVER expose this client or its results directly to the user without filtering.
 */
export function createAdminClient(): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  return createClient(supabaseUrl, serviceRoleKey);
}

/**
 * Extract the user ID from the request's JWT token via Supabase auth.
 * Returns null if the user is not authenticated.
 */
export async function getUserId(req: Request): Promise<string | null> {
  const client = createUserClient(req);
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return null;
  return user.id;
}
