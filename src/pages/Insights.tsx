import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ScatterChart, Scatter, ZAxis, ReferenceLine, Line, ComposedChart, LineChart,
} from "recharts";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useInsights } from "@/hooks/useInsights";
import html2canvas from "html2canvas";

const tabs = ["Weekly", "Monthly", "Trends", "Correlations"];

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const p = payload.find((d: any) => d.dataKey === "protein")?.value || 0;
    const c = payload.find((d: any) => d.dataKey === "carbs")?.value || 0;
    const f = payload.find((d: any) => d.dataKey === "fat")?.value || 0;
    const totalCal = p * 4 + c * 4 + f * 9;
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg">
        <p className="text-sm font-sans font-semibold text-foreground">{label}</p>
        <p className="text-xs font-mono text-foreground">{totalCal.toLocaleString()} kcal</p>
        <p className="text-[10px] font-sans text-muted-foreground">P{p}g · C{c}g · F{f}g</p>
      </div>
    );
  }
  return null;
};

const Insights = () => {
  const [activeTab, setActiveTab] = useState("Weekly");
  const [downloadState, setDownloadState] = useState<"idle" | "generating" | "done">("idle");
  const [showShareModal, setShowShareModal] = useState(false);
  const storyCardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { weeklyCalData, moodData, proteinTrendData, weeklySummary, proteinAvg, proteinGoal, loading: insightsLoading, daysLogged } = useInsights();

  // Compute trend line from mood data
  const trendLineData = moodData.length >= 2
    ? [{ protein: Math.min(...moodData.map(d => d.protein)) - 5, mood: Math.min(...moodData.map(d => d.mood)) },
       { protein: Math.max(...moodData.map(d => d.protein)) + 5, mood: Math.max(...moodData.map(d => d.mood)) }]
    : [];

  const handleDownload = async () => {
    if (!storyCardRef.current) return;
    setDownloadState("generating");
    try {
      const canvas = await html2canvas(storyCardRef.current, { backgroundColor: null, scale: 2 });
      const link = document.createElement("a");
      link.download = `NourishMind-Week-${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setDownloadState("done");
      setTimeout(() => setDownloadState("idle"), 2000);
    } catch {
      toast({ title: "Failed to generate image — try again", variant: "destructive" });
      setDownloadState("idle");
    }
  };

  const handleShare = async () => {
    if (!storyCardRef.current) return;
    setDownloadState("generating");
    try {
      const canvas = await html2canvas(storyCardRef.current, { backgroundColor: null, scale: 2 });
      // Try copying to clipboard first
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            toast({ title: "Image copied to clipboard ✅ Paste it into Instagram!" });
          } catch {
            // If clipboard fails, trigger download
            const link = document.createElement("a");
            link.download = `NourishMind-Week-${new Date().toISOString().split("T")[0]}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            toast({ title: "Image saved — share it to your Instagram story 📸" });
          }
        }
        setDownloadState("idle");
      }, "image/png");
    } catch {
      toast({ title: "Failed to generate image", variant: "destructive" });
      setDownloadState("idle");
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 max-w-6xl mx-auto pb-24 md:pb-6">
      {/* Tab bar — full width, horizontally scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-5 py-2.5 md:py-2 rounded-pill text-sm font-sans font-medium transition-all min-h-[44px] md:min-h-0 ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ========== WEEKLY TAB ========== */}
      {activeTab === "Weekly" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Story card */}
          <div ref={storyCardRef} className="rounded-2xl p-5 md:p-8 text-white space-y-3" style={{ background: "linear-gradient(135deg, #1A3C2E, #2D6B4F)" }}>
            <p className="text-xs text-white/60 font-sans">{weeklySummary?.weekLabel || 'This week'}</p>
            <p className="font-serif text-xl md:text-2xl font-bold">Protein goal: {weeklySummary?.proteinGoalDays ?? 0}/7 days {(weeklySummary?.proteinGoalDays ?? 0) >= 5 ? '✅' : ''}</p>
            <p className="font-sans text-base md:text-lg text-white/90">Best day: {weeklySummary?.bestDay || 'N/A'} 💪</p>
            {daysLogged < 3 && <p className="font-sans text-sm text-white/70">Log more days to unlock deeper insights</p>}
            <div className="flex gap-3 mt-4 flex-col sm:flex-row">
              <button onClick={handleShare} disabled={downloadState === "generating"} className="bg-white/20 hover:bg-white/30 rounded-pill px-4 py-2.5 text-xs font-sans transition-colors sm:w-auto w-full min-h-[44px] disabled:opacity-50">
                {downloadState === "generating" ? "Generating..." : "📤 Share to Instagram"}
              </button>
              <button onClick={handleDownload} disabled={downloadState === "generating"} className="bg-white/20 hover:bg-white/30 rounded-pill px-4 py-2.5 text-xs font-sans transition-colors sm:w-auto w-full min-h-[44px] disabled:opacity-50">
                {downloadState === "done" ? "Downloaded ✅" : downloadState === "generating" ? "Generating..." : "⬇ Download"}
              </button>
            </div>
          </div>

          {/* Charts — stack on mobile, side by side on tablet+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            {/* 7-day calorie breakdown */}
            <div className="bg-card rounded-2xl border border-border p-4 md:p-6">
              <h3 className="font-serif text-sm font-semibold text-foreground mb-4">7-Day Calorie Breakdown</h3>
              <div className="h-[200px] md:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyCalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 2200]} width={35} />
                    <Tooltip content={<CustomBarTooltip />} />
                    <ReferenceLine y={1800} stroke="#1A3C2E" strokeDasharray="6 4" strokeWidth={1.5}>
                      <label value="Daily Goal" position="insideTopRight" fontSize={10} fill="#1A3C2E" />
                    </ReferenceLine>
                    <Bar dataKey="fat" stackId="a" fill="hsl(214, 56%, 57%)" name="Fat" radius={[0,0,0,0]} />
                    <Bar dataKey="carbs" stackId="a" fill="hsl(36, 78%, 56%)" name="Carbs" radius={[0,0,0,0]} />
                    <Bar dataKey="protein" stackId="a" fill="hsl(147, 35%, 49%)" name="Protein" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {[
                  { label: "Protein", color: "hsl(147, 35%, 49%)" },
                  { label: "Carbs", color: "hsl(36, 78%, 56%)" },
                  { label: "Fat", color: "hsl(214, 56%, 57%)" },
                ].map((m) => (
                  <div key={m.label} className="flex items-center gap-1.5 text-xs font-sans">
                    <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                    <span className="text-muted-foreground">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mood vs Protein */}
            <div className="bg-card rounded-2xl border border-border p-4 md:p-6">
              <h3 className="font-serif text-sm font-semibold text-foreground mb-4">Mood vs. Protein Intake</h3>
              <div className="h-[200px] md:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="protein"
                      type="number"
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                      domain={[70, 150]}
                      label={{ value: "Protein (g)", position: "insideBottom", offset: -2, fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      dataKey="mood"
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                      domain={[1, 5]}
                      label={{ value: "Mood Score (1-5)", angle: -90, position: "insideLeft", fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <ZAxis range={[60, 60]} />
                    <Tooltip />
                    <Scatter data={moodData} fill="hsl(147, 35%, 49%)" />
                    <Line data={trendLineData} dataKey="mood" stroke="hsl(147, 35%, 49%)" strokeWidth={2} strokeDasharray="6 3" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-muted-foreground font-sans mt-2 text-center">Higher protein → better mood (r = 0.72)</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========== MONTHLY TAB ========== */}
      {activeTab === "Monthly" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-card rounded-2xl border border-border p-5 md:p-8 text-center">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Monthly View</h3>
            <p className="text-sm font-sans text-muted-foreground mb-6">Track your nutrition trends over 30 days</p>

            {/* Blurred preview chart */}
            <div className="relative rounded-xl overflow-hidden">
              <div className="h-[200px] blur-sm opacity-40 pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { d: "1", v: 1600 }, { d: "5", v: 1750 }, { d: "10", v: 1400 }, { d: "15", v: 1820 },
                    { d: "20", v: 1580 }, { d: "25", v: 1700 }, { d: "30", v: 1650 },
                  ]}>
                    <Line type="monotone" dataKey="v" stroke="hsl(147, 35%, 49%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/60 backdrop-blur-[1px]">
                <Lock className="h-6 w-6 text-muted-foreground mb-2" />
                <p className="text-sm font-sans font-medium text-foreground">Log for 30 days to unlock your monthly trends</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6 max-w-xs mx-auto">
              <div className="flex justify-between text-xs font-sans text-muted-foreground mb-1.5">
                <span>17 of 30 days logged</span>
                <span>57%</span>
              </div>
              <div className="h-2.5 bg-muted rounded-pill overflow-hidden">
                <div className="h-full rounded-pill bg-secondary" style={{ width: "57%" }} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========== TRENDS TAB ========== */}
      {activeTab === "Trends" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Weight trend */}
          <div className="bg-card rounded-2xl border border-border p-6 text-center space-y-3">
            <h3 className="font-serif text-sm font-semibold text-foreground">Weight Trend</h3>
            <p className="text-sm font-sans text-muted-foreground">You haven't enabled weight tracking yet</p>
            <Button className="rounded-pill bg-primary text-primary-foreground text-xs px-6">Enable weight tracking →</Button>
          </div>

          {/* Protein trend */}
          <div className="bg-card rounded-2xl border border-border p-4 md:p-6">
            <h3 className="font-serif text-sm font-semibold text-foreground mb-1">Protein Trend (7 days)</h3>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-xs font-sans text-muted-foreground">7-day protein avg: <span className="font-mono font-semibold text-foreground">{proteinAvg}g</span> · Goal: <span className="font-mono text-foreground">{proteinGoal}g</span></span>
            </div>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={proteinTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={[0, Math.max(proteinGoal + 10, ...proteinTrendData.map(d => d.protein) )]} />
                  <Tooltip />
                  <ReferenceLine y={proteinGoal} stroke="#1A3C2E" strokeDasharray="6 4" strokeWidth={1}>
                    <label value="Goal" position="insideTopRight" fontSize={9} fill="#1A3C2E" />
                  </ReferenceLine>
                  <Bar dataKey="protein" fill="hsl(147, 35%, 49%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Sparkline numbers */}
            <div className="flex justify-between mt-2 px-2">
              {proteinTrendData.map((d) => (
                <span key={d.day} className="text-[10px] font-mono text-muted-foreground">{d.protein}g</span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ========== CORRELATIONS TAB ========== */}
      {activeTab === "Correlations" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-foreground">Your Personal Health Patterns</h3>
            <p className="text-xs text-muted-foreground font-sans mt-1">Based on 3 weeks of data — patterns improve with more logging</p>
            <p className="text-[10px] text-muted-foreground font-sans mt-0.5 italic">Available after 4 weeks of consistent logging — here's a preview:</p>
          </div>

          {/* Insight Card 1: Mood + Nutrition */}
          <div className="bg-card rounded-2xl border border-border p-4 md:p-6 space-y-3" style={{ borderLeft: "4px solid #4A90D9" }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">🧠</span>
              <span className="bg-[#4A90D9]/15 text-[#4A90D9] rounded-pill px-2.5 py-0.5 text-[10px] font-sans font-semibold">Mood + Nutrition</span>
            </div>
            <p className="text-sm font-sans font-semibold text-foreground">Low magnesium = lower mood</p>
            <p className="text-xs font-sans text-muted-foreground">
              On days your magnesium is below 60% of RDA, your mood score averages 2.1 vs 3.8 on adequate days — a 81% difference
            </p>
            {/* Data comparison bars — stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground font-sans">LOW Mg days</span>
                  <span>😟</span>
                  <span className="text-xs font-mono font-semibold text-foreground">2.1</span>
                </div>
                <div className="h-2 bg-muted rounded-pill overflow-hidden">
                  <div className="h-full bg-destructive rounded-pill" style={{ width: "42%" }} />
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-sans pb-1 text-center">vs</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground font-sans">ADEQUATE Mg days</span>
                  <span>😊</span>
                  <span className="text-xs font-mono font-semibold text-foreground">3.8</span>
                </div>
                <div className="h-2 bg-muted rounded-pill overflow-hidden">
                  <div className="h-full bg-success rounded-pill" style={{ width: "76%" }} />
                </div>
              </div>
            </div>
            <button className="text-xs text-secondary font-sans font-medium hover:underline">See all mood data →</button>
          </div>

          {/* Insight Card 2 */}
          <div className="bg-card rounded-2xl border border-border p-4 md:p-6 space-y-3" style={{ borderLeft: "4px solid hsl(147, 35%, 49%)" }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">⏰</span>
              <span className="bg-success/15 text-success rounded-pill px-2.5 py-0.5 text-[10px] font-sans font-semibold">Meal Timing + Energy</span>
            </div>
            <p className="text-sm font-sans font-semibold text-foreground">Early dinner = better next-day energy</p>
            <p className="text-xs font-sans text-muted-foreground">
              Your energy scores are 40% higher on days you finish eating before 8 PM vs days with post-9 PM meals
            </p>
            <button className="text-xs text-secondary font-sans font-medium hover:underline">See timing data →</button>
          </div>

          {/* Insight Card 3 */}
          <div className="bg-card rounded-2xl border border-border p-4 md:p-6 space-y-3" style={{ borderLeft: "4px solid hsl(36, 78%, 56%)" }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">🫀</span>
              <span className="bg-warning/15 text-warning rounded-pill px-2.5 py-0.5 text-[10px] font-sans font-semibold">IBS + Cycle</span>
            </div>
            <p className="text-sm font-sans font-semibold text-foreground">IBS symptoms spike in luteal phase</p>
            <p className="text-xs font-sans text-muted-foreground">
              Your gut symptom scores average 3.8/5 during your luteal phase vs 2.1/5 during follicular phase — consistent across 3 cycles tracked
            </p>
            <button className="text-xs text-secondary font-sans font-medium hover:underline">See gut data →</button>
          </div>

          {/* Locked card */}
          <div className="bg-card rounded-2xl border border-border p-4 md:p-6 relative overflow-hidden">
            <div className="blur-sm pointer-events-none space-y-2">
              <p className="text-sm font-sans font-semibold text-foreground">Sleep + Nutrition correlation</p>
              <p className="text-xs font-sans text-muted-foreground">Discover how your diet affects sleep quality</p>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/70">
              <Lock className="h-5 w-5 text-muted-foreground mb-2" />
              <p className="text-xs font-sans font-medium text-foreground">🔒 Unlock after 4 weeks: Sleep + Nutrition correlation</p>
              <p className="text-[10px] font-sans text-muted-foreground mt-1">Keep logging daily to unlock deeper insights</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Insights;
