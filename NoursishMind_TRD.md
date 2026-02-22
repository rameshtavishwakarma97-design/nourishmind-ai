<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Now I want to make a technical requirement documents.

I want to create using free materials, whatever I can find for free. I also have github student developer pack, Figma pro and copilot so maybe that can help.

I will be making this entirely using Agentic AI, so draft a comprehesive TRD Which will handhold AI through the development process without versioning issues or incompatability problems

Here is your comprehensive Technical Requirements Document, engineered specifically for Agentic AI development with your free toolset.

***

# 📄 Technical Requirements Document (TRD)

**Product Name:** NourishMind
**Document Version:** v1.0
**Author:** Rameshta Vishwakarma
**Date:** February 21, 2026
**Status:** Active — Agentic AI Development Reference
**Companion Document:** PRD v1.0

***

# SECTION 0: INSTRUCTIONS FOR THE AI DEVELOPER AGENT

> **READ THIS FIRST — BEFORE WRITING A SINGLE LINE OF CODE**

This document is your single source of truth. You are an Agentic AI building NourishMind end-to-end. Follow these operating rules at all times:

1. **Never assume a library version** — every dependency in this TRD has an exact pinned version. Use it. Do not upgrade unless instructed
2. **Never generate placeholder code** — every function you write must be functional, tested, and connected to the actual data layer
3. **Follow the folder structure exactly** as defined in Section 3 — do not create new folders or rename existing ones without flagging it
4. **Database schema is the contract** — never modify a table column name or type after it is created without running a migration file. Never drop columns silently
5. **Environment variables are sacred** — never hardcode API keys, secrets, or database URLs. Every external credential lives in `.env.local` (development) and must be documented in `.env.example`
6. **Grounding rule for nutrition data** — the LLM must NEVER generate nutrition values from parametric memory. All nutrition data must be looked up from the structured database first. If not found, the LLM estimates with a confidence score < 80% and flags for review
7. **Test before connecting** — build and test each module in isolation before wiring it to the next. Use the module completion checklist in Section 9
8. **Comment every AI prompt** — every system prompt or LLM call must have a comment block above it explaining what it does, what it receives, and what it must return
9. **Error handling is mandatory** — every API call, database query, and LLM call must have a try/catch block with a user-friendly fallback message
10. **Do not build what is not in this document** — if a feature is not in this TRD, flag it and wait for instruction before building

***

# SECTION 1: FREE TOOLING STACK (Zero-Cost Architecture)

This stack is entirely free, using your GitHub Student Developer Pack, Figma Pro, and GitHub Copilot.[^1][^2]

## 1.1 Complete Tool Inventory

| Layer | Tool | Free Tier / Source | Version |
| :-- | :-- | :-- | :-- |
| **IDE** | VS Code | Free | Latest stable |
| **AI Coding Assistant** | GitHub Copilot Pro | Free via GitHub Student Pack [^1] | Latest |
| **Frontend Framework** | Next.js 14 (App Router) | Free / Open Source | `14.2.x` |
| **UI Library** | Tailwind CSS | Free / Open Source | `3.4.x` |
| **Component Library** | shadcn/ui | Free / Open Source | Latest |
| **Backend** | Next.js API Routes (built-in) | Free — eliminates separate backend server | `14.2.x` |
| **Database** | Supabase | Free tier: 500MB DB, 2GB storage, 50K MAU | Latest |
| **Auth** | Supabase Auth | Free (included in Supabase free tier) | Latest |
| **AI / LLM** | Google Gemini 1.5 Flash API | Free: 15 requests/min, 1M tokens/day via Google AI Studio [^3] | `gemini-1.5-flash` |
| **AI Fallback** | OpenRouter (free models) | Free community models as fallback | Latest |
| **Vector DB (AI Memory)** | Supabase pgvector | Free (built into Supabase PostgreSQL) | Built-in |
| **Deployment** | Vercel | Free hobby tier: unlimited deployments | Latest |
| **Domain** | Namecheap | Free .me domain via GitHub Student Pack [^2] | — |
| **WhatsApp Bot** | Twilio (trial) + Meta WhatsApp Cloud API | Meta WhatsApp Cloud API: Free 1000 conversations/month | Latest |
| **PDF Generation** | React-PDF (`@react-pdf/renderer`) | Free / Open Source | `3.x` |
| **Charts/Graphs** | Recharts | Free / Open Source | `2.x` |
| **Email (transactional)** | Resend | Free: 3000 emails/month | Latest |
| **Design** | Figma Pro | Free via Student Pack [^2] | Latest |
| **Git \& Version Control** | GitHub (Pro) | Free via Student Pack | Latest |
| **CI/CD** | GitHub Actions | Free: 2000 min/month | Latest |
| **Monitoring** | Vercel Analytics | Free (built into Vercel) | Built-in |
| **Error Tracking** | Sentry | Free: 5K errors/month via Student Pack | Latest |
| **Nutrition DB (Indian)** | IFCT 2017 | Free government dataset (NIN India) | 2017 edition |
| **Nutrition DB (Global)** | USDA FoodData Central API | Free / Public API | v1 |


***

# SECTION 2: PINNED DEPENDENCY MANIFEST

> **AI AGENT INSTRUCTION**: Use `package.json` exactly as defined below. Do not upgrade any version during the build. Run `npm install` with this exact manifest.

```json
{
  "name": "nourishmind",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "supabase gen types typescript --local > types/supabase.ts"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "@supabase/supabase-js": "2.45.0",
    "@supabase/ssr": "0.4.0",
    "@google/generative-ai": "0.17.0",
    "ai": "3.4.0",
    "tailwindcss": "3.4.4",
    "shadcn-ui": "0.8.0",
    "@radix-ui/react-dialog": "1.1.1",
    "@radix-ui/react-tabs": "1.1.0",
    "@radix-ui/react-progress": "1.1.0",
    "recharts": "2.12.7",
    "@react-pdf/renderer": "3.4.4",
    "resend": "3.5.0",
    "zod": "3.23.8",
    "date-fns": "3.6.0",
    "lucide-react": "0.424.0",
    "clsx": "2.1.1",
    "tailwind-merge": "2.5.2",
    "framer-motion": "11.3.28",
    "zustand": "4.5.4",
    "react-hook-form": "7.52.2",
    "@hookform/resolvers": "3.9.0",
    "next-themes": "0.3.0",
    "sonner": "1.5.0"
  },
  "devDependencies": {
    "@types/node": "20.14.14",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "typescript": "5.5.4",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.5",
    "postcss": "8.4.40",
    "autoprefixer": "10.4.19"
  }
}
```


***

# SECTION 3: FOLDER STRUCTURE

> **AI AGENT INSTRUCTION**: Create this exact folder structure at project initialization. Do not deviate. Every file mentioned here must exist before proceeding to the next module.

```
nourishmind/
├── .env.local                        ← All secrets live here (never commit)
├── .env.example                      ← Template with key names, no values
├── .gitignore                        ← Include .env.local
├── package.json                      ← Pinned deps from Section 2
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── middleware.ts                     ← Supabase auth middleware
│
├── app/                              ← Next.js 14 App Router
│   ├── layout.tsx                    ← Root layout, ThemeProvider
│   ├── page.tsx                      ← Landing page
│   ├── globals.css
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts         ← Supabase OAuth callback
│   │
│   ├── (app)/                        ← Protected routes (auth required)
│   │   ├── layout.tsx                ← App shell with sidebar
│   │   ├── dashboard/page.tsx
│   │   ├── chat/page.tsx             ← Primary logging interface
│   │   ├── logs/page.tsx             ← Full food log history
│   │   ├── insights/page.tsx         ← Trends, correlations
│   │   ├── profile/page.tsx          ← Carbon copy settings
│   │   └── settings/page.tsx
│   │
│   └── api/                          ← Backend API Routes
│       ├── chat/route.ts             ← Primary AI chat endpoint
│       ├── nutrition/
│       │   ├── analyze/route.ts      ← Meal parsing + nutrition calc
│       │   ├── verify/route.ts       ← 3-pass verification
│       │   └── search/route.ts       ← Ingredient search
│       ├── meals/
│       │   ├── log/route.ts          ← Save meal to DB
│       │   ├── saved/route.ts        ← CRUD for saved recipes
│       │   └── history/route.ts
│       ├── user/
│       │   ├── profile/route.ts
│       │   ├── context/route.ts      ← "Things AI should know" field
│       │   └── summary/route.ts      ← "How AI sees you" card
│       ├── dashboard/
│       │   ├── daily/route.ts
│       │   └── weekly/route.ts
│       ├── whatsapp/
│       │   └── webhook/route.ts      ← WhatsApp bot webhook
│       └── reports/
│           └── pdf/route.ts          ← Clinical PDF generation
│
├── components/
│   ├── ui/                           ← shadcn/ui primitives (auto-generated)
│   ├── chat/
│   │   ├── ChatInterface.tsx         ← Main chat window
│   │   ├── ChatMessage.tsx           ← Individual message bubble
│   │   ├── MealLogCard.tsx           ← Logged meal breakdown card
│   │   ├── QuickLogSuggestions.tsx   ← Saved meal chips
│   │   └── NutritionBreakdown.tsx    ← Ingredient-level macro display
│   ├── dashboard/
│   │   ├── CalorieRing.tsx
│   │   ├── MacroSplit.tsx
│   │   ├── MicroDeficiencyTracker.tsx
│   │   ├── MealTimingChart.tsx
│   │   ├── BloodSugarSimulation.tsx
│   │   ├── MoodNutritionChart.tsx
│   │   ├── FODMAPTracker.tsx
│   │   ├── CyclePhaseCard.tsx
│   │   └── EndOfDayRecap.tsx
│   ├── onboarding/
│   │   ├── OnboardingFlow.tsx
│   │   ├── QuestionStep.tsx
│   │   └── ProfileSummaryCard.tsx
│   └── shared/
│       ├── ConfidenceScore.tsx
│       ├── NutritionBadge.tsx
│       └── LoadingDots.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 ← Browser Supabase client
│   │   ├── server.ts                 ← Server Supabase client
│   │   └── middleware.ts
│   ├── ai/
│   │   ├── gemini.ts                 ← Gemini client init
│   │   ├── prompts/
│   │   │   ├── mealParser.ts         ← System prompt: parse meal input
│   │   │   ├── nutritionAnalyzer.ts  ← System prompt: macro/micro calc
│   │   │   ├── verificationPass.ts   ← System prompt: 3-pass verify
│   │   │   ├── contextBuilder.ts     ← System prompt: user carbon copy
│   │   │   ├── endOfDayRecap.ts      ← System prompt: daily recap
│   │   │   └── whatIfPlanner.ts      ← System prompt: scenario planner
│   │   └── memory/
│   │       ├── embeddings.ts         ← pgvector embedding calls
│   │       └── retrieval.ts          ← Context retrieval from vector DB
│   ├── nutrition/
│   │   ├── ifctLookup.ts             ← Query IFCT database
│   │   ├── usdaLookup.ts             ← Query USDA FoodData API
│   │   ├── brandLookup.ts            ← Query Indian brand DB
│   │   ├── calculator.ts             ← Macro/micro aggregation
│   │   └── glycemicLoad.ts           ← GL calculation for blood sugar sim
│   ├── whatsapp/
│   │   └── messageHandler.ts         ← Parse + respond to WhatsApp msgs
│   └── utils/
│       ├── cn.ts                     ← clsx + tailwind-merge helper
│       ├── dateUtils.ts
│       └── confidenceScore.ts
│
├── types/
│   ├── supabase.ts                   ← Auto-generated from Supabase schema
│   ├── nutrition.ts                  ← NutritionEntry, MacroProfile types
│   ├── user.ts                       ← UserProfile, CarbonCopy types
│   └── chat.ts                       ← ChatMessage, MealLog types
│
├── hooks/
│   ├── useChat.ts
│   ├── useDashboard.ts
│   ├── useUserProfile.ts
│   └── useSavedMeals.ts
│
└── database/
    ├── schema.sql                    ← Complete DB schema (Section 4)
    ├── seed/
    │   ├── ifct_seed.sql             ← IFCT 2017 data import
    │   ├── brands_seed.sql           ← Indian brand database
    │   └── interactions_seed.sql     ← Drug-nutrient interactions
    └── migrations/
        └── 001_initial.sql
```


***

# SECTION 4: DATABASE SCHEMA

> **AI AGENT INSTRUCTION**: Run `schema.sql` exactly once on your Supabase project. Never manually alter tables — use migration files. Every foreign key must be explicitly declared.

```sql
-- ============================================
-- NOURISHMIND DATABASE SCHEMA v1.0
-- Platform: Supabase (PostgreSQL 15)
-- Run this ONCE during project initialization
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- TABLE: users (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.user_profiles (
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
  health_conditions TEXT[],           -- ['ibs', 'pcos', 'anxiety', 'diabetes']
  food_allergies TEXT[],
  occupation TEXT,
  typical_wake_time TIME,
  typical_sleep_time TIME,
  typical_workout_time TIME,
  workout_type TEXT,
  workout_duration_mins INTEGER,
  ai_context_field TEXT,              -- "Things you want AI to know"
  onboarding_complete BOOLEAN DEFAULT FALSE,
  onboarding_day INTEGER DEFAULT 1,   -- tracks progressive profiling day
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: menstrual_cycle (opt-in, women only)
-- ============================================
CREATE TABLE public.menstrual_cycles (
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
-- TABLE: meal_logs (core logging table)
-- ============================================
CREATE TABLE public.meal_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  meal_type TEXT CHECK (meal_type IN (
    'breakfast', 'lunch', 'dinner', 'snacks', 'pre_workout', 'post_workout', 'other'
  )),
  raw_input TEXT NOT NULL,            -- original user message verbatim
  logged_at TIMESTAMPTZ NOT NULL,     -- actual eating time (user-specified or inferred)
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
  overall_confidence_score NUMERIC(4,3), -- 0.000 to 1.000
  glycemic_load NUMERIC(6,2),
  notes TEXT,
  is_saved_meal BOOLEAN DEFAULT FALSE,
  saved_meal_id UUID REFERENCES public.saved_meals(id) ON DELETE SET NULL
);

-- ============================================
-- TABLE: meal_ingredients (per-ingredient detail)
-- ============================================
CREATE TABLE public.meal_ingredients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  meal_log_id UUID REFERENCES public.meal_logs(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  brand_name TEXT,
  quantity_g NUMERIC(8,2),
  quantity_unit TEXT,                 -- 'g', 'ml', 'piece', 'scoop', 'tsp', 'tbsp'
  quantity_display TEXT,              -- human-readable: "1 scoop (30g)"
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
  db_reference_id TEXT               -- FK reference to source database entry
);

-- ============================================
-- TABLE: saved_meals (user recipe library)
-- ============================================
CREATE TABLE public.saved_meals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  meal_name TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  ingredients JSONB NOT NULL,         -- array of ingredient objects
  total_macros JSONB NOT NULL,        -- cached macro totals
  meal_type TEXT,
  times_logged INTEGER DEFAULT 0,
  last_logged_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: daily_logs (aggregated daily data)
-- ============================================
CREATE TABLE public.daily_logs (
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
  fasting_window_hours NUMERIC(5,2),  -- calculated from meal timing
  gut_symptom_score INTEGER CHECK (gut_symptom_score BETWEEN 1 AND 5),
  daily_wellness_score NUMERIC(5,2),  -- 0-100 composite
  recap_generated BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, log_date)
);

-- ============================================
-- TABLE: supplements_medications
-- ============================================
CREATE TABLE public.supplements_medications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('supplement', 'medication', 'ayurvedic')),
  dose_amount NUMERIC(8,3),
  dose_unit TEXT,
  frequency TEXT,                     -- 'daily', 'weekly', 'every_sunday'
  time_of_day TEXT CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night', 'with_meal')),
  with_food BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: user_exceptions (logged user overrides)
-- ============================================
CREATE TABLE public.user_exceptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  exception_type TEXT NOT NULL,       -- 'fasting_window', 'calorie_target', etc.
  original_value TEXT,
  modified_value TEXT,
  reason TEXT,
  is_permanent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- ============================================
-- TABLE: user_commitments (accountability feature)
-- ============================================
CREATE TABLE public.user_commitments (
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
CREATE TABLE public.ifct_foods (
  id TEXT PRIMARY KEY,                -- IFCT food code
  food_name TEXT NOT NULL,
  food_name_hindi TEXT,
  food_group TEXT,
  region TEXT,
  cooking_state TEXT,                 -- 'raw', 'cooked', 'fried'
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
  search_vector tsvector            -- for full-text search
);

CREATE INDEX idx_ifct_search ON public.ifct_foods USING GIN(search_vector);
CREATE INDEX idx_ifct_food_group ON public.ifct_foods(food_group);

-- ============================================
-- TABLE: indian_brands (Indian packaged food DB)
-- ============================================
CREATE TABLE public.indian_brands (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  brand_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  variant TEXT,
  pack_size_g NUMERIC(8,2),
  price_inr NUMERIC(8,2),            -- for price-to-gram mapping
  barcode TEXT UNIQUE,
  per_100g_calories NUMERIC(8,2),
  per_100g_protein NUMERIC(7,2),
  per_100g_carbs NUMERIC(7,2),
  per_100g_fat NUMERIC(7,2),
  per_100g_fiber NUMERIC(7,2),
  per_100g_sodium_mg NUMERIC(7,2),
  serving_size_g NUMERIC(7,2),
  serving_size_display TEXT,         -- "1 scoop (30g)", "₹10 pack (26g)"
  is_verified BOOLEAN DEFAULT FALSE,
  last_verified_at DATE,
  search_vector tsvector
);

CREATE INDEX idx_brands_search ON public.indian_brands USING GIN(search_vector);

-- ============================================
-- TABLE: drug_nutrient_interactions
-- ============================================
CREATE TABLE public.drug_nutrient_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  supplement_keyword TEXT NOT NULL,  -- matches against supplement name
  food_keyword TEXT NOT NULL,        -- matches against logged food
  interaction_type TEXT CHECK (interaction_type IN ('reduces_absorption', 'increases_risk', 'timing_conflict')),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
  flag_message TEXT NOT NULL,        -- user-facing message
  recommendation TEXT NOT NULL       -- what to do
);

-- ============================================
-- TABLE: ai_conversation_memory (vector memory)
-- ============================================
CREATE TABLE public.ai_conversation_memory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  memory_type TEXT CHECK (memory_type IN (
    'meal_preference', 'commitment', 'health_context',
    'exception', 'behavioral_pattern', 'food_correction'
  )),
  content TEXT NOT NULL,             -- natural language memory entry
  embedding vector(768),             -- Gemini text-embedding-004 dimension
  importance_score NUMERIC(4,3),     -- 0-1, used for retrieval ranking
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ             -- null = permanent
);

CREATE INDEX idx_memory_embedding ON public.ai_conversation_memory
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_memory_user ON public.ai_conversation_memory(user_id);

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

-- RLS Policy: Users can only access their own data
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
```


***

# SECTION 5: ENVIRONMENT VARIABLES

> **AI AGENT INSTRUCTION**: Create `.env.local` with these keys before running the app. Create `.env.example` with identical keys but empty values and commit it to Git.

```bash
# .env.example — commit this file
# .env.local — NEVER commit this file

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=           # Only used server-side, never expose to client

# Google Gemini AI
GEMINI_API_KEY=                      # From Google AI Studio (free)

# USDA FoodData Central API
USDA_API_KEY=                        # Free from api.nal.usda.gov

# Meta WhatsApp Cloud API
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=               # Any random string you define

# Resend Email
RESEND_API_KEY=

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=NourishMind
```


***

# SECTION 6: AI PROMPT ARCHITECTURE

> **AI AGENT INSTRUCTION**: Every LLM call must use the exact system prompts defined here. Never modify these prompts without updating this document. Each prompt file lives in `lib/ai/prompts/`.

## 6.1 Meal Parser Prompt (`mealParser.ts`)

```typescript
/**
 * PROMPT: mealParserPrompt
 * PURPOSE: Extract structured ingredient list from user's natural language meal description
 * INPUT: rawMealText (string), userContext (UserProfile), mealType (string)
 * OUTPUT: JSON array of { ingredientName, brandName, quantityG, quantityUnit, quantityDisplay }
 * GROUNDING RULE: This prompt only IDENTIFIES ingredients — it does NOT calculate nutrition
 */

export const mealParserSystemPrompt = `
You are a precision food identification engine for an Indian nutrition tracking app.

Your ONLY job is to extract a structured list of ingredients from the user's meal description.
You DO NOT calculate any nutrition values — that is handled by a separate system.

RULES:
1. Extract every ingredient mentioned, including cooking oils, condiments, spices if specified
2. Identify brand names explicitly if mentioned (e.g., "Myprotein whey", "Amul Gold milk")
3. Convert all quantities to grams or ml where possible using these standard conversions:
   - 1 tsp = 5g (liquids 5ml), 1 tbsp = 15g, 1 cup = 240ml
   - 1 medium chapati = 30g, 1 small katori = 100ml, 1 medium bowl = 250ml
   - 1 scoop whey protein (standard) = 30g unless brand specifies otherwise
   - 1 egg = 50g, 1 medium banana = 120g, 1 medium apple = 182g
   - ₹10 packet Bingo Mad Angles = 26g, ₹5 packet = 13g
4. If quantity is ambiguous (no number given), set quantityG to null and set needsClarification: true
5. Flag if a meal seems implausibly large (e.g., "10 chapatis") with a plausibilityWarning
6. Output ONLY valid JSON — no explanation text

OUTPUT FORMAT:
{
  "mealType": "breakfast",
  "parsedIngredients": [
    {
      "ingredientName": "rolled oats",
      "brandName": null,
      "quantityG": 80,
      "quantityUnit": "g",
      "quantityDisplay": "80g",
      "needsClarification": false
    },
    {
      "ingredientName": "whey protein",
      "brandName": "Myprotein Impact Whey",
      "quantityG": 30,
      "quantityUnit": "g",
      "quantityDisplay": "1 scoop (30g)",
      "needsClarification": false
    }
  ],
  "clarificationNeeded": false,
  "clarificationQuestion": null,
  "plausibilityWarning": null
}
`;
```


## 6.2 Nutrition Analyzer Prompt (`nutritionAnalyzer.ts`)

```typescript
/**
 * PROMPT: nutritionAnalyzerPrompt
 * PURPOSE: Calculate macros/micros for an ingredient that was NOT found in IFCT/USDA/Brand DB
 * INPUT: ingredientName, brandName, quantityG — called ONLY when DB lookup returns no match
 * OUTPUT: JSON nutrition object with confidence score < 0.80
 * CRITICAL: This is the FALLBACK ONLY path. DB lookup must be attempted first.
 */

export const nutritionAnalyzerFallbackPrompt = `
You are a fallback nutrition estimator. You are called ONLY when an ingredient
was not found in our verified IFCT, USDA, or Indian brand database.

RULES:
1. Estimate nutrition based on your knowledge of the food category
2. Always set confidenceScore BELOW 0.80 to indicate this is an estimate
3. Set confidenceSource to "llm_estimated"
4. Be conservative — err towards lower calories rather than overestimating
5. For Indian home-cooked food, assume standard oil usage (1 tsp per sabzi serving)
6. For mess/restaurant food, increase oil estimate by 30%
7. Output ONLY valid JSON

OUTPUT FORMAT:
{
  "ingredientName": "...",
  "per100gCalories": 0,
  "per100gProtein": 0,
  "per100gCarbs": 0,
  "per100gFat": 0,
  "per100gFiber": 0,
  "per100gIronMg": 0,
  "per100gCalciumMg": 0,
  "per100gMagnesiumMg": 0,
  "per100gPotassiumMg": 0,
  "per100gSodiumMg": 0,
  "confidenceScore": 0.65,
  "confidenceSource": "llm_estimated",
  "estimationBasis": "Based on standard dal (lentil) composition from IFCT category"
}
`;
```


## 6.3 Verification Pass Prompt (`verificationPass.ts`)

```typescript
/**
 * PROMPT: verificationPassPrompt
 * PURPOSE: Sanity-check the fully calculated meal nutrition before logging
 * INPUT: mealSummary { ingredients[], totalMacros }
 * OUTPUT: { isValid: boolean, warnings: string[], correctedValues?: object }
 * CALLED: 3 times sequentially — Pass 1 (completeness), Pass 2 (plausibility), Pass 3 (totals)
 */

export const verificationPassPrompts = {
  pass1_completeness: `
    Check if the ingredient list seems complete for the described meal.
    Flag any obvious missing ingredients (e.g., "biryani" without oil logged).
    Output: { "missingIngredients": [], "completenessWarning": null }
  `,
  pass2_plausibility: `
    Check if each ingredient's nutrition values are physiologically plausible.
    Flag outliers: protein > 50g per 100g food is suspicious, calories > 900 per 100g is suspicious.
    Output: { "suspiciousIngredients": [], "plausibilityWarning": null }
  `,
  pass3_totals: `
    Check if the meal totals are plausible for a single meal.
    A single meal above 1500 kcal is unusual and should be flagged.
    Protein above 80g in one meal is unusual. Flag these for user confirmation.
    Output: { "totalWarnings": [], "suggestSplitting": false }
  `
};
```


## 6.4 Context Builder Prompt (`contextBuilder.ts`)

```typescript
/**
 * PROMPT: contextBuilderPrompt
 * PURPOSE: Inject user carbon copy context into every AI response
 * INPUT: UserProfile, relevant memories from vector DB, today's daily_log
 * OUTPUT: Formatted context string prepended to every system prompt
 */

export function buildUserContext(profile: UserProfile, memories: Memory[], todayLog: DailyLog): string {
  return `
ABOUT THIS USER (treat this as ground truth — never contradict it):
- Name: ${profile.full_name}
- Age: ${profile.age}, Sex: ${profile.biological_sex}
- Height: ${profile.height_cm}cm, Weight: ${profile.weight_kg}kg
- Goal: ${profile.primary_goal}
- Health conditions: ${profile.health_conditions?.join(', ') || 'none reported'}
- Dietary pattern: ${profile.dietary_pattern}
- Typical schedule: sleeps at ${profile.typical_sleep_time}, wakes at ${profile.typical_wake_time}
- Supplements/medications: [injected from DB]
- User's own context: "${profile.ai_context_field}"

TODAY SO FAR:
- Calories consumed: ${todayLog.total_calories} / [target]
- Protein: ${todayLog.total_protein_g}g
- Water: ${todayLog.water_ml}ml
- Meals logged: [count]

RELEVANT MEMORIES:
${memories.map(m => `- ${m.content}`).join('\n')}

BEHAVIORAL RULES FOR THIS USER:
- Always address them by first name
- Always acknowledge their conditions when making food recommendations
- If they have IBS, flag high-FODMAP foods proactively
- Never suggest a 16+ hour fast if they have logged a medication that requires food
  `;
}
```


***

# SECTION 7: API ROUTE SPECIFICATIONS

> **AI AGENT INSTRUCTION**: Each API route must implement exactly the request/response contract defined below. Use Zod for all input validation — never trust raw request body.

## 7.1 POST `/api/chat`

**Purpose**: Primary AI chat endpoint — handles all user messages

```typescript
// Request
{
  message: string,          // user's raw text input (max 2000 chars)
  conversationHistory: {    // last 10 messages for context
    role: 'user' | 'assistant',
    content: string
  }[],
  userId: string            // from Supabase session
}

// Response (streaming)
{
  type: 'meal_log' | 'question' | 'insight' | 'whatif' | 'general',
  content: string,          // AI response text
  mealLogData?: MealLog,    // present only when type = 'meal_log'
  clarificationNeeded?: boolean,
  clarificationQuestion?: string
}
```

**Logic Flow inside `/api/chat/route.ts`**:

1. Validate input with Zod
2. Retrieve user profile + today's daily log from Supabase
3. Retrieve top 5 relevant memories from pgvector
4. Build user context string
5. Detect intent: is this a meal log? a question? a "what if"? a correction?
6. Route to appropriate handler:
    - `meal log` → call `/api/nutrition/analyze` → `/api/nutrition/verify` → `/api/meals/log`
    - `what if` → call `whatIfPlanner` prompt
    - `correction` → call `/api/meals/log` with update flag
    - `general` → respond with context-aware AI message
7. Stream response back to client using Vercel AI SDK `streamText`

## 7.2 POST `/api/nutrition/analyze`

**Purpose**: Parse meal text → look up DB → run fallback LLM if needed → return full nutrition

```typescript
// Request
{
  parsedIngredients: ParsedIngredient[],  // output from mealParser
  userProfile: UserProfile
}

// Response
{
  ingredients: IngredientNutrition[],     // per-ingredient macro/micro data
  totalNutrition: NutritionTotals,
  overallConfidenceScore: number,
  warnings: string[]
}
```

**Logic inside this route**:

```
For each ingredient:
  1. Search IFCT table using full-text search (tsvector)
  2. If no IFCT match → search USDA API
  3. If no USDA match → search indian_brands table
  4. If no DB match → call LLM fallback (nutritionAnalyzerFallbackPrompt)
     → set confidenceScore < 0.80, confidenceSource = 'llm_estimated'
  5. Scale nutrition values to actual quantity (per 100g → per actual grams)
  6. Attach confidence score and source to each ingredient
Aggregate all ingredients into totalNutrition
Calculate overallConfidenceScore = weighted average of ingredient confidence scores
```


## 7.3 POST `/api/meals/log`

**Purpose**: Save a verified meal to the database

```typescript
// Request
{
  mealType: string,
  rawInput: string,
  loggedAt: string,          // ISO timestamp
  ingredients: IngredientNutrition[],
  totalNutrition: NutritionTotals,
  overallConfidenceScore: number,
  savedMealId?: string       // if logging from a saved recipe
}

// Response
{
  mealLogId: string,
  success: boolean,
  updatedDailyTotals: DailyTotals    // recalculated daily totals after this meal
}
```

**After logging**: Always upsert the `daily_logs` row for today with updated totals.

## 7.4 POST `/api/whatsapp/webhook`

**Purpose**: Receive and respond to WhatsApp messages

```typescript
// Meta sends a GET request first for webhook verification
// Respond with: req.query.hub.challenge if hub.verify_token matches WHATSAPP_VERIFY_TOKEN

// On POST (incoming message):
// 1. Parse Meta webhook payload
// 2. Extract user phone number → look up linked userId in user_profiles
// 3. Extract message text
// 4. Pass to same chat logic as /api/chat
// 5. Send response back via Meta WhatsApp Cloud API
//    POST https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages
```


***

# SECTION 8: COMPONENT SPECIFICATIONS

## 8.1 ChatInterface.tsx

- Full-height chat window using flex layout
- Message history renders `ChatMessage` components
- `QuickLogSuggestions` chips rendered above input box (top 5 saved meals by frequency)
- Input: textarea with auto-resize, sends on Enter (Shift+Enter for newline)
- Loading state: `LoadingDots` animated component while AI processes
- After every meal log: render `MealLogCard` as an AI message bubble
- Scroll to bottom on every new message


## 8.2 MealLogCard.tsx

Renders the structured output of a logged meal:

```
[Meal Type Badge] [Timestamp] [Confidence Score indicator]
─────────────────────────────────────────────
Ingredient 1: name | qty | calories | P | C | F | [source badge]
Ingredient 2: name | qty | calories | P | C | F | [source badge]
─────────────────────────────────────────────
TOTAL:                  XXX kcal | Pg | Cg | Fg
─────────────────────────────────────────────
[Micros row: Fe | Ca | Mg | B12 | Vit D]
[Save as Recipe button] [Edit button]
```


## 8.3 Dashboard Layout

- Responsive grid: 2-col on desktop, 1-col on mobile
- `CalorieRing`: Recharts RadialBarChart, animated fill
- `MacroSplit`: Recharts PieChart with 3 segments (P/C/F)
- `MealTimingChart`: Recharts Timeline (custom), shows meal bubbles on a 24-hour axis
- `MicroDeficiencyTracker`: horizontal progress bars, color-coded (red <50%, yellow 50-80%, green >80% RDA)
- `BloodSugarSimulation`: Recharts AreaChart with soft curve, clearly labeled as simulated

***

# SECTION 9: MODULE COMPLETION CHECKLIST

> **AI AGENT INSTRUCTION**: Check off each item before moving to the next module. Do not proceed if any item is unchecked.

### Module 1: Project Initialization

- [ ] Repository created on GitHub with `.gitignore` excluding `.env.local`
- [ ] `package.json` matches Section 2 exactly — run `npm install` successfully
- [ ] Folder structure from Section 3 created (empty files are fine)
- [ ] `.env.example` committed, `.env.local` populated with real keys
- [ ] Supabase project created, schema from Section 4 executed successfully
- [ ] `npm run dev` runs without errors on `localhost:3000`


### Module 2: Auth

- [ ] Supabase Auth configured (email + Google OAuth)
- [ ] Login and signup pages functional
- [ ] `middleware.ts` protects all `/app/*` routes
- [ ] Session persists across page refreshes
- [ ] On first login, user is redirected to onboarding


### Module 3: Onboarding

- [ ] 5-question onboarding flow collects and saves to `user_profiles`
- [ ] "How Your AI Sees You" summary card renders correctly
- [ ] `onboarding_complete` set to `true` after completion
- [ ] Progressive profiling Day 2–10 questions wired to end-of-day recap


### Module 4: Nutrition Database

- [ ] IFCT 2017 data imported into `ifct_foods` table (minimum 500 foods)
- [ ] Top 100 Indian brand products imported into `indian_brands` table
- [ ] Full-text search (`tsvector`) working — test with "dal", "oats", "bingo"
- [ ] USDA API integration tested — returns results for "almonds", "milk"
- [ ] `ifctLookup.ts`, `usdaLookup.ts`, `brandLookup.ts` all return correct schema


### Module 5: AI Chat + Meal Logging (Core MVP)

- [ ] `/api/chat` endpoint returns streaming response
- [ ] Meal intent detection working (meal log vs. question vs. correction)
- [ ] `mealParserPrompt` correctly extracts ingredients from 10 test cases (see below)
- [ ] DB lookup chain: IFCT → USDA → Brand → LLM fallback working in order
- [ ] 3-pass verification running sequentially
- [ ] Meal log saved to `meal_logs` and `meal_ingredients` tables
- [ ] `daily_logs` upserted correctly after each meal
- [ ] `ChatInterface.tsx` renders and `MealLogCard.tsx` displays correctly
- [ ] Saved meals feature: auto-suggest, save, quick-log, version working
- [ ] Conversational correction flow working ("actually 2 chapatis not 3")

**10 Test Cases for Meal Parser (all must pass before proceeding)**:

1. `"I ate overnight oats with 7 almonds, 1 scoop Myprotein whey, 250ml Amul Gold milk, 1 tsp cocoa powder"`
2. `"Dal rice bhindi sabzi 3 chapati mess lunch"`
3. `"1 vada pav from street stall"`
4. `"₹10 packet bingo mad angles piri piri"`
5. `"2 idli with sambar and coconut chutney"`
6. `"Chicken biryani one plate restaurant"`
7. `"Black coffee no sugar"`
8. `"Banana 1 medium post workout"`
9. `"Homemade rajma chawal, approx 1 bowl each"`
10. `"I had nothing for breakfast, just skipped"`

### Module 6: Dashboard

- [ ] All universal dashboard modules rendering with real data
- [ ] `CalorieRing` updates in real time after meal log
- [ ] `MealTimingChart` correctly plots meals on 24-hour timeline
- [ ] `MicroDeficiencyTracker` calculating RDA gaps correctly
- [ ] End-of-day recap generated and displayed


### Module 7: WhatsApp Bot

- [ ] Meta WhatsApp Cloud API webhook verification passing
- [ ] Incoming messages processed and responded to within 5 seconds
- [ ] All meal log functionality accessible via WhatsApp
- [ ] Bot logs synced to main dashboard in real time


### Module 8: Condition-Specific Modules

- [ ] FODMAP tracker activates only for IBS users
- [ ] Menstrual cycle tracking (opt-in) working with phase detection
- [ ] Mood check-in widget collecting and storing data
- [ ] Medication/supplement logging and interaction alerts working
- [ ] Drug-nutrient interaction database seeded and triggering correctly


### Module 9: WOW Features

- [ ] Weekly Nutrition Story image generated and shareable
- [ ] "What If" scenario planner returning projected analysis
- [ ] Commitment logging and next-day follow-up working
- [ ] Clinical PDF report generating with all data sections

***

# SECTION 10: DEPLOYMENT PIPELINE

```yaml
# .github/workflows/deploy.yml
name: Deploy NourishMind

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Environment variables in Vercel**: Add all variables from Section 5 to Vercel's project settings under Settings → Environment Variables. These are **separate** from your `.env.local` and must be added manually.

***

# SECTION 11: KNOWN CONSTRAINTS \& HARD LIMITS

| Constraint | Value | Reason |
| :-- | :-- | :-- |
| Gemini 1.5 Flash free tier | 15 req/min, 1M tokens/day | Rate limit — implement request queuing |
| Supabase free tier DB | 500MB storage | Sufficient for ~50K meal logs; upgrade at scale |
| Supabase free tier MAU | 50,000 MAU | Upgrade to Pro (\$25/mo) when approaching limit |
| WhatsApp Cloud API | 1000 free conversations/month | Each user conversation = 1 session per 24hrs |
| Vercel free tier | 100GB bandwidth/month | Sufficient for MVP |
| USDA API rate limit | 3600 requests/hour | Cache USDA lookups in Supabase to avoid repeat calls |

**USDA Caching Rule**: When a USDA food item is looked up and used, save it to a `usda_cache` table in Supabase. On subsequent lookups, check the cache first before calling the USDA API. Cache entries expire after 90 days.[^3]

***

This TRD is self-contained and built to eliminate the most common Agentic AI development failures — version drift, hallucinated nutrition data, missing RLS policies, and ungrounded LLM calls.  Every section is designed so the AI agent has zero ambiguity at any decision point.[^4]

Ready to start with **Module 1 initialization** — want me to generate the exact commands and config files to spin up the project in Cursor or VS Code with Copilot? 🚀
<span style="display:none">[^10][^11][^12][^13][^14][^15][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://apidog.com/blog/free-github-student-developer-pack/

[^2]: https://hibhavishya.in/blogs/github-student-developer-pack-the-ultimate-free-toolkit-for-students-in-2025

[^3]: https://cloud.google.com/use-cases/free-ai-tools

[^4]: https://dev.to/chirag127/the-ultimate-guide-100-best-free-ai-coding-agents-platforms-november-2025-230a

[^5]: https://education.github.com/pack

[^6]: https://github.com/education/students

[^7]: https://github.blog/developer-skills/github/the-github-student-developer-pack-delivers-200k-worth-of-tools-and-training-to-every-student/

[^8]: https://www.gitkraken.com/github-student-developer-pack-bundle

[^9]: https://dev.to/copilotkit/the-tech-stack-for-building-ai-apps-in-2025-12l9

[^10]: https://www.youtube.com/watch?v=Up1E_f4_v_0

[^11]: https://www.reddit.com/r/microsaas/comments/1kctmic/my_stack_for_building_projects_with_ai_most_of/

[^12]: https://www.youtube.com/watch?v=tCY-pD8Q1x8

[^13]: https://www.youtube.com/watch?v=4POUrra343w

[^14]: https://github.com/orgs/community/discussions/168183

[^15]: https://compilefuture.com/blog/github-student-developer-pack-free-copilot-pro/

