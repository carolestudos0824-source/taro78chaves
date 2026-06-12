import React from "react";
import { 
  Home, 
  BookOpen, 
  Compass, 
  Map, 
  Flame, 
  Moon, 
  Sun, 
  KeyRound, 
  LockKeyhole, 
  UnlockKeyhole, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  CircleDot, 
  Trophy, 
  BadgeCheck, 
  UserRound, 
  MessageCircle, 
  ScrollText, 
  ShieldCheck, 
  UserX, 
  WandSparkles,
  Flower2,
  Crown,
  Heart,
  Shield,
  Lamp,
  Search,
  RefreshCw,
  Scale,
  PauseCircle,
  Skull,
  Droplets,
  Zap,
  Star,
  Megaphone,
  Globe2,
  Route,
  ChevronRight,
  Play,
  ClipboardCheck,
  Sword as LucideSword,
  Gem as LucideGem
} from "lucide-react";

export type TarotIconType = 
  | "jornada" 
  | "formacao" 
  | "trilhas" 
  | "ritual" 
  | "premium" 
  | "perfil" 
  | "feedback" 
  | "suporte" 
  | "legal" 
  | "privacidade" 
  | "termos" 
  | "excluir-conta" 
  | "auditoria"
  | "quiz"
  | "progresso"
  | "concluido"
  | "bloqueado"
  | "liberado"
  | "proximo"
  | "copas" 
  | "paus" 
  | "espadas" 
  | "ouros"
  | "pajem"
  | "cavaleiro"
  | "rainha"
  | "rei"
  // Arcanos Maiores
  | "louco" | "mago" | "sacerdotisa" | "imperatriz" | "imperador" | "hierofante" 
  | "enamorados" | "carro" | "forca" | "eremita" | "roda" | "justica" 
  | "enforcado" | "morte" | "temperanca" | "diabo" | "torre" | "estrela" 
  | "lua" | "sol" | "julgamento" | "mundo";

interface TarotIconProps {
  name: TarotIconType | string;
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

interface SvgProps {
  className?: string;
  size?: number;
  color?: string;
}

const SuitCopas = ({ className, size, color }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 4v3a7 7 0 0 0 14 0V4" />
    <path d="M12 11v8" />
    <path d="M8 20h8" />
    <path d="M5 4h14" />
  </svg>
);

const SuitPaus = ({ className, size, color }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3v18" />
    <path d="M9 7l3-1 3 1" />
    <path d="M10 12l2-1 2 1" />
    <path d="M11 17l1-1 1 1" />
    <path d="M12 3c1.5 0 3 1.5 3 3s-1.5 3-3 3-3-1.5-3-3 1.5-3 3-3z" opacity="0.2" />
  </svg>
);

const SuitEspadas = ({ className, size, color }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3v14" />
    <path d="M8 17h8" />
    <path d="M12 17v4" />
    <path d="M10 3l2-1 2 1v2l-2 1-2-1V3z" />
  </svg>
);

const SuitOuros = ({ className, size, color }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3l2.5 6.5h7l-5.5 4 2 7-6-4.5-6 4.5 2-7-5.5-4h7z" />
  </svg>
);

export const TarotIcon = ({ name, className, size = 24, color = "currentColor", strokeWidth = 2 }: TarotIconProps) => {
  const props = { className, size, color, strokeWidth };

  switch (name) {
    // Suits
    case "copas": return <SuitCopas {...props} />;
    case "paus": return <SuitPaus {...props} />;
    case "espadas": return <SuitEspadas {...props} />;
    case "ouros": return <SuitOuros {...props} />;

    // Navigation / Core
    case "jornada": return <BookOpen {...props} />;
    case "formacao": return <Map {...props} />;
    case "trilhas": return <Route {...props} />;
    case "ritual": return <Flame {...props} />;
    case "premium": return <KeyRound {...props} />;
    case "perfil": return <UserRound {...props} />;
    case "feedback": return <MessageCircle {...props} />;
    case "suporte": return <HelpCircle {...props} />;
    case "legal": return <ScrollText {...props} />;
    case "privacidade": return <ShieldCheck {...props} />;
    case "termos": return <ScrollText {...props} />;
    case "excluir-conta": return <UserX {...props} />;
    case "auditoria": return <ClipboardCheck {...props} />;
    
    // States
    case "bloqueado": return <LockKeyhole {...props} />;
    case "liberado": return <UnlockKeyhole {...props} />;
    case "concluido": return <BadgeCheck {...props} />;
    case "proximo": return <Play {...props} size={size * 0.8} />;
    case "progresso": return <CircleDot {...props} />;
    case "quiz": return <Sparkles {...props} />;

    // Court
    case "pajem": return <CircleDot {...props} />;
    case "cavaleiro": return <Route {...props} />;
    case "rainha": return <Crown {...props} />;
    case "rei": return <Crown {...props} strokeWidth={3} />;

    // Arcanos Maiores
    case "louco": return <Compass {...props} />;
    case "mago": return <WandSparkles {...props} />;
    case "sacerdotisa": return <Moon {...props} />;
    case "imperatriz": return <Flower2 {...props} />;
    case "imperador": return <Crown {...props} />;
    case "hierofante": return <ScrollText {...props} />;
    case "enamorados": return <Heart {...props} />;
    case "carro": return <Shield {...props} />;
    case "forca": return <Heart {...props} strokeWidth={3} />;
    case "eremita": return <Lamp {...props} />;
    case "roda": return <RefreshCw {...props} />;
    case "justica": return <Scale {...props} />;
    case "enforcado": return <PauseCircle {...props} />;
    case "morte": return <Skull {...props} />;
    case "temperanca": return <Droplets {...props} />;
    case "diabo": return <Flame {...props} strokeWidth={3} />;
    case "torre": return <Zap {...props} />;
    case "estrela": return <Star {...props} />;
    case "lua": return <Moon {...props} strokeWidth={3} />;
    case "sol": return <Sun {...props} />;
    case "julgamento": return <Megaphone {...props} />;
    case "mundo": return <Globe2 {...props} />;

    // Fallbacks
    case "Home": return <Home {...props} />;
    case "BookOpen": return <BookOpen {...props} />;
    case "Compass": return <Compass {...props} />;
    case "Map": return <Map {...props} />;
    case "Flame": return <Flame {...props} />;
    case "KeyRound": return <KeyRound {...props} />;
    case "UserRound": return <UserRound {...props} />;
    case "Sparkles": return <Sparkles {...props} />;
    case "ChevronRight": return <ChevronRight {...props} />;

    default:
      // Try to match a Lucide component if it's a known name
      return <Sparkles {...props} />;
  }
};
