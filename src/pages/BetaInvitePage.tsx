import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Lock, Sparkles, Check, ChevronDown,
  Eye, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ═══════════════ DATA ═══════════════ */

const BETA_ITEMS = [
  "Onboarding e introdução ao método",
  "Fundamentos do Tarô",
  "O Louco — arcano completo com voz e quiz",
  "Progresso salvo com XP e streak",
  "Experiência visual imersiva",
  "Área premium em desenvolvimento",
];

const WHY_NOW = [
  {
    icon: Lock,
    title: "Grupo reduzido",
    desc: "Você entra antes de todos e acompanha a construção.",
  },
  {
    icon: Sparkles,
    title: "Experiência real",
    desc: "A proposta pedagógica já está ativa e funcional.",
  },
  {
    icon: Star,
    title: "Molde a jornada",
    desc: "Seu feedback ajuda a refinar a plataforma.",
  },
  {
    icon: Eye,
    title: "Qualidade, não improviso",
    desc: "Acesso antecipado em algo refinado.",
  },
];

const FAQ = [
  {
    q: "O que é a plataforma?",
    a: "Uma plataforma de ensino de tarô com trilha gamificada, base no Rider-Waite-Smith e experiência imersiva.",
  },
  {
    q: "Para quem foi criada?",
    a: "Para quem quer estudar tarô de verdade, com profundidade, clareza e método.",
  },
  {
    q: "A plataforma já está completa?",
    a: "O app já entrega a experiência central do produto. A expansão acontece em fases.",
  },
];

/* ═══════════════ HELPERS ═══════════════ */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[9px] font-heading tracking-[0.4em] uppercase text-center" style={{ color: "hsl(36 45% 50%)" }}>
    {children}
  </p>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-heading text-xl md:text-2xl tracking-wide text-center leading-snug" style={{
    background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}>
    {children}
  </h2>
);

/* ═══════════════ PAGE ═══════════════ */

const BetaInvitePage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 18%, hsl(42 70% 80% / 0.20) 0%, transparent 58%)",
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 20% 80%, hsl(340 42% 30% / 0.07) 0%, transparent 50%)",
          }} />
        </div>

        <span className="absolute top-8 left-8 text-2xl select-none" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✦</span>
        <span className="absolute top-8 right-8 text-2xl select-none" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✧</span>

        <div className="relative z-10 max-w-2xl text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{
            background: "linear-gradient(135deg, hsl(340 42% 28% / 0.08), hsl(280 30% 28% / 0.06))",
            border: "1px solid hsl(36 45% 58% / 0.25)",
          }}>
            <Lock className="w-3 h-3" style={{ color: "hsl(36 45% 55%)" }} />
            <span className="text-[10px] font-heading tracking-[0.35em] uppercase" style={{ color: "hsl(340 42% 28% / 0.70)" }}>
              Lançamento · Convite
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(36 45% 58% / 0.40))" }} />
            <span className="text-[10px] tracking-[0.5em] uppercase font-body" style={{ color: "hsl(340 42% 28% / 0.55)" }}>
              A Jornada do Louco
            </span>
            <div className="w-12 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(36 45% 58% / 0.40))" }} />
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide leading-tight mb-5" style={{
            background: "linear-gradient(135deg, hsl(340 42% 18%), hsl(230 25% 12%), hsl(36 42% 38%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Aprenda tarô como uma jornada viva de símbolo, presença e leitura real.
          </h1>

          <p className="font-body text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: "hsl(230 15% 30% / 0.60)" }}>
            Uma plataforma imersiva de ensino de tarô que une método, profundidade simbólica, trilha gamificada e experiência viva com os arcanos. O acesso está aberto para os primeiros estudantes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => navigate("/auth")}
              className="group px-8 py-6 text-sm font-heading tracking-[0.2em] uppercase rounded-xl shadow-lg hover:shadow-xl transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, hsl(340 42% 28%), hsl(340 38% 22%))",
                border: "1px solid hsl(36 45% 58% / 0.25)",
              }}
            >
              Quero entrar agora
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <button
              onClick={() => navigate("/waitlist")}
              className="text-[11px] font-heading tracking-wider uppercase transition-colors px-4 py-2"
              style={{ color: "hsl(340 42% 28% / 0.50)" }}
            >
              Entrar na lista de espera
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <ChevronDown className="w-5 h-5" style={{ color: "hsl(36 45% 58%)" }} />
        </div>
      </section>

      {/* ════════════════ O QUE JÁ ESTÁ DISPONÍVEL ════════════════ */}
      <section className="py-20 px-6" style={{
        background: "linear-gradient(180deg, hsl(38 30% 95% / 0.50) 0%, hsl(36 33% 97%) 100%)",
        borderTop: "1px solid hsl(36 25% 82% / 0.40)",
      }}>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <SectionLabel>O que já está disponível</SectionLabel>
            <SectionTitle>A plataforma já entrega a experiência central.</SectionTitle>
          </div>

          <div className="rounded-2xl p-6 max-w-md mx-auto space-y-3" style={{
            background: "linear-gradient(170deg, hsl(38 28% 95%), hsl(340 42% 28% / 0.02))",
            border: "1.5px solid hsl(36 45% 58% / 0.22)",
            boxShadow: "0 8px 40px hsl(340 42% 28% / 0.04)",
          }}>
            {BETA_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(36 45% 50% / 0.70)" }} />
                <span className="text-[12px] font-body" style={{ color: "hsl(230 15% 25% / 0.55)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ POR QUE AGORA ════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <SectionLabel>Por que agora</SectionLabel>
            <SectionTitle>Uma porta que se abre para poucos.</SectionTitle>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {WHY_NOW.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="rounded-xl p-5 text-center" style={{
                background: "hsl(36 33% 97% / 0.80)",
                border: "1px solid hsl(36 25% 82% / 0.60)",
              }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3" style={{
                  background: "linear-gradient(135deg, hsl(340 42% 30% / 0.08), hsl(36 45% 58% / 0.10))",
                  border: "1px solid hsl(36 45% 58% / 0.20)",
                }}>
                  <Icon className="w-5 h-5" style={{ color: "hsl(340 42% 26%)" }} />
                </div>
                <h3 className="font-heading text-[13px] tracking-wide mb-1" style={{ color: "hsl(230 25% 12%)" }}>{title}</h3>
                <p className="font-body text-[11px] leading-relaxed" style={{ color: "hsl(230 15% 30% / 0.50)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ FAQ ════════════════ */}
      <section className="py-16 px-6" style={{
        background: "linear-gradient(180deg, hsl(38 30% 95% / 0.40) 0%, hsl(36 33% 97%) 100%)",
        borderTop: "1px solid hsl(36 25% 82% / 0.30)",
      }}>
        <div className="max-w-lg mx-auto space-y-6">
          <SectionLabel>Perguntas frequentes</SectionLabel>
          <div className="space-y-2">
            {FAQ.map(({ q, a }, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{
                background: "hsl(36 33% 97% / 0.70)",
                border: "1px solid hsl(36 25% 82% / 0.40)",
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-heading text-[13px] tracking-wide" style={{ color: "hsl(230 25% 12%)" }}>{q}</span>
                  <ChevronDown
                    className="w-4 h-4 shrink-0 transition-transform duration-300"
                    style={{
                      color: "hsl(36 45% 55%)",
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="font-body text-[12px] leading-relaxed" style={{ color: "hsl(230 10% 40% / 0.70)" }}>{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA FINAL ════════════════ */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 50%, hsl(42 70% 80% / 0.12) 0%, transparent 60%)",
        }} />

        <div className="relative z-10 max-w-xl mx-auto text-center space-y-6">
          <span className="text-2xl block" style={{ color: "hsl(36 45% 58% / 0.30)" }}>✦</span>

          <SectionLabel>Convite</SectionLabel>
          <SectionTitle>Comece sua jornada desde o início.</SectionTitle>

          <p className="font-body text-[13px] leading-relaxed max-w-md mx-auto" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
            Se você deseja estudar tarô com mais profundidade, beleza e consciência simbólica, esta é a hora de entrar.
          </p>

          <div className="flex flex-col items-center gap-3 pt-2">
            <Button
              onClick={() => navigate("/auth")}
              className="group px-10 py-6 text-sm font-heading tracking-[0.2em] uppercase rounded-xl shadow-lg hover:shadow-xl transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, hsl(340 42% 28%), hsl(340 38% 22%))",
                border: "1px solid hsl(36 45% 58% / 0.25)",
              }}
            >
              Quero entrar agora
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <button
              onClick={() => navigate("/waitlist")}
              className="text-[11px] font-heading tracking-wider uppercase transition-colors"
              style={{ color: "hsl(340 42% 28% / 0.50)" }}
            >
              Entrar na lista de espera
            </button>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-center gap-3">
          <div className="w-8 h-px" style={{ background: "hsl(36 45% 58% / 0.25)" }} />
          <span className="text-[9px] font-heading tracking-[0.4em] uppercase" style={{ color: "hsl(36 45% 55% / 0.40)" }}>
            A Jornada do Louco
          </span>
          <div className="w-8 h-px" style={{ background: "hsl(36 45% 58% / 0.25)" }} />
        </div>
      </section>
    </div>
  );
};

export default BetaInvitePage;