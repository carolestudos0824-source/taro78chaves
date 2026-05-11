import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { ArrowLeft, Key } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleGoBack = () => {
    if (user) {
      navigate("/app");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF5EF] relative overflow-hidden px-6">
      {/* Background Ornaments */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#C8A66A] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#C8A66A] blur-[120px]" />
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-sm animate-fade-in">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#C8A66A]/30 shadow-xl ring-8 ring-[#C8A66A]/5">
          <Key className="w-10 h-10 text-[#5B1F3D]" />
        </div>

        <div className="space-y-3">
          <h1 className="font-heading text-4xl text-[#5B1F3D] tracking-tight">Caminho não encontrado</h1>
          <p className="font-body text-base text-[#5B1F3D]/70 italic leading-relaxed">
            "Esta porta não leva a uma lição ativa. Volte para sua jornada e continue pelo próximo arcano."
          </p>
        </div>

        <button
          onClick={handleGoBack}
          className="w-full flex items-center justify-center gap-3 py-5 px-8 rounded-2xl bg-[#5B1F3D] text-white font-heading text-xs tracking-[0.25em] uppercase transition-all shadow-[0_15px_40px_-10px_rgba(91,31,61,0.4)] hover:scale-[1.02] active:scale-95 border-2 border-[#C8A66A]/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a jornada
        </button>

        <div className="pt-4 opacity-30">
          <span className="text-2xl text-[#C8A66A]">✦</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
