-- ============================================
-- NOURISHMIND DATABASE SCHEMA v1.1
-- Platform: Supabase (PostgreSQL 15)
-- Combines TRD v1.0 + TRD v2.0 additions
-- Run this ONCE via Supabase SQL Editor
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- TABLE: user_profiles (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  age INTEGER CHECK (age > 0 AND age < 120),
  biological_sex TEXT CHECK (biological_sex IN ('male', 'female', 'prefer_not_to_say')),
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),
  primary_goal TEXT CHECK (primary_goal IN (
    'weight_loss', 'muscle_gain', 'maintain', 'manage_condition', 'general_wellness'
  )),
  dietary_pattern TEXT CHECK (dietary_pattern IN (
    'vegetarian', 'non_veg', 'vegan', 'jain', 'intermittent_fasting', 'no_restriction'
  )),
  health_conditions TEXT[],
  food_allergies TEXT[],
  occupation TEXT,
  typical_wake_time TIME,
  typical_sleep_time TIME,
  typical_workout_time TIME,
  workout_type TEXT,
  workout_duration_mins INTEGER,
  ai_context_field TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  onboarding_day INTEGER DEFAULT 1,
  hydration_target_ml INTEGER DEFAULT 2500,
  wellness_score_breakdown JSONB,
  notification_preferences JSONB DEFAULT '{"dailyMealReminder":true,"endOfDayRecap":true,"waterReminders":true,"weeklyStory":true}'::jsonb,
  dark_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: menstrual_cycles (opt-in, women only)
-- ============================================
CREATE TABLE IF NOT EXISTS public.menstrual_cycles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  last_period_start DATE NOT NULL,
  cycle_length_days INTEGER DEFAULT 28,
  period_duration_days INTEGER DEFAULT 5,
  tracking_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: saved_meals (must exist before meal_logs FK)
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_meals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  meal_name TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  ingredients JSONB NOT NULL,
  total_macros JSONB NOT NULL,
  meal_type TEXT,
  times_logged INTEGER DEFAULT 0,
  last_logged_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: meal_logs (core logging table)
-- ============================================
CREATE TABLE IF NOT EXISTS public.meal_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  meal_type TEXT CHECK (meal_type IN (
    'breakfast', 'lunch', 'dinner', 'snacks', 'pre_workout', 'post_workout', 'other'
  )),
  raw_input TEXT NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  total_calories NUMERIC(8,2),
  total_protein_g NUMERIC(7,2),
  total_carbs_g NUMERIC(7,2),
  total_fat_g NUMERIC(7,2),
  total_fiber_g NUMERIC(7,2),
  total_iron_mg NUMERIC(7,3),
  total_calcium_mg NUMERIC(7,2),
  total_magnesium_mg NUMERIC(7,2),
  total_potassium_mg NUMERIC(7,2),
  total_sodium_mg NUMERIC(7,2),
  total_vitamin_b12_mcg NUMERIC(7,3),
  total_vitamin_d_iu NUMERIC(7,2),
  total_zinc_mg NUMERIC(7,3),
  total_folate_mcg NUMERIC(7,2),
  overall_confidence_score NUMERIC(4,3),
  glycemic_load NUMERIC(6,2),
  notes TEXT,
  is_saved_meal BOOLEAN DEFAULT FALSE,
  saved_meal_id UUID REFERENCES public.saved_meals(id) ON DELETE SET NULL
);

-- ============================================
-- TABLE: meal_ingredients (per-ingredient detail)
-- ============================================
CREATE TABLE IF NOT EXISTS public.meal_ingredients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  meal_log_id UUID REFERENCES public.meal_logs(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  brand_name TEXT,
  quantity_g NUMERIC(8,2),
  quantity_unit TEXT,
  quantity_display TEXT,
  calories NUMERIC(8,2),
  protein_g NUMERIC(7,2),
  carbs_g NUMERIC(7,2),
  fat_g NUMERIC(7,2),
  fiber_g NUMERIC(7,2),
  iron_mg NUMERIC(7,3),
  calcium_mg NUMERIC(7,2),
  magnesium_mg NUMERIC(7,2),
  potassium_mg NUMERIC(7,2),
  sodium_mg NUMERIC(7,2),
  vitamin_b12_mcg NUMERIC(7,3),
  vitamin_d_iu NUMERIC(7,2),
  zinc_mg NUMERIC(7,3),
  folate_mcg NUMERIC(7,2),
  confidence_score NUMERIC(4,3),
  confidence_source TEXT CHECK (confidence_source IN (
    'ifct_verified', 'usda_verified', 'brand_db_verified',
    'llm_estimated', 'user_corrected'
  )),
  db_reference_id TEXT
);

-- ============================================
-- TABLE: daily_logs (aggregated daily data)
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  total_calories NUMERIC(8,2) DEFAULT 0,
  total_protein_g NUMERIC(7,2) DEFAULT 0,
  total_carbs_g NUMERIC(7,2) DEFAULT 0,
  total_fat_g NUMERIC(7,2) DEFAULT 0,
  total_fiber_g NUMERIC(7,2) DEFAULT 0,
  water_ml INTEGER DEFAULT 0,
  sleep_hours NUMERIC(4,2),
  sleep_start TIME,
  sleep_end TIME,
  mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 5),
  mood_note TEXT,
  energy_score INTEGER CHECK (energy_score BETWEEN 1 AND 5),
  stress_score INTEGER CHECK (stress_score BETWEEN 1 AND 5),
  steps INTEGER,
  workout_logged BOOLEAN DEFAULT FALSE,
  workout_type TEXT,
  workout_duration_mins INTEGER,
  fasting_window_hours NUMERIC(5,2),
  fasting_window_start TIMESTAMPTZ,
  fasting_window_end TIMESTAMPTZ,
  gut_symptom_score INTEGER CHECK (gut_symptom_score BETWEEN 1 AND 5),
  daily_wellness_score NUMERIC(5,2),
  recap_generated BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, log_date)
);

-- ============================================
-- TABLE: supplements_medications
-- ============================================
CREATE TABLE IF NOT EXISTS public.supplements_medications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('supplement', 'medication', 'ayurvedic')),
  dose_amount NUMERIC(8,3),
  dose_unit TEXT,
  frequency TEXT,
  time_of_day TEXT CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night', 'with_meal')),
  with_food BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: user_exceptions
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_exceptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  exception_type TEXT NOT NULL,
  original_value TEXT,
  modified_value TEXT,
  reason TEXT,
  is_permanent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- ============================================
-- TABLE: user_commitments
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_commitments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  commitment_text TEXT NOT NULL,
  committed_at TIMESTAMPTZ DEFAULT NOW(),
  follow_up_date DATE,
  outcome TEXT CHECK (outcome IN ('kept', 'broken', 'modified', 'pending')),
  outcome_note TEXT,
  resolved_at TIMESTAMPTZ
);

-- ============================================
-- TABLE: ifct_foods (IFCT 2017 nutrition database)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ifct_foods (
  id TEXT PRIMARY KEY,
  food_name TEXT NOT NULL,
  food_name_hindi TEXT,
  food_group TEXT,
  region TEXT,
  cooking_state TEXT,
  per_100g_calories NUMERIC(8,2),
  per_100g_protein NUMERIC(7,2),
  per_100g_carbs NUMERIC(7,2),
  per_100g_fat NUMERIC(7,2),
  per_100g_fiber NUMERIC(7,2),
  per_100g_iron_mg NUMERIC(7,3),
  per_100g_calcium_mg NUMERIC(7,2),
  per_100g_magnesium_mg NUMERIC(7,2),
  per_100g_potassium_mg NUMERIC(7,2),
  per_100g_sodium_mg NUMERIC(7,2),
  per_100g_vitamin_b12_mcg NUMERIC(7,3),
  per_100g_vitamin_d_iu NUMERIC(7,2),
  per_100g_zinc_mg NUMERIC(7,3),
  per_100g_folate_mcg NUMERIC(7,2),
  glycemic_index NUMERIC(5,2),
  search_vector tsvector
);

CREATE INDEX IF NOT EXISTS idx_ifct_search ON public.ifct_foods USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_ifct_food_group ON public.ifct_foods(food_group);

-- ============================================
-- TABLE: indian_brands (Indian packaged food DB)
-- ============================================
CREATE TABLE IF NOT EXISTS public.indian_brands (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  brand_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  variant TEXT,
  pack_size_g NUMERIC(8,2),
  price_inr NUMERIC(8,2),
  barcode TEXT UNIQUE,
  per_100g_calories NUMERIC(8,2),
  per_100g_protein NUMERIC(7,2),
  per_100g_carbs NUMERIC(7,2),
  per_100g_fat NUMERIC(7,2),
  per_100g_fiber NUMERIC(7,2),
  per_100g_sodium_mg NUMERIC(7,2),
  serving_size_g NUMERIC(7,2),
  serving_size_display TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  last_verified_at DATE,
  search_vector tsvector
);

CREATE INDEX IF NOT EXISTS idx_brands_search ON public.indian_brands USING GIN(search_vector);

-- ============================================
-- TABLE: drug_nutrient_interactions
-- ============================================
CREATE TABLE IF NOT EXISTS public.drug_nutrient_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  supplement_keyword TEXT NOT NULL,
  food_keyword TEXT NOT NULL,
  interaction_type TEXT CHECK (interaction_type IN ('reduces_absorption', 'increases_risk', 'timing_conflict')),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
  flag_message TEXT NOT NULL,
  recommendation TEXT NOT NULL
);

-- ============================================
-- TABLE: ai_conversation_memory (vector memory)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_conversation_memory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  memory_type TEXT CHECK (memory_type IN (
    'meal_preference', 'commitment', 'health_context',
    'exception', 'behavioral_pattern', 'food_correction'
  )),
  content TEXT NOT NULL,
  embedding vector(768),
  importance_score NUMERIC(4,3),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_memory_embedding ON public.ai_conversation_memory
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_memory_user ON public.ai_conversation_memory(user_id);

-- ============================================
-- TABLE: gut_symptom_logs (TRD v2 — FODMAP tracker)
-- ============================================
CREATE TABLE IF NOT EXISTS public.gut_symptom_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  symptom_score INTEGER CHECK (symptom_score BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

-- ============================================
-- TABLE: hydration_logs (TRD v2 — water tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS public.hydration_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  amount_ml INTEGER NOT NULL,
  log_date DATE GENERATED ALWAYS AS ((logged_at AT TIME ZONE 'Asia/Kolkata')::DATE) STORED
);

-- ============================================
-- TABLE: usda_cache (TRD v2 — USDA API cache)
-- ============================================
CREATE TABLE IF NOT EXISTS public.usda_cache (
  id TEXT PRIMARY KEY,
  food_name TEXT NOT NULL,
  per_100g_calories NUMERIC(8,2),
  per_100g_protein NUMERIC(7,2),
  per_100g_carbs NUMERIC(7,2),
  per_100g_fat NUMERIC(7,2),
  per_100g_fiber NUMERIC(7,2),
  per_100g_sodium_mg NUMERIC(7,2),
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '90 days'
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) — MANDATORY
-- ============================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplements_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menstrual_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversation_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gut_symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hydration_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users access own data" ON public.user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users access own meals" ON public.meal_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own ingredients" ON public.meal_ingredients
  FOR ALL USING (
    auth.uid() = (SELECT user_id FROM public.meal_logs WHERE id = meal_log_id)
  );

CREATE POLICY "Users access own daily logs" ON public.daily_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own saved meals" ON public.saved_meals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own supplements" ON public.supplements_medications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own exceptions" ON public.user_exceptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own commitments" ON public.user_commitments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own cycle data" ON public.menstrual_cycles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own memory" ON public.ai_conversation_memory
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own gut logs" ON public.gut_symptom_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own hydration" ON public.hydration_logs
  FOR ALL USING (auth.uid() = user_id);

-- Public read access for nutrition databases (no auth required)
ALTER TABLE public.ifct_foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read IFCT" ON public.ifct_foods
  FOR SELECT USING (true);

ALTER TABLE public.indian_brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read brands" ON public.indian_brands
  FOR SELECT USING (true);

ALTER TABLE public.drug_nutrient_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read interactions" ON public.drug_nutrient_interactions
  FOR SELECT USING (true);

ALTER TABLE public.usda_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read USDA cache" ON public.usda_cache
  FOR SELECT USING (true);
-- Service role can write to usda_cache (Edge Functions use service role for caching)

-- ============================================
-- FUNCTIONS: Auto-update timestamps
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_menstrual_cycles
  BEFORE UPDATE ON public.menstrual_cycles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- FUNCTION: Auto-update IFCT search vector
-- ============================================
CREATE OR REPLACE FUNCTION public.ifct_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.food_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.food_name_hindi, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.food_group, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.cooking_state, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ifct_search_update
  BEFORE INSERT OR UPDATE ON public.ifct_foods
  FOR EACH ROW EXECUTE FUNCTION public.ifct_search_vector_update();

-- ============================================
-- FUNCTION: Auto-update brands search vector
-- ============================================
CREATE OR REPLACE FUNCTION public.brands_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.brand_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.product_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.variant, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brands_search_update
  BEFORE INSERT OR UPDATE ON public.indian_brands
  FOR EACH ROW EXECUTE FUNCTION public.brands_search_vector_update();

-- ============================================
-- FUNCTION: Upsert daily totals (called after meal logging)
-- ============================================
CREATE OR REPLACE FUNCTION public.upsert_daily_totals(p_user_id UUID, p_log_date DATE)
RETURNS VOID AS $$
DECLARE
  v_totals RECORD;
BEGIN
  SELECT
    COALESCE(SUM(total_calories), 0) AS cal,
    COALESCE(SUM(total_protein_g), 0) AS pro,
    COALESCE(SUM(total_carbs_g), 0) AS carb,
    COALESCE(SUM(total_fat_g), 0) AS fat,
    COALESCE(SUM(total_fiber_g), 0) AS fib
  INTO v_totals
  FROM public.meal_logs
  WHERE user_id = p_user_id
    AND (logged_at AT TIME ZONE 'Asia/Kolkata')::DATE = p_log_date;

  INSERT INTO public.daily_logs (user_id, log_date, total_calories, total_protein_g, total_carbs_g, total_fat_g, total_fiber_g)
  VALUES (p_user_id, p_log_date, v_totals.cal, v_totals.pro, v_totals.carb, v_totals.fat, v_totals.fib)
  ON CONFLICT (user_id, log_date)
  DO UPDATE SET
    total_calories = v_totals.cal,
    total_protein_g = v_totals.pro,
    total_carbs_g = v_totals.carb,
    total_fat_g = v_totals.fat,
    total_fiber_g = v_totals.fib;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Calculate fasting window
-- ============================================
CREATE OR REPLACE FUNCTION public.calculate_fasting_window(p_user_id UUID, p_log_date DATE)
RETURNS TABLE(fasting_hours NUMERIC, fasting_start TIMESTAMPTZ, fasting_end TIMESTAMPTZ) AS $$
DECLARE
  v_last_meal TIMESTAMPTZ;
  v_first_meal TIMESTAMPTZ;
  v_fasting_hrs NUMERIC;
BEGIN
  -- Last meal of previous day
  SELECT MAX(logged_at) INTO v_last_meal
  FROM public.meal_logs
  WHERE user_id = p_user_id
    AND (logged_at AT TIME ZONE 'Asia/Kolkata')::DATE = p_log_date - 1;

  -- First meal of target day
  SELECT MIN(logged_at) INTO v_first_meal
  FROM public.meal_logs
  WHERE user_id = p_user_id
    AND (logged_at AT TIME ZONE 'Asia/Kolkata')::DATE = p_log_date;

  IF v_last_meal IS NOT NULL AND v_first_meal IS NOT NULL THEN
    v_fasting_hrs := EXTRACT(EPOCH FROM (v_first_meal - v_last_meal)) / 3600.0;
  ELSE
    v_fasting_hrs := NULL;
  END IF;

  RETURN QUERY SELECT v_fasting_hrs, v_last_meal, v_first_meal;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Auto-create user_profile on auth signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Reminders ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reminders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_text TEXT NOT NULL,
  reminder_time TIME NOT NULL DEFAULT '08:00',
  repeat_type   TEXT NOT NULL DEFAULT 'once' CHECK (repeat_type IN ('once', 'daily', 'weekdays')),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reminders"
  ON public.reminders FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
