import { useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentUserId } from '@/lib/supabase/client';

export interface MenstrualCycle {
  id: string;
  user_id: string;
  last_period_start: string;
  cycle_length_days: number;
  period_duration_days: number;
  tracking_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export function useCycleTracking() {
  const [cycle, setCycle] = useState<MenstrualCycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await getCurrentUserId();
      if (!userId) return;

      const { data, error: fetchErr } = await supabase
        .from('menstrual_cycles')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchErr) throw fetchErr;
      setCycle(data as MenstrualCycle | null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cycle data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const upsert = useCallback(async (data: Partial<MenstrualCycle>) => {
    try {
      setSaving(true);
      setError(null);
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('Not authenticated');

      if (cycle?.id) {
        const { data: updated, error: updateErr } = await supabase
          .from('menstrual_cycles')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', cycle.id)
          .select()
          .single();

        if (updateErr) throw updateErr;
        setCycle(updated as MenstrualCycle);
      } else {
        const { data: created, error: createErr } = await supabase
          .from('menstrual_cycles')
          .insert({
            user_id: userId,
            last_period_start: data.last_period_start || new Date().toISOString().split('T')[0],
            cycle_length_days: data.cycle_length_days ?? 28,
            period_duration_days: data.period_duration_days ?? 5,
            tracking_enabled: data.tracking_enabled ?? true,
          })
          .select()
          .single();

        if (createErr) throw createErr;
        setCycle(created as MenstrualCycle);
      }

      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save cycle data';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSaving(false);
    }
  }, [cycle]);

  const getCurrentPhase = () => {
    if (!cycle?.tracking_enabled || !cycle?.last_period_start) return null;

    const start = new Date(cycle.last_period_start);
    const today = new Date();
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const dayInCycle = (diff % cycle.cycle_length_days + cycle.cycle_length_days) % cycle.cycle_length_days + 1;

    if (dayInCycle <= cycle.period_duration_days) {
      return { phase: 'Menstrual', day: dayInCycle, daysUntilNext: cycle.period_duration_days - dayInCycle + 1 };
    }
    if (dayInCycle <= 13) {
      return { phase: 'Follicular', day: dayInCycle, daysUntilNext: 14 - dayInCycle };
    }
    if (dayInCycle <= 16) {
      return { phase: 'Ovulation', day: dayInCycle, daysUntilNext: 17 - dayInCycle };
    }
    return { phase: 'Luteal', day: dayInCycle, daysUntilNext: cycle.cycle_length_days - dayInCycle + 1 };
  };

  return { cycle, loading, saving, error, upsert, getCurrentPhase, refresh: fetch };
}
