<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# YES,

Now can we draft a comprehensive and detailed PRD with all the features (Existing ones + Wow factors)

Make the PRD so thorough that it handhold developers and stakeholders through the problem, solution, features

Here is your comprehensive PRD, Rameshta. This is structured to handhold developers, designers, and stakeholders from first principles to technical execution.[^1][^2]

***

# 📄 Product Requirements Document (PRD)

**Product Name:** NourishMind *(working title — to be finalized)*
**Document Version:** v1.0
**Author:** Rameshta Vishwakarma
**Date:** February 21, 2026
**Status:** Draft — For Stakeholder Review

***

# 1. Executive Summary

NourishMind is an AI-first, 360° wellness web application designed for the Indian market. It replaces the broken, manual, one-item-at-a-time food logging experience with a conversational AI interface that understands natural language, Indian food, regional brands, and complex home recipes. Beyond nutrition, NourishMind builds a deep "carbon copy" of each user — their schedule, health conditions, mental state, menstrual cycle, medications, and behavior patterns — to deliver hyper-personalized, actionable wellness intelligence. The goal is to shift wellness apps from passive loggers to proactive health coaches.

***

# 2. Problem Statement

## 2.1 The Core Pain Points

Current nutrition and wellness apps fail Indian users in five fundamental ways:

- **Friction-heavy logging**: Users must manually search, select, and quantify every ingredient of every meal — making logging 5–6 meals a day unsustainably tedious
- **Western food bias**: Databases are built around Western food. Indian recipes — dal tadka, bhindi sabzi, poha, idli sambar — are either missing, inaccurate, or oversimplified, ignoring variables like oil type, spice composition, and cooking method
- **Recipe complexity blindness**: A single meal like overnight oats can have 6+ unique ingredients with specific brands and quantities. No app handles this as a single conversational input
- **Generic personalization**: Apps ask for age, weight, and goal — and that's it. They don't know that you're a hostel student eating mess food, an MBA student with high-stress exam weeks, or an MBBS student with IBS managing a FODMAP diet
- **Zero behavioral intelligence**: Apps log data but don't connect dots — they don't tell you that your low magnesium days correlate with your worst anxiety scores, or that your late-night eating pattern is disrupting your circadian rhythm


## 2.2 Market Opportunity

India has 750M+ smartphone users with a rapidly growing health-conscious urban demographic. The Indian digital health market is projected to reach \$10.6B by 2025. No existing app — HealthifyMe, MyFitnessPal, Cronometer, or Fitia — combines conversational AI logging with deep Indian food intelligence and behavioral carbon-copy profiling at this depth.[^3][^4]

***

# 3. Goals and Success Metrics

## 3.1 Business Goals

- Achieve 10,000 MAU within 6 months of launch
- Achieve 40%+ Day-30 retention (industry benchmark is ~20% for wellness apps)
- Generate Net Promoter Score (NPS) > 50 within first year
- Build a monetizable data layer for Phase 2 (dietitian partnerships, health insurance integrations)


## 3.2 Product Goals

- Reduce average food logging time from ~4 minutes/meal (HealthifyMe baseline) to under 60 seconds/meal
- Achieve macro accuracy within ±8% of laboratory-verified values for logged meals
- Achieve 70%+ daily active logging rate among retained users at Day-30


## 3.3 Key Metrics (KPIs)

| Metric | Target | Measurement Method |
| :-- | :-- | :-- |
| Average logging time per meal | < 60 seconds | Session analytics |
| Macro accuracy vs. IFCT/USDA ground truth | ±8% error | QA testing on 500 test meals |
| Day-7 retention | > 60% | Cohort analysis |
| Day-30 retention | > 40% | Cohort analysis |
| Daily active log rate (retained users) | > 70% | DAU/MAU ratio |
| NPS | > 50 | In-app quarterly survey |
| WhatsApp bot MAU as % of total MAU | > 35% | Bot analytics |


***

# 4. Target Users \& Personas

## 4.1 Primary Persona — "The Overwhelmed Optimizer"

**Profile**: Urban Indian, 20–32 years old, fitness-conscious, uses HealthifyMe or MyFitnessPal but finds manual logging exhausting. Eats a mix of home-cooked, hostel/mess, and restaurant food. High motivation, low time.
**Pain**: Spends more time logging food than actually improving health. App doesn't understand dal-chawal or overnight oats with 6 ingredients.
**Needs**: Fast, conversational logging. Accurate Indian food data. Actionable end-of-day insights.

## 4.2 Secondary Persona — "The Condition Manager"

**Profile**: 20–35 year old with a specific health condition (IBS, PCOS, thyroid, anxiety, diabetes). May be under a doctor's care. Wants to track how diet and lifestyle affect their condition daily.
**Pain**: Generic apps give generic advice. No app tracks FODMAP, gut symptoms, or connects mood to diet systematically.
**Needs**: Condition-specific dashboard modules, medication logging with interaction alerts, clinical PDF reports to share with doctors.

## 4.3 Tertiary Persona — "The Working Professional"

**Profile**: 27–40 year old IT professional or business traveler. Irregular hours, stress eating, late-night meals. Wants to improve habits but has no consistent schedule to build routines around.
**Pain**: Standard IF trackers and calorie goals don't account for night shifts or travel. Apps nag without understanding context.
**Needs**: Contextual time intelligence, travel mode, flexible goal adjustment, stress-nutrition correlation insights.

## 4.4 Tertiary Persona — "The Informed Woman"

**Profile**: 20–35 year old woman who understands the menstrual cycle's impact on energy, mood, and gut health. May have PCOS, endometriosis, or just wants cycle-synced wellness.
**Pain**: No wellness app integrates cycle phase into nutrition and workout recommendations.
**Needs**: Cycle-phase nutrition recommendations, mood-cycle correlation tracking, IBS-cycle overlap insights.

***

# 5. User Stories

- As a user, I want to describe my entire meal in one natural language message so that I don't have to search and log each ingredient separately
- As a user, I want the AI to know my health conditions and life context so that the recommendations it gives me are actually relevant to my situation
- As a user eating in a college mess, I want to describe a standard Indian meal and have the AI accurately estimate its macros without me knowing exact quantities
- As a user with IBS, I want a FODMAP tracker that automatically activates based on my condition and flags risky foods in my logs
- As a user, I want to save my frequently eaten recipes so I can log them instantly in the future
- As a user, I want to see how my mood scores correlate with my nutritional patterns over 4–6 weeks
- As a woman, I want my nutrition and workout recommendations to adapt to my menstrual cycle phase
- As a user on medication, I want the app to flag when a food I logged might interfere with my medication absorption
- As a user, I want to export a clean 30-day clinical PDF report to share with my doctor
- As a user who won't open the app daily, I want to log my meals via WhatsApp without losing any functionality
- As a user, I want to ask "What if I skip dinner tonight?" and see the projected impact before I decide
- As a user, I want a weekly Nutrition Story — like Spotify Wrapped — summarizing my week and showing where I improved

***

# 6. Feature Specifications


***

## Feature 1: AI Conversational Food Logger

### 6.1.1 Overview

The core logging interface is a chat window where users describe meals in plain, natural Indian English. The AI parses the input, identifies all ingredients, maps them to a verified nutrition database, runs a multi-pass verification, and logs the meal with full macro/micro and calorie transparency.

### 6.1.2 Detailed Functional Requirements

**Input Parsing Engine**

- Accept free-form natural language input in English (Hindi transliteration support in v2)
- Parse complex multi-ingredient recipes from a single message (e.g., "overnight oats with 7 almonds, 1 scoop Myprotein whey, 250ml Amul Gold milk, 1 tsp cocoa powder, sugar free")
- Identify: meal type (breakfast/lunch/dinner/snacks/pre-workout/post-workout), individual ingredients, quantities (explicit or estimated), brand names (where mentioned), and cooking method (where implied)
- When quantity is ambiguous (e.g., "a bowl of dal"), the AI must ask a smart clarifying follow-up: "Was this a small katori (~100ml) or a larger bowl (~250ml)?" — and remember the user's typical answer for future logs

**Nutrition Analysis Engine**

- Map every identified ingredient to the **IFCT (Indian Food Composition Tables 2017)** as the primary database for Indian foods and USDA FoodData Central as secondary
- For branded products (Myprotein whey, Amul Gold, Bingo Mad Angles, etc.), maintain a **verified Indian brand database** with pack sizes, price-to-gram mappings (e.g., ₹10 pack of Bingo Mad Angles = 26g), and nutrition per serving
- Run **3 sequential verification passes** on the nutrition calculation before logging:
    - Pass 1: Ingredient identification and quantity confirmation
    - Pass 2: Database mapping and macro/micro calculation
    - Pass 3: Sanity check (flag if a meal's calorie count is physiologically implausible — e.g., "1 chapati = 800 kcal" would be flagged)
- Display a **confidence score** per logged ingredient: "✅ Amul Gold 250ml — 95% confidence (verified brand database)" vs. "⚠️ Mess dal — 72% confidence (estimated from standard recipe)"

**Indian Food Intelligence**

- Deep knowledge of regional Indian recipes: North Indian (dal makhani, rajma, chole), South Indian (idli, dosa, sambar, rasam), West Indian (vada pav, poha, dhokla), East Indian (litti chokha, macher jhol)
- Cooking method inference: acknowledge that mess/restaurant food uses significantly more oil than home cooking. When user flags "mess food," apply a 20–30% oil upward correction with a visible note: "Assuming standard mess cooking oil (~1.5 tsp per sabzi) — adjust if needed"
- Spice composition awareness: turmeric, cumin, coriander, chili — track micronutrients from spices (curcumin content in turmeric, iron in coriander seeds, etc.)
- Ayurvedic ingredient recognition: ashwagandha, triphala, amla, moringa — log their specific micronutrient and adaptogen content

**Logging Output (per meal)**
The logged entry must display:

- Ingredient-level breakdown: each ingredient with its calories, protein (g), carbs (g), fat (g), fiber (g), and key micros (iron, calcium, magnesium, potassium, Vitamin B12, Vitamin D, Zinc, Folate, Sodium)
- Recipe-level total: sum of all ingredient macros/micros
- Confidence score per ingredient
- Timestamp of eating (auto-detected from log time, or user-specified: "I ate this at 1 PM")
- Meal type tag

**Hydration Tracking**

- Log water, chai (with milk + sugar quantity), coffee, lassi, nimbu pani, cold coffee, protein shake, juice — all as separate loggable liquid items
- Daily hydration target based on user weight and activity level, with a running progress bar

**Edit and Correction Flow**

- Conversational correction: "Actually I had 2 chapatis not 3" → AI recalculates and updates the log instantly, showing the delta ("Removed 1 chapati: -70 kcal, -2g protein, -15g carbs")
- Manual edit mode available in the log view for direct field editing without re-chatting

**Barcode Scanner (Secondary Input Mode)**

- A camera icon in the chat bar for packaged food items
- Scans barcode → auto-fills brand, product, serving size into chat for AI confirmation
- Used as ground truth data for the brand database training pipeline


### 6.1.3 Saved Meals / Recipes

- After the first time a complex recipe is logged, the AI prompts: "You logged overnight oats with 6 ingredients. Save this as 'My Overnight Oats' for quick future logging?" — one-tap save
- **Quick-log from saved meals**: User types "same overnight oats" → AI maps to saved recipe, logs instantly
- **Portion flexibility on saved meals**: "Same overnight oats but skip the whey today" → AI adjusts macros for the modified version without overwriting the saved recipe
- **Recipe versioning**: "My Overnight Oats v1" vs. "My Overnight Oats v2 (with chia seeds)" — versioned saves preserve historical log accuracy
- **Frequency-based smart suggestions**: Meals logged 3+ times/week automatically appear as quick-suggestion chips at the top of the chat input

***

## Feature 2: Carbon Copy User Profiling

### 6.2.1 Onboarding Questionnaire (Day 1 — 5 Core Questions)

Keep Day 1 onboarding under 3 minutes. Collect only the highest-signal questions:

1. What is your age, biological sex, height, and current weight?
2. What is your primary wellness goal? *(Weight loss / Muscle gain / Maintain weight / Manage a health condition / General wellness)*
3. Do you have any diagnosed health conditions or allergies? *(Free text + suggested options: IBS, PCOS, Thyroid, Diabetes, Hypertension, Anxiety/Depression, Food allergies)*
4. Describe a typical weekday for you in 2–3 sentences *(free text — e.g., "I'm an MBA student, classes 9–5, gym at 6 PM, sleep around midnight")*
5. How many meals do you typically eat per day, and do you follow any dietary pattern? *(Vegetarian/Non-veg/Vegan/Jain/Intermittent fasting/No restriction)*

### 6.2.2 Progressive Profiling (Days 2–10)

The AI asks one non-intrusive question per day during the end-of-day check-in to build the full carbon copy:

- Day 2: "What time do you usually wake up and go to sleep?"
- Day 3: "Do you workout? What type and for how long?"
- Day 4: "Are you currently taking any medications or supplements?"
- Day 5 (women only): "Would you like to enable menstrual cycle tracking for more personalized recommendations?"
- Day 6: "Do you experience stress or anxiety regularly? (1–5 scale)"
- Day 7: "What is your occupation and typical work schedule?"
- Day 8: "Do you have any food preferences or things you absolutely dislike?"
- Day 9: "How often do you eat outside or order in?"
- Day 10: "Is there anything else you'd like your AI health coach to know about you?"


### 6.2.3 "Things You Want AI to Know" — Context Field

- A persistent free-text field in Settings where users can enter open-ended context: "I am a hostel student eating mess food at SPJIMR," "I travel for work 2 weeks a month," "I keep a fast every Monday," "I'm vegetarian during Navratri"
- This field is injected as a **persistent context layer** into every AI interaction for that user
- Smart prompt suggestions shown below the field: *e.g., "I'm a night-shift worker," "I have a physically demanding job," "I eat 90% of meals from home"*
- Context can include **temporary overrides**: "I'm traveling this week in Mumbai" auto-expires after 7 days with a prompt to update


### 6.2.4 "How Your AI Sees You" — Profile Summary Card

- Auto-generated summary card accessible from Settings → "My Profile Summary"
- Shows a clean bulleted list: "Based on what I know about you: You are a 24-year-old female MBA student | Goal: Weight maintenance | Conditions: IBS, Anxiety | Typical schedule: Classes 9–5, gym 6–7 PM, sleep midnight | Dietary pattern: Vegetarian on weekdays | Active supplements: Vitamin D3, Ashwagandha"
- User can tap any bullet to correct or update it inline
- Shows "Last updated: Today" to build trust in data freshness
- A "What I don't know yet" section shows remaining data gaps and invites the user to fill them

***

## Feature 3: Personalized Dashboard

### 6.3.1 Dashboard Architecture

The dashboard is modular — each user sees only the modules relevant to their profile. Modules activate automatically based on conditions logged during onboarding.

**Universal Modules (all users):**


| Module | What It Shows |
| :-- | :-- |
| Daily Calorie Ring | Calories consumed vs. target, real-time |
| Macro Split | Protein / Carbs / Fat in grams and % of target |
| Micro Deficiency Tracker | Top 5 micronutrient gaps today (traffic light: red/yellow/green) |
| Meal Timing Chart | Horizontal timeline of today's meals with fasting windows |
| Hydration Bar | Water + liquid intake vs. daily target |
| Sleep Log | Logged sleep hours and quality (self-reported) |
| Daily Wellness Score | 0–100 composite score (nutrition + sleep + activity + mood) |

**Condition-Specific Modules (auto-activated):**


| Condition | Additional Modules |
| :-- | :-- |
| IBS | FODMAP Tracker, Gut Symptom Log, IBS-Cycle Correlation Chart |
| PCOS / Hormonal | Cycle-phase Nutrition Tracker, Insulin Load Score, Inflammatory Food Flag |
| Anxiety / Depression | Mood-Nutrition Correlation Chart, Magnesium/B12 Deficiency Alert, Gut-Brain Axis Score |
| Diabetes / Pre-diabetes | Blood Sugar Simulation Graph, Glycemic Load per Meal, Low-GI Meal Suggestions |
| Hypertension | Sodium Tracker, DASH Diet Score, Potassium-to-Sodium Ratio |
| Active Athlete | Workout-Nutrition Sync, Protein Distribution per Meal, Recovery Score |

### 6.3.2 End-of-Day Recap

Delivered every evening (user-configurable time) via in-app notification + WhatsApp bot message:

- Total calories: consumed vs. target, surplus/deficit
- Macro summary: each macro as % of daily goal
- Top 3 micronutrient deficiencies of the day with food suggestions to correct them tomorrow
- "What you did well today": positive reinforcement (e.g., "Hit your protein goal ✅, drank 2.5L water ✅")
- "What to improve tomorrow": 2–3 specific, actionable suggestions (e.g., "Add a handful of spinach to lunch to address your iron gap")
- Fasting window achieved today
- Sleep and mood score for the day


### 6.3.3 Blood Sugar Simulation Graph

- For every logged meal, calculate an estimated **Glycemic Load (GL)** using ingredient GI values and quantities
- Simulate a projected blood sugar response curve over 2–3 hours post-meal using a standard pharmacokinetic model
- Overlay all meal curves on a single daily timeline graph
- Clearly labeled as **"Simulated — Not a medical diagnosis. For educational purposes only."**
- For diabetic/pre-diabetic users, this is the most compelling dashboard feature

***

## Feature 4: Menstrual Cycle Tracking

### 6.4.1 Opt-in Flow

Shown only to users who identify as female during onboarding. Presented on Day 5 of progressive profiling. Completely optional — skippable at any time.

### 6.4.2 Core Functionality

- User logs: last period start date, average cycle length, average period duration
- App calculates current cycle phase: Menstrual (Days 1–5), Follicular (Days 6–13), Ovulation (Days 14–16), Luteal (Days 17–28)


### 6.4.3 Phase-Based Recommendations

| Phase | Nutrition Focus | Workout Suggestion |
| :-- | :-- | :-- |
| Menstrual | Iron, Vitamin C, anti-inflammatory foods (turmeric, ginger), hydration | Light yoga, walking, rest |
| Follicular | Protein, Vitamin B, zinc, fermented foods for estrogen metabolism | Strength training, HIIT |
| Ovulation | Fiber, antioxidants, cruciferous vegetables for estrogen clearance | Peak performance workouts |
| Luteal | Magnesium, complex carbs, reduce sodium and caffeine | Moderate cardio, reduce intensity |

### 6.4.4 IBS-Cycle Correlation

- For users with both IBS and cycle tracking enabled, activate an **IBS-Cycle Overlap Tracker**
- Flag luteal and menstrual phase days with an automatic FODMAP tightening nudge: "You're in your luteal phase — IBS symptoms tend to worsen this week. FODMAP recommendations have been tightened for the next 7 days"
- Show a retroactive correlation chart after 2–3 cycles: "Your IBS symptom scores are 2.4x higher during your luteal phase"

***

## Feature 5: Mental Health–Nutrition Link

### 6.5.1 Daily Mood Check-In

- One optional prompt daily (in chat or as a bottom-of-screen widget): "How are you feeling today?" with a 1–5 scale (😔 😟 😐 🙂 😄) plus an optional one-line text note
- Friction must be under 5 seconds — tap and done


### 6.5.2 Correlation Engine

- After 4 weeks of mood + nutrition data, the AI surfaces personalized correlations:
    - "On days your magnesium intake is below 60% of RDA, your mood score averages 2.1 vs. 3.8 on adequate days"
    - "Your lowest energy scores occur consistently the day after meals with less than 20g protein"
    - "Your stress scores are 40% lower on days you eat before 8 PM"
- Correlations are shown as insight cards in the dashboard, updated weekly


### 6.5.3 Gut-Brain Axis Tracker (IBS/Anxiety users)

- Dual-axis chart showing gut symptom log (1–5) and mood score (1–5) on the same timeline
- 30-day trend showing the bidirectional correlation between gut flare-ups and mood dips


### 6.5.4 Safety Rails

- If mood scores are consistently 1–2 for 5+ consecutive days, show a non-alarming nudge: "We've noticed your mood has been low this week. Nutrition is just one piece of the puzzle — talking to someone you trust or a professional can help 💙"
- Link to iCall (India's free mental health helpline)
- The app **never diagnoses, prescribes, or makes clinical mental health claims**

***

## Feature 6: Medication \& Supplement Logging

### 6.6.1 Supplement/Medication Profile Setup

- During onboarding or from Settings → "My Supplements \& Medications," user logs:
    - Name of supplement/medication
    - Dose and frequency (e.g., Vitamin D3 60K IU every Sunday)
    - Time of day taken (morning/afternoon/evening/night)
    - Whether taken with food or on empty stomach


### 6.6.2 Micro Dashboard Adjustment

- Supplements logged here are factored into daily micro progress — if user logs a Vitamin D3 supplement (2000 IU), the Vitamin D deficiency gap in the dashboard reduces accordingly
- A small supplement icon (💊) appears next to affected micros in the dashboard to indicate the source


### 6.6.3 Drug-Nutrient Interaction Engine

A curated database of key food-drug and food-supplement interactions, flagged in real-time when the user logs a conflicting meal:


| Interaction | Flag Message |
| :-- | :-- |
| Iron tablet + oxalate-rich foods (spinach, beets) | "Oxalates reduce iron absorption by up to 50%. Consider taking your iron tablet 2 hours apart from this meal" |
| Calcium + Iron supplement (same time) | "Calcium and iron compete for absorption. Avoid taking them within 2 hours of each other" |
| Thyroid medication + cruciferous vegetables | "Large amounts of raw cruciferous vegetables may interfere with thyroid hormone absorption" |
| Ashwagandha + sedative medications | "Ashwagandha has mild sedative properties — combining with sedative medications may increase drowsiness" |
| Metformin (diabetes) + B12 | "Long-term Metformin use reduces B12 absorption. Your B12 has been below target for 5 days — flag this to your doctor" |

### 6.6.4 Supplement Timing Optimizer

- Based on user's meal log and sleep schedule, AI suggests optimal supplement timing: "Based on your usual 10:30 PM sleep time, take your Ashwagandha after dinner for best cortisol benefit"
- Ayurvedic supplement database included: ashwagandha, triphala, brahmi, shilajit, moringa, amla, tulsi

***

## Feature 7: Contextual Time Intelligence

### 6.7.1 Proactive Nudges (All Silent — No Aggressive Push Notifications)

- **Missed meal detection**: If user hasn't logged by 2 hours past their usual meal time, send one gentle nudge: "Haven't logged lunch yet — did you eat? You can type it here quickly 🍱"
- **Late-night eating flag**: If food is logged after 9:30 PM, and the AI knows the user's wake-up time, calculate the resulting overnight fast window and flag if it's under 10 hours: "Eating now gives you an 8-hour fast before your 6 AM wake-up. Your gut and circadian rhythm benefit from at least 12 hours — want a lighter option suggestion?"
- **Pre-workout nutrition nudge**: If user has logged a workout in their profile at 6 PM and hasn't eaten since 12 PM, nudge at 4:45 PM: "Workout in ~75 minutes — consider a light pre-workout snack now for energy"
- **Exam/stress day detection**: If user mentions "exam," "presentation," "deadline" in any chat message, the AI acknowledges it: "Good luck today! High-stress days deplete magnesium faster — I'd suggest adding nuts or dark chocolate to your evening snack"


### 6.7.2 Travel Mode

- User mentions travel in "Things you want AI to know" or in chat
- App switches to **Damage Control Mode**: calorie targets loosened by 15%, strict micro tracking suspended, AI acknowledges "You're traveling — doing your best is enough today. I'll focus on keeping protein and hydration on track"
- Auto-expires after 7 days with a prompt: "Still traveling or back home?"


### 6.7.3 User-Requested Exception Logging

- When user asks to modify a default recommendation ("I can't do a 16-hour fast because of my medication timing"), AI:

1. Accepts the exception and adjusts the recommendation (switches to 14-hour IF target)
2. Logs the exception in **Settings → My Exceptions** with timestamp and reason
3. Factors this exception into all future suggestions permanently unless user reverts it
- Exception log is fully visible and editable by the user

***

## Feature 8: WOW Features

### 6.8.1 Weekly Nutrition Story (Shareable)

- Every Sunday evening, generate a beautifully designed, Instagram-story-sized card (1080×1920px) summarizing the week:
    - "This week you hit your protein goal 5/7 days 💪"
    - "Your best nutrition day was Tuesday"
    - "You consumed 60% of your recommended magnesium — here's what to change next week"
    - "Your longest fasting window: 14.5 hours on Thursday"
- Shareable directly to Instagram Stories, WhatsApp, or downloadable as PNG
- Branding: subtle NourishMind watermark bottom-right


### 6.8.2 "What If" Scenario Planner

- User asks any forward-looking question in chat: "What if I skip dinner tonight?", "What if I eat pizza for lunch?", "What if I do a 24-hour fast this Sunday?"
- AI responds with a projected analysis:
    - Macro gap for the day if meal is skipped
    - Fasting window impact
    - Estimated effect on next-day energy (based on sleep + deficit data)
    - A suggested mitigation: "If you skip dinner, have a high-protein snack at 5 PM to hit your protein target before the fast begins"
- Clearly framed as **projected, not prescriptive**


### 6.8.3 AI Accountability Streak with Memory

- The AI maintains a persistent memory of user commitments made in chat: "I'll try to reduce sugar in my chai this week," "I'm going to sleep by 11 PM from tomorrow"
- Next day, the AI proactively follows up: "Hey! Yesterday you said you'd try reducing sugar in your chai — did you manage it today? 🍵"
- A **Commitment Log** in Settings stores all past commitments and their outcomes (kept / broken / modified)
- Builds a streak counter for kept commitments — a powerful behavioral reinforcement loop


### 6.8.4 WhatsApp / Telegram Bot Integration

- Users can log all meals, check-ins, and queries via a WhatsApp message to the NourishMind bot — identical AI experience, zero app-opening required
- Bot commands: "/log [meal]", "/summary", "/water [amount]", "/mood [1-5]", "/whatif [scenario]"
- All bot interactions sync to the main app dashboard in real-time
- This is the \#1 retention lever for the Indian market where WhatsApp daily active usage far exceeds any standalone app[^5]


### 6.8.5 Doctor/Dietitian 30-Day Clinical PDF Report

- One-tap export from the dashboard
- Report includes:
    - 30-day calorie and macro trend charts
    - Daily micro averages vs. RDA (color-coded)
    - Meal timing heatmap (which hours of day the user typically eats)
    - Sleep log summary
    - Mood trend chart (if opted in)
    - Supplement and medication log
    - Flagged nutrient deficiencies with duration
    - FODMAP / condition-specific tracker data (if applicable)
- Formatted as a clean A4 clinical document with the user's name, date range, and NourishMind branding
- Exportable as PDF and shareable via email or WhatsApp

***

# 7. Non-Functional Requirements

## 7.1 Performance

- Chat response latency: < 3 seconds for meal logging (p95)
- Dashboard load time: < 2 seconds on a 4G connection
- App must function on mid-range Android devices (4GB RAM, Android 10+) — the Indian market primary device


## 7.2 Accuracy

- Macro analysis must achieve < ±8% error vs. IFCT/USDA ground truth on a validated test set of 500 Indian and global meals
- All AI health claims must be grounded in IFCT, USDA, or peer-reviewed nutritional science — no parametric LLM nutrition hallucination


## 7.3 Privacy \& Security[^6][^7]

- All health data (conditions, medications, mood, cycle data) encrypted at rest (AES-256) and in transit (TLS 1.3)
- No health data sold to third parties — ever. This must be a founding principle, stated in the privacy policy and in-app
- Compliance with **India's Digital Personal Data Protection Act (DPDPA) 2023**
- Full data export and right-to-delete functionality required by law
- Mental health and cycle data stored with additional access control layers — separate encryption key from general health data
- Explicit, granular consent collected per data type during onboarding: "Allow NourishMind to store your menstrual cycle data? [Yes / No]"


## 7.4 Accessibility

- Font size minimum 14px body, 16px headings
- Color contrast ratio ≥ 4.5:1 (WCAG AA)
- All interactive elements minimum 44×44px tap target
- Screen reader compatibility for visually impaired users (Phase 2)

***

# 8. Technical Architecture (High-Level)

## 8.1 Tech Stack Recommendation

| Layer | Technology |
| :-- | :-- |
| Frontend (Web App) | React.js + Tailwind CSS |
| Mobile (PWA first, native v2) | Progressive Web App → React Native |
| Backend | Node.js + Express or FastAPI (Python) |
| AI / LLM Layer | OpenAI GPT-4o or Anthropic Claude 3.5 (via API) with RAG pipeline |
| Nutrition Database | IFCT 2017 + USDA FoodData Central (self-hosted, structured) |
| Brand Database | Custom-curated Indian brand nutrition database (manual + crowdsourced) |
| Vector Database (AI memory) | Pinecone or Weaviate (for persistent user context and conversation memory) |
| Primary Database | PostgreSQL (structured health data) |
| Caching | Redis |
| File Storage | AWS S3 (PDF reports, Nutrition Story images) |
| WhatsApp Bot | Twilio API for WhatsApp or Meta WhatsApp Business API |
| Authentication | Auth0 or Supabase Auth |
| Analytics | Mixpanel (product analytics) + PostHog (session replay) |
| Hosting | AWS / Render.com (cost-effective for MVP) |

## 8.2 AI Architecture

The LLM layer must be **grounded**, not free-generating nutrition data:

1. User sends meal description via chat
2. **Intent Parser**: LLM identifies ingredients, quantities, brands, meal type
3. **Database Lookup**: Each identified ingredient is mapped to IFCT/USDA/Brand DB via fuzzy matching
4. **Gap Handler**: For ingredients not in database, LLM estimates with a lower confidence score and flags for review
5. **Verification Pass (×3)**: Three sequential LLM calls check ingredient list completeness, quantity plausibility, and total macro sanity
6. **Output Formatter**: Structured JSON of per-ingredient and total macros/micros → rendered in chat UI
7. **Memory Layer**: Interaction stored in vector DB as user context for future personalization

***

# 9. User Flow — Core Journey (Day 1)

1. **Landing Page** → Sign up with email/Google
2. **Onboarding** → 5-question questionnaire (< 3 min)
3. **"How Your AI Sees You"** summary card shown → user confirms or edits
4. **Chat Interface** opens with a warm welcome: "Hi [Name]! I'm your NourishMind coach. Tell me what you've eaten today — just describe it naturally 🥗"
5. User types first meal → AI logs it with full macro/micro breakdown
6. End of day → First end-of-day recap delivered
7. Day 2 check-in → AI asks progressive profiling question \#2

***

# 10. MoSCoW Prioritization

## Must Have (MVP — v1.0)

- Conversational food logging with Indian food intelligence
- IFCT + USDA grounded nutrition database
- Meal saving and quick-log
- Carbon copy onboarding (5 questions + progressive profiling)
- "Things you want AI to know" context field
- "How your AI sees you" summary card
- Universal dashboard modules (calories, macros, micros, meal timing)
- End-of-day recap
- WhatsApp bot integration


## Should Have (v1.5)

- Condition-specific dashboard modules (IBS, anxiety, diabetes)
- Menstrual cycle tracking
- Mental health–nutrition correlation engine
- Medication and supplement logging with interaction alerts
- Blood sugar simulation graph
- Contextual time intelligence (nudges, travel mode)
- Exception logging in settings


## Could Have (v2.0)

- Weekly Nutrition Story (shareable)
- "What If" scenario planner
- AI accountability streak with memory
- Doctor/dietitian clinical PDF export
- Barcode scanner
- Hindi language support
- Wearable device integration (Fitbit, Apple Watch, Mi Band)


## Won't Have (v1.x — deferred)

- Native iOS/Android app (PWA first)
- In-app dietitian consultation marketplace
- Meal planning / grocery list generation
- Blood test integration (Phase 3)

***

# 11. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
| :-- | :-- | :-- | :-- |
| LLM hallucinating nutrition values | High | Critical | Ground all outputs in IFCT/USDA — never use parametric LLM memory for nutrition data |
| Indian brand database incompleteness | High | High | Start with top 100 Indian packaged food brands; add crowdsourced user corrections with review pipeline |
| User data privacy breach | Low | Critical | AES-256 encryption, DPDPA compliance, third-party security audit before launch |
| Low logging consistency (user drops off) | High | High | WhatsApp bot, AI memory nudges, weekly Nutrition Story as retention hooks |
| Mental health feature misuse or clinical overreach | Medium | High | Strict disclaimer layer, no diagnostic claims, crisis escalation to iCall |
| AI portion estimation errors for mess food | High | Medium | Confidence scores, easy correction flow, user feedback loop to improve database |


***

# 12. Milestones and Timeline

| Milestone | Target Timeline |
| :-- | :-- |
| PRD finalized and signed off | Week 1 |
| IFCT + USDA database structured and hosted | Week 2–3 |
| Core chat logging + nutrition engine (MVP) | Week 4–7 |
| Onboarding flow + carbon copy profiling | Week 6–8 |
| Universal dashboard | Week 8–10 |
| WhatsApp bot integration | Week 9–11 |
| Internal beta (50 users) | Week 12 |
| Bug fix + accuracy improvement sprint | Week 13–14 |
| Public beta launch | Week 15–16 |
| v1.5 feature sprint (condition modules, cycle tracking) | Month 5–6 |


***

This PRD is designed to be a living document — update the version number and changelog at the top with every major revision.  The next logical artifact to build is a **User Flow Diagram** followed by **wireframes for the chat interface and dashboard** — want to move to that next?[^1]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.perforce.com/blog/alm/how-write-product-requirements-document-prd

[^2]: https://www.joinleland.com/library/a/product-requirements-doc

[^3]: https://www.tribe.ai/applied-ai/ai-nutrition-apps

[^4]: https://globaldev.tech/blog/best-nutrition-apps-in-2025

[^5]: https://www.linkedin.com/pulse/how-ai-shift-from-tool-partner-personal-wellness-olivier-madel-texie

[^6]: https://www.scribd.com/document/809033310/AI-Powered-Health-Wellness-Assistant-Project-Document

[^7]: https://www.spec-india.com/case-study/ai-based-health-and-wellness-app-development

[^8]: https://productschool.com/blog/product-strategy/product-template-requirements-document-prd

[^9]: https://www.atlassian.com/agile/product-management/requirements

[^10]: https://www.aha.io/roadmapping/guide/requirements-management/what-is-a-good-product-requirements-document-template

[^11]: https://www.digitalocean.com/resources/articles/product-requirements-document

[^12]: https://geekyants.com/blog/building-wellness-tech-features-of-fitness-and-mental-health-tracking-apps

[^13]: https://chisellabs.com/blog/product-requirement-document-prd-templates/

[^14]: https://www.ijfmr.com/papers/2024/1/13468.pdf

[^15]: https://www.inflectra.com/Ideas/Topic/PRD-Template.aspx

[^16]: https://www.aha.io/roadmapping/guide/requirements-management/what-is-a-prd-(product-requirements-document)

[^17]: https://geekyants.com/blog/how-to-build-an-ai-powered-mental-health-app--features-cost--compliance-guide

[^18]: https://gainmomentum.ai/blog/product-requirements-document-template

