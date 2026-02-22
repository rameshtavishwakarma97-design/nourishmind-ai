# NourishMind Backend Deployment Guide

## Prerequisites
- Supabase project: `ceoswqrioyehspofbdyb`
- Node.js 18+
- Supabase CLI (`npx supabase --version` ≥ 2.x)

---

## Step 1: Run Database Schema

1. Go to **Supabase Dashboard** → **SQL Editor**
   - URL: https://supabase.com/dashboard/project/ceoswqrioyehspofbdyb/sql/new

2. Copy the contents of `database/schema.sql` and run it

3. Then run the seed files **in order**:
   - `database/seed/ifct_seed.sql` (Indian foods)
   - `database/seed/brands_seed.sql` (Indian branded products)
   - `database/seed/interactions_seed.sql` (Drug-nutrient interactions)

---

## Step 2: Authenticate Supabase CLI

```bash
npx supabase login
```
This opens a browser window to generate an access token. Paste it back in the terminal.

---

## Step 3: Link the Project

```bash
npx supabase link --project-ref ceoswqrioyehspofbdyb
```
When prompted for the database password, enter it (found in Supabase Dashboard → Settings → Database).

---

## Step 4: Set Edge Function Secrets

```bash
npx supabase secrets set GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
npx supabase secrets set USDA_API_KEY=<YOUR_USDA_API_KEY>
npx supabase secrets set RESEND_API_KEY=<YOUR_RESEND_API_KEY>
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<YOUR_SUPABASE_SERVICE_ROLE_KEY>
```

---

## Step 5: Deploy Edge Functions

Deploy all functions at once:
```bash
npx supabase functions deploy chat --project-ref ceoswqrioyehspofbdyb
npx supabase functions deploy nutrition-analyze --project-ref ceoswqrioyehspofbdyb
npx supabase functions deploy nutrition-verify --project-ref ceoswqrioyehspofbdyb
npx supabase functions deploy nutrition-search --project-ref ceoswqrioyehspofbdyb
npx supabase functions deploy meals-log --project-ref ceoswqrioyehspofbdyb
npx supabase functions deploy user-summary --project-ref ceoswqrioyehspofbdyb
npx supabase functions deploy dashboard-wellness --project-ref ceoswqrioyehspofbdyb
npx supabase functions deploy conditions-fodmap --project-ref ceoswqrioyehspofbdyb
```

Or deploy all at once:
```bash
npx supabase functions deploy --project-ref ceoswqrioyehspofbdyb
```

---

## Step 6: Verify Deployment

Check function status:
```bash
npx supabase functions list --project-ref ceoswqrioyehspofbdyb
```

Test a function:
```bash
curl -X POST https://ceoswqrioyehspofbdyb.supabase.co/functions/v1/nutrition-search?q=rice \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

---

## Step 7: Start Frontend Dev Server

```bash
npm run dev
```

The app will be at `http://localhost:8080`

---

## Architecture Overview

### Edge Functions (Server-side logic requiring API keys):
| Function | Purpose | TRD Route |
|---|---|---|
| `chat` | AI chat + meal logging orchestration | POST /api/chat |
| `nutrition-analyze` | IFCT→USDA→Brand→LLM nutrition lookup | POST /api/nutrition/analyze |
| `nutrition-verify` | 3-pass verification via Gemini | POST /api/nutrition/verify |
| `nutrition-search` | Food search across all DBs | GET /api/nutrition/search |
| `meals-log` | Direct meal logging (bypass chat) | POST /api/meals/log |
| `user-summary` | AI "How I see you" summary | GET /api/user/summary |
| `dashboard-wellness` | Composite wellness score | GET /api/dashboard/wellness |
| `conditions-fodmap` | FODMAP risk assessment | POST /api/conditions/fodmap |

### Direct Supabase Client (RLS-protected, no Edge Function needed):
- User profile CRUD
- Saved meals CRUD
- Meal history queries
- Daily/weekly log queries
- Hydration logging
- Gut symptom logging
- Supplements/medications CRUD

### Frontend Hooks:
- `useAuth` — Authentication (email, Google OAuth, sign out)
- `useChat` — AI chat conversation management
- `useDashboard` — Daily/weekly logs + wellness score
- `useUserProfile` — Profile CRUD + AI summary
- `useFoodLog` — Meal history + daily totals
- `useSavedMeals` — Favorite/frequent meals
- `useHydration` — Water intake tracking
