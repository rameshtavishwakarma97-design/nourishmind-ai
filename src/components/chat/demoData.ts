import type { MealLogData } from "./MealLogCard";

export const demoMealData: MealLogData = {
  mealType: "Breakfast",
  time: "8:42 AM",
  confidence: 94,
  ingredients: [
    { name: "Rolled Oats", qty: "80g", kcal: 297, protein: 10, carbs: 54, fat: 5, source: "✅ IFCT" },
    { name: "Almonds (7 pcs)", qty: "21g", kcal: 122, protein: 4, carbs: 5, fat: 10, source: "✅ IFCT" },
    { name: "Myprotein Whey", qty: "1 scoop (30g)", kcal: 103, protein: 21, carbs: 2, fat: 2, source: "✅ Brand DB" },
    { name: "Amul Gold Milk", qty: "250ml", kcal: 163, protein: 8, carbs: 12, fat: 9, source: "✅ Brand DB" },
    { name: "Cocoa Powder", qty: "1 tsp (3g)", kcal: 8, protein: 1, carbs: 1, fat: 0, source: "✅ IFCT" },
    { name: "Sugar Free sachet", qty: "1 sachet", kcal: 4, protein: 0, carbs: 1, fat: 0, source: "⚠️ Estimated" },
  ],
  totals: { kcal: 697, protein: 44, carbs: 75, fat: 26 },
  micros: [
    { label: "Fe", value: "2.1mg", status: "🟡" },
    { label: "Ca", value: "384mg", status: "🟢" },
    { label: "Mg", value: "87mg", status: "🟡" },
    { label: "B12", value: "1.2mcg", status: "🟡" },
    { label: "D", value: "48IU", status: "🔴" },
  ],
};

export interface DemoMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  mealData?: MealLogData;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
};

export const getDemoMessages = (firstName: string): DemoMessage[] => [
  {
    id: "demo-1",
    role: "assistant",
    content: `${getGreeting()}, ${firstName}! I'm ready to help you track today. What did you eat for breakfast? Just describe it naturally 🌿`,
  },
  {
    id: "demo-2",
    role: "user",
    content: "I had overnight oats for breakfast — 7 almonds, 1 scoop Myprotein whey, 250ml Amul Gold milk, 1 tsp cocoa powder, sugar free",
  },
  {
    id: "demo-3",
    role: "assistant",
    content: "",
    mealData: demoMealData,
  },
  {
    id: "demo-4",
    role: "assistant",
    content: "Logged! 💪 Your breakfast was high in protein (44g — great start!). Vitamin D is low though — try to get some morning sunlight or add an egg tomorrow. You're at 697 of 1,800 kcal for the day.",
  },
];

export const demoNutritionData = {
  calories: 697,
  calorieTarget: 1800,
  protein: 44,
  proteinTarget: 150,
  carbs: 75,
  carbsTarget: 250,
  fat: 26,
  fatTarget: 65,
  fiber: 3,
  fiberTarget: 30,
  micros: [
    { label: "Fe", pct: 12, status: "🟡" },
    { label: "Ca", pct: 38, status: "🟢" },
    { label: "Mg", pct: 22, status: "🟡" },
    { label: "K", pct: 15, status: "🟢" },
    { label: "Na", pct: 8, status: "🟢" },
    { label: "B12", pct: 50, status: "🟡" },
    { label: "D", pct: 3, status: "🔴" },
    { label: "Zn", pct: 18, status: "🟡" },
    { label: "Folate", pct: 12, status: "🟡" },
    { label: "Water", pct: 10, status: "🔴" },
  ],
  meals: [
    { time: "8:42 AM", label: "Breakfast", kcal: 697, left: "15%" },
  ],
  date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
};
