import { useState, useEffect, useCallback } from 'react';
import { supabase, invokeFunction, getCurrentUserId } from '@/lib/supabase/client';

interface DailyLog {
  id: string;
  log_date: string;
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  total_fiber_g: number;
  water_ml: number;
  mood_score: number | null;
}

interface WellnessScore {
  overall: number;
  nutrition: { score: number; details: string };
  consistency: { score: number; details: string };
  hydration: { score: number; details: string };
  lifestyle: { score: number; details: string };
  gutHealth: { score: number; details: string };
  trend: 'improving' | 'stable' | 'declining';
  trendPercent: number;
}

export function useDashboard() {
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [weeklyLogs, setWeeklyLogs] = useState<DailyLog[]>([]);
  const [wellnessScore, setWellnessScore] = useState<WellnessScore | null>(null);
  const [calorieTarget, setCalorieTarget] = useState<number>(2000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = await getCurrentUserId();
      if (!userId) return;

      const today = new Date().toISOString().split('T')[0];
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

      // Fetch today's log and weekly logs in parallel
      const [todayRes, weekRes, profileRes] = await Promise.all([
        supabase.from('daily_logs').select('*').eq('user_id', userId).eq('log_date', today).single(),
        supabase.from('daily_logs').select('*').eq('user_id', userId)
          .gte('log_date', sevenDaysAgo).order('log_date', { ascending: false }),
        supabase.from('user_profiles').select('weight_kg, height_cm, age, biological_sex, primary_goal').eq('id', userId).single(),
      ]);

      setTodayLog(todayRes.data as DailyLog ?? null);
      setWeeklyLogs((weekRes.data as DailyLog[]) ?? []);

      // Calculate calorie target from profile using Mifflin-St Jeor
      if (profileRes.data) {
        const p = profileRes.data;
        const weight = p.weight_kg ?? 65;
        const height = p.height_cm ?? 165;
        const age = p.age ?? 25;
        const sex = p.biological_sex ?? 'not_specified';
        let bmr: number;
        if (sex === 'male') {
          bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else if (sex === 'female') {
          bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        } else {
          bmr = 10 * weight + 6.25 * height - 5 * age - 78;
        }
        let tdee = bmr * 1.375; // lightly active default
        switch (p.primary_goal) {
          case 'weight_loss': tdee *= 0.85; break;
          case 'muscle_gain': tdee *= 1.10; break;
        }
        setCalorieTarget(Math.round(tdee));
      }

      // Fetch wellness score from Edge Function
      try {
        const { data: wellness } = await invokeFunction<Record<string, never>, WellnessScore>('dashboard-wellness', {});
        if (wellness) setWellnessScore(wellness);
      } catch {
        // Non-critical — wellness score might not be available yet
        console.warn('Wellness score unavailable');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Computed values
  const caloriesRemaining = todayLog
    ? Math.max(0, calorieTarget - (todayLog.total_calories || 0))
    : null;

  const proteinProgress = todayLog ? (todayLog.total_protein_g || 0) : 0;
  const waterProgress = todayLog ? (todayLog.water_ml || 0) : 0;

  return {
    todayLog,
    weeklyLogs,
    wellnessScore,
    loading,
    error,
    caloriesRemaining,
    calorieTarget,
    proteinProgress,
    waterProgress,
    refresh: fetchDashboardData,
  };
}
