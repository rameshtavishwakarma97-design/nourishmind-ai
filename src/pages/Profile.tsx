import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSupplements } from "@/hooks/useSupplements";
import { useExceptions } from "@/hooks/useExceptions";
import { useCycleTracking } from "@/hooks/useCycleTracking";
import { Loader2 } from "lucide-react";

const healthConditionsList = [
  { icon: "🫀", label: "IBS / Gut Issues" },
  { icon: "😰", label: "Anxiety / Depression" },
  { icon: "🔵", label: "PCOS / Hormonal" },
  { icon: "🩸", label: "Diabetes / Pre-diabetes" },
  { icon: "❤️", label: "Hypertension" },
  { icon: "🦋", label: "Thyroid Issues" },
  { icon: "⚡", label: "Iron Deficiency Anaemia" },
  { icon: "🤱", label: "Post-partum / Breastfeeding" },
];

const suggestionChips = ["Hostel student", "Night shift", "Frequent traveler", "Religious fasts", "WFH"];

const Profile = () => {
  const [activeSection, setActiveSection] = useState("Personal Info");
  const { toast } = useToast();

  // Hooks
  const { profile, loading: profileLoading, saving: profileSaving, updateProfile, fetchAiSummary, aiSummary } = useUserProfile();
  const { supplements, loading: suppLoading, saving: suppSaving, add: addSupplement, remove: removeSupplement } = useSupplements();
  const { exceptions, loading: excLoading, remove: removeException, add: addException } = useExceptions();
  const { cycle, saving: cycleSaving, upsert: upsertCycle, getCurrentPhase } = useCycleTracking();

  // Local state mirrors DB — synced on profile load
  const [personalInfo, setPersonalInfo] = useState({
    full_name: "", age: "", biological_sex: "", height_cm: "", weight_kg: "",
  });
  const [conditions, setConditions] = useState<Record<string, boolean>>({});
  const [context, setContext] = useState("");
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [customCondition, setCustomCondition] = useState("");

  // Supplement add form
  const [showAddSupp, setShowAddSupp] = useState(false);
  const [newSupp, setNewSupp] = useState({ name: "", type: "supplement" as const, dose_amount: "", dose_unit: "mg", frequency: "Daily", time_of_day: "morning" as const, with_food: true });

  // Exception add form
  const [showAddException, setShowAddException] = useState(false);
  const [newException, setNewException] = useState({ exception_type: "", original_value: "", modified_value: "", reason: "" });

  // Cycle tracking forms
  const [cycleSetup, setCycleSetup] = useState({ last_period_start: "", cycle_length_days: 28, period_duration_days: 5 });
  const [showLogPeriod, setShowLogPeriod] = useState(false);
  const [newPeriodDate, setNewPeriodDate] = useState("");
  const [showResetCycle, setShowResetCycle] = useState(false);

  // Sync local state from DB
  useEffect(() => {
    if (!profile) return;
    setPersonalInfo({
      full_name: profile.full_name || "",
      age: profile.age?.toString() || "",
      biological_sex: profile.biological_sex || "",
      height_cm: profile.height_cm?.toString() || "",
      weight_kg: profile.weight_kg?.toString() || "",
    });
    // Health conditions
    const condMap: Record<string, boolean> = {};
    healthConditionsList.forEach(c => {
      condMap[c.label] = profile.health_conditions?.includes(c.label) ?? false;
    });
    setConditions(condMap);
    setContext(profile.ai_context_field || "");
  }, [profile]);

  // Fetch AI summary on mount
  useEffect(() => { fetchAiSummary(); }, [fetchAiSummary]);

  const phaseInfo = getCurrentPhase();

  const subNavItems = [
    "Personal Info", "Health Conditions", "Supplements & Meds",
    ...(profile?.biological_sex === "female" ? ["Cycle Tracking"] : []),
    "My Exceptions", "AI Context", "Privacy",
  ];

  if (profileLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sub-nav — desktop sidebar */}
      <div className="hidden md:block w-[220px] border-r border-border bg-card p-4 space-y-1 shrink-0">
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

      {/* Mobile horizontal chip nav */}
      <div className="md:hidden overflow-x-auto scrollbar-hide border-b border-border bg-card px-4 py-3 flex gap-2 shrink-0">
        {subNavItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveSection(item)}
            className={`shrink-0 px-4 py-2 rounded-pill text-sm font-sans font-medium transition-all min-h-[40px] ${
              activeSection === item
                ? "bg-primary text-primary-foreground"
                : "border border-border text-primary hover:bg-muted"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-3xl space-y-6 md:space-y-8 pb-24 md:pb-8">
        {/* ========== AI Context ========== */}
        {activeSection === "AI Context" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {aiSummary && (
              <div className="bg-surface-elevated rounded-2xl p-4 md:p-6 border border-accent">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-bold text-foreground">What I know about you</h3>
                </div>
                <p className="text-sm font-sans text-foreground whitespace-pre-wrap">{aiSummary}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-sans font-semibold text-foreground">Things You Want AI to Know</label>
                <p className="text-xs text-muted-foreground font-sans mt-1">Your open context field</p>
              </div>
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-[100px] md:min-h-[120px] rounded-xl border-border font-sans text-base md:text-sm"
              />
              <div className="flex gap-2 flex-wrap">
                {suggestionChips.map((chip) => (
                  <button key={chip} onClick={() => setContext(prev => prev ? `${prev}\n${chip}` : chip)} className="bg-muted rounded-pill px-3 py-1 text-xs font-sans text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                    {chip}
                  </button>
                ))}
              </div>
              <Button
                disabled={profileSaving}
                onClick={async () => {
                  const res = await updateProfile({ ai_context_field: context.trim() || null });
                  toast({ title: res.success ? "Context saved successfully ✅" : `Error: ${res.error}` });
                }}
                className="rounded-pill bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              >
                {profileSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Context
              </Button>
            </div>
          </motion.div>
        )}

        {/* ========== Personal Info ========== */}
        {activeSection === "Personal Info" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground">Personal Information</h3>
              <p className="text-xs text-muted-foreground font-sans mt-1">Basic details for personalized recommendations</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-4 md:p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-sans font-medium text-muted-foreground">Full Name</label>
                  <Input value={personalInfo.full_name} onChange={(e) => setPersonalInfo({ ...personalInfo, full_name: e.target.value })} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-sans font-medium text-muted-foreground">Age</label>
                  <Input type="number" value={personalInfo.age} onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-sans font-medium text-muted-foreground">Biological Sex</label>
                  <div className="flex gap-2">
                    {(["male", "female", "prefer_not_to_say"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPersonalInfo({ ...personalInfo, biological_sex: s })}
                        className={`flex-1 h-10 rounded-xl border-2 text-xs font-sans font-medium transition-all ${
                          personalInfo.biological_sex === s ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-secondary"
                        }`}
                      >
                        {s === "prefer_not_to_say" ? "Other" : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-sans font-medium text-muted-foreground">Height (cm)</label>
                  <Input type="number" value={personalInfo.height_cm} onChange={(e) => setPersonalInfo({ ...personalInfo, height_cm: e.target.value })} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-sans font-medium text-muted-foreground">Weight (kg)</label>
                  <Input type="number" value={personalInfo.weight_kg} onChange={(e) => setPersonalInfo({ ...personalInfo, weight_kg: e.target.value })} className="rounded-xl" />
                </div>
              </div>
              <Button
                disabled={profileSaving}
                onClick={async () => {
                  const res = await updateProfile({
                    full_name: personalInfo.full_name || null,
                    age: personalInfo.age ? parseInt(personalInfo.age) : null,
                    biological_sex: personalInfo.biological_sex || null,
                    height_cm: personalInfo.height_cm ? parseFloat(personalInfo.height_cm) : null,
                    weight_kg: personalInfo.weight_kg ? parseFloat(personalInfo.weight_kg) : null,
                  });
                  toast({ title: res.success ? "Personal info saved ✅" : `Error: ${res.error}` });
                }}
                className="rounded-pill bg-primary text-primary-foreground px-8 w-full"
              >
                {profileSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </div>
          </motion.div>
        )}

        {/* ========== Health Conditions ========== */}
        {activeSection === "Health Conditions" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground">Your Health Conditions</h3>
              <p className="text-xs text-muted-foreground font-sans mt-1">This helps us personalize your dashboard and recommendations</p>
            </div>

            {/* Condition toggle grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {healthConditionsList.map((c) => {
                const isOn = conditions[c.label] ?? false;
                return (
                  <button
                    key={c.label}
                    onClick={() => setConditions((p) => ({ ...p, [c.label]: !p[c.label] }))}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all text-left min-h-[56px] ${
                      isOn ? "border-success bg-success/10" : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    <span className="text-lg">{c.icon}</span>
                    <span className="flex-1 text-sm font-sans font-medium text-foreground">{c.label}</span>
                    <div className={`w-10 h-5 rounded-pill relative transition-colors ${isOn ? "bg-success" : "bg-muted"}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isOn ? "left-[22px]" : "left-0.5"}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Add condition */}
            {showAddCondition ? (
              <div className="flex gap-2">
                <Input value={customCondition} onChange={(e) => setCustomCondition(e.target.value)} placeholder="Type your condition..." className="rounded-xl flex-1" />
                <Button size="sm" className="rounded-pill" onClick={() => {
                  if (customCondition.trim()) setConditions(p => ({ ...p, [customCondition.trim()]: true }));
                  setShowAddCondition(false);
                  setCustomCondition("");
                }}>Add</Button>
              </div>
            ) : (
              <button onClick={() => setShowAddCondition(true)} className="text-sm font-sans text-secondary font-medium hover:underline">
                + Add a condition not listed
              </button>
            )}

            <Button
              disabled={profileSaving}
              onClick={async () => {
                const active = Object.entries(conditions).filter(([, v]) => v).map(([k]) => k);
                const res = await updateProfile({ health_conditions: active.length > 0 ? active : null });
                toast({ title: res.success ? "Health conditions saved ✅" : `Error: ${res.error}` });
              }}
              className="rounded-pill bg-primary text-primary-foreground px-8 w-full"
            >
              {profileSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </motion.div>
        )}

        {/* ========== Supplements & Meds ========== */}
        {activeSection === "Supplements & Meds" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground">Your Supplements & Medications</h3>
            </div>

            {suppLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="space-y-3">
                {supplements.map((s) => (
                  <div key={s.id} className="bg-card rounded-2xl border border-border p-4 md:p-5 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <span className="text-2xl">{s.type === 'medication' ? '💊' : s.type === 'ayurvedic' ? '🌿' : '💊'}</span>
                    <div className="flex-1">
                      <p className="text-sm font-sans font-semibold text-foreground">{s.name}</p>
                      <p className="text-xs font-sans text-muted-foreground mt-0.5">
                        {s.dose_amount}{s.dose_unit} · {s.frequency} · {s.time_of_day?.replace('_', ' ')}
                        {s.with_food ? ' · with food' : ''}
                      </p>
                    </div>
                    <Button
                      variant="ghost" size="sm"
                      disabled={suppSaving}
                      className="text-xs rounded-pill text-destructive hover:text-destructive min-h-[44px] md:min-h-0"
                      onClick={async () => {
                        await removeSupplement(s.id);
                        toast({ title: "Supplement removed" });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                {supplements.length === 0 && !showAddSupp && (
                  <div className="bg-card rounded-2xl border border-border p-8 text-center">
                    <p className="text-sm font-sans text-muted-foreground">No supplements or medications added yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Add supplement form */}
            {showAddSupp ? (
              <div className="bg-card rounded-2xl border border-border p-4 md:p-5 space-y-4">
                <p className="text-sm font-sans font-semibold text-foreground">Add Supplement / Medication</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input placeholder="Name (e.g. Vitamin D3)" value={newSupp.name} onChange={e => setNewSupp(p => ({ ...p, name: e.target.value }))} className="rounded-xl" />
                  <div className="flex gap-2">
                    <Input type="number" placeholder="Dose" value={newSupp.dose_amount} onChange={e => setNewSupp(p => ({ ...p, dose_amount: e.target.value }))} className="rounded-xl flex-1" />
                    <select value={newSupp.dose_unit} onChange={e => setNewSupp(p => ({ ...p, dose_unit: e.target.value }))} className="rounded-xl border border-border px-2 text-sm bg-card">
                      <option value="mg">mg</option><option value="mcg">mcg</option><option value="IU">IU</option><option value="g">g</option><option value="ml">ml</option>
                    </select>
                  </div>
                  <select value={newSupp.type} onChange={e => setNewSupp(p => ({ ...p, type: e.target.value as 'supplement' | 'medication' | 'ayurvedic' }))} className="rounded-xl border border-border px-3 py-2 text-sm bg-card">
                    <option value="supplement">Supplement</option><option value="medication">Medication</option><option value="ayurvedic">Ayurvedic</option>
                  </select>
                  <select value={newSupp.time_of_day} onChange={e => setNewSupp(p => ({ ...p, time_of_day: e.target.value as 'morning' | 'afternoon' | 'evening' | 'night' | 'with_meal' }))} className="rounded-xl border border-border px-3 py-2 text-sm bg-card">
                    <option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option><option value="night">Night</option><option value="with_meal">With meal</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={!newSupp.name.trim() || suppSaving}
                    className="rounded-pill"
                    onClick={async () => {
                      await addSupplement({
                        name: newSupp.name.trim(),
                        type: newSupp.type,
                        dose_amount: newSupp.dose_amount ? parseFloat(newSupp.dose_amount) : null,
                        dose_unit: newSupp.dose_unit,
                        frequency: newSupp.frequency,
                        time_of_day: newSupp.time_of_day,
                        with_food: newSupp.with_food,
                      });
                      setNewSupp({ name: "", type: "supplement", dose_amount: "", dose_unit: "mg", frequency: "Daily", time_of_day: "morning", with_food: true });
                      setShowAddSupp(false);
                      toast({ title: "Supplement added ✅" });
                    }}
                  >
                    {suppSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Save
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-pill" onClick={() => setShowAddSupp(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddSupp(true)} className="w-full border-2 border-dashed border-border rounded-2xl py-4 text-sm font-sans text-muted-foreground hover:border-secondary hover:text-secondary transition-colors">
                + Add Supplement or Medication
              </button>
            )}
          </motion.div>
        )}

        {/* ========== Cycle Tracking ========== */}
        {activeSection === "Cycle Tracking" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-bold text-foreground">Menstrual Cycle Tracking</h3>
              <span className="text-xs text-muted-foreground font-sans">(Optional)</span>
            </div>

            {!cycle?.tracking_enabled ? (
              <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                <div className="text-center space-y-2">
                  <span className="text-4xl block">🌸</span>
                  <p className="text-sm font-sans text-foreground max-w-sm mx-auto">
                    Track your cycle to get phase-based nutrition and workout recommendations, plus IBS-cycle correlation insights
                  </p>
                </div>
                {/* Setup form */}
                <div className="space-y-3 max-w-sm mx-auto">
                  <div>
                    <label className="text-xs font-sans text-muted-foreground mb-1 block">When did your last period start?</label>
                    <input type="date" className="w-full border border-border rounded-lg px-3 py-2 text-sm font-sans bg-background" value={cycleSetup.last_period_start} onChange={e => setCycleSetup(p => ({ ...p, last_period_start: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-sans text-muted-foreground mb-1 block">Average cycle length (days)</label>
                      <input type="number" className="w-full border border-border rounded-lg px-3 py-2 text-sm font-sans bg-background" value={cycleSetup.cycle_length_days} onChange={e => setCycleSetup(p => ({ ...p, cycle_length_days: +e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs font-sans text-muted-foreground mb-1 block">Period duration (days)</label>
                      <input type="number" className="w-full border border-border rounded-lg px-3 py-2 text-sm font-sans bg-background" value={cycleSetup.period_duration_days} onChange={e => setCycleSetup(p => ({ ...p, period_duration_days: +e.target.value }))} />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Button
                    disabled={cycleSaving || !cycleSetup.last_period_start}
                    onClick={async () => {
                      await upsertCycle({
                        tracking_enabled: true,
                        last_period_start: cycleSetup.last_period_start,
                        cycle_length_days: cycleSetup.cycle_length_days,
                        period_duration_days: cycleSetup.period_duration_days,
                      });
                      toast({ title: "Cycle tracking enabled ✅" });
                    }}
                    className="rounded-pill bg-primary text-primary-foreground px-8"
                  >
                    {cycleSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Start Tracking
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Current phase */}
                {phaseInfo && (
                  <>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="rounded-pill px-4 py-2 text-sm font-sans font-semibold" style={{ background: "#EDE7F6", color: "#7E57C2" }}>
                        🌸 {phaseInfo.phase} Phase · Day {phaseInfo.day}
                      </span>
                      <span className="text-xs text-muted-foreground font-sans">{phaseInfo.daysUntilNext} day(s) until next phase</span>
                    </div>

                    <div className="rounded-xl p-4 border border-success/30 bg-success/5">
                      <p className="text-sm font-sans text-foreground">
                        {phaseInfo.phase === 'Luteal' && "During your luteal phase: increase magnesium and complex carbs, reduce caffeine and sodium to reduce bloating."}
                        {phaseInfo.phase === 'Follicular' && "During your follicular phase: focus on iron-rich foods and lighter meals to boost energy."}
                        {phaseInfo.phase === 'Ovulation' && "During ovulation: your metabolism peaks — good time for higher-intensity workouts and higher protein intake."}
                        {phaseInfo.phase === 'Menstrual' && "During menstruation: prioritize iron, vitamin C, and warm, easily digestible foods. Rest is important."}
                      </p>
                    </div>
                  </>
                )}

                {/* Phase timeline */}
                <div className="bg-card rounded-2xl border border-border p-4 md:p-6">
                  <p className="text-xs font-sans font-medium text-muted-foreground mb-4">Cycle Timeline</p>
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex items-center justify-between relative min-w-[300px]">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
                      {["Menstrual", "Follicular", "Ovulation", "Luteal"].map((phase) => (
                        <div key={phase} className="relative flex flex-col items-center z-10">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            phaseInfo?.phase === phase ? "bg-success border-success" : "bg-card border-border"
                          }`} />
                          <span className={`text-[10px] font-sans mt-1.5 ${phaseInfo?.phase === phase ? "font-semibold text-success" : "text-muted-foreground"}`}>
                            {phase}
                          </span>
                          {phaseInfo?.phase === phase && <span className="text-[8px] text-success font-sans">← you are here</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Log New Period */}
                {showLogPeriod ? (
                  <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
                    <h4 className="text-sm font-sans font-semibold text-foreground">Log New Period Start</h4>
                    <input type="date" className="w-full border border-border rounded-lg px-3 py-2 text-sm font-sans bg-background" value={newPeriodDate} onChange={e => setNewPeriodDate(e.target.value)} />
                    <div className="flex gap-3">
                      <Button variant="ghost" size="sm" className="text-xs rounded-pill flex-1" onClick={() => setShowLogPeriod(false)}>Cancel</Button>
                      <Button size="sm" className="text-xs rounded-pill flex-1" disabled={cycleSaving || !newPeriodDate} onClick={async () => {
                        await upsertCycle({ last_period_start: newPeriodDate });
                        setShowLogPeriod(false);
                        setNewPeriodDate("");
                        toast({ title: "Period start logged — phase updated ✅" });
                      }}>
                        {cycleSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-pill text-xs" onClick={() => setShowLogPeriod(true)}>
                    + Log Period Start
                  </Button>
                )}

                {/* Reset / Edit */}
                {showResetCycle ? (
                  <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
                    <h4 className="text-sm font-sans font-semibold text-foreground">Edit Cycle Data</h4>
                    <div>
                      <label className="text-xs font-sans text-muted-foreground mb-1 block">Last period start</label>
                      <input type="date" className="w-full border border-border rounded-lg px-3 py-2 text-sm font-sans bg-background" value={cycleSetup.last_period_start} onChange={e => setCycleSetup(p => ({ ...p, last_period_start: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-sans text-muted-foreground mb-1 block">Cycle length</label>
                        <input type="number" className="w-full border border-border rounded-lg px-3 py-2 text-sm font-sans bg-background" value={cycleSetup.cycle_length_days} onChange={e => setCycleSetup(p => ({ ...p, cycle_length_days: +e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-xs font-sans text-muted-foreground mb-1 block">Period duration</label>
                        <input type="number" className="w-full border border-border rounded-lg px-3 py-2 text-sm font-sans bg-background" value={cycleSetup.period_duration_days} onChange={e => setCycleSetup(p => ({ ...p, period_duration_days: +e.target.value }))} />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="ghost" size="sm" className="text-xs rounded-pill flex-1" onClick={() => setShowResetCycle(false)}>Cancel</Button>
                      <Button size="sm" className="text-xs rounded-pill flex-1" disabled={cycleSaving} onClick={async () => {
                        await upsertCycle({
                          last_period_start: cycleSetup.last_period_start || undefined,
                          cycle_length_days: cycleSetup.cycle_length_days,
                          period_duration_days: cycleSetup.period_duration_days,
                        });
                        setShowResetCycle(false);
                        toast({ title: "Cycle data updated ✅" });
                      }}>
                        {cycleSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                        Save Changes
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-destructive rounded-pill w-full" disabled={cycleSaving} onClick={async () => {
                      await upsertCycle({ tracking_enabled: false });
                      setShowResetCycle(false);
                      toast({ title: "Cycle tracking disabled and data cleared" });
                    }}>
                      Delete all cycle data
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground rounded-pill" onClick={() => {
                      setCycleSetup({
                        last_period_start: cycle?.last_period_start || "",
                        cycle_length_days: cycle?.cycle_length_days || 28,
                        period_duration_days: cycle?.period_duration_days || 5,
                      });
                      setShowResetCycle(true);
                    }}>
                      Reset / Edit Cycle Data
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={cycleSaving}
                      className="text-xs text-muted-foreground rounded-pill"
                      onClick={() => upsertCycle({ tracking_enabled: false })}
                    >
                      Disable Cycle Tracking
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* ========== My Exceptions ========== */}
        {activeSection === "My Exceptions" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">Your Logged Exceptions</h3>
                <p className="text-xs text-muted-foreground font-sans mt-1">Changes you've asked AI to make to your default recommendations</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-pill text-xs" onClick={() => setShowAddException(v => !v)}>
                {showAddException ? "Cancel" : "+ Add Exception"}
              </Button>
            </div>

            {/* Add Exception Form */}
            {showAddException && (
              <div className="bg-card rounded-2xl border border-border p-4 md:p-5 space-y-4">
                <h4 className="text-sm font-sans font-semibold text-foreground">New Exception</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-sans text-muted-foreground mb-1 block">Exception Type</label>
                    <select
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm font-sans bg-background"
                      value={newException.exception_type}
                      onChange={e => setNewException(p => ({ ...p, exception_type: e.target.value }))}
                    >
                      <option value="">Select type...</option>
                      <option value="Calorie Target">Calorie Target</option>
                      <option value="Fasting Window">Fasting Window</option>
                      <option value="Macro Split">Macro Split</option>
                      <option value="Food Restriction">Food Restriction</option>
                      <option value="Notification Timing">Notification Timing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-sans text-muted-foreground mb-1 block">Original Value</label>
                      <input className="w-full border border-border rounded-lg px-3 py-2 text-sm font-sans bg-background" placeholder="e.g. 1800 kcal" value={newException.original_value} onChange={e => setNewException(p => ({ ...p, original_value: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs font-sans text-muted-foreground mb-1 block">Modified Value</label>
                      <input className="w-full border border-border rounded-lg px-3 py-2 text-sm font-sans bg-background" placeholder="e.g. 2000 kcal" value={newException.modified_value} onChange={e => setNewException(p => ({ ...p, modified_value: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-sans text-muted-foreground mb-1 block">Reason (optional)</label>
                    <textarea className="w-full border border-border rounded-lg px-3 py-2 text-sm font-sans bg-background resize-none" rows={2} placeholder="Why are you making this change?" value={newException.reason} onChange={e => setNewException(p => ({ ...p, reason: e.target.value }))} />
                  </div>
                  <Button
                    size="sm" className="rounded-pill text-xs w-full"
                    disabled={!newException.exception_type || !newException.modified_value}
                    onClick={async () => {
                      await addException({
                        exception_type: newException.exception_type,
                        original_value: newException.original_value || null,
                        modified_value: newException.modified_value,
                        reason: newException.reason || null,
                        is_permanent: true,
                        expires_at: null,
                      });
                      setNewException({ exception_type: "", original_value: "", modified_value: "", reason: "" });
                      setShowAddException(false);
                      toast({ title: "Exception saved ✅" });
                    }}
                  >Save Exception</Button>
                </div>
              </div>
            )}

            {excLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : exceptions.length > 0 ? (
              <div className="space-y-3">
                {exceptions.map((ex) => (
                  <div key={ex.id} className="bg-card rounded-2xl border border-border p-4 md:p-5 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <p className="text-sm font-sans font-semibold text-foreground">Exception: {ex.exception_type}</p>
                      <span className="text-xs text-muted-foreground font-sans">{new Date(ex.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs font-sans">
                      <span className="text-muted-foreground">Original: <span className="font-mono text-foreground">{ex.original_value || '—'}</span></span>
                      <span className="text-muted-foreground">Modified: <span className="font-mono text-foreground font-semibold">{ex.modified_value || '—'}</span></span>
                    </div>
                    {ex.reason && <p className="text-xs font-sans text-muted-foreground italic">"{ex.reason}"</p>}
                    <Button
                      variant="ghost" size="sm"
                      className="text-xs rounded-pill"
                      onClick={async () => {
                        await removeException(ex.id);
                        toast({ title: "Exception reverted" });
                      }}
                    >
                      Revert to default
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border p-8 text-center space-y-3">
                <span className="text-3xl">✅</span>
                <p className="text-sm font-sans text-muted-foreground">
                  No exceptions logged yet. When you ask AI to adjust a recommendation, it will be saved here for your reference.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* ========== Privacy ========== */}
        {activeSection === "Privacy" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground">Privacy & Data</h3>
              <p className="text-xs text-muted-foreground font-sans mt-1">Your data is encrypted and stored securely</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-sans font-medium text-foreground">Share anonymized data for research</p>
                  <p className="text-xs text-muted-foreground font-sans">Help improve nutrition recommendations for everyone</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-sans font-medium text-foreground">AI can remember conversation context</p>
                  <p className="text-xs text-muted-foreground font-sans">Enables personalized recommendations over time</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="pt-4 border-t border-border flex gap-3">
                <Button variant="outline" size="sm" className="rounded-pill text-xs">📄 Export my data</Button>
                <Button variant="ghost" size="sm" className="rounded-pill text-xs text-destructive hover:text-destructive hover:bg-destructive/10">Delete all my data</Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;
