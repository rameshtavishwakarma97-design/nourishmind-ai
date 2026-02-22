import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase, getCurrentUserId } from '@/lib/supabase/client';

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialise from localStorage for instant paint, then hydrate from Supabase
  const [darkMode, setDarkModeState] = useState(() => {
    return localStorage.getItem('nourishmind_darkmode') === 'true';
  });
  const [hydrated, setHydrated] = useState(false);

  // Apply class to documentElement whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // On mount — fetch server preference and overwrite local state
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const userId = await getCurrentUserId();
        if (!userId || cancelled) return;

        const { data } = await supabase
          .from('user_profiles')
          .select('dark_mode')
          .eq('id', userId)
          .single();

        if (!cancelled && data && typeof data.dark_mode === 'boolean') {
          setDarkModeState(data.dark_mode);
          localStorage.setItem('nourishmind_darkmode', String(data.dark_mode));
        }
      } catch {
        // Supabase unavailable — keep localStorage value
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Persist to Supabase + localStorage on change (skip first hydration write)
  const setDarkMode = useCallback(async (value: boolean) => {
    setDarkModeState(value);
    localStorage.setItem('nourishmind_darkmode', String(value));

    try {
      const userId = await getCurrentUserId();
      if (!userId) return;
      await supabase
        .from('user_profiles')
        .update({ dark_mode: value })
        .eq('id', userId);
    } catch {
      // Offline — localStorage already updated
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode, setDarkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
