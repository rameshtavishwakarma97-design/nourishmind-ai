import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, Trash2, UtensilsCrossed, Loader2, Pencil, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useFoodLog } from "@/hooks/useFoodLog";
import { useToast } from "@/hooks/use-toast";

type Ingredient = { name: string; qty: string; kcal: number; p: number; c: number; f: number; source: string };
type Meal = {
  id: string; icon: string; type: string; time: string; kcal: number;
  title: string; desc: string; confidence: number; confidenceLabel: string;
  ingredients: Ingredient[]; aiNote: string;
};
type DayEntry = {
  date: string; label: string; totalKcal: number; macros: string;
  defaultExpanded: boolean; meals: Meal[];
};

const weekDays: DayEntry[] = [
  {
    date: "Saturday, Feb 21", label: "TODAY", totalKcal: 1420, macros: "P89g C162g F54g", defaultExpanded: true,
    meals: [
      {
        id: "b1", icon: "🌅", type: "BREAKFAST", time: "8:42 AM", kcal: 697,
        title: "Overnight Oats Bowl",
        desc: "Rolled Oats + Almonds + Myprotein Whey + Amul Gold Milk + Cocoa + Sugar Free",
        confidence: 94, confidenceLabel: "✅ 94%",
        ingredients: [
          { name: "Rolled Oats", qty: "80g", kcal: 297, p: 10, c: 54, f: 5, source: "✅ IFCT" },
          { name: "Almonds (7 pcs)", qty: "21g", kcal: 122, p: 4, c: 5, f: 10, source: "✅ IFCT" },
          { name: "Myprotein Whey", qty: "1 scoop (30g)", kcal: 103, p: 21, c: 2, f: 2, source: "✅ Brand DB" },
          { name: "Amul Gold Milk", qty: "250ml", kcal: 163, p: 8, c: 12, f: 9, source: "✅ Brand DB" },
          { name: "Cocoa Powder", qty: "1 tsp (3g)", kcal: 8, p: 1, c: 1, f: 0, source: "✅ IFCT" },
          { name: "Sugar Free sachet", qty: "1 sachet", kcal: 4, p: 0, c: 1, f: 0, source: "⚠️ Estimated" },
        ],
        aiNote: "This meal covered 29% of your daily protein goal",
      },
      {
        id: "l1", icon: "☀️", type: "LUNCH", time: "1:15 PM", kcal: 480,
        title: "Mess Lunch — Dal Rice + Bhindi Sabzi + 2 Chapati",
        desc: "Dal + Rice + Bhindi Sabzi + 2 Chapati",
        confidence: 71, confidenceLabel: "⚠️ 71% (mess food estimate)",
        ingredients: [
          { name: "Dal (Toor)", qty: "150ml", kcal: 120, p: 8, c: 18, f: 2, source: "✅ IFCT" },
          { name: "Rice", qty: "150g", kcal: 195, p: 4, c: 43, f: 0.5, source: "✅ IFCT" },
          { name: "Bhindi Sabzi", qty: "100g", kcal: 65, p: 2, c: 7, f: 3, source: "⚠️ Estimated" },
          { name: "Chapati (2)", qty: "60g", kcal: 100, p: 3, c: 20, f: 1, source: "✅ IFCT" },
        ],
        aiNote: "Mess food estimates can vary ±15%. Consider logging specific portions next time.",
      },
      {
        id: "s1", icon: "🌤", type: "SNACK", time: "4:30 PM", kcal: 243,
        title: "Banana + Black Coffee",
        desc: "Banana + Black Coffee + Mixed Nuts",
        confidence: 91, confidenceLabel: "✅ 91%",
        ingredients: [
          { name: "Banana", qty: "1 medium (120g)", kcal: 105, p: 1, c: 27, f: 0, source: "✅ IFCT" },
          { name: "Black Coffee", qty: "250ml", kcal: 5, p: 0, c: 1, f: 0, source: "✅ IFCT" },
          { name: "Mixed Nuts", qty: "30g", kcal: 133, p: 4, c: 5, f: 12, source: "✅ IFCT" },
        ],
        aiNote: "Good pre-workout snack with quick energy from banana.",
      },
    ],
  },
  {
    date: "Friday, Feb 20", label: "", totalKcal: 1640, macros: "P94g C195g F58g", defaultExpanded: false,
    meals: [
      {
        id: "b2", icon: "🌅", type: "BREAKFAST", time: "9:00 AM", kcal: 550,
        title: "Poha + Tea", desc: "Poha with peanuts + Chai with milk",
        confidence: 85, confidenceLabel: "✅ 85%",
        ingredients: [
          { name: "Poha", qty: "200g", kcal: 450, p: 8, c: 80, f: 10, source: "✅ IFCT" },
          { name: "Chai", qty: "150ml", kcal: 100, p: 3, c: 12, f: 4, source: "⚠️ Estimated" },
        ],
        aiNote: "Good complex carb breakfast. Consider adding protein source.",
      },
      {
        id: "l2", icon: "☀️", type: "LUNCH", time: "1:30 PM", kcal: 620,
        title: "Mess Lunch — Rajma Rice + Salad", desc: "Rajma + Rice + Cucumber Salad + Papad",
        confidence: 72, confidenceLabel: "⚠️ 72%",
        ingredients: [
          { name: "Rajma", qty: "150ml", kcal: 180, p: 12, c: 28, f: 1, source: "✅ IFCT" },
          { name: "Rice", qty: "180g", kcal: 234, p: 5, c: 52, f: 0.5, source: "✅ IFCT" },
          { name: "Salad", qty: "80g", kcal: 25, p: 1, c: 5, f: 0, source: "✅ IFCT" },
          { name: "Papad", qty: "1 pc", kcal: 45, p: 2, c: 7, f: 1, source: "✅ IFCT" },
        ],
        aiNote: "Rajma is a great protein source for vegetarians.",
      },
      {
        id: "d2", icon: "🌙", type: "DINNER", time: "8:45 PM", kcal: 470,
        title: "Roti + Paneer Sabzi", desc: "3 Roti + Paneer Bhurji + Onion salad",
        confidence: 78, confidenceLabel: "⚠️ 78%",
        ingredients: [
          { name: "Roti (3)", qty: "90g", kcal: 150, p: 5, c: 30, f: 1.5, source: "✅ IFCT" },
          { name: "Paneer Bhurji", qty: "120g", kcal: 280, p: 18, c: 5, f: 22, source: "⚠️ Estimated" },
          { name: "Onion Salad", qty: "50g", kcal: 20, p: 0.5, c: 5, f: 0, source: "✅ IFCT" },
        ],
        aiNote: "Good protein from paneer. Late dinner — try earlier tomorrow.",
      },
    ],
  },
  {
    date: "Thursday, Feb 19", label: "", totalKcal: 1380, macros: "P78g C170g F48g", defaultExpanded: false,
    meals: [
      {
        id: "b3", icon: "🌅", type: "BREAKFAST", time: "8:15 AM", kcal: 420,
        title: "Idli + Sambar + Chutney", desc: "3 Idli + Sambar + Coconut Chutney",
        confidence: 88, confidenceLabel: "✅ 88%",
        ingredients: [
          { name: "Idli (3 pcs)", qty: "180g", kcal: 230, p: 6, c: 46, f: 1, source: "✅ IFCT" },
          { name: "Sambar", qty: "150ml", kcal: 120, p: 5, c: 18, f: 3, source: "✅ IFCT" },
          { name: "Coconut Chutney", qty: "30g", kcal: 70, p: 1, c: 4, f: 5, source: "✅ IFCT" },
        ],
        aiNote: "Traditional South Indian breakfast. Add protein for better balance.",
      },
      {
        id: "l3", icon: "☀️", type: "LUNCH", time: "12:45 PM", kcal: 530,
        title: "Mess Lunch — Chole + Rice + Roti", desc: "Chole + Rice + 1 Roti + Pickle",
        confidence: 70, confidenceLabel: "⚠️ 70%",
        ingredients: [
          { name: "Chole", qty: "150ml", kcal: 200, p: 10, c: 30, f: 5, source: "✅ IFCT" },
          { name: "Rice", qty: "150g", kcal: 195, p: 4, c: 43, f: 0.5, source: "✅ IFCT" },
          { name: "Roti (1)", qty: "30g", kcal: 75, p: 2, c: 15, f: 0.5, source: "✅ IFCT" },
        ],
        aiNote: "Chole provides good plant protein and fiber.",
      },
      {
        id: "s3", icon: "🌤", type: "SNACK", time: "5:00 PM", kcal: 430,
        title: "Protein Shake + Biscuits", desc: "Whey Protein Shake + 4 Marie Biscuits",
        confidence: 90, confidenceLabel: "✅ 90%",
        ingredients: [
          { name: "Whey Protein", qty: "1 scoop (30g)", kcal: 103, p: 21, c: 2, f: 2, source: "✅ Brand DB" },
          { name: "Milk", qty: "200ml", kcal: 130, p: 6, c: 10, f: 7, source: "✅ Brand DB" },
          { name: "Marie Biscuits (4)", qty: "28g", kcal: 132, p: 2, c: 22, f: 4, source: "✅ Brand DB" },
        ],
        aiNote: "Good post-workout protein. Consider replacing biscuits with fruit.",
      },
    ],
  },
];

const FoodLog = () => {
  const navigate = useNavigate();
  const [dateOffset, setDateOffset] = useState(0); // 0 = today

  // Compute target date from offset
  const targetDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + dateOffset);
    return d.toISOString().split('T')[0];
  }, [dateOffset]);

  const { meals, dailyTotals, loading, deleteMeal, updateMealIngredients, refresh } = useFoodLog(targetDate);

  // Build real day entries from hook data
  const realDayEntry = useMemo(() => {
    if (meals.length === 0) return null;
    const mealTypeIcons: Record<string, string> = {
      breakfast: "🌅", lunch: "☀️", dinner: "🌙", snacks: "🌤", other: "🍽️",
    };
    return {
      date: new Date(targetDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
      label: dateOffset === 0 ? "TODAY" : "",
      totalKcal: dailyTotals.calories,
      macros: `P${Math.round(dailyTotals.protein)}g C${Math.round(dailyTotals.carbs)}g F${Math.round(dailyTotals.fat)}g`,
      defaultExpanded: true,
      meals: meals.map(m => ({
        id: m.id,
        icon: mealTypeIcons[m.meal_type] || "🍽️",
        type: m.meal_type.toUpperCase(),
        time: new Date(m.logged_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        kcal: Math.round(m.total_calories || 0),
        title: m.raw_input || `${m.meal_type} meal`,
        desc: m.meal_ingredients.map(i => i.ingredient_name).join(' + '),
        confidence: Math.round((m.overall_confidence_score || 0) * 100),
        confidenceLabel: (m.overall_confidence_score || 0) >= 0.9
          ? `✅ ${Math.round((m.overall_confidence_score || 0) * 100)}%`
          : `⚠️ ${Math.round((m.overall_confidence_score || 0) * 100)}%`,
        ingredients: m.meal_ingredients.map(i => ({
          name: i.ingredient_name,
          qty: `${i.quantity_g}g`,
          kcal: Math.round(i.calories),
          p: Math.round(i.protein_g),
          c: Math.round(i.carbs_g),
          f: Math.round(i.fat_g),
          source: i.confidence_source === 'ifct_verified' ? '✅ IFCT' : i.confidence_source === 'brand_db_verified' ? '✅ Brand DB' : '⚠️ Estimated',
        })),
        aiNote: "",
      })),
    };
  }, [meals, dailyTotals, targetDate, dateOffset]);

  const displayDays = realDayEntry ? [realDayEntry] : [];

  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>(
    { 0: true }
  );
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editIngredients, setEditIngredients] = useState<Ingredient[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const toggleDay = (i: number) => setExpandedDays((p) => ({ ...p, [i]: !p[i] }));

  const openEdit = (meal: Meal) => {
    setSelectedMeal(meal);
    setEditIngredients(meal.ingredients.map(ing => ({ ...ing })));
    setEditMode(true);
  };

  const handleDeleteMeal = async () => {
    if (!selectedMeal) return;
    setDeleting(true);
    const result = await deleteMeal(selectedMeal.id);
    setDeleting(false);
    if (result.success) {
      toast({ title: "Meal deleted — daily totals updated ✅" });
      setSelectedMeal(null);
      setConfirmDelete(false);
    } else {
      toast({ title: result.error || "Delete failed — try again", variant: "destructive" });
      setConfirmDelete(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedMeal) return;
    setSaving(true);
    const result = await updateMealIngredients(selectedMeal.id, editIngredients.map(ing => ({
      ingredient_name: ing.name,
      quantity_g: parseFloat(ing.qty) || 0,
      calories: ing.kcal,
      protein_g: ing.p,
      carbs_g: ing.c,
      fat_g: ing.f,
    })));
    setSaving(false);
    if (result.success) {
      toast({ title: "Meal updated ✅" });
      setEditMode(false);
      setSelectedMeal(null);
    } else {
      toast({ title: result.error || "Save failed — try again", variant: "destructive" });
    }
  };

  const editTotals = useMemo(() => ({
    kcal: editIngredients.reduce((s, i) => s + i.kcal, 0),
    p: editIngredients.reduce((s, i) => s + i.p, 0),
    c: editIngredients.reduce((s, i) => s + i.c, 0),
    f: editIngredients.reduce((s, i) => s + i.f, 0),
  }), [editIngredients]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-4 md:space-y-6 pb-24">
        {/* Top Bar */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">Food Log</h2>
          <div className="flex items-center gap-2 justify-center">
            <Button variant="ghost" size="sm" className="rounded-pill text-xs min-h-[44px] md:min-h-0" onClick={() => setDateOffset(d => d - 1)}><ChevronLeft className="h-4 w-4 mr-1" />Prev</Button>
            <span className="bg-muted rounded-pill px-4 py-1.5 text-xs font-sans font-semibold text-foreground">
              {new Date(new Date().setDate(new Date().getDate() + dateOffset)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <Button variant="ghost" size="sm" className="rounded-pill text-xs min-h-[44px] md:min-h-0" onClick={() => setDateOffset(d => Math.min(d + 1, 0))}>Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
          </div>
        </div>

        {/* Summary Chips — 2x2 grid on mobile, row on desktop */}
        <div className="grid grid-cols-2 md:flex gap-2 md:gap-3">
          {[
            { label: "🔥 Avg 1,580 kcal/day" },
            { label: "💪 Avg protein 87g" },
            { label: "⏱ Avg fast 12.3 hrs" },
            { label: "💧 Avg water 1.8L" },
          ].map((c) => (
            <span key={c.label} className="bg-muted rounded-pill px-3 md:px-4 py-2 text-xs font-sans font-medium text-foreground text-center md:text-left">{c.label}</span>
          ))}
        </div>

        {/* Daily Sections */}
        <div className="space-y-4">
          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && displayDays.length === 0 && (
            <div className="bg-card rounded-2xl border border-border p-8 text-center space-y-3">
              <UtensilsCrossed className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="font-serif text-lg font-semibold text-foreground">No meals logged yet</h3>
              <p className="text-sm font-sans text-muted-foreground">Head to Chat to log your first meal — just describe what you ate!</p>
              <Button onClick={() => navigate('/app/chat')} className="rounded-pill bg-primary text-primary-foreground mt-2">
                Log a meal →
              </Button>
            </div>
          )}
          {!loading && displayDays.map((day, di) => (
            <div key={di} className="bg-card rounded-2xl border border-border overflow-hidden">
              {/* Day Header */}
              <button
                onClick={() => toggleDay(di)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-sm font-bold text-foreground">{day.date}</h3>
                  {day.label && (
                    <span className="bg-secondary/20 text-secondary rounded-pill px-2 py-0.5 text-[10px] font-semibold font-sans">{day.label}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="text-[10px] md:text-xs font-mono text-muted-foreground hidden sm:inline">{day.totalKcal.toLocaleString()} kcal · {day.macros}</span>
                  <span className="text-[10px] font-mono text-muted-foreground sm:hidden">{day.totalKcal.toLocaleString()} kcal</span>
                  {expandedDays[di] ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              {/* Meal Entries */}
              <AnimatePresence>
                {expandedDays[di] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 md:px-6 pb-4 space-y-3">
                      {day.meals.map((meal) => (
                        <div key={meal.id} className="bg-background rounded-xl border border-border/50 p-3 md:p-4">
                          {/* Mobile stacked layout */}
                          <div className="md:hidden space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold font-sans text-foreground">{meal.icon} {meal.type}</span>
                              <span className="text-xs text-muted-foreground font-sans">{meal.time}</span>
                              <span className="text-xs font-mono font-semibold text-foreground">{meal.kcal} kcal</span>
                            </div>
                            <p className="text-sm font-sans text-muted-foreground">{meal.title}</p>
                            <div className="flex gap-3 pt-1">
                              <button onClick={() => setSelectedMeal(meal)} className="text-xs font-sans text-secondary font-medium hover:underline min-h-[44px] flex items-center">View detail</button>
                              <button onClick={() => openEdit(meal)} className="text-xs font-sans text-muted-foreground hover:underline min-h-[44px] flex items-center">Edit</button>
                            </div>
                          </div>
                          {/* Desktop row layout */}
                          <div className="hidden md:flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-sm font-semibold font-sans text-foreground">{meal.icon} {meal.type}</span>
                                <span className="text-xs text-muted-foreground font-sans">· {meal.time}</span>
                                <span className="text-xs font-mono font-semibold text-foreground">· {meal.kcal} kcal</span>
                              </div>
                              <p className="text-sm font-sans text-foreground font-medium">{meal.title}</p>
                              <p className="text-xs font-sans text-muted-foreground mt-0.5 truncate">{meal.desc}</p>
                              <p className="text-xs font-sans text-muted-foreground mt-1">
                                Confidence: <span className={meal.confidence >= 90 ? "text-success" : "text-warning"}>{meal.confidenceLabel}</span>
                              </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button variant="ghost" size="sm" className="text-xs rounded-pill" onClick={() => setSelectedMeal(meal)}>View detail →</Button>
                              <Button variant="ghost" size="sm" className="text-xs rounded-pill" onClick={() => openEdit(meal)}>Edit</Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add missed meal */}
                      <button className="w-full border-2 border-dashed border-border rounded-xl py-3 text-xs font-sans text-muted-foreground hover:border-secondary hover:text-secondary transition-colors">
                        + Add missed meal for {day.label === "TODAY" ? "today" : day.date.split(",")[0].toLowerCase()}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Empty Day Example */}
          <div className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center justify-center text-center">
            <UtensilsCrossed className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-sans text-muted-foreground mb-3">No meals logged for Wednesday, Feb 18</p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-pill text-xs"
              onClick={() => navigate("/app/chat")}
            >
              Log a meal →
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar — hidden on mobile (behind bottom nav) */}
      <div className="hidden md:block sticky bottom-0 bg-card border-t border-border px-6 py-3">
        <p className="text-xs font-sans text-muted-foreground text-center">
          This week: <span className="font-semibold text-foreground">7 meals logged</span> · Best macro day: <span className="font-semibold text-foreground">Tuesday</span> · Protein goal hit: <span className="font-semibold text-foreground">5/7 days</span>
        </p>
      </div>

      {/* Meal Detail Drawer — full screen on mobile, side drawer on desktop */}
      <Sheet open={!!selectedMeal} onOpenChange={(open) => { if (!open) { setSelectedMeal(null); setEditMode(false); setConfirmDelete(false); } }}>
        <SheetContent className="w-full sm:w-[420px] sm:max-w-[420px] overflow-y-auto">
          {selectedMeal && (
            <>
              <SheetHeader>
                <SheetTitle className="font-serif text-lg">
                  {selectedMeal.icon} {selectedMeal.title}
                </SheetTitle>
                <p className="text-xs font-sans text-muted-foreground">{selectedMeal.time} · {selectedMeal.kcal} kcal · Confidence: {selectedMeal.confidenceLabel}</p>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Edit Mode */}
                {editMode ? (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold font-sans text-foreground">Edit Ingredients</h4>
                        <span className="text-xs font-mono text-muted-foreground">{editTotals.kcal} kcal</span>
                      </div>
                      <div className="space-y-3">
                        {editIngredients.map((ing, idx) => (
                          <div key={idx} className="bg-muted rounded-xl p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <input
                                className="text-sm font-sans font-medium bg-transparent border-b border-border focus:outline-none focus:border-secondary w-2/3"
                                value={ing.name}
                                onChange={e => { const next = [...editIngredients]; next[idx] = { ...next[idx], name: e.target.value }; setEditIngredients(next); }}
                              />
                              <button onClick={() => setEditIngredients(prev => prev.filter((_, i) => i !== idx))} className="text-destructive hover:text-destructive/70">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                              <div>
                                <label className="text-[10px] text-muted-foreground">Qty</label>
                                <input className="w-full text-xs font-mono bg-background border border-border rounded px-1.5 py-1" value={ing.qty} onChange={e => { const next = [...editIngredients]; next[idx] = { ...next[idx], qty: e.target.value }; setEditIngredients(next); }} />
                              </div>
                              <div>
                                <label className="text-[10px] text-muted-foreground">Kcal</label>
                                <input type="number" className="w-full text-xs font-mono bg-background border border-border rounded px-1.5 py-1" value={ing.kcal} onChange={e => { const next = [...editIngredients]; next[idx] = { ...next[idx], kcal: +e.target.value }; setEditIngredients(next); }} />
                              </div>
                              <div>
                                <label className="text-[10px] text-muted-foreground">P (g)</label>
                                <input type="number" className="w-full text-xs font-mono bg-background border border-border rounded px-1.5 py-1" value={ing.p} onChange={e => { const next = [...editIngredients]; next[idx] = { ...next[idx], p: +e.target.value }; setEditIngredients(next); }} />
                              </div>
                              <div>
                                <label className="text-[10px] text-muted-foreground">C (g)</label>
                                <input type="number" className="w-full text-xs font-mono bg-background border border-border rounded px-1.5 py-1" value={ing.c} onChange={e => { const next = [...editIngredients]; next[idx] = { ...next[idx], c: +e.target.value }; setEditIngredients(next); }} />
                              </div>
                              <div>
                                <label className="text-[10px] text-muted-foreground">F (g)</label>
                                <input type="number" className="w-full text-xs font-mono bg-background border border-border rounded px-1.5 py-1" value={ing.f} onChange={e => { const next = [...editIngredients]; next[idx] = { ...next[idx], f: +e.target.value }; setEditIngredients(next); }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setEditIngredients(prev => [...prev, { name: "", qty: "", kcal: 0, p: 0, c: 0, f: 0, source: "⚠️ Manual" }])}
                        className="mt-3 w-full border-2 border-dashed border-border rounded-xl py-2 text-xs font-sans text-muted-foreground hover:border-secondary hover:text-secondary transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Add ingredient
                      </button>
                    </div>
                    {/* Live totals */}
                    <div className="bg-muted rounded-xl p-3 grid grid-cols-4 gap-2 text-center">
                      <div><p className="text-[10px] text-muted-foreground">Kcal</p><p className="text-sm font-mono font-semibold">{editTotals.kcal}</p></div>
                      <div><p className="text-[10px] text-muted-foreground">Protein</p><p className="text-sm font-mono font-semibold">{editTotals.p}g</p></div>
                      <div><p className="text-[10px] text-muted-foreground">Carbs</p><p className="text-sm font-mono font-semibold">{editTotals.c}g</p></div>
                      <div><p className="text-[10px] text-muted-foreground">Fat</p><p className="text-sm font-mono font-semibold">{editTotals.f}g</p></div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="flex-1 rounded-pill text-xs" onClick={() => setEditMode(false)}>Cancel</Button>
                      <Button size="sm" className="flex-1 rounded-pill text-xs" onClick={handleSaveEdit} disabled={saving}>
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Save className="h-3.5 w-3.5 mr-1" />}
                        Save Changes
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Ingredient Table (read-only) */}
                    <div>
                      <h4 className="text-sm font-semibold font-sans text-foreground mb-3">Ingredient Breakdown</h4>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-muted-foreground font-sans border-b border-border">
                            <th className="text-left py-2 font-medium">Ingredient</th>
                            <th className="text-left py-2 font-medium">Qty</th>
                            <th className="text-right py-2 font-medium">Cal</th>
                            <th className="text-right py-2 font-medium">P</th>
                            <th className="text-right py-2 font-medium">C</th>
                            <th className="text-right py-2 font-medium">F</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedMeal.ingredients.map((ing) => (
                            <tr key={ing.name} className="border-b border-border/30">
                              <td className="py-2 font-sans text-foreground">{ing.name}</td>
                              <td className="py-2 font-sans text-muted-foreground">{ing.qty}</td>
                              <td className="text-right font-mono">{ing.kcal}</td>
                              <td className="text-right font-mono">{ing.p}g</td>
                              <td className="text-right font-mono">{ing.c}g</td>
                              <td className="text-right font-mono">{ing.f}g</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="font-semibold" style={{ backgroundColor: "#F4F2EE" }}>
                            <td className="py-2 font-sans" colSpan={2}>TOTAL</td>
                            <td className="text-right font-mono">{selectedMeal.ingredients.reduce((a, b) => a + b.kcal, 0)}</td>
                            <td className="text-right font-mono">{selectedMeal.ingredients.reduce((a, b) => a + b.p, 0)}g</td>
                            <td className="text-right font-mono">{selectedMeal.ingredients.reduce((a, b) => a + b.c, 0)}g</td>
                            <td className="text-right font-mono">{selectedMeal.ingredients.reduce((a, b) => a + b.f, 0)}g</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Source badges */}
                    <div className="flex gap-2 flex-wrap">
                      {selectedMeal.ingredients.map((ing) => (
                        <span key={ing.name} className="bg-muted rounded-pill px-2 py-1 text-[10px] font-sans text-muted-foreground">
                          {ing.name}: {ing.source}
                        </span>
                      ))}
                    </div>

                    {/* AI Note */}
                    {selectedMeal.aiNote && (
                      <div className="bg-secondary/10 rounded-xl p-4 border border-secondary/20">
                        <p className="text-xs font-sans text-foreground">🤖 {selectedMeal.aiNote}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="text-xs w-full rounded-pill" onClick={() => openEdit(selectedMeal)}>
                        <Pencil className="h-3.5 w-3.5 mr-1.5" />Edit ingredients
                      </Button>

                      {confirmDelete ? (
                        <div className="bg-destructive/10 rounded-xl p-4 space-y-3">
                          <p className="text-sm font-sans text-foreground">
                            Delete {selectedMeal.type} ({selectedMeal.kcal} kcal)? This cannot be undone.
                          </p>
                          <div className="flex gap-3">
                            <Button variant="ghost" size="sm" className="flex-1 rounded-pill text-xs" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                            <Button variant="destructive" size="sm" className="flex-1 rounded-pill text-xs" onClick={handleDeleteMeal} disabled={deleting}>
                              {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Trash2 className="h-3.5 w-3.5 mr-1" />}
                              Delete
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-destructive text-xs w-full rounded-pill hover:bg-destructive/10" onClick={() => setConfirmDelete(true)}>
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />Delete this entry
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FoodLog;
