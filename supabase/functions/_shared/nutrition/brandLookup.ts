/**
 * Indian Brand Lookup — searches the indian_brands table.
 * Returns per-serving or per-100g nutrition with confidence > 0.85.
 */
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export interface BrandMatch {
  id: string;
  brand_name: string;
  product_name: string;
  serving_size_g: number;
  per_100g: Record<string, number | null>;
  confidence: number;
  source: 'brand_db_verified';
}

/**
 * Search Indian brands table by brand name + product name.
 * Smartly searches: tries exact brand match first, then fuzzy search.
 */
export async function lookupBrand(
  client: SupabaseClient,
  ingredientName: string,
  brandName?: string | null
): Promise<BrandMatch | null> {
  // Strategy 1: If brand name is provided, search by brand + product
  if (brandName) {
    const { data: brandResults } = await client
      .from('indian_brands')
      .select('*')
      .ilike('brand_name', `%${brandName}%`)
      .limit(5);

    if (brandResults && brandResults.length > 0) {
      // Filter by product name similarity
      const cleanIngredient = ingredientName.toLowerCase();
      const match = brandResults.find(r => 
        r.product_name.toLowerCase().includes(cleanIngredient) ||
        cleanIngredient.includes(r.product_name.toLowerCase())
      );
      if (match) return mapToBrandMatch(match);
      // If no product match, return first brand result
      return mapToBrandMatch(brandResults[0]);
    }
  }

  // Strategy 2: Full-text search
  const cleanedQuery = ingredientName
    .toLowerCase()
    .replace(/\b(packet|pack|bottle|box|sachet|pouch)\b/g, '')
    .trim();

  const tsQuery = cleanedQuery.split(/\s+/).filter(Boolean).join(' & ');
  const { data: ftsResults } = await client
    .from('indian_brands')
    .select('*')
    .textSearch('search_vector', tsQuery)
    .limit(3);

  if (ftsResults && ftsResults.length > 0) {
    return mapToBrandMatch(ftsResults[0]);
  }

  // Strategy 3: ILIKE partial match on product_name or brand_name
  const { data: ilikeResults } = await client
    .from('indian_brands')
    .select('*')
    .or(`product_name.ilike.%${cleanedQuery}%,brand_name.ilike.%${cleanedQuery}%`)
    .limit(3);

  if (ilikeResults && ilikeResults.length > 0) {
    return mapToBrandMatch(ilikeResults[0]);
  }

  return null;
}

function mapToBrandMatch(row: Record<string, unknown>): BrandMatch {
  const servingSize = (row.serving_size_g as number) || 100;

  const per100g: Record<string, number | null> = {
    calories: row.per_100g_calories as number | null,
    protein_g: row.per_100g_protein as number | null,
    carbs_g: row.per_100g_carbs as number | null,
    fat_g: row.per_100g_fat as number | null,
    fiber_g: row.per_100g_fiber as number | null,
    sodium_mg: row.per_100g_sodium_mg as number | null,
  };

  return {
    id: row.id as string,
    brand_name: row.brand_name as string,
    product_name: row.product_name as string,
    serving_size_g: servingSize,
    per_100g: per100g,
    confidence: 0.87,
    source: 'brand_db_verified',
  };
}
