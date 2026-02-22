import { motion } from "framer-motion";

interface NutritionPanelProps {
  calories: number;
  calorieTarget: number;
  protein: number;
  proteinTarget: number;
  carbs: number;
  carbsTarget: number;
  fat: number;
  fatTarget: number;
  fiber: number;
  fiberTarget: number;
  micros: { label: string; pct: number; status: string }[];
  meals: { time: string; label: string; kcal: number; left: string }[];
  date: string;
}

const MacroBar = ({ label, value, target, color }: { label: string; value: number; target: number; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs font-sans">
      <span className="text-foreground font-medium">{label}</span>
      <span className="font-mono text-muted-foreground">{value}g / {target}g</span>
    </div>
    <div className="h-2 bg-muted rounded-pill overflow-hidden">
      <motion.div
        className="h-full rounded-pill"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((value / target) * 100, 100)}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  </div>
);

export const NutritionPanel = ({
  calories, calorieTarget, protein, proteinTarget, carbs, carbsTarget,
  fat, fatTarget, fiber, fiberTarget, micros, meals, date,
}: NutritionPanelProps) => {
  return (
    <div className="h-full overflow-y-auto border-l border-border bg-card p-5 space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-serif text-base font-bold text-foreground">Today's Nutrition</h3>
        <p className="text-xs font-sans text-muted-foreground">{date}</p>
      </div>

      {/* Calorie Ring */}
      <div className="flex flex-col items-center">
        <div className="relative w-[140px] h-[140px]">
          <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
            <circle cx="80" cy="80" r="68" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
            <motion.circle
              cx="80" cy="80" r="68" fill="none"
              stroke="hsl(var(--secondary))" strokeWidth="8"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 427.3" }}
              animate={{ strokeDasharray: `${(Math.min(calories / calorieTarget, 1)) * 427.3} 427.3` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-mono font-bold text-foreground">{calories}</span>
            <span className="text-[10px] text-muted-foreground font-sans">of {calorieTarget.toLocaleString()} kcal</span>
          </div>
        </div>
      </div>

      {/* Macro Bars */}
      <div className="space-y-3">
        <MacroBar label="Protein" value={protein} target={proteinTarget} color="hsl(147, 35%, 49%)" />
        <MacroBar label="Carbs" value={carbs} target={carbsTarget} color="hsl(36, 78%, 56%)" />
        <MacroBar label="Fat" value={fat} target={fatTarget} color="hsl(214, 56%, 57%)" />
        <MacroBar label="Fiber" value={fiber} target={fiberTarget} color="hsl(147, 35%, 74%)" />
      </div>

      {/* Micro Grid */}
      <div>
        <h4 className="text-xs font-sans font-semibold text-foreground mb-2">Micronutrients</h4>
        <div className="grid grid-cols-5 gap-1.5">
          {micros.map((m, i) => (
            <div key={i} className="bg-muted rounded-lg px-1.5 py-1.5 text-center">
              <span className="text-[9px] font-sans text-muted-foreground block">{m.label}</span>
              <span className="text-[10px]">{m.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Timing Strip */}
      <div>
        <h4 className="text-xs font-sans font-semibold text-foreground mb-3">Meal Timing</h4>
        <div className="relative h-16">
          <div className="absolute inset-x-0 top-6 h-0.5 bg-border" />
          {/* Time labels */}
          <div className="absolute bottom-0 left-0 text-[8px] text-muted-foreground font-sans">6AM</div>
          <div className="absolute bottom-0 left-1/3 text-[8px] text-muted-foreground font-sans">12PM</div>
          <div className="absolute bottom-0 left-2/3 text-[8px] text-muted-foreground font-sans">6PM</div>
          <div className="absolute bottom-0 right-0 text-[8px] text-muted-foreground font-sans">12AM</div>
          {/* Meal dots */}
          {meals.map((meal, i) => (
            <div key={i} className="absolute top-0 flex flex-col items-center" style={{ left: meal.left }}>
              <span className="text-[8px] text-muted-foreground font-sans whitespace-nowrap">{meal.label} · {meal.kcal} kcal</span>
              <div className="w-3 h-3 rounded-full bg-secondary mt-0.5" />
              <span className="text-[8px] text-muted-foreground font-sans mt-0.5">{meal.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
