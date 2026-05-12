import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { FontSizeProvider } from "@/contexts/font-size-context";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const AuthTestDisplay = () => {
  const { session, loading } = useAuth();
  const [timeoutActive, setTimeoutActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setTimeoutActive(true);
        const marker = document.getElementById("boot-marker");
        if (marker) marker.innerText = "AUTH TIMEOUT - FALLBACK PUBLIC";
      }
    }, 5000);

    const marker = document.getElementById("boot-marker");
    if (marker) {
      marker.innerText = "TEST C2: AUTH PROVIDER - RENDERING";
    }
    
    return () => clearTimeout(timer);
  }, [loading]);

  let authStatus = "LOADING";
  if (!loading) {
    if (session) authStatus = "LOGGED";
    else authStatus = "PUBLIC";
  } else if (timeoutActive) {
    authStatus = "TIMEOUT (FALLBACK PUBLIC)";
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999997,
      background: '#1a1f1a',
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
      <h1>TEST C2: AUTH PROVIDER OK</h1>
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        border: '2px solid #f5d78e',
        background: 'rgba(245, 215, 142, 0.1)'
      }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>AUTH STATUS: {authStatus}</p>
      </div>
      <p style={{ fontSize: '16px', marginTop: '15px' }}>O AuthProvider foi reintroduzido para teste de conexão.</p>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FontSizeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthTestDisplay />
          </TooltipProvider>
        </AuthProvider>
      </FontSizeProvider>
    </QueryClientProvider>
  );
};

export default App;
