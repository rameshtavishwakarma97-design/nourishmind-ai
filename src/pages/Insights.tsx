import { useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ScatterChart, Scatter, ZAxis,
} from "recharts";

const tabs = ["Weekly", "Monthly", "Trends", "Correlations"];

const weeklyCalData = [
  { day: "Mon", protein: 120, carbs: 200, fat: 50 },
  { day: "Tue", protein: 140, carbs: 220, fat: 55 },
  { day: "Wed", protein: 100, carbs: 180, fat: 45 },
  { day: "Thu", protein: 130, carbs: 210, fat: 60 },
  { day: "Fri", protein: 110, carbs: 190, fat: 48 },
  { day: "Sat", protein: 145, carbs: 230, fat: 62 },
  { day: "Sun", protein: 90, carbs: 170, fat: 40 },
];

const moodData = [
  { protein: 80, mood: 2.5, z: 10 },
  { protein: 100, mood: 3.0, z: 10 },
  { protein: 120, mood: 3.5, z: 10 },
  { protein: 90, mood: 2.8, z: 10 },
  { protein: 140, mood: 4.0, z: 10 },
  { protein: 130, mood: 3.8, z: 10 },
  { protein: 110, mood: 3.2, z: 10 },
];

const correlations = [
  { icon: "🧠", text: "On days your magnesium is below 60% RDA, your mood averages 2.1 vs 3.8 on adequate days", color: "hsl(var(--macro-fat))" },
  { icon: "🌙", text: "Your lowest energy scores occur the day after meals with less than 20g protein", color: "hsl(var(--warning))" },
  { icon: "⏰", text: "Your stress scores are 40% lower on days you eat before 8 PM", color: "hsl(var(--secondary))" },
];

const Insights = () => {
  const [activeTab, setActiveTab] = useState("Weekly");

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Tab bar */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-pill text-sm font-sans font-medium transition-all ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Weekly" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Story card */}
          <div className="rounded-2xl p-8 text-white space-y-3" style={{ background: "linear-gradient(135deg, #1A3C2E, #2D6B4F)" }}>
            <p className="text-xs text-white/60 font-sans">Week of Feb 15–21</p>
            <p className="font-serif text-2xl font-bold">Protein goal: 5/7 days ✅</p>
            <p className="font-sans text-lg text-white/90">Best day: Tuesday 💪</p>
            <p className="font-sans text-sm text-white/70">Magnesium: 58% avg — needs work</p>
            <p className="font-sans text-sm text-white/70">Longest fast: 14.5 hours Thursday</p>
            <div className="flex gap-3 mt-4">
              <button className="bg-white/20 hover:bg-white/30 rounded-pill px-4 py-2 text-xs font-sans transition-colors">📤 Share to Instagram</button>
              <button className="bg-white/20 hover:bg-white/30 rounded-pill px-4 py-2 text-xs font-sans transition-colors">⬇ Download</button>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-serif text-sm font-semibold text-foreground mb-4">7-Day Calorie Breakdown</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyCalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar dataKey="protein" stackId="a" fill="hsl(147, 35%, 49%)" radius={[0,0,0,0]} />
                    <Bar dataKey="carbs" stackId="a" fill="hsl(36, 78%, 56%)" radius={[0,0,0,0]} />
                    <Bar dataKey="fat" stackId="a" fill="hsl(214, 56%, 57%)" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-serif text-sm font-semibold text-foreground mb-4">Mood vs. Protein Intake</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="protein" name="Protein (g)" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="mood" name="Mood" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <ZAxis dataKey="z" range={[60, 60]} />
                    <Tooltip />
                    <Scatter data={moodData} fill="hsl(147, 35%, 49%)" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "Correlations" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {correlations.map((c, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6 flex items-start gap-4" style={{ borderLeft: `4px solid ${c.color}` }}>
              <span className="text-2xl">{c.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-sans text-foreground">{c.text}</p>
                <button className="text-xs text-secondary font-sans font-medium mt-2 hover:underline">See detail →</button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {(activeTab === "Monthly" || activeTab === "Trends") && (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground font-sans text-sm">{activeTab} — Coming soon</p>
        </div>
      )}
    </div>
  );
};

export default Insights;
