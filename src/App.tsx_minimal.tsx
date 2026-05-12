import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { FontSizeProvider } from "@/contexts/font-size-context";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const MarkerUpdater = ({ path }: { path: string }) => {
  useEffect(() => {
    const marker = document.getElementById("boot-marker");
    if (marker) {
      marker.innerText = `TEST C3: ROUTER MOCK - ${path}`;
    }
  }, [path]);
  return null;
};

const FakePage = ({ title }: { title: string }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  
  let authStatus = "LOADING";
  if (!loading) {
    authStatus = session ? "LOGGED" : "PUBLIC";
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999997,
      background: '#1a1f2e',
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
      <MarkerUpdater path={location.pathname} />
      <h1>TEST C3: ROUTER MOCK OK</h1>
      <h2 style={{ fontSize: '20px', color: '#fff', marginTop: '10px' }}>PÁGINA: {title}</h2>
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        border: '2px solid #f5d78e',
        background: 'rgba(245, 215, 142, 0.1)'
      }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>AUTH STATUS: {authStatus}</p>
      </div>
      
      <nav style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: '#f5d78e', fontSize: '16px' }}>Home (/)</Link>
        <Link to="/app" style={{ color: '#f5d78e', fontSize: '16px' }}>App (/app)</Link>
        <Link to="/apresentacao" style={{ color: '#f5d78e', fontSize: '16px' }}>Apresentação (/apresentacao)</Link>
      </nav>
      
      <p style={{ fontSize: '14px', marginTop: '30px', opacity: 0.8 }}>
        Navegação mock ativa para validar o componente Router.
      </p>
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
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<FakePage title="Home" />} />
                <Route path="/app" element={<FakePage title="App Dashboard" />} />
                <Route path="/apresentacao" element={<FakePage title="Apresentação" />} />
                <Route path="*" element={<FakePage title="404 Not Found" />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </FontSizeProvider>
    </QueryClientProvider>
  );
};

export default App;
