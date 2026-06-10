import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageBackControlsProps {
  className?: string;
  fallbackRoute?: string;
  variant?: "top" | "bottom";
  showLabel?: boolean;
}

export const PageBackControls = ({
  className,
  fallbackRoute,
  variant = "bottom",
  showLabel = true,
}: PageBackControlsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // If there's history, go back
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // Fallback logic
      if (fallbackRoute) {
        navigate(fallbackRoute);
        return;
      }

      const path = location.pathname;
      if (path.startsWith("/lesson/")) navigate("/module/arcanos-maiores");
      else if (path.startsWith("/arcano-menor/")) navigate("/mapa");
      else if (path.startsWith("/perfil")) navigate("/perfil");
      else if (path === "/privacidade" || path === "/termos" || path === "/suporte") navigate("/");
      else if (path === "/excluir-conta") navigate("/perfil");
      else navigate("/app");
    }
  };

  return (
    <div
      className={cn(
        "flex items-center",
        variant === "bottom" ? "justify-center py-8 mb-4 px-6" : "justify-start",
        className
      )}
    >
      <Button
        variant="ghost"
        onClick={handleBack}
        className={cn(
          "group transition-all duration-300 flex items-center gap-2",
          variant === "bottom" 
            ? "h-14 px-8 rounded-2xl bg-white/50 backdrop-blur-sm border-2 border-[#DCCFC2]/40 text-[#5B1F3D] hover:bg-[#5B1F3D] hover:text-white hover:border-[#5B1F3D] shadow-sm" 
            : "p-0 h-auto hover:bg-transparent text-[#5B1F3D]/60 hover:text-[#5B1F3D]"
        )}
      >
        {variant === "bottom" ? (
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        ) : (
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        )}
        {showLabel && (
          <span className={cn(
            "font-heading tracking-[0.2em] uppercase font-black",
            variant === "bottom" ? "text-[11px]" : "text-[10px]"
          )}>
            Voltar
          </span>
        )}
      </Button>
    </div>
  );
};
