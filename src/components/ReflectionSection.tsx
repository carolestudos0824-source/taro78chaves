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
      className="w-full max-w-sm mx-auto p-6 rounded-[2rem] space-y-5 text-left animate-fade-in shadow-xl"
      style={{
        background: "white",
        border: "2px solid rgba(200, 166, 106, 0.3)",
      }}
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 rounded-full bg-[#FAF5EF] flex items-center justify-center border border-[#C8A66A]/30">
          <Book className="w-4 h-4 text-[#C8A66A]" />
        </div>
        <h3 className="font-heading text-md font-black tracking-wide text-[#5B1F3D]">
          Caderno da Jornada
        </h3>
      </div>

      <p className="font-accent text-[14px] italic font-bold text-[#5B1F3DCC]">
        “O que esta carta me ensinou hoje?”
      </p>

      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (saved) setSaved(false);
        }}
        placeholder="Registre sua reflexão curta aqui..."
        className="w-full h-32 p-4 rounded-2xl text-[15px] font-body bg-[#FAF5EF]/50 border-2 border-[#C8A66A]/20 focus:border-[#C8A66A]/50 focus:bg-white transition-all outline-none resize-none placeholder:text-[#5B1F3D40] font-medium text-[#5B1F3D]"
      />

      <button
        onClick={handleSave}
        disabled={saving || !content.trim() || saved}
        className="w-full py-4 rounded-full font-heading text-[11px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-md"
        style={{
          background: saved 
            ? "rgba(45, 90, 61, 0.1)" 
            : content.trim() 
              ? "#5B1F3D" 
              : "rgba(91, 31, 61, 0.15)",
          color: saved 
            ? "#2D5A3D" 
            : content.trim() 
              ? "white" 
              : "rgba(91, 31, 61, 0.4)",
          border: saved ? "2px solid rgba(45, 90, 61, 0.3)" : "none",
        }}
      >
        {saved ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            <span>Reflexão Salva</span>
          </<>
        ) : (
          <>
            <Save className="w-5 h-5" />
            <span>{saving ? "Salvando..." : "Salvar Reflexão"}</span>
          </>
        )}
      </button>
    </div>
  );
}
