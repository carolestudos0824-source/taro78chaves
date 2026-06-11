import { useNavigate } from "react-router-dom";
import { Lock, Check, ChevronRight, Sparkles, Layout, Droplets, Flame, Sword, Gem } from "lucide-react";
import { PageBackControls } from "@/components/PageBackControls";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { ChaveProgress } from "@/components/ChaveProgress";
import { StreakCounter } from "@/components/StreakCounter";
import { useHeader } from "@/contexts/header-context";
import { useEffect } from "react";

const ArcanosMenoresModulePage = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { bypassLocks } = useAccess();
  const { setHeader, resetHeader } = useHeader();

  useEffect(() => {
    setHeader({
      title: "Arcanos Menores",
      subtitle: "Módulo 04 • O Mapa dos 56",
      backRoute: "/app"
    });
    return () => resetHeader();
  }, [setHeader, resetHeader]);

  // Arcanos Menores are unlocked after completing Arcanos Maiores (Portal 1)
  const isUnlocked = bypassLocks || progress.completedModules.includes("arcanos-maiores");

  const completedMenoresCount = progress.completedLessons.filter(l => 
    l.startsWith("copas-") || l.startsWith("paus-") || l.startsWith("espadas-") || l.startsWith("ouros-")
  ).length;
  
  const totalMenores = 56;
  const progressPct = Math.round((completedMenoresCount / totalMenores) * 100);

  const modules = [
    {
      id: "arquitetura-menores",
      name: "Arquitetura dos Menores",
      subtitle: "A lógica do sistema",
      icon: <Layout className="w-6 h-6" />,
      route: "/module/arquitetura-menores",
      unlocked: isUnlocked,
      completed: progress.completedModules.includes("arquitetura-menores")
    },
    {
      id: "copas",
      name: "Naipe de Copas",
      subtitle: "O Elemento Água",
      icon: <Droplets className="w-6 h-6" />,
      route: "/module/copas",
      unlocked: isUnlocked && (bypassLocks || progress.completedModules.includes("arquitetura-menores")),
      completed: progress.completedModules.includes("copas")
    },
    {
      id: "paus",
      name: "Naipe de Paus",
      subtitle: "O Elemento Fogo",
      icon: <Flame className="w-6 h-6" />,
      route: "/module/paus",
      unlocked: isUnlocked && (bypassLocks || progress.completedModules.includes("arquitetura-menores")),
      completed: progress.completedModules.includes("paus")
    },
    {
      id: "espadas",
      name: "Naipe de Espadas",
      subtitle: "O Elemento Ar",
      icon: <Sword className="w-6 h-6" />,
      route: "/module/espadas",
      unlocked: isUnlocked && (bypassLocks || progress.completedModules.includes("arquitetura-menores")),
      completed: progress.completedModules.includes("espadas")
    },
    {
      id: "ouros",
      name: "Naipe de Ouros",
      subtitle: "O Elemento Terra",
      icon: <Gem className="w-6 h-6" />,
      route: "/module/ouros",
      unlocked: isUnlocked && (bypassLocks || progress.completedModules.includes("arquitetura-menores")),
      completed: progress.completedModules.includes("ouros")
    },
    {
      id: "cartas-corte",
      name: "Cartas da Corte",
      subtitle: "Pessoas e Posturas",
      icon: <Sparkles className="w-6 h-6" />,
      route: "/module/cartas-corte",
      unlocked: isUnlocked && (bypassLocks || progress.completedModules.includes("copas") || progress.completedModules.includes("paus") || progress.completedModules.includes("espadas") || progress.completedModules.includes("ouros")),
      completed: progress.completedModules.includes("cartas-corte")
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div className="absolute inset-0" style={{
          background: `linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)`,
          opacity: 0.95
        }} />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-6 pb-28 pt-10">
        <div
          className="rounded-[2.5rem] p-8 md:p-10 mb-10 animate-fade-in relative overflow-hidden transition-all duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 245, 239, 0.92) 100%)",
            backdropFilter: "blur(24px)",
            border: "2.5px solid #C8A66A",
            boxShadow: "0 30px 70px rgba(91, 31, 61, 0.08), 0 0 40px rgba(200, 166, 106, 0.1)"
          }}
        >
          <div className="flex items-center justify-between mb-8">
            <PageBackControls variant="top" showLabel={false} className="w-12 h-12 flex items-center justify-center bg-[#FAF5EF] rounded-full border border-[#C8A66A30]" fallbackRoute="/app" />
            <StreakCounter streak={progress.streak} />
          </div>

          <div className="inline-block mb-4">
            <span
              className="text-[11px] font-heading uppercase tracking-[0.35em] px-5 py-2 rounded-full font-black"
              style={{
                color: "#C8A66A",
                background: "rgba(91, 31, 61, 0.05)",
                border: "1.5px solid rgba(200, 166, 106, 0.3)",
              }}
            >
              Domínio Prático
            </span>
          </div>

          <div className="animate-fade-in">
            <h1 className="font-heading text-3xl md:text-5xl tracking-tight font-black mb-2" style={{ color: "#5B1F3D" }}>
              ARCANOS MENORES
            </h1>
            <p className="font-accent text-lg md:text-xl italic font-black leading-snug" style={{ color: "#5B1F3D99" }}>
              "A aplicação do Tarô na vida cotidiana"
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-[#C8A66A20]">
            <p className="font-accent text-[17px] md:text-[19px] leading-relaxed italic text-center font-black" style={{ color: "#3D1429" }}>
              "Os 56 Arcanos Menores revelam as situações concretas, as emoções passageiras e os desafios do dia a dia."
            </p>
          </div>
        </div>

        <div className="px-2">
          <ChaveProgress />
        </div>

        <div className="mb-8 mt-6 px-2 bg-white/40 p-3 rounded-xl border border-[#C8A66A20]">
          <div className="flex justify-between text-[11px] font-heading tracking-wider mb-2 px-1" style={{ color: "#5B1F3DAA" }}>
            <span>{completedMenoresCount}/{totalMenores} Chaves dos Menores</span>
            <span style={{ color: "#5B1F3D" }}>{progressPct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E8DED3", border: "1px solid #D1C4B5" }}>
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{
                width: `${Math.max(progressPct, 2)}%`,
                background: `linear-gradient(90deg, #5B1F3D, #C8A66A)`,
              }}
            >
               <div className="absolute inset-0 w-1/3 h-full bg-white/20 skew-x-[-20deg] animate-pulse" style={{ left: '10%' }} />
            </div>
          </div>
        </div>

        {!isUnlocked && (
          <div className="mb-10 p-6 rounded-[2rem] bg-amber-50/80 border-2 border-amber-200/50 text-center shadow-xl animate-fade-in">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Lock className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-heading text-xl text-amber-900 font-black mb-2 uppercase tracking-tight">Portal Bloqueado</h3>
            <p className="text-sm text-amber-800 font-medium leading-relaxed mb-6">
              Complete a jornada dos Arcanos Maiores para desbloquear o portal dos Menores e aprofundar seu conhecimento.
            </p>
            <button
              onClick={() => navigate("/module/arcanos-maiores")}
              className="px-8 py-3 rounded-xl bg-[#5B1F3D] text-white font-heading text-[11px] tracking-[0.2em] uppercase font-black shadow-lg hover:scale-105 transition-all"
            >
              Ir para Arcanos Maiores
            </button>
          </div>
        )}

        <div className={`space-y-4 ${!isUnlocked ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
          {modules.map((mod, idx) => (
            <button
              key={mod.id}
              onClick={() => mod.unlocked && navigate(mod.route)}
              disabled={!mod.unlocked}
              className="w-full text-left group transition-all duration-500"
            >
              <div
                className="rounded-[2rem] p-6 flex items-center gap-6 transition-all duration-500 relative overflow-hidden group-hover:-translate-y-1 shadow-md hover:shadow-xl"
                style={
                  mod.unlocked
                    ? {
                        background: "#FFFFFF",
                        border: mod.completed ? "2.5px solid #5B1F3D" : "1.5px solid #C8A66A",
                        boxShadow: "0 10px 30px rgba(91, 31, 61, 0.05)",
                      }
                    : {
                        background: "rgba(220, 207, 194, 0.15)",
                        border: "1.5px solid rgba(220, 207, 194, 0.25)",
                        opacity: 0.8,
                      }
                }
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-sm group-hover:scale-110"
                  style={
                    mod.unlocked
                      ? {
                          background: mod.completed ? "#FAF5EF" : "linear-gradient(135deg, #5B1F3D, #3D1429)",
                          color: mod.completed ? "#5B1F3D" : "#FAF5EF",
                          border: mod.completed ? "2px solid #5B1F3D" : "2px solid #C8A66A40"
                        }
                      : {
                          background: "rgba(220, 207, 194, 0.2)",
                          border: "2px solid rgba(91, 31, 61, 0.15)",
                          color: "#5B1F3D30",
                        }
                  }
                >
                  {mod.completed ? (
                    <Check className="w-6 h-6" strokeWidth={4} />
                  ) : !mod.unlocked ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    mod.icon
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-heading text-lg md:text-xl tracking-tight font-black leading-tight"
                    style={{ color: mod.unlocked ? "#5B1F3D" : "#5B1F3D40" }}
                  >
                    {mod.name}
                  </h3>
                  <p
                    className="font-body text-[13px] leading-relaxed truncate font-black mt-1"
                    style={{ color: mod.unlocked ? "#5B1F3D80" : "#5B1F3D30" }}
                  >
                    {mod.subtitle}
                  </p>
                </div>
                {mod.unlocked && (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border-2 border-[#C8A66A]/20 transition-all duration-500 group-hover:bg-[#C8A66A]/10 group-hover:border-[#C8A66A] group-hover:translate-x-2">
                    <ChevronRight className="w-6 h-6 shrink-0" style={{ color: "#C8A66A" }} />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <PageBackControls variant="bottom" className="w-full pb-8" fallbackRoute="/app" />
      </div>
    </div>
  );
};

export default ArcanosMenoresModulePage;
