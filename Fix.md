1 — Fix the Chat Screen (P0 — Core Product is Invisible)

```
Fix the Chat & Log screen. The chat currently shows only the AI's first message 
and nothing else. I need you to build the complete chat experience:

1. ADD A MEAL LOG CARD in the chat as the AI's second response. 
After the user message "I had overnight oats for breakfast — 7 almonds, 
1 scoop Myprotein whey, 250ml Amul Gold milk, 1 tsp cocoa powder, sugar free", 
render a structured AI response card with:

HEADER ROW: [🌅 Breakfast] badge in amber | [8:42 AM] timestamp | [✅ 94% Confident] badge in green

INGREDIENT TABLE (use monospace font for numbers):
Columns: Ingredient | Quantity | Calories | Protein | Carbs | Fat | Source

Rows:
Rolled Oats        | 80g           | 297 kcal | 10g | 54g | 5g  | ✅ IFCT
Almonds (7 pcs)    | 21g           | 122 kcal | 4g  | 5g  | 10g | ✅ IFCT  
Myprotein Whey     | 1 scoop (30g) | 103 kcal | 21g | 2g  | 2g  | ✅ Brand DB
Amul Gold Milk     | 250ml         | 163 kcal | 8g  | 12g | 9g  | ✅ Brand DB
Cocoa Powder       | 1 tsp (3g)    | 8 kcal   | 1g  | 1g  | 0g  | ✅ IFCT
Sugar Free sachet  | 1 sachet      | 4 kcal   | 0g  | 1g  | 0g  | ⚠️ Estimated

TOTALS ROW (bold, cream background #F4F2EE):
TOTAL | — | 697 kcal | 44g | 75g | 26g

MICRO BADGES ROW (5 small pill badges below the table):
[Fe 2.1mg 🟡] [Ca 384mg 🟢] [Mg 87mg 🟡] [B12 1.2mcg 🟡] [D 48IU 🔴]

ACTION ROW: [💾 Save as Recipe] ghost button | [✏️ Edit] ghost button

2. ADD AI FOLLOW-UP MESSAGE after the meal log card:
"Logged! 💪 Your breakfast was high in protein (44g — great start!). 
Vitamin D is low though — try to get some morning sunlight or add an egg tomorrow. 
You're at 697 of 1,800 kcal for the day."

3. FIX THE QUICK-LOG CHIPS empty state:
Currently chips show saved meals that don't exist yet. Add an empty state below the 
chips: if no meals are saved, show: "💡 Log a meal 3x to save it as a quick-log chip"

4. FIX THE AI GREETING to be time-aware. Replace "Good morning" with a 
dynamic greeting: morning (5-11AM), afternoon (12-4PM), evening (5-8PM), night (9PM+)

5. UPDATE THE RIGHT PANEL nutrition numbers to reflect the logged meal:
- Calorie ring: update from 420 to 697 kcal
- Macro bars: Protein 44g/150g, Carbs 75g/250g, Fat 26g/65g, Fiber 3g/30g
- Add the 8:42 AM breakfast dot to the meal timing strip with label "Breakfast · 697 kcal"

Style: white card, border 1px #E8E4DC, border-radius 24px, padding 24px, 
shadow subtle. Numbers in JetBrains Mono or monospace font.
```


***

2 — Fix the Dashboard (P0 — Critical Data Gaps)

```
Fix the Dashboard screen. Multiple critical gaps need to be addressed:

1. ADD FASTING WINDOW to the Meal Timing card:
The card currently shows 3 dots (Breakfast 8:42AM, Lunch 1:15PM, Snack 4:30PM) 
with no context. Add:
- A horizontal timeline bar showing the full 24-hour axis
- A shaded green zone showing the fasting window: from last night's dinner 
  (assume 9PM previous day) to breakfast (8:42AM) = 11.7 hours
- Label the fasting window: "11.7 hr fast ✅"
- A small insight below: "Goal: 12 hours · You're 18 mins short"

2. FIX THE CALORIE RING CARD — add drilldown:
Below the ring and "P 89g C 162g F 54g" row, add 3 small meal contribution pills:
[🌅 Breakfast 697 kcal] [☀️ Lunch 480 kcal] [🌤 Snack 243 kcal]
Each pill clickable, navigates to Chat & Log screen

3. ADD BLOOD SUGAR PEAK LABELS:
On the Blood Sugar Simulation chart, add a small label above each wave peak:
- Peak 1: "Breakfast 9:15AM"
- Peak 2: "Lunch 2:00PM"  
- Peak 3: "Snack 5:15PM"
The "Simulated — not medical advice" disclaimer should be in italic, 
muted gray, small font at top right of the card.

4. ADD A HYDRATION MODULE:
Add a new card to the dashboard between the micronutrients row and end-of-day recap:
Title: "Hydration Today 💧"
A horizontal progress bar: [━━━━━━░░░░░░░░] 1.6L / 2.5L (64%)
Color: blue (#4A90D9) 
Below the bar: 5 small water icons — 3 filled (blue), 2 empty (gray) 
representing glasses drunk
Small text: "Last logged: 2:30 PM · +1 glass to hit your goal"
[+ Log Water] small primary button, pill shape

5. FIX THE END OF DAY RECAP visual hierarchy:
Column 1 "What you did well ✅": Add green left border (3px, #3D9970), 
light green tint background (#E8F5E9)
Column 2 "What to improve 📈": Add amber left border (#E8A838), 
light amber tint (#FFF8E1)
Column 3 "Tomorrow's priority 🎯": Add a dark green [Set Reminder →] 
button at the bottom of this column

6. ADD DAILY WELLNESS SCORE EXPLANATION:
The sidebar shows "78/100 Today" but clicking it does nothing. 
Make the score a clickable element. When clicked, show a small popover/tooltip:
"Your Wellness Score = Nutrition (40%) + Sleep (25%) + Hydration (20%) + Mood (15%)
Today: Nutrition 31/40 · Sleep 20/25 · Hydration 13/20 · Mood 14/15"
```


***

3 — Build the Health Conditions + Supplements Profile Sections (P0 — Personalization Blocked)

```
The Profile screen currently shows "Coming soon" for Health Conditions, 
Supplements & Meds, Cycle Tracking, and My Exceptions. Build all four sections now.

=== HEALTH CONDITIONS SECTION ===
When user clicks "Health Conditions" in the profile sub-nav, show:

Title: "Your Health Conditions" 
Subtitle: "This helps us personalize your dashboard and recommendations"

A grid of condition toggle cards (2 columns):
Each card: rounded 12px, border, 56px height, icon + label + toggle switch
Conditions to show:
[🫀 IBS / Gut Issues] — TOGGLED ON (active state: green border + mint bg)
[😰 Anxiety / Depression] — TOGGLED ON
[🔵 PCOS / Hormonal] — off
[🩸 Diabetes / Pre-diabetes] — off
[❤️ Hypertension] — off
[🦋 Thyroid Issues] — off
[⚡ Iron Deficiency Anaemia] — off
[🤱 Post-partum / Breastfeeding] — off

Below the grid:
"+ Add a condition not listed" — ghost button, opens a text input

Below that, an info banner (mint background, rounded):
"Based on your conditions, we've activated: FODMAP Tracker, Gut Symptom Log, 
Mood-Nutrition Correlation, IBS-Cycle Overlap Tracker"
Show 4 small green chip badges for each activated module

[Save Changes] primary button, dark green, pill shape, full width

=== SUPPLEMENTS & MEDS SECTION ===
When user clicks "Supplements & Meds":

Title: "Your Supplements & Medications"

Show 3 pre-filled supplement cards (since Rameshta already has these from profile):

Card 1: 
💊 Vitamin D3 | 60,000 IU | Every Sunday | Morning with food
[Edit] [Remove] small ghost buttons

Card 2:
🌿 Ashwagandha | 300mg | Daily | Night after dinner  
[Edit] [Remove]

Card 3:
⚠️ INTERACTION FLAG card (amber border, amber left stripe):
Icon: ⚠️
"Drug-Nutrient Alert: You take an Iron supplement. Spinach and beets 
(high oxalate) in today's log may reduce iron absorption by up to 50%. 
Consider taking your iron tablet 2 hours apart from these foods."
[Got it] dismiss button

[+ Add Supplement or Medication] button, dashed border, full width

=== CYCLE TRACKING SECTION ===
Title: "Menstrual Cycle Tracking" + "(Optional)" muted label

Top: opt-in card (if not enabled):
Icon: 🌸
"Track your cycle to get phase-based nutrition and workout recommendations, 
plus IBS-cycle correlation insights"
[Enable Cycle Tracking] primary button

Show the enabled state below (since Rameshta has it on):
Current phase badge: "🌸 Luteal Phase · Day 22" 
Badge background: soft purple (#EDE7F6), text: #7E57C2
Days until next phase: "6 days until menstrual phase"

Phase-based tip card (green border):
"During your luteal phase: increase magnesium and complex carbs, 
reduce caffeine and sodium to reduce bloating. 
Your IBS symptoms may be more sensitive this week."

Phase timeline (horizontal):
[Menstrual] → [Follicular] → [Ovulation] → [Luteal ← you are here]
Each phase: circle dot on a line, active dot filled green

=== MY EXCEPTIONS SECTION ===
Title: "Your Logged Exceptions"
Subtitle: "Changes you've asked AI to make to your default recommendations"

Show 2 example exception cards:

Card 1:
Exception: Fasting Window
Original: 16 hours | Modified: 14 hours
Reason: "Cannot fast longer due to medication timing"
Date: Feb 15, 2026
[Revert to default] ghost button

Card 2:
Exception: Calorie Target
Original: 1,600 kcal | Modified: 1,800 kcal
Reason: "Increased workout intensity this month"
Date: Feb 10, 2026
[Revert to default] ghost button

Empty state (shown when no exceptions):
Icon: ✅
"No exceptions logged yet. When you ask AI to adjust a recommendation, 
it will be saved here for your reference."
```


***

4 — Build the Food Log Screen (P0 — Retention Killer)

```
Build the Food Log screen (route: /app/logs). 
This screen shows the user's complete meal history in a clean, 
browseable timeline format.

=== LAYOUT ===
Full content area (no split panel — full width)

TOP BAR:
Left: "Food Log" h2 heading
Right: [← Previous Week] [Feb 15–21, 2026] [Next Week →] date navigator
Below: 4 summary chips in a row:
[🔥 Avg 1,580 kcal/day] [💪 Avg protein 87g] [⏱ Avg fast 12.3 hrs] [💧 Avg water 1.8L]

=== DAILY ACCORDION SECTIONS ===
Show 3 days as example content:

--- SATURDAY, FEB 21 (TODAY) ---
Day header: bold date + total for day on right "1,420 kcal · P89g C162g F54g"
Expanded by default (today is always open)

Meal entries inside:

🌅 BREAKFAST · 8:42 AM · 697 kcal
Overnight Oats Bowl
Rolled Oats + Almonds + Myprotein Whey + Amul Gold Milk + Cocoa + Sugar Free
Confidence: ✅ 94%   [View detail →] [Edit]

☀️ LUNCH · 1:15 PM · 480 kcal
Mess Lunch — Dal Rice + Bhindi Sabzi + 2 Chapati
Confidence: ⚠️ 71% (mess food estimate)   [View detail →] [Edit]

🌤 SNACK · 4:30 PM · 243 kcal
Banana + Black Coffee
Confidence: ✅ 91%   [View detail →] [Edit]

[+ Add missed meal for today] ghost button, dashed border

--- FRIDAY, FEB 20 ---
Day header collapsed: "Friday, Feb 20 · 1,640 kcal" [expand ▼]
Click to expand: shows same meal structure

--- THURSDAY, FEB 19 ---
Day header collapsed: "Thursday, Feb 19 · 1,380 kcal" [expand ▼]

=== MEAL DETAIL DRAWER ===
When user clicks [View detail →] on any meal:
A right-side drawer slides in (400px wide) showing:
- Full ingredient breakdown table (same as meal log card in chat)
- Per-meal micro breakdown
- AI note about this meal: "This meal covered 29% of your daily protein goal"
- [Delete this entry] destructive ghost button at bottom

=== EMPTY STATE ===
When no meals are logged for a day:
Centered illustration placeholder (simple SVG fork+plate icon)
"No meals logged for this day"
[Log a meal →] button that navigates to Chat & Log

=== BOTTOM SUMMARY BAR ===
Sticky at bottom of page:
"This week: 7 meals logged · Best macro day: Tuesday · 
Protein goal hit: 5/7 days"
```


***

5 — Build Condition-Specific Dashboard Modules (P0 — Carbon Copy Promise)

```
The Dashboard needs to show condition-specific modules for users with 
health conditions. Since Rameshta has IBS and Anxiety enabled in her 
Health Conditions profile, add these two new cards to her dashboard:

ADD AFTER THE MICRONUTRIENTS + BLOOD SUGAR ROW:

=== CARD 1: FODMAP TRACKER ===
Card title: "FODMAP Tracker 🫀" 
Subtitle: "Active because you have IBS"
Border: 1px solid #E8E4DC, left border 3px solid #4CAF7C

Today's FODMAP status:
Large badge: "⚠️ Moderate FODMAP Day" — amber background (#FFF3E0), text (#E8A838)

Below: 3 flagged ingredients from today's log:
Row 1: 🔴 Onion (in bhindi sabzi) — HIGH FODMAP — "Consider reducing portion"
Row 2: 🟡 Milk 250ml (Amul Gold) — MODERATE — "Lactose may cause symptoms"
Row 3: 🟢 Oats 80g — LOW FODMAP — "Safe"

Gut symptom log:
"How's your gut feeling today?" 
5-button scale: 😣 😟 😐 🙂 😄 (currently none selected — show interactive)
Below: "Last logged: Yesterday · Score: 3/5"

Small insight: "Your IBS symptoms tend to be higher this week 
(luteal phase). Extra caution with high-FODMAP foods."

=== CARD 2: MOOD-NUTRITION CORRELATION ===
Card title: "Mood & Nutrition Link 🧠"
Subtitle: "Active because you have Anxiety"
Border: left 3px solid #4A90D9

Top stat row (2 columns):
Left: "Today's Mood" — show yesterday's logged score: 😊 4/5
Right: "7-day avg mood" — 3.4 / 5

Insight card (blue tint background #EBF4FF):
"📊 Pattern detected: On days your magnesium is below 60% RDA, 
your mood averages 2.1 vs 3.8 on adequate days.
Today: Magnesium at 48% ⚠️"

Magnesium fix suggestion:
"Add to tomorrow: Dark chocolate (15g), Pumpkin seeds (20g), 
or Spinach to boost magnesium by ~80mg"

[Log today's mood →] mint ghost button

=== ALSO ADD: IBS-CYCLE OVERLAP BANNER ===
A slim full-width banner between the hero card and the 3-card row:
Background: soft purple (#F3E5F5)
Left icon: 🌸
Text: "You're in your Luteal Phase (Day 22) — IBS symptoms are 
typically 2.4× higher this week. FODMAP recommendations tightened."
[Learn more] text link | [X] dismiss button
```


***

6 — Fix Insights Screen + Build Correlations Tab (P1)

```
Fix the My Insights screen. Two issues:

1. WEEKLY TAB — Fix the charts:

7-Day Calorie Breakdown chart:
- Add a dashed horizontal line at y=1800 labeled "Daily Goal" 
  in dark green, font-size small
- Add a tooltip on hover for each bar showing: 
  "Tuesday: 1,720 kcal · P94g · C195g · F58g"
- Ensure bars are STACKED (Protein bottom in green, 
  Carbs middle in amber, Fat top in blue)

Mood vs. Protein Intake scatter plot:
- Add a green regression/trend line through the dots
- Add axis labels: X-axis "Protein (g)", Y-axis "Mood Score (1-5)"
- Add a text annotation on the chart: 
  "Higher protein → better mood (r = 0.72)" in small muted text

2. BUILD THE CORRELATIONS TAB (currently blank):

When user clicks "Correlations" tab, show:

Header: "Your Personal Health Patterns" 
Subtitle: "Based on 3 weeks of data — patterns improve with more logging"
Note: "Available after 4 weeks of consistent logging — here's a preview:"

3 insight cards stacked vertically:

Card 1 (Blue left border #4A90D9):
Icon: 🧠 | Category tag: "Mood + Nutrition"
Heading: "Low magnesium = lower mood"
Body: "On days your magnesium is below 60% of RDA, your mood score 
averages 2.1 vs 3.8 on adequate days — a 81% difference"
Data bar: [LOW Mg days: 😟 2.1] vs [ADEQUATE Mg days: 😊 3.8]
[See all mood data →] link

Card 2 (Green left border):
Icon: ⏰ | Category tag: "Meal Timing + Energy"
Heading: "Early dinner = better next-day energy"
Body: "Your energy scores are 40% higher on days you finish 
eating before 8 PM vs days with post-9 PM meals"
[See timing data →] link

Card 3 (Amber left border):
Icon: 🫀 | Category tag: "IBS + Cycle"
Heading: "IBS symptoms spike in luteal phase"
Body: "Your gut symptom scores average 3.8/5 during your 
luteal phase vs 2.1/5 during follicular phase — 
consistent across 3 cycles tracked"
[See gut data →] link

Below the 3 cards:
Locked card (blurred, lock icon overlay):
"🔒 Unlock after 4 weeks: Sleep + Nutrition correlation"
"Keep logging daily to unlock deeper insights"
```


***

7 — Fix All "Coming Soon" Empty States (P1)

```
Replace ALL "Coming Soon" placeholder screens with meaningful empty states. 
Every screen that currently just shows "[Screen Name] — Coming soon" 
in gray text needs to be replaced with a proper empty state.

Fix these screens:

1. FOOD LOG — already handled in previous prompt (skip if done)

2. SETTINGS screen:
Show a basic settings layout with these sections:

"Account" section:
- Name: Rameshta Vishwakarma [Edit]
- Email: rameshta@email.com
- Profile photo: [R] avatar + [Change photo]

"Notifications" section (toggle switches):
- Daily meal reminder: ON [toggle]
- End-of-day recap: ON · 9:00 PM [toggle + time picker]
- Water reminders: ON · Every 2 hours [toggle]
- Weekly Nutrition Story: ON · Sundays 7PM [toggle]

"App Preferences" section:
- Units: Metric (kg, cm) [dropdown]
- Calorie display: kcal [dropdown]
- Default meal view: Chat [dropdown]
- Dark mode: [toggle — OFF]

"Data & Privacy" section:
- [Export my data — PDF report] ghost button
- [Delete my account] destructive ghost button (red text)

3. MONTHLY tab in Insights:
Show a preview state:
Title: "Monthly View"
Subtitle: "Track your nutrition trends over 30 days"
Show a greyed-out/blurred preview of a line chart
Overlay: "Log for 30 days to unlock your monthly trends"
Progress bar: "17 of 30 days logged" with mint fill

4. TRENDS tab in Insights:
Show 2 trend cards with real data:

Card 1: Weight trend (if tracked)
"You haven't enabled weight tracking yet"
[Enable weight tracking →] button

Card 2: Protein trend (7 days):
Small sparkline chart showing 7 days of protein intake
Days: 78 | 94 | 88 | 102 | 71 | 89 | 94g
Label: "7-day protein avg: 88g · Goal: 150g"
Trend arrow: "↑ 12% vs last week"

5. All Profile sub-sections that are still "coming soon" 
(Personal Info, if not yet built):
Personal Info form:
- Full Name: Rameshta Vishwakarma
- Age: 24
- Biological Sex: Female
- Height: 163 cm
- Weight: 58 kg
- [Save Changes] button
```


***

8 — Add Success States + Micro-Interactions (P1 — Delight Layer)

```
Add success states and micro-interactions throughout the app:

1. MEAL LOGGING SUCCESS:
After the AI responds with a meal log card in the Chat screen,
show a green toast notification at top-right:
"✅ Breakfast logged — 697 kcal · Dashboard updated"
Toast: green left border, white background, 4 second auto-dismiss
Also: the calorie ring in the right panel should visually 
"pulse" once (scale 1.0 → 1.05 → 1.0) when updated

2. SAVE RECIPE SUCCESS:
When user clicks [💾 Save as Recipe] in the meal log card:
Replace the button with: "✅ Saved as 'My Overnight Oats'"
And add the new chip "☀️ My Overnight Oats" to the quick-log chips row

3. WATER LOGGING:
When user clicks [+ Log Water] on the dashboard hydration card:
Show a mini modal/popover:
"How much did you drink?"
4 quick options: [1 glass 250ml] [Half bottle 500ml] [Full bottle 1L] [Custom]
On selection: close modal, update the hydration bar with animation, 
show toast: "💧 250ml logged · 1.85L today"

4. MOOD CHECK-IN SUCCESS:
When user taps a mood emoji on the FODMAP/Mood card:
Selected emoji scales up (1.0 → 1.3 → 1.1), gets a green ring
Other emojis fade to 50% opacity
Toast: "Mood logged — we'll track patterns over time 📊"

5. SIDEBAR WELLNESS SCORE:
Animate the wellness score ring in the sidebar:
On page load, the ring should draw from 0% to 78% over 1 second
The "78" number should count up from 0 to 78 over the same duration
```

