/**
 * Edge Function: dashboard-wellness
 * Computes the composite wellness score (0-100) from multiple factors.
 * 
 * Formula (per TRD v2):
 * - Nutrition adherence: 40%  (calories, protein vs targets)
 * - Consistency: 25%          (streak, logging frequency)
 * - Hydration: 15%            (water intake vs target)
 * - Sleep/lifestyle: 10%      (meal timing, fasting window)
 * - Gut health: 10%           (symptom frequency inversely)
 */
import { createUserClient, getUserId } from '../_shared/supabase-client.ts';
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { calculateDailyTargets } from '../_shared/nutrition/calculator.ts';

interface WellnessBreakdown {
  overall: number;
  nutrition: { score: number; weight: 0.40; details: string };
  consistency: { score: number; weight: 0.25; details: string };
  hydration: { score: number; weight: 0.15; details: string };
  lifestyle: { score: number; weight: 0.10; details: string };
  gutHealth: { score: number; weight: 0.10; details: string };
  trend: 'improving' | 'stable' | 'declining';
  trendPercent: number;
}

Deno.serve(async (req: Request) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const userClient = createUserClient(req);
    const userId = await getUserId(req);
    if (!userId) return errorResponse('Unauthorized', 401);

    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Fetch all required data in parallel
    const [profileRes, weekLogsRes, prevWeekLogsRes, hydrationRes, gutRes, weekMealsRes] = await Promise.all([
      userClient.from('user_profiles').select('*').eq('id', userId).single(),
      userClient.from('daily_logs').select('*')
        .eq('user_id', userId)
        .gte('log_date', sevenDaysAgo)
        .lte('log_date', today)
        .order('log_date', { ascending: false }),
      userClient.from('daily_logs').select('*')
        .eq('user_id', userId)
        .gte('log_date', fourteenDaysAgo)
        .lt('log_date', sevenDaysAgo)
        .order('log_date', { ascending: false }),
      userClient.from('hydration_logs').select('amount_ml')
        .eq('user_id', userId)
        .gte('logged_at', `${sevenDaysAgo}T00:00:00`),
      userClient.from('gut_symptom_logs').select('symptom_score')
        .eq('user_id', userId)
        .gte('log_date', sevenDaysAgo),
      userClient.from('meal_logs').select('id, logged_at')
        .eq('user_id', userId)
        .gte('logged_at', `${sevenDaysAgo}T00:00:00`),
    ]);

    const profile = profileRes.data;
    const weekLogs = weekLogsRes.data || [];
    const prevWeekLogs = prevWeekLogsRes.data || [];
    const hydrationLogs = hydrationRes.data || [];
    const gutLogs = gutRes.data || [];
    const weekMeals = weekMealsRes.data || [];

    // Compute meals per day from meal_logs
    const mealsPerDay: Record<string, number> = {};
    for (const m of weekMeals) {
      const day = (m.logged_at as string).split('T')[0];
      mealsPerDay[day] = (mealsPerDay[day] || 0) + 1;
    }

    if (!profile) {
      return jsonResponse({ overall: 0, message: 'Complete your profile to see wellness score' });
    }

    // 1. NUTRITION ADHERENCE (40%)
    let nutritionScore = 50; // default
    const targets = calculateDailyTargets(profile);
    if (weekLogs.length > 0) {
      const calorieTarget = targets.calories;
      const proteinTarget = targets.proteinG;

      const avgCalories = weekLogs.reduce((s: number, d: Record<string, unknown>) => s + ((d.total_calories as number) || 0), 0) / weekLogs.length;
      const avgProtein = weekLogs.reduce((s: number, d: Record<string, unknown>) => s + ((d.total_protein_g as number) || 0), 0) / weekLogs.length;

      const calRatio = Math.min(avgCalories / calorieTarget, 1.2); // cap at 120%
      const calScore = calRatio >= 0.85 && calRatio <= 1.05 ? 100 : Math.max(0, 100 - Math.abs(1 - calRatio) * 200);
      const proteinRatio = Math.min(avgProtein / proteinTarget, 1.5);
      const proteinScore = Math.min(proteinRatio * 100, 100);

      nutritionScore = Math.round(calScore * 0.6 + proteinScore * 0.4);
    }

    // 2. CONSISTENCY (25%)
    const daysLogged = weekLogs.length;
    const consistencyScore = Math.round(Math.min((daysLogged / 7) * 100, 100));

    // 3. HYDRATION (15%)
    let hydrationScore = 0;
    if (hydrationLogs.length > 0) {
      const totalWater = hydrationLogs.reduce((s: number, h: Record<string, unknown>) => s + ((h.amount_ml as number) || 0), 0);
      const dailyAvg = totalWater / 7;
      const target = profile.hydration_target_ml || 2500;
      hydrationScore = Math.round(Math.min((dailyAvg / target) * 100, 100));
    }

    // 4. LIFESTYLE (10%) — based on meal timing regularity
    let lifestyleScore = 60; // default moderate
    if (weekLogs.length >= 3) {
      const totalMealsForWeek = Object.values(mealsPerDay).reduce((s, c) => s + c, 0);
      const daysWithMeals = Object.keys(mealsPerDay).length || 1;
      const avgMeals = totalMealsForWeek / daysWithMeals;
      if (avgMeals >= 3) lifestyleScore = 85;
      else if (avgMeals >= 2) lifestyleScore = 65;
      else lifestyleScore = 40;
    }

    // 5. GUT HEALTH (10%) — inverse of symptom severity
    let gutHealthScore = 100; // assume good if no logs
    if (gutLogs.length > 0) {
      const avgSeverity = gutLogs.reduce((s: number, g: Record<string, unknown>) => s + ((g.symptom_score as number) || 3), 0) / gutLogs.length;
      gutHealthScore = Math.round(Math.max(0, 100 - (avgSeverity - 1) * 25));
    }

    // Calculate overall
    const overall = Math.round(
      nutritionScore * 0.40 +
      consistencyScore * 0.25 +
      hydrationScore * 0.15 +
      lifestyleScore * 0.10 +
      gutHealthScore * 0.10
    );

    // Calculate trend
    let prevOverall = 50;
    if (prevWeekLogs.length > 0) {
      const prevCalTarget = targets.calories;
      const prevAvgCal = prevWeekLogs.reduce((s: number, d: Record<string, unknown>) => s + ((d.total_calories as number) || 0), 0) / prevWeekLogs.length;
      const prevCalRatio = Math.min(prevAvgCal / prevCalTarget, 1.2);
      const prevNutrition = prevCalRatio >= 0.85 && prevCalRatio <= 1.05 ? 100 : Math.max(0, 100 - Math.abs(1 - prevCalRatio) * 200);
      const prevConsistency = Math.min((prevWeekLogs.length / 7) * 100, 100);
      prevOverall = Math.round(prevNutrition * 0.40 + prevConsistency * 0.25 + 50 * 0.35);
    }

    const trendPercent = overall - prevOverall;
    const trend: 'improving' | 'stable' | 'declining' =
      trendPercent > 5 ? 'improving' : trendPercent < -5 ? 'declining' : 'stable';

    const result: WellnessBreakdown = {
      overall,
      nutrition: {
        score: nutritionScore,
        weight: 0.40,
        details: `Avg ${weekLogs.length > 0 ? Math.round(weekLogs.reduce((s: number, d: Record<string, unknown>) => s + ((d.total_calories as number) || 0), 0) / weekLogs.length) : 0} kcal/day`,
      },
      consistency: {
        score: consistencyScore,
        weight: 0.25,
        details: `${daysLogged}/7 days logged this week`,
      },
      hydration: {
        score: hydrationScore,
        weight: 0.15,
        details: hydrationLogs.length > 0 ? `${Math.round(hydrationLogs.reduce((s: number, h: Record<string, unknown>) => s + ((h.amount_ml as number) || 0), 0) / 7)}ml avg/day` : 'No water logged',
      },
      lifestyle: {
        score: lifestyleScore,
        weight: 0.10,
        details: `Avg ${Object.keys(mealsPerDay).length > 0 ? (Object.values(mealsPerDay).reduce((s, c) => s + c, 0) / Object.keys(mealsPerDay).length).toFixed(1) : 0} meals/day`,
      },
      gutHealth: {
        score: gutHealthScore,
        weight: 0.10,
        details: gutLogs.length > 0 ? `${gutLogs.length} symptom reports this week` : 'No gut issues reported',
      },
      trend,
      trendPercent: Math.round(trendPercent),
    };

    return jsonResponse(result);

  } catch (err) {
    console.error('Wellness score error:', err);
    return errorResponse('Internal server error', 500);
  }
});
