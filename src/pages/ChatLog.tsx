import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Camera, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/hooks/useChat";
import { useSavedMeals } from "@/hooks/useSavedMeals";
import { useAuthContext } from "@/contexts/AuthContext";
import { MealLogCard } from "@/components/chat/MealLogCard";
import { NutritionPanel } from "@/components/chat/NutritionPanel";
import { getDemoMessages, demoNutritionData, type DemoMessage } from "@/components/chat/demoData";

const ChatLog = () => {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const { messages, isLoading, sendMessage } = useChat();
  const { frequentMeals, saveMeal, incrementUseCount, refresh: refreshSavedMeals } = useSavedMeals();
  const [input, setInput] = useState("");
  const [savedMealIds, setSavedMealIds] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Rameshta";

  // Use demo messages when no real messages exist
  const demoMessages = getDemoMessages(firstName);
  const showDemo = messages.length === 0;
  const displayMessages: DemoMessage[] = showDemo
    ? demoMessages
    : messages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        mealData: undefined, // real meal data comes from metadata
      }));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    sendMessage(text);
  };

  const handleSaveDemoMeal = (msgId: string) => {
    setSavedMealIds((prev) => new Set(prev).add(msgId));
    toast({ title: "Meal saved! 🔖", description: '"Overnight Oats" added to your saved meals.' });
  };

  const handleQuickLog = async (meal: typeof frequentMeals[number]) => {
    if (isLoading) return;
    const description = meal.ingredients
      .map((ing) => `${ing.ingredientName} ${ing.quantityG}g`)
      .join(", ");
    const text = `Log my ${meal.meal_type || "meal"}: ${meal.meal_name} — ${description}`;
    sendMessage(text);
    await incrementUseCount(meal.id);
    toast({ title: `Re-logging "${meal.meal_name}" ⚡` });
  };

  // Render a message's meal card (from demo data or real metadata)
  const renderMealCard = (msg: DemoMessage, realMsg?: typeof messages[number]) => {
    if (msg.mealData) {
      return (
        <MealLogCard
          data={msg.mealData}
          saved={savedMealIds.has(msg.id)}
          onSave={() => handleSaveDemoMeal(msg.id)}
          onEdit={() => toast({ title: "Edit mode coming soon" })}
        />
      );
    }
    // Handle real metadata from useChat
    if (realMsg?.metadata) {
      const meta = realMsg.metadata;
      const ingredients = (meta?.ingredients as Array<Record<string, unknown>>) ?? [];
      const totals = (meta?.totals as Record<string, number>) ?? {};
      if (!ingredients.length) return null;
      return (
        <MealLogCard
          data={{
            mealType: (meta.mealType as string) || (meta.meal_type as string) || "Meal",
            time: "",
            confidence: (meta.confidence as number) || 0,
            ingredients: ingredients.map((ing) => {
              const per100g = (ing.per100g as Record<string, number>) || {};
              const qtyG = (ing.quantityG as number) || 0;
              const scale = qtyG / 100;
              return {
                name: (ing.ingredientName as string) || (ing.name as string) || "Item",
                qty: qtyG ? `${Math.round(qtyG)}g` : "",
                kcal: Math.round((per100g.calories ?? (ing.kcal as number) ?? 0) * (scale || 1)),
                protein: Math.round((per100g.protein_g ?? (ing.protein as number) ?? 0) * (scale || 1)),
                carbs: Math.round((per100g.carbs_g ?? (ing.carbs as number) ?? 0) * (scale || 1)),
                fat: Math.round((per100g.fat_g ?? (ing.fat as number) ?? 0) * (scale || 1)),
                source: "",
              };
            }),
            totals: {
              kcal: Math.round(totals.calories ?? totals.kcal ?? 0),
              protein: Math.round(totals.protein_g ?? totals.protein ?? 0),
              carbs: Math.round(totals.carbs_g ?? totals.carbs ?? 0),
              fat: Math.round(totals.fat_g ?? totals.fat ?? 0),
            },
          }}
          onSave={() => toast({ title: "Meal saved! 🔖" })}
          onEdit={() => toast({ title: "Edit mode coming soon" })}
        />
      );
    }
    return null;
  };

  return (
    <div className="flex h-full">
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — desktop only */}
        <div className="hidden lg:flex px-6 py-4 border-b border-border items-center justify-between bg-card">
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">NourishMind</h2>
            <p className="text-xs text-muted-foreground font-sans">Your AI Health Coach</p>
          </div>
          <span className="bg-muted rounded-pill px-4 py-1.5 text-xs font-mono font-semibold text-foreground">
            {showDemo ? "697" : "0"} / 1,800 kcal
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4">
          <AnimatePresence>
            {displayMessages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: showDemo ? idx * 0.15 : 0 }}
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
                      {msg.content && (
                        <div className="bg-surface-elevated rounded-[20px] rounded-bl-sm px-4 md:px-5 py-3">
                          <p className="text-[15px] md:text-sm font-sans text-foreground whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      )}
                      {renderMealCard(msg, !showDemo ? messages[idx] : undefined)}
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

        {/* Quick-log chips */}
        <div className="px-3 md:px-4 pt-2">
          {frequentMeals.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
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
          ) : (
            <p className="text-xs font-sans text-muted-foreground text-center py-1">
              💡 Log a meal 3× to save it as a quick-log chip
            </p>
          )}
        </div>

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

      {/* Right Panel — desktop only */}
      <div className="hidden lg:block w-[35%] max-w-[380px]">
        <NutritionPanel {...demoNutritionData} />
      </div>
    </div>
  );
};

export default ChatLog;
