import { useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentUserId, invokeFunction } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  full_name: string | null;
  age: number | null;
  biological_sex: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  primary_goal: string | null;
  health_conditions: string[] | null;
  dietary_pattern: string | null;
  food_allergies: string[] | null;
  occupation: string | null;
  typical_sleep_time: string | null;
  typical_wake_time: string | null;
  typical_workout_time: string | null;
  workout_type: string | null;
  workout_duration_mins: number | null;
  ai_context_field: string | null;
  hydration_target_ml: number | null;
  onboarding_complete: boolean;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await getCurrentUserId();
      if (!userId) return;

      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = no rows returned (profile not created yet)
        throw fetchError;
      }

      setProfile(data as UserProfile ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      setSaving(true);
      setError(null);
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('Not authenticated');

      const { data, error: updateError } = await supabase
        .from('user_profiles')
        .upsert({ id: userId, ...updates }, { onConflict: 'id' })
        .select()
        .single();

      if (updateError) throw updateError;
      setProfile(data as UserProfile);
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSaving(false);
    }
  }, []);

  const completeOnboarding = useCallback(async (onboardingData: Partial<UserProfile>) => {
    return updateProfile({
      ...onboardingData,
      onboarding_complete: true,
    });
  }, [updateProfile]);

  const fetchAiSummary = useCallback(async () => {
    try {
      const { data } = await invokeFunction<Record<string, never>, { summary: string }>('user-summary', {});
      if (data) {
        setAiSummary(data.summary);
        return data.summary;
      }
      return null;
    } catch {
      console.warn('AI summary unavailable');
      return null;
    }
  }, []);

  return {
    profile,
    aiSummary,
    loading,
    saving,
    error,
    updateProfile,
    completeOnboarding,
    fetchAiSummary,
    refresh: fetchProfile,
  };
}
