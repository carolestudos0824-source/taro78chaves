import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import { toast } from "sonner";
import { Book, Save, CheckCircle2 } from "lucide-react";

interface ReflectionSectionProps {
  arcanoId: string;
  lessonId?: string;
}

export function ReflectionSection({ arcanoId, lessonId }: ReflectionSectionProps) {
  const { user } = useAuth();
  const { isAdmin, isStaff } = useRole();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReflection() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("user_reflections")
          .select("content")
          .eq("user_id", user.id)
          .eq("arcano_id", arcanoId)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setContent(data.content);
          setSaved(true);
        }
      } catch (error) {
        console.error("Error fetching reflection:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReflection();
  }, [user, arcanoId]);

  const handleSave = async () => {
    if (!user) return;
    if (!content.trim()) {
      toast.error("Por favor, escreva algo antes de salvar.");
      return;
    }

    // Admin/Staff skip saving to avoid polluting metrics if requested
    if (isAdmin || isStaff) {
      toast.success("Sucesso: Reflexão simulada no modo administrativo.");
      setSaved(true);
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("user_reflections")
        .upsert({
          user_id: user.id,
          arcano_id: arcanoId,
          lesson_id: lessonId,
          content: content.trim(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,arcano_id'
        });

      if (error) throw error;

      toast.success("Reflexão salva no seu Caderno da Jornada!");
      setSaved(true);
    } catch (error) {
      console.error("Error saving reflection:", error);
      toast.error("Erro ao salvar reflexão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-32 animate-pulse bg-muted rounded-xl" />
    );
  }

  return (
    <div 
      className="w-full max-w-sm mx-auto p-5 rounded-2xl space-y-4 text-left animate-fade-in"
      style={{
        background: "hsl(38 30% 95% / 0.85)",
        border: "1px solid hsl(36 45% 58% / 0.15)",
        boxShadow: "0 4px 20px hsl(36 45% 58% / 0.06)",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Book className="w-4 h-4" style={{ color: "hsl(36 45% 58%)" }} />
        <h3 className="font-heading text-sm tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
          Caderno da Jornada
        </h3>
      </div>

      <p className="font-accent text-sm italic" style={{ color: "hsl(230 20% 15% / 0.7)" }}>
        “O que esta carta me ensinou hoje?”
      </p>

      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (saved) setSaved(false);
        }}
        placeholder="Registre sua reflexão curta aqui..."
        className="w-full h-24 p-3 rounded-xl text-sm font-body bg-white/50 border border-hsl(36 45% 58% / 0.2) focus:outline-none focus:ring-1 focus:ring-hsl(36 45% 58% / 0.3) resize-none"
        style={{ color: "hsl(230 25% 15%)" }}
      />

      <button
        onClick={handleSave}
        disabled={saving || !content.trim() || saved}
        className="w-full py-2.5 rounded-full font-heading text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        style={{
          background: saved 
            ? "hsl(120 40% 50% / 0.08)" 
            : "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
          color: saved ? "hsl(120 40% 35%)" : "hsl(36 33% 97%)",
          border: saved ? "1px solid hsl(120 40% 50% / 0.2)" : "none",
          boxShadow: saved ? "none" : "0 4px 15px hsl(36 45% 58% / 0.15)",
        }}
      >
        {saved ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Reflexão Salva</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>{saving ? "Salvando..." : "Salvar Reflexão"}</span>
          </>
        )}
      </button>
    </div>
  );
}
