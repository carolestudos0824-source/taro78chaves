import { useState } from "react";
import { Sparkles, Eye, Compass, Flame, Layers, BookOpen, Star, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/* ═══════════════ WAITLIST FORM ═══════════════ */

const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("waitlist").insert({
        email: email.trim().toLowerCase(),
        name: name.trim() || null,
        source: "waitlist_page",
      });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "Você já está na lista ✦", description: "Esse e-mail já foi registrado. Em breve você receberá novidades." });
          setSubmitted(true);
        } else throw error;
      } else {
        setSubmitted(true);
      }
    } catch {
      toast({ title: "Erro ao registrar", description: "Tente novamente em alguns instantes.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center animate-fade-in">
        <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{
          background: "hsl(340 42% 28% / 0.08)",
          border: "1.5px solid hsl(340 42% 28% / 0.18)",
        }}>
          <Sparkles className="w-6 h-6" style={{ color: "hsl(340 42% 26%)" }} />
        </div>
        <h2 className="font-heading text-xl tracking-wide mb-2" style={{ color: "hsl(340 42% 20%)" }}>
          Você está na lista ✦
        </h2>
        <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(230 15% 30% / 0.55)" }}>
          Quando as portas se abrirem, você será das primeiras pessoas a entrar. Fique de olho no seu e-mail.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <input
          type="text"
          placeholder="Seu nome (opcional)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all focus:ring-2"
          style={{
            background: "hsl(38 30% 95%)",
            border: "1.5px solid hsl(36 25% 82% / 0.70)",
            color: "hsl(230 25% 10%)",
          }}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <input
          type="email"
          required
          placeholder="Seu melhor e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all focus:ring-2"
          style={{
            background: "hsl(38 30% 95%)",
            border: "1.5px solid hsl(36 25% 82% / 0.70)",
            color: "hsl(230 25% 10%)",
          }}
        />
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="font-heading tracking-wide px-8 text-sm whitespace-nowrap"
          style={{
            background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 42% 32%))",
            color: "hsl(36 33% 97%)",
            border: "1px solid hsl(340 42% 28% / 0.40)",
            boxShadow: "0 6px 24px hsl(340 42% 28% / 0.18)",
          }}
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          {loading ? "Registrando..." : "Quero entrar na lista"}
        </Button>
      </div>
      <p className="text-[10px] font-body" style={{ color: "hsl(230 15% 30% / 0.40)" }}>
        Sem spam. Você receberá apenas o convite de acesso.
      </p>
    </form>
  );
};

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

const Divider = () => (
  <div className="flex justify-center py-6">
    <span className="text-lg select-none" style={{ color: "hsl(36 45% 58% / 0.25)" }}>⟡</span>
  </div>
);

/* ═══════════════ DATA ═══════════════ */

const DIFERENCIAIS = [
  {
    icon: Compass,
    title: "Jornada gamificada",
    desc: "Trilha progressiva com XP, streaks e conquistas que transformam constância em ritual.",
  },
  {
    icon: Eye,
    title: "Profundidade simbólica",
    desc: "Cada carta estudada com essência, luz, sombra, simbolismo e aplicações reais.",
  },
  {
    icon: BookOpen,
    title: "Rider-Waite-Smith como base",
    desc: "A tradição mais rica do tarô ocidental, com leituras arquetípicas, psicológicas e esotéricas.",
  },
  {
    icon: Sparkles,
    title: "Arcanos vivos",
    desc: "No app Tarô 78 Chaves, o tarô deixa de ser imagem e se torna presença.",
  },
  {
    icon: Layers,
    title: "Método estruturado",
    desc: "Lições em camadas: conteúdo principal, aprofundamento, extras, exercício e quiz.",
  },
];

/* ═══════════════ PAGE ═══════════════ */

const WaitlistPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* ════════════════════════════════════════════════
          1. HERO PRINCIPAL
          ════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6">
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 15%, hsl(42 70% 80% / 0.22) 0%, transparent 55%)",
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 20% 80%, hsl(340 42% 30% / 0.08) 0%, transparent 50%)",
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 80% 60%, hsl(36 45% 58% / 0.06) 0%, transparent 50%)",
          }} />
        </div>

        {/* Corner ornaments */}
        <span className="absolute top-8 left-8 text-2xl select-none" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✦</span>
        <span className="absolute top-8 right-8 text-2xl select-none" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✧</span>
        <span className="absolute bottom-8 left-8 text-xl select-none" style={{ color: "hsl(36 45% 58% / 0.10)" }}>✧</span>
        <span className="absolute bottom-8 right-8 text-xl select-none" style={{ color: "hsl(36 45% 58% / 0.10)" }}>✦</span>

        <div className="relative z-10 max-w-2xl text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10" style={{
            background: "linear-gradient(135deg, hsl(340 42% 28% / 0.08), hsl(280 30% 28% / 0.06))",
            border: "1px solid hsl(36 45% 58% / 0.25)",
          }}>
            <Lock className="w-3 h-3" style={{ color: "hsl(36 45% 55%)" }} />
            <span className="text-[10px] font-heading tracking-[0.35em] uppercase" style={{ color: "hsl(340 42% 28% / 0.70)" }}>
              Em breve · Lista de Espera
            </span>
          </div>

          {/* Overline */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(36 45% 58% / 0.40))" }} />
            <span className="text-[10px] tracking-[0.5em] uppercase font-body" style={{ color: "hsl(340 42% 28% / 0.55)" }}>
              A Jornada do Louco
            </span>
            <div className="w-14 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(36 45% 58% / 0.40))" }} />
          </div>

          {/* Headline */}
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide leading-tight mb-6" style={{
            background: "linear-gradient(135deg, hsl(340 42% 18%), hsl(230 25% 12%), hsl(36 42% 38%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Aprenda Tarô como uma jornada — arcano por arcano, com lições curtas, quizzes, XP e progresso real.
          </h1>

          {/* Subheadline */}
          <p className="font-body text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-10" style={{
            color: "hsl(230 15% 30% / 0.55)",
          }}>
            Não é um app de tiragem automática. É uma escola viva de Tarô no seu bolso, fiel ao Rider-Waite-Smith e pensada para criar prática, continuidade e domínio simbólico.
          </p>

          {/* CTA Form */}
          <WaitlistForm />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5" style={{
            borderColor: "hsl(36 45% 58% / 0.25)",
          }}>
            <div className="w-1 h-2 rounded-full" style={{
              background: "hsl(36 45% 58% / 0.40)",
              animation: "fade-in 1.5s ease-in-out infinite alternate",
            }} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          2. BLOCO INSTITUCIONAL
          ════════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{
        background: "linear-gradient(180deg, hsl(38 30% 95% / 0.50) 0%, hsl(36 33% 97%) 100%)",
        borderTop: "1px solid hsl(36 25% 82% / 0.40)",
      }}>
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <SectionLabel>O que é</SectionLabel>
          <SectionTitle>A Jornada do Louco</SectionTitle>

          <p className="font-body text-sm md:text-base leading-relaxed max-w-lg mx-auto" style={{ color: "hsl(230 15% 30% / 0.55)" }}>
            Uma plataforma de ensino de tarô criada para transformar estudo em experiência.
          </p>

          <p className="font-body text-[13px] leading-relaxed max-w-md mx-auto" style={{ color: "hsl(230 15% 30% / 0.45)" }}>
            Aqui, o aprendizado não acontece por repetição vazia ou significados soltos decorados de forma mecânica. Ele acontece como travessia, construção de leitura e aprofundamento simbólico.
          </p>

          <div className="flex justify-center pt-2">
            <div className="w-10 h-px" style={{ background: "hsl(36 45% 58% / 0.25)" }} />
          </div>

          <p className="font-accent text-[13px] italic leading-relaxed max-w-md mx-auto" style={{ color: "hsl(230 20% 15% / 0.40)" }}>
            A plataforma adota como base principal o Rider-Waite-Smith, integrando leituras arquetípicas, psicológicas e esotéricas em uma estrutura clara, progressiva e visualmente imersiva.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          3. BLOCO DE DIFERENCIAIS
          ════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 space-y-3">
            <SectionLabel>O que torna diferente</SectionLabel>
            <SectionTitle>Mais do que um curso. Uma jornada viva de aprendizagem.</SectionTitle>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {DIFERENCIAIS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className={`rounded-xl p-5 flex items-start gap-4 ${i === DIFERENCIAIS.length - 1 && DIFERENCIAIS.length % 2 !== 0 ? "sm:col-span-2 sm:max-w-sm sm:mx-auto" : ""}`}
                  style={{
                    background: "hsl(36 33% 97% / 0.80)",
                    border: "1px solid hsl(36 25% 82% / 0.60)",
                  }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{
                    background: "linear-gradient(135deg, hsl(340 42% 30% / 0.08), hsl(36 45% 58% / 0.10))",
                    border: "1px solid hsl(36 45% 58% / 0.20)",
                  }}>
                    <Icon className="w-5 h-5" style={{ color: "hsl(340 42% 26%)" }} />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm tracking-wide mb-1" style={{ color: "hsl(230 25% 12%)" }}>
                      {item.title}
                    </h3>
                    <p className="font-body text-[12px] leading-relaxed" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          4. BLOCO SOBRE A BETA
          ════════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{
        background: "linear-gradient(180deg, hsl(38 30% 95% / 0.40) 0%, hsl(36 33% 97%) 100%)",
        borderTop: "1px solid hsl(36 25% 82% / 0.30)",
      }}>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <SectionLabel>A Beta</SectionLabel>
          <SectionTitle>Uma entrada antecipada para viver a primeira fase da plataforma.</SectionTitle>

          <p className="font-body text-[13px] leading-relaxed max-w-lg mx-auto" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
            A beta é a fase inicial de acesso à plataforma com um grupo reduzido de estudantes. Nesta etapa, será possível experimentar a proposta pedagógica, entrar na Jornada do Louco, testar os primeiros conteúdos e acompanhar de perto o nascimento de uma nova forma de estudar tarô.
          </p>

          {/* Beta value card */}
          <div className="rounded-2xl p-6 max-w-md mx-auto text-left space-y-3" style={{
            background: "linear-gradient(170deg, hsl(38 28% 95%), hsl(340 42% 28% / 0.02))",
            border: "1.5px solid hsl(36 45% 58% / 0.22)",
            boxShadow: "0 8px 40px hsl(340 42% 28% / 0.04)",
          }}>
            <p className="text-[10px] font-heading tracking-[0.3em] uppercase text-center" style={{ color: "hsl(340 42% 28% / 0.60)" }}>
              O que a beta já entrega
            </p>
            {[
              "Onboarding inicial da jornada",
              "Dashboard com progresso salvo",
              "Fundamentos do Tarô",
              "Início da Jornada dos Arcanos Maiores",
              "O Louco como primeira experiência viva",
              "Quizzes, XP e streak",
              "Primeiros arcanos da trilha",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Check className="w-3 h-3 shrink-0" style={{ color: "hsl(36 45% 50% / 0.70)" }} />
                <span className="text-[12px] font-body" style={{ color: "hsl(230 15% 25% / 0.55)" }}>{item}</span>
              </div>
            ))}
          </div>

          <p className="font-accent text-[12px] italic leading-relaxed max-w-sm mx-auto" style={{ color: "hsl(230 20% 15% / 0.38)" }}>
            A plataforma não é um produto improvisado. É uma entrada antecipada em uma construção refinada.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          5. BLOCO FINAL COM CTA
          ════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 50%, hsl(340 42% 30% / 0.04) 0%, transparent 60%)",
        }} />

        <div className="relative max-w-2xl mx-auto text-center space-y-6">
          <span className="text-2xl block" style={{ color: "hsl(36 45% 58% / 0.30)" }}>✦</span>

          <SectionLabel>Convite</SectionLabel>
          <SectionTitle>Entre na lista de espera e acompanhe o nascimento desta jornada desde o início.</SectionTitle>

          <p className="font-body text-[13px] leading-relaxed max-w-md mx-auto" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
            Se você deseja estudar tarô com mais profundidade, beleza, método e consciência simbólica, esta é a hora de garantir sua entrada.
          </p>

          {/* CTA Form */}
          <WaitlistForm />
        </div>
      </section>

      {/* Footer ornament */}
      <div className="text-center pb-10">
        <p className="font-accent text-[11px] italic mb-3" style={{ color: "hsl(230 15% 30% / 0.30)" }}>
          Tarô com método, símbolo e jornada viva.
        </p>
        <div className="text-lg" style={{ color: "hsl(36 45% 58% / 0.20)" }}>⟡</div>
      </div>
    </div>
  );
};

export default WaitlistPage;
