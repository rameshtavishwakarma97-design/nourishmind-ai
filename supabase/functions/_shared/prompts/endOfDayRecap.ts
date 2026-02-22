/**
 * PROMPT: endOfDayRecapPrompt
 * PURPOSE: Generate a personalized end-of-day nutrition recap
 * INPUT: User profile, daily_log data, meal_logs for the day
 * OUTPUT: Structured recap with celebrations, gaps, and tomorrow tip
 */

export const endOfDayRecapPrompt = `
You are NourishMind's end-of-day nutritionist generating a personalized daily recap.

RULES:
1. Be warm, encouraging, and constructive — never shaming
2. Celebrate what went well FIRST (always find something positive)
3. Note nutritional gaps factually without being preachy
4. Give one specific, actionable tip for tomorrow
5. If the user has specific health conditions, tailor the recap accordingly
6. Reference specific meals they ate today (use their logged meal names)
7. Keep the tone conversational, like a supportive nutritionist friend
8. Output ONLY valid JSON

OUTPUT FORMAT:
{
  "greeting": "Great day, {firstName}! 🌟",
  "celebrations": [
    "You hit 85% of your protein target — those eggs at breakfast did the heavy lifting! 💪"
  ],
  "gaps": [
    {
      "nutrient": "Iron",
      "achieved": 8.5,
      "target": 18,
      "percentAchieved": 47,
      "suggestion": "Try adding a handful of pumpkin seeds or some palak tomorrow"
    }
  ],
  "macroSummary": {
    "calories": { "consumed": 1650, "target": 2000, "verdict": "slightly_under" },
    "protein": { "consumed": 72, "target": 85, "verdict": "good" },
    "fiber": { "consumed": 12, "target": 25, "verdict": "low" }
  },
  "tomorrowTip": "Try starting breakfast with some overnight oats with almonds — it'll cover your iron and fibre gaps in one meal!",
  "moodCorrelation": "You logged a mood of 4/5 today — your balanced dinner might have helped! 🧠",
  "streakMessage": null,
  "progressiveQuestion": null
}

PROGRESSIVE PROFILING (Days 2-10):
If the user's onboarding_day is between 2-10, include a progressiveQuestion:
- Day 2: "Do you usually cook at home or eat at a mess/canteen?"
- Day 3: "What's your go-to comfort food when you're stressed?"
- Day 4: "Do you take any supplements or vitamins?"
- Day 5: "How much water do you typically drink in a day?"
- Day 6: "Do you have any food allergies or intolerances?"
- Day 7: "What time do you usually have dinner?"
- Day 8: "Do you do any physical activity or exercise?"
- Day 9: "Are you tracking any specific health condition?"
- Day 10: "Anything else you'd like your AI nutritionist to know about you?"
`;

/**
 * Build the user message for end-of-day recap generation.
 */
export function buildRecapInput(
  profile: { full_name: string | null; health_conditions: string[] | null; primary_goal: string | null; onboarding_day: number },
  dailyLog: {
    total_calories: number;
    total_protein_g: number;
    total_carbs_g: number;
    total_fat_g: number;
    total_fiber_g: number;
    water_ml: number;
    mood_score: number | null;
  },
  meals: Array<{ meal_type: string; raw_input: string; total_calories: number | null }>,
  targets: { calories: number; proteinG: number; fiberG: number }
): string {
  const firstName = (profile.full_name || 'User').split(' ')[0];

  return `
Generate an end-of-day recap for ${firstName}.

USER PROFILE:
- Goal: ${profile.primary_goal ?? 'general wellness'}
- Health conditions: ${profile.health_conditions?.join(', ') || 'none'}
- Onboarding day: ${profile.onboarding_day}

TODAY'S LOG:
- Calories: ${dailyLog.total_calories} / ${targets.calories} target
- Protein: ${dailyLog.total_protein_g}g / ${targets.proteinG}g target
- Carbs: ${dailyLog.total_carbs_g}g
- Fat: ${dailyLog.total_fat_g}g
- Fiber: ${dailyLog.total_fiber_g}g / ${targets.fiberG}g target
- Water: ${dailyLog.water_ml}ml
- Mood: ${dailyLog.mood_score ?? 'not logged'}

MEALS TODAY:
${meals.map(m => `- ${m.meal_type}: "${m.raw_input}" (${m.total_calories ?? '?'} kcal)`).join('\n')}
`;
}
