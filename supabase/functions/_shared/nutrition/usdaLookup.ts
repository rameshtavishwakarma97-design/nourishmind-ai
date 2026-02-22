/**
 * USDA FoodData Central Lookup — calls the external USDA API.
 * Returns per-100g nutrition with confidence > 0.85.
 * Caches results in usda_cache table to avoid redundant API calls.
 */
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export interface UsdaMatch {
  fdc_id: number;
  description: string;
  per_100g: Record<string, number | null>;
  confidence: number;
  source: 'usda_verified';
}

// USDA nutrient ID → our field name map
const NUTRIENT_MAP: Record<number, string> = {
  1008: 'calories',       // Energy (kcal)
  1003: 'protein_g',      // Protein
  1005: 'carbs_g',        // Carbohydrate, by difference
  1004: 'fat_g',          // Total lipid (fat)
  1079: 'fiber_g',        // Fiber, total dietary
  1089: 'iron_mg',        // Iron, Fe
  1087: 'calcium_mg',     // Calcium, Ca
  1090: 'magnesium_mg',   // Magnesium, Mg
  1092: 'potassium_mg',   // Potassium, K
  1093: 'sodium_mg',      // Sodium, Na
  1178: 'vitamin_b12_mcg',// Vitamin B-12
  1114: 'vitamin_d_iu',   // Vitamin D (D2 + D3), International Units
  1095: 'zinc_mg',        // Zinc, Zn
  1177: 'folate_mcg',     // Folate, total
};

/**
 * Search USDA FoodData Central API. Checks local cache first.
 */
export async function lookupUsda(
  client: SupabaseClient,
  ingredientName: string
): Promise<UsdaMatch | null> {
  const apiKey = Deno.env.get('USDA_API_KEY');
  if (!apiKey) {
    console.warn('USDA_API_KEY not set — skipping USDA lookup');
    return null;
  }

  // Check cache first
  const cacheKey = ingredientName.toLowerCase().trim();
  const { data: cached } = await client
    .from('usda_cache')
    .select('*')
    .eq('search_query', cacheKey)
    .single();

  if (cached && cached.nutrition_data) {
    return {
      fdc_id: cached.fdc_id,
      description: cached.food_description,
      per_100g: cached.nutrition_data as Record<string, number | null>,
      confidence: 0.88,
      source: 'usda_verified',
    };
  }

  // Call USDA API
  try {
    const searchUrl = `${USDA_BASE_URL}/foods/search?api_key=${apiKey}&query=${encodeURIComponent(ingredientName)}&pageSize=3&dataType=Foundation,SR Legacy`;
    const searchResp = await fetch(searchUrl);
    
    if (!searchResp.ok) {
      console.error(`USDA search failed: ${searchResp.status}`);
      return null;
    }

    const searchData = await searchResp.json();
    const foods = searchData.foods;

    if (!foods || foods.length === 0) {
      return null;
    }

    const topResult = foods[0];
    const per100g: Record<string, number | null> = {};

    // Extract nutrients
    if (topResult.foodNutrients) {
      for (const nutrient of topResult.foodNutrients) {
        const fieldName = NUTRIENT_MAP[nutrient.nutrientId];
        if (fieldName) {
          per100g[fieldName] = nutrient.value ?? null;
        }
      }
    }

    const match: UsdaMatch = {
      fdc_id: topResult.fdcId,
      description: topResult.description,
      per_100g: per100g,
      confidence: 0.88,
      source: 'usda_verified',
    };

    // Cache the result for future lookups
    await client.from('usda_cache').upsert({
      search_query: cacheKey,
      fdc_id: topResult.fdcId,
      food_description: topResult.description,
      nutrition_data: per100g,
      fetched_at: new Date().toISOString(),
    }, { onConflict: 'search_query' });

    return match;
  } catch (err) {
    console.error('USDA lookup error:', err);
    return null;
  }
}

/**
 * Get detailed nutrition for a specific USDA food by FDC ID.
 */
export async function getUsdaDetails(fdcId: number): Promise<Record<string, number | null> | null> {
  const apiKey = Deno.env.get('USDA_API_KEY');
  if (!apiKey) return null;

  try {
    const url = `${USDA_BASE_URL}/food/${fdcId}?api_key=${apiKey}`;
    const resp = await fetch(url);
    if (!resp.ok) return null;

    const data = await resp.json();
    const per100g: Record<string, number | null> = {};

    if (data.foodNutrients) {
      for (const nutrient of data.foodNutrients) {
        const id = nutrient.nutrient?.id;
        const fieldName = id ? NUTRIENT_MAP[id] : null;
        if (fieldName) {
          per100g[fieldName] = nutrient.amount ?? null;
        }
      }
    }

    return per100g;
  } catch {
    return null;
  }
}
