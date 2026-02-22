/**
 * Unified LLM Architecture for NourishMind AI.
 * Primary: Llama 3.3 70B via Groq
 * Fallback: Gemini 2.0 Flash via Google AI
 *
 * This module orchestrates structured JSON parsing and conversational chat,
 * automatically retrying with Gemini if the Groq API fails or is rate-limited.
 */

import { GoogleGenerativeAI, GenerativeModel } from 'https://esm.sh/@google/generative-ai@0.24.0';

// Configuration
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GEMINI_MODEL = 'gemini-2.0-flash';
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Gemini Singleton
let _genAI: GoogleGenerativeAI | null = null;
function getGenAI(): GoogleGenerativeAI {
    if (!_genAI) {
        const apiKey = Deno.env.get('GEMINI_API_KEY');
        if (!apiKey) throw new Error('GEMINI_API_KEY is missing');
        _genAI = new GoogleGenerativeAI(apiKey);
    }
    return _genAI;
}

// Helpers
async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanJSON(text: string): string {
    return text.replace(/```json\s*/ig, '').replace(/```\s*/g, '').trim();
}

// ============================================================================
// CORE ENDPOINTS WITH FALLBACK LOGIC
// ============================================================================

/**
 * Generate structured JSON from a prompt using Groq with a Gemini Fallback.
 * @param systemPrompt The instruction telling the LLM what to output and how to structure it.
 * @param userMessage The actual user input payload to parse.
 */
export async function generateJSON<T>(systemPrompt: string, userMessage: string): Promise<T> {
    const apiKeyGroq = Deno.env.get('GROQ_API_KEY');

    // PRIMARY: Groq (Llama 3.3 70B)
    if (apiKeyGroq) {
        try {
            const resp = await fetch(GROQ_BASE_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKeyGroq}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: GROQ_MODEL,
                    messages: [
                        { role: 'system', content: `${systemPrompt}\n\nIMPORTANT: Return ONLY valid JSON.` },
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.1,
                    response_format: { type: 'json_object' }
                })
            });

            if (!resp.ok) {
                throw new Error(`Groq HTTP ${resp.status}: ${await resp.text()}`);
            }

            const data = await resp.json();
            const rawText = data.choices[0]?.message?.content || '';
            return JSON.parse(cleanJSON(rawText)) as T;

        } catch (err) {
            console.warn(`[Groq JSON Failure] Falling back to Gemini... Error:`, err);
        }
    }

    // FALLBACK: Gemini 2.0 Flash
    console.log('[Gemini Fallback] Initiating generating JSON format...');
    const geminiModel = getGenAI().getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: { temperature: 0.2, topP: 0.8, topK: 40 }
    });

    const result = await geminiModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] },
    });

    const rawText = result.response.text();
    try {
        return JSON.parse(cleanJSON(rawText)) as T;
    } catch {
        throw new Error(`Failed to parse Gemini JSON fallback output: ${rawText.substring(0, 200)}`);
    }
}

/**
 * Generate conversational chat text using Groq with a Gemini Fallback.
 * @param systemPrompt Context and persona for the AI
 * @param conversationHistory Previous messages
 * @param userMessage The new user input
 */
export async function generateChat(
    systemPrompt: string,
    conversationHistory: Array<{ role: string; content: string }>,
    userMessage: string
): Promise<string> {
    const apiKeyGroq = Deno.env.get('GROQ_API_KEY');

    // Format history for OpenAI compatible API (Groq)
    const groqHistory = conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant', // Groq expects 'user' or 'assistant'
        content: msg.content
    }));

    // PRIMARY: Groq (Llama 3.3 70B)
    if (apiKeyGroq) {
        try {
            const resp = await fetch(GROQ_BASE_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKeyGroq}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: GROQ_MODEL,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...groqHistory,
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.7,
                })
            });

            if (!resp.ok) {
                throw new Error(`Groq HTTP ${resp.status}: ${await resp.text()}`);
            }

            const data = await resp.json();
            return data.choices[0]?.message?.content || '';

        } catch (err) {
            console.warn(`[Groq Chat Failure] Falling back to Gemini... Error:`, err);
        }
    }

    // FALLBACK: Gemini 2.0 Chat
    console.log('[Gemini Fallback] Initiating conversational fallback...');
    const geminiModel = getGenAI().getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: { temperature: 0.7, topP: 0.9, topK: 40 }
    });

    const geminiHistory = conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model', // Gemini expects 'user' or 'model'
        parts: [{ text: msg.content }]
    }));

    const chat = geminiModel.startChat({
        history: geminiHistory,
        systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] }
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
}

/**
 * Generate an embedding vector for text using Gemini (Groq does not natively do embeddings well).
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const model = getGenAI().getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
}
