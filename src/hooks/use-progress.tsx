import React, { useState, useEffect, useCallback, useRef, createContext, useContext, useMemo } from "react";
import { DEFAULT_PROGRESS, type Badge, type UserProgress } from "@/lib/content";
import { FUNDAMENTOS_LESSONS } from "@/content/lessons/fundamentos";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import { toast } from "sonner";

const LOCAL_EXTRAS_KEY = "tarot-journey-extras";

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
    badges: p.badges as unknown as never,
    certificates_earned: p.certificatesEarned as unknown as never,
    current_module: p.currentModule,
  };
}

interface ProgressContextType {
  progress: UserProgress;
  loading: boolean;
  addKey: () => void;
  /** @deprecated XP foi removido; mantido como no-op para compatibilidade. */
  addXP: (amount?: number) => void;
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
  fundamentosComplete: boolean;
  fundamentosLessonsCompleted: number;
  isFirstVisit: boolean;
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
  const hasCachedData = progress.completedLessons.length > 0;
  const [loading, setLoading] = useState(!hasCachedData);

  const prevUserIdRef = useRef<string | undefined>(user?.id);

  useEffect(() => {
    if (user?.id !== prevUserIdRef.current) {
      if (!user) {
        localStorage.removeItem(LOCAL_EXTRAS_KEY);
      }
      setProgress({ ...DEFAULT_PROGRESS });
      setLoading(!!user);
      prevUserIdRef.current = user?.id;
    }
  }, [user]);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedCoreRef = useRef<string>("");
  const lastSavedNameRef = useRef<string>("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setProgress({ ...DEFAULT_PROGRESS, ...getLocalExtras() });
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchProgress = async () => {
      try {
        const { data: progressRow, error: progressError } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (progressError) throw progressError;

        const { data: profileRow, error: profileError } = await supabase
          .from("profiles")
          .select("student_name")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (progressRow) {
          const dbData = dbToProgress(progressRow as any, profileRow?.student_name ?? "");
          if (!cancelled) {
            setProgress(dbData);
            lastSavedCoreRef.current = JSON.stringify(progressToDbCore(dbData));
            lastSavedNameRef.current = profileRow?.student_name ?? "";
          }
        } else {
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
  }, [user, authLoading]);

  useEffect(() => {
    if (!user || loading || isStaff) return;

    const corePayload = progressToDbCore(progress);
    const coreSnapshot = JSON.stringify(corePayload);
    const nameSnapshot = progress.studentName ?? "";

    const coreChanged = coreSnapshot !== lastSavedCoreRef.current;
    const nameChanged = nameSnapshot !== lastSavedNameRef.current;

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
        lastSavedCoreRef.current = coreSnapshot;
        let error = null;
        const lastLesson = corePayload.completed_lessons[corePayload.completed_lessons.length - 1];
        if (lastLesson) {
          const { error: rpcError } = await supabase.rpc("complete_lesson_v2", { lesson_id_param: lastLesson });
          error = rpcError;
        }
        const lastModule = corePayload.completed_modules[corePayload.completed_modules.length - 1];
        if (lastModule && !error) {
          const { error: rpcError } = await supabase.rpc("complete_module_v2", { module_id_param: lastModule });
          error = rpcError;
        }
        if (error) {
          lastSavedCoreRef.current = "";
          toast.error("Erro ao salvar progresso.");
        }
      }
      if (nameChanged) {
        lastSavedNameRef.current = nameSnapshot;
        await supabase.from("profiles").update({ student_name: nameSnapshot }).eq("user_id", user.id);
      }
    }, 300);

    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [progress, user, loading, isStaff]);

  useEffect(() => {
    if (!user || loading) return;
    const oldKey = "tarot-journey-progress";
    const old = localStorage.getItem(oldKey);
    if (!old) return;

    try {
      const parsed = JSON.parse(old);
      if (parsed.completedLessons?.length > 0) {
        setProgress(prev => ({
          ...prev,
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

  const addKey = useCallback(() => {
    if (isStaff) return;
  }, [isStaff]);

  const completeModule = useCallback((moduleId: string) => {
    if (isStaff) return;
    setProgress((prev) => {
      if (prev.completedModules.includes(moduleId)) return prev;
      return { ...prev, completedModules: [...prev.completedModules, moduleId] };
    });
  }, [isStaff]);

  const completeLesson = useCallback((lessonId: string) => {
    if (isStaff) return;
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return { ...prev, completedLessons: [...prev.completedLessons, lessonId], lastActive: new Date().toISOString() };
    });
  }, [isStaff]);

  const completeQuiz = useCallback((quizId: string, score?: number, total?: number) => {
    if (isStaff) return;
    setProgress((prev) => {
      const nextScores = { ...prev.quizScores };
      if (score !== undefined && total !== undefined && total > 0) nextScores[quizId] = score / total;
      if (prev.completedQuizzes.includes(quizId) && prev.quizScores[quizId] === nextScores[quizId]) return prev;
      return { ...prev, completedQuizzes: prev.completedQuizzes.includes(quizId) ? prev.completedQuizzes : [...prev.completedQuizzes, quizId], quizScores: nextScores };
    });
  }, [isStaff]);

  const completeExercise = useCallback((exerciseId: string) => {
    if (isStaff) return;
    setProgress((prev) => {
      if (prev.completedExercises.includes(exerciseId)) return prev;
      return { ...prev, completedExercises: [...prev.completedExercises, exerciseId] };
    });
  }, [isStaff]);

  const earnBadge = useCallback((badgeId: string) => {
    if (isStaff) return;
    setProgress((prev) => ({
      ...prev,
      badges: prev.badges.map((b) => b.id === badgeId ? { ...b, earned: true, earnedAt: new Date().toISOString() } : b),
    }));
  }, [isStaff]);

  const updateStreak = useCallback(() => {
    if (isStaff) return;
    setProgress((prev) => {
      const lastActiveDate = prev.lastActive ? new Date(prev.lastActive) : null;
      const now = new Date();
      if (!lastActiveDate) return { ...prev, streak: 1, lastActive: now.toISOString() };
      const diffDays = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) return { ...prev, streak: prev.streak + 1, lastActive: now.toISOString() };
      else if (diffDays > 1) return { ...prev, streak: 1, lastActive: now.toISOString() };
      return prev;
    });
  }, [isStaff]);

  const isArcanoCompleted = useCallback((arcanoId: number): boolean => {
    const hasLesson = progress.completedLessons.includes(`arcano-${arcanoId}`);
    const hasQuiz = progress.completedQuizzes.includes(`quiz-arcano-${arcanoId}`);
    return hasLesson && hasQuiz;
  }, [progress.completedLessons, progress.completedQuizzes]);

  const isArcanoUnlocked = useCallback((arcanoId: number): boolean => {
    if (isStaff) return true;
    
    const fundamentosComplete = progress.completedModules.includes("fundamentos");
    const lesson1Complete = progress.completedLessons.includes("fundamentos-0");

    // Arcano 0 (O Louco) is unlocked after Lesson 1 of Fundamentos
    if (arcanoId === 0) return lesson1Complete;
    
    // Other arcanos require Fundamentos complete AND previous arcano complete
    if (!fundamentosComplete) return false;
    return isArcanoCompleted(arcanoId - 1);
  }, [progress.completedModules, progress.completedLessons, isArcanoCompleted, isStaff]);

  const getCurrentArcanoId = useCallback((): number => {
    for (let i = 0; i <= 21; i++) {
      if (!isArcanoCompleted(i)) return i;
    }
    return 21;
  }, [isArcanoCompleted]);

  const completedCount = useMemo(() => progress.completedLessons.length, [progress.completedLessons]);
  const journeyProgress = useMemo(() => Math.round((completedCount / 78) * 100), [completedCount]);
  const fundamentosComplete = useMemo(() => progress.completedModules.includes("fundamentos"), [progress.completedModules]);
  const fundamentosLessonsCompleted = useMemo(() => FUNDAMENTOS_LESSONS.filter(l => progress.completedLessons.includes(l.id)).length, [progress.completedLessons]);
  const isFirstVisit = useMemo(() => !progress.onboardingCompleted, [progress.onboardingCompleted]);

  const completeOnboarding = useCallback(() => {
    setProgress(p => ({ ...p, onboardingCompleted: true }));
  }, []);

  const setStudentName = useCallback((studentName: string) => {
    setProgress(p => ({ ...p, studentName }));
  }, []);

  const resetProgress = useCallback(async () => {
    setProgress({ ...DEFAULT_PROGRESS });
    localStorage.removeItem(LOCAL_EXTRAS_KEY);
    if (user) {
      await supabase.from("user_progress").delete().eq("user_id", user.id);
    }
  }, [user]);

  return (
    <ProgressContext.Provider value={{
      progress, loading, addKey, addXP: () => {}, completeLesson, completeModule, completeQuiz, completeExercise, earnBadge, updateStreak,
      isArcanoCompleted, isArcanoUnlocked, getCurrentArcanoId, completedCount, journeyProgress, fundamentosComplete,
      fundamentosLessonsCompleted, isFirstVisit, completeOnboarding, setStudentName, resetProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used within a ProgressProvider");
  return context;
};
