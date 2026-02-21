import { motion } from "framer-motion";
import {
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";

const bloodSugarData = [
  { time: "6AM", level: 20 }, { time: "7AM", level: 22 },
  { time: "8AM", level: 45 }, { time: "9AM", level: 72 },
  { time: "10AM", level: 55 }, { time: "11AM", level: 38 },
  { time: "12PM", level: 35 }, { time: "1PM", level: 68 },
  { time: "2PM", level: 80 }, { time: "3PM", level: 58 },
  { time: "4PM", level: 42 }, { time: "4:30PM", level: 65 },
  { time: "5PM", level: 70 }, { time: "6PM", level: 50 },
  { time: "7PM", level: 40 }, { time: "8PM", level: 35 },
  { time: "9PM", level: 28 }, { time: "10PM", level: 22 },
];

const macroData = [
  { name: "Protein", value: 89, color: "hsl(147, 35%, 49%)" },
  { name: "Carbs", value: 162, color: "hsl(36, 78%, 56%)" },
  { name: "Fat", value: 54, color: "hsl(214, 56%, 57%)" },
];

const microNutrients = [
  { name: "Iron", pct: 65, status: "⚠️" },
  { name: "Calcium", pct: 82, status: "✅" },
  { name: "Magnesium", pct: 48, status: "🔴" },
  { name: "Potassium", pct: 79, status: "🟡" },
  { name: "Sodium", pct: 91, status: "✅" },
  { name: "B12", pct: 53, status: "🔴" },
  { name: "Vitamin D", pct: 22, status: "🔴" },
  { name: "Zinc", pct: 61, status: "🟡" },
  { name: "Folate", pct: 71, status: "🟡" },
  { name: "Water", pct: 63, status: "🟡" },
];

const Dashboard = () => {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Card */}
      <motion.div
        className="rounded-2xl p-8 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #1A3C2E, #2D6B4F)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-2">
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-white">Good evening, Rameshta ✨</h1>
          <p className="text-white/80 font-sans text-sm">You've eaten 1,420 of 1,800 kcal today</p>
          <div className="w-64 h-2 bg-white/20 rounded-pill mt-3">
            <div className="h-full bg-white rounded-pill" style={{ width: "78%" }} />
          </div>
        </div>
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="6"
              strokeDasharray={`${(78/100)*263.9} 263.9`} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-mono font-bold text-white">78</span>
        </div>
      </motion.div>

      {/* Row 1 */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Calorie Ring */}
        <div className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center">
          <h3 className="font-serif text-sm font-semibold text-foreground mb-4">Calories</h3>
          <div className="relative w-[160px] h-[160px]">
            <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
              <circle cx="80" cy="80" r="68" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
              <circle cx="80" cy="80" r="68" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8"
                strokeDasharray={`${(1420/1800)*427.3} 427.3`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-mono font-bold text-foreground">1,420</span>
              <span className="text-xs text-muted-foreground font-sans">kcal</span>
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-xs font-mono text-muted-foreground">
            <span>P 89g</span><span>C 162g</span><span>F 54g</span>
          </div>
        </div>

        {/* Macro Donut */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-serif text-sm font-semibold text-foreground mb-4">Macro Split</h3>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={macroData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {macroData.map((m, i) => <Cell key={i} fill={m.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {macroData.map((m) => (
              <div key={m.name} className="flex items-center gap-1.5 text-xs font-sans">
                <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                <span className="text-muted-foreground">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Meal Timing */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-serif text-sm font-semibold text-foreground mb-4">Meal Timing</h3>
          <div className="relative h-[160px] flex items-end">
            <div className="absolute bottom-8 left-0 right-0 h-px bg-border" />
            {[
              { time: "8:42 AM", label: "Breakfast", left: "20%" },
              { time: "1:15 PM", label: "Lunch", left: "50%" },
              { time: "4:30 PM", label: "Snack", left: "72%" },
            ].map((meal) => (
              <div key={meal.time} className="absolute bottom-4 flex flex-col items-center" style={{ left: meal.left }}>
                <span className="text-[9px] text-muted-foreground font-sans mb-1">{meal.label}</span>
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-[9px] text-muted-foreground font-sans mt-1">{meal.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid md:grid-cols-5 gap-6">
        {/* Micronutrient Tracker */}
        <div className="md:col-span-3 bg-card rounded-2xl border border-border p-6">
          <h3 className="font-serif text-sm font-semibold text-foreground mb-4">Micronutrients Today</h3>
          <div className="space-y-2.5">
            {microNutrients.map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <span className="w-20 text-xs font-sans text-foreground">{m.name}</span>
                <div className="flex-1 h-2 bg-muted rounded-pill overflow-hidden">
                  <div className="h-full rounded-pill transition-all" style={{
                    width: `${m.pct}%`,
                    background: m.pct >= 80 ? "hsl(var(--success))" : m.pct >= 50 ? "hsl(var(--warning))" : "hsl(var(--destructive))",
                  }} />
                </div>
                <span className="text-xs font-mono w-10 text-right text-muted-foreground">{m.pct}%</span>
                <span className="text-xs">{m.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Blood Sugar */}
        <div className="md:col-span-2 bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-sm font-semibold text-foreground">Blood Sugar Simulation</h3>
          </div>
          <p className="text-[10px] text-muted-foreground font-sans mb-3">Simulated — not medical advice</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bloodSugarData}>
                <defs>
                  <linearGradient id="bsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(147, 35%, 49%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(147, 35%, 49%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Area type="monotone" dataKey="level" stroke="hsl(147, 35%, 49%)" fill="url(#bsGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: End of Day Recap */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-serif text-base font-semibold text-foreground mb-6">End of Day Recap</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="font-sans text-sm font-semibold text-secondary">What you did well ✅</h4>
            <ul className="space-y-2 text-sm font-sans text-foreground">
              <li>• Hit protein goal</li><li>• 2.1L water</li><li>• 14hr fast</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-sans text-sm font-semibold text-warning">What to improve 📈</h4>
            <ul className="space-y-2 text-sm font-sans text-foreground">
              <li>• Low Vitamin D</li><li>• Magnesium gap</li><li>• Late dinner</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-sans text-sm font-semibold text-primary">Tomorrow's priority 🎯</h4>
            <ul className="space-y-2 text-sm font-sans text-foreground">
              <li>• Add eggs for B12</li><li>• Morning sunlight</li><li>• Sleep by 11PM</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
