

# NourishMind — 360° AI Wellness App Prototype

## Design System Setup
- Configure custom color palette (deep forest green, mint accents, warm backgrounds)
- Import Google Fonts: Fraunces (serif headings), Inter (body), JetBrains Mono (numbers)
- Set up pill-shaped buttons, 16-24px card radii, warm-tinted shadows
- Establish consistent spacing and typography scale

## Screen 1: Landing Page (/)
- Full-viewport hero with dark green gradient, large serif heading, and two CTA buttons
- Glassmorphism floating card with mini chat preview showing meal logging
- Problem statement section with 3 cards
- Features grid: 1 large + 5 smaller feature cards
- Footer CTA with dark green gradient

## Screen 2: Onboarding (/onboarding)
- Full-screen immersive flow, no sidebar
- Progress bar, step counter, large heading
- Selectable goal pills in 2-column grid with toggle interaction
- Continue button and skip link
- Navigates to /app/chat on continue

## Screen 3: Chat & Log (/app/chat) — Default App Screen
- Sidebar navigation with 6 items, logo, user greeting, and wellness score ring
- Split layout: 65% chat panel + 35% live nutrition panel
- Chat with AI greeting, user message bubble, and detailed meal log card with ingredient table, micro badges, and action buttons
- Quick-log suggestion chips
- Sticky input bar with send button
- Right panel: calorie ring, 4 macro progress bars, micro grid, meal timing strip
- Send button triggers typing animation then renders meal log card

## Screen 4: Dashboard (/app/dashboard)
- Hero card with greeting, calorie progress, and wellness score ring
- Row 1: Calorie ring card, macro donut chart, meal timing chart
- Row 2: Micronutrient deficiency tracker (10 progress bars) + blood sugar simulation area chart (Recharts)
- Row 3: End-of-day recap with 3 columns (did well / improve / tomorrow's priority)

## Screen 5: Profile (/app/profile)
- Left sub-navigation with 7 sections
- "AI Context" section: editable user profile summary, open context textarea with suggestion chips, "what I don't know yet" cards
- Save Context button

## Screen 6: Insights (/app/insights)
- Tab bar: Weekly / Monthly / Trends / Correlations
- Weekly: Instagram-story-style summary card, 7-day stacked calorie bar chart, mood vs nutrition scatter plot
- Correlations: 3 stacked insight cards with colored left borders

## Wired Interactions
- Landing → Onboarding → Chat navigation flow
- Sidebar navigation between all app screens
- Chat send triggers typing animation + meal log card render
- Save Recipe shows success toast
- Profile sub-nav switches sections
- Insights tabs switch views
- Onboarding pills toggle selected state

