import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { DEFAULT_PROGRESS, type Badge, type UserProgress } from "@/lib/content";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import { toast } from "sonner";

const LOCAL_EXTRAS_KEY = "tarot-journey-extras";

/**
 * Fields stored in Supabase user_progress table.
 *
 * `badges`, `certificates_earned` and `current_module` were added in the
 * cross-device sync migration; `student_name` lives on `profiles`.
 *
 * localStorage is kept as a write-through cache so the UI can render
 * instantly on cold start before the DB fetch resolves (no flash of empty
 * state). DB is the source of truth — on hydrate we overwrite the cache.
 */
interface DbProgress {
  xp: number;
  level: number;
  streak: number;
  last_active: string;
  onboarding_completed: boolean;
  completed_lessons: string[];
  completed_quizzes: string[];
  completed_exercises: string[];
  completed_modules: string[];
  badges: Badge[];
  certificates_earned: Record<string, string>;
  current_module: string;
}

interface LocalExtras {
  badges: Badge[];
  currentModule: string;
  studentName: string;
  certificatesEarned: Record<string, string>;
  completedLessons: string[];
  completedQuizzes: string[];
  completedExercises: string[];
  completedModules: string[];
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  onboardingCompleted: boolean;
}

function getLocalExtras(): LocalExtras {
  try {
    const raw = localStorage.getItem(LOCAL_EXTRAS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        badges: parsed.badges ?? DEFAULT_PROGRESS.badges,
        currentModule: parsed.currentModule ?? DEFAULT_PROGRESS.currentModule,
        studentName: parsed.studentName ?? DEFAULT_PROGRESS.studentName,
        certificatesEarned: parsed.certificatesEarned ?? DEFAULT_PROGRESS.certificatesEarned,
        completedLessons: parsed.completedLessons ?? DEFAULT_PROGRESS.completedLessons,
        completedQuizzes: parsed.completedQuizzes ?? DEFAULT_PROGRESS.completedQuizzes,
        completedExercises: parsed.completedExercises ?? DEFAULT_PROGRESS.completedExercises,
        completedModules: parsed.completedModules ?? DEFAULT_PROGRESS.completedModules,
        xp: parsed.xp ?? DEFAULT_PROGRESS.xp,
        level: parsed.level ?? DEFAULT_PROGRESS.level,
        streak: parsed.streak ?? DEFAULT_PROGRESS.streak,
        lastActive: parsed.lastActive ?? DEFAULT_PROGRESS.lastActive,
        onboardingCompleted: parsed.onboardingCompleted ?? DEFAULT_PROGRESS.onboardingCompleted,
      };
    }
  } catch { /* ignore */ }
  return {
    badges: DEFAULT_PROGRESS.badges,
    currentModule: DEFAULT_PROGRESS.currentModule,
    studentName: DEFAULT_PROGRESS.studentName,
    certificatesEarned: DEFAULT_PROGRESS.certificatesEarned,
    completedLessons: DEFAULT_PROGRESS.completedLessons,
    completedQuizzes: DEFAULT_PROGRESS.completedQuizzes,
    completedExercises: DEFAULT_PROGRESS.completedExercises,
    completedModules: DEFAULT_PROGRESS.completedModules,
    xp: DEFAULT_PROGRESS.xp,
    level: DEFAULT_PROGRESS.level,
    streak: DEFAULT_PROGRESS.streak,
    lastActive: DEFAULT_PROGRESS.lastActive,
    onboardingCompleted: DEFAULT_PROGRESS.onboardingCompleted,
  };
}

function saveLocalExtras(extras: LocalExtras) {
  try {
    localStorage.setItem(LOCAL_EXTRAS_KEY, JSON.stringify(extras));
  } catch { /* ignore */ }
}

/** Merge persisted badges (just `id` + `earned` + `earnedAt`) into the canonical DEFAULT_PROGRESS list to keep names/descriptions in sync with code. */
function mergeBadges(persisted: Badge[] | null | undefined): Badge[] {
  if (!persisted || !Array.isArray(persisted) || persisted.length === 0) {
    return DEFAULT_PROGRESS.badges;
  }
  const earnedMap = new Map(persisted.map((b) => [b.id, b]));
  return DEFAULT_PROGRESS.badges.map((b) => {
    const p = earnedMap.get(b.id);
    return p ? { ...b, earned: !!p.earned, earnedAt: p.earnedAt } : b;
  });
}

function dbToProgress(row: DbProgress, studentName: string, quizScores: Record<string, number> = {}): UserProgress {
  return {
    xp: row.xp,
    level: row.level,
    streak: row.streak,
    lastActive: row.last_active,
    onboardingCompleted: row.onboarding_completed,
    completedLessons: row.completed_lessons ?? [],
    completedQuizzes: row.completed_quizzes ?? [],
    completedExercises: row.completed_exercises ?? [],
    completedModules: row.completed_modules ?? [],
    badges: mergeBadges(row.badges),
    currentModule: row.current_module ?? DEFAULT_PROGRESS.currentModule,
    studentName: studentName ?? "",
    certificatesEarned: (row.certificates_earned ?? {}) as Record<string, string>,
    quizScores,
  };
}

function progressToDbCore(p: UserProgress) {
  return {
    xp: p.xp,
    level: p.level,
    streak: p.streak,
    last_active: p.lastActive,
    onboarding_completed: p.onboardingCompleted,
    completed_lessons: p.completedLessons,
    completed_quizzes: p.completedQuizzes,
    completed_exercises: p.completedExercises,
    completed_modules: p.completedModules,
    // jsonb columns — Supabase generated types want `Json`; runtime accepts plain JS values
    badges: p.badges as unknown as never,
    certificates_earned: p.certificatesEarned as unknown as never,
    current_module: p.currentModule,
  };
}

interface ProgressContextType {
  progress: UserProgress;
  loading: boolean;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  completeModule: (moduleId: string) => void;
  completeQuiz: (quizId: string, score?: number, total?: number) => void;
  completeExercise: (exerciseId: string) => void;
  earnBadge: (badgeId: string) => void;
  updateStreak: () => void;
  isArcanoCompleted: (arcanoId: number) => boolean;
  isArcanoUnlocked: (arcanoId: number) => boolean;
  getCurrentArcanoId: () => number;
  completedCount: number;
  journeyProgress: number;
  completeOnboarding: () => void;
  setStudentName: (name: string) => void;
  resetProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const roleState = useRole();
  const isStaff = roleState?.isStaff ?? false;
  const initialExtras = getLocalExtras();
  const [progress, setProgress] = useState<UserProgress>({ ...DEFAULT_PROGRESS, ...initialExtras });
  // If we have any cached progress, don't block the UI with a global loader.
  // We check for xp > 0 or any completed lessons as a sign of cached data.
  const hasCachedData = progress.xp > 0 || progress.completedLessons.length > 0;
  const [loading, setLoading] = useState(!hasCachedData);

  const prevUserIdRef = useRef<string | undefined>(user?.id);

  useEffect(() => {
    // If user changed (login or logout or switch), reset state immediately to prevent leakage
    if (user?.id !== prevUserIdRef.current) {
      console.log("User changed detected in useProgress, resetting state. Old:", prevUserIdRef.current, "New:", user?.id);
      
      // Clear localStorage if logging out
      if (!user) {
        localStorage.removeItem(LOCAL_EXTRAS_KEY);
      }
      
      setProgress({ ...DEFAULT_PROGRESS });
      setLoading(!!user); // Only show loading if we are about to fetch for a new user
      prevUserIdRef.current = user?.id;
    }
  }, [user]);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedCoreRef = useRef<string>("");
  const lastSavedNameRef = useRef<string>("");

  // ─── Fetch from Supabase when user is available ───
  useEffect(() => {
    if (authLoading) return;
    const marker = document.getElementById("boot-marker");
    if (!user) {
      setProgress({ ...DEFAULT_PROGRESS, ...getLocalExtras() });
      setLoading(false);
      if (marker) marker.innerText += " | PROGRESS: PUBLIC";
      return;
    }




    let cancelled = false;
    if (marker) marker.innerText += " | USE PROGRESS START";

    const fetchProgress = async () => {
      try {
        console.log(`[useProgress] fetching progress for user: ${user.id}`);
        
        const { data: progressRow, error: progressError } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (progressError) {
          console.error("[useProgress] error fetching user_progress:", progressError);
          throw progressError;
        }

        const { data: profileRow, error: profileError } = await supabase
          .from("profiles")
          .select("student_name")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("[useProgress] error fetching profile:", profileError);
          throw profileError;
        }

        if (progressRow) {
          console.log("[useProgress] progress found in DB, hydrating state.");
          const dbData = dbToProgress(progressRow as any, profileRow?.student_name ?? "");
          if (!cancelled) {
            setProgress(dbData);
            lastSavedCoreRef.current = JSON.stringify(progressToDbCore(dbData));
            lastSavedNameRef.current = profileRow?.student_name ?? "";
          }
        } else {
          console.log("[useProgress] no progress found in DB, using defaults.");
          if (!cancelled) setProgress({ ...DEFAULT_PROGRESS, ...getLocalExtras() });
        }
      } catch (err) {
        console.error("[useProgress] fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };






    fetchProgress();
    return () => { cancelled = true; };
  }, [user]);

  // ─── Debounced save to Supabase (user_progress + profiles.student_name) ───
  useEffect(() => {
    if (!user || loading || isStaff) return;

    const corePayload = progressToDbCore(progress);
    const coreSnapshot = JSON.stringify(corePayload);
    const nameSnapshot = progress.studentName ?? "";

    const coreChanged = coreSnapshot !== lastSavedCoreRef.current;
    const nameChanged = nameSnapshot !== lastSavedNameRef.current;

    // Always keep localStorage cache fresh
    saveLocalExtras({
      badges: progress.badges,
      currentModule: progress.currentModule,
      studentName: progress.studentName,
      certificatesEarned: progress.certificatesEarned,
      completedLessons: progress.completedLessons,
      completedQuizzes: progress.completedQuizzes,
      completedExercises: progress.completedExercises,
      completedModules: progress.completedModules,
      xp: progress.xp,
      level: progress.level,
      streak: progress.streak,
      lastActive: progress.lastActive,
      onboardingCompleted: progress.onboardingCompleted,
    });

    if (!coreChanged && !nameChanged) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (coreChanged) {
        console.log(`[useProgress] syncing user_progress for ${user.id}...`, corePayload);
        lastSavedCoreRef.current = coreSnapshot;
        
        const { error } = await supabase
          .from("user_progress")
          .upsert({
            user_id: user.id,
            ...corePayload
          }, { onConflict: 'user_id' });
        
        if (error) {
          console.error("[useProgress] Error syncing user_progress:", error);
          lastSavedCoreRef.current = "";
          toast.error("Erro ao salvar progresso. Verifique sua conexão.");
        } else {
          console.log("[useProgress] user_progress synced successfully");
        }
      }
      
      if (nameChanged) {
        console.log(`[useProgress] syncing student_name for ${user.id}: "${nameSnapshot}"`);
        lastSavedNameRef.current = nameSnapshot;
        const { error } = await supabase
          .from("profiles")
          .upsert({ 
            user_id: user.id,
            student_name: nameSnapshot 
          } as never, { onConflict: 'user_id' });

        if (error) {
          console.error("[useProgress] Error syncing student_name:", error);
          lastSavedNameRef.current = "";
        } else {
          console.log("[useProgress] student_name synced successfully");
        }
      }
    }, 300);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [progress, user, loading, isStaff]);

  // ─── Migrate old localStorage data on first load ───
  useEffect(() => {
    if (!user || loading) return;
    const oldKey = "tarot-journey-progress";
    const old = localStorage.getItem(oldKey);
    if (!old) return;

    try {
      const parsed = JSON.parse(old);
      if (parsed.completedLessons?.length > 0 || parsed.xp > 0) {
        setProgress(prev => ({
          ...prev,
          xp: Math.max(prev.xp, parsed.xp ?? 0),
          level: Math.max(prev.level, parsed.level ?? 1),
          streak: Math.max(prev.streak, parsed.streak ?? 0),
          completedLessons: [...new Set([...prev.completedLessons, ...(parsed.completedLessons ?? [])])],
          completedQuizzes: [...new Set([...prev.completedQuizzes, ...(parsed.completedQuizzes ?? [])])],
          completedExercises: [...new Set([...prev.completedExercises, ...(parsed.completedExercises ?? [])])],
          completedModules: [...new Set([...prev.completedModules, ...(parsed.completedModules ?? [])])],
          onboardingCompleted: prev.onboardingCompleted || parsed.onboardingCompleted || false,
          badges: parsed.badges ?? prev.badges,
          studentName: parsed.studentName || prev.studentName,
        }));
      }
    } catch { /* ignore */ }

    localStorage.removeItem(oldKey);
  }, [user, loading]);

  // ─── Actions (same API as before) ───

  const addXP = useCallback((amount: number) => {
    setProgress((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      console.log(`[progress] adding ${amount} XP. Total: ${newXP}, Level: ${newLevel}`);
      return { ...prev, xp: newXP, level: newLevel };
    });
  }, []);

  const completeModule = useCallback((moduleId: string) => {
    setProgress((prev) => {
      if (prev.completedModules.includes(moduleId)) return prev;
      return {
        ...prev,
        completedModules: [...prev.completedModules, moduleId],
      };
    });
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      console.log(`[progress] completing lesson: ${lessonId}`);
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        lastActive: new Date().toISOString(),
      };
    });
  }, []);

  const completeQuiz = useCallback((quizId: string, score?: number, total?: number) => {
    setProgress((prev) => {
      const nextScores = { ...prev.quizScores };
      if (score !== undefined && total !== undefined && total > 0) {
        nextScores[quizId] = score / total;
      }
      
      if (prev.completedQuizzes.includes(quizId) && prev.quizScores[quizId] === nextScores[quizId]) return prev;
      
      console.log(`[progress] completing quiz: ${quizId}, score: ${score}/${total}`);
      return { 
        ...prev, 
        completedQuizzes: prev.completedQuizzes.includes(quizId) ? prev.completedQuizzes : [...prev.completedQuizzes, quizId],
        quizScores: nextScores
      };
    });
  }, []);

  const completeExercise = useCallback((exerciseId: string) => {
    setProgress((prev) => {
      if (prev.completedExercises.includes(exerciseId)) return prev;
      return { ...prev, completedExercises: [...prev.completedExercises, exerciseId] };
    });
  }, []);

  const earnBadge = useCallback((badgeId: string) => {
    setProgress((prev) => ({
      ...prev,
      badges: prev.badges.map((b) =>
        b.id === badgeId ? { ...b, earned: true, earnedAt: new Date().toISOString() } : b
      ),
    }));
  }, []);

  const updateStreak = useCallback(() => {
    setProgress((prev) => {
      const lastActiveDate = prev.lastActive ? new Date(prev.lastActive) : null;
      const now = new Date();
      
      if (!lastActiveDate) {
        return { ...prev, streak: 1, lastActive: now.toISOString() };
      }

      const diffDays = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        return { ...prev, streak: prev.streak + 1, lastActive: now.toISOString() };
      } else if (diffDays > 1) {
        return { ...prev, streak: 1, lastActive: now.toISOString() };
      }
      return prev;
    });
  }, []);

  const isArcanoCompleted = useCallback((arcanoId: number): boolean => {
    const hasLesson = progress.completedLessons.includes(`arcano-${arcanoId}`);
    const hasQuiz = progress.completedQuizzes.includes(`quiz-arcano-${arcanoId}`);
    
    // Regra pedagógica: Arcano concluído = Lição + Quiz finalizados
    const isCompleted = hasLesson && hasQuiz;
    
    if (arcanoId === 0) {
      console.log(`[progress] diagnostic O LOUCO:`, { hasLesson, hasQuiz, isCompleted });
    }
    
    return isCompleted;
  }, [progress.completedLessons, progress.completedQuizzes]);

  const isArcanoUnlocked = useCallback((arcanoId: number): boolean => {
    if (arcanoId === 0) return true;
    return isArcanoCompleted(arcanoId - 1);
  }, [isArcanoCompleted]);

  const getCurrentArcanoId = useCallback((): number => {
    for (let i = 0; i <= 21; i++) {
      if (isArcanoUnlocked(i) && !isArcanoCompleted(i)) return i;
    }
    return 21;
  }, [isArcanoUnlocked, isArcanoCompleted]);

  const totalCompletedArcanos = Array.from({ length: 22 }, (_, i) => i).filter(id => {
    return progress.completedLessons.includes(`arcano-${id}`) && progress.completedQuizzes.includes(`quiz-arcano-${id}`);
  }).length;
  const completedCount = totalCompletedArcanos;
  const journeyProgress = Math.round((totalCompletedArcanos / 78) * 100);



  const completeOnboarding = useCallback(() => {
    setProgress((prev) => ({ ...prev, onboardingCompleted: true }));
  }, []);

  const setStudentName = useCallback((name: string) => {
    setProgress((prev) => ({ ...prev, studentName: name }));
  }, []);

  const resetProgress = useCallback(async () => {
    setProgress({ ...DEFAULT_PROGRESS });
    localStorage.removeItem(LOCAL_EXTRAS_KEY);
    if (user) {
      await supabase
        .from("user_progress")
        .upsert({
          user_id: user.id,
          ...progressToDbCore(DEFAULT_PROGRESS)
        }, { onConflict: 'user_id' });
      await supabase
        .from("profiles")
        .upsert({ 
          user_id: user.id,
          student_name: "" 
        } as never, { onConflict: 'user_id' });
    }
  }, [user]);

  const value = {
    progress,
    loading,
    addXP,
    completeLesson,
    completeModule,
    completeQuiz,
    completeExercise,
    earnBadge,
    updateStreak,
    isArcanoCompleted,
    isArcanoUnlocked,
    getCurrentArcanoId,
    completedCount,
    journeyProgress,
    completeOnboarding,
    setStudentName,
    resetProgress,
  };

  return React.createElement(ProgressContext.Provider, { value }, children);
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
