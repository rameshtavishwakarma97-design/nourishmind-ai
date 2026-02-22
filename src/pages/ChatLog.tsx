import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Camera, Bookmark, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/hooks/useChat";
import { useSavedMeals } from "@/hooks/useSavedMeals";
import { useAuthContext } from "@/contexts/AuthContext";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
};

const ChatLog = () => {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const { messages, isLoading, sendMessage } = useChat();
  const { savedMeals, frequentMeals, saveMeal, incrementUseCount, refresh: refreshSavedMeals } = useSavedMeals();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    sendMessage(text);
  };

  // Save a meal from a meal card's metadata as a recipe
  const handleSaveMeal = async (meta: Record<string, unknown>) => {
    const ingredients = (meta?.ingredients as Array<Record<string, unknown>>) ?? [];
    const totals = (meta?.totals as Record<string, number>) ?? {};
    const mealType = (meta.mealType as string) || (meta.meal_type as string) || "other";

    // Build a readable meal name from ingredients
    const ingNames = ingredients
      .map(ing => (ing.ingredientName as string) || (ing.name as string) || "Item")
      .slice(0, 3);
    const mealName = ingNames.join(", ") + (ingredients.length > 3 ? ` +${ingredients.length - 3} more` : "");

    const mappedIngredients = ingredients.map(ing => {
      const per100g = (ing.per100g as Record<string, number>) || {};
      const qtyG = (ing.quantityG as number) || 0;
      const scale = qtyG / 100;
      return {
        ingredientName: (ing.ingredientName as string) || (ing.name as string) || "Item",
        quantityG: qtyG,
        calories: Math.round((per100g.calories ?? (ing.kcal as number) ?? 0) * (scale || 1)),
        proteinG: Math.round((per100g.protein_g ?? (ing.protein as number) ?? 0) * (scale || 1)),
        carbsG: Math.round((per100g.carbs_g ?? (ing.carbs as number) ?? 0) * (scale || 1)),
        fatG: Math.round((per100g.fat_g ?? (ing.fat as number) ?? 0) * (scale || 1)),
      };
    });

    const result = await saveMeal({
      meal_name: mealName,
      meal_type: mealType,
      ingredients: mappedIngredients,
      total_calories: Math.round(totals.calories ?? totals.kcal ?? 0),
      total_protein_g: Math.round(totals.protein_g ?? totals.protein ?? 0),
      total_carbs_g: Math.round(totals.carbs_g ?? totals.carbs ?? 0),
      total_fat_g: Math.round(totals.fat_g ?? totals.fat ?? 0),
      is_favorite: false,
    });

    if (result.success) {
      toast({ title: "Meal saved! 🔖", description: `"${mealName}" added to your saved meals.` });
      refreshSavedMeals();
    } else {
      toast({ title: "Could not save meal", description: result.error, variant: "destructive" });
    }
  };

  // Quick-log a previously saved meal
  const handleQuickLog = async (meal: typeof frequentMeals[number]) => {
    if (isLoading) return;
    // Build a natural language description from the saved meal's ingredients
    const description = meal.ingredients
      .map(ing => `${ing.ingredientName} ${ing.quantityG}g`)
      .join(", ");
    const text = `Log my ${meal.meal_type || "meal"}: ${meal.meal_name} — ${description}`;
    sendMessage(text);
    await incrementUseCount(meal.id);
    toast({ title: `Re-logging "${meal.meal_name}" ⚡` });
  };

  // Try to extract meal data from metadata
  const renderMealCard = (meta: Record<string, unknown>) => {
    const ingredients = meta?.ingredients as Array<Record<string, unknown>> | undefined;
    const totals = meta?.totals as Record<string, number> | undefined;
    if (!ingredients?.length) return null;

    return (
      <div className="bg-card rounded-3xl border shadow-sm overflow-hidden mt-2" style={{ borderColor: "#E8E4DC" }}>
        <div className="px-4 md:px-6 py-3 flex items-center gap-3 border-b flex-wrap" style={{ borderColor: "#E8E4DC" }}>
          <span className="bg-warning/20 text-warning rounded-pill px-3 py-1 text-xs font-semibold font-sans">
            {(meta.mealType as string) || (meta.meal_type as string) || "Meal"}
          </span>
          {meta.confidence && (
            <span className="ml-auto text-xs font-sans text-success font-medium">✅ {meta.confidence}% Confident</span>
          )}
        </div>
        <div className="px-4 md:px-6 py-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground font-sans border-b" style={{ borderColor: "#E8E4DC" }}>
                <th className="text-left py-2 font-medium">Ingredient</th>
                <th className="text-right py-2 font-medium">Calories</th>
                <th className="text-right py-2 font-medium">P</th>
                <th className="text-right py-2 font-medium">C</th>
                <th className="text-right py-2 font-medium">F</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing, i) => {
                const per100g = (ing.per100g as Record<string, number>) || {};
                const qtyG = (ing.quantityG as number) || 0;
                const scale = qtyG / 100;
                const name = (ing.ingredientName as string) || (ing.name as string) || 'Item';
                return (
                  <tr key={i} className="border-b border-border/30">
                    <td className="py-2 font-sans text-foreground">{name}{qtyG ? ` (${Math.round(qtyG)}g)` : ""}</td>
                    <td className="text-right font-mono text-foreground">{Math.round((per100g.calories ?? (ing.kcal as number) ?? 0) * (scale || 1))}</td>
                    <td className="text-right font-mono text-foreground">{Math.round((per100g.protein_g ?? (ing.protein as number) ?? 0) * (scale || 1))}g</td>
                    <td className="text-right font-mono text-foreground">{Math.round((per100g.carbs_g ?? (ing.carbs as number) ?? 0) * (scale || 1))}g</td>
                    <td className="text-right font-mono text-foreground">{Math.round((per100g.fat_g ?? (ing.fat as number) ?? 0) * (scale || 1))}g</td>
                  </tr>
                );
              })}
            </tbody>
            {totals && (
              <tfoot>
                <tr className="font-semibold" style={{ backgroundColor: "#F4F2EE" }}>
                  <td className="py-2.5 font-sans text-foreground">TOTAL</td>
                  <td className="text-right font-mono text-foreground">{Math.round(totals.calories ?? totals.kcal ?? 0)} kcal</td>
                  <td className="text-right font-mono text-foreground">{Math.round(totals.protein_g ?? totals.protein ?? 0)}g</td>
                  <td className="text-right font-mono text-foreground">{Math.round(totals.carbs_g ?? totals.carbs ?? 0)}g</td>
                  <td className="text-right font-mono text-foreground">{Math.round(totals.fat_g ?? totals.fat ?? 0)}g</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <div className="px-4 md:px-6 py-2 border-t flex justify-end" style={{ borderColor: "#E8E4DC" }}>
          <button
            onClick={() => handleSaveMeal(meta)}
            className="flex items-center gap-1.5 text-xs font-sans font-medium text-primary hover:text-primary/80 transition-colors py-1 px-2 rounded-lg hover:bg-primary/5"
          >
            <Bookmark className="h-3.5 w-3.5" />
            Save Meal
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Chat Panel */}
      <div className="w-full flex flex-col">
        {/* Top bar — desktop only */}
        <div className="hidden lg:flex px-6 py-4 border-b border-border items-center justify-between bg-card">
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">NourishMind</h2>
            <p className="text-xs text-muted-foreground font-sans">Your AI Health Coach</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4">
          {/* Welcome message when empty */}
          {messages.length === 0 && (
            <div className="flex justify-start">
              <div className="bg-surface-elevated rounded-[20px] rounded-bl-sm px-4 md:px-5 py-3 max-w-[95%] md:max-w-[80%]">
                <p className="text-[15px] md:text-sm font-sans text-foreground">
                  {getGreeting()}, {firstName}! I'm ready to help you track today. What did you eat? Just describe it naturally 😊
                </p>
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {msg.role === "user" && (
                  <div className="flex justify-end">
                    <div className="bg-primary rounded-[20px] rounded-br-sm px-4 md:px-5 py-3 max-w-[85%] md:max-w-[80%]">
                      <p className="text-[15px] md:text-sm font-sans text-primary-foreground whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                )}
                {msg.role === "assistant" && (
                  <div className="flex justify-start">
                    <div className="max-w-[95%] md:max-w-[80%]">
                      <div className="bg-surface-elevated rounded-[20px] rounded-bl-sm px-4 md:px-5 py-3">
                        <p className="text-[15px] md:text-sm font-sans text-foreground whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.metadata && renderMealCard(msg.metadata)}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-surface-elevated rounded-[20px] rounded-bl-sm px-5 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <motion.div
                        key={d}
                        className="w-2 h-2 rounded-full bg-muted-foreground/50"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Quick-log chips from saved meals */}
        {frequentMeals.length > 0 && (
          <div className="px-3 md:px-4 pt-2 flex gap-2 overflow-x-auto scrollbar-none">
            {frequentMeals.map((meal) => (
              <button
                key={meal.id}
                onClick={() => handleQuickLog(meal)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-sans font-medium text-foreground hover:bg-accent hover:border-primary/30 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="h-3 w-3 text-primary" />
                {meal.meal_name.length > 24 ? meal.meal_name.slice(0, 24) + "…" : meal.meal_name}
                <span className="text-muted-foreground ml-0.5">{meal.total_calories} kcal</span>
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div className="p-3 md:p-4 border-t border-border bg-card flex items-end gap-2 md:gap-3 pb-20 md:pb-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Tell me what you ate, or ask me anything..."
            className="flex-1 resize-none bg-background rounded-xl border border-border px-4 py-3 text-base md:text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[52px] md:min-h-[44px] max-h-32"
            rows={1}
          />
          <button className="text-muted-foreground hover:text-foreground p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Camera className="h-5 w-5" />
          </button>
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="rounded-full w-11 h-11 p-0 bg-primary hover:bg-primary/90 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatLog;
