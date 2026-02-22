/**
 * Google Gemini AI client for Edge Functions.
 * Uses Gemini 2.0 Flash (free tier: 1500 req/day, 15 req/min).
 * 
 * All LLM calls go through this module for centralized rate limiting and error handling.
 */

import { GoogleGenerativeAI, GenerativeModel } from 'https://esm.sh/@google/generative-ai@0.24.0';

const MODEL_NAME = 'gemini-2.0-flash';

let _genAI: GoogleGenerativeAI | null = null;

/**
 * Get the singleton GoogleGenerativeAI instance.
 */
function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

/**
 * Helper: retry an async function on 429 rate-limit errors with exponential backoff.
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isRateLimit = msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota');
      if (isRateLimit && attempt < maxRetries) {
        const delay = Math.pow(2, attempt + 1) * 1000; // 2s, 4s
        console.warn(`Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Max retries exceeded');
}

/**
 * Get the Gemini 2.0 Flash model configured for structured JSON output.
 */
export function getModel(): GenerativeModel {
  return getGenAI().getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.2,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 4096,
    },
  });
}

/**
 * Get the Gemini model configured for conversational chat.
 */
export function getChatModel(): GenerativeModel {
  return getGenAI().getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048,
    },
  });
}

/**
 * Get the Gemini embedding model for vector memory.
 */
export function getEmbeddingModel(): GenerativeModel {
  return getGenAI().getGenerativeModel({
    model: 'gemini-embedding-001',
  });
}

/**
 * Generate structured JSON from a prompt.
 * Parses the response and returns the JSON object.
 * 
 * @param systemPrompt - The system instruction for the model
 * @param userMessage - The user's input to process
 * @returns Parsed JSON object from the model's response
 */
export async function generateJSON<T>(systemPrompt: string, userMessage: string): Promise<T> {
  return withRetry(async () => {
    const model = getModel();
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] },
    });

    const responseText = result.response.text();
    
    // Strip markdown code fences if present
    const cleaned = responseText
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    try {
      return JSON.parse(cleaned) as T;
    } catch {
      throw new Error(`Failed to parse Gemini JSON response: ${cleaned.substring(0, 200)}`);
    }
  });
}

/**
 * Generate a conversational text response.
 * 
 * @param systemPrompt - Context and instructions for the AI
 * @param conversationHistory - Previous messages for context
 * @param userMessage - The current user message
 * @returns The AI's text response
 */
export async function generateChat(
  systemPrompt: string,
  conversationHistory: Array<{ role: string; content: string }>,
  userMessage: string
): Promise<string> {
  return withRetry(async () => {
    const model = getChatModel();

    // Build conversation parts — map any non-'user' role to 'model' for Gemini
    const historyParts = conversationHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: historyParts,
      systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] },
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  });
}

/**
 * Generate an embedding vector for text (for pgvector storage/similarity search).
 * Returns a 768-dimensional float array.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const model = getEmbeddingModel();
  const result = await model.embedContent(text);
  return result.embedding.values;
}
