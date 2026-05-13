import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { 
  X, 
  Home, 
  Map, 
  Flame, 
  Play, 
  Compass, 
  Eye, 
  Stars, 
  Layers, 
  Droplets, 
  Swords, 
  Gem, 
  Crown, 
  GitBranch, 
  Layout, 
  Moon, 
  SquareStack, 
  Target, 
  Sparkles, 
  Briefcase, 
  UserRound, 
  KeyRound, 
  MessageCircle, 
  Headphones, 
  ShieldCheck, 
  FileText, 
  UserX, 
  ClipboardCheck,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-admin";
import { useProgress } from "@/hooks/use-progress";

interface GlobalMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalMenu = ({ isOpen, onClose }: GlobalMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { progress, getCurrentArcanoId } = useProgress();

  const currentArcanoId = getCurrentArcanoId();

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  if (!isOpen) return null;

  const NavItem = ({ to, icon: Icon, label, badge }: { to: string; icon: any; label: string; badge?: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
          isActive 
            ? "bg-[#5B1F3D] text-white shadow-lg" 
            : "hover:bg-[#5B1F3D]/5 text-[#5B1F3D]"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isActive ? "bg-white/20" : "bg-[#FAF5EF] border border-[#C8A66A]/20"
          }`}>
            <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#C8A66A]"}`} />
          </div>
          <span className={`text-[13px] font-heading font-black tracking-tight ${isActive ? "text-white" : "text-[#5B1F3D]"}`}>
            {label}
          </span>
        </div>
        {badge ? (
          <span className={`text-[8px] font-heading font-black uppercase tracking-widest px-2 py-1 rounded-full ${
            isActive ? "bg-white/20 text-white" : "bg-[#C8A66A] text-white"
          }`}>
            {badge}
          </span>
        ) : (
          <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isActive ? "text-white/40" : "text-[#C8A66A]/40"}`} />
        )}
      </Link>
    );
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="px-4 pt-6 pb-2 text-[10px] font-heading font-black tracking-[0.3em] uppercase text-[#C8A66A]">
      {children}
    </h3>
  );

  return (
    <div className={`fixed inset-0 z-[99999] flex transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#5B1F3D]/40 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 left-0 w-[320px] max-w-[85vw] h-full bg-[#FDFBF7] shadow-2xl flex flex-col border-r-2 border-[#C8A66A]/20 transition-transform duration-500 overflow-hidden z-[100000] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="p-6 border-b-2 border-[#C8A66A]/20 flex items-center justify-between bg-white/50">
          <div className="flex flex-col">
            <span className="text-[10px] font-heading font-black tracking-[0.4em] uppercase text-[#C8A66A]">
              Menu Global
            </span>
            <span className="text-lg font-heading font-black text-[#5B1F3D] tracking-tight">
              Tarô 78 Chaves
            </span>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#FAF5EF] border border-[#C8A66A]/20 flex items-center justify-center text-[#5B1F3D] hover:bg-white transition-all shadow-sm active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 pb-32 scrollbar-hide overscroll-contain">
          {/* BLOCO 1 — Jornada */}
          <SectionTitle>Jornada</SectionTitle>
          <NavItem to="/app" icon={Home} label="Jornada Principal" />
          <NavItem to="/trilhas" icon={Map} label="Mapa da Formação" />
          <NavItem to="/desafios" icon={Flame} label="Ritual Diário" />
          <NavItem 
            to={`/lesson/${currentArcanoId}`} 
            icon={Play} 
            label="Continuar Jornada" 
            badge="Agora" 
          />

          {/* BLOCO 2 — Formação */}
          <SectionTitle>Formação</SectionTitle>
          <NavItem to="/module/fundamentos" icon={Compass} label="Fundamentos do Tarô" />
          <NavItem to="/module/leitura-simbolica" icon={Eye} label="Leitura Simbólica" />
          <NavItem to="/module/arcanos-maiores" icon={Stars} label="Arcanos Maiores" />
          <NavItem to="/module/arquitetura-menores" icon={Layers} label="Arquitetura Menores" />
          <NavItem to="/module/copas" icon={Droplets} label="Naipe de Copas" />
          <NavItem to="/module/paus" icon={Flame} label="Naipe de Paus" />
          <NavItem to="/module/espadas" icon={Swords} label="Naipe de Espadas" />
          <NavItem to="/module/ouros" icon={Gem} label="Naipe de Ouros" />
          <NavItem to="/module/cartas-corte" icon={Crown} label="Cartas da Corte" />
          <NavItem to="/module/combinacoes" icon={GitBranch} label="Combinações" />
          <NavItem to="/module/tiragens" icon={Layout} label="Tiragens" />
          <NavItem to="/module/espiritualidade" icon={Moon} label="Tarô e Espiritualidade" />
          <NavItem to="/module/mesa-taro" icon={SquareStack} label="Como Montar Mesa" />
          <NavItem to="/module/leitura-aplicada" icon={Target} label="Leitura Aplicada" />
          <NavItem to="/module/pratica" icon={Sparkles} label="Prática Guiada" />
          <NavItem to="/module/trabalhar-taro" icon={Briefcase} label="Trabalhar com Tarô" />

          {/* BLOCO 3 — Conta */}
          <SectionTitle>Conta</SectionTitle>
          <NavItem to="/perfil" icon={UserRound} label="Meu Perfil" />
          <NavItem to="/premium" icon={KeyRound} label="Plano Premium" />
          <NavItem to="/feedback" icon={MessageCircle} label="Enviar Feedback" />
          <NavItem to="/suporte" icon={Headphones} label="Suporte Técnico" />

          {/* BLOCO 4 — Legal */}
          <SectionTitle>Legal</SectionTitle>
          <NavItem to="/privacidade" icon={ShieldCheck} label="Privacidade" />
          <NavItem to="/termos" icon={FileText} label="Termos de Uso" />
          <NavItem to="/excluir-conta" icon={UserX} label="Excluir Conta" />

          {/* BLOCO 5 — Auditoria interna */}
          {(isAdmin || process.env.NODE_ENV === 'development') && (
            <>
              <SectionTitle>Auditoria</SectionTitle>
              <NavItem to="/qa-rotas" icon={ClipboardCheck} label="Auditoria de Rotas" />
            </>
          )}

          <div className="pt-8 pb-4">
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-[#5B1F3D]/60 hover:text-[#5B1F3D] hover:bg-red-50 transition-all border-2 border-transparent hover:border-red-100"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-[13px] font-heading font-black tracking-tight uppercase">
                Encerrar Sessão
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t-2 border-[#C8A66A]/20">
          <p className="text-[10px] font-heading font-black tracking-[0.4em] text-[#C8A66A] uppercase text-center">
            Tarô 78 Chaves · © 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalMenu;