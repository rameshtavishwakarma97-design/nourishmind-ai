/**
 * FODMAP Checker — rates foods as low/moderate/high FODMAP for IBS users.
 * Hardcoded ~200 common Indian foods. Used client-side to show warnings.
 */

export type FodmapRating = 'low' | 'moderate' | 'high';

export interface FodmapEntry {
  food: string;
  rating: FodmapRating;
  category: string;
  detail: string;
}

export interface FodmapCheckResult {
  overallRisk: FodmapRating;
  flaggedItems: FodmapEntry[];
  safeItems: string[];
  recommendation: string;
}

/**
 * FODMAP database — ~200 common Indian foods with ratings.
 * Based on Monash University FODMAP guidelines adapted for Indian foods.
 */
const FODMAP_DB: FodmapEntry[] = [
  // === CEREALS & GRAINS ===
  { food: 'rice', rating: 'low', category: 'cereals', detail: 'All types of plain rice are low FODMAP' },
  { food: 'oats', rating: 'low', category: 'cereals', detail: 'Low FODMAP up to 52g per sitting' },
  { food: 'wheat', rating: 'high', category: 'cereals', detail: 'Contains fructans — limit to 1 chapati' },
  { food: 'chapati', rating: 'moderate', category: 'cereals', detail: '1 small chapati OK, 2+ may trigger symptoms' },
  { food: 'roti', rating: 'moderate', category: 'cereals', detail: 'Same as chapati — limit portions' },
  { food: 'naan', rating: 'high', category: 'cereals', detail: 'Contains wheat + possibly garlic/onion' },
  { food: 'ragi', rating: 'low', category: 'cereals', detail: 'Finger millet is generally low FODMAP' },
  { food: 'jowar', rating: 'low', category: 'cereals', detail: 'Sorghum is low FODMAP' },
  { food: 'bajra', rating: 'low', category: 'cereals', detail: 'Pearl millet is low FODMAP' },
  { food: 'idli', rating: 'low', category: 'cereals', detail: 'Fermented rice-urad batter, generally safe' },
  { food: 'dosa', rating: 'low', category: 'cereals', detail: 'Fermented rice-urad batter, generally safe' },
  { food: 'poha', rating: 'low', category: 'cereals', detail: 'Flattened rice is low FODMAP (watch the onion)' },
  { food: 'upma', rating: 'moderate', category: 'cereals', detail: 'Made from semolina (wheat) — moderate with small portions' },
  { food: 'bread', rating: 'high', category: 'cereals', detail: 'Regular wheat bread is high FODMAP' },
  { food: 'pasta', rating: 'high', category: 'cereals', detail: 'Wheat pasta is high FODMAP' },
  { food: 'maggi', rating: 'high', category: 'cereals', detail: 'Contains wheat noodles + onion/garlic seasoning' },
  { food: 'cornflakes', rating: 'low', category: 'cereals', detail: 'Corn-based cereals are low FODMAP' },
  { food: 'quinoa', rating: 'low', category: 'cereals', detail: 'Low FODMAP grain' },

  // === PULSES & LEGUMES ===
  { food: 'moong dal', rating: 'low', category: 'pulses', detail: 'Well-tolerated split mung bean' },
  { food: 'toor dal', rating: 'moderate', category: 'pulses', detail: 'Moderate — OK in small portions (½ katori)' },
  { food: 'masoor dal', rating: 'moderate', category: 'pulses', detail: 'Red lentils, moderate in small portions' },
  { food: 'chana dal', rating: 'high', category: 'pulses', detail: 'High FODMAP — limit strictly' },
  { food: 'rajma', rating: 'high', category: 'pulses', detail: 'Kidney beans are high FODMAP in all portions' },
  { food: 'chole', rating: 'high', category: 'pulses', detail: 'Chickpeas are high FODMAP' },
  { food: 'chickpeas', rating: 'high', category: 'pulses', detail: 'High FODMAP — GOS content' },
  { food: 'black beans', rating: 'high', category: 'pulses', detail: 'High FODMAP' },
  { food: 'urad dal', rating: 'moderate', category: 'pulses', detail: 'Moderate when fermented (idli/dosa batter)' },
  { food: 'soybean', rating: 'high', category: 'pulses', detail: 'High FODMAP — GOS content' },
  { food: 'tofu', rating: 'low', category: 'pulses', detail: 'Firm tofu is low FODMAP' },
  { food: 'green peas', rating: 'moderate', category: 'pulses', detail: 'Moderate in ½ cup, high in larger portions' },

  // === VEGETABLES ===
  { food: 'potato', rating: 'low', category: 'vegetables', detail: 'All potato preparations are low FODMAP' },
  { food: 'tomato', rating: 'low', category: 'vegetables', detail: 'Fresh tomatoes are low FODMAP' },
  { food: 'onion', rating: 'high', category: 'vegetables', detail: 'MAJOR FODMAP trigger — fructans. Use asafoetida instead' },
  { food: 'garlic', rating: 'high', category: 'vegetables', detail: 'MAJOR FODMAP trigger — use garlic-infused oil instead' },
  { food: 'carrot', rating: 'low', category: 'vegetables', detail: 'Low FODMAP in all portions' },
  { food: 'spinach', rating: 'low', category: 'vegetables', detail: 'Palak is low FODMAP' },
  { food: 'palak', rating: 'low', category: 'vegetables', detail: 'Spinach is low FODMAP' },
  { food: 'bottle gourd', rating: 'low', category: 'vegetables', detail: 'Lauki/dudhi is low FODMAP' },
  { food: 'lauki', rating: 'low', category: 'vegetables', detail: 'Bottle gourd is low FODMAP' },
  { food: 'ridge gourd', rating: 'low', category: 'vegetables', detail: 'Turai is low FODMAP' },
  { food: 'bitter gourd', rating: 'low', category: 'vegetables', detail: 'Karela is low FODMAP' },
  { food: 'okra', rating: 'low', category: 'vegetables', detail: 'Bhindi is low FODMAP' },
  { food: 'bhindi', rating: 'low', category: 'vegetables', detail: 'Lady finger is low FODMAP' },
  { food: 'eggplant', rating: 'low', category: 'vegetables', detail: 'Baingan is low FODMAP' },
  { food: 'brinjal', rating: 'low', category: 'vegetables', detail: 'Low FODMAP vegetable' },
  { food: 'cucumber', rating: 'low', category: 'vegetables', detail: 'Low FODMAP' },
  { food: 'capsicum', rating: 'low', category: 'vegetables', detail: 'Bell pepper is low FODMAP' },
  { food: 'cabbage', rating: 'moderate', category: 'vegetables', detail: 'Low in small portions, moderate in larger' },
  { food: 'cauliflower', rating: 'high', category: 'vegetables', detail: 'High FODMAP — mannitol. Limit to ½ cup' },
  { food: 'gobi', rating: 'high', category: 'vegetables', detail: 'Cauliflower is high FODMAP' },
  { food: 'mushroom', rating: 'high', category: 'vegetables', detail: 'Most mushrooms are high FODMAP — mannitol/polyols' },
  { food: 'beetroot', rating: 'moderate', category: 'vegetables', detail: 'Moderate in portions over 4 slices' },
  { food: 'pumpkin', rating: 'low', category: 'vegetables', detail: 'Kaddu is low FODMAP' },
  { food: 'broccoli', rating: 'moderate', category: 'vegetables', detail: 'Heads are high, stalks are low FODMAP' },
  { food: 'sweet corn', rating: 'moderate', category: 'vegetables', detail: 'Moderate — limit to ½ cob' },
  { food: 'radish', rating: 'low', category: 'vegetables', detail: 'Mooli is low FODMAP' },

  // === FRUITS ===
  { food: 'banana', rating: 'low', category: 'fruits', detail: 'Unripe/firm banana is low; overripe is moderate' },
  { food: 'apple', rating: 'high', category: 'fruits', detail: 'High FODMAP — excess fructose + sorbitol' },
  { food: 'mango', rating: 'moderate', category: 'fruits', detail: 'Moderate — ½ cup OK, more triggers fructose' },
  { food: 'papaya', rating: 'low', category: 'fruits', detail: 'Low FODMAP fruit' },
  { food: 'guava', rating: 'low', category: 'fruits', detail: 'Low FODMAP fruit — excellent choice' },
  { food: 'orange', rating: 'low', category: 'fruits', detail: 'Low FODMAP in 1 fruit portion' },
  { food: 'grapes', rating: 'low', category: 'fruits', detail: 'Low FODMAP in 1 cup' },
  { food: 'watermelon', rating: 'high', category: 'fruits', detail: 'High FODMAP — excess fructose + mannitol' },
  { food: 'pear', rating: 'high', category: 'fruits', detail: 'High FODMAP — excess fructose + sorbitol' },
  { food: 'chiku', rating: 'high', category: 'fruits', detail: 'Sapodilla is high FODMAP — fructose' },
  { food: 'pomegranate', rating: 'low', category: 'fruits', detail: 'Low FODMAP in ½ cup' },
  { food: 'pineapple', rating: 'low', category: 'fruits', detail: 'Low FODMAP fruit' },
  { food: 'coconut', rating: 'moderate', category: 'fruits', detail: 'Fresh coconut moderate, coconut water low' },
  { food: 'lychee', rating: 'high', category: 'fruits', detail: 'High FODMAP — fructose/sorbitol' },

  // === DAIRY ===
  { food: 'milk', rating: 'high', category: 'dairy', detail: 'Regular cow milk is high FODMAP — lactose' },
  { food: 'curd', rating: 'low', category: 'dairy', detail: 'Indian dahi/yogurt is generally low (fermentation reduces lactose)' },
  { food: 'dahi', rating: 'low', category: 'dairy', detail: 'Fermented — most lactose consumed by bacteria' },
  { food: 'paneer', rating: 'low', category: 'dairy', detail: 'Low FODMAP — minimal lactose retained' },
  { food: 'ghee', rating: 'low', category: 'dairy', detail: 'Clarified butter has negligible FODMAP content' },
  { food: 'butter', rating: 'low', category: 'dairy', detail: 'Low FODMAP in normal portions' },
  { food: 'cheese', rating: 'low', category: 'dairy', detail: 'Hard cheeses are low FODMAP' },
  { food: 'cream', rating: 'moderate', category: 'dairy', detail: 'Moderate in larger portions' },
  { food: 'buttermilk', rating: 'low', category: 'dairy', detail: 'Chaas is low FODMAP' },
  { food: 'lassi', rating: 'moderate', category: 'dairy', detail: 'Depends on milk vs curd ratio' },
  { food: 'ice cream', rating: 'high', category: 'dairy', detail: 'High FODMAP — lactose' },
  { food: 'lactose free milk', rating: 'low', category: 'dairy', detail: 'Low FODMAP alternative' },

  // === NUTS & SEEDS ===
  { food: 'almonds', rating: 'low', category: 'nuts', detail: 'Low FODMAP up to 10 almonds' },
  { food: 'cashews', rating: 'high', category: 'nuts', detail: 'Cashews are high FODMAP — GOS' },
  { food: 'peanuts', rating: 'low', category: 'nuts', detail: 'Low FODMAP in up to 32 nuts' },
  { food: 'walnuts', rating: 'low', category: 'nuts', detail: 'Low FODMAP up to 10 halves' },
  { food: 'pistachios', rating: 'high', category: 'nuts', detail: 'High FODMAP — fructans/GOS. Limit strictly' },
  { food: 'coconut', rating: 'moderate', category: 'nuts', detail: 'Moderate in larger amounts, low in small (20g)' },
  { food: 'flaxseeds', rating: 'low', category: 'nuts', detail: 'Low FODMAP up to 1 tbsp' },
  { food: 'chia seeds', rating: 'low', category: 'nuts', detail: 'Low FODMAP up to 2 tbsp' },
  { food: 'pumpkin seeds', rating: 'low', category: 'nuts', detail: 'Low FODMAP up to 2 tbsp' },
  { food: 'sunflower seeds', rating: 'low', category: 'nuts', detail: 'Low FODMAP snack' },

  // === OILS & FATS ===
  { food: 'mustard oil', rating: 'low', category: 'fats', detail: 'All vegetable oils are low FODMAP' },
  { food: 'coconut oil', rating: 'low', category: 'fats', detail: 'Low FODMAP' },
  { food: 'olive oil', rating: 'low', category: 'fats', detail: 'Low FODMAP' },
  { food: 'groundnut oil', rating: 'low', category: 'fats', detail: 'Low FODMAP' },

  // === SPICES & CONDIMENTS ===
  { food: 'turmeric', rating: 'low', category: 'spices', detail: 'Low FODMAP spice' },
  { food: 'cumin', rating: 'low', category: 'spices', detail: 'Low FODMAP spice' },
  { food: 'coriander', rating: 'low', category: 'spices', detail: 'Low FODMAP spice' },
  { food: 'ginger', rating: 'low', category: 'spices', detail: 'Low FODMAP and may help IBS symptoms' },
  { food: 'asafoetida', rating: 'low', category: 'spices', detail: 'Low FODMAP — great substitute for onion/garlic' },
  { food: 'hing', rating: 'low', category: 'spices', detail: 'Asafoetida — excellent garlic substitute' },
  { food: 'fennel seeds', rating: 'low', category: 'spices', detail: 'Low FODMAP, may help digestion' },
  { food: 'mustard seeds', rating: 'low', category: 'spices', detail: 'Low FODMAP spice' },
  { food: 'curry leaves', rating: 'low', category: 'spices', detail: 'Low FODMAP' },
  { food: 'green chili', rating: 'low', category: 'spices', detail: 'Low FODMAP (may irritate in excess)' },

  // === SWEETENERS ===
  { food: 'sugar', rating: 'low', category: 'sweeteners', detail: 'Sucrose is low FODMAP in normal amounts (1-2 tsp)' },
  { food: 'jaggery', rating: 'moderate', category: 'sweeteners', detail: 'Contains fructose — moderate in small amounts' },
  { food: 'honey', rating: 'high', category: 'sweeteners', detail: 'High FODMAP — excess fructose' },

  // === BEVERAGES ===
  { food: 'tea', rating: 'low', category: 'beverages', detail: 'Black/green tea is low FODMAP' },
  { food: 'chai', rating: 'moderate', category: 'beverages', detail: 'If made with milk — check milk portion. Use lactose-free milk' },
  { food: 'coffee', rating: 'low', category: 'beverages', detail: 'Black coffee is low FODMAP. Milk-based coffee — check milk type' },
  { food: 'coconut water', rating: 'low', category: 'beverages', detail: 'Low FODMAP in 1 glass' },
  { food: 'buttermilk', rating: 'low', category: 'beverages', detail: 'Chaas is low FODMAP — good for IBS' },
  { food: 'nimbu pani', rating: 'low', category: 'beverages', detail: 'Lemon water is low FODMAP' },
  { food: 'lassi', rating: 'moderate', category: 'beverages', detail: 'Yogurt-based is OK, milk-heavy versions are moderate' },

  // === PREPARED DISHES (common Indian) ===
  { food: 'biryani', rating: 'high', category: 'dishes', detail: 'Contains onion + garlic typically — request without' },
  { food: 'sambar', rating: 'high', category: 'dishes', detail: 'Contains mixed vegetables including onion, some high-FODMAP veg' },
  { food: 'rasam', rating: 'moderate', category: 'dishes', detail: 'Tomato-tamarind base is OK; watch garlic content' },
  { food: 'dal tadka', rating: 'moderate', category: 'dishes', detail: 'Depends on dal type; tadka with garlic is problematic' },
  { food: 'aloo gobi', rating: 'high', category: 'dishes', detail: 'Cauliflower is high FODMAP + onion/garlic in gravy' },
  { food: 'palak paneer', rating: 'moderate', category: 'dishes', detail: 'Spinach + paneer are low, but gravy has onion/garlic' },
  { food: 'chole bhature', rating: 'high', category: 'dishes', detail: 'Chickpeas + wheat — double high FODMAP' },
  { food: 'rajma chawal', rating: 'high', category: 'dishes', detail: 'Kidney beans are high FODMAP' },
  { food: 'dal makhani', rating: 'high', category: 'dishes', detail: 'Urad + rajma + cream + onion/garlic' },
  { food: 'khichdi', rating: 'low', category: 'dishes', detail: 'Rice + moong dal — excellent low FODMAP meal' },
  { food: 'cheela', rating: 'low', category: 'dishes', detail: 'Moong dal cheela is low FODMAP' },
  { food: 'dhokla', rating: 'low', category: 'dishes', detail: 'Fermented besan — generally well tolerated' },
];

/**
 * Check FODMAP rating for an ingredient.
 * Performs fuzzy matching against the FODMAP database.
 */
export function checkFodmap(ingredientName: string): FodmapEntry | null {
  const normalized = ingredientName.toLowerCase().trim();

  // Exact match first
  const exact = FODMAP_DB.find(e => normalized === e.food);
  if (exact) return exact;

  // Partial match
  const partial = FODMAP_DB.find(e =>
    normalized.includes(e.food) || e.food.includes(normalized)
  );
  if (partial) return partial;

  return null;
}

/**
 * Check FODMAP for all ingredients in a meal and return overall risk assessment.
 */
export function checkMealFodmap(ingredientNames: string[]): FodmapCheckResult {
  const flaggedItems: FodmapEntry[] = [];
  const safeItems: string[] = [];

  for (const name of ingredientNames) {
    const result = checkFodmap(name);
    if (result) {
      if (result.rating === 'high' || result.rating === 'moderate') {
        flaggedItems.push(result);
      } else {
        safeItems.push(name);
      }
    } else {
      // Unknown foods are treated as safe with a note
      safeItems.push(name);
    }
  }

  // Overall risk
  const hasHigh = flaggedItems.some(i => i.rating === 'high');
  const hasMultipleModerate = flaggedItems.filter(i => i.rating === 'moderate').length >= 2;

  let overallRisk: FodmapRating;
  let recommendation: string;

  if (hasHigh) {
    overallRisk = 'high';
    const highItems = flaggedItems.filter(i => i.rating === 'high').map(i => i.food);
    recommendation = `⚠️ This meal contains high-FODMAP items: ${highItems.join(', ')}. Consider alternatives or smaller portions to avoid triggering IBS symptoms.`;
  } else if (hasMultipleModerate) {
    overallRisk = 'moderate';
    recommendation = `⚡ Multiple moderate-FODMAP items detected. When stacked together, they can add up. Consider removing one or two moderate items.`;
  } else if (flaggedItems.length > 0) {
    overallRisk = 'moderate';
    recommendation = `One moderate-FODMAP item detected. Should be fine in small portions. Monitor how you feel.`;
  } else {
    overallRisk = 'low';
    recommendation = `✅ This meal looks IBS-friendly! All identified items are low FODMAP.`;
  }

  return { overallRisk, flaggedItems, safeItems, recommendation };
}
