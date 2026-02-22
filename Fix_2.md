
## Root Cause Diagnosis

| Issue | Root Cause |
| :-- | :-- |
| AI sends hardcoded breakfast response | No real AI API call — just static mock data |
| Food log not editable | No CRUD operations wired to Supabase |
| No login/signup page | Auth flow never built |
| Questionnaire incomplete | Onboarding form hardcoded, not saving to DB |
| Set reminder not working | No notification system built |
| Mood/gut log does nothing after submit | No Supabase write + no feedback state |
| Male user seeing period notification | Gender not being read from profile |
| Download/Instagram share broken | No file generation or share API |
| Can't edit food in food log | Edit flow not connected to DB |
| Health conditions not updating AI | Tags saved to state only, not Supabase |
| Can't add supplements | Form exists but no Supabase INSERT |
| Cycle tracking not working | No DB write, no calculation logic |
| AI Context hardcoded | Static text, not reading from/writing to DB |
| No exception logging flow | Only display built, not add/delete flow |
| Can't delete supplements | No DELETE operation built |
| Can't delete food logs | No DELETE operation built |


***

## The Fix Strategy

You need to do this in **4 phases**. Do not try to fix everything at once — Lovable will get confused and break existing UI.

***

1 — Foundation First (Do This Before Anything Else)

```
Build a complete authentication flow for NourishMind using Supabase Auth.

CREATE THESE SCREENS:

1. /login page:
Full-screen, centered card (max-width 440px), warm cream background #FAFAF8
NourishMind logo + wordmark at top
Heading: "Welcome back" (Fraunces, 28px)
Subtitle: "Sign in to continue your wellness journey"

Form fields:
- Email input (type="email", placeholder: "your@email.com")
- Password input (type="password", placeholder: "••••••••")
- [Sign In] primary button — dark green, full width, pill shape
- "Forgot password?" ghost text link below button
- Divider: "or"
- [Continue with Google] white button, google icon, border

Below form: "Don't have an account? Sign up →" link to /signup

On successful login: redirect to /app/chat
On error: show inline error below the relevant field in red (#D95F5F)

2. /signup page:
Same layout as login
Heading: "Create your account"
Subtitle: "Your 360° wellness journey starts here"

Form fields:
- Full Name (text input)
- Email (email input)
- Password (min 8 chars, show strength indicator)
- Confirm Password
- [Create Account] primary button

On successful signup: redirect to /onboarding (NOT /app/chat)
On error: show inline field-level errors

3. /forgot-password page:
Simple centered card
Email input + [Send Reset Link] button
Success state: "Check your email for a reset link ✅"

4. PROTECT ALL /app/* ROUTES:
Any route starting with /app should redirect to /login 
if user is not authenticated.
Use Supabase's onAuthStateChange to check session.

5. LOGOUT:
Add a [Sign Out] option to the Settings screen.
On click: call supabase.auth.signOut(), redirect to /login.

Use @supabase/supabase-js which is already in the project.
Store session in React context so all components can access 
the current user's id and email.
```


### Prompt 1B — Build Onboarding (Right After Auth)

```
Build a complete 5-step onboarding flow at /onboarding.
This runs ONCE after signup, then redirects to /app/chat.
Save ALL answers to Supabase user_profiles table.

STEP 1 — Goal:
Question: "What is your primary wellness goal?"
Options (single select pills):
[Weight Loss] [Muscle Gain] [Maintain Weight] 
[Manage a Health Condition] [General Wellness]
Saves to: user_profiles.primary_goal

STEP 2 — Basic Info:
Form fields:
- Age (number input, 13-100)
- Biological Sex (3 options: Male / Female / Prefer not to say)
  → This field MUST be saved — it controls whether cycle tracking shows
- Height (cm, number input)
- Weight (kg, number input)
Saves to: user_profiles.age, biological_sex, height_cm, weight_kg

STEP 3 — Health Conditions:
"Do you have any of these health conditions? (select all that apply)"
Multi-select grid (same as Profile > Health Conditions):
[IBS/Gut] [Anxiety/Depression] [PCOS/Hormonal] [Diabetes] 
[Hypertension] [Thyroid] [Iron Deficiency] [Post-partum]
[None of the above]
Saves to: user_profiles.health_conditions (TEXT[] array)

STEP 4 — Diet & Lifestyle:
"Tell us about your eating habits"
- Diet type (single select): Vegetarian | Vegan | Non-Veg | Eggetarian | Jain | Other
- Allergies (multi-select chips): Gluten | Dairy | Nuts | Soy | Shellfish | None
- Meals per day: 2 | 3 | 4 | 5+
- Activity level: Sedentary | Lightly Active | Moderately Active | Very Active
Saves to: user_profiles.diet_type, allergies, meals_per_day, activity_level

STEP 5 — AI Context:
"Help your AI understand you better (optional)"
Large textarea placeholder: 
"Tell us anything relevant: your schedule, where you eat, 
religious fasts, medical history, food preferences..."
Character count: 0/500
Saves to: user_profiles.ai_context_text

PROGRESS BAR: Thin top bar, fills 20% per step
BACK BUTTON: Top left, ghost
SKIP: Bottom ghost link on steps 3, 4, 5 only (not 1, 2)
CONTINUE: Primary dark green pill button

COMPLETION:
After step 5: 
- Set user_profiles.onboarding_complete = true
- Show a brief welcome animation (1 second)
- Redirect to /app/chat

CHECK ON APP LOAD:
If user is logged in but onboarding_complete = false → redirect to /onboarding
If user is logged in and onboarding_complete = true → go to /app/chat
```


***

2 — Connect Profile to Supabase (Fixes the "AI doesn't know me" problem)

### Prompt 2A — Wire Profile Sections to DB

```
The entire Profile section is currently hardcoded with static data.
Connect ALL profile sections to Supabase so changes actually save and 
the AI reads from the database.

=== PERSONAL INFO ===
On page load: fetch user_profiles WHERE id = auth.uid()
Populate form fields with real data from DB
On [Save Changes] click: UPDATE user_profiles SET ... WHERE id = auth.uid()
Show success toast: "Profile updated ✅"
Show error toast if save fails: "Failed to save — try again"

=== HEALTH CONDITIONS ===
On page load: fetch user_profiles.health_conditions array
Render toggles with ON/OFF state based on what's in the array
On any toggle change: 
  - UPDATE user_profiles SET health_conditions = new_array
  - Show toast: "Conditions updated — your dashboard will reflect changes"
  - Trigger dashboard module visibility update:
    → If 'ibs' in conditions: show FODMAP card on dashboard
    → If 'anxiety' in conditions: show Mood card on dashboard
    → If 'pcos' in conditions: show PCOS module on dashboard
    → If biological_sex = 'male' OR 'prefer_not_to_say': 
       HIDE cycle tracking from nav AND dashboard entirely

=== SUPPLEMENTS & MEDS ===
On page load: fetch supplements_medications WHERE user_id = auth.uid()
Render each supplement as a card

ADD SUPPLEMENT:
Show [+ Add Supplement or Medication] button
On click: open a modal/drawer with form:
  - Name (text input, required)
  - Type (dropdown): Supplement | Prescription Medication | OTC Medication
  - Dosage (text input, e.g. "300mg", "60,000 IU")
  - Frequency (dropdown): Daily | Weekly | Monthly | As needed
  - Timing (dropdown): Morning | Afternoon | Evening | Night | With food | Before food
  - Notes (optional textarea)
  [Save] primary button → INSERT into supplements_medications table
  [Cancel] ghost button

DELETE SUPPLEMENT:
Each supplement card has a [🗑 Remove] button
On click: show confirmation dialog "Remove Vitamin D3?"
On confirm: DELETE from supplements_medications WHERE id = supplement.id
On success: remove card from UI with fade-out animation

EDIT SUPPLEMENT:
Each card has [✏️ Edit] button
On click: open same modal pre-filled with existing data
On save: UPDATE supplements_medications SET ... WHERE id = supplement.id

=== AI CONTEXT ===
On page load: fetch user_profiles.ai_context_text and display in textarea
The "What I know about you" card must fetch REAL data:
  - Name from user_profiles.full_name
  - Age from user_profiles.age
  - Goal from user_profiles.primary_goal
  - Conditions from user_profiles.health_conditions
  - Diet from user_profiles.diet_type
  - Supplements from supplements_medications table (list names)
  - AI context from user_profiles.ai_context_text

[Edit any detail →] link: makes each bullet point inline-editable
  On edit: UPDATE the corresponding field in user_profiles
  On save: show "Saved ✅" inline

Textarea changes: debounced auto-save after 2 seconds of no typing
  Show "Saving..." then "Saved ✅" below the textarea
  UPDATE user_profiles SET ai_context_text = value WHERE id = auth.uid()

Suggestion chips: clicking a chip appends that text to the textarea
```


***

3 — Fix Core Interactions

### Prompt 3A — Fix the Chat (Real AI Integration)

```
The chat is completely hardcoded — it always returns the same 
breakfast response. Fix this to be a real working chat.

APPROACH: Since we are using Supabase Edge Functions as our backend,
create a Supabase Edge Function called 'nutrition-parse' that:

1. Receives: { message: string, userId: string, conversationHistory: array }
2. Calls OpenAI GPT-4o-mini API with a system prompt that includes:
   - User's profile context (fetched from user_profiles)
   - User's health conditions
   - User's supplements
   - User's ai_context_text
   - Today's existing meal logs
3. Returns: { 
     aiResponse: string,
     isMealLog: boolean,
     mealData?: { ingredients[], totalNutrition{} },
     messageType: 'meal_log' | 'question' | 'insight' | 'general'
   }

IF NO OPENAI KEY IS AVAILABLE YET:
Make the chat functional with smart mock responses that vary 
based on what the user types:
- If message contains food words → return a meal log card response
- If message contains "how" or "why" or "?" → return an insight response  
- If message contains "delete" or "remove" → return a confirmation dialog
- Default: return a helpful prompt asking for more info

CRITICAL: The chat must NEVER return hardcoded breakfast data 
unless the user actually typed something about breakfast.

SAVE MESSAGES TO SUPABASE:
Every user message and AI response must be saved to a 
'chat_messages' table:
CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'general',
  meal_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ON APP LOAD: fetch last 20 messages from chat_messages 
WHERE user_id = auth.uid() ORDER BY created_at DESC
Display them in chronological order
This way chat history persists across sessions

LOADING STATE:
While waiting for AI response:
Show 3 animated dots in an AI bubble (typing indicator)
"NourishMind is thinking..." in muted text

ERROR STATE:
If AI call fails: show "I'm having trouble right now. Try again? 🔄"
with a [Retry] button
```


3B — Fix Mood/Gut Logging

```
Fix the mood and gut feeling logging — currently nothing happens 
after submission.

GUT SYMPTOM LOG (on FODMAP card):
When user taps an emoji (😣 😟 😐 🙂 😄):
1. Selected emoji gets green ring + scale animation ✅
2. INSERT into gut_symptom_logs: 
   { user_id, log_date: today, symptom_score: 1-5 }
3. Show immediate feedback BELOW the emoji row:
   Score 1-2: "Sorry you're not feeling great. 
     Your high-FODMAP meals today may be contributing — 
     try peppermint tea or a warm compress."
   Score 3: "Feeling okay! Keep monitoring — 
     your luteal phase may be affecting symptoms this week."
   Score 4-5: "Great gut day! 🎉 Your low-FODMAP choices 
     are working well."
4. Update the "Last logged" text to "Just now"
5. Send toast: "Gut score logged — we'll track your patterns 📊"

MOOD LOG (on Mood-Nutrition card):
When user taps a mood emoji:
1. INSERT into a 'mood_logs' table:
   CREATE TABLE mood_logs (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     user_id UUID REFERENCES user_profiles(id),
     log_date DATE NOT NULL,
     mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 5),
     created_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(user_id, log_date)
   );
2. Update the "Today's Mood" stat in the card immediately
3. Show contextual response:
   Score 1-2: "Low mood noted 💙 Low magnesium today may be 
     contributing. Try dark chocolate or pumpkin seeds."
   Score 3: "Moderate mood. Your nutrition has been fairly balanced."
   Score 4-5: "Great mood! 🌟 Your protein intake today likely helped."
4. If a mood score already exists for today (UNIQUE constraint):
   UPDATE instead of INSERT
   Show: "Mood updated for today ✅"
```


3C — Fix Food Log (Edit + Delete)

```
Fix the Food Log screen — entries cannot be edited or deleted.

EDIT MEAL:
When user clicks [Edit] on any meal entry:
1. Open a full-screen edit page (mobile) or right drawer (desktop)
2. Show the ingredient breakdown table with editable fields:
   - Each row has quantity field that is editable (input)
   - [+ Add ingredient] button to add a new row
   - [🗑] delete button on each ingredient row
3. Show live calorie recalculation as user changes quantities
4. [Save Changes] button:
   - UPDATE meal_logs SET ... WHERE id = meal.id
   - UPDATE meal_ingredients for each changed/added/deleted ingredient
   - Recalculate and UPDATE daily_logs for that date
   - Show toast: "Meal updated ✅"
5. [Cancel] button: discards changes, closes drawer

DELETE MEAL:
Each meal entry row has a swipe-left gesture (mobile) or 
[🗑 Delete] button in the meal detail drawer
On click/swipe: show confirmation:
"Delete Breakfast (697 kcal)? This cannot be undone."
[Delete] red button | [Cancel] ghost button
On confirm: 
  DELETE FROM meal_logs WHERE id = meal.id
  DELETE FROM meal_ingredients WHERE meal_log_id = meal.id
  Recalculate and UPDATE daily_logs
  Remove entry from UI with slide-out animation
  Toast: "Meal deleted — daily totals updated"

You can ALSO delete via chat:
If user types "delete my breakfast" or "remove the lunch I logged":
AI should respond with confirmation:
"I'll delete your Breakfast (697 kcal logged at 8:42 AM). 
Are you sure? [Yes, delete it] [No, keep it]"
On [Yes]: perform the DELETE operations above
```


3D — Fix My Exceptions

```
Fix the My Exceptions section in Profile.
Currently it only shows hardcoded exceptions with no way to add or delete.

DISPLAY:
Fetch exceptions from a 'user_exceptions' table:
CREATE TABLE user_exceptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  exception_type TEXT NOT NULL,  
  original_value TEXT NOT NULL,   
  modified_value TEXT NOT NULL,   
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

HOW EXCEPTIONS ARE CREATED — TWO WAYS:

1. AUTOMATICALLY BY AI (via chat):
When user asks AI something like:
"Change my calorie target to 2000"
"I want a 14 hour fast instead of 16"
"Don't recommend dairy to me"
AI should:
  - Make the change in user_profiles
  - INSERT a record into user_exceptions to document it
  - Confirm: "Done! I've updated your calorie target to 2,000 kcal 
    and saved this as an exception you can review in Profile → My Exceptions"

2. MANUALLY BY USER:
Add an [+ Add Exception] button at the top of My Exceptions section
On click: open a modal with:
  - Exception type (dropdown): 
    Calorie Target | Fasting Window | Macro Split | Food Restriction | 
    Notification Timing | Other
  - Original value (text, auto-populated from profile where possible)
  - Modified value (text input)
  - Reason (optional textarea)
  [Save Exception] button → INSERT into user_exceptions

REVERT EXCEPTION:
[Revert to default] button on each exception card:
  - UPDATE user_profiles to restore original value
  - DELETE from user_exceptions WHERE id = exception.id
  - Toast: "Calorie target reverted to 1,800 kcal ✅"

DELETE EXCEPTION (without reverting):
Small [🗑] icon on each card
Removes the exception LOG but keeps the modified value in place
Confirmation: "Remove exception record? Your custom setting will remain."
```


***

4 — Fix Remaining Broken Features

### Prompt 4A — Fix Gender-Aware Features

```
Fix the app so gender/biological sex controls what features show.

Add this logic to the app's main context/layout:

1. On app load, fetch user_profiles.biological_sex for the current user

2. IF biological_sex = 'male' OR 'prefer_not_to_say':
   - HIDE "Cycle Tracking" from Profile sub-nav entirely
   - HIDE "Cycle Tracking" from the main sidebar nav
   - HIDE the IBS-cycle luteal phase banner on dashboard
   - HIDE the menstrual phase badge on FODMAP card
   - Do NOT show "You're in your Luteal Phase" anywhere

3. IF biological_sex = 'female':
   - Show all cycle tracking features as normal

4. Fix the settings where user can update biological_sex:
   In Profile → Personal Info, the biological sex field must be:
   - Editable (not locked)  
   - On change → UPDATE user_profiles.biological_sex
   - Trigger immediate UI update to show/hide cycle features
   - Toast: "Profile updated — features adjusted accordingly ✅"
```


4B — Fix Cycle Tracker

```
Fix Cycle Tracking in Profile so it actually works.

ON ENABLE:
When user clicks [Enable Cycle Tracking]:
  Show a setup form:
  1. "When did your last period start?" → date picker
  2. "How long is your average cycle?" → number input (default: 28 days)
  3. "How long does your period typically last?" → number input (default: 5 days)
  [Start Tracking] button
  
  On submit: INSERT into menstrual_cycles table:
  { user_id, last_period_start, avg_cycle_length, avg_period_length }
  UPDATE user_profiles SET cycle_tracking_enabled = true

PHASE CALCULATION (auto on each app load):
Calculate current phase from last_period_start + avg_cycle_length:
  Day 1-5: Menstrual phase
  Day 6-13: Follicular phase  
  Day 14-16: Ovulation phase
  Day 17-28: Luteal phase

Display on cycle card:
  Current phase badge (dynamic, not hardcoded)
  Days until next phase (calculated)
  Phase-specific nutrition tip (varies by phase)

LOG NEW PERIOD:
[+ Log Period Start] button on cycle card
On click: date picker modal → INSERT new cycle record
Updates all phase calculations automatically

RESET CYCLE TRACKER:
[Reset / Edit Cycle Data] button (small, muted, below the card)
On click: modal with options:
  [Update last period date] → date picker, updates the record
  [Change cycle length] → number input, updates avg_cycle_length
  [Delete all cycle data] → confirmation dialog, 
    DELETE all records for this user, 
    UPDATE user_profiles SET cycle_tracking_enabled = false
    Resets to the "Enable Cycle Tracking" initial state
```


4C — Fix Download + Share Buttons

```
Fix the Download and Share to Instagram buttons in My Insights.

DOWNLOAD BUTTON:
When user clicks [⬇ Download] on the Weekly Nutrition Story card:
Generate a downloadable PNG/PDF of the weekly summary card.

Implementation:
Use the html2canvas library (install if not present) to capture 
the Weekly Nutrition Story card element as a canvas.
Convert to PNG blob and trigger download:
  filename: "NourishMind-Week-Feb15-21.png"
Show loading state on button while generating: "Generating..."
On success: button shows "Downloaded ✅" for 2 seconds then resets

SHARE TO INSTAGRAM:
Instagram does not have a direct web share API.
Instead, implement as:
1. Generate the same PNG using html2canvas
2. Show a modal with the image preview
3. Two options in the modal:
   [Copy Image] — copies to clipboard using Clipboard API
   [Save to Camera Roll] — triggers the same download as above
4. Show instructions: "Save this image and share it to your 
   Instagram story from your phone 📸"
5. On desktop: show a QR code linking to their insights page
   (use qrcode.react library)
```


4D — Fix Set Reminder Button

```
Fix the [Set Reminder →] button in the End of Day Recap card 
on the Dashboard.

Since browser push notifications require service workers and 
user permission, implement a simpler but functional version:

1. On click: open a small modal/popover:
   Title: "Set a reminder for tomorrow"
   
   Options:
   - Reminder type (pre-filled based on which priority was clicked):
     e.g. "Add eggs for B12" | "Morning sunlight" | "Sleep by 11PM"
   - Time picker: default 8:00 AM
   - Repeat: [Just tomorrow] [Every day] [Weekdays only]
   
   [Set Reminder] primary button
   [Cancel] ghost button

2. On submit: 
   INSERT into a 'reminders' table:
   CREATE TABLE reminders (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     user_id UUID REFERENCES user_profiles(id),
     reminder_text TEXT NOT NULL,
     reminder_time TIME NOT NULL,
     repeat_type TEXT DEFAULT 'once',
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   Show toast: "Reminder set for 8:00 AM tomorrow ✅ 
   (Check Settings to manage reminders)"

3. In Settings → Notifications:
   Add a "My Reminders" section that lists all active reminders
   with [Edit] and [Delete] buttons for each
```


***

## The Correct Order to Run These Prompts

```
Phase 1:  1A (Auth)  →  1B (Onboarding)
Phase 2:  2A (Wire Profile to DB)
Phase 3:  3A (Fix Chat)  →  3B (Mood/Gut)  →  3C (Food Log)  →  3D (Exceptions)
Phase 4:  4A (Gender Logic)  →  4B (Cycle Tracker)  →  4C (Download/Share)  →  4D (Reminders)
```

Run one at a time, verify it works, then move forward. 

