import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";

/* ── step config ── */
const TOTAL_STEPS = 5;

const goals = [
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "maintain", label: "Maintain Weight" },
  { value: "manage_condition", label: "Manage a Health Condition" },
  { value: "general_wellness", label: "General Wellness" },
];

const diets = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "non_veg", label: "Non-Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "jain", label: "Jain" },
  { value: "intermittent_fasting", label: "Intermittent Fasting" },
  { value: "no_restriction", label: "No Restriction" },
];

const commonConditions = [
  "Diabetes", "PCOS", "Thyroid", "IBS", "Hypertension",
  "High Cholesterol", "Acid Reflux", "Anemia", "Kidney Disease", "None",
];

const commonAllergies = [
  "Gluten", "Dairy", "Nuts", "Soy", "Eggs", "Shellfish", "None",
];

/* ── component ── */
const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1: Goal
  const [selectedGoal, setSelectedGoal] = useState("");

  // Step 2: Basic Info
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "prefer_not_to_say" | "">("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");

  // Step 3: Health Conditions
  const [conditions, setConditions] = useState<string[]>([]);

  // Step 4: Diet & Lifestyle
  const [diet, setDiet] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);

  // Step 5: AI Context
  const [aiContext, setAiContext] = useState("");

  // Restore saved onboarding data from localStorage (set when user was unauthenticated)
  useEffect(() => {
    const saved = localStorage.getItem("nourishmind_onboarding");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.selectedGoal) setSelectedGoal(d.selectedGoal);
        if (d.age) setAge(d.age);
        if (d.sex) setSex(d.sex);
        if (d.heightCm) setHeightCm(d.heightCm);
        if (d.weightKg) setWeightKg(d.weightKg);
        if (d.conditions) setConditions(d.conditions);
        if (d.diet) setDiet(d.diet);
        if (d.allergies) setAllergies(d.allergies);
        if (d.aiContext) setAiContext(d.aiContext);
        // If user is now authenticated, auto-submit and clear
        if (user) {
          setStep(TOTAL_STEPS);
        }
      } catch { /* ignore parse errors */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If user is logged in and we have saved onboarding data, auto-finish
  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem("nourishmind_onboarding");
    if (saved) {
      // User just signed up and came back — auto-save profile
      localStorage.removeItem("nourishmind_onboarding");
      handleFinishRef.current();
      return;
    }
    // Otherwise check if already onboarded
    supabase
      .from("user_profiles")
      .select("onboarding_complete")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.onboarding_complete) navigate("/app/chat", { replace: true });
      });
  }, [user, navigate]);

  const toggleArray = (arr: string[], val: string) => {
    if (val === "None") return arr.includes("None") ? [] : ["None"];
    const without = arr.filter((v) => v !== "None");
    return without.includes(val) ? without.filter((v) => v !== val) : [...without, val];
  };

  const canContinue = () => {
    switch (step) {
      case 1: return !!selectedGoal;
      case 2: return !!age && !!sex;
      case 3: return true; // optional
      case 4: return !!diet;
      case 5: return true; // optional
      default: return true;
    }
  };

  const handleFinish = async () => {
    // If not authenticated, save answers to localStorage and redirect to signup
    if (!user) {
      const pendingData = {
        selectedGoal, age, sex, heightCm, weightKg,
        conditions, diet, allergies, aiContext,
      };
      localStorage.setItem("nourishmind_onboarding", JSON.stringify(pendingData));
      navigate("/signup", { replace: true });
      return;
    }

    setSaving(true);

    const profile: Record<string, unknown> = {
      id: user.id,
      full_name: user.user_metadata?.full_name || null,
      primary_goal: selectedGoal || null,
      age: age ? parseInt(age) : null,
      biological_sex: sex || null,
      height_cm: heightCm ? parseFloat(heightCm) : null,
      weight_kg: weightKg ? parseFloat(weightKg) : null,
      health_conditions: conditions.filter((c) => c !== "None").length > 0 ? conditions.filter((c) => c !== "None") : null,
      dietary_pattern: diet || null,
      food_allergies: allergies.filter((a) => a !== "None").length > 0 ? allergies.filter((a) => a !== "None") : null,
      ai_context_field: aiContext.trim() || null,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("user_profiles")
      .upsert(profile, { onConflict: "id" });

    setSaving(false);

    if (error) {
      console.error("Onboarding save error:", error);
    }

    localStorage.removeItem("nourishmind_onboarding");
    navigate("/app/chat", { replace: true });
  };

  // Ref so the auto-finish effect can call the latest version
  const handleFinishRef = useRef(handleFinish);
  handleFinishRef.current = handleFinish;

  const next = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else handleFinish();
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
    else navigate("/");
  };

  const skip = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else handleFinish();
  };

  /* ── render helpers ── */
  const ChipButton = ({ label, selected, onClick, wide }: { label: string; selected: boolean; onClick: () => void; wide?: boolean }) => (
    <motion.button
      type="button"
      onClick={onClick}
      className={`px-5 py-3.5 rounded-2xl border-2 text-sm font-medium font-sans transition-all ${wide ? "col-span-2" : ""} ${
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-foreground border-border hover:border-secondary"
      }`}
      whileTap={{ scale: 0.97 }}
    >
      {label}
    </motion.button>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-10 text-center">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground font-sans">{step} of {TOTAL_STEPS}</p>
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                What is your primary wellness goal?
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {goals.map((g) => (
                <ChipButton
                  key={g.value}
                  label={g.label}
                  selected={selectedGoal === g.value}
                  onClick={() => setSelectedGoal(g.value)}
                  wide={g.value === "general_wellness"}
                />
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-10 text-center">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground font-sans">{step} of {TOTAL_STEPS}</p>
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                Tell us about yourself
              </h1>
              <p className="text-sm text-muted-foreground font-sans">
                This helps us tailor nutrition advice to your body
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
              <div className="space-y-2">
                <label className="text-xs font-sans font-medium text-muted-foreground">Age</label>
                <Input
                  type="number"
                  placeholder="e.g. 28"
                  value={age}
                  min={1} max={119}
                  onChange={(e) => setAge(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-sans font-medium text-muted-foreground">Biological Sex</label>
                <div className="flex gap-2">
                  {(["male", "female", "prefer_not_to_say"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSex(s)}
                      className={`flex-1 h-11 rounded-xl border-2 text-xs font-sans font-medium transition-all ${
                        sex === s
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-secondary"
                      }`}
                    >
                      {s === "prefer_not_to_say" ? "Other" : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-sans font-medium text-muted-foreground">Height (cm)</label>
                <Input
                  type="number"
                  placeholder="e.g. 170"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-sans font-medium text-muted-foreground">Weight (kg)</label>
                <Input
                  type="number"
                  placeholder="e.g. 65"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-10 text-center">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground font-sans">{step} of {TOTAL_STEPS}</p>
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                Any health conditions?
              </h1>
              <p className="text-sm text-muted-foreground font-sans">
                Select all that apply so we can customize recommendations
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
              {commonConditions.map((c) => (
                <ChipButton
                  key={c}
                  label={c}
                  selected={conditions.includes(c)}
                  onClick={() => setConditions(toggleArray(conditions, c))}
                />
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-10 text-center">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground font-sans">{step} of {TOTAL_STEPS}</p>
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                Diet & lifestyle
              </h1>
            </div>

            <div className="space-y-8 max-w-md mx-auto text-left">
              <div className="space-y-3">
                <label className="text-xs font-sans font-medium text-muted-foreground block text-center">Dietary pattern</label>
                <div className="grid grid-cols-2 gap-3">
                  {diets.map((d) => (
                    <ChipButton
                      key={d.value}
                      label={d.label}
                      selected={diet === d.value}
                      onClick={() => setDiet(d.value)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-sans font-medium text-muted-foreground block text-center">Food allergies</label>
                <div className="grid grid-cols-3 gap-3">
                  {commonAllergies.map((a) => (
                    <ChipButton
                      key={a}
                      label={a}
                      selected={allergies.includes(a)}
                      onClick={() => setAllergies(toggleArray(allergies, a))}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-10 text-center">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground font-sans">{step} of {TOTAL_STEPS}</p>
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                Anything else we should know?
              </h1>
              <p className="text-sm text-muted-foreground font-sans">
                Share any context that helps the AI understand you better — lifestyle, routines, preferences, or restrictions.
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <Textarea
                rows={5}
                placeholder="e.g. I'm a night-shift nurse, I skip breakfast most days, I prefer South Indian food…"
                value={aiContext}
                onChange={(e) => setAiContext(e.target.value)}
                className="rounded-xl text-sm resize-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #FAFAF8 0%, #E8F5EC 100%)" }}>
      {/* Progress bar */}
      <div className="w-full h-[3px] bg-border">
        <motion.div
          className="h-full rounded-pill"
          style={{ background: "#4CAF7C" }}
          initial={{ width: 0 }}
          animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Back button */}
      <div className="p-6">
        <button onClick={back} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="max-w-[600px] w-full"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}

            {/* Navigation buttons */}
            <div className="space-y-3 max-w-[400px] mx-auto mt-10">
              <Button
                onClick={next}
                disabled={!canContinue() || saving}
                className="w-full rounded-pill h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : step === TOTAL_STEPS ? (
                  "Finish & Start Chatting"
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <button
                onClick={skip}
                disabled={saving}
                className="w-full text-muted-foreground hover:text-foreground text-sm font-sans transition-colors"
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
