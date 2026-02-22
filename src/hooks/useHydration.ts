import { useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentUserId } from '@/lib/supabase/client';

interface HydrationLog {
  id: string;
  amount_ml: number;
  logged_at: string;
  log_date: string;
}

export function useHydration(date?: string) {
  const [logs, setLogs] = useState<HydrationLog[]>([]);
  const [targetFromProfile, setTargetFromProfile] = useState<number>(2500);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date || new Date().toISOString().split('T')[0];

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await getCurrentUserId();
      if (!userId) return;

      // Fetch hydration target from user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('hydration_target_ml')
        .eq('id', userId)
        .single();
      if (profileData?.hydration_target_ml) {
        setTargetFromProfile(profileData.hydration_target_ml);
      }

      const { data, error: fetchError } = await supabase
        .from('hydration_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('logged_at', `${targetDate}T00:00:00`)
        .lte('logged_at', `${targetDate}T23:59:59`)
        .order('logged_at', { ascending: true });

      if (fetchError) throw fetchError;
      setLogs((data as HydrationLog[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load hydration logs');
    } finally {
      setLoading(false);
    }
  }, [targetDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addWater = useCallback(async (amountMl: number) => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('Not authenticated');

      const { data, error: insertError } = await supabase
        .from('hydration_logs')
        .insert({
          user_id: userId,
          amount_ml: amountMl,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setLogs(prev => [...prev, data as HydrationLog]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to log water' };
    }
  }, []);

  const removeLog = useCallback(async (logId: string) => {
    try {
      const { error: delError } = await supabase
        .from('hydration_logs')
        .delete()
        .eq('id', logId);

      if (delError) throw delError;
      setLogs(prev => prev.filter(l => l.id !== logId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete' };
    }
  }, []);

  // Quick add presets
  const quickAdd = {
    glass: () => addWater(250),
    bottle: () => addWater(500),
    liter: () => addWater(1000),
    chai: () => addWater(150),
    coffee: () => addWater(150),
    buttermilk: () => addWater(200),
    coconutWater: () => addWater(300),
    juice: () => addWater(200),
  };

  // Computed
  const totalMl = logs.reduce((sum, l) => sum + l.amount_ml, 0);
  const glassesCount = Math.round(totalMl / 250); // 1 glass = 250ml
  const target = targetFromProfile;

  return {
    logs,
    totalMl,
    glassesCount,
    target,
    progressPercent: Math.min(Math.round((totalMl / target) * 100), 100),
    loading,
    error,
    addWater,
    removeLog,
    quickAdd,
    refresh: fetchLogs,
  };
}
