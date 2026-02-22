/**
 * Edge Function: conditions-fodmap
 * Checks a meal or food list against the FODMAP database.
 * Returns risk rating and IBS-safe alternatives.
 */
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getUserId } from '../_shared/supabase-client.ts';
import { checkMealFodmap, checkFodmap } from '../_shared/nutrition/fodmapChecker.ts';

Deno.serve(async (req: Request) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const userId = await getUserId(req);
    if (!userId) return errorResponse('Unauthorized', 401);

    if (req.method === 'GET') {
      // Single food check via query param
      const url = new URL(req.url);
      const food = url.searchParams.get('food');
      if (!food) return errorResponse('food parameter required', 400);

      const result = checkFodmap(food);
      return jsonResponse({
        food,
        result: result || { food, rating: 'unknown', category: 'unknown', detail: 'Not found in FODMAP database' },
      });
    }

    // POST — check a full meal
    const body = await req.json();
    const { ingredients } = body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return errorResponse('ingredients array required', 400);
    }

    const result = checkMealFodmap(ingredients);

    // Add swap suggestions for high-FODMAP items
    const swapSuggestions: Record<string, string[]> = {
      onion: ['asafoetida (hing)', 'chives (green part only)', 'spring onion (green part)'],
      garlic: ['garlic-infused oil', 'asafoetida (hing)', 'ginger'],
      wheat: ['rice', 'ragi flour', 'jowar flour', 'bajra flour'],
      milk: ['lactose-free milk', 'coconut milk', 'almond milk'],
      apple: ['orange', 'banana (firm)', 'guava', 'grapes'],
      watermelon: ['papaya', 'pineapple', 'pomegranate'],
      cauliflower: ['potato', 'carrot', 'bottle gourd (lauki)', 'bhindi'],
      mushroom: ['paneer', 'tofu', 'jackfruit (raw)'],
      cashews: ['peanuts', 'walnuts', 'almonds (max 10)'],
      rajma: ['moong dal', 'tofu', 'paneer'],
      chole: ['moong dal', 'tofu', 'tempeh'],
      chickpeas: ['moong dal', 'tofu', 'tempeh'],
      honey: ['maple syrup', 'sugar (in moderation)', 'jaggery (small amount)'],
    };

    const swaps = result.flaggedItems.map(item => ({
      food: item.food,
      rating: item.rating,
      alternatives: swapSuggestions[item.food] || ['Consult a dietitian for alternatives'],
    }));

    return jsonResponse({
      ...result,
      swapSuggestions: swaps,
    });

  } catch (err) {
    console.error('FODMAP check error:', err);
    return errorResponse('Internal server error', 500);
  }
});
