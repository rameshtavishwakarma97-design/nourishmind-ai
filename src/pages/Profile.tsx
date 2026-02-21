import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const subNavItems = [
  "Personal Info", "Health Conditions", "Supplements & Meds",
  "Cycle Tracking", "My Exceptions", "AI Context", "Privacy",
];

const suggestionChips = ["Hostel student", "Night shift", "Frequent traveler", "Religious fasts", "WFH"];

const Profile = () => {
  const [activeSection, setActiveSection] = useState("AI Context");
  const { toast } = useToast();
  const [context, setContext] = useState(
    "I am an MBA student at SPJIMR Mumbai eating college mess food on weekdays. I travel home to Pimpri on weekends. I keep a fast every Ekadashi. I work out 5 days a week doing calisthenics and cardio."
  );

  return (
    <div className="flex h-screen">
      {/* Sub-nav */}
      <div className="w-[220px] border-r border-border bg-card p-4 space-y-1">
        {subNavItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveSection(item)}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-all ${
              activeSection === item
                ? "bg-accent/40 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-3xl space-y-8">
        {activeSection === "AI Context" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* What I know */}
            <div className="bg-surface-elevated rounded-2xl p-6 border border-accent">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-foreground">What I know about you</h3>
                <span className="text-xs text-muted-foreground font-sans">Last updated today</span>
              </div>
              <ul className="space-y-2 text-sm font-sans text-foreground">
                <li>• 24-year-old female MBA student at SPJIMR</li>
                <li>• Goal: Weight maintenance + muscle gain</li>
                <li>• Conditions: IBS, Anxiety</li>
                <li>• Schedule: Classes 9–5, gym 6–7 PM, sleep ~midnight</li>
                <li>• Diet: Vegetarian on weekdays</li>
                <li>• Supplements: Vitamin D3, Ashwagandha 300mg</li>
                <li>• Eats mostly hostel mess food during weekdays</li>
              </ul>
              <button className="mt-4 text-sm text-secondary font-sans font-medium hover:underline">
                Edit any detail →
              </button>
            </div>

            {/* Open context */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-sans font-semibold text-foreground">Things You Want AI to Know</label>
                <p className="text-xs text-muted-foreground font-sans mt-1">Your open context field</p>
              </div>
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-[120px] rounded-xl border-border font-sans text-sm"
              />
              <div className="flex gap-2 flex-wrap">
                {suggestionChips.map((chip) => (
                  <button
                    key={chip}
                    className="bg-muted rounded-pill px-3 py-1 text-xs font-sans text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <Button
                onClick={() => toast({ title: "Context saved successfully ✅" })}
                className="rounded-pill bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              >
                Save Context
              </Button>
            </div>

            {/* What I don't know */}
            <div className="space-y-3">
              <h4 className="font-sans text-sm font-semibold text-foreground">What I don't know yet</h4>
              <div className="flex gap-3 flex-wrap">
                {["Menstrual cycle data →", "Workout intensity →", "Stress levels →"].map((item) => (
                  <button
                    key={item}
                    className="bg-muted rounded-xl px-4 py-3 text-xs font-sans text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground font-sans text-sm">{activeSection} — Coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
