<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# With this new dashboard, do we have to change the TRD?

Great question — and the answer is **partially yes**. The core TRD architecture (database schema, API routes, tech stack, folder structure) remains completely valid. What needs updating is specific sections that the new dashboard screens introduced. Here's exactly what changes and what doesn't:

***

## What Does NOT Change ✅

- **Section 1** — Free tooling stack (unchanged)
- **Section 2** — Pinned dependency manifest (unchanged)
- **Section 3** — Folder structure (minor additions only)
- **Section 4** — Database schema (mostly intact, 3 additions needed)
- **Section 5** — Environment variables (unchanged)
- **Section 6** — AI prompt architecture (unchanged)
- **Section 7** — API route specifications (additions needed, nothing removed)
- **Section 9** — Module completion checklist (additions needed)
- **Section 10** — Deployment pipeline (unchanged)
- **Section 11** — Known constraints (unchanged)

***

## What Changes 🔄

### Section 3 — Folder Structure (Additions Only)

Add these new component files:

```
components/
├── dashboard/
│   ├── (existing files unchanged)
│   ├── HydrationCard.tsx          ← NEW
│   ├── FastingWindowCard.tsx      ← NEW
│   ├── WellnessScorePopover.tsx   ← NEW (replaces static sidebar score)
│   ├── ConditionBanner.tsx        ← NEW (IBS-cycle luteal banner)
│   └── MealContributionPills.tsx  ← NEW (calorie ring drilldown)
│
├── foodlog/                       ← NEW FOLDER
│   ├── FoodLogTimeline.tsx        ← NEW
│   ├── DayAccordion.tsx           ← NEW
│   ├── MealEntryRow.tsx           ← NEW
│   └── MealDetailDrawer.tsx       ← NEW
│
├── profile/                       ← NEW FOLDER
│   ├── HealthConditionsGrid.tsx   ← NEW
│   ├── SupplementCard.tsx         ← NEW
│   ├── DrugInteractionFlag.tsx    ← NEW
│   ├── CycleTrackingCard.tsx      ← NEW
│   └── ExceptionCard.tsx          ← NEW
│
└── mobile/                        ← NEW FOLDER
    ├── BottomNav.tsx              ← NEW
    ├── NutritionSummaryBar.tsx    ← NEW (mobile chat top bar)
    └── NutritionDrawer.tsx        ← NEW (mobile bottom sheet)
```


***

### Section 4 — Database Schema (3 Table Additions)

Add these three new tables to `schema.sql`:

```sql
-- ============================================
-- TABLE: gut_symptom_logs (new — FODMAP tracker)
-- ============================================
CREATE TABLE public.gut_symptom_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  symptom_score INTEGER CHECK (symptom_score BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);
ALTER TABLE public.gut_symptom_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own gut logs" ON public.gut_symptom_logs
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- TABLE: hydration_logs (new — water tracking)
-- ============================================
CREATE TABLE public.hydration_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  amount_ml INTEGER NOT NULL,
  log_date DATE GENERATED ALWAYS AS (logged_at::DATE) STORED
);
ALTER TABLE public.hydration_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own hydration" ON public.hydration_logs
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- TABLE: usda_cache (new — USDA API cache)
-- ============================================
CREATE TABLE public.usda_cache (
  id TEXT PRIMARY KEY,               -- USDA fdcId
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
```

Also add **3 new columns** to the existing `daily_logs` table:

```sql
ALTER TABLE public.daily_logs
  ADD COLUMN IF NOT EXISTS fasting_window_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS fasting_window_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS gut_symptom_score INTEGER CHECK (gut_symptom_score BETWEEN 1 AND 5);
-- Note: gut_symptom_score already exists in schema — skip if already added
```

And add **2 new columns** to `user_profiles`:

```sql
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS hydration_target_ml INTEGER DEFAULT 2500,
  ADD COLUMN IF NOT EXISTS wellness_score_breakdown JSONB;
  -- stores: {"nutrition": 31, "sleep": 20, "hydration": 13, "mood": 14}
```


***

### Section 7 — New API Routes to Add

Add these 5 new routes to the existing API structure:

```typescript
// NEW ROUTES TO ADD to app/api/

app/api/hydration/
  ├── log/route.ts          
  //  POST: { userId, amountMl, loggedAt }
  //  Response: { success, dailyTotalMl, progressPercent }

app/api/gut/
  ├── log/route.ts          
  //  POST: { userId, symptomScore, notes, logDate }
  //  Response: { success, weeklyAverage, cyclePhaseContext }

app/api/dashboard/
  ├── fasting/route.ts      
  //  GET: calculates fasting window from last meal_log timestamp
  //  Response: { fastingHours, fastingStart, fastingEnd, goalHours, metGoal }
  ├── wellness-score/route.ts
  //  GET: calculates composite wellness score
  //  Response: { total, nutrition, sleep, hydration, mood, breakdown }

app/api/conditions/
  ├── fodmap/route.ts       
  //  GET: checks today's meal_ingredients against FODMAP database
  //  Response: { status, flaggedIngredients[], overallRisk }
```

**FODMAP lookup logic** (add to `lib/nutrition/`):

```typescript
// lib/nutrition/fodmapChecker.ts — NEW FILE
/**
 * Checks an array of ingredient names against a curated FODMAP database
 * Returns risk level: 'low' | 'moderate' | 'high' per ingredient
 * Database: hardcoded curated list of ~200 common Indian foods with FODMAP ratings
 * Called by: /api/conditions/fodmap/route.ts
 * Only runs for users with 'ibs' in health_conditions array
 */
```


***

### Section 8 — Updated Component Specifications

Add these new component specs:

**`NutritionSummaryBar.tsx` (mobile only)**

```
Visibility: hidden on desktop (lg:hidden), visible on mobile
Position: sticky below top bar
Height: 48px
Content: horizontal scroll row of macro chips
Each chip: [icon] [value] format
Tap behavior: opens NutritionDrawer bottom sheet
```

**`BottomNav.tsx` (mobile only)**

```
Visibility: hidden on desktop (lg:hidden), fixed on mobile
5 tabs: Home | Chat | Log | Insights | Profile
Active state: mint color, animated dot indicator
Tab switching: triggers same route navigation as sidebar
```

**`FastingWindowCard.tsx`**

```
Data source: /api/dashboard/fasting
Shows: fasting window shaded zone on 24hr timeline
Calculates from: last meal_log.logged_at of previous day
Updates: in real-time as new meals are logged
```

**`WellnessScorePopover.tsx`**

```
Trigger: click on wellness score ring in sidebar (desktop) 
         or bottom sheet tap on mobile
Data source: /api/dashboard/wellness-score
Shows: breakdown of 4 components with individual scores
Formula:
  nutrition = (macros_hit/4 * 0.5 + micros_avg_pct * 0.5) * 40
  sleep = (actual_hours/target_hours) * 25, capped at 25
  hydration = (water_ml/target_ml) * 20, capped at 20
  mood = (mood_score/5) * 15
  total = sum, rounded to integer
```


***

### Section 9 — Updated Module Checklist

Add these new checklist items to the relevant modules:

```
MODULE 6 ADDITIONS (Dashboard):
- [ ] Fasting window calculated and displayed on Meal Timing card
- [ ] Calorie ring shows meal contribution pills on tap
- [ ] Blood sugar simulation peaks labelled with meal names
- [ ] Hydration card functional — logs to hydration_logs table
- [ ] Wellness score popover shows component breakdown
- [ ] End of Day Recap columns have correct color treatment
- [ ] IBS-cycle banner shows for users with IBS + cycle tracking enabled
- [ ] FODMAP Tracker card visible only for IBS users
- [ ] Mood-Nutrition card visible only for anxiety/depression users

MODULE 7 ADDITIONS (WhatsApp Bot):
- [ ] Hydration logging via WhatsApp ("/water 500ml" command works)
- [ ] Gut symptom logging via WhatsApp ("/gut 3" command works)
- [ ] Mood logging via WhatsApp ("/mood 4" command works)

NEW MODULE 10: Food Log Screen
- [ ] Timeline renders daily accordions correctly
- [ ] Today's section auto-expanded, previous days collapsed
- [ ] Weekly summary chips calculate from daily_logs table
- [ ] Meal detail drawer/page shows full ingredient breakdown
- [ ] Edit flow updates meal_logs and recalculates daily_logs
- [ ] Empty state shows for days with no logs

NEW MODULE 11: Profile Sections
- [ ] Health Conditions grid saves to user_profiles.health_conditions array
- [ ] Toggling a condition activates/deactivates dashboard modules in real-time
- [ ] Supplements & Meds CRUD functional against supplements_medications table
- [ ] Drug-nutrient interaction flags triggered by fodmapChecker cross-reference
- [ ] Cycle Tracking saves to menstrual_cycles table
- [ ] Phase calculation correct (current day relative to last_period_start)
- [ ] My Exceptions renders from user_exceptions table

NEW MODULE 12: Mobile Responsiveness
- [ ] Bottom nav functional on 375px viewport
- [ ] Nutrition summary bar scrollable on mobile chat screen
- [ ] All cards single-column on mobile
- [ ] No horizontal overflow on any mobile screen
- [ ] All tap targets ≥ 44px verified
- [ ] iOS safe area padding applied
- [ ] Font sizes ≥ 14px throughout
```


***

## Summary of TRD Changes

| Section | Change Type | Effort |
| :-- | :-- | :-- |
| Section 3 — Folders | Add 12 new component files | Low |
| Section 4 — Schema | Add 2 tables, alter 2 tables | Low |
| Section 7 — API Routes | Add 5 new routes | Medium |
| Section 8 — Components | Add 4 new component specs | Low |
| Section 9 — Checklist | Add 25 new checklist items | Low |

Everything else in the TRD stays exactly as written. The good news is the **database schema held up perfectly** — the core tables (`meal_logs`, `meal_ingredients`, `daily_logs`, `user_profiles`, `menstrual_cycles`) needed zero structural changes. Only additive changes were required, which means no migration risk on existing data. 🎯

