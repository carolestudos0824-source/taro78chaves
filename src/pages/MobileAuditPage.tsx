import React, { useEffect, useState, Suspense, lazy } from "react";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { HeaderProvider } from "@/contexts/header-context";
import { FontSizeProvider } from "@/contexts/font-size-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

// Eagerly import the component we want to test to avoid iframe issues if possible,
// but for the audit we'll use frames to show different sizes simultaneously.
const TrailsPage = lazy(() => import("./TrailsPage"));

const queryClient = new QueryClient();

const MobileAuditPage = () => {
  const [metrics, setMetrics] = useState<any>({});

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyScrollWidth: document.body.scrollWidth,
        innerWidth: window.innerWidth,
      });
    };
    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, []);

  const AuditFrame = ({ width, height, label, src }: { width: number; height: number; label: string; src: string }) => (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-slate-800/80 px-4 py-1 rounded-full border border-white/10">
        <p className="text-white font-heading font-black tracking-widest uppercase text-[10px]">{label} ({width}x{height})</p>
      </div>
      <div className="relative border-[12px] border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden bg-white ring-1 ring-white/10" style={{ width: `${width}px`, height: `${height}px` }}>
        <iframe 
          src={src} 
          style={{ width: '100%', height: '100%', border: 'none' }}
          title={label}
        />
      </div>
    </div>
  );

  const queryParams = "?__lovable_force_render=1&__lovable_no_auth=1";

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8 flex flex-col items-center gap-8 overflow-y-auto pb-32 w-full">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-white w-full max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Auditoria Mobile - Preview Real</h1>
            <p className="text-slate-400 text-sm">URL Atual: <code className="bg-black/30 px-2 py-1 rounded text-pink-400">/auditoria-mobile-trilhas</code></p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-full border border-green-500/30">360x800</span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/30">390x844</span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-bold rounded-full border border-purple-500/30">430x932</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-black/20 p-3 rounded-lg border border-white/5">
            <p className="opacity-60 uppercase text-[9px] font-bold tracking-tighter">document.documentElement.scrollWidth</p>
            <p className="text-xl font-mono">{metrics.scrollWidth}px</p>
          </div>
          <div className="bg-black/20 p-3 rounded-lg border border-white/5">
            <p className="opacity-60 uppercase text-[9px] font-bold tracking-tighter">document.documentElement.clientWidth</p>
            <p className="text-xl font-mono">{metrics.clientWidth}px</p>
          </div>
          <div className="bg-black/20 p-3 rounded-lg border border-white/5">
            <p className="opacity-60 uppercase text-[9px] font-bold tracking-tighter">document.body.scrollWidth</p>
            <p className="text-xl font-mono">{metrics.bodyScrollWidth}px</p>
          </div>
          <div className="bg-black/20 p-3 rounded-lg border border-white/5">
            <p className="opacity-60 uppercase text-[9px] font-bold tracking-tighter">window.innerWidth</p>
            <p className="text-xl font-mono">{metrics.innerWidth}px</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${metrics.scrollWidth > metrics.clientWidth ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
          <p className={`text-sm font-bold uppercase tracking-wide ${metrics.scrollWidth > metrics.clientWidth ? 'text-red-400' : 'text-green-400'}`}>
            {metrics.scrollWidth > metrics.clientWidth ? "Status: Overflow Horizontal Detectado" : "Status: Nenhum Overflow Horizontal"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-12 items-start w-full">
        <AuditFrame width={360} height={800} label="Samsung/Pixel" src={`/trilhas${queryParams}`} />
        <AuditFrame width={390} height={844} label="iPhone 13/14" src={`/trilhas${queryParams}`} />
        <AuditFrame width={430} height={932} label="iPhone Pro Max" src={`/trilhas${queryParams}`} />
      </div>

      <div className="mt-16 bg-white/5 p-8 rounded-3xl border border-white/10 w-full max-w-2xl text-center">
        <p className="text-slate-500 text-xs uppercase tracking-[0.2em] mb-4">Fim do Relatório de Auditoria</p>
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-full" />
      </div>
    </div>
  );
};

export default MobileAuditPage;