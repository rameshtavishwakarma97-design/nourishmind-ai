import { useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentUserId } from '@/lib/supabase/client';

interface WeeklyCalEntry {
  day: string;
  protein: number;
  carbs: number;
  fat: number;
  total: number;
}

interface MoodDataPoint {
  protein: number;
  mood: number;
  z: number;
}

interface ProteinTrendEntry {
  day: string;
  protein: number;
}

interface WeeklySummary {
  weekLabel: string;
  proteinGoalDays: number;
  bestDay: string;
  avgMagnesiumPct: number;
  longestFast: string;
  totalDaysLogged: number;
}

export function useInsights() {
  const [weeklyCalData, setWeeklyCalData] = useState<WeeklyCalEntry[]>([]);
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([]);
  const [proteinTrendData, setProteinTrendData] = useState<ProteinTrendEntry[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [proteinAvg, setProteinAvg] = useState(0);
  const [proteinGoal, setProteinGoal] = useState(150);
  const [loading, setLoading] = useState(true);
  const [daysLogged, setDaysLogged] = useState(0);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await getCurrentUserId();
      if (!userId) return;

      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 86400000);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
      const todayStr = today.toISOString().split('T')[0];

      // Get the week start and end for the label
      const weekStart = new Date(sevenDaysAgo);
      const weekEnd = new Date(today);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const weekLabel = `Week of ${monthNames[weekStart.getMonth()]} ${weekStart.getDate()}–${weekEnd.getDate()}`;

      // Fetch daily logs and mood data in parallel
      const [logsRes, moodRes, profileRes] = await Promise.all([
        supabase.from('daily_logs').select('*')
          .eq('user_id', userId)
          .gte('log_date', sevenDaysAgoStr)
          .lte('log_date', todayStr)
          .order('log_date', { ascending: true }),
        supabase.from('daily_logs').select('total_protein_g, mood_score, log_date')
          .eq('user_id', userId)
          .gte('log_date', sevenDaysAgoStr)
          .lte('log_date', todayStr)
          .not('mood_score', 'is', null),
        supabase.from('user_profiles')
          .select('weight_kg, height_cm, age, biological_sex, primary_goal')
          .eq('id', userId)
          .single(),
      ]);

      const logs = (logsRes.data || []) as Array<Record<string, unknown>>;
      const moodLogs = (moodRes.data || []) as Array<Record<string, unknown>>;
      setDaysLogged(logs.length);

      // Calculate protein goal from profile
      let computedProteinGoal = 150;
      if (profileRes.data) {
        const p = profileRes.data;
        const weight = p.weight_kg ?? 65;
        const height = p.height_cm ?? 165;
        const age = p.age ?? 25;
        const sex = p.biological_sex ?? 'not_specified';
        let bmr: number;
        if (sex === 'male') bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        else if (sex === 'female') bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        else bmr = 10 * weight + 6.25 * height - 5 * age - 78;
        const tdee = bmr * 1.375;
        const goal = p.primary_goal;
        const proteinRatio = goal === 'weight_loss' || goal === 'muscle_gain' ? 0.30 : 0.20;
        const adjustedTdee = goal === 'weight_loss' ? tdee * 0.85 : goal === 'muscle_gain' ? tdee * 1.1 : tdee;
        computedProteinGoal = Math.round((adjustedTdee * proteinRatio) / 4);
      }
      setProteinGoal(computedProteinGoal);

      // Build 7-day calorie breakdown
      const calData: WeeklyCalEntry[] = [];
      const proteinTrend: ProteinTrendEntry[] = [];
      let proteinGoalDaysCount = 0;
      let bestDayLabel = '';
      let bestDayProtein = 0;
      let totalProtein = 0;

      // Build a map of log_date → log
      const logMap = new Map<string, Record<string, unknown>>();
      for (const log of logs) {
        logMap.set(log.log_date as string, log);
      }

      for (let i = 6; i >= 0; i--) {
        const d = new Date(today.getTime() - i * 86400000);
        const dateStr = d.toISOString().split('T')[0];
        const dayLabel = dayNames[d.getDay()];
        const log = logMap.get(dateStr);

        const protein = Math.round(Number(log?.total_protein_g ?? 0));
        const carbs = Math.round(Number(log?.total_carbs_g ?? 0));
        const fat = Math.round(Number(log?.total_fat_g ?? 0));

        calData.push({ day: dayLabel, protein, carbs, fat, total: protein + carbs + fat });
        proteinTrend.push({ day: dayLabel, protein });

        totalProtein += protein;
        if (protein >= computedProteinGoal) proteinGoalDaysCount++;
        if (protein > bestDayProtein) {
          bestDayProtein = protein;
          bestDayLabel = dayLabel;
        }
      }

      setWeeklyCalData(calData);
      setProteinTrendData(proteinTrend);
      setProteinAvg(logs.length > 0 ? Math.round(totalProtein / 7) : 0);

      // Build mood vs protein scatter
      const moodPoints: MoodDataPoint[] = moodLogs
        .filter(m => m.mood_score != null && m.total_protein_g != null)
        .map(m => ({
          protein: Math.round(Number(m.total_protein_g)),
          mood: Number(m.mood_score),
          z: 10,
        }));
      setMoodData(moodPoints);

      // Weekly summary
      setWeeklySummary({
        weekLabel,
        proteinGoalDays: proteinGoalDaysCount,
        bestDay: bestDayLabel || 'N/A',
        avgMagnesiumPct: 0, // Would need detailed nutrient tracking
        longestFast: '', // Would need fasting data
        totalDaysLogged: logs.length,
      });
    } catch (err) {
      console.error('Insights fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    weeklyCalData,
    moodData,
    proteinTrendData,
    weeklySummary,
    proteinAvg,
    proteinGoal,
    loading,
    daysLogged,
    refresh: fetchInsights,
  };
}
