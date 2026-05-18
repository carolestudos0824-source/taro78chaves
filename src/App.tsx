import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { FontSizeProvider } from "@/contexts/font-size-context";
import { HeaderProvider } from "@/contexts/header-context";
import { useProgress } from "@/hooks/use-progress";
import { Header } from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SessionInitializer from "@/components/SessionInitializer";
import { initGA, trackPageView, useUTMTracker } from "@/lib/analytics";

// Eager: critical path
import LandingPage from "./pages/LandingPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";

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
// QARotasPage removed


const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] relative overflow-hidden">
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/termos" element={<TermsPage />} />
        <Route path="/suporte" element={<SupportPage />} />
        <Route path="/excluir-conta" element={<DeleteAccountPage />} />
        <Route path="/apresentacao" element={<PresentationPage />} />

        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/app" replace />} />
          <Route path="/app" element={<P><AppRouteProbe /></P>} />
          <Route path="/trilhas" element={<P><TrailsPage /></P>} />
          <Route path="/module/fundamentos" element={<P><FundamentosPage /></P>} />
          <Route path="/fundamentos/:order" element={<P><FundamentosLessonPage /></P>} />
          <Route path="/module/arcanos-maiores" element={<P><Index /></P>} />
          <Route path="/lesson/:id" element={<P><LessonPage /></P>} />
          <Route path="/jornada-do-louco" element={<P><FoolsJourneyPage /></P>} />
          <Route path="/module/copas" element={<P><NaipePage /></P>} />
          <Route path="/module/paus" element={<P><NaipePage /></P>} />
          <Route path="/module/espadas" element={<P><NaipePage /></P>} />
          <Route path="/module/ouros" element={<P><NaipePage /></P>} />
          <Route path="/naipe/:naipe/intro" element={<P><NaipeIntroPage /></P>} />
          <Route path="/module/cartas-corte" element={<P><CartasCortePage /></P>} />
          <Route path="/cartas-corte" element={<Navigate to="/module/cartas-corte" replace />} />
          <Route path="/numerologia" element={<P><NumerologiaPage /></P>} />
          <Route path="/arcano-menor/:id" element={<P><ArcanoMenorLessonPage /></P>} />
          <Route path="/module/combinacoes" element={<P><CombinacoesPage /></P>} />
          <Route path="/combinacoes/:order" element={<P><CombinacoesLessonPage /></P>} />
          <Route path="/module/tiragens" element={<P><TiragensPage /></P>} />
          <Route path="/tiragens/:order" element={<P><TiragensLessonPage /></P>} />
          <Route path="/module/amor" element={<P><AmorPage /></P>} />
          <Route path="/amor/:order" element={<P><AmorLessonPage /></P>} />
          <Route path="/module/pratica" element={<P><PraticaPage /></P>} />
          <Route path="/pratica/:order" element={<P><PraticaLessonPage /></P>} />
          <Route path="/module/leitura-simbolica" element={<P><LeituraSimbolicaPage /></P>} />
          <Route path="/leitura-simbolica/:order" element={<P><LeituraSimbolicaLessonPage /></P>} />
          <Route path="/module/arquitetura-menores" element={<P><ArquiteturaMenoresPage /></P>} />
          <Route path="/arquitetura-menores/:order" element={<P><ArquiteturaMenoresLessonPage /></P>} />
          <Route path="/module/espiritualidade" element={<P><EspiritualidadePage /></P>} />
          <Route path="/espiritualidade/:order" element={<P><EspiritualidadeLessonPage /></P>} />
          <Route path="/module/mesa-taro" element={<P><MesaTaroPage /></P>} />
          <Route path="/mesa-taro/:order" element={<P><MesaTaroLessonPage /></P>} />
          <Route path="/module/leitura-aplicada" element={<P><LeituraAplicadaPage /></P>} />
          <Route path="/leitura-aplicada/:order" element={<P><LeituraAplicadaLessonPage /></P>} />
          <Route path="/module/trabalhar-taro" element={<P><TrabalharTaroPage /></P>} />
          <Route path="/trabalhar-taro/:order" element={<P><TrabalharTaroLessonPage /></P>} />
          <Route path="/revisao" element={<P><ReviewPage /></P>} />
          <Route path="/desafios" element={<P><DailyChallengesPage /></P>} />
          <Route path="/certificados" element={<P><CertificatesPage /></P>} />
          <Route path="/biblioteca" element={<P><SymbolLibraryPage /></P>} />
          <Route path="/rotina" element={<P><StudyRoutinePage /></P>} />
          <Route path="/premium" element={<P><PremiumPage /></P>} />
          <Route path="/perfil" element={<P><ProfilePage /></P>} />
          <Route path="/minha-jornada" element={<P><JourneyJournalPage /></P>} />
          <Route path="/feedback" element={<P><FeedbackPage /></P>} />
          <Route path="/admin" element={<P><AdminPage /></P>} />
          {/* QA route removed */}
          
          
          <Route path="/null" element={<Navigate to="/app" replace />} />
          <Route path="/NaN" element={<Navigate to="/app" replace />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const LazyModulesPage = lazy(() => import("./pages/ModulesPage"));

const AppRouteProbe = () => {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center bg-[#FAF5EF] space-y-4 min-h-[60vh]">
        <LoadingFallback />
      </div>
    }>
      <LazyModulesPage />
    </Suspense>
  );
};

const AppShell = () => {
  const { progress } = useProgress();
  
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col overflow-x-hidden w-full max-w-full relative">
      <Header 
        streak={progress.streak} 
        xp={progress.xp} 
        level={progress.level} 
      />
      <main className="flex-1 pb-28">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HeaderProvider>
        <FontSizeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <AppRoutes />
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </FontSizeProvider>
      </HeaderProvider>
    </QueryClientProvider>
  );
};

export default App;