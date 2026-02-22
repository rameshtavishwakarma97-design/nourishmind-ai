/**
 * Edge Function: meals-log
 * Direct meal logging endpoint — used by quick-log UI (bypass chat).
 * Accepts pre-structured meal data, saves to DB, upserts daily totals.
 */
import { createUserClient, getUserId } from '../_shared/supabase-client.ts';
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';

interface MealLogRequest {
  mealType: string;
  rawInput: string;
  ingredients: Array<{
    ingredientName: string;
    quantityG: number;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG: number;
    source: string;
    confidence: number;
  }>;
  savedMealId?: string;
}

Deno.serve(async (req: Request) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const userClient = createUserClient(req);
    const userId = await getUserId(req);
    if (!userId) return errorResponse('Unauthorized', 401);

    if (req.method === 'GET') {
      // Get meal history
      const url = new URL(req.url);
      const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
      const limit = parseInt(url.searchParams.get('limit') || '20', 10);

      const { data: meals, error } = await userClient
        .from('meal_logs')
        .select('*, meal_ingredients(*)')
        .eq('user_id', userId)
        .gte('logged_at', `${date}T00:00:00`)
        .lte('logged_at', `${date}T23:59:59`)
        .order('logged_at', { ascending: false })
        .limit(limit);

      if (error) return errorResponse(error.message, 500);
      return jsonResponse({ meals: meals || [], date });
    }

    if (req.method === 'DELETE') {
      const url = new URL(req.url);
      const mealId = url.searchParams.get('id');
      if (!mealId) return errorResponse('Meal ID required', 400);

      // Delete ingredients first (cascade should handle this, but explicit)
      await userClient.from('meal_ingredients').delete().eq('meal_log_id', mealId);
      const { error } = await userClient.from('meal_logs').delete().eq('id', mealId).eq('user_id', userId);
      if (error) return errorResponse(error.message, 500);

      // Re-upsert daily totals
      await userClient.rpc('upsert_daily_totals', {
        p_user_id: userId,
        p_log_date: new Date().toISOString().split('T')[0],
      });

      return jsonResponse({ deleted: true });
    }

    // POST — create new meal log
    const body: MealLogRequest = await req.json();
    const { mealType, rawInput, ingredients, savedMealId } = body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return errorResponse('At least one ingredient required', 400);
    }

    // Calculate totals
    const totalCalories = ingredients.reduce((sum, i) => sum + (i.calories || 0), 0);
    const totalProtein = ingredients.reduce((sum, i) => sum + (i.proteinG || 0), 0);
    const totalCarbs = ingredients.reduce((sum, i) => sum + (i.carbsG || 0), 0);
    const totalFat = ingredients.reduce((sum, i) => sum + (i.fatG || 0), 0);
    const totalFiber = ingredients.reduce((sum, i) => sum + (i.fiberG || 0), 0);
    const avgConfidence = ingredients.reduce((sum, i) => sum + (i.confidence || 0.5), 0) / ingredients.length;

    // Insert meal log
    const { data: mealLog, error: mealError } = await userClient
      .from('meal_logs')
      .insert({
        user_id: userId,
        meal_type: mealType,
        raw_input: rawInput,
        saved_meal_id: savedMealId || null,
        total_calories: Math.round(totalCalories * 10) / 10,
        total_protein_g: Math.round(totalProtein * 10) / 10,
        total_carbs_g: Math.round(totalCarbs * 10) / 10,
        total_fat_g: Math.round(totalFat * 10) / 10,
        total_fiber_g: Math.round(totalFiber * 10) / 10,
        confidence_score: Math.round(avgConfidence * 100) / 100,
        logged_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (mealError || !mealLog) {
      console.error('Meal log error:', mealError);
      return errorResponse('Failed to save meal', 500);
    }

    // Insert ingredients
    const ingredientRows = ingredients.map(ing => ({
      meal_log_id: mealLog.id,
      ingredient_name: ing.ingredientName,
      quantity_g: ing.quantityG,
      calories: ing.calories,
      protein_g: ing.proteinG,
      carbs_g: ing.carbsG,
      fat_g: ing.fatG,
      fiber_g: ing.fiberG,
      data_source: ing.source,
      confidence_score: ing.confidence,
    }));

    await userClient.from('meal_ingredients').insert(ingredientRows);

    // Upsert daily totals
    await userClient.rpc('upsert_daily_totals', {
      p_user_id: userId,
      p_log_date: new Date().toISOString().split('T')[0],
    });

    return jsonResponse({
      mealLogId: mealLog.id,
      mealType,
      totals: {
        calories: totalCalories,
        protein_g: totalProtein,
        carbs_g: totalCarbs,
        fat_g: totalFat,
        fiber_g: totalFiber,
      },
      ingredientCount: ingredients.length,
      confidence: avgConfidence,
    });

  } catch (err) {
    console.error('Meals log error:', err);
    return errorResponse('Internal server error', 500);
  }
});
