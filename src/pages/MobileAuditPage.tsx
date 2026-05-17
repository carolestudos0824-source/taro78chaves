import React, { useEffect, useState } from "react";
import { HeaderProvider } from "@/contexts/header-context";
import { FontSizeProvider } from "@/contexts/font-size-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const MobileAuditPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 p-8 flex flex-col items-center justify-center text-white">
      <h1 className="text-2xl font-bold mb-4">Página de Auditoria Desativada</h1>
      <p className="text-slate-400">Esta rota foi desativada para garantir a estabilidade do sistema principal.</p>
    </div>
  );
};

export default MobileAuditPage;