import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { supabase, getCurrentUserId } from "@/lib/supabase/client";
import { LogOut, Loader2, Bell, Trash2, Pencil, X, Check } from "lucide-react";
import { useReminders, Reminder, RepeatType } from "@/hooks/useReminders";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  const { toast } = useToast();
  const [signingOut, setSigningOut] = useState(false);
  const { reminders, loading: remindersLoading, updateReminder, deleteReminder } = useReminders();
  const { darkMode, setDarkMode } = useThemeContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editTime, setEditTime] = useState("08:00");
  const [editRepeat, setEditRepeat] = useState<RepeatType>("once");

  // Notification preferences — init from localStorage, hydrate from Supabase
  const defaultNotifs = {
    dailyMealReminder: true,
    endOfDayRecap: true,
    waterReminders: true,
    weeklyStory: true,
  };
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('nourishmind_notifications');
    if (saved) try { return JSON.parse(saved); } catch { /* ignore */ }
    return defaultNotifs;
  });
  const hydratedRef = useRef(false);

  // Fetch notification prefs from Supabase on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const userId = await getCurrentUserId();
        if (!userId || cancelled) return;
        const { data } = await supabase
          .from('user_profiles')
          .select('notification_preferences')
          .eq('id', userId)
          .single();
        if (!cancelled && data?.notification_preferences) {
          const prefs = typeof data.notification_preferences === 'string'
            ? JSON.parse(data.notification_preferences)
            : data.notification_preferences;
          setNotifications({ ...defaultNotifs, ...prefs });
          localStorage.setItem('nourishmind_notifications', JSON.stringify(prefs));
        }
      } catch { /* offline — keep localStorage */ }
      finally { if (!cancelled) hydratedRef.current = true; }
    })();
    return () => { cancelled = true; };
  }, []);

  // Persist notification prefs to Supabase + localStorage on every change
  const persistNotifications = useCallback(async (next: typeof defaultNotifs) => {
    localStorage.setItem('nourishmind_notifications', JSON.stringify(next));
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;
      await supabase
        .from('user_profiles')
        .update({ notification_preferences: next })
        .eq('id', userId);
    } catch { /* offline — localStorage already saved */ }
  }, []);

  const toggleNotif = (key: keyof typeof notifications) => {
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    persistNotifications(next);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto space-y-6 md:space-y-8 pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Settings</h2>
        <p className="text-sm font-sans text-muted-foreground">Manage your account, preferences, and data</p>
      </motion.div>

      {/* Account */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="bg-card rounded-2xl border border-border p-4 md:p-6 space-y-5">
        <h3 className="font-serif text-base font-semibold text-foreground">Account</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg font-sans shrink-0">
            {(user?.user_metadata?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-sans font-semibold text-foreground">{user?.user_metadata?.full_name || 'User'}</p>
            <p className="text-xs font-sans text-muted-foreground">{user?.email || ''}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-medium text-muted-foreground">Name</label>
            <span className="text-sm font-sans text-foreground block">{user?.user_metadata?.full_name || 'User'}</span>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-medium text-muted-foreground">Email</label>
            <span className="text-sm font-sans text-foreground block">{user?.email || ''}</span>
          </div>
        </div>
      </motion.section>

      {/* Notifications */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-4 md:p-6 space-y-5">
        <h3 className="font-serif text-base font-semibold text-foreground">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between min-h-[56px]">
            <div>
              <p className="text-sm font-sans font-medium text-foreground">Daily meal reminder</p>
              <p className="text-xs font-sans text-muted-foreground">Get reminded to log your meals</p>
            </div>
            <Switch checked={notifications.dailyMealReminder} onCheckedChange={() => toggleNotif("dailyMealReminder")} />
          </div>
          <div className="flex items-center justify-between min-h-[56px]">
            <div>
              <p className="text-sm font-sans font-medium text-foreground">End-of-day recap</p>
              <p className="text-xs font-sans text-muted-foreground">Daily summary at 9:00 PM</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground">9:00 PM</span>
              <Switch checked={notifications.endOfDayRecap} onCheckedChange={() => toggleNotif("endOfDayRecap")} />
            </div>
          </div>
          <div className="flex items-center justify-between min-h-[56px]">
            <div>
              <p className="text-sm font-sans font-medium text-foreground">Water reminders</p>
              <p className="text-xs font-sans text-muted-foreground">Every 2 hours during daytime</p>
            </div>
            <Switch checked={notifications.waterReminders} onCheckedChange={() => toggleNotif("waterReminders")} />
          </div>
          <div className="flex items-center justify-between min-h-[56px]">
            <div>
              <p className="text-sm font-sans font-medium text-foreground">Weekly Nutrition Story</p>
              <p className="text-xs font-sans text-muted-foreground">Sundays at 7 PM</p>
            </div>
            <Switch checked={notifications.weeklyStory} onCheckedChange={() => toggleNotif("weeklyStory")} />
          </div>
        </div>
      </motion.section>

      {/* My Reminders */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }} className="bg-card rounded-2xl border border-border p-4 md:p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="font-serif text-base font-semibold text-foreground">My Reminders</h3>
        </div>

        {remindersLoading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
            <Loader2 className="h-3 w-3 animate-spin" /> Loading reminders…
          </div>
        ) : reminders.length === 0 ? (
          <p className="text-xs font-sans text-muted-foreground">No active reminders. Set one from the Dashboard's End of Day Recap card.</p>
        ) : (
          <div className="space-y-3">
            {reminders.map((r) => {
              const isEditing = editingId === r.id;
              const displayTime = new Date(`2000-01-01T${r.reminder_time}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
              const repeatLabel = r.repeat_type === "once" ? "Once" : r.repeat_type === "daily" ? "Daily" : "Weekdays";

              if (isEditing) {
                return (
                  <div key={r.id} className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <div className="flex flex-wrap gap-2 items-center">
                      <input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-sans"
                      />
                      <select
                        value={editRepeat}
                        onChange={(e) => setEditRepeat(e.target.value as RepeatType)}
                        className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-sans"
                      >
                        <option value="once">Just once</option>
                        <option value="daily">Every day</option>
                        <option value="weekdays">Weekdays</option>
                      </select>
                      <div className="flex gap-1 ml-auto">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                          className="h-7 w-7 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={async () => {
                            await updateReminder(r.id, {
                              reminder_text: editText.trim(),
                              reminder_time: editTime,
                              repeat_type: editRepeat,
                            });
                            setEditingId(null);
                            toast({ title: "Reminder updated ✅" });
                          }}
                          className="h-7 px-2 text-xs rounded-lg bg-primary text-primary-foreground"
                        >
                          <Check className="h-3 w-3 mr-1" /> Save
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={r.id} className="flex items-start justify-between gap-3 rounded-xl border border-border p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans text-foreground break-words">{r.reminder_text}</p>
                    <p className="text-xs font-sans text-muted-foreground mt-1">
                      🕐 {displayTime} · {repeatLabel}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(r.id);
                        setEditText(r.reminder_text);
                        setEditTime(r.reminder_time);
                        setEditRepeat(r.repeat_type);
                      }}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        await deleteReminder(r.id);
                        toast({ title: "Reminder deleted" });
                      }}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* App Preferences */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="bg-card rounded-2xl border border-border p-4 md:p-6 space-y-5">
        <h3 className="font-serif text-base font-semibold text-foreground">App Preferences</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-sans font-medium text-muted-foreground">Units</label>
            <Select defaultValue="metric">
              <SelectTrigger className="rounded-xl text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                <SelectItem value="imperial">Imperial (lb, in)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-sans font-medium text-muted-foreground">Calorie display</label>
            <Select defaultValue="kcal">
              <SelectTrigger className="rounded-xl text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="kcal">kcal</SelectItem>
                <SelectItem value="kj">kJ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-sans font-medium text-muted-foreground">Default meal view</label>
            <Select defaultValue="chat">
              <SelectTrigger className="rounded-xl text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="chat">Chat</SelectItem>
                <SelectItem value="form">Form</SelectItem>
                <SelectItem value="photo">Photo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-sans font-medium text-muted-foreground">Dark mode</label>
            <div className="flex items-center gap-3 h-10">
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              <span className="text-sm font-sans text-muted-foreground">{darkMode ? "On" : "Off"}</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Data & Privacy */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border p-4 md:p-6 space-y-5">
        <h3 className="font-serif text-base font-semibold text-foreground">Data & Privacy</h3>
        <p className="text-xs font-sans text-muted-foreground">Your data is encrypted and never shared with third parties.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="rounded-pill text-xs min-h-[44px] w-full sm:w-auto">📄 Export my data — PDF report</Button>
          <Button variant="ghost" className="rounded-pill text-xs text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[44px] w-full sm:w-auto border border-destructive/30 sm:border-0">Delete my account</Button>
        </div>
      </motion.section>

      {/* Sign Out */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <Button
          variant="outline"
          onClick={async () => {
            setSigningOut(true);
            await signOut();
            navigate('/login', { replace: true });
          }}
          disabled={signingOut}
          className="w-full rounded-pill h-12 text-sm font-medium border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          {signingOut ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogOut className="h-4 w-4 mr-2" />}
          Sign Out
        </Button>
      </motion.section>
    </div>
  );
};

export default SettingsPage;
