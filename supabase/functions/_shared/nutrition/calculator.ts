/**
 * Nutrition Calculator — scales per-100g values to actual grams and aggregates totals.
 */

export interface IngredientNutrition {
  ingredientName: string;
  quantityG: number;
  per100g: Record<string, number | null>;
  source: string;
  confidence: number;
}

export interface NutritionTotals {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  iron_mg: number;
  calcium_mg: number;
  magnesium_mg: number;
  potassium_mg: number;
  sodium_mg: number;
  vitamin_b12_mcg: number;
  vitamin_d_iu: number;
  zinc_mg: number;
  folate_mcg: number;
  sugar_g: number;
}

/**
 * Scale nutrient from per-100g to actual quantity.
 */
export function scaleNutrient(per100gValue: number | null | undefined, quantityG: number): number {
  if (per100gValue == null || isNaN(per100gValue)) return 0;
  return Math.round((per100gValue * quantityG / 100) * 100) / 100;
}

/**
 * Calculate total nutrition for a single ingredient at its actual quantity.
 */
export function calculateIngredientNutrition(
  per100g: Record<string, number | null>,
  quantityG: number
): Record<string, number> {
  const scaled: Record<string, number> = {};
  for (const [key, value] of Object.entries(per100g)) {
    scaled[key] = scaleNutrient(value, quantityG);
  }
  return scaled;
}

/**
 * Aggregate nutrition from multiple ingredients into meal totals.
 */
export function aggregateMealTotals(ingredients: IngredientNutrition[]): NutritionTotals {
  const totals: NutritionTotals = {
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    fiber_g: 0,
    iron_mg: 0,
    calcium_mg: 0,
    magnesium_mg: 0,
    potassium_mg: 0,
    sodium_mg: 0,
    vitamin_b12_mcg: 0,
    vitamin_d_iu: 0,
    zinc_mg: 0,
    folate_mcg: 0,
    sugar_g: 0,
  };

  for (const ingredient of ingredients) {
    const factor = ingredient.quantityG / 100;

    totals.calories += (ingredient.per100g.calories ?? 0) * factor;
    totals.protein_g += (ingredient.per100g.protein_g ?? 0) * factor;
    totals.carbs_g += (ingredient.per100g.carbs_g ?? 0) * factor;
    totals.fat_g += (ingredient.per100g.fat_g ?? 0) * factor;
    totals.fiber_g += (ingredient.per100g.fiber_g ?? 0) * factor;
    totals.iron_mg += (ingredient.per100g.iron_mg ?? 0) * factor;
    totals.calcium_mg += (ingredient.per100g.calcium_mg ?? 0) * factor;
    totals.magnesium_mg += (ingredient.per100g.magnesium_mg ?? 0) * factor;
    totals.potassium_mg += (ingredient.per100g.potassium_mg ?? 0) * factor;
    totals.sodium_mg += (ingredient.per100g.sodium_mg ?? 0) * factor;
    totals.vitamin_b12_mcg += (ingredient.per100g.vitamin_b12_mcg ?? 0) * factor;
    totals.vitamin_d_iu += (ingredient.per100g.vitamin_d_iu ?? 0) * factor;
    totals.zinc_mg += (ingredient.per100g.zinc_mg ?? 0) * factor;
    totals.folate_mcg += (ingredient.per100g.folate_mcg ?? 0) * factor;
    totals.sugar_g += (ingredient.per100g.sugar_g ?? 0) * factor;
  }

  // Round all values
  for (const key of Object.keys(totals) as (keyof NutritionTotals)[]) {
    totals[key] = Math.round(totals[key] * 10) / 10;
  }

  return totals;
}

/**
 * Calculate composite confidence score for a meal.
 * Weighted average based on calorie contribution of each ingredient.
 */
export function calculateMealConfidence(ingredients: IngredientNutrition[]): number {
  if (ingredients.length === 0) return 0;

  let totalCalWeight = 0;
  let weightedConfidence = 0;

  for (const ing of ingredients) {
    const ingCals = scaleNutrient(ing.per100g.calories ?? 0, ing.quantityG);
    totalCalWeight += ingCals;
    weightedConfidence += ing.confidence * ingCals;
  }

  if (totalCalWeight === 0) {
    // Fallback: simple average
    return ingredients.reduce((sum, i) => sum + i.confidence, 0) / ingredients.length;
  }

  return Math.round((weightedConfidence / totalCalWeight) * 100) / 100;
}

/**
 * Calculate daily targets based on user profile.
 * Uses Mifflin-St Jeor equation for BMR estimation.
 */
export function calculateDailyTargets(profile: {
  weight_kg: number | null;
  height_cm: number | null;
  age: number | null;
  biological_sex: string | null;
  activity_level: string | null;
  primary_goal: string | null;
}): {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  waterMl: number;
} {
  const weight = profile.weight_kg ?? 65;
  const height = profile.height_cm ?? 165;
  const age = profile.age ?? 25;
  const sex = profile.biological_sex ?? 'not_specified';

  // Mifflin-St Jeor BMR
  let bmr: number;
  if (sex === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (sex === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 78; // midpoint
  }

  // Activity multiplier
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };
  const activityFactor = activityMultipliers[profile.activity_level ?? 'lightly_active'] || 1.375;
  let tdee = bmr * activityFactor;

  // Goal adjustment
  switch (profile.primary_goal) {
    case 'weight_loss':
      tdee *= 0.85; // 15% deficit
      break;
    case 'muscle_gain':
      tdee *= 1.10; // 10% surplus
      break;
    case 'maintenance':
    default:
      break;
  }

  const calories = Math.round(tdee);

  // Macro split (adjustable per goal)
  let proteinRatio: number, carbRatio: number, fatRatio: number;
  switch (profile.primary_goal) {
    case 'weight_loss':
      proteinRatio = 0.30; carbRatio = 0.40; fatRatio = 0.30;
      break;
    case 'muscle_gain':
      proteinRatio = 0.30; carbRatio = 0.45; fatRatio = 0.25;
      break;
    default:
      proteinRatio = 0.20; carbRatio = 0.50; fatRatio = 0.30;
  }

  return {
    calories,
    proteinG: Math.round((calories * proteinRatio) / 4), // 4 cal/g protein
    carbsG: Math.round((calories * carbRatio) / 4),       // 4 cal/g carbs
    fatG: Math.round((calories * fatRatio) / 9),           // 9 cal/g fat
    fiberG: sex === 'female' ? 25 : 30,
    waterMl: Math.round(weight * 35), // 35ml per kg body weight
  };
}
