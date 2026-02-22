/**
 * Edge Function: nutrition-analyze
 * CORE NUTRITION PIPELINE — looks up nutrition for parsed ingredients.
 * 
 * Lookup chain (per TRD v1 Section 6.2):
 * 1. IFCT 2017 (Indian food DB) — confidence 0.90+
 * 2. Indian Brands DB — confidence 0.85+
 * 3. USDA FoodData Central — confidence 0.85+
 * 4. Gemini LLM fallback — confidence < 0.80
 * 
 * Also: saves meal_log + meal_ingredients + upserts daily_logs
 */
import { createUserClient, getUserId } from '../_shared/supabase-client.ts';
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { generateJSON } from '../_shared/llm.ts';
import { lookupIfct } from '../_shared/nutrition/ifctLookup.ts';
import { lookupUsda } from '../_shared/nutrition/usdaLookup.ts';
import { lookupBrand } from '../_shared/nutrition/brandLookup.ts';
import { aggregateMealTotals, calculateMealConfidence } from '../_shared/nutrition/calculator.ts';
import type { IngredientNutrition } from '../_shared/nutrition/calculator.ts';
import { nutritionAnalyzerFallbackPrompt, buildFallbackQuery } from '../_shared/prompts/nutritionAnalyzer.ts';

interface AnalyzeRequest {
  ingredients: Array<{
    ingredientName: string;
    brandName: string | null;
    quantityG: number | null;
    needsClarification: boolean;
  }>;
  mealType: string;
  rawInput: string;
}

Deno.serve(async (req: Request) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const userClient = createUserClient(req);
    const userId = await getUserId(req);

    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    const body: AnalyzeRequest = await req.json();
    const { ingredients, mealType, rawInput } = body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return errorResponse('ingredients array required', 400);
    }

    // Process each ingredient through the lookup chain
    const analyzedIngredients: IngredientNutrition[] = [];
    const ingredientDetails: Array<Record<string, unknown>> = [];

    for (const ing of ingredients) {
      const quantityG = ing.quantityG ?? 100; // Default 100g if not specified
      let per100g: Record<string, number | null> | null = null;
      let source = 'unknown';
      let confidence = 0.5;
      let matchedName = ing.ingredientName;

      // Step 1: If brand is mentioned, try brand DB first
      if (ing.brandName) {
        const brandMatch = await lookupBrand(userClient, ing.ingredientName, ing.brandName);
        if (brandMatch) {
          per100g = brandMatch.per_100g;
          source = 'brand_db_verified';
          confidence = brandMatch.confidence;
          matchedName = `${brandMatch.brand_name} ${brandMatch.product_name}`;
        }
      }

      // Step 2: Try IFCT (Indian Food Composition Tables)
      if (!per100g) {
        const ifctMatch = await lookupIfct(userClient, ing.ingredientName);
        if (ifctMatch) {
          per100g = ifctMatch.per_100g;
          source = 'ifct_verified';
          confidence = ifctMatch.confidence;
          matchedName = ifctMatch.food_name;
        }
      }

      // Step 3: Try USDA FoodData Central
      if (!per100g) {
        const usdaMatch = await lookupUsda(userClient, ing.ingredientName);
        if (usdaMatch) {
          per100g = usdaMatch.per_100g;
          source = 'usda_verified';
          confidence = usdaMatch.confidence;
          matchedName = usdaMatch.description;
        }
      }

      // Step 4: LLM fallback — generate estimated nutrition
      if (!per100g) {
        const fallbackQuery = buildFallbackQuery(ing.ingredientName, ing.brandName);
        const fallback = await generateJSON<{
          per100gCalories: number;
          per100gProtein: number;
          per100gCarbs: number;
          per100gFat: number;
          per100gFiber: number;
          per100gIronMg: number;
          per100gCalciumMg: number;
          per100gMagnesiumMg: number;
          per100gPotassiumMg: number;
          per100gSodiumMg: number;
          per100gVitaminB12Mcg: number;
          per100gVitaminDIu: number;
          per100gZincMg: number;
          per100gFolateMcg: number;
          confidenceScore: number;
        }>(nutritionAnalyzerFallbackPrompt, fallbackQuery);

        if (fallback) {
          per100g = {
            calories: fallback.per100gCalories,
            protein_g: fallback.per100gProtein,
            carbs_g: fallback.per100gCarbs,
            fat_g: fallback.per100gFat,
            fiber_g: fallback.per100gFiber,
            iron_mg: fallback.per100gIronMg,
            calcium_mg: fallback.per100gCalciumMg,
            magnesium_mg: fallback.per100gMagnesiumMg,
            potassium_mg: fallback.per100gPotassiumMg,
            sodium_mg: fallback.per100gSodiumMg,
            vitamin_b12_mcg: fallback.per100gVitaminB12Mcg,
            vitamin_d_iu: fallback.per100gVitaminDIu,
            zinc_mg: fallback.per100gZincMg,
            folate_mcg: fallback.per100gFolateMcg,
          };
          source = 'llm_estimated';
          confidence = Math.min(fallback.confidenceScore || 0.65, 0.78);
        }
      }

      // If still nothing, use minimal defaults
      if (!per100g) {
        per100g = {
          calories: 100, protein_g: 2, carbs_g: 15, fat_g: 3,
          fiber_g: 1, iron_mg: 0.5, calcium_mg: 20, magnesium_mg: 10,
          potassium_mg: 50, sodium_mg: 10, vitamin_b12_mcg: 0,
          vitamin_d_iu: 0, zinc_mg: 0.3, folate_mcg: 10,
        };
        source = 'llm_estimated';
        confidence = 0.40;
      }

      analyzedIngredients.push({
        ingredientName: ing.ingredientName,
        quantityG,
        per100g,
        source,
        confidence,
      });

      ingredientDetails.push({
        ingredientName: ing.ingredientName,
        matchedName,
        quantityG,
        per100g,
        source,
        confidence,
      });
    }

    // Calculate meal totals
    const totals = aggregateMealTotals(analyzedIngredients);
    const mealConfidence = calculateMealConfidence(analyzedIngredients);

    // Save meal log
    const { data: mealLog, error: mealError } = await userClient
      .from('meal_logs')
      .insert({
        user_id: userId,
        meal_type: mealType,
        raw_input: rawInput,
        total_calories: totals.calories,
        total_protein_g: totals.protein_g,
        total_carbs_g: totals.carbs_g,
        total_fat_g: totals.fat_g,
        total_fiber_g: totals.fiber_g,
        overall_confidence_score: mealConfidence,
        logged_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (mealError) {
      console.error('Meal log insert error:', mealError);
      return errorResponse('Failed to save meal log', 500);
    }

    // Save individual ingredients
    if (mealLog) {
      const ingredientRows = analyzedIngredients.map(ing => ({
        meal_log_id: mealLog.id,
        ingredient_name: ing.ingredientName,
        quantity_g: ing.quantityG,
        calories: Math.round((ing.per100g.calories ?? 0) * ing.quantityG / 100 * 10) / 10,
        protein_g: Math.round((ing.per100g.protein_g ?? 0) * ing.quantityG / 100 * 10) / 10,
        carbs_g: Math.round((ing.per100g.carbs_g ?? 0) * ing.quantityG / 100 * 10) / 10,
        fat_g: Math.round((ing.per100g.fat_g ?? 0) * ing.quantityG / 100 * 10) / 10,
        fiber_g: Math.round((ing.per100g.fiber_g ?? 0) * ing.quantityG / 100 * 10) / 10,
        confidence_source: ing.source,
        confidence_score: ing.confidence,
      }));

      await userClient.from('meal_ingredients').insert(ingredientRows);

      // Upsert daily totals via RPC
      await userClient.rpc('upsert_daily_totals', {
        p_user_id: userId,
        p_log_date: new Date().toISOString().split('T')[0],
      });
    }

    return jsonResponse({
      mealLogId: mealLog?.id,
      mealType,
      totals,
      confidence: mealConfidence,
      ingredients: ingredientDetails,
      ingredientCount: analyzedIngredients.length,
    });

  } catch (err) {
    console.error('Nutrition analyze error:', err);
    return errorResponse('Internal server error', 500);
  }
});
