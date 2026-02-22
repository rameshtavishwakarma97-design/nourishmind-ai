import { useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentUserId } from '@/lib/supabase/client';

interface SavedMealIngredient {
  ingredientName: string;
  quantityG: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

interface SavedMealRow {
  id: string;
  meal_name: string;
  meal_type: string | null;
  ingredients: SavedMealIngredient[];
  total_macros: { calories?: number; protein_g?: number; carbs_g?: number; fat_g?: number };
  times_logged: number;
  is_favorite: boolean;
  is_active: boolean;
  created_at: string;
}

export interface SavedMeal {
  id: string;
  meal_name: string;
  meal_type: string;
  ingredients: SavedMealIngredient[];
  total_calories: number;
  total_protein_g: number;
  total_macros: Record<string, number>;
  use_count: number;
  is_favorite: boolean;
  created_at: string;
}

function rowToSavedMeal(row: SavedMealRow): SavedMeal {
  const macros = (row.total_macros ?? {}) as Record<string, number>;
  return {
    id: row.id,
    meal_name: row.meal_name,
    meal_type: row.meal_type ?? 'other',
    ingredients: (row.ingredients ?? []) as SavedMealIngredient[],
    total_calories: macros.calories ?? 0,
    total_protein_g: macros.protein_g ?? 0,
    total_macros: macros,
    use_count: row.times_logged ?? 0,
    is_favorite: row.is_favorite ?? false,
    created_at: row.created_at,
  };
}

export function useSavedMeals() {
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedMeals = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await getCurrentUserId();
      if (!userId) return;

      const { data, error: fetchError } = await supabase
        .from('saved_meals')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('times_logged', { ascending: false });

      if (fetchError) throw fetchError;
      setSavedMeals((data as SavedMealRow[] ?? []).map(rowToSavedMeal));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load saved meals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedMeals();
  }, [fetchSavedMeals]);

  const saveMeal = useCallback(async (meal: {
    meal_name: string;
    meal_type: string;
    ingredients: SavedMealIngredient[];
    total_calories: number;
    total_protein_g: number;
    total_carbs_g?: number;
    total_fat_g?: number;
    is_favorite?: boolean;
  }) => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('Not authenticated');

      const totalMacros = {
        calories: meal.total_calories,
        protein_g: meal.total_protein_g,
        carbs_g: meal.total_carbs_g ?? 0,
        fat_g: meal.total_fat_g ?? 0,
      };

      const { data, error: insertError } = await supabase
        .from('saved_meals')
        .insert({
          user_id: userId,
          meal_name: meal.meal_name,
          meal_type: meal.meal_type,
          ingredients: meal.ingredients as unknown as Record<string, unknown>,
          total_macros: totalMacros as unknown as Record<string, unknown>,
          is_favorite: meal.is_favorite ?? false,
          times_logged: 0,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setSavedMeals(prev => [rowToSavedMeal(data as SavedMealRow), ...prev]);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Save failed' };
    }
  }, []);

  const deleteSavedMeal = useCallback(async (mealId: string) => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('Not authenticated');

      // Soft-delete via is_active flag
      const { error: delError } = await supabase
        .from('saved_meals')
        .update({ is_active: false })
        .eq('id', mealId)
        .eq('user_id', userId);

      if (delError) throw delError;
      setSavedMeals(prev => prev.filter(m => m.id !== mealId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Delete failed' };
    }
  }, []);

  const toggleFavorite = useCallback(async (mealId: string) => {
    const meal = savedMeals.find(m => m.id === mealId);
    if (!meal) return;

    const { error: updateError } = await supabase
      .from('saved_meals')
      .update({ is_favorite: !meal.is_favorite })
      .eq('id', mealId);

    if (!updateError) {
      setSavedMeals(prev => prev.map(m =>
        m.id === mealId ? { ...m, is_favorite: !m.is_favorite } : m
      ));
    }
  }, [savedMeals]);

  const incrementUseCount = useCallback(async (mealId: string) => {
    const meal = savedMeals.find(m => m.id === mealId);
    if (!meal) return;

    await supabase
      .from('saved_meals')
      .update({
        times_logged: (meal.use_count || 0) + 1,
        last_logged_at: new Date().toISOString(),
      })
      .eq('id', mealId);

    setSavedMeals(prev => prev.map(m =>
      m.id === mealId ? { ...m, use_count: (m.use_count || 0) + 1 } : m
    ));
  }, [savedMeals]);

  // Computed
  const favorites = savedMeals.filter(m => m.is_favorite);
  const frequentMeals = [...savedMeals].sort((a, b) => (b.use_count || 0) - (a.use_count || 0)).slice(0, 5);

  return {
    savedMeals,
    favorites,
    frequentMeals,
    loading,
    error,
    saveMeal,
    deleteSavedMeal,
    toggleFavorite,
    incrementUseCount,
    refresh: fetchSavedMeals,
  };
}
