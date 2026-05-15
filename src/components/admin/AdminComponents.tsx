import { useState } from "react";
import { 
  ArrowLeft, LayoutDashboard, Users, Crown, Gift, BookOpen, Sparkles, 
  HelpCircle, BarChart3, HeadphonesIcon, Settings, ScrollText, Shield, 
  Smartphone, ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Components for the Admin UI layout and visual refinements
export const AdminHeader = ({ title, subtitle, badge }: { title: string; subtitle: string; badge: string }) => (
  <header className="border-b border-[#C8A66A]/20 bg-white/95 backdrop-blur-md sticky top-0 z-20 shadow-sm">
    <div className="px-4 py-4 flex items-center gap-4">
      <div className="flex flex-col">
        <h1 className="font-heading text-xl md:text-2xl text-[#5B1F3D] font-black tracking-tight">{title}</h1>
        <p className="text-[10px] font-heading tracking-[0.2em] uppercase text-[#C8A66A] font-bold">{subtitle}</p>
      </div>
      <span className="ml-auto text-[10px] font-heading tracking-[0.3em] uppercase px-4 py-1.5 rounded-full border-2 border-[#C8A66A]/40 font-black text-[#5B1F3D] shadow-sm">
        {badge}
      </span>
    </div>
  </header>
);

export const KPICard = ({ 
  icon, label, value, accent = "text-[#5B1F3D]", badge, description 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  accent?: string; 
  badge?: string;
  description?: string;
}) => (
  <div className="p-6 rounded-[2rem] border border-[#C8A66A]/20 bg-white shadow-xl transition-all duration-300 relative group overflow-hidden">
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#C8A66A]/5 rounded-full blur-2xl transition-colors" />
    {badge && (
      <span className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.3em] px-3 py-1 rounded-full bg-[#C8A66A] text-white font-black shadow-sm">{badge}</span>
    )}
    <div className="w-12 h-12 rounded-2xl bg-[#FAF5EF] border-2 border-[#C8A66A]/20 flex items-center justify-center text-[#5B1F3D] mb-4 shadow-inner">
      {icon}
    </div>
    <div className="space-y-1">
      <p className={cn("text-3xl font-heading font-black tracking-tighter", accent)}>{value}</p>
      <p className="text-[10px] font-heading tracking-[0.2em] uppercase text-[#5B1F3D]/50 font-black leading-tight">{label}</p>
      {description && <p className="text-[10px] text-[#5B1F3D]/60 pt-2">{description}</p>}
    </div>
  </div>
);

export const AdminSectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-8 pt-4">
    <h2 className="font-heading text-lg md:text-xl text-[#5B1F3D] font-black tracking-tight uppercase tracking-wider">{title}</h2>
    {subtitle && <p className="text-xs font-body font-medium text-[#5B1F3D]/60 mt-1">{subtitle}</p>}
  </div>
);
