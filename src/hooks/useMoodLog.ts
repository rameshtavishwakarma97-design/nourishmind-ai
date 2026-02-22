import { useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentUserId } from '@/lib/supabase/client';

export function useMoodLog() {
  const [todayMood, setTodayMood] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const fetchTodayMood = useCallback(async () => {
    const userId = await getCurrentUserId();
    if (!userId) return;
    const { data } = await supabase
      .from('daily_logs')
      .select('mood_score')
      .eq('user_id', userId)
      .eq('log_date', today)
      .single();
    if (data?.mood_score) setTodayMood(data.mood_score);
  }, [today]);

  useEffect(() => {
    fetchTodayMood();
  }, [fetchTodayMood]);

  const logMood = useCallback(async (score: number): Promise<boolean> => {
    const userId = await getCurrentUserId();
    if (!userId) return false;
    setSaving(true);
    setFeedback(null);
    try {
      // Upsert daily_logs for today
      const { error } = await supabase
        .from('daily_logs')
        .upsert(
          { user_id: userId, log_date: today, mood_score: score },
          { onConflict: 'user_id,log_date' }
        );
      if (error) throw error;
      setTodayMood(score);

      // Set contextual feedback
      if (score <= 2) {
        setFeedback("Low mood noted 💙 Low magnesium today may be contributing. Try dark chocolate or pumpkin seeds.");
      } else if (score === 3) {
        setFeedback("Moderate mood. Your nutrition has been fairly balanced.");
      } else {
        setFeedback("Great mood! 🌟 Your protein intake today likely helped.");
      }
      return true;
    } catch (err) {
      console.error('Failed to log mood:', err);
      return false;
    } finally {
      setSaving(false);
    }
  }, [today]);

  return { todayMood, saving, feedback, logMood };
}
