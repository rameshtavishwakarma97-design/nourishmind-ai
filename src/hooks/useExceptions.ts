import { useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentUserId } from '@/lib/supabase/client';

export interface UserException {
  id: string;
  user_id: string;
  exception_type: string;
  original_value: string | null;
  modified_value: string | null;
  reason: string | null;
  is_permanent: boolean;
  created_at: string;
  expires_at: string | null;
}

export function useExceptions() {
  const [exceptions, setExceptions] = useState<UserException[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await getCurrentUserId();
      if (!userId) return;

      const { data, error: fetchErr } = await supabase
        .from('user_exceptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setExceptions((data as UserException[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exceptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add = useCallback(async (item: Omit<UserException, 'id' | 'user_id' | 'created_at'>) => {
    try {
      setSaving(true);
      setError(null);
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('Not authenticated');

      const { data, error: insertErr } = await supabase
        .from('user_exceptions')
        .insert({ user_id: userId, ...item })
        .select()
        .single();

      if (insertErr) throw insertErr;
      setExceptions(prev => [data as UserException, ...prev]);
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to add exception';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSaving(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    try {
      setSaving(true);
      const { error: delErr } = await supabase
        .from('user_exceptions')
        .delete()
        .eq('id', id);

      if (delErr) throw delErr;
      setExceptions(prev => prev.filter(e => e.id !== id));
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to remove exception';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSaving(false);
    }
  }, []);

  return { exceptions, loading, saving, error, add, remove, refresh: fetch };
}
