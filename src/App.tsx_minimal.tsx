import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { FontSizeProvider } from "@/contexts/font-size-context";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const marker = document.getElementById("boot-marker");
    if (marker) {
      marker.innerText = "TEST C1: BASIC PROVIDERS - RENDERING";
    }
    console.log("App C1 mounted");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <FontSizeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999997,
            background: '#1a1a2e',
            color: '#f5d78e',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontFamily: 'serif',
            textAlign: 'center',
            padding: '20px'
          }}>
            <h1>TEST C1: BASIC PROVIDERS OK</h1>
            <p style={{ fontSize: '16px', marginTop: '10px' }}>QueryClient, FontSize, Tooltip e Toasters carregados corretamente.</p>
          </div>
        </TooltipProvider>
      </FontSizeProvider>
    </QueryClientProvider>
  );
};

export default App;
