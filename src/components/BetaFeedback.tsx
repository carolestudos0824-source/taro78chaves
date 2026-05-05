import { useState } from "react";
import { MessageCircle, X, Send, Bug, Lightbulb, Heart, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type FeedbackType = "bug" | "suggestion" | "praise" | "other";

const types: { id: FeedbackType; label: string; icon: React.ReactNode }[] = [
  { id: "bug", label: "Bug", icon: <Bug className="w-3.5 h-3.5" /> },
  { id: "suggestion", label: "Sugestão", icon: <Lightbulb className="w-3.5 h-3.5" /> },
  { id: "praise", label: "Elogio", icon: <Heart className="w-3.5 h-3.5" /> },
  { id: "other", label: "Outro", icon: <HelpCircle className="w-3.5 h-3.5" /> },
];

const BetaFeedback = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("suggestion");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const handleSend = async () => {
    if (!message.trim() || !user) return;
    setSending(true);
    const { error } = await supabase.from("beta_feedback").insert({
      user_id: user.id,
      page: location.pathname,
      type,
      message: message.trim(),
      rating: rating || null,
    });
    setSending(false);
    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Obrigada! 💜", description: "Seu feedback foi registrado." });
      setMessage("");
      setRating(0);
      setOpen(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Floating button — hidden on mobile to avoid competition with BottomNav */}
      <button
        onClick={() => setOpen(!open)}
        className="hidden md:flex fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full items-center justify-center transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, hsl(340 42% 28%), hsl(280 30% 28%))",
          boxShadow: "0 4px 16px hsl(340 42% 28% / 0.25)",
          color: "hsl(36 45% 70%)",
        }}
      >
        {open ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-20 right-5 z-50 w-80 rounded-2xl p-5 space-y-4 animate-fade-in"
          style={{
            background: "hsl(36 33% 97%)",
            border: "1.5px solid hsl(36 25% 82% / 0.60)",
            boxShadow: "0 12px 48px hsl(230 25% 10% / 0.12)",
          }}
        >
          <div>
            <p className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(340 42% 28%)" }}>
              Feedback Beta
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "hsl(230 15% 40% / 0.50)" }}>
              Sua opinião ajuda a melhorar a plataforma.
            </p>
          </div>

          {/* Type selector */}
          <div className="flex gap-1.5">
            {types.map(t => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all"
                style={{
                  background: type === t.id ? "hsl(340 42% 28% / 0.08)" : "transparent",
                  border: `1px solid ${type === t.id ? "hsl(340 42% 28% / 0.20)" : "hsl(36 25% 82% / 0.40)"}`,
                  color: type === t.id ? "hsl(340 42% 28%)" : "hsl(230 15% 40% / 0.50)",
                }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Message */}
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Conte o que achou, o que sentiu, ou o que pode melhorar..."
            rows={3}
            className="text-sm resize-none"
          />

          {/* Rating */}
          <div>
            <p className="text-[10px] mb-1.5" style={{ color: "hsl(230 15% 40% / 0.40)" }}>Como está a experiência? (opcional)</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className="w-8 h-8 rounded-lg text-sm transition-all"
                  style={{
                    background: n <= rating ? "hsl(36 45% 58% / 0.15)" : "hsl(38 28% 94%)",
                    border: `1px solid ${n <= rating ? "hsl(36 45% 58% / 0.30)" : "hsl(36 25% 82% / 0.40)"}`,
                    color: n <= rating ? "hsl(36 45% 45%)" : "hsl(230 15% 40% / 0.30)",
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Send */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="w-full gap-2 font-heading tracking-wide text-[11px] uppercase"
            style={{
              background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(340 42% 32%))",
              color: "hsl(36 33% 97%)",
            }}
          >
            <Send className="w-3.5 h-3.5" />
            {sending ? "Enviando..." : "Enviar Feedback"}
          </Button>
        </div>
      )}
    </>
  );
};

export default BetaFeedback;
