/**
 * Edge Function: user-summary
 * Generates AI "How I see you" summary — the carbon copy interpretation.
 * Called from the user profile screen.
 */
import { createUserClient, getUserId } from '../_shared/supabase-client.ts';
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { generateChat } from '../_shared/gemini.ts';

Deno.serve(async (req: Request) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const userClient = createUserClient(req);
    const userId = await getUserId(req);
    if (!userId) return errorResponse('Unauthorized', 401);

    // Fetch all relevant user data
    const [profileRes, mealsRes, dailyLogsRes, supplementsRes, memoriesRes] = await Promise.all([
      userClient.from('user_profiles').select('*').eq('id', userId).single(),
      userClient.from('meal_logs').select('meal_type, raw_input, total_calories, total_protein_g, logged_at')
        .eq('user_id', userId).order('logged_at', { ascending: false }).limit(30),
      userClient.from('daily_logs').select('*')
        .eq('user_id', userId).order('log_date', { ascending: false }).limit(7),
      userClient.from('supplements_medications').select('*')
        .eq('user_id', userId).eq('is_active', true),
      userClient.from('ai_conversation_memory').select('content, memory_type')
        .eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
    ]);

    const profile = profileRes.data;
    const meals = mealsRes.data || [];
    const dailyLogs = dailyLogsRes.data || [];
    const supplements = supplementsRes.data || [];
    const memories = memoriesRes.data || [];

    if (!profile) {
      return jsonResponse({
        summary: "I don't have enough data about you yet. Start by completing your profile and logging a few meals!",
        insights: [],
        daysTracked: 0,
      });
    }

    // Build context for AI
    const context = `
Generate a warm, first-person "How I see you" summary for ${profile.full_name || 'this user'}.
Write as if YOU are their AI nutritionist describing them.

PROFILE:
- Age: ${profile.age}, Sex: ${profile.biological_sex}
- Height: ${profile.height_cm}cm, Weight: ${profile.weight_kg}kg
- Goal: ${profile.primary_goal}
- Dietary pattern: ${profile.dietary_pattern}
- Health conditions: ${JSON.stringify(profile.health_conditions)}
- Supplements: ${supplements.map((s: Record<string, unknown>) => s.name).join(', ') || 'none'}

LAST 7 DAYS:
${dailyLogs.map((d: Record<string, unknown>) => 
  `${d.log_date}: ${d.total_calories} kcal, ${d.total_protein_g}g protein, ${d.meals_count} meals`
).join('\n')}

RECENT MEALS (last 30):
${meals.map((m: Record<string, unknown>) => `${m.meal_type}: "${m.raw_input}" (${m.total_calories} kcal)`).join('\n')}

MEMORIES:
${memories.map((m: Record<string, unknown>) => m.content).join('\n')}

Write 3-4 sentences that are:
1. Personal and warm (use their name)
2. Reference specific patterns you've observed
3. Acknowledge their goals
4. Note one strength and one area for improvement

Also provide 3 data-driven insights as bullet points.
`;

    const summary = await generateChat(
      'You are NourishMind AI. Generate a personal nutrition summary. Be warm, specific, and data-driven.',
      [],
      context
    );

    return jsonResponse({
      summary,
      daysTracked: dailyLogs.length,
      totalMealsLogged: meals.length,
      lastUpdated: new Date().toISOString(),
    });

  } catch (err) {
    console.error('User summary error:', err);
    return errorResponse('Internal server error', 500);
  }
});
