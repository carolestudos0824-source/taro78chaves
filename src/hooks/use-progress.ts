import { useState, useEffect, useCallback, useRef } from "react";
import { DEFAULT_PROGRESS, type Badge, type UserProgress } from "@/lib/content";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";

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
      };
    }
  } catch { /* ignore */ }
  return {
    badges: DEFAULT_PROGRESS.badges,
    currentModule: DEFAULT_PROGRESS.currentModule,
    studentName: DEFAULT_PROGRESS.studentName,
    certificatesEarned: DEFAULT_PROGRESS.certificatesEarned,
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

export function useProgress() {
  const { user } = useAuth();
  const { isStaff } = useRole();
  const [progress, setProgress] = useState<UserProgress>({ ...DEFAULT_PROGRESS, ...getLocalExtras() });
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedCoreRef = useRef<string>("");
  const lastSavedNameRef = useRef<string>("");

  // ─── Fetch from Supabase when user is available ───
  useEffect(() => {
    if (!user) {
      setProgress({ ...DEFAULT_PROGRESS, ...getLocalExtras() });
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchProgress = async () => {
      const [{ data: progressRow }, { data: profileRow }, { data: scoresData }] = await Promise.all([
        supabase.from("user_progress").select("*").eq("user_id", user.id).maybeSingle(),
        // student_name lives on profiles; cast because generated types may lag the migration
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        // fetch quiz scores for progressive unlock
        supabase.from("quiz_responses").select("quiz_id, is_correct").eq("user_id", user.id),
      ]);

      if (cancelled) return;

      const quizScores: Record<string, number> = {};
      if (scoresData) {
        const counts: Record<string, { correct: number; total: number }> = {};
        scoresData.forEach(r => {
          if (!counts[r.quiz_id]) counts[r.quiz_id] = { correct: 0, total: 0 };
          counts[r.quiz_id].total++;
          if (r.is_correct) counts[r.quiz_id].correct++;
        });
        Object.entries(counts).forEach(([id, { correct, total }]) => {
          quizScores[id] = correct / total;
        });
      }

      if (progressRow) {
        const studentName = (profileRow as Record<string, unknown> | null)?.student_name as string
          ?? getLocalExtras().studentName
          ?? "";
        const next = dbToProgress(progressRow as unknown as DbProgress, studentName);
        setProgress(next);
        // Refresh local cache to match DB
        saveLocalExtras({
          badges: next.badges,
          currentModule: next.currentModule,
          studentName: next.studentName,
          certificatesEarned: next.certificatesEarned,
        });
      }
      setLoading(false);
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
    });

    if (!coreChanged && !nameChanged) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (coreChanged) {
        lastSavedCoreRef.current = coreSnapshot;
        await supabase
          .from("user_progress")
          .update(corePayload)
          .eq("user_id", user.id);
      }
      if (nameChanged) {
        lastSavedNameRef.current = nameSnapshot;
        await supabase
          .from("profiles")
          // student_name was just added; cast to keep TS happy until types regen
          .update({ student_name: nameSnapshot } as never)
          .eq("user_id", user.id);
      }
    }, 300);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [progress, user, loading]);

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
      const lastActive = new Date(prev.lastActive);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        return { ...prev, streak: prev.streak + 1, lastActive: now.toISOString() };
      } else if (diffDays > 1) {
        return { ...prev, streak: 1, lastActive: now.toISOString() };
      }
      return prev;
    });
  }, []);

  const isArcanoCompleted = useCallback((arcanoId: number): boolean => {
    return (
      progress.completedLessons.includes(`arcano-${arcanoId}`) &&
      progress.completedQuizzes.includes(`quiz-arcano-${arcanoId}`)
    );
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

  const completedCount = progress.completedLessons.filter(l => l.startsWith("arcano-")).length;
  const journeyProgress = Math.round((completedCount / 22) * 100);

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
        .update(progressToDbCore(DEFAULT_PROGRESS))
        .eq("user_id", user.id);
      await supabase
        .from("profiles")
        .update({ student_name: "" } as never)
        .eq("user_id", user.id);
    }
  }, [user]);

  return {
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
}
