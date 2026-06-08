import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Flame, BookOpen, RefreshCw, Sun, Target, TrendingUp, Check, Clock, Bell, BellOff, Settings2 } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { MODULES_CATALOG as MODULES, ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES, getArcanoFull as getArcanoById, isModuleUnlocked } from "@/lib/content";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const StudyRoutinePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress, completedCount, journeyProgress } = useProgress();
  const [loading, setLoading] = useState(true);
  const [pref, setPref] = useState<{ enabled: boolean; reminder_time: string } | null>(null);
  const [isiOS, setIsIOS] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Detect iOS and PWA
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsPWA(window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true);

    if (!user) return;

    const fetchPrefs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("enabled, reminder_time")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setPref(data);
      } else if (!data) {
        setPref({ enabled: false, reminder_time: "09:00" });
      }
      setLoading(false);
    };

    fetchPrefs();
  }, [user]);

  const toggleReminder = async () => {
    if (!user || !pref) return;

    if (!pref.enabled) {
      // 1. Request Browser Permission
      if (!("Notification" in window)) {
        toast.error("Este navegador não suporta notificações.");
        return;
      }

      if (Notification.permission === "denied") {
        toast.error("Notificações bloqueadas. Ative nas configurações do navegador.");
        return;
      }

      if (isiOS && !isPWA) {
        toast.error("No iPhone, adicione o app à Tela de Início para receber lembretes.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      // 2. Mock registration for now (real Web Push needs Service Worker registration)
      // In a real flow, we would call navigator.serviceWorker.ready.then(reg => reg.pushManager.subscribe(...))
    }

    const newEnabled = !pref.enabled;
    const { error } = await supabase
      .from("notification_preferences")
      .upsert({
        user_id: user.id,
        enabled: newEnabled,
        reminder_time: pref.reminder_time,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

    if (!error) {
      setPref({ ...pref, enabled: newEnabled });
      toast.success(newEnabled ? "Lembrete ritualístico ativado!" : "Lembrete desativado.");
    } else {
      toast.error("Erro ao salvar preferência.");
    }
  };

  const updateTime = async (time: string) => {
    if (!user || !pref) return;
    const { error } = await supabase
      .from("notification_preferences")
      .upsert({
        user_id: user.id,
        enabled: pref.enabled,
        reminder_time: time,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

    if (!error) {
      setPref({ ...pref, reminder_time: time });
      toast.success(`Horário alterado para ${time}`);
    }
  };

  // ─── Current lesson ───
  const currentArcanoId = progress.completedLessons.length; // Simplified for UI
  const currentArcano = getArcanoById(currentArcanoId);
  const currentModule = MODULES.find(m => {
    if (progress.completedModules.includes(m.id)) return false;
    return isModuleUnlocked(m.id, progress.completedModules);
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + i);
    return { day: WEEKDAYS[i], date: d.getDate(), isToday: d.toDateString() === new Date().toDateString(), active: i < 3 }; // Mock active
  });

  return (
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)", opacity: 0.98 }} />
      </div>

      <header className="relative z-10 bg-white/95 backdrop-blur-2xl border-b border-gold/20 shadow-sm">
        <div className="max-w-lg mx-auto py-6 px-6">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate("/app")} className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border border-[#C8A66A30] text-plum">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-[11px] tracking-[0.45em] uppercase font-heading font-black text-plum">
              <span className="text-gold">✦</span> Rotina Diária <span className="text-gold">✦</span>
            </span>
          </div>

          <div className="text-center">
            <h1 className="font-heading text-5xl font-black tracking-tight mb-4 text-plum">Sua Rotina</h1>
            <p className="font-body text-[14px] font-bold uppercase tracking-[0.2em] text-plum/60">
              Escolha um horário para receber seu chamado ritual.
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto px-6 pb-32 space-y-10 mt-12">
        
        {/* ═══════════════ NOTIFICATION CONFIG ═══════════════ */}
        <div className="relative rounded-[2.5rem] overflow-hidden p-8 transition-all duration-500 bg-white border-2 border-gold shadow-2xl shadow-plum/10">
          {loading ? (
            <div className="py-4 text-center animate-pulse text-plum/40">Sintonizando preferências...</div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-6">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 transition-all duration-500 ${pref?.enabled ? 'bg-plum border-gold text-white rotate-3 shadow-xl' : 'bg-gold/5 border-gold/20 text-gold'}`}>
                {pref?.enabled ? <Bell className="w-8 h-8" /> : <BellOff className="w-8 h-8" />}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-heading font-black text-plum">
                  {pref?.enabled ? `Lembrete ativo às ${pref.reminder_time.substring(0, 5)}` : "Chamado Diário"}
                </h3>
                {isiOS && !isPWA && (
                  <p className="text-[11px] font-body font-bold text-rose-500 uppercase tracking-wider">
                    Para receber lembretes no iPhone, adicione o Tarô 78 Chaves à Tela de Início.
                  </p>
                )}
              </div>

              {pref?.enabled ? (
                <div className="w-full grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-gold/5 border border-gold/20">
                    <Clock className="w-5 h-5 text-gold" />
                    <input 
                      type="time" 
                      value={pref.reminder_time.substring(0, 5)}
                      onChange={(e) => updateTime(e.target.value)}
                      className="bg-transparent font-heading font-bold text-plum focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={toggleReminder}
                    className="w-full py-4 rounded-2xl font-heading text-[10px] font-black tracking-[0.3em] uppercase text-plum/40 hover:text-plum transition-colors"
                  >
                    Desativar lembrete
                  </button>
                </div>
              ) : (
                <button 
                  onClick={toggleReminder}
                  className="w-full py-5 bg-plum text-white rounded-2xl font-heading text-[11px] font-black tracking-[0.3em] uppercase shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Ativar lembrete diário
                </button>
              )}
            </div>
          )}
        </div>

        {/* ═══════════════ WEEKLY OVERVIEW ═══════════════ */}
        <div className="relative rounded-[2.5rem] overflow-hidden p-8 transition-all duration-500 bg-white/80 backdrop-blur-md border border-gold/20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-plum text-gold border border-gold/30">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-heading font-black tracking-[0.25em] text-gold uppercase">Consistência</span>
                <span className="text-lg font-heading font-black text-plum">Sua Semana</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/5">
              <Flame className="w-4 h-4 text-plum" />
              <span className="text-[12px] font-heading font-black text-plum">{progress.streak} dias</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3 mb-6">
            {weekDays.map((d, i) => (
              <div key={i} className="text-center">
                <div className={`text-[10px] font-heading font-black uppercase mb-3 ${d.isToday ? "text-plum" : "text-plum/30"}`}>{d.day}</div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mx-auto transition-all border-2 ${d.active ? "bg-plum border-gold text-white" : d.isToday ? "bg-white border-gold text-plum" : "bg-plum/5 border-plum/10 text-plum/20"}`}>
                  {d.active ? <Check className="w-5 h-5" /> : <span className="text-[13px] font-heading font-black">{d.date}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-10">
          <p className="font-body text-[13px] font-bold italic text-plum/40 max-w-[200px] mx-auto leading-relaxed">
            "A constância transforma a estudante em mestra."
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudyRoutinePage;
