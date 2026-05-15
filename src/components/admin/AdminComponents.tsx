import { useState } from "react";
import { 
  ArrowLeft, LayoutDashboard, Users, Crown, Gift, BookOpen, Sparkles, 
  HelpCircle, BarChart3, HeadphonesIcon, Settings, ScrollText, Shield, 
  Smartphone, ChevronRight, CheckCircle2, AlertCircle, Circle, CircleDashed
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
  <div className="p-6 rounded-[2rem] border-2 border-[#C8A66A]/20 bg-white shadow-xl transition-all duration-300 relative group overflow-hidden hover:border-[#C8A66A]/40">
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#C8A66A]/5 rounded-full blur-2xl transition-colors group-hover:bg-[#C8A66A]/10" />
    {badge && (
      <span className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.3em] px-3 py-1 rounded-full bg-[#C8A66A] text-white font-black shadow-sm">{badge}</span>
    )}
    <div className="w-14 h-14 rounded-2xl bg-[#FAF5EF] border-2 border-[#C8A66A]/20 flex items-center justify-center text-[#5B1F3D] mb-5 shadow-inner group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="space-y-1">
      <p className={cn("text-4xl font-heading font-black tracking-tighter", accent)}>{value}</p>
      <p className="text-[11px] font-heading tracking-[0.2em] uppercase text-[#5B1F3D]/60 font-black leading-tight">{label}</p>
      {description && <p className="text-[11px] text-[#5B1F3D]/50 font-medium pt-2 border-t border-[#C8A66A]/10 mt-2">{description}</p>}
    </div>
  </div>
);

export const AdminSectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-10 pt-4">
    <h2 className="font-heading text-2xl md:text-3xl text-[#5B1F3D] font-black tracking-tight uppercase tracking-wider">{title}</h2>
    {subtitle && <p className="text-sm font-body font-bold text-[#5B1F3D]/50 mt-2 max-w-2xl leading-relaxed">{subtitle}</p>}
  </div>
);

export const AdminBadge = ({ 
  children, 
  variant = "default",
  icon: Icon
}: { 
  children: React.ReactNode; 
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "destructive" | "outline";
  icon?: React.ComponentType<{ className?: string }>;
}) => {
  const variants = {
    default: "bg-[#FAF5EF] text-[#5B1F3D]/60 border-[#C8A66A]/20",
    primary: "bg-[#5B1F3D] text-white border-[#C8A66A]",
    secondary: "bg-[#C8A66A]/10 text-[#8B6A30] border-[#C8A66A]/30",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    destructive: "bg-red-50 text-red-700 border-red-200",
    outline: "bg-transparent text-[#5B1F3D]/80 border-[#C8A66A]/40"
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-heading font-black tracking-widest uppercase border shadow-sm",
      variants[variant]
    )}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};

export const AdminTable = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-[2.5rem] border-2 border-[#C8A66A]/20 bg-white overflow-hidden shadow-2xl">
    <div className="overflow-x-auto">
      <table className="w-full">
        {children}
      </table>
    </div>
  </div>
);

export const AdminTableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead>
    <tr className="border-b-2 border-[#C8A66A]/20 bg-[#FAF5EF]/60">
      {children}
    </tr>
  </thead>
);

export const AdminTableHead = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <th className={cn("p-6 text-[11px] font-heading font-black tracking-[0.25em] uppercase text-[#5B1F3D]", className)}>
    {children}
  </th>
);

export const AdminTableRow = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <tr className={cn("border-b border-[#C8A66A]/10 last:border-0 hover:bg-[#FAF5EF]/30 transition-colors", className)}>
    {children}
  </tr>
);

export const AdminTableCell = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={cn("p-4 align-middle", className)}>
    {children}
  </td>
);
