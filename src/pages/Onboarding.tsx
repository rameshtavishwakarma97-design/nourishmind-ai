import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const goals = [
  "Weight Loss",
  "Muscle Gain",
  "Maintain Weight",
  "Manage a Health Condition",
  "General Wellness",
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(["Muscle Gain"]);

  const toggle = (goal: string) => {
    setSelected((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #FAFAF8 0%, #E8F5EC 100%)" }}>
      {/* Progress bar */}
      <div className="w-full h-[3px] bg-border">
        <div className="h-full w-[20%] rounded-pill" style={{ background: "#4CAF7C" }} />
      </div>

      {/* Back button */}
      <div className="p-6">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          className="max-w-[600px] w-full space-y-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-sans">1 of 5</p>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              What is your primary wellness goal?
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {goals.map((goal) => {
              const isSelected = selected.includes(goal);
              return (
                <motion.button
                  key={goal}
                  onClick={() => toggle(goal)}
                  className={`px-6 py-4 rounded-2xl border-2 text-sm font-medium font-sans transition-all ${
                    goal === "General Wellness" ? "col-span-2" : ""
                  } ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-secondary"
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  {goal}
                </motion.button>
              );
            })}
          </div>

          <div className="space-y-3 max-w-[400px] mx-auto">
            <Button
              onClick={() => navigate("/app/chat")}
              className="w-full rounded-pill h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <button
              onClick={() => navigate("/app/chat")}
              className="text-muted-foreground hover:text-foreground text-sm font-sans transition-colors"
            >
              Skip for now
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
