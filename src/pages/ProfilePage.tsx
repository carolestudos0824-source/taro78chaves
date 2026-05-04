import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Flame, Star, Trophy, BookOpen, Book, ChevronRight, Sparkles, Target, Award, Crown, Gift, Shield, LogOut, Type } from "lucide-react";
import { useIsAdmin } from "@/hooks/use-admin";
import { useProgress } from "@/hooks/use-progress";
import { usePremium } from "@/hooks/use-premium";
import { useGiftCode } from "@/hooks/use-gift-code";
import { useAuth } from "@/hooks/use-auth";
import { useFontSize, type FontSize } from "@/contexts/font-size-context";
import { ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES, MODULES_CATALOG as MODULES, getArcanoFull as getArcanoById } from "@/lib/content";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ornamentDivider from "@/assets/ornament-divider.png";

const LEVEL_TITLES: Record<number, string> = {
  1: "Neófito",
  2: "Aprendiz",
  3: "Estudante",
  4: "Buscador",
  5: "Iniciado",
  6: "Adepto",
  7: "Guardião",
  8: "Mestre",
  9: "Oráculo",
  10: "Iluminado",
};

const getLevelTitle = (level: number) => LEVEL_TITLES[Math.min(level, 10)] || "Iluminado";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { progress, completedCount, journeyProgress, getCurrentArcanoId } = useProgress();
  const { isPremium, premiumUntil, premiumSource } = usePremium();
  const { redeem, loading: redeemLoading } = useGiftCode();
  const { signOut, user } = useAuth();
  const { fontSize, setFontSize } = useFontSize();
  const [giftCode, setGiftCode] = useState("");
  const [showGiftInput, setShowGiftInput] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const handleOpenPortal = async () => {
    if (portalLoading) return;
    setPortalLoading(true);
    const loadingToast = toast.loading("Abrindo portal de assinatura...");
    try {
      const { data, error } = await supabase.functions.invoke("stripe-customer-portal", {
        body: {},
      });
      toast.dismiss(loadingToast);
      if (error || !data?.url) {
        const msg = (data as { message?: string } | null)?.message;
        toast.error(msg || "Não foi possível abrir o portal. Tente novamente.");
        setPortalLoading(false);
        return;
      }
      window.location.href = data.url as string;
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Erro inesperado ao abrir o portal.");
      setPortalLoading(false);
    }
  };

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
      toast.success("Pagamento confirmado! Seu acesso premium será ativado em instantes.");
      const next = new URLSearchParams(searchParams);
      next.delete("checkout");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
      toast.success("Sessão encerrada.");
      navigate("/auth", { replace: true });
    } catch (e) {
      toast.error("Não foi possível sair. Tente novamente.");
      setSigningOut(false);
    }
  };
  const earnedBadges = progress.badges.filter(b => b.earned);
  const unearnedBadges = progress.badges.filter(b => !b.earned);
  const xpInLevel = progress.xp % 100;
  const xpToNext = 100;
  const currentArcanoId = getCurrentArcanoId();
  const currentArcano = ARCANOS_MAIORES.find(a => a.id === currentArcanoId);
  const completedModulesCount = progress.completedModules.length;

  // Recent activity — last 5 completed lessons
  const recentLessons = [...progress.completedLessons].reverse().slice(0, 5).map(id => {
    const match = id.match(/arcano-(\d+)/);
    if (match) {
      const arcano = getArcanoById(parseInt(match[1]));
      return arcano ? { id, label: arcano.name, numeral: arcano.numeral } : null;
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(42 70% 80% / 0.15) 0%, transparent 60%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 80% 100%, hsl(340 42% 30% / 0.06) 0%, transparent 50%)",
        }} />
        <div className="absolute top-6 left-6 text-2xl" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✦</div>
        <div className="absolute top-6 right-6 text-2xl" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✧</div>

        <div className="relative max-w-2xl mx-auto px-6 pt-8 pb-10">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/app")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-body">Voltar</span>
            </button>
            <div className="flex items-center gap-2">
              {!adminLoading && isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Painel Admin</span>
                </button>
              )}
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                aria-label="Sair da conta"
                title="Sair da conta"
                data-testid="profile-signout-header"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-heading tracking-wide transition-colors disabled:opacity-60"
                style={{
                  background: "hsl(340 42% 28% / 0.08)",
                  color: "hsl(340 42% 28%)",
                  border: "1px solid hsl(340 42% 28% / 0.25)",
                }}
              >
                <LogOut className="w-4 h-4" />
                <span>{signingOut ? "Saindo..." : "Sair"}</span>
              </button>
            </div>
          </div>

          {/* Avatar / Level */}
          <div className="text-center space-y-3">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{
                background: "linear-gradient(135deg, hsl(340 42% 30% / 0.10), hsl(36 45% 58% / 0.12))",
                border: "2px solid hsl(36 45% 58% / 0.30)",
                boxShadow: "0 0 30px hsl(42 70% 80% / 0.12)",
              }}>
                <span className="font-heading text-2xl" style={{ color: "hsl(340 42% 22%)" }}>
                  {getLevelTitle(progress.level).charAt(0)}
                </span>
              </div>
              {/* Level badge */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-heading" style={{
                background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(36 42% 44%))",
                color: "hsl(36 33% 97%)",
                boxShadow: "0 2px 8px hsl(340 42% 28% / 0.25)",
              }}>
                {progress.level}
              </div>
            </div>

            <div>
              <h1 className="font-heading text-2xl tracking-wide" style={{
                background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {getLevelTitle(progress.level)}
              </h1>
              <p className="font-accent text-sm italic mt-1" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
                Nível {progress.level} · {progress.xp} XP total
              </p>
            </div>

            {/* XP Progress */}
            <div className="max-w-xs mx-auto">
              <div className="flex justify-between text-[10px] font-body mb-1" style={{ color: "hsl(230 15% 30% / 0.45)" }}>
                <span>{xpInLevel} / {xpToNext} XP</span>
                <span>Nível {progress.level + 1}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{
                background: "hsl(36 18% 84%)",
                border: "1px solid hsl(36 22% 75% / 0.50)",
              }}>
                <div className="h-full rounded-full transition-all duration-700" style={{
                  width: `${(xpInLevel / xpToNext) * 100}%`,
                  background: "linear-gradient(90deg, hsl(340 42% 26%), hsl(36 42% 44%), hsl(42 55% 60%))",
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-16 space-y-8">

        {/* ═══════════════ STATS GRID ═══════════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Flame, value: progress.streak, label: "Dias seguidos", color: "hsl(340 42% 26%)" },
            { icon: Star, value: completedCount, label: "Arcanos", color: "hsl(36 42% 40%)" },
            { icon: BookOpen, value: completedModulesCount, label: "Módulos", color: "hsl(340 42% 30%)" },
            { icon: Trophy, value: earnedBadges.length, label: "Conquistas", color: "hsl(36 45% 50%)" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="rounded-xl p-4 text-center" style={{
                background: "hsl(38 28% 93% / 0.75)",
                border: "1px solid hsl(36 45% 50% / 0.18)",
              }}>
                <Icon className="w-4 h-4 mx-auto mb-2" style={{ color: s.color }} />
                <div className="font-heading text-xl tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
                  {s.value}
                </div>
                <div className="text-[9px] tracking-[0.2em] uppercase font-body mt-0.5" style={{ color: "hsl(230 15% 30% / 0.45)" }}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══════════════ JOURNEY PROGRESS ═══════════════ */}
        <div className="rounded-xl p-5" style={{
          background: "hsl(38 28% 93% / 0.75)",
          border: "1px solid hsl(36 45% 50% / 0.18)",
        }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-sm tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
              Jornada do Louco
            </h2>
            <span className="font-heading text-sm" style={{ color: "hsl(36 42% 40%)" }}>
              {journeyProgress}%
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{
            background: "hsl(36 18% 84%)",
            border: "1px solid hsl(36 22% 75% / 0.50)",
          }}>
            <div className="h-full rounded-full transition-all duration-1000 relative overflow-hidden" style={{
              width: `${Math.max(journeyProgress, 2)}%`,
              background: "linear-gradient(90deg, hsl(340 42% 26%), hsl(36 42% 44%), hsl(42 55% 60%))",
            }}>
              <div className="absolute inset-0 w-1/3 h-full" style={{
                background: "linear-gradient(90deg, transparent, hsl(42 70% 78% / 0.60), transparent)",
                animation: "progress-shine 2.5s ease-in-out infinite",
              }} />
            </div>
          </div>
          <p className="text-[10px] font-body" style={{ color: "hsl(230 15% 30% / 0.40)" }}>
            {completedCount} de 22 arcanos concluídos
          </p>
        </div>

        {/* ═══════════════ JOURNEY NOTEBOOK ═══════════════ */}
        <button 
          onClick={() => navigate("/minha-jornada")}
          className="w-full flex items-center justify-between rounded-xl p-5 group transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, hsl(36 45% 58% / 0.1), hsl(340 42% 30% / 0.05))",
            border: "1px solid hsl(36 45% 58% / 0.2)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center border border-hsl(36 45% 58% / 0.2)">
              <Book className="w-5 h-5 text-primary" style={{ color: "hsl(36 45% 58%)" }} />
            </div>
            <div className="text-left">
              <h2 className="font-heading text-sm tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
                Caderno da Jornada
              </h2>
              <p className="text-[10px] font-body opacity-60">
                Veja suas reflexões e aprendizados
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* ═══════════════ CONQUISTAS ═══════════════ */}
        <div>
          <div className="flex items-center justify-center mb-3">
            <img src={ornamentDivider} alt="" className="w-24 h-auto opacity-40" loading="lazy" width={800} height={512} />
          </div>
          <h2 className="font-heading text-sm tracking-wide text-center mb-4" style={{ color: "hsl(340 42% 22%)" }}>
            Conquistas
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {earnedBadges.map(b => (
              <div key={b.id} className="rounded-xl p-4 text-center" style={{
                background: "linear-gradient(135deg, hsl(36 45% 58% / 0.08), hsl(340 42% 30% / 0.06))",
                border: "1px solid hsl(36 45% 58% / 0.25)",
              }}>
                <span className="text-2xl block mb-1.5">{b.icon}</span>
                <div className="font-heading text-[11px] tracking-wide mb-0.5" style={{ color: "hsl(340 42% 22%)" }}>
                  {b.name}
                </div>
                <div className="text-[9px] font-body" style={{ color: "hsl(230 15% 30% / 0.40)" }}>
                  {b.description}
                </div>
              </div>
            ))}
            {unearnedBadges.map(b => (
              <div key={b.id} className="rounded-xl p-4 text-center opacity-40" style={{
                background: "hsl(36 18% 90% / 0.50)",
                border: "1px solid hsl(36 20% 82% / 0.30)",
              }}>
                <span className="text-2xl block mb-1.5 grayscale">{b.icon}</span>
                <div className="font-heading text-[11px] tracking-wide mb-0.5" style={{ color: "hsl(230 15% 30% / 0.40)" }}>
                  {b.name}
                </div>
                <div className="text-[9px] font-body" style={{ color: "hsl(230 15% 30% / 0.30)" }}>
                  {b.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ RECENT ACTIVITY ═══════════════ */}
        {recentLessons.length > 0 && (
          <div>
            <div className="flex items-center justify-center mb-3">
              <img src={ornamentDivider} alt="" className="w-24 h-auto opacity-40" loading="lazy" width={800} height={512} />
            </div>
            <h2 className="font-heading text-sm tracking-wide text-center mb-4" style={{ color: "hsl(340 42% 22%)" }}>
              Recentes
            </h2>
            <div className="space-y-2">
              {recentLessons.map(item => item && (
                <div key={item.id} className="flex items-center gap-3 rounded-lg p-3" style={{
                  background: "hsl(38 28% 93% / 0.60)",
                  border: "1px solid hsl(36 25% 82% / 0.40)",
                }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{
                    background: "hsl(36 45% 58% / 0.10)",
                    border: "1px solid hsl(36 45% 58% / 0.20)",
                  }}>
                    <span className="font-heading text-xs" style={{ color: "hsl(340 42% 22%)" }}>{item.numeral}</span>
                  </div>
                  <span className="font-body text-sm" style={{ color: "hsl(230 25% 12%)" }}>{item.label}</span>
                  <Sparkles className="w-3 h-3 ml-auto" style={{ color: "hsl(36 45% 58% / 0.40)" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════ TAMANHO DA FONTE ═══════════════ */}
        <div>
          <div className="flex items-center justify-center mb-3">
            <img src={ornamentDivider} alt="" className="w-24 h-auto opacity-40" loading="lazy" width={800} height={512} />
          </div>
          <h2 className="t-section-title text-center mb-1" style={{ color: "hsl(340 42% 22%)" }}>
            Tamanho da fonte
          </h2>
          <p className="t-card-subtitle text-center mb-4">
            Ajuste o tamanho do texto em todo o app
          </p>

          <div
            className="rounded-xl p-4 flex items-center justify-center gap-3"
            style={{
              background: "hsl(38 28% 93% / 0.75)",
              border: "1px solid hsl(36 45% 50% / 0.18)",
            }}
          >
            <Type className="w-4 h-4" style={{ color: "hsl(36 42% 40%)" }} aria-hidden="true" />
            {([
              { id: "normal", label: "A", size: "text-base", aria: "Tamanho normal" },
              { id: "large",  label: "A+", size: "text-lg",  aria: "Tamanho grande" },
              { id: "xl",     label: "A++", size: "text-xl", aria: "Tamanho extra grande" },
            ] as Array<{ id: FontSize; label: string; size: string; aria: string }>).map((opt) => {
              const active = fontSize === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFontSize(opt.id)}
                  aria-pressed={active}
                  aria-label={opt.aria}
                  className={`${opt.size} font-display font-semibold rounded-lg px-4 py-2 transition-all duration-200`}
                  style={{
                    background: active ? "linear-gradient(135deg, hsl(340 42% 26%), hsl(36 42% 44%))" : "hsl(36 33% 96%)",
                    color: active ? "hsl(36 33% 97%)" : "hsl(340 42% 22%)",
                    border: active ? "1px solid hsl(36 45% 58% / 0.40)" : "1px solid hsl(36 25% 80% / 0.50)",
                    boxShadow: active ? "0 2px 8px hsl(340 42% 28% / 0.20)" : "none",
                    minWidth: "3rem",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══════════════ ASSINATURA ═══════════════ */}
        <div>
          <div className="flex items-center justify-center mb-3">
            <img src={ornamentDivider} alt="" className="w-24 h-auto opacity-40" loading="lazy" width={800} height={512} />
          </div>
          <h2 className="font-heading text-sm tracking-wide text-center mb-4" style={{ color: "hsl(340 42% 22%)" }}>
            Assinatura
          </h2>

          {isPremium ? (
            <div className="rounded-xl p-5" style={{
              background: "linear-gradient(135deg, hsl(36 45% 58% / 0.08), hsl(340 42% 30% / 0.06))",
              border: "1.5px solid hsl(36 45% 58% / 0.25)",
            }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                  background: "linear-gradient(135deg, hsl(340 42% 28% / 0.10), hsl(36 45% 58% / 0.15))",
                }}>
                  <Crown className="w-5 h-5" style={{ color: "hsl(36 45% 50%)" }} />
                </div>
                <div>
                  <p className="font-heading text-sm tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
                    Jornada Completa
                  </p>
                  <span className="text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full" style={{
                    background: "hsl(140 35% 45% / 0.10)",
                    color: "hsl(140 35% 38%)",
                  }}>
                    Ativo
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-[11px] font-body" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
                {premiumSource && (
                  <div className="flex justify-between">
                    <span>Tipo</span>
                    <span style={{ color: "hsl(340 42% 22%)" }}>
                      {premiumSource === "gift" ? "Presente" : premiumSource === "admin" ? "Administrativo" : "Assinatura"}
                    </span>
                  </div>
                )}
                {premiumUntil && (
                  <div className="flex justify-between">
                    <span>Válido até</span>
                    <span style={{ color: "hsl(340 42% 22%)" }}>
                      {new Date(premiumUntil).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleOpenPortal}
                disabled={portalLoading || premiumSource === "gift" || premiumSource === "admin"}
                className="mt-3 text-[10px] font-heading tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ color: "hsl(340 42% 28% / 0.55)" }}
              >
                {portalLoading ? "Abrindo..." : "Gerenciar assinatura →"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/premium")}
              className="w-full group rounded-xl p-4 transition-all duration-300 hover:shadow-md text-left"
              style={{
                background: "linear-gradient(135deg, hsl(38 28% 93% / 0.90), hsl(36 33% 95% / 0.85))",
                border: "1.5px solid hsl(36 45% 58% / 0.25)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{
                  background: "linear-gradient(135deg, hsl(340 42% 30% / 0.10), hsl(36 45% 58% / 0.12))",
                  border: "1.5px solid hsl(36 45% 58% / 0.25)",
                }}>
                  <Crown className="w-5 h-5" style={{ color: "hsl(36 45% 50%)" }} />
                </div>
                <div className="flex-1">
                  <div className="font-heading text-base tracking-wide" style={{ color: "hsl(230 25% 12%)" }}>
                    Jornada Completa
                  </div>
                  <div className="font-accent text-xs italic" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                    Desbloqueie todos os arcanos e módulos
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(36 42% 45% / 0.40)" }} />
              </div>
            </button>
          )}
        </div>

        {/* ═══════════════ CÓDIGO DE PRESENTE ═══════════════ */}
        {!isPremium && (
          <div>
            <div className="flex items-center justify-center mb-3">
              <img src={ornamentDivider} alt="" className="w-24 h-auto opacity-40" loading="lazy" width={800} height={512} />
            </div>
            <h2 className="font-heading text-sm tracking-wide text-center mb-4" style={{ color: "hsl(340 42% 22%)" }}>
              Código de Presente
            </h2>

            {!showGiftInput ? (
              <button
                onClick={() => setShowGiftInput(true)}
                className="w-full group rounded-xl p-4 transition-all duration-300 hover:shadow-md text-left"
                style={{
                  background: "linear-gradient(135deg, hsl(38 28% 93% / 0.90), hsl(36 33% 95% / 0.85))",
                  border: "1.5px solid hsl(36 45% 58% / 0.25)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{
                    background: "linear-gradient(135deg, hsl(340 42% 30% / 0.10), hsl(36 45% 58% / 0.12))",
                    border: "1.5px solid hsl(36 45% 58% / 0.25)",
                  }}>
                    <Gift className="w-5 h-5" style={{ color: "hsl(36 45% 50%)" }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-heading text-base tracking-wide" style={{ color: "hsl(230 25% 12%)" }}>
                      Tenho um código
                    </div>
                    <div className="font-accent text-xs italic" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                      Resgate seu presente e desbloqueie o acesso
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(36 42% 45% / 0.40)" }} />
                </div>
              </button>
            ) : (
              <div className="rounded-xl p-5 space-y-3" style={{
                background: "hsl(38 28% 93% / 0.75)",
                border: "1px solid hsl(36 45% 50% / 0.18)",
              }}>
                <div className="flex gap-2">
                  <Input
                    value={giftCode}
                    onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
                    placeholder="ARCANO-XXXXXX"
                    className="font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    disabled={redeemLoading || !giftCode.trim()}
                    onClick={async () => {
                      const result = await redeem(giftCode);
                      if (result.success) {
                        toast.success(`Presente resgatado! ${result.days} dias de acesso premium.`);
                        setGiftCode("");
                        setShowGiftInput(false);
                        window.location.reload();
                      } else {
                        toast.error(result.error || "Erro ao resgatar código.");
                      }
                    }}
                  >
                    {redeemLoading ? "..." : "Resgatar"}
                  </Button>
                </div>
                <button
                  onClick={() => { setShowGiftInput(false); setGiftCode(""); }}
                  className="text-[10px] text-muted-foreground hover:text-foreground"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════ CERTIFICADOS LINK ═══════════════ */}
        <div>
          <div className="flex items-center justify-center mb-3">
            <img src={ornamentDivider} alt="" className="w-24 h-auto opacity-40" loading="lazy" width={800} height={512} />
          </div>
          <button
            onClick={() => navigate("/certificados")}
            className="w-full group rounded-xl p-4 transition-all duration-300 hover:shadow-md text-left"
            style={{
              background: "linear-gradient(135deg, hsl(38 28% 93% / 0.90), hsl(36 33% 95% / 0.85))",
              border: "1.5px solid hsl(36 45% 58% / 0.25)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{
                background: "linear-gradient(135deg, hsl(340 42% 30% / 0.10), hsl(36 45% 58% / 0.12))",
                border: "1.5px solid hsl(36 45% 58% / 0.25)",
              }}>
                <Award className="w-5 h-5" style={{ color: "hsl(340 42% 24%)" }} />
              </div>
              <div className="flex-1">
                <div className="font-heading text-base tracking-wide" style={{ color: "hsl(230 25% 12%)" }}>
                  Certificados
                </div>
                <div className="font-accent text-xs italic" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                  Suas conquistas na formação
                </div>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(36 42% 45% / 0.40)" }} />
            </div>
          </button>
        </div>

        {/* ═══════════════ NEXT STEPS ═══════════════ */}
        {currentArcano && completedCount < 22 && (
          <div>
            <div className="flex items-center justify-center mb-3">
              <img src={ornamentDivider} alt="" className="w-24 h-auto opacity-40" loading="lazy" width={800} height={512} />
            </div>
            <h2 className="font-heading text-sm tracking-wide text-center mb-4" style={{ color: "hsl(340 42% 22%)" }}>
              Próximo Passo
            </h2>

            <button
              onClick={() => navigate(`/lesson/${currentArcanoId}`)}
              className="w-full group rounded-xl p-4 transition-all duration-300 hover:shadow-md text-left"
              style={{
                background: "linear-gradient(135deg, hsl(38 28% 93% / 0.90), hsl(36 33% 95% / 0.85))",
                border: "1.5px solid hsl(340 42% 28% / 0.25)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{
                  background: "linear-gradient(135deg, hsl(340 42% 30% / 0.10), hsl(36 45% 58% / 0.12))",
                  border: "1.5px solid hsl(36 45% 58% / 0.25)",
                }}>
                  <Target className="w-5 h-5" style={{ color: "hsl(340 42% 24%)" }} />
                </div>
                <div className="flex-1">
                  <div className="text-[9px] tracking-[0.3em] uppercase font-body mb-0.5" style={{ color: "hsl(340 42% 28% / 0.55)" }}>
                    Continuar jornada
                  </div>
                  <div className="font-heading text-base tracking-wide" style={{ color: "hsl(230 25% 12%)" }}>
                    {currentArcano.name}
                  </div>
                  <div className="font-accent text-xs italic" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                    {currentArcano.subtitle}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(36 42% 45% / 0.40)" }} />
              </div>
            </button>
          </div>
        )}

        {/* ═══════════════ SAIR ═══════════════ */}
        <div>
          <div className="flex items-center justify-center mb-3">
            <img src={ornamentDivider} alt="" className="w-24 h-auto opacity-40" loading="lazy" width={800} height={512} />
          </div>
          {user?.email && (
            <p className="text-center text-[11px] font-body mb-3" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
              Conectado como <span style={{ color: "hsl(340 42% 22%)" }}>{user.email}</span>
            </p>
          )}
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full group rounded-xl p-4 transition-all duration-300 hover:shadow-md text-left disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, hsl(38 28% 93% / 0.90), hsl(36 33% 95% / 0.85))",
              border: "1.5px solid hsl(340 42% 28% / 0.25)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{
                background: "linear-gradient(135deg, hsl(340 42% 30% / 0.10), hsl(36 45% 58% / 0.12))",
                border: "1.5px solid hsl(340 42% 28% / 0.25)",
              }}>
                <LogOut className="w-5 h-5" style={{ color: "hsl(340 42% 28%)" }} />
              </div>
              <div className="flex-1">
                <div className="font-heading text-base tracking-wide" style={{ color: "hsl(230 25% 12%)" }}>
                  {signingOut ? "Saindo..." : "Sair"}
                </div>
                <div className="font-accent text-xs italic" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                  Encerrar sessão e trocar de conta
                </div>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(36 42% 45% / 0.40)" }} />
            </div>
          </button>

          {/* Legal & compliance */}
          <nav className="pt-6 mt-2 border-t flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px]" style={{ borderColor: "hsl(36 25% 75% / 0.4)", color: "hsl(230 20% 25% / 0.65)" }}>
            <a href="/privacidade" className="hover:underline">Privacidade</a>
            <a href="/termos" className="hover:underline">Termos</a>
            <a href="/suporte" className="hover:underline">Suporte</a>
            <a href="/excluir-conta" className="hover:underline">Excluir conta</a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
