/**
 * Glycemic Load Calculator — estimates blood sugar impact.
 * Used for PCOS/diabetes users and "blood sugar simulation" feature.
 */

export interface GlycemicLoadResult {
  totalGL: number;
  classification: 'low' | 'moderate' | 'high';
  ingredients: Array<{
    name: string;
    gi: number;
    carbsG: number;
    gl: number;
    classification: 'low' | 'moderate' | 'high';
  }>;
  bloodSugarSimulation: {
    peakTime: string;
    estimatedSpike: 'minimal' | 'moderate' | 'significant';
    recommendation: string;
  };
}

/**
 * Default GI values for common Indian foods (when DB doesn't have them).
 * Source: International Tables of Glycemic Index and Glycemic Load Values (2021).
 */
const DEFAULT_GI: Record<string, number> = {
  // Cereals & grains
  'white rice': 73, 'brown rice': 68, 'basmati rice': 58,
  'wheat chapati': 52, 'whole wheat bread': 74, 'white bread': 75,
  'oats': 55, 'ragi': 54, 'jowar': 62, 'bajra': 54,
  'idli': 77, 'dosa': 77, 'upma': 64, 'poha': 64,
  'maggi noodles': 58, 'instant noodles': 58,
  // Pulses
  'moong dal': 31, 'toor dal': 29, 'chana dal': 28,
  'masoor dal': 30, 'rajma': 27, 'chickpeas': 28,
  'black beans': 30, 'green peas': 48,
  // Fruits
  'banana': 51, 'apple': 36, 'mango': 56, 'papaya': 60,
  'watermelon': 76, 'grapes': 46, 'orange': 43,
  'guava': 12, 'pomegranate': 35, 'chiku': 55,
  // Vegetables
  'potato': 78, 'sweet potato': 63, 'carrot': 39,
  'beetroot': 64, 'corn': 52,
  // Dairy
  'milk': 27, 'curd': 28, 'buttermilk': 25,
  // Sweeteners
  'sugar': 65, 'jaggery': 84, 'honey': 58,
  // Misc
  'samosa': 55, 'paratha': 55, 'puri': 68,
};

/**
 * Get glycemic index for an ingredient.
 * Priority: DB value → default map → null.
 */
export function getGlycemicIndex(ingredientName: string, dbGI: number | null): number | null {
  if (dbGI != null) return dbGI;

  const normalized = ingredientName.toLowerCase().trim();
  for (const [key, value] of Object.entries(DEFAULT_GI)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  return null;
}

/**
 * Calculate glycemic load for a single ingredient.
 * GL = (GI × available carbs in grams) / 100
 */
export function calculateGL(gi: number, carbsG: number): { gl: number; classification: 'low' | 'moderate' | 'high' } {
  const gl = Math.round((gi * carbsG) / 100 * 10) / 10;
  let classification: 'low' | 'moderate' | 'high';

  if (gl <= 10) classification = 'low';
  else if (gl <= 20) classification = 'moderate';
  else classification = 'high';

  return { gl, classification };
}

/**
 * Calculate total glycemic load for a meal and simulate blood sugar impact.
 */
export function calculateMealGlycemicLoad(
  ingredients: Array<{
    name: string;
    carbsG: number;
    gi: number | null;
  }>
): GlycemicLoadResult {
  let totalGL = 0;
  const ingredientResults: GlycemicLoadResult['ingredients'] = [];

  for (const ing of ingredients) {
    const gi = ing.gi ?? getGlycemicIndex(ing.name, null);
    if (gi == null || ing.carbsG === 0) continue;

    const { gl, classification } = calculateGL(gi, ing.carbsG);
    totalGL += gl;
    ingredientResults.push({
      name: ing.name,
      gi,
      carbsG: ing.carbsG,
      gl,
      classification,
    });
  }

  totalGL = Math.round(totalGL * 10) / 10;
  let overallClassification: 'low' | 'moderate' | 'high';
  if (totalGL <= 10) overallClassification = 'low';
  else if (totalGL <= 20) overallClassification = 'moderate';
  else overallClassification = 'high';

  // Blood sugar simulation
  let estimatedSpike: 'minimal' | 'moderate' | 'significant';
  let recommendation: string;
  let peakTime: string;

  if (totalGL <= 10) {
    estimatedSpike = 'minimal';
    peakTime = '30-45 min';
    recommendation = 'This meal has a low glycemic impact — steady energy!';
  } else if (totalGL <= 20) {
    estimatedSpike = 'moderate';
    peakTime = '30-60 min';
    recommendation = 'Moderate glycemic impact. Pair with protein or fiber to slow absorption.';
  } else {
    estimatedSpike = 'significant';
    peakTime = '20-45 min';
    recommendation = 'High glycemic load — consider reducing portion or adding protein/fat to blunt the spike.';
  }

  return {
    totalGL,
    classification: overallClassification,
    ingredients: ingredientResults,
    bloodSugarSimulation: {
      peakTime,
      estimatedSpike,
      recommendation,
    },
  };
}
