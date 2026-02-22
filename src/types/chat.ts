/**
 * Chat-related types for the AI conversation interface.
 */

import type { IngredientNutrition, NutritionTotals } from './nutrition';

// ============================================
// Chat Messages
// ============================================
export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageType = 'meal_log' | 'question' | 'insight' | 'whatif' | 'general' | 'correction' | 'clarification';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  timestamp: string;
  mealLogData?: MealLogData;
  clarificationNeeded?: boolean;
  clarificationQuestion?: string;
  isStreaming?: boolean;
}

// ============================================
// Meal Log Data (embedded in chat message)
// ============================================
export interface MealLogData {
  mealLogId: string;
  mealType: string;
  rawInput: string;
  loggedAt: string;
  ingredients: IngredientNutrition[];
  totalNutrition: NutritionTotals;
  overallConfidenceScore: number;
  glycemicLoad: number | null;
  warnings: string[];
}

// ============================================
// Chat Request / Response
// ============================================
export interface ChatRequest {
  message: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface ChatResponse {
  type: MessageType;
  content: string;
  mealLogData?: MealLogData;
  clarificationNeeded?: boolean;
  clarificationQuestion?: string;
}

// ============================================
// Intent Detection
// ============================================
export type UserIntent =
  | 'meal_log'
  | 'meal_correction'
  | 'nutrition_question'
  | 'what_if'
  | 'meal_skip'
  | 'general_chat'
  | 'hydration_log'
  | 'mood_log'
  | 'gut_symptom_log';

export interface IntentDetectionResult {
  intent: UserIntent;
  confidence: number;
  extractedData?: {
    mealType?: string;
    rawMealText?: string;
    correctionTarget?: string;
    correctionValue?: string;
    waterMl?: number;
    moodScore?: number;
    gutScore?: number;
  };
}

// ============================================
// Conversation Memory
// ============================================
export interface ConversationMemory {
  id: string;
  memoryType: 'meal_preference' | 'commitment' | 'health_context' | 'exception' | 'behavioral_pattern' | 'food_correction';
  content: string;
  importanceScore: number;
  createdAt: string;
  expiresAt: string | null;
}

// ============================================
// Quick Log Suggestion
// ============================================
export interface QuickLogSuggestion {
  id: string;
  mealName: string;
  mealType: string;
  timesLogged: number;
  lastLoggedAt: string;
  totalCalories: number;
  totalProteinG: number;
}

// ============================================
// What-If Scenario
// ============================================
export interface WhatIfScenario {
  originalMeal: string;
  alternativeMeal: string;
  comparison: {
    original: NutritionTotals;
    alternative: NutritionTotals;
    differences: Record<string, { value: number; direction: 'better' | 'worse' | 'neutral' }>;
  };
  recommendation: string;
}
