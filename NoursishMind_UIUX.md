<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Now I want to make a comprehensive UI/UX document for figma make which will develop the frontend prototype for me. I want you to make a modern, clean, aesthetic and minimal website. Inspire from award winning websites of awwwards and apps like elevate, balance from the mind company

Here is your comprehensive UI/UX document, designed for Figma's AI-powered prototyping tools, inspired by Balance, Elevate, and Awwwards-winning wellness aesthetics.[^1][^2][^3]

***

# 🎨 NourishMind — UI/UX Design Document

**Document Version:** v1.0
**Author:** Rameshta Vishwakarma
**Tool:** Figma Pro (AI Prototyping)
**Date:** February 21, 2026
**Companion Documents:** PRD v1.0, TRD v1.0

***

# SECTION 1: DESIGN PHILOSOPHY

## 1.1 Core Design Principles

NourishMind's design is built on four pillars, directly inspired by Balance (Google's Best App of 2021) and Awwwards-winning wellness sites:[^4][^1]

- **Calm Intelligence** — The app handles serious health data, but never feels clinical or sterile. Every screen should feel like talking to a wise, warm friend — not a hospital interface
- **Radical Minimalism** — Every element earns its place. If removing it doesn't break function, remove it. Inspired by Elevate's use of generous whitespace and focused single-purpose screens[^3]
- **Data as Art** — Nutrition data is inherently dry. NourishMind transforms it into beautiful, glanceable visual moments — rings, curves, flowing timelines — so users *want* to open the dashboard
- **Motion with Purpose** — Micro-animations are not decoration. Every animation communicates state: a ring filling up celebrates progress, a gentle pulse signals the AI is thinking, a smooth slide confirms a meal was logged


## 1.2 Design Inspiration Breakdown

| Reference | What to Borrow |
| :-- | :-- |
| **Balance (Elevate Labs)** | Soft gradients, personalized fluid backgrounds, warm serif + clean sans pairing, full-bleed immersive screens [^2] |
| **Elevate App** | Gamified progress rings, bold stat display, rounded cards, bright accent on dark or light base [^3] |
| **Awwwards Vibrant Wellness** | 3D-feel depth, large expressive typography, interactive data visualizations [^4] |
| **Linear.app** | Ultra-clean sidebar nav, keyboard-first UX, monochrome base with single accent |
| **Notion** | Conversational, document-like interface for the chat — content-first, chrome-less |


***

# SECTION 2: DESIGN TOKENS

> **Figma Instruction**: Create a dedicated **"Design Tokens"** page in your Figma file. Define all tokens here as Figma Variables before designing any screen. Every color, font, spacing, and radius used in the design must reference a token — never hardcode values.

## 2.1 Color System

### Primary Palette — "Forest \& Cream"

*(Inspired by Balance's earthy warmth — not a typical "health app green")*

```
-- BRAND COLORS --
brand-primary:       #1A3C2E    /* Deep forest green — trust, health, grounded */
brand-accent:        #4CAF7C    /* Fresh mint — energy, growth, vitality */
brand-accent-soft:   #A8D5B5    /* Pale mint — subtle highlights, backgrounds */
brand-warm:          #E8DCC8    /* Warm cream — warmth, approachability */
brand-warm-dark:     #C4A882    /* Warm caramel — secondary warm accent */

-- SEMANTIC COLORS --
success:             #3D9970    /* Confirmed logs, hit goals */
warning:             #E8A838    /* Moderate deficiencies, caution flags */
error:               #D95F5F    /* Critical deficiencies, drug interactions */
info:                #4A90D9    /* Tips, informational callouts */

-- CONFIDENCE SCORES --
confidence-high:     #3D9970    /* >85% — verified DB source */
confidence-medium:   #E8A838    /* 65-85% — partial match */
confidence-low:      #D95F5F    /* <65% — LLM estimated */
```


### Neutral Palette

```
-- LIGHT MODE --
background:          #FAFAF8    /* Warm off-white — never pure white */
surface:             #FFFFFF    /* Cards, modals */
surface-elevated:    #F4F2EE    /* Slightly warm elevated surfaces */
border:              #E8E4DC    /* Subtle warm borders */
text-primary:        #1A1A18    /* Near-black — warm tint */
text-secondary:      #6B6860    /* Muted warm gray */
text-tertiary:       #A5A29C    /* Placeholder, disabled */

-- DARK MODE --
bg-dark:             #0F1A14    /* Deep forest-tinted black */
surface-dark:        #162012    /* Dark card surface */
surface-elevated-dark: #1E2D1A  /* Dark elevated surface */
border-dark:         #2A3D26    /* Dark border */
text-primary-dark:   #F0EDE5    /* Warm off-white text */
text-secondary-dark: #8FA887    /* Muted green-gray */
```


### Gradient System

```
gradient-hero:       linear-gradient(135deg, #1A3C2E 0%, #2D5C42 50%, #4CAF7C 100%)
gradient-card-warm:  linear-gradient(160deg, #FAFAF8 0%, #F0EBE0 100%)
gradient-accent:     linear-gradient(135deg, #4CAF7C 0%, #A8D5B5 100%)
gradient-mood-low:   linear-gradient(135deg, #6B6860 0%, #A5A29C 100%)
gradient-mood-high:  linear-gradient(135deg, #4CAF7C 0%, #E8DCC8 100%)
```


### Macro Color Coding *(consistent across all charts)*

```
macro-protein:       #4CAF7C    /* Green — muscle, strength */
macro-carbs:         #E8A838    /* Amber — energy, fuel */
macro-fat:           #4A90D9    /* Blue — calm, essential */
macro-fiber:         #A8D5B5    /* Light mint — digestive health */
```


### Micro Deficiency Traffic Light

```
micro-sufficient:    #3D9970    /* >80% RDA */
micro-moderate:      #E8A838    /* 50-80% RDA */
micro-deficient:     #D95F5F    /* <50% RDA */
```


***

## 2.2 Typography System

> **Figma Instruction**: Install these two fonts via Figma's font picker. Use the exact weight/size pairings below — do not deviate.

```
-- HEADING FONT --
Family:    "Fraunces" (Variable)
Source:    Google Fonts (free)
Character: Optical-size variable serif — warm, intelligent, editorial
Use for:   Hero headings, dashboard stat numbers, weekly story

-- BODY FONT --
Family:    "Inter" (Variable)
Source:    Google Fonts (free)
Character: Clean, readable, neutral — industry standard
Use for:   All body copy, labels, chat messages, buttons

-- MONO FONT (for nutrition numbers) --
Family:    "JetBrains Mono"
Source:    Google Fonts (free)
Character: Technical precision, tabular numbers
Use for:   Calorie numbers, macro grams, confidence percentages
```


### Type Scale

```
-- DISPLAY (Fraunces) --
display-xl:   64px / 700 weight / -2px tracking   (landing page hero)
display-lg:   48px / 600 weight / -1.5px tracking  (section heroes)
display-md:   36px / 600 weight / -1px tracking    (dashboard big stats)
display-sm:   28px / 500 weight / -0.5px tracking  (card headlines)

-- HEADING (Inter) --
h1:           24px / 700 weight / -0.5px tracking
h2:           20px / 600 weight / -0.3px tracking
h3:           17px / 600 weight / 0px tracking
h4:           15px / 600 weight / 0.1px tracking

-- BODY (Inter) --
body-lg:      17px / 400 weight / 0.1px tracking   (chat messages)
body-md:      15px / 400 weight / 0.1px tracking   (card content)
body-sm:      13px / 400 weight / 0.2px tracking   (labels, captions)
caption:      11px / 500 weight / 0.4px tracking   (tags, timestamps)

-- NUMBERS (JetBrains Mono) --
stat-xl:      48px / 700 weight / tabular-nums     (main calorie display)
stat-lg:      32px / 600 weight / tabular-nums     (macro grams)
stat-md:      20px / 500 weight / tabular-nums     (ingredient nutrition)
stat-sm:      13px / 500 weight / tabular-nums     (micro amounts)
```


***

## 2.3 Spacing System (8pt Grid)

```
space-1:    4px
space-2:    8px
space-3:    12px
space-4:    16px
space-5:    20px
space-6:    24px
space-8:    32px
space-10:   40px
space-12:   48px
space-16:   64px
space-20:   80px
space-24:   96px
```


## 2.4 Border Radius System

```
radius-sm:    6px    (tags, badges, chips)
radius-md:    12px   (input fields, small cards)
radius-lg:    16px   (primary cards)
radius-xl:    24px   (modals, bottom sheets)
radius-2xl:   32px   (hero cards, feature panels)
radius-full:  9999px (pills, avatar, circular rings)
```


## 2.5 Shadow System

```
shadow-sm:   0 1px 3px rgba(26, 60, 46, 0.06), 0 1px 2px rgba(26, 60, 46, 0.04)
shadow-md:   0 4px 12px rgba(26, 60, 46, 0.08), 0 2px 6px rgba(26, 60, 46, 0.05)
shadow-lg:   0 12px 32px rgba(26, 60, 46, 0.10), 0 4px 12px rgba(26, 60, 46, 0.06)
shadow-card: 0 2px 8px rgba(26, 60, 46, 0.07)
```


***

# SECTION 3: COMPONENT LIBRARY

> **Figma Instruction**: Create a **"Components"** page. Build every component below as a Figma Component with Auto Layout. Create Variants for all states listed. Use Figma Variables for all colors and spacing.

## 3.1 Core Components

### Button

**Variants**: Primary | Secondary | Ghost | Destructive | Loading
**Sizes**: SM (32px height) | MD (40px height) | LG (48px height)

```
Primary:
  background: brand-primary (#1A3C2E)
  text: #FFFFFF, Inter 15px/600
  padding: 12px 24px
  radius: radius-full
  hover: background lightens 10%, shadow-md
  active: scale(0.98)
  loading: spinner replaces text, disabled state

Secondary:
  background: transparent
  border: 1.5px solid brand-primary
  text: brand-primary
  hover: background brand-accent-soft

Ghost:
  background: transparent
  text: text-secondary
  hover: background surface-elevated
```


### Input Field

**Variants**: Default | Focused | Error | Filled | Disabled

```
Height: 48px
Background: surface (#FFFFFF)
Border: 1.5px solid border (#E8E4DC)
Radius: radius-md (12px)
Padding: 12px 16px
Font: Inter 15px/400
Focused: border color brand-accent, shadow-sm with green tint
Error: border color error (#D95F5F), error message below in body-sm/error color
Label: body-sm/text-secondary, 8px above field
```


### Chat Message Bubble

**Variants**: User | AI | AI-MealLog | AI-Loading

```
User bubble:
  background: brand-primary (#1A3C2E)
  text: #FFFFFF, body-lg
  radius: 20px 20px 4px 20px (bottom-right sharp)
  max-width: 75% of chat width
  align: right

AI bubble:
  background: surface-elevated (#F4F2EE)
  text: text-primary, body-lg
  radius: 20px 20px 20px 4px (bottom-left sharp)
  max-width: 85%
  align: left

AI-Loading:
  Three animated dots, 8px diameter, brand-accent color
  Animation: sequential scale 0.6→1.0, 400ms stagger
```


### Meal Log Card *(AI message variant)*

```
Container:
  background: surface (#FFFFFF)
  border: 1px solid border
  radius: radius-xl (24px)
  padding: space-6 (24px)
  shadow: shadow-card
  max-width: 90% of chat width

Header row:
  [Meal type badge] [timestamp] [confidence indicator]
  meal-type badge: radius-full, 10px 16px padding
    breakfast: background #FFF3E0, text #E8A838
    lunch: background #E8F5E9, text #3D9970
    dinner: background #EDE7F6, text #7E57C2
    snacks: background #FFF8E1, text #F9A825

Ingredient rows:
  Divider: 1px border between header and ingredients
  Each row: flex, space-between
  Left: ingredient name (body-md) + quantity (body-sm/text-secondary)
  Right: calories (stat-sm/mono) + confidence dot (8px circle, color-coded)

Total row:
  Background: gradient-card-warm
  Border-top: 1px border
  Font: body-md/700 for label, stat-md/mono for values
  Padding: space-4 top

Micro strip:
  5 micro badges in a row: Fe | Ca | Mg | B12 | D
  Each: pill shape, 28px height, color-coded by deficiency level
  
Action row:
  [Save Recipe button — ghost] [Edit — ghost]
```


### Nutrition Progress Bar

**Variants**: Macro | Micro-Sufficient | Micro-Moderate | Micro-Deficient

```
Height: 8px
Background: border (#E8E4DC)
Fill: color by variant (macro uses macro color system, micro uses traffic light)
Radius: radius-full
Animation: width transition 600ms ease-out on mount
Label left: nutrient name (body-sm/text-secondary)
Label right: "Xg / Yg" or "X% of RDA" (stat-sm/mono/text-secondary)
```


### Confidence Score Indicator

```
High (>85%):
  Green dot (8px) + "Verified" text in caption/success
Medium (65-85%):
  Amber dot + "Estimated" in caption/warning
Low (<65%):
  Red dot + "AI Guess" in caption/error + info icon tooltip
```


### Dashboard Ring (Calorie Ring)

```
Size: 200px diameter (desktop) / 160px (mobile)
Stroke width: 16px
Background ring: border color, full circle
Progress ring: gradient-accent fill, animated stroke-dashoffset
Center content:
  Top: "EATEN" caption/text-tertiary
  Middle: stat-xl/mono — calorie number
  Bottom: "of Xkcal" body-sm/text-secondary
Overflow state: ring turns warning color when >100%
Animation: draw from 0 to value in 800ms cubic-bezier(0.34, 1.56, 0.64, 1)
```


### Mood Widget

```
5 emoji buttons in a horizontal row
Size: 44px × 44px each (min touch target)
Unselected: 60% opacity, scale(0.9)
Selected: 100% opacity, scale(1.1), background surface-elevated, shadow-sm
Animation: spring scale on selection
Row label above: "How are you feeling?" in h4
```


### Notification / Toast

```
Uses Sonner library styling
Position: top-right (desktop) / bottom-center (mobile)
Variants: success (green left border) | warning (amber) | error (red) | info (blue)
Height: 56px auto
Icon: 20px on left
Message: body-sm
Duration: 4000ms auto-dismiss
```


***

# SECTION 4: SCREEN-BY-SCREEN DESIGN SPECIFICATIONS

> **Figma Instruction**: Create one Frame per screen listed below. Use the desktop frame size **1440×900** as primary. Create a **375×812** mobile variant for each screen. Name frames exactly as listed.

***

## Screen 1: Landing Page (`/`)

### Layout

Full-bleed, single-page scroll. 5 sections.

### Section 1.1 — Hero

```
Background: gradient-hero (deep green to mint)
Height: 100vh

LEFT COLUMN (60% width):
  Top: NourishMind logo — wordmark in Fraunces 24px/white
  Middle:
    Eyebrow text: "360° Wellness Intelligence" — caption/white/60% opacity, uppercase, letter-spacing 2px
    H1: display-xl/Fraunces/white:
      "Your health,
      finally understood."
    Body: body-lg/white/80% opacity:
      "Tell the AI what you ate. In plain words.
      No searching, no measuring, no guessing."
    CTA Row:
      [Get Started Free — Primary Button/white bg/dark text]
      [Watch how it works — Ghost/white]

RIGHT COLUMN (40% width):
  Floating chat preview card:
    background: white/10% opacity, backdrop-blur: 20px
    border: 1px solid white/20%
    radius: radius-2xl
    Shows a mock chat:
      User: "I had overnight oats with 7 almonds, 1 scoop Myprotein whey, 250ml Amul Gold milk"
      AI response card: MealLogCard component rendered in preview

BOTTOM: Scroll indicator — small animated chevron, white/60%
```


### Section 1.2 — Problem (The Pain)

```
Background: background (#FAFAF8)
Padding: space-20 vertical

Center-aligned headline:
  display-lg/Fraunces/text-primary:
  "Logging food shouldn't feel like a part-time job."

3-column cards (equal width, gap space-6):
  Card 1: Icon (search) + "Manual searching, one ingredient at a time"
  Card 2: Icon (database) + "Western food databases that don't know dal from dhokla"
  Card 3: Icon (user) + "Generic advice for users the app barely knows"

Each card:
  background: surface-elevated
  radius: radius-xl
  padding: space-8
  border: 1px solid border
  Icon: 48px, brand-accent tint
  Title: h3/text-primary
  Body: body-md/text-secondary
```


### Section 1.3 — Solution (The Magic)

```
Background: surface-elevated (#F4F2EE)
Full-width horizontal scroll demo:

Left: sticky product description
  Label: "How NourishMind works"
  3 steps with animated number indicators:
    1. "Type what you ate, naturally"
    2. "AI analyzes every ingredient"  
    3. "Your personalized dashboard updates"

Right: animated chat mockup cycling through 3 states as user scrolls
```


### Section 1.4 — Features Grid

```
Background: background
2×3 masonry grid of feature cards

Large card (spans 2 cols):
  background: brand-primary
  text: white
  Feature: AI Food Logging
  Visual: animated chat preview

Medium cards:
  Carbon Copy Profiling | Menstrual Tracking |
  Mental Health Link | Drug Interactions | WhatsApp Bot
```


### Section 1.5 — CTA Footer

```
Background: gradient-hero
Center-aligned:
  display-md/Fraunces/white: "Start your 360° health journey."
  [Get Started Free — white button]
  body-sm/white/60%: "Free forever. No credit card."
```


***

## Screen 2: Onboarding Flow (`/onboarding`)

### Layout Philosophy

Full-screen, one question at a time. Inspired by Balance's immersive question-by-question onboarding. No header chrome, no navigation. Pure focus.[^1]

```
Background: gradient — shifts subtly with each question answer
  Question 1: warm cream gradient
  Question 2: soft green gradient
  Question 3: muted purple (condition question)
  Question 4: warm amber
  Question 5: forest green (final)

Progress Bar:
  Top of screen, full width
  Height: 3px
  background: white/20%
  fill: white, animates width per step

Back arrow: top-left, ghost, white

Question area (centered, max-width 600px):
  Step counter: "1 of 5" caption/white/60%
  Question: display-sm/Fraunces/white
  
  Answer options (vary by question type):
    Multiple choice: pill buttons, white/20% bg, select → white filled
    Free text: large ghosted input, white border, white text
    Slider (height/weight): custom range slider, white track
  
  Continue button: bottom-center, Primary/white bg/dark text
  Skip link: below button, ghost/white/60%
```


### Onboarding Completion Screen

```
Background: gradient-hero
Center:
  Large animated checkmark (Framer Motion draw animation)
  display-md/Fraunces/white: "Your coach is ready."
  body-lg/white/80%: "Here's what I know about you so far."
  
  Profile Summary Card (white, radius-2xl):
    Bullet list of "How AI sees you" data
    Each bullet: green dot + body-md/text-primary
    [Edit any detail — ghost button]
  
  [Open NourishMind — Primary button]
```


***

## Screen 3: Main App Shell (`/app`)

### Layout — Desktop Sidebar Layout

```
LEFT SIDEBAR (240px fixed):
  Top:
    NourishMind logo wordmark (24px, brand-primary)
    User avatar + name (display: "Hi, Rameshta 👋")
  
  Navigation Items (each 44px height, 16px padding):
    🏠 Dashboard         → /app/dashboard
    💬 Chat & Log        → /app/chat  [PRIMARY — highlighted]
    📊 My Insights       → /app/insights
    📋 Food Log          → /app/logs
    👤 My Profile        → /app/profile
    ⚙️  Settings          → /app/settings
  
  Active state: brand-accent-soft background, brand-primary text, left 3px border brand-accent
  Hover state: surface-elevated background
  
  Bottom:
    Daily Wellness Score widget (compact ring, score/100)
    "Today: 78/100" with trend arrow

MAIN CONTENT AREA (1200px, auto margin):
  Top bar (56px):
    Page title (h2)
    Right: [date selector] [notification bell] [dark mode toggle]
```


### Layout — Mobile Bottom Nav

```
5-tab bottom navigation bar:
  Height: 60px + safe area
  Background: surface/95% opacity, backdrop-blur
  Border-top: 1px border
  Tabs: Home | Chat | Log | Insights | Profile
  Active: brand-accent icon + label, animated underline dot
```


***

## Screen 4: Chat Interface (`/app/chat`)

### Layout

```
Split view on desktop:
  LEFT (65%): Chat window
  RIGHT (35%): Live nutrition panel (updates as meals are logged)

Mobile: Chat fullscreen, bottom sheet for nutrition panel
```


### Chat Window

```
TOP BAR:
  "NourishMind" (h3) + "Your AI Health Coach" (body-sm/text-secondary)
  Right: [Today's summary chip — calories/target]

MESSAGES AREA:
  Padding: space-6 horizontal, space-4 vertical
  Gap between messages: space-3
  
  Date divider: "Today, Saturday Feb 21" centered, caption/text-tertiary, horizontal rules
  
  AI welcome message (first visit):
    AI bubble with special gradient background (gradient-hero, text white)
    "Good morning, Rameshta! I'm ready to help you track today.
     What did you eat for breakfast? Just describe it naturally. 🌿"

  Quick suggestion chips (above input):
    Horizontally scrollable row
    Shows top 3 saved meals as pills
    [☀️ My Overnight Oats] [🍚 Dal Rice Mess] [+ Add new]
    Chip style: radius-full, surface-elevated bg, border, body-sm

INPUT BAR:
  Background: surface
  Border-top: 1px border
  Padding: space-4
  
  Textarea: auto-resize, min 48px, max 120px
    Placeholder: "Tell me what you ate, or ask me anything..."
    Font: body-lg, text-primary
    Background: surface-elevated
    radius: radius-xl
    padding: 12px 16px
  
  Right of textarea:
    [📷 Barcode icon — ghost, 36px]
    [Send button — brand-primary circle, 44px, arrow icon]
```


### Live Nutrition Panel (right side, desktop)

```
Header: "Today's Nutrition" (h3) + date

Calorie Ring (centered, 160px):
  Current calories / daily target
  Animated fill

Macro bars (4 items):
  Protein: green progress bar + "Xg / Yg"
  Carbs: amber progress bar
  Fat: blue progress bar
  Fiber: light-mint progress bar

Micro grid (2×5):
  10 micro badges: Fe | Ca | Mg | K | Na | B12 | D | Zn | Folate | Water
  Color-coded by deficiency level

Meal timeline (bottom):
  Horizontal 24-hour axis
  Meal dots at logged timestamps
  Hover: tooltip shows meal name + calories
```


***

## Screen 5: Dashboard (`/app/dashboard`)

### Layout

Masonry-style card grid. Cards breathe — generous gutters.[^5]

```
TOP SECTION — Greeting Hero Card (full width):
  Background: gradient-hero
  Left: 
    "Good evening, Rameshta ✨" — display-sm/Fraunces/white
    "You've eaten 1,420 of 1,800 kcal today." — body-lg/white/80%
    Progress bar: 78% filled, white/30% bg
  Right: Daily Wellness Score ring (white stroke, 100px)

GRID ROW 1 (3 equal columns):
  Card: Calorie Ring (200px ring, full macro detail)
  Card: Macro Split (Recharts donut chart, 3-segment)
  Card: Meal Timing Chart (24-hour timeline with meal dots)

GRID ROW 2 (2 columns, 60/40 split):
  Large card (60%): Micro Deficiency Tracker
    10 horizontal progress bars
    Each bar: nutrient name + amount + % RDA + traffic light color
  Small card (40%): Blood Sugar Simulation
    Recharts AreaChart
    Soft wave curves for each meal
    "Simulated" watermark in light text
    X-axis: time (6AM–midnight)
    Y-axis: relative blood sugar

GRID ROW 3 (condition-specific, auto-shown):
  FOR IBS USERS: FODMAP Tracker card (full width)
    Today's FODMAP-risky foods flagged in red chips
    Gut symptom log input (1–5 scale)
  
  FOR CYCLE TRACKING USERS: Cycle Phase card
    Current phase badge (color by phase)
    Phase-specific nutrition tip
    Days until next phase

GRID ROW 4: End-of-Day Recap card (full width, shown from 7PM)
  3-column: "What you did well" | "Where to improve" | "Tomorrow's priority"
```


***

## Screen 6: Insights Page (`/app/insights`)

### Layout

```
Tab bar at top:
  [Weekly] [Monthly] [Trends] [Correlations]

WEEKLY TAB:
  Weekly Nutrition Story card (featured, 1:1 aspect ratio preview)
    background: gradient-hero
    Shows this week's stats beautifully formatted
    [Share to Instagram] [Download PNG]
  
  7-day calorie bar chart (Recharts BarChart)
    Each bar: stacked protein/carbs/fat colors
    Target line: dashed horizontal
  
  7-day mood vs. nutrition scatter
    X-axis: protein intake
    Y-axis: mood score
    Regression line shown

TRENDS TAB:
  Weight trend line chart (if tracked)
  Average macro adherence by weekday
  Fasting window trend (line chart)
  Sleep hours correlation (dual-axis)

CORRELATIONS TAB (unlocked after 30 days):
  Insight cards — each card:
    background: surface-elevated
    Left: 60px icon illustration
    Right: insight text in body-md
    E.g.: "On low-magnesium days, your mood averages 2.1 vs. 3.8"
    [See detail →] link
```


***

## Screen 7: Profile / Settings (`/app/profile`)

### Layout

```
LEFT (300px): vertical nav menu
  Personal Info | Health Conditions | Supplements & Meds
  Cycle Tracking | My Exceptions | AI Context | Privacy

RIGHT: Content panel for each section

"HOW AI SEES YOU" CARD (top of profile):
  background: gradient-card-warm
  radius: radius-xl
  border: 1px solid brand-accent-soft
  Header: "What I know about you" + "Last updated today" (caption/text-tertiary)
  Bullet list: editable inline on click
  Bottom: "What I don't know yet →" link in brand-accent

AI CONTEXT FIELD:
  Large textarea (min 120px, auto-resize)
  Placeholder: "E.g., I'm a hostel student eating mess food, I travel for work 2 weeks a month..."
  Character count: bottom-right, caption/text-tertiary
  Suggestion pills below: "Hostel student" | "Night shift worker" | "Frequent traveler" | "Religious fasts"
  [Save Context — Primary button]

MY EXCEPTIONS LOG:
  Table-style list:
    [Exception type] [Original] [Modified] [Reason] [Date]
    Row: surface background, hover surface-elevated
    Editable inline
```


***

## Screen 8: Onboarding Progressive Question (Days 2–10)

```
Shown as a bottom sheet on the chat screen (not full-screen interrupt)
Height: 280px
Background: surface
radius: radius-2xl top corners only
Handle bar: 4px × 40px, text-tertiary, centered top

Content:
  "Quick question for today 💬" — caption/text-tertiary
  Question text: h3/text-primary
  Answer options: pill buttons
  [Answer + skip] ghost link at bottom

After answer: sheet dismisses with spring animation, AI acknowledges in chat:
  "Got it! I'll factor that into your recommendations. 🌿"
```


***

# SECTION 5: MOTION \& ANIMATION SYSTEM

> **Figma Instruction**: Use Figma's Smart Animate for transitions. Define these as reusable Prototype interactions.

```
-- PAGE TRANSITIONS --
Enter: fade up (y: 16px → 0, opacity: 0 → 1, duration: 300ms, ease: ease-out)
Exit: fade (opacity: 1 → 0, duration: 200ms)

-- CARD MOUNT --
Each card: stagger 60ms delay, slide up 12px, fade in, duration: 400ms

-- RING ANIMATION --
Stroke dashoffset draw: 800ms, cubic-bezier(0.34, 1.56, 0.64, 1) (slight overshoot)

-- MEAL LOGGED SUCCESS --
1. Send button: scale pulse (1.0 → 1.2 → 1.0, 300ms)
2. MealLogCard: slides in from bottom, fade, 400ms
3. Calorie ring: refills to new value, 600ms

-- AI THINKING --
Three dot pulse: sequential scale 0.6→1.0, 400ms stagger

-- CHAT MESSAGE --
New message: slide in from direction (user: right, AI: left), fade, 250ms

-- BOTTOM SHEET --
Open: slide up from y:100%, spring (damping: 20, stiffness: 300)
Close: slide down, 250ms ease-in

-- PROGRESS BARS --
Mount: width 0% → actual%, 600ms ease-out, stagger 80ms between bars

-- NUMBER COUNTER --
Dashboard stats: count up from 0 to value, 1200ms, ease-out
```


***

# SECTION 6: FIGMA FILE STRUCTURE

> **Figma Instruction**: Organize your Figma file with exactly these pages in this order.

```
📄 PAGE 1: Cover
  — Project title, version, author, date

📄 PAGE 2: Design Tokens
  — All color variables, typography, spacing, radius, shadows defined as Figma Variables

📄 PAGE 3: Component Library
  — All components from Section 3, with all variants, organized in frames by type

📄 PAGE 4: Desktop Screens (1440×900)
  — Frame 01: Landing Page
  — Frame 02: Onboarding Step 1–5
  — Frame 03: Onboarding Complete
  — Frame 04: Chat Interface
  — Frame 05: Dashboard
  — Frame 06: Insights — Weekly
  — Frame 07: Insights — Correlations
  — Frame 08: Profile — AI Context
  — Frame 09: Settings

📄 PAGE 5: Mobile Screens (375×812)
  — Mobile variants of all 9 screens

📄 PAGE 6: Prototype Flows
  — Connected prototype with all transitions from Section 5
  — Flow 1: New user onboarding
  — Flow 2: Daily logging journey
  — Flow 3: Dashboard exploration

📄 PAGE 7: Dark Mode
  — Key screens in dark mode using dark token variants

📄 PAGE 8: Design Annotations
  — Developer handoff notes, edge cases, interaction specs
```


***

# SECTION 7: DARK MODE SPECIFICATION

```
Toggle: System preference detected by default + manual toggle in settings

All dark tokens defined in Section 2.1 apply.

Special dark mode treatments:
  — Calorie ring: glows softly (drop shadow with brand-accent/30% opacity)
  — Chat AI bubbles: surface-dark background, slight green tint
  — Charts: grid lines at 15% opacity white, labels at text-secondary-dark
  — Dashboard cards: surface-dark, subtle gradient-top dark-to-transparent
  — Confidence dots: increase saturation by 15% for visibility on dark bg
```


***

# SECTION 8: ACCESSIBILITY CHECKLIST

> **Figma Instruction**: Run the Figma Accessibility plugin (free) on every screen before handoff.

- [ ] All text meets WCAG AA contrast ratio (4.5:1 for body, 3:1 for large text)[^6]
- [ ] All interactive elements minimum 44×44px tap target
- [ ] Focus states visible on all interactive elements (2px brand-accent outline)
- [ ] Error states never communicate only through color (always icon + text)
- [ ] Form fields have visible labels (not just placeholder text)
- [ ] Charts have text-based data tables as accessible alternatives
- [ ] Emoji used decoratively never as the only content carrier

***


