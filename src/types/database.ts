/**
 * Database types — mirrors the Supabase PostgreSQL schema exactly.
 * Auto-generate with: npx supabase gen types typescript --project-id ceoswqrioyehspofbdyb > src/types/database.ts
 * These manual types serve as the contract until auto-generation is set up.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfileRow;
        Insert: UserProfileInsert;
        Update: UserProfileUpdate;
      };
      menstrual_cycles: {
        Row: MenstrualCycleRow;
        Insert: MenstrualCycleInsert;
        Update: MenstrualCycleUpdate;
      };
      meal_logs: {
        Row: MealLogRow;
        Insert: MealLogInsert;
        Update: MealLogUpdate;
      };
      meal_ingredients: {
        Row: MealIngredientRow;
        Insert: MealIngredientInsert;
        Update: MealIngredientUpdate;
      };
      saved_meals: {
        Row: SavedMealRow;
        Insert: SavedMealInsert;
        Update: SavedMealUpdate;
      };
      daily_logs: {
        Row: DailyLogRow;
        Insert: DailyLogInsert;
        Update: DailyLogUpdate;
      };
      supplements_medications: {
        Row: SupplementMedicationRow;
        Insert: SupplementMedicationInsert;
        Update: SupplementMedicationUpdate;
      };
      user_exceptions: {
        Row: UserExceptionRow;
        Insert: UserExceptionInsert;
        Update: UserExceptionUpdate;
      };
      user_commitments: {
        Row: UserCommitmentRow;
        Insert: UserCommitmentInsert;
        Update: UserCommitmentUpdate;
      };
      ifct_foods: {
        Row: IfctFoodRow;
        Insert: IfctFoodInsert;
        Update: IfctFoodUpdate;
      };
      indian_brands: {
        Row: IndianBrandRow;
        Insert: IndianBrandInsert;
        Update: IndianBrandUpdate;
      };
      drug_nutrient_interactions: {
        Row: DrugNutrientInteractionRow;
        Insert: DrugNutrientInteractionInsert;
        Update: DrugNutrientInteractionUpdate;
      };
      ai_conversation_memory: {
        Row: AiConversationMemoryRow;
        Insert: AiConversationMemoryInsert;
        Update: AiConversationMemoryUpdate;
      };
      gut_symptom_logs: {
        Row: GutSymptomLogRow;
        Insert: GutSymptomLogInsert;
        Update: GutSymptomLogUpdate;
      };
      hydration_logs: {
        Row: HydrationLogRow;
        Insert: HydrationLogInsert;
        Update: HydrationLogUpdate;
      };
      usda_cache: {
        Row: UsdaCacheRow;
        Insert: UsdaCacheInsert;
        Update: UsdaCacheUpdate;
      };
    };
  };
}

// ============================================
// user_profiles
// ============================================
export interface UserProfileRow {
  id: string;
  full_name: string | null;
  age: number | null;
  biological_sex: 'male' | 'female' | 'prefer_not_to_say' | null;
  height_cm: number | null;
  weight_kg: number | null;
  primary_goal: 'weight_loss' | 'muscle_gain' | 'maintain' | 'manage_condition' | 'general_wellness' | null;
  dietary_pattern: 'vegetarian' | 'non_veg' | 'vegan' | 'jain' | 'intermittent_fasting' | 'no_restriction' | null;
  health_conditions: string[] | null;
  food_allergies: string[] | null;
  occupation: string | null;
  typical_wake_time: string | null;
  typical_sleep_time: string | null;
  typical_workout_time: string | null;
  workout_type: string | null;
  workout_duration_mins: number | null;
  ai_context_field: string | null;
  onboarding_complete: boolean;
  onboarding_day: number;
  hydration_target_ml: number;
  wellness_score_breakdown: Json | null;
  created_at: string;
  updated_at: string;
}

export type UserProfileInsert = Partial<UserProfileRow> & { id: string };
export type UserProfileUpdate = Partial<UserProfileRow>;

// ============================================
// menstrual_cycles
// ============================================
export interface MenstrualCycleRow {
  id: string;
  user_id: string;
  last_period_start: string;
  cycle_length_days: number;
  period_duration_days: number;
  tracking_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export type MenstrualCycleInsert = Omit<MenstrualCycleRow, 'id' | 'created_at' | 'updated_at'> & { id?: string };
export type MenstrualCycleUpdate = Partial<MenstrualCycleRow>;

// ============================================
// meal_logs
// ============================================
export interface MealLogRow {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'pre_workout' | 'post_workout' | 'other';
  raw_input: string;
  logged_at: string;
  created_at: string;
  total_calories: number | null;
  total_protein_g: number | null;
  total_carbs_g: number | null;
  total_fat_g: number | null;
  total_fiber_g: number | null;
  total_iron_mg: number | null;
  total_calcium_mg: number | null;
  total_magnesium_mg: number | null;
  total_potassium_mg: number | null;
  total_sodium_mg: number | null;
  total_vitamin_b12_mcg: number | null;
  total_vitamin_d_iu: number | null;
  total_zinc_mg: number | null;
  total_folate_mcg: number | null;
  overall_confidence_score: number | null;
  glycemic_load: number | null;
  notes: string | null;
  is_saved_meal: boolean;
  saved_meal_id: string | null;
}

export type MealLogInsert = Omit<MealLogRow, 'id' | 'created_at'> & { id?: string };
export type MealLogUpdate = Partial<MealLogRow>;

// ============================================
// meal_ingredients
// ============================================
export interface MealIngredientRow {
  id: string;
  meal_log_id: string;
  ingredient_name: string;
  brand_name: string | null;
  quantity_g: number | null;
  quantity_unit: string | null;
  quantity_display: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  iron_mg: number | null;
  calcium_mg: number | null;
  magnesium_mg: number | null;
  potassium_mg: number | null;
  sodium_mg: number | null;
  vitamin_b12_mcg: number | null;
  vitamin_d_iu: number | null;
  zinc_mg: number | null;
  folate_mcg: number | null;
  confidence_score: number | null;
  confidence_source: 'ifct_verified' | 'usda_verified' | 'brand_db_verified' | 'llm_estimated' | 'user_corrected' | null;
  db_reference_id: string | null;
}

export type MealIngredientInsert = Omit<MealIngredientRow, 'id'> & { id?: string };
export type MealIngredientUpdate = Partial<MealIngredientRow>;

// ============================================
// saved_meals
// ============================================
export interface SavedMealRow {
  id: string;
  user_id: string;
  meal_name: string;
  version: number;
  ingredients: Json;
  total_macros: Json;
  meal_type: string | null;
  times_logged: number;
  last_logged_at: string | null;
  is_active: boolean;
  created_at: string;
}

export type SavedMealInsert = Omit<SavedMealRow, 'id' | 'created_at' | 'times_logged'> & { id?: string };
export type SavedMealUpdate = Partial<SavedMealRow>;

// ============================================
// daily_logs
// ============================================
export interface DailyLogRow {
  id: string;
  user_id: string;
  log_date: string;
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  total_fiber_g: number;
  water_ml: number;
  sleep_hours: number | null;
  sleep_start: string | null;
  sleep_end: string | null;
  mood_score: number | null;
  mood_note: string | null;
  energy_score: number | null;
  stress_score: number | null;
  steps: number | null;
  workout_logged: boolean;
  workout_type: string | null;
  workout_duration_mins: number | null;
  fasting_window_hours: number | null;
  fasting_window_start: string | null;
  fasting_window_end: string | null;
  gut_symptom_score: number | null;
  daily_wellness_score: number | null;
  recap_generated: boolean;
}

export type DailyLogInsert = Omit<DailyLogRow, 'id'> & { id?: string };
export type DailyLogUpdate = Partial<DailyLogRow>;

// ============================================
// supplements_medications
// ============================================
export interface SupplementMedicationRow {
  id: string;
  user_id: string;
  name: string;
  type: 'supplement' | 'medication' | 'ayurvedic';
  dose_amount: number | null;
  dose_unit: string | null;
  frequency: string | null;
  time_of_day: 'morning' | 'afternoon' | 'evening' | 'night' | 'with_meal' | null;
  with_food: boolean;
  is_active: boolean;
  created_at: string;
}

export type SupplementMedicationInsert = Omit<SupplementMedicationRow, 'id' | 'created_at'> & { id?: string };
export type SupplementMedicationUpdate = Partial<SupplementMedicationRow>;

// ============================================
// user_exceptions
// ============================================
export interface UserExceptionRow {
  id: string;
  user_id: string;
  exception_type: string;
  original_value: string | null;
  modified_value: string | null;
  reason: string | null;
  is_permanent: boolean;
  created_at: string;
  expires_at: string | null;
}

export type UserExceptionInsert = Omit<UserExceptionRow, 'id' | 'created_at'> & { id?: string };
export type UserExceptionUpdate = Partial<UserExceptionRow>;

// ============================================
// user_commitments
// ============================================
export interface UserCommitmentRow {
  id: string;
  user_id: string;
  commitment_text: string;
  committed_at: string;
  follow_up_date: string | null;
  outcome: 'kept' | 'broken' | 'modified' | 'pending' | null;
  outcome_note: string | null;
  resolved_at: string | null;
}

export type UserCommitmentInsert = Omit<UserCommitmentRow, 'id' | 'committed_at'> & { id?: string };
export type UserCommitmentUpdate = Partial<UserCommitmentRow>;

// ============================================
// ifct_foods
// ============================================
export interface IfctFoodRow {
  id: string;
  food_name: string;
  food_name_hindi: string | null;
  food_group: string | null;
  region: string | null;
  cooking_state: string | null;
  per_100g_calories: number | null;
  per_100g_protein: number | null;
  per_100g_carbs: number | null;
  per_100g_fat: number | null;
  per_100g_fiber: number | null;
  per_100g_iron_mg: number | null;
  per_100g_calcium_mg: number | null;
  per_100g_magnesium_mg: number | null;
  per_100g_potassium_mg: number | null;
  per_100g_sodium_mg: number | null;
  per_100g_vitamin_b12_mcg: number | null;
  per_100g_vitamin_d_iu: number | null;
  per_100g_zinc_mg: number | null;
  per_100g_folate_mcg: number | null;
  glycemic_index: number | null;
}

export type IfctFoodInsert = IfctFoodRow;
export type IfctFoodUpdate = Partial<IfctFoodRow>;

// ============================================
// indian_brands
// ============================================
export interface IndianBrandRow {
  id: string;
  brand_name: string;
  product_name: string;
  variant: string | null;
  pack_size_g: number | null;
  price_inr: number | null;
  barcode: string | null;
  per_100g_calories: number | null;
  per_100g_protein: number | null;
  per_100g_carbs: number | null;
  per_100g_fat: number | null;
  per_100g_fiber: number | null;
  per_100g_sodium_mg: number | null;
  serving_size_g: number | null;
  serving_size_display: string | null;
  is_verified: boolean;
  last_verified_at: string | null;
}

export type IndianBrandInsert = Omit<IndianBrandRow, 'id'> & { id?: string };
export type IndianBrandUpdate = Partial<IndianBrandRow>;

// ============================================
// drug_nutrient_interactions
// ============================================
export interface DrugNutrientInteractionRow {
  id: string;
  supplement_keyword: string;
  food_keyword: string;
  interaction_type: 'reduces_absorption' | 'increases_risk' | 'timing_conflict';
  severity: 'low' | 'medium' | 'high';
  flag_message: string;
  recommendation: string;
}

export type DrugNutrientInteractionInsert = Omit<DrugNutrientInteractionRow, 'id'> & { id?: string };
export type DrugNutrientInteractionUpdate = Partial<DrugNutrientInteractionRow>;

// ============================================
// ai_conversation_memory
// ============================================
export interface AiConversationMemoryRow {
  id: string;
  user_id: string;
  memory_type: 'meal_preference' | 'commitment' | 'health_context' | 'exception' | 'behavioral_pattern' | 'food_correction';
  content: string;
  embedding: number[] | null;
  importance_score: number | null;
  created_at: string;
  expires_at: string | null;
}

export type AiConversationMemoryInsert = Omit<AiConversationMemoryRow, 'id' | 'created_at'> & { id?: string };
export type AiConversationMemoryUpdate = Partial<AiConversationMemoryRow>;

// ============================================
// gut_symptom_logs (TRD v2)
// ============================================
export interface GutSymptomLogRow {
  id: string;
  user_id: string;
  log_date: string;
  symptom_score: number | null;
  notes: string | null;
  created_at: string;
}

export type GutSymptomLogInsert = Omit<GutSymptomLogRow, 'id' | 'created_at'> & { id?: string };
export type GutSymptomLogUpdate = Partial<GutSymptomLogRow>;

// ============================================
// hydration_logs (TRD v2)
// ============================================
export interface HydrationLogRow {
  id: string;
  user_id: string;
  logged_at: string;
  amount_ml: number;
  log_date: string;
}

export type HydrationLogInsert = Omit<HydrationLogRow, 'id' | 'log_date'> & { id?: string };
export type HydrationLogUpdate = Partial<HydrationLogRow>;

// ============================================
// usda_cache (TRD v2)
// ============================================
export interface UsdaCacheRow {
  id: string;
  food_name: string;
  per_100g_calories: number | null;
  per_100g_protein: number | null;
  per_100g_carbs: number | null;
  per_100g_fat: number | null;
  per_100g_fiber: number | null;
  per_100g_sodium_mg: number | null;
  cached_at: string;
  expires_at: string;
}

export type UsdaCacheInsert = UsdaCacheRow;
export type UsdaCacheUpdate = Partial<UsdaCacheRow>;
