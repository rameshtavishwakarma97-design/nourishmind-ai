/**
 * Edge Function: nutrition-search
 * Searches across IFCT, brands, and USDA for a food item.
 * Returns matching results for autocomplete/search UI.
 */
import { createUserClient, getUserId } from '../_shared/supabase-client.ts';
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  source: 'ifct' | 'brand' | 'usda';
  caloriesPer100g: number | null;
  proteinPer100g: number | null;
  brandName?: string;
}

Deno.serve(async (req: Request) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const userId = await getUserId(req);
    if (!userId) return errorResponse('Unauthorized', 401);

    const url = new URL(req.url);
    const query = url.searchParams.get('q');
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    if (!query || query.length < 2) {
      return errorResponse('Query must be at least 2 characters', 400);
    }

    const userClient = createUserClient(req);
    const results: SearchResult[] = [];

    // Search IFCT first (highest priority for Indian foods)
    const { data: ifctResults } = await userClient
      .from('ifct_foods')
      .select('id, food_name, food_name_hindi, food_group, per_100g_calories, per_100g_protein')
      .or(`food_name.ilike.%${query}%,food_name_hindi.ilike.%${query}%`)
      .limit(limit);

    if (ifctResults) {
      for (const food of ifctResults) {
        results.push({
          id: food.id,
          name: food.food_name_hindi ? `${food.food_name} (${food.food_name_hindi})` : food.food_name,
          category: food.food_group || '',
          source: 'ifct',
          caloriesPer100g: food.per_100g_calories,
          proteinPer100g: food.per_100g_protein,
        });
      }
    }

    // Search Indian brands
    if (results.length < limit) {
      const remainingLimit = limit - results.length;
      const { data: brandResults } = await userClient
        .from('indian_brands')
        .select('id, brand_name, product_name, per_100g_calories, per_100g_protein, serving_size_g')
        .or(`product_name.ilike.%${query}%,brand_name.ilike.%${query}%`)
        .limit(remainingLimit);

      if (brandResults) {
        for (const brand of brandResults) {
          results.push({
            id: brand.id,
            name: `${brand.brand_name} ${brand.product_name}`,
            category: '',
            source: 'brand',
            caloriesPer100g: brand.per_100g_calories ? Math.round(brand.per_100g_calories) : null,
            proteinPer100g: brand.per_100g_protein ? Math.round(brand.per_100g_protein * 10) / 10 : null,
            brandName: brand.brand_name,
          });
        }
      }
    }

    return jsonResponse({
      query,
      results,
      count: results.length,
    });

  } catch (err) {
    console.error('Nutrition search error:', err);
    return errorResponse('Internal server error', 500);
  }
});
