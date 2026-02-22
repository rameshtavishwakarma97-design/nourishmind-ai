import { useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentUserId } from '@/lib/supabase/client';

export function useGutSymptomLog() {
  const [todayScore, setTodayScore] = useState<number | null>(null);
  const [lastLogged, setLastLogged] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const fetchToday = useCallback(async () => {
    const userId = await getCurrentUserId();
    if (!userId) return;

    // Check gut_symptom_logs for today
    const { data } = await supabase
      .from('gut_symptom_logs')
      .select('symptom_score, log_date')
      .eq('user_id', userId)
      .eq('log_date', today)
      .single();

    if (data?.symptom_score) {
      setTodayScore(data.symptom_score);
      setLastLogged('Today');
    } else {
      // Check most recent log
      const { data: last } = await supabase
        .from('gut_symptom_logs')
        .select('log_date')
        .eq('user_id', userId)
        .order('log_date', { ascending: false })
        .limit(1)
        .single();
      if (last) {
        const d = new Date(last.log_date);
        const now = new Date();
        const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
        setLastLogged(diff === 1 ? 'Yesterday' : `${diff} days ago`);
      }
    }
  }, [today]);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  const logGutScore = useCallback(async (score: number): Promise<boolean> => {
    const userId = await getCurrentUserId();
    if (!userId) return false;
    setSaving(true);
    setFeedback(null);
    try {
      // Upsert into gut_symptom_logs
      const { error: gutErr } = await supabase
        .from('gut_symptom_logs')
        .upsert(
          { user_id: userId, log_date: today, symptom_score: score },
          { onConflict: 'user_id,log_date' }
        );
      if (gutErr) throw gutErr;

      // Also update daily_logs gut_symptom_score
      await supabase
        .from('daily_logs')
        .upsert(
          { user_id: userId, log_date: today, gut_symptom_score: score },
          { onConflict: 'user_id,log_date' }
        );

      setTodayScore(score);
      setLastLogged('Just now');

      // Set contextual feedback
      if (score <= 2) {
        setFeedback("Sorry you're not feeling great. Your high-FODMAP meals today may be contributing — try peppermint tea or a warm compress.");
      } else if (score === 3) {
        setFeedback("Feeling okay! Keep monitoring — your dietary choices may be affecting symptoms this week.");
      } else {
        setFeedback("Great gut day! 🎉 Your low-FODMAP choices are working well.");
      }
      return true;
    } catch (err) {
      console.error('Failed to log gut score:', err);
      return false;
    } finally {
      setSaving(false);
    }
  }, [today]);

  return { todayScore, lastLogged, saving, feedback, logGutScore };
}
