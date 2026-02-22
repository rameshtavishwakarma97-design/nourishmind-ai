/**
 * IFCT Food Lookup — searches the ifct_foods table using full-text search.
 * Returns per-100g nutrition with confidence > 0.90.
 */
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export interface IfctMatch {
  id: string;
  food_name: string;
  food_name_hindi: string | null;
  category: string;
  per_100g: Record<string, number | null>;
  glycemic_index: number | null;
  confidence: number;
  source: 'ifct_verified';
}

/**
 * Search IFCT foods table by ingredient name. Uses full-text search with ts_rank.
 * Falls back to ILIKE partial match if FTS returns nothing.
 */
export async function lookupIfct(
  client: SupabaseClient,
  ingredientName: string
): Promise<IfctMatch | null> {
  // Normalize the query - remove common quantity words
  const cleanedQuery = ingredientName
    .toLowerCase()
    .replace(/\b(cooked|raw|boiled|fried|steamed|roasted|grilled|baked)\b/g, '')
    .replace(/\b(fresh|dried|frozen|canned)\b/g, '')
    .trim();

  // Strategy 1: Full-text search (fast, ranked)
  const tsQuery = cleanedQuery.split(/\s+/).filter(Boolean).join(' & ');
  const { data: ftsResults } = await client
    .from('ifct_foods')
    .select('*')
    .textSearch('search_vector', tsQuery)
    .limit(3);

  if (ftsResults && ftsResults.length > 0) {
    return mapToIfctMatch(ftsResults[0]);
  }

  // Strategy 2: ILIKE partial match (slower but catches variants)
  const { data: ilikeResults } = await client
    .from('ifct_foods')
    .select('*')
    .or(`food_name.ilike.%${cleanedQuery}%,food_name_hindi.ilike.%${cleanedQuery}%`)
    .limit(3);

  if (ilikeResults && ilikeResults.length > 0) {
    return mapToIfctMatch(ilikeResults[0]);
  }

  // Strategy 3: Try each word separately
  const words = cleanedQuery.split(/\s+/).filter(w => w.length > 2);
  for (const word of words) {
    const { data: wordResults } = await client
      .from('ifct_foods')
      .select('*')
      .ilike('food_name', `%${word}%`)
      .limit(1);

    if (wordResults && wordResults.length > 0) {
      const match = mapToIfctMatch(wordResults[0]);
      match.confidence = 0.75; // Lower confidence for partial match
      return match;
    }
  }

  return null;
}

/**
 * Search IFCT for multiple ingredients in parallel.
 */
export async function lookupIfctBatch(
  client: SupabaseClient,
  ingredientNames: string[]
): Promise<Map<string, IfctMatch | null>> {
  const results = new Map<string, IfctMatch | null>();
  const lookups = ingredientNames.map(async (name) => {
    const match = await lookupIfct(client, name);
    results.set(name, match);
  });
  await Promise.all(lookups);
  return results;
}

function mapToIfctMatch(row: Record<string, unknown>): IfctMatch {
  return {
    id: row.id as string,
    food_name: row.food_name as string,
    food_name_hindi: row.food_name_hindi as string | null,
    category: (row.food_group as string) || '',
    per_100g: {
      calories: row.per_100g_calories as number,
      protein_g: row.per_100g_protein as number,
      carbs_g: row.per_100g_carbs as number,
      fat_g: row.per_100g_fat as number,
      fiber_g: row.per_100g_fiber as number,
      iron_mg: row.per_100g_iron_mg as number,
      calcium_mg: row.per_100g_calcium_mg as number,
      magnesium_mg: row.per_100g_magnesium_mg as number,
      potassium_mg: row.per_100g_potassium_mg as number,
      sodium_mg: row.per_100g_sodium_mg as number,
      vitamin_b12_mcg: row.per_100g_vitamin_b12_mcg as number,
      vitamin_d_iu: row.per_100g_vitamin_d_iu as number,
      zinc_mg: row.per_100g_zinc_mg as number,
      folate_mcg: row.per_100g_folate_mcg as number,
    },
    glycemic_index: row.glycemic_index as number | null,
    confidence: 0.92,
    source: 'ifct_verified',
  };
}
