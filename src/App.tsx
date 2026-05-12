import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { FontSizeProvider } from "@/contexts/font-size-context";
// Beta components removed
import BottomNav from "@/components/BottomNav";
import SessionInitializer from "@/components/SessionInitializer";
import { initGA, trackPageView, useUTMTracker } from "@/lib/analytics";

// Eager: critical path
import LandingPage from "./pages/LandingPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
// import ModulesPage from "./pages/ModulesPage.tsx"; // Replaced by lazy in AppRouteProbe

// Lazy: everything else
const Index = lazy(() => import("./pages/Index.tsx"));
const LessonPage = lazy(() => import("./pages/LessonPage.tsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.tsx"));
const PremiumPage = lazy(() => import("./pages/PremiumPage.tsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.tsx"));
const FoolsJourneyPage = lazy(() => import("./pages/FoolsJourneyPage.tsx"));
const FundamentosPage = lazy(() => import("./pages/FundamentosPage.tsx"));
const FundamentosLessonPage = lazy(() => import("./pages/FundamentosLessonPage.tsx"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage.tsx"));
const BetaInvitePage = lazy(() => import("./pages/BetaInvitePage.tsx"));

const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const JourneyJournalPage = lazy(() => import("./pages/JourneyJournalPage.tsx"));


// Module pages
const NaipePage = lazy(() => import("./pages/NaipePage.tsx"));
const NaipeIntroPage = lazy(() => import("./pages/NaipeIntroPage.tsx"));
const ArcanoMenorLessonPage = lazy(() => import("./pages/ArcanoMenorLessonPage.tsx"));
const CombinacoesPage = lazy(() => import("./pages/CombinacoesPage.tsx"));
const CombinacoesLessonPage = lazy(() => import("./pages/CombinacoesLessonPage.tsx"));
const TiragensPage = lazy(() => import("./pages/TiragensPage.tsx"));
const TiragensLessonPage = lazy(() => import("./pages/TiragensLessonPage.tsx"));
const AmorPage = lazy(() => import("./pages/AmorPage.tsx"));
const AmorLessonPage = lazy(() => import("./pages/AmorLessonPage.tsx"));
const PraticaPage = lazy(() => import("./pages/PraticaPage.tsx"));
const PraticaLessonPage = lazy(() => import("./pages/PraticaLessonPage.tsx"));

// New generic modules
const LeituraSimbolicaPage = lazy(() => import("./pages/LeituraSimbolicaPage.tsx"));
const LeituraSimbolicaLessonPage = lazy(() => import("./pages/LeituraSimbolicaLessonPage.tsx"));
const ArquiteturaMenoresPage = lazy(() => import("./pages/ArquiteturaMenoresPage.tsx"));
const ArquiteturaMenoresLessonPage = lazy(() => import("./pages/ArquiteturaMenoresLessonPage.tsx"));
const EspiritualidadePage = lazy(() => import("./pages/EspiritualidadePage.tsx"));
const EspiritualidadeLessonPage = lazy(() => import("./pages/EspiritualidadeLessonPage.tsx"));
const MesaTaroPage = lazy(() => import("./pages/MesaTaroPage.tsx"));
const MesaTaroLessonPage = lazy(() => import("./pages/MesaTaroLessonPage.tsx"));
const LeituraAplicadaPage = lazy(() => import("./pages/LeituraAplicadaPage.tsx"));
const LeituraAplicadaLessonPage = lazy(() => import("./pages/LeituraAplicadaLessonPage.tsx"));
const TrabalharTaroPage = lazy(() => import("./pages/TrabalharTaroPage.tsx"));
const TrabalharTaroLessonPage = lazy(() => import("./pages/TrabalharTaroLessonPage.tsx"));

// Utility pages
const TrailsPage = lazy(() => import("./pages/TrailsPage.tsx"));
const ReviewPage = lazy(() => import("./pages/ReviewPage.tsx"));
const DailyChallengesPage = lazy(() => import("./pages/DailyChallengesPage.tsx"));
const CertificatesPage = lazy(() => import("./pages/CertificatesPage.tsx"));
const SymbolLibraryPage = lazy(() => import("./pages/SymbolLibraryPage.tsx"));
const StudyRoutinePage = lazy(() => import("./pages/StudyRoutinePage.tsx"));
const CartasCortePage = lazy(() => import("./pages/CartasCortePage.tsx"));
const NumerologiaPage = lazy(() => import("./pages/NumerologiaPage.tsx"));
const PresentationPage = lazy(() => import("./pages/PresentationPage.tsx"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage.tsx"));

// Legal / compliance pages
const PrivacyPage = lazy(() => import("./pages/legal/PrivacyPage.tsx"));
const TermsPage = lazy(() => import("./pages/legal/TermsPage.tsx"));
const SupportPage = lazy(() => import("./pages/legal/SupportPage.tsx"));
const DeleteAccountPage = lazy(() => import("./pages/legal/DeleteAccountPage.tsx"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] relative overflow-hidden">
    {/* Decorative background elements consistent with the brand */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gold blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gold blur-[120px]" />
    </div>

    <div className="text-center space-y-6 relative z-10 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-gold/20 border-t-gold animate-spin mx-auto" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-[10px] text-plum/80 font-heading tracking-[0.3em] uppercase">Tarô 78 Chaves</p>
        <p className="text-[11px] text-plum/60 font-body italic">Preparando sua jornada...</p>
      </div>
    </div>
  </div>
);

/** Redirects to /auth if not logged in */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/auth" replace />;
  return (
    <>
      <SessionInitializer />
      {children}
    </>
  );
};

/** Redirects to /app if already logged in */
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (user) return <Navigate to="/app" replace />;
  return <>{children}</>;
};

const P = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const AnalyticsTracker = () => {
  const location = useLocation();
  useUTMTracker();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

const AppRoutes = () => {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AnalyticsTracker />
      <Routes>
        {/* ═══ Public Routes (No Shell) ═══ */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/termos" element={<TermsPage />} />

        {/* ═══ App Shell Routes (Layout Wrapper) ═══ */}
        <Route element={<AppShell />}>
          {/* Dashboard */}
          <Route path="/app" element={<P><AppRouteProbe /></P>} />
          <Route path="/trilhas" element={<P><TrailsPage /></P>} />

          {/* Fundamentos */}
          <Route path="/module/fundamentos" element={<P><FundamentosPage /></P>} />
          <Route path="/fundamentos/:order" element={<P><FundamentosLessonPage /></P>} />

          {/* Arcanos Maiores */}
          <Route path="/module/arcanos-maiores" element={<P><Index /></P>} />
          <Route path="/lesson/:id" element={<P><LessonPage /></P>} />
          <Route path="/jornada-do-louco" element={<P><FoolsJourneyPage /></P>} />

          {/* Arcanos Menores — Naipes */}
          <Route path="/module/copas" element={<P><NaipePage /></P>} />
          <Route path="/module/paus" element={<P><NaipePage /></P>} />
          <Route path="/module/espadas" element={<P><NaipePage /></P>} />
          <Route path="/module/ouros" element={<P><NaipePage /></P>} />
          <Route path="/naipe/:naipe/intro" element={<P><NaipeIntroPage /></P>} />
          <Route path="/module/cartas-corte" element={<P><CartasCortePage /></P>} />
          <Route path="/cartas-corte" element={<Navigate to="/module/cartas-corte" replace />} />
          <Route path="/numerologia" element={<P><NumerologiaPage /></P>} />
          <Route path="/arcano-menor/:id" element={<P><ArcanoMenorLessonPage /></P>} />

          {/* Combinações */}
          <Route path="/module/combinacoes" element={<P><CombinacoesPage /></P>} />
          <Route path="/combinacoes/:order" element={<P><CombinacoesLessonPage /></P>} />

          {/* Tiragens */}
          <Route path="/module/tiragens" element={<P><TiragensPage /></P>} />
          <Route path="/tiragens/:order" element={<P><TiragensLessonPage /></P>} />

          {/* Amor */}
          <Route path="/module/amor" element={<P><AmorPage /></P>} />
          <Route path="/amor/:order" element={<P><AmorLessonPage /></P>} />

          {/* Prática */}
          <Route path="/module/pratica" element={<P><PraticaPage /></P>} />
          <Route path="/pratica/:order" element={<P><PraticaLessonPage /></P>} />

          {/* Leitura Simbólica */}
          <Route path="/module/leitura-simbolica" element={<P><LeituraSimbolicaPage /></P>} />
          <Route path="/leitura-simbolica/:order" element={<P><LeituraSimbolicaLessonPage /></P>} />

          {/* Arquitetura dos Menores */}
          <Route path="/module/arquitetura-menores" element={<P><ArquiteturaMenoresPage /></P>} />
          <Route path="/arquitetura-menores/:order" element={<P><ArquiteturaMenoresLessonPage /></P>} />

          {/* Espiritualidade */}
          <Route path="/module/espiritualidade" element={<P><EspiritualidadePage /></P>} />
          <Route path="/espiritualidade/:order" element={<P><EspiritualidadeLessonPage /></P>} />

          {/* Mesa de Tarô */}
          <Route path="/module/mesa-taro" element={<P><MesaTaroPage /></P>} />
          <Route path="/mesa-taro/:order" element={<P><MesaTaroLessonPage /></P>} />

          {/* Leitura Aplicada */}
          <Route path="/module/leitura-aplicada" element={<P><LeituraAplicadaPage /></P>} />
          <Route path="/leitura-aplicada/:order" element={<P><LeituraAplicadaLessonPage /></P>} />

          {/* Trabalhar com Tarô */}
          <Route path="/module/trabalhar-taro" element={<P><TrabalharTaroPage /></P>} />
          <Route path="/trabalhar-taro/:order" element={<P><TrabalharTaroLessonPage /></P>} />

          {/* Ferramentas de estudo */}
          <Route path="/revisao" element={<P><ReviewPage /></P>} />
          <Route path="/desafios" element={<P><DailyChallengesPage /></P>} />
          <Route path="/certificados" element={<P><CertificatesPage /></P>} />
          <Route path="/biblioteca" element={<P><SymbolLibraryPage /></P>} />
          <Route path="/rotina" element={<P><StudyRoutinePage /></P>} />

          {/* Premium & Profile */}
          <Route path="/premium" element={<P><PremiumPage /></P>} />
          <Route path="/perfil" element={<P><ProfilePage /></P>} />
          <Route path="/minha-jornada" element={<P><JourneyJournalPage /></P>} />
          <Route path="/feedback" element={<P><FeedbackPage /></P>} />
          <Route path="/admin" element={<P><AdminPage /></P>} />
          
          {/* Aliases for bad URLs */}
          <Route path="/undefined" element={<Navigate to="/app" replace />} />
          <Route path="/null" element={<Navigate to="/app" replace />} />
          <Route path="/NaN" element={<Navigate to="/app" replace />} />
        </Route>

        {/* Catch-all final */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const LazyModulesPage = lazy(() => {
  console.log("MODULES PAGE IMPORT START");
  const marker = document.getElementById("boot-marker");
  if (marker) marker.innerText += " | MODULES PAGE IMPORT START";
  
  return import("./pages/ModulesPage").then(m => {
    console.log("MODULES PAGE IMPORT DONE");
    if (marker) marker.innerText += " | MODULES PAGE IMPORT DONE";
    return m;
  }).catch(err => {
    console.error("MODULES PAGE IMPORT ERROR", err);
    if (marker) {
      marker.innerText += " | MODULES PAGE IMPORT ERROR";
      marker.style.background = '#800';
    }
    throw err;
  });
});

const AppRouteProbe = () => {
  useEffect(() => {
    console.log("ROUTE APP ELEMENT ENTERED");
    const marker = document.getElementById("boot-marker");
    if (marker) marker.innerText += " | ROUTE APP ELEMENT ENTERED";
  }, []);

  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center bg-[#FAF5EF] space-y-4 min-h-[60vh]">
        <div className="text-[10px] font-mono text-blue-600 animate-pulse">CARREGANDO JORNADA REAL...</div>
        <LoadingFallback />
      </div>
    }>
      <LazyModulesPage />
    </Suspense>
  );
};

/** Layout shell for authenticated app pages — includes BottomNav */
const AppShell = () => (
  <>
    {/* Layout shell for authenticated app pages — includes BottomNav */}
    <div className="pb-bottom-nav">
      <Outlet />
    </div>
    <BottomNav />
  </>
);

const App = () => {
  useEffect(() => {
    const marker = document.getElementById("boot-marker");
    if (marker) marker.innerText = "APP ROOT RENDERED";
    console.log("App component mounted");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <FontSizeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div id="boot-marker" style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 999999,
              background: 'rgba(0,0,0,0.8)',
              color: '#fff',
              fontSize: '10px',
              padding: '2px 10px',
              textAlign: 'center',
              pointerEvents: 'none',
              fontFamily: 'monospace'
            }}>
              PROVIDERS REAL READY
            </div>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </FontSizeProvider>
    </QueryClientProvider>
  );
};

export default App;
