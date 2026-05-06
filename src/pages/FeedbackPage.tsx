import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, MessageSquare, Sparkles, ScrollText, KeyRound,
  Send, CheckCircle, Lightbulb, AlertCircle, Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

type FeedbackCategory = "visual" | "content" | "bug" | "suggestion" | "payment";

const CATEGORIES: { id: FeedbackCategory; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
  { id: "visual", label: "Visual", icon: <Sparkles className="w-5 h-5" />, desc: "Beleza e identidade do app.", color: "#C8A66A" },
  { id: "content", label: "Conteúdo", icon: <ScrollText className="w-5 h-5" />, desc: "Lições e interpretações.", color: "#5B1F3D" },
  { id: "bug", label: "Erro", icon: <AlertCircle className="w-5 h-5" />, desc: "Algo não funcionou bem.", color: "#5B1F3D" },
  { id: "suggestion", label: "Sugestão", icon: <Lightbulb className="w-5 h-5" />, desc: "Ideias para a jornada.", color: "#C8A66A" },
  { id: "payment", label: "Conta", icon: <KeyRound className="w-5 h-5" />, desc: "Acesso ou pagamento.", color: "#5B1F3D" },
];

const FeedbackPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState<FeedbackCategory | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!user || !selected) return;
    setSending(true);

    const typeMap: Record<FeedbackCategory, string> = {
      visual: "visual",
      content: "content",
      bug: "bug",
      suggestion: "suggestion",
      payment: "account",
    };

    const { error } = await supabase.from("beta_feedback").insert({
      user_id: user.id,
      page: `/feedback`,
      type: typeMap[selected],
      message: `[${selected.toUpperCase()}] ${message.trim()}`,
    });

    setSending(false);
    if (error) {
      toast({ title: "Erro ao enviar", description: "Não foi possível entregar sua mensagem.", variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5EF] pb-32">
      <header className="relative overflow-hidden bg-white/40 border-b border-[#C8A66A]/20">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 0%, #C8A66A1A 0%, transparent 60%)",
        }} />
        <div className="relative max-w-xl mx-auto px-6 pt-10 pb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#5B1F3D] hover:opacity-70 transition-all mb-8 font-heading font-black text-xs uppercase tracking-[0.2em]">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-md border-2 border-[#C8A66A]/30">
              <MessageSquare className="w-6 h-6" style={{ color: "#5B1F3D" }} />
            </div>
            <h1 className="font-heading text-2xl font-black text-[#5B1F3D] tracking-tight">
              Mensagem ao Oráculo
            </h1>
            <p className="font-accent text-sm italic font-bold" style={{ color: "#5B1F3D/70" }}>
              Sua mensagem ajuda a tornar o Tarô 78 Chaves mais claro, bonito e vivo.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 pt-8">
        {sent ? (
          <div className="text-center py-16 space-y-6 animate-fade-in bg-white border-2 border-[#C8A66A]/30 rounded-[2rem] shadow-xl ring-8 ring-[#C8A66A]/5">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FAF5EF] border-4 border-[#C8A66A]">
              <CheckCircle className="w-10 h-10" style={{ color: "#5B1F3D" }} />
            </div>
            <h2 className="font-heading text-2xl font-black text-[#5B1F3D]">Chave recebida</h2>
            <p className="text-sm font-body font-bold italic max-w-xs mx-auto text-[#5B1F3D]/60 leading-relaxed">
              Mensagem recebida. Obrigada por ajudar a lapidar esta jornada iniciática.
            </p>
            <div className="flex flex-col gap-3 px-8">
              <Button onClick={() => navigate("/app")} className="w-full bg-[#5B1F3D] hover:bg-[#5B1F3D]/90 text-white rounded-xl font-heading font-black tracking-widest py-6 border-2 border-[#C8A66A]">
                VOLTAR À JORNADA
              </Button>
              <button onClick={() => { setSent(false); setSelected(null); setMessage(""); }} className="font-heading text-[10px] tracking-widest uppercase font-black text-[#C8A66A]">
                Enviar outra mensagem
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {!selected ? (
              <div className="space-y-6">
                <p className="text-center text-[11px] font-heading font-black tracking-[0.3em] uppercase text-[#C8A66A]">
                  Sobre o que quer falar?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelected(cat.id)}
                      className="rounded-[1.5rem] p-5 text-left bg-white border-2 border-[#DCCFC2]/40 transition-all hover:border-[#C8A66A] hover:scale-[1.02] active:scale-[0.98] shadow-md group"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-[#FAF5EF] border border-[#C8A66A]/20 transition-colors group-hover:bg-[#FAF5EF]">
                        {cat.icon}
                      </div>
                      <p className="font-heading text-[14px] font-black text-[#5B1F3D] tracking-tight">{cat.label}</p>
                      <p className="text-[11px] font-body font-bold italic text-[#5B1F3D]/50 mt-0.5 leading-tight">{cat.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl border-2 border-[#C8A66A]/30 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#FAF5EF] text-[#5B1F3D]">
                      {CATEGORIES.find(c => c.id === selected)!.icon}
                    </div>
                    <span className="font-heading text-base font-black text-[#5B1F3D]">
                      {CATEGORIES.find(c => c.id === selected)!.label}
                    </span>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-[10px] font-heading font-black tracking-widest uppercase text-[#C8A66A]">
                    Trocar
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-heading font-black tracking-[0.2em] uppercase text-[#C8A66A] px-1">
                      Sua mensagem
                    </label>
                    <Textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Descreva o que aconteceu ou o que você gostaria de melhorar na jornada..."
                      rows={6}
                      className="text-base font-body font-bold rounded-2xl bg-white border-2 border-[#DCCFC2]/60 focus:border-[#C8A66A] shadow-sm resize-none p-5"
                    />
                  </div>

                  <Button
                    onClick={handleSend}
                    disabled={!message.trim() || sending}
                    className="w-full bg-[#5B1F3D] hover:bg-[#5B1F3D]/90 text-white rounded-2xl font-heading font-black tracking-[0.2em] py-8 border-2 border-[#C8A66A] shadow-xl"
                  >
                    {sending ? "ENVIANDO..." : "ENVIAR FEEDBACK"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;