import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Book, Calendar, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { getArcanoFull as getArcanoById } from "@/lib/content";
import mysticBg from "@/assets/mystic-bg.jpg";

interface Reflection {
  id: string;
  arcano_id: string;
  content: string;
  created_at: string;
}

const JourneyJournalPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReflections() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("user_reflections")
          .select("id, arcano_id, content, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReflections(data || []);
      } catch (error) {
        console.error("Error fetching reflections:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReflections();
  }, [user]);

  const getArcanoName = (id: string) => {
    const match = id.match(/maior-(\d+)/);
    if (match) {
      const arcano = getArcanoById(parseInt(match[1]));
      return arcano?.name || id;
    }
    return id;
  };

  const getArcanoNumeral = (id: string) => {
    const match = id.match(/maior-(\d+)/);
    if (match) {
      const arcano = getArcanoById(parseInt(match[1]));
      return arcano?.numeral || "";
    }
    return "";
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <img src={mysticBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.85), hsl(36 33% 97% / 0.80))",
        }} />
      </div>

      <header className="relative z-10 backdrop-blur-md safe-area-top" style={{
        background: "hsl(36 33% 97% / 0.85)",
        borderBottom: "1px solid hsl(36 45% 58% / 0.15)",
      }}>
        <div className="max-w-lg mx-auto py-3 px-4 flex items-center gap-3">
          <button onClick={() => navigate("/perfil")} className="shrink-0" style={{ color: "hsl(230 10% 40%)" }}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Book className="w-4 h-4" style={{ color: "hsl(36 45% 58%)" }} />
            <h1 className="font-heading text-sm tracking-wide" style={{ color: "hsl(230 25% 15%)" }}>Minha Jornada</h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl tracking-wide mb-2" style={{
            background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 42% 42%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Caderno de Reflexões</h2>
          <p className="font-accent text-sm italic" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
            Sua trilha pessoal de aprendizado e autoconhecimento.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : reflections.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/50 border border-hsl(36 45% 58% / 0.2) flex items-center justify-center mx-auto opacity-50">
              <Book className="w-6 h-6" style={{ color: "hsl(36 45% 58%)" }} />
            </div>
            <p className="text-sm font-body" style={{ color: "hsl(230 10% 45%)" }}>
              Você ainda não registrou nenhuma reflexão.<br />
              Complete uma lição para começar seu caderno!
            </p>
            <button 
              onClick={() => navigate("/module/arcanos-maiores")}
              className="text-xs font-heading tracking-widest uppercase"
              style={{ color: "hsl(36 45% 58%)" }}
            >
              Começar agora →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reflections.map((reflection) => (
              <div 
                key={reflection.id}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-hsl(36 45% 58% / 0.1) space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-heading" style={{
                      background: "hsl(36 45% 58% / 0.1)",
                      border: "1px solid hsl(36 45% 58% / 0.2)",
                      color: "hsl(340 42% 22%)"
                    }}>
                      {getArcanoNumeral(reflection.arcano_id)}
                    </div>
                    <span className="font-heading text-sm" style={{ color: "hsl(340 42% 22%)" }}>
                      {getArcanoName(reflection.arcano_id)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-40">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px] font-body">
                      {new Date(reflection.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm font-body leading-relaxed italic" style={{ color: "hsl(230 25% 15%)" }}>
                  “{reflection.content}”
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default JourneyJournalPage;
