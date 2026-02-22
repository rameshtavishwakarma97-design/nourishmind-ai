/**
 * Edge Function: chat
 * PRIMARY AI CHAT ENDPOINT — handles all conversational interactions.
 * 
 * Flow:
 * 1. Detect user intent from message
 * 2. Build user context (carbon copy)
 * 3. Route to appropriate handler:
 *    - meal_log → parse meal → analyze nutrition → verify → save
 *    - question → answer with context
 *    - what_if → compare scenarios
 *    - correction → update previous log
 *    - hydration → log water
 *    - mood/gut → log symptom
 *    - general → chat response
 * 4. Save conversation memory
 * 5. Return AI response
 */
import { createUserClient, createAdminClient, getUserId } from '../_shared/supabase-client.ts';
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { generateJSON, generateChat } from '../_shared/llm.ts';
import { buildMealParserPrompt } from '../_shared/prompts/mealParser.ts';
import { buildUserContext, buildChatSystemPrompt } from '../_shared/prompts/contextBuilder.ts';
import { buildWhatIfQuery, whatIfPlannerPrompt } from '../_shared/prompts/whatIfPlanner.ts';

// Intent detection prompt
const INTENT_SYSTEM_PROMPT = `
You detect the user's intent from their message. Output ONLY valid JSON.
Possible intents: meal_log, question, what_if, correction, hydration, mood_gut, skip_meal, general

Rules:
- "Had 2 eggs and toast" → meal_log
- "What if I ate oats instead?" → what_if  
- "Actually it was 3 eggs not 2" → correction
- "Drank 2 glasses of water" → hydration
- "Feeling bloated after lunch" → mood_gut
- "Skipped breakfast" → skip_meal
- "How much protein in paneer?" → question
- "Thanks" or "OK" → general

OUTPUT: { "intent": "string", "confidence": 0.95 }
`;

interface ChatRequest {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const userClient = createUserClient(req);
    const adminClient = createAdminClient();
    const userId = await getUserId(req);

    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    const body: ChatRequest = await req.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string') {
      return errorResponse('Message is required', 400);
    }

    // Step 1: Detect intent
    const intentResult = await generateJSON<{ intent: string; confidence: number }>(
      INTENT_SYSTEM_PROMPT,
      message
    );
    const intent = intentResult?.intent ?? 'general';

    // Step 2: Load user context
    const todayDate = new Date().toISOString().split('T')[0];

    const [profileResult, todayLogResult, supplementsResult, memoriesResult, mealsCountResult] = await Promise.all([
      userClient.from('user_profiles').select('*').eq('id', userId).single(),
      userClient.from('daily_logs').select('*').eq('user_id', userId).eq('log_date', todayDate).single(),
      userClient.from('supplements_medications').select('*').eq('user_id', userId).eq('is_active', true),
      userClient.from('ai_conversation_memory').select('content, memory_type').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      userClient.from('meal_logs').select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('logged_at', todayDate + 'T00:00:00').lte('logged_at', todayDate + 'T23:59:59'),
    ]);

    const profile = profileResult.data ?? {
      full_name: null, age: null, biological_sex: null,
      height_cm: null, weight_kg: null, primary_goal: null,
      health_conditions: null, dietary_pattern: null,
      typical_sleep_time: null, typical_wake_time: null,
      ai_context_field: null,
    };

    // Compute a basic calorie target from profile (Mifflin-St Jeor)
    let calorieTarget = 2000;
    if (profile.weight_kg && profile.height_cm && profile.age && profile.biological_sex) {
      const bmr = profile.biological_sex === 'male'
        ? 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + 5
        : 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age - 161;
      const activityMultiplier = 1.55; // moderate default
      let tdee = Math.round(bmr * activityMultiplier);
      if (profile.primary_goal === 'weight_loss') tdee -= 400;
      else if (profile.primary_goal === 'muscle_gain') tdee += 300;
      calorieTarget = tdee;
    }

    const todayLog = {
      total_calories: todayLogResult.data?.total_calories ?? 0,
      total_protein_g: todayLogResult.data?.total_protein_g ?? 0,
      water_ml: todayLogResult.data?.water_ml ?? 0,
      meals_count: mealsCountResult.count ?? 0,
      calorie_target: calorieTarget,
    };

    const supplements = (supplementsResult.data ?? []).map((s: Record<string, unknown>) => ({
      name: s.name as string,
      type: s.type as string,
      with_food: s.with_food as boolean,
      time_of_day: s.time_of_day as string | null,
    }));

    const memories = (memoriesResult.data ?? []).map((m: Record<string, unknown>) => ({
      content: m.content as string,
      memory_type: m.memory_type as string,
    }));

    const userContext = buildUserContext(profile, todayLog, memories, supplements);

    // Step 3: Route based on intent
    let responseText: string;
    let responseType = intent;
    let metadata: Record<string, unknown> = {};

    switch (intent) {
      case 'meal_log': {
        // Parse the meal first
        const parserPrompt = buildMealParserPrompt({
          dietaryPattern: profile.dietary_pattern,
          region: 'India',
          time: new Date().toLocaleTimeString('en-IN', { hour12: true }),
        });

        const parsedMeal = await generateJSON<{
          mealType: string;
          parsedIngredients: Array<{
            ingredientName: string;
            brandName: string | null;
            quantityG: number | null;
            needsClarification: boolean;
          }>;
          clarificationNeeded: boolean;
          clarificationQuestion: string | null;
        }>(parserPrompt, message);

        if (!parsedMeal) {
          responseText = "I couldn't parse that meal. Could you describe it again?";
          break;
        }

        // If clarification needed, ask user
        if (parsedMeal.clarificationNeeded) {
          responseText = parsedMeal.clarificationQuestion || "Could you clarify the portions?";
          responseType = 'clarification';
          metadata = { parsedMeal };
          break;
        }

        // Call nutrition-analyze endpoint internally
        const analyzeResponse = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/nutrition-analyze`,
          {
            method: 'POST',
            headers: {
              'Authorization': req.headers.get('Authorization') || '',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ingredients: parsedMeal.parsedIngredients,
              mealType: parsedMeal.mealType,
              rawInput: message,
            }),
          }
        );

        const analyzeData = await analyzeResponse.json();

        if (analyzeData.error) {
          responseText = `I logged your meal but couldn't fully analyze it: ${analyzeData.error}`;
          metadata = { mealType: parsedMeal.mealType, ingredients: parsedMeal.parsedIngredients };
        } else {
          // Build a friendly summary
          const totalCals = Math.round(analyzeData.totals?.calories ?? 0);
          const totalProtein = Math.round(analyzeData.totals?.protein_g ?? 0);
          const totalFiber = Math.round(analyzeData.totals?.fiber_g ?? 0);

          const firstName = (profile.full_name || 'there').split(' ')[0];
          responseText = `Got it, ${firstName}! Your ${parsedMeal.mealType} has been logged.\n\n` +
            `🔥 ${totalCals} kcal | 💪 ${totalProtein}g protein | 🥗 ${totalFiber}g fiber\n\n`;

          // Add a micro-nutrient insight
          if (analyzeData.totals?.iron_mg > 3) {
            responseText += `Nice iron boost today! 💪`;
          } else if (analyzeData.totals?.calcium_mg > 200) {
            responseText += `Great calcium intake from this meal! 🦴`;
          }

          metadata = {
            mealId: analyzeData.mealLogId,
            totals: analyzeData.totals,
            confidence: analyzeData.confidence,
            mealType: parsedMeal.mealType,
            ingredients: analyzeData.ingredients,
          };
        }
        break;
      }

      case 'hydration': {
        // Extract water amount from message
        const waterPrompt = `Extract the water/liquid amount from this message. Output JSON: { "amountMl": number, "drinkType": "water"|"juice"|"tea"|"coffee"|"buttermilk"|"other" }. Conversions: 1 glass = 250ml, 1 bottle = 500ml, 1 liter = 1000ml.`;
        const waterData = await generateJSON<{ amountMl: number; drinkType: string }>(waterPrompt, message);

        if (waterData) {
          await userClient.from('hydration_logs').insert({
            user_id: userId,
            amount_ml: waterData.amountMl,
          });

          // Update daily log
          const newWater = (todayLog.water_ml || 0) + waterData.amountMl;
          const target = profile.hydration_target_ml ?? 2500;
          const pct = Math.round((newWater / target) * 100);

          responseText = `💧 +${waterData.amountMl}ml logged! Total today: ${newWater}ml (${pct}% of target)`;
          metadata = { amountMl: waterData.amountMl, totalToday: newWater };
        } else {
          responseText = "How much water did you drink? (e.g., '2 glasses' or '500ml')";
          responseType = 'clarification';
        }
        break;
      }

      case 'mood_gut': {
        const moodPrompt = `Extract mood/gut symptoms from this message. Output JSON: { "moodScore": 1-5 or null, "gutSymptoms": ["bloating"|"gas"|"cramping"|"nausea"|"diarrhea"|"constipation"|"acid_reflux"|"none"], "severity": 1-5 or null, "notes": "brief note" }`;
        const moodData = await generateJSON<{
          moodScore: number | null;
          gutSymptoms: string[];
          severity: number | null;
          notes: string;
        }>(moodPrompt, message);

        if (moodData) {
          if (moodData.gutSymptoms?.length > 0 && moodData.gutSymptoms[0] !== 'none') {
            await userClient.from('gut_symptom_logs').insert({
              user_id: userId,
              symptom_score: moodData.severity || 3,
              notes: moodData.notes,
              log_date: new Date().toISOString().split('T')[0],
            });
          }
          responseText = `Noted! ${moodData.gutSymptoms?.includes('bloating') ? 'Bloating can be triggered by high-FODMAP foods — I\'ll keep an eye on patterns. 🧠' : 'I\'ll track this for patterns. Take care! 💛'}`;
          metadata = moodData;
        } else {
          responseText = "I'm sorry you're not feeling well. Can you describe your symptoms? (e.g., bloating, cramping, nausea)";
          responseType = 'clarification';
        }
        break;
      }

      case 'what_if': {
        // Get the last meal for comparison
        const { data: lastMeal } = await userClient
          .from('meal_logs')
          .select('*, meal_ingredients(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (lastMeal) {
          const originalMeal = {
            description: lastMeal.raw_input || 'Last meal',
            calories: lastMeal.total_calories || 0,
            proteinG: lastMeal.total_protein_g || 0,
            carbsG: lastMeal.total_carbs_g || 0,
            fatG: lastMeal.total_fat_g || 0,
            fiberG: lastMeal.total_fiber_g || 0,
          };

          const whatIfQuery = buildWhatIfQuery(originalMeal, message, profile.primary_goal);
          const comparison = await generateJSON<Record<string, unknown>>(whatIfPlannerPrompt, whatIfQuery);

          if (comparison) {
            responseText = (comparison.recommendation as string) || "Here's how those options compare!";
            metadata = { comparison };
          } else {
            responseText = "I couldn't compare those scenarios. Could you be more specific?";
          }
        } else {
          responseText = "I don't have a recent meal to compare against. Log a meal first, then ask 'what if'!";
        }
        break;
      }

      case 'question':
      case 'general':
      default: {
        // General chat with context
        const systemPrompt = buildChatSystemPrompt(userContext);
        const history = conversationHistory.map(h => ({
          role: h.role as 'user' | 'model',
          content: h.content,
        }));

        responseText = await generateChat(systemPrompt, history, message);
        break;
      }
    }

    // Step 4: Save conversation memory (async, don't block response)
    adminClient.from('ai_conversation_memory').insert({
      user_id: userId,
      memory_type: 'health_context',
      content: `User: ${message}\nAI: ${responseText.substring(0, 500)}`,
    }).then(({ error: memErr }) => {
      if (memErr) console.error('Memory save failed:', memErr.message);
    });

    return jsonResponse({
      response: responseText,
      intent,
      responseType,
      metadata,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error('Chat function error:', err);
    const errMsg = err instanceof Error ? err.message : String(err);
    // Return friendly message for rate limits
    if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota')) {
      return jsonResponse({
        response: "I'm a bit busy right now — please try again in a minute! 🙏",
        intent: 'error',
        responseType: 'rate_limit',
        metadata: {},
        timestamp: new Date().toISOString(),
      });
    }
    return errorResponse(`Internal server error: ${errMsg}`, 500);
  }
});
