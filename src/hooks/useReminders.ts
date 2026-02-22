import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "./useAuth";

export interface Reminder {
  id: string;
  user_id: string;
  reminder_text: string;
  reminder_time: string; // TIME as HH:MM
  repeat_type: "once" | "daily" | "weekdays";
  is_active: boolean;
  created_at: string;
}

export type RepeatType = "once" | "daily" | "weekdays";

export function useReminders() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("reminder_time", { ascending: true });

    if (!error && data) setReminders(data as Reminder[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const addReminder = async (
    reminder_text: string,
    reminder_time: string,
    repeat_type: RepeatType
  ) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("reminders")
      .insert({
        user_id: user.id,
        reminder_text,
        reminder_time,
        repeat_type,
        is_active: true,
      })
      .select()
      .single();

    if (!error && data) {
      setReminders((prev) => [...prev, data as Reminder]);
      return data as Reminder;
    }
    return null;
  };

  const updateReminder = async (
    id: string,
    updates: Partial<Pick<Reminder, "reminder_text" | "reminder_time" | "repeat_type">>
  ) => {
    const { error } = await supabase
      .from("reminders")
      .update(updates)
      .eq("id", id);

    if (!error) {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      );
      return true;
    }
    return false;
  };

  const deleteReminder = async (id: string) => {
    const { error } = await supabase
      .from("reminders")
      .update({ is_active: false })
      .eq("id", id);

    if (!error) {
      setReminders((prev) => prev.filter((r) => r.id !== id));
      return true;
    }
    return false;
  };

  return {
    reminders,
    loading,
    addReminder,
    updateReminder,
    deleteReminder,
    refresh: fetchReminders,
  };
}
