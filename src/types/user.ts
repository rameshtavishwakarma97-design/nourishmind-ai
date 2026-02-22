/**
 * User-related types for the frontend.
 * Maps to database user_profiles and related tables.
 */

export interface UserProfile {
  id: string;
  fullName: string | null;
  age: number | null;
  biologicalSex: 'male' | 'female' | 'prefer_not_to_say' | null;
  heightCm: number | null;
  weightKg: number | null;
  primaryGoal: 'weight_loss' | 'muscle_gain' | 'maintain' | 'manage_condition' | 'general_wellness' | null;
  dietaryPattern: 'vegetarian' | 'non_veg' | 'vegan' | 'jain' | 'intermittent_fasting' | 'no_restriction' | null;
  healthConditions: string[];
  foodAllergies: string[];
  occupation: string | null;
  typicalWakeTime: string | null;
  typicalSleepTime: string | null;
  typicalWorkoutTime: string | null;
  workoutType: string | null;
  workoutDurationMins: number | null;
  aiContextField: string | null;
  onboardingComplete: boolean;
  onboardingDay: number;
  hydrationTargetMl: number;
  wellnessScoreBreakdown: WellnessBreakdown | null;
}

export interface WellnessBreakdown {
  nutrition: number;
  sleep: number;
  hydration: number;
  mood: number;
}

export interface WellnessScore {
  total: number;
  breakdown: WellnessBreakdown;
}

// ============================================
// Carbon Copy — "How AI Sees You"
// ============================================
export interface CarbonCopy {
  profile: UserProfile;
  todaySummary: {
    caloriesConsumed: number;
    calorieTarget: number;
    proteinG: number;
    waterMl: number;
    mealsLogged: number;
  };
  activeConditions: string[];
  activeMedications: Array<{
    name: string;
    type: string;
    withFood: boolean;
  }>;
  aiGeneratedSummary: string;
}

// ============================================
// Supplement / Medication
// ============================================
export interface SupplementMedication {
  id: string;
  name: string;
  type: 'supplement' | 'medication' | 'ayurvedic';
  doseAmount: number | null;
  doseUnit: string | null;
  frequency: string | null;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'with_meal' | null;
  withFood: boolean;
  isActive: boolean;
}

// ============================================
// User Exception
// ============================================
export interface UserException {
  id: string;
  exceptionType: string;
  originalValue: string | null;
  modifiedValue: string | null;
  reason: string | null;
  isPermanent: boolean;
  createdAt: string;
  expiresAt: string | null;
}

// ============================================
// User Commitment
// ============================================
export interface UserCommitment {
  id: string;
  commitmentText: string;
  committedAt: string;
  followUpDate: string | null;
  outcome: 'kept' | 'broken' | 'modified' | 'pending' | null;
  outcomeNote: string | null;
}

// ============================================
// Menstrual Cycle
// ============================================
export interface MenstrualCycle {
  id: string;
  lastPeriodStart: string;
  cycleLengthDays: number;
  periodDurationDays: number;
  trackingEnabled: boolean;
}

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface CyclePhaseInfo {
  phase: CyclePhase;
  dayInCycle: number;
  daysUntilNextPeriod: number;
  nutritionTips: string[];
}

// ============================================
// Onboarding
// ============================================
export interface OnboardingData {
  fullName: string;
  age: number;
  biologicalSex: 'male' | 'female' | 'prefer_not_to_say';
  heightCm: number;
  weightKg: number;
  primaryGoal: string;
  dietaryPattern: string;
  healthConditions: string[];
  foodAllergies: string[];
  typicalWakeTime: string;
  typicalSleepTime: string;
}

// ============================================
// Drug-Nutrient Interaction Alert
// ============================================
export interface InteractionAlert {
  id: string;
  supplementName: string;
  foodName: string;
  interactionType: 'reduces_absorption' | 'increases_risk' | 'timing_conflict';
  severity: 'low' | 'medium' | 'high';
  flagMessage: string;
  recommendation: string;
}
