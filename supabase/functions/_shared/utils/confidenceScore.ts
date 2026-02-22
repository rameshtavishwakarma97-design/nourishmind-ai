/**
 * Confidence Score utility — calculates and classifies data quality.
 */

export type ConfidenceSource = 'ifct_verified' | 'usda_verified' | 'brand_db_verified' | 'llm_estimated' | 'user_corrected';

export interface ConfidenceResult {
  score: number;
  source: ConfidenceSource;
  label: string;
  color: string;
}

/**
 * Map a source name to its base confidence range.
 */
export function getSourceConfidence(source: ConfidenceSource): { min: number; max: number } {
  switch (source) {
    case 'ifct_verified':    return { min: 0.90, max: 0.98 };
    case 'usda_verified':    return { min: 0.85, max: 0.95 };
    case 'brand_db_verified': return { min: 0.85, max: 0.92 };
    case 'user_corrected':   return { min: 0.95, max: 1.00 };
    case 'llm_estimated':    return { min: 0.40, max: 0.78 };
    default:                 return { min: 0.50, max: 0.75 };
  }
}

/**
 * Classify a confidence score into a human-readable label and color.
 */
export function classifyConfidence(score: number): { label: string; color: string } {
  if (score >= 0.90) return { label: 'Verified', color: '#22c55e' };     // green
  if (score >= 0.80) return { label: 'High confidence', color: '#84cc16' };// lime
  if (score >= 0.65) return { label: 'Estimated', color: '#eab308' };    // yellow
  if (score >= 0.50) return { label: 'Low confidence', color: '#f97316' };// orange
  return { label: 'Uncertain', color: '#ef4444' };                       // red
}

/**
 * Build a full confidence result.
 */
export function buildConfidenceResult(score: number, source: ConfidenceSource): ConfidenceResult {
  const { label, color } = classifyConfidence(score);
  return { score, source, label, color };
}

/**
 * Calculate weighted average confidence for a set of ingredients.
 * Weights by calorie contribution — higher-calorie items matter more.
 */
export function calculateWeightedConfidence(
  items: Array<{ confidence: number; calories: number }>
): number {
  const totalCal = items.reduce((sum, i) => sum + i.calories, 0);
  if (totalCal === 0) {
    return items.reduce((sum, i) => sum + i.confidence, 0) / (items.length || 1);
  }

  const weighted = items.reduce((sum, i) => sum + i.confidence * i.calories, 0);
  return Math.round((weighted / totalCal) * 100) / 100;
}
