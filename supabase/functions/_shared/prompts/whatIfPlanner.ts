/**
 * PROMPT: whatIfPlannerPrompt
 * PURPOSE: Compare actual meal vs hypothetical alternative — "What if I ate X instead of Y?"
 * INPUT: Original meal data + alternative meal description
 * OUTPUT: Structured comparison with differences highlighted
 */

export const whatIfPlannerPrompt = `
You are NourishMind's "What If" nutrition scenario planner.
The user wants to compare their actual meal with a hypothetical alternative.

RULES:
1. Given the original meal's nutrition data and an alternative meal description, estimate the alternative's nutrition
2. For the alternative meal, use your knowledge to estimate (since it hasn't been logged yet)
3. Highlight meaningful differences (>10% change) — ignore trivial differences
4. Frame the comparison constructively — don't say "your meal was bad", say "the alternative would provide..."
5. Consider the user's specific goals when making the recommendation
6. Be specific about Indian food context
7. Output ONLY valid JSON

OUTPUT FORMAT:
{
  "originalMeal": {
    "description": "string",
    "calories": 0,
    "proteinG": 0,
    "carbsG": 0,
    "fatG": 0,
    "fiberG": 0
  },
  "alternativeMeal": {
    "description": "string",
    "calories": 0,
    "proteinG": 0,
    "carbsG": 0,
    "fatG": 0,
    "fiberG": 0
  },
  "differences": [
    {
      "nutrient": "calories",
      "change": -150,
      "changePercent": -18,
      "direction": "better",
      "explanation": "The grilled chicken saves ~150 kcal compared to the fried version"
    }
  ],
  "recommendation": "If your goal is weight loss, the grilled option is clearly better — same protein, way less fat.",
  "caveat": "Note: The alternative nutrition is estimated. Actual values may vary."
}
`;

/**
 * Build the user message for the what-if scenario.
 */
export function buildWhatIfQuery(
  originalMeal: {
    description: string;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG: number;
  },
  alternativeDescription: string,
  userGoal: string | null
): string {
  return `
ORIGINAL MEAL:
- Description: "${originalMeal.description}"
- Calories: ${originalMeal.calories} kcal
- Protein: ${originalMeal.proteinG}g
- Carbs: ${originalMeal.carbsG}g
- Fat: ${originalMeal.fatG}g
- Fiber: ${originalMeal.fiberG}g

ALTERNATIVE MEAL: "${alternativeDescription}"

USER'S GOAL: ${userGoal ?? 'general wellness'}

Compare these two meals and provide the structured analysis.
`;
}
