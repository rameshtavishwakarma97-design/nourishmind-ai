/**
 * Nutrition-related types used across the app.
 * These types define the contracts between the meal parser, nutrition analyzer,
 * verification passes, and the UI components.
 */

// ============================================
// Parsed Ingredient (output of Meal Parser)
// ============================================
export interface ParsedIngredient {
  ingredientName: string;
  brandName: string | null;
  quantityG: number | null;
  quantityUnit: string | null;
  quantityDisplay: string | null;
  needsClarification: boolean;
}

export interface ParsedMealResult {
  mealType: string;
  parsedIngredients: ParsedIngredient[];
  clarificationNeeded: boolean;
  clarificationQuestion: string | null;
  plausibilityWarning: string | null;
}

// ============================================
// Ingredient Nutrition (after DB lookup / LLM fallback)
// ============================================
export interface IngredientNutrition {
  ingredientName: string;
  brandName: string | null;
  quantityG: number;
  quantityDisplay: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  ironMg: number;
  calciumMg: number;
  magnesiumMg: number;
  potassiumMg: number;
  sodiumMg: number;
  vitaminB12Mcg: number;
  vitaminDIu: number;
  zincMg: number;
  folateMcg: number;
  confidenceScore: number;
  confidenceSource: 'ifct_verified' | 'usda_verified' | 'brand_db_verified' | 'llm_estimated' | 'user_corrected';
  dbReferenceId: string | null;
}

// ============================================
// Nutrition Totals (aggregated from all ingredients)
// ============================================
export interface NutritionTotals {
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  totalFiberG: number;
  totalIronMg: number;
  totalCalciumMg: number;
  totalMagnesiumMg: number;
  totalPotassiumMg: number;
  totalSodiumMg: number;
  totalVitaminB12Mcg: number;
  totalVitaminDIu: number;
  totalZincMg: number;
  totalFolateMcg: number;
}

// ============================================
// Meal Analysis Result (full output of nutrition-analyze)
// ============================================
export interface MealAnalysisResult {
  ingredients: IngredientNutrition[];
  totalNutrition: NutritionTotals;
  overallConfidenceScore: number;
  glycemicLoad: number | null;
  warnings: string[];
}

// ============================================
// Verification Pass Results
// ============================================
export interface VerificationPass1Result {
  missingIngredients: string[];
  completenessWarning: string | null;
}

export interface VerificationPass2Result {
  suspiciousIngredients: Array<{
    ingredientName: string;
    field: string;
    value: number;
    reason: string;
  }>;
  plausibilityWarning: string | null;
}

export interface VerificationPass3Result {
  totalWarnings: string[];
  suggestSplitting: boolean;
}

export interface VerificationResult {
  isValid: boolean;
  pass1: VerificationPass1Result;
  pass2: VerificationPass2Result;
  pass3: VerificationPass3Result;
  correctedValues?: Partial<NutritionTotals>;
}

// ============================================
// Per-100g Nutrition (raw DB format)
// ============================================
export interface Per100gNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ironMg: number;
  calciumMg: number;
  magnesiumMg: number;
  potassiumMg: number;
  sodiumMg: number;
  vitaminB12Mcg: number;
  vitaminDIu: number;
  zincMg: number;
  folateMcg: number;
  glycemicIndex: number | null;
}

// ============================================
// Nutrition Lookup Result from any DB
// ============================================
export interface NutritionLookupResult {
  found: boolean;
  source: 'ifct' | 'usda' | 'brand' | 'llm_fallback';
  foodName: string;
  per100g: Per100gNutrition | null;
  confidenceScore: number;
  dbReferenceId: string | null;
}

// ============================================
// FODMAP Types
// ============================================
export type FodmapRisk = 'low' | 'moderate' | 'high';

export interface FodmapEntry {
  foodName: string;
  risk: FodmapRisk;
  category: string;
  servingLimit: string | null;
  notes: string | null;
}

export interface FodmapCheckResult {
  status: 'safe' | 'caution' | 'risk';
  flaggedIngredients: Array<{
    ingredientName: string;
    risk: FodmapRisk;
    servingLimit: string | null;
  }>;
  overallRisk: FodmapRisk;
}

// ============================================
// Daily Nutrition Targets (RDA-based)
// ============================================
export interface DailyTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  ironMg: number;
  calciumMg: number;
  magnesiumMg: number;
  potassiumMg: number;
  sodiumMg: number;
  vitaminB12Mcg: number;
  vitaminDIu: number;
  zincMg: number;
  folateMcg: number;
  waterMl: number;
}

// ============================================
// Glycemic Load
// ============================================
export interface GlycemicLoadResult {
  totalGL: number;
  perIngredient: Array<{
    ingredientName: string;
    gi: number;
    carbsG: number;
    gl: number;
  }>;
  classification: 'low' | 'medium' | 'high';
}
