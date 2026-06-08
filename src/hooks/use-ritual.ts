import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export interface RitualProgress {
  completed: boolean;
  items: string[];
}

export interface RitualStreak {
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
}

export function useRitual() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState<RitualStreak>({ current_streak: 0, longest_streak: 0, last_completed_date: null });
  const [todayProgress, setTodayProgress] = useState<RitualProgress>({ completed: false, items: [] });
  const [merits, setMerits] = useState<string[]>([]);

  const fetchRitualData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];

      // Fetch streak
      const { data: streakData } = await supabase
        .from("ritual_streaks")
        .select("current_streak, longest_streak, last_completed_date")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (streakData) setStreak(streakData);

      // Fetch today's progress
      const { data: progressData } = await supabase
        .from("daily_ritual_progress")
        .select("completed, items_json")
        .eq("user_id", user.id)
        .eq("ritual_date", today)
        .maybeSingle();

      if (progressData) {
        setTodayProgress({
          completed: progressData.completed,
          items: progressData.items_json as string[]
        });
      }

      // Fetch merits
      const { data: meritData } = await supabase
        .from("ritual_merits")
        .select("merit_key")
        .eq("user_id", user.id);
      
      if (meritData) setMerits(meritData.map(m => m.merit_key));

    } catch (err) {
      console.error("[useRitual] Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRitualData();
  }, [fetchRitualData]);

  const completeRitualItem = async (itemKey: string) => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const newItems = [...new Set([...todayProgress.items, itemKey])];
    
    // Check if all required items are done (Mission of the day)
    // Required: Carta do Dia, Reflexão, Portal (simplified logic)
    const isNowComplete = newItems.length >= 3;

    try {
      const { error: progError } = await supabase
        .from("daily_ritual_progress")
        .upsert({
          user_id: user.id,
          ritual_date: today,
          items_json: newItems as any,
          completed: isNowComplete,
          completed_at: isNowComplete ? new Date().toISOString() : null
        });

      if (progError) throw progError;
      setTodayProgress({ completed: isNowComplete, items: newItems });

      if (isNowComplete && (!streak.last_completed_date || streak.last_completed_date !== today)) {
        await updateStreak(today);
        toast.success("Ritual concluído! Sua chama foi mantida.");
      }
    } catch (err) {
      console.error("[useRitual] Error updating item:", err);
      toast.error("Erro ao salvar progresso ritual.");
    }
  };

  const updateStreak = async (today: string) => {
    if (!user) return;
    
    let newStreak = 1;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (streak.last_completed_date === yesterdayStr) {
      newStreak = streak.current_streak + 1;
    }

    const { error: streakError } = await supabase
      .from("ritual_streaks")
      .upsert({
        user_id: user.id,
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streak.longest_streak),
        last_completed_date: today
      });

    if (streakError) throw streakError;
    setStreak(prev => ({
      ...prev,
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, prev.longest_streak),
      last_completed_date: today
    }));

    // Unlock symbolic merits
    checkMerits(newStreak);
  };

  const checkMerits = async (currentStreak: number) => {
    const meritMap: Record<number, string> = {
      1: "chama_acesa",
      3: "ritmo_iniciado",
      7: "portal_constante",
      21: "habito_firmado",
      30: "guardia_rotina"
    };

    const meritKey = meritMap[currentStreak];
    if (meritKey && !merits.includes(meritKey)) {
      await supabase.from("ritual_merits").upsert({ user_id: user?.id, merit_key: meritKey });
      setMerits(prev => [...prev, meritKey]);
      toast.success(`Novo mérito alcançado: ${meritKey.replace("_", " ")}`);
    }
  };

  return {
    loading,
    streak,
    todayProgress,
    merits,
    completeRitualItem,
    refresh: fetchRitualData
  };
}
