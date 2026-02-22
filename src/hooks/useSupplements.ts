import { useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentUserId } from '@/lib/supabase/client';

export interface Supplement {
  id: string;
  user_id: string;
  name: string;
  type: 'supplement' | 'medication' | 'ayurvedic';
  dose_amount: number | null;
  dose_unit: string | null;
  frequency: string | null;
  time_of_day: string | null;
  with_food: boolean;
  is_active: boolean;
  created_at: string;
}

export function useSupplements() {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await getCurrentUserId();
      if (!userId) return;

      const { data, error: fetchErr } = await supabase
        .from('supplements_medications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setSupplements((data as Supplement[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load supplements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add = useCallback(async (item: Omit<Supplement, 'id' | 'user_id' | 'created_at' | 'is_active'>) => {
    try {
      setSaving(true);
      setError(null);
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('Not authenticated');

      const { data, error: insertErr } = await supabase
        .from('supplements_medications')
        .insert({ user_id: userId, ...item, is_active: true })
        .select()
        .single();

      if (insertErr) throw insertErr;
      setSupplements(prev => [data as Supplement, ...prev]);
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to add supplement';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSaving(false);
    }
  }, []);

  const update = useCallback(async (id: string, updates: Partial<Supplement>) => {
    try {
      setSaving(true);
      setError(null);
      const { error: updateErr } = await supabase
        .from('supplements_medications')
        .update(updates)
        .eq('id', id);

      if (updateErr) throw updateErr;
      setSupplements(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update';
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
        .from('supplements_medications')
        .update({ is_active: false })
        .eq('id', id);

      if (delErr) throw delErr;
      setSupplements(prev => prev.filter(s => s.id !== id));
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to remove';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSaving(false);
    }
  }, []);

  return { supplements, loading, saving, error, add, update, remove, refresh: fetch };
}
