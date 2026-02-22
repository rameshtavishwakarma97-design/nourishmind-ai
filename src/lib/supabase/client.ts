/**
 * Supabase Browser Client
 * 
 * Creates a singleton Supabase client for use in the React frontend.
 * Uses the anon key (safe for client-side) — all data access is protected by RLS.
 * 
 * Usage:
 *   import { supabase } from '@/lib/supabase/client';
 *   const { data, error } = await supabase.from('user_profiles').select('*');
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Helper: invoke a Supabase Edge Function with typed request/response.
 * Automatically passes the current user's auth token.
 */
export async function invokeFunction<TRequest, TResponse>(
  functionName: string,
  body: TRequest
): Promise<{ data: TResponse | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: body as Record<string, unknown>,
    });

    if (error) {
      console.error(`Edge Function "${functionName}" error:`, error);
      // Try to extract detailed error from response context
      let msg = error.message || 'Edge function call failed';
      try {
        if ('context' in error && (error as any).context?.json) {
          const body = await (error as any).context.json();
          if (body?.error) msg = body.error;
        }
      } catch { /* ignore parse errors */ }
      return { data: null, error: new Error(msg) };
    }

    return { data: data as TResponse, error: null };
  } catch (err) {
    console.error(`Edge Function "${functionName}" exception:`, err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

/**
 * Helper: get the current authenticated user's ID.
 * Returns null if not authenticated.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * Helper: get the current session.
 */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
