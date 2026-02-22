import { Bookmark, Pencil } from "lucide-react";

export interface MealIngredient {
  name: string;
  qty: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  source: string;
}

export interface MealLogData {
  mealType: string;
  time: string;
  confidence: number;
  ingredients: MealIngredient[];
  totals: { kcal: number; protein: number; carbs: number; fat: number };
  micros?: { label: string; value: string; status: "🟢" | "🟡" | "🔴" }[];
}

interface MealLogCardProps {
  data: MealLogData;
  onSave?: () => void;
  onEdit?: () => void;
  saved?: boolean;
}

const mealTypeColors: Record<string, string> = {
  Breakfast: "bg-warning/20 text-warning",
  Lunch: "bg-secondary/20 text-secondary",
  Dinner: "bg-primary/20 text-primary",
  Snack: "bg-accent/40 text-accent-foreground",
};

const mealTypeIcons: Record<string, string> = {
  Breakfast: "🌅",
  Lunch: "☀️",
  Dinner: "🌙",
  Snack: "🌤",
};

export const MealLogCard = ({ data, onSave, onEdit, saved }: MealLogCardProps) => {
  const badgeClass = mealTypeColors[data.mealType] || "bg-muted text-foreground";
  const icon = mealTypeIcons[data.mealType] || "🍽️";

  return (
    <div className="bg-card rounded-3xl border shadow-sm overflow-hidden mt-2" style={{ borderColor: "#E8E4DC" }}>
      {/* Header */}
      <div className="px-4 md:px-6 py-3 flex items-center gap-3 border-b flex-wrap" style={{ borderColor: "#E8E4DC" }}>
        <span className={`${badgeClass} rounded-pill px-3 py-1 text-xs font-semibold font-sans`}>
          {icon} {data.mealType}
        </span>
        <span className="text-xs font-sans text-muted-foreground">{data.time}</span>
        {data.confidence > 0 && (
          <span className="ml-auto text-xs font-sans text-success font-medium">
            ✅ {data.confidence}% Confident
          </span>
        )}
      </div>

      {/* Ingredient Table */}
      <div className="px-4 md:px-6 py-4 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground font-sans border-b" style={{ borderColor: "#E8E4DC" }}>
              <th className="text-left py-2 font-medium">Ingredient</th>
              <th className="text-left py-2 font-medium">Quantity</th>
              <th className="text-right py-2 font-medium">Calories</th>
              <th className="text-right py-2 font-medium">P</th>
              <th className="text-right py-2 font-medium">C</th>
              <th className="text-right py-2 font-medium">F</th>
              <th className="text-right py-2 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {data.ingredients.map((ing, i) => (
              <tr key={i} className="border-b border-border/30">
                <td className="py-2 font-sans text-foreground">{ing.name}</td>
                <td className="py-2 font-sans text-muted-foreground">{ing.qty}</td>
                <td className="text-right font-mono text-foreground">{ing.kcal} kcal</td>
                <td className="text-right font-mono text-foreground">{ing.protein}g</td>
                <td className="text-right font-mono text-foreground">{ing.carbs}g</td>
                <td className="text-right font-mono text-foreground">{ing.fat}g</td>
                <td className="text-right font-sans text-muted-foreground whitespace-nowrap">{ing.source}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold" style={{ backgroundColor: "#F4F2EE" }}>
              <td className="py-2.5 font-sans text-foreground">TOTAL</td>
              <td className="py-2.5 text-muted-foreground">—</td>
              <td className="text-right font-mono text-foreground">{data.totals.kcal} kcal</td>
              <td className="text-right font-mono text-foreground">{data.totals.protein}g</td>
              <td className="text-right font-mono text-foreground">{data.totals.carbs}g</td>
              <td className="text-right font-mono text-foreground">{data.totals.fat}g</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Micro Badges */}
      {data.micros && data.micros.length > 0 && (
        <div className="px-4 md:px-6 pb-3 flex gap-2 flex-wrap">
          {data.micros.map((m, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-[10px] font-sans font-medium bg-muted text-foreground"
            >
              {m.label} {m.value} {m.status}
            </span>
          ))}
        </div>
      )}

      {/* Action Row */}
      <div className="px-4 md:px-6 py-2 border-t flex justify-end gap-2" style={{ borderColor: "#E8E4DC" }}>
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 text-xs font-sans font-medium text-primary hover:text-primary/80 transition-colors py-1 px-2 rounded-lg hover:bg-primary/5"
        >
          <Bookmark className="h-3.5 w-3.5" />
          {saved ? "✅ Saved" : "Save as Recipe"}
        </button>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-sans font-medium text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded-lg hover:bg-muted"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>
    </div>
  );
};
