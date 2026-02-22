/**
 * Edge Function: nutrition-verify
 * 3-PASS VERIFICATION — sanity-checks meal nutrition before finalizing.
 * 
 * Pass 1: Completeness — are any obvious ingredients missing?
 * Pass 2: Plausibility — are per-ingredient values physiologically reasonable?
 * Pass 3: Totals — is the total meal nutrition plausible for one sitting?
 */
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getUserId } from '../_shared/supabase-client.ts';
import { generateJSON } from '../_shared/llm.ts';
import { verificationPassPrompts } from '../_shared/prompts/verificationPass.ts';

interface VerifyRequest {
  rawInput: string;
  ingredients: Array<{
    ingredientName: string;
    quantityG: number;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    source: string;
    confidence: number;
  }>;
  totals: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG: number;
  };
  mealType: string;
}

interface VerificationResult {
  passed: boolean;
  pass1: { isComplete: boolean; missingIngredients: string[]; completenessWarning: string | null };
  pass2: { isPlausible: boolean; suspiciousIngredients: string[]; plausibilityWarning: string | null };
  pass3: { isTotalPlausible: boolean; totalWarnings: string[]; suggestSplitting: boolean };
  overallWarnings: string[];
  corrections: Array<{ ingredientName: string; field: string; original: number; suggested: number }>;
}

Deno.serve(async (req: Request) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const userId = await getUserId(req);
    if (!userId) return errorResponse('Unauthorized', 401);

    const body: VerifyRequest = await req.json();
    const { rawInput, ingredients, totals, mealType } = body;

    const ingredientSummary = ingredients.map(i =>
      `${i.ingredientName}: ${i.quantityG}g → ${i.calories} kcal, ${i.proteinG}g P, ${i.carbsG}g C, ${i.fatG}g F [${i.source}, confidence ${i.confidence}]`
    ).join('\n');

    const verifyInput = `
RAW MEAL DESCRIPTION: "${rawInput}"
MEAL TYPE: ${mealType}

EXTRACTED INGREDIENTS:
${ingredientSummary}

MEAL TOTALS:
Calories: ${totals.calories} kcal
Protein: ${totals.proteinG}g
Carbs: ${totals.carbsG}g
Fat: ${totals.fatG}g
Fiber: ${totals.fiberG}g
`;

    // Run all 3 passes in parallel for speed
    const [pass1Result, pass2Result, pass3Result] = await Promise.all([
      generateJSON<{
        isComplete: boolean;
        missingIngredients: string[];
        completenessWarning: string | null;
      }>(verificationPassPrompts.pass1_completeness, verifyInput),

      generateJSON<{
        isPlausible: boolean;
        suspiciousIngredients: string[];
        plausibilityWarning: string | null;
      }>(verificationPassPrompts.pass2_plausibility, verifyInput),

      generateJSON<{
        isTotalPlausible: boolean;
        totalWarnings: string[];
        suggestSplitting: boolean;
        splitSuggestion: string | null;
      }>(verificationPassPrompts.pass3_totals, verifyInput),
    ]);

    // Build result
    const pass1 = pass1Result ?? { isComplete: true, missingIngredients: [], completenessWarning: null };
    const pass2 = pass2Result ?? { isPlausible: true, suspiciousIngredients: [], plausibilityWarning: null };
    const pass3 = pass3Result ?? { isTotalPlausible: true, totalWarnings: [], suggestSplitting: false };

    const overallWarnings: string[] = [];
    if (pass1.completenessWarning) overallWarnings.push(pass1.completenessWarning);
    if (pass2.plausibilityWarning) overallWarnings.push(pass2.plausibilityWarning);
    if (pass3.totalWarnings?.length) overallWarnings.push(...pass3.totalWarnings);

    const passed = pass1.isComplete && pass2.isPlausible && pass3.isTotalPlausible;

    const result: VerificationResult = {
      passed,
      pass1,
      pass2,
      pass3,
      overallWarnings,
      corrections: [],
    };

    return jsonResponse(result);

  } catch (err) {
    console.error('Verification error:', err);
    return errorResponse('Internal server error', 500);
  }
});
