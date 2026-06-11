import { lazy, Suspense, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProgressProvider } from "@/hooks/use-progress";
import { PremiumProvider, usePremium } from "@/hooks/use-premium";
import { RoleProvider, useRole } from "@/hooks/use-role";
import { FontSizeProvider } from "@/contexts/font-size-context";
import { HeaderProvider } from "@/contexts/header-context";
import { Header } from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SessionInitializer from "@/components/SessionInitializer";
import ConsentBanner from "@/components/ConsentBanner";
import SecurityGate from "@/components/SecurityGate";
import { trackPageView, useUTMTracker } from "@/lib/analytics";
import { useProgress } from "@/hooks/use-progress";

// Eager: critical path (Zero Flicker)
import LandingPage from "./pages/LandingPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import Index from "./pages/Index.tsx";
import LessonPage from "./pages/LessonPage.tsx";
import PremiumPage from "./pages/PremiumPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import FoolsJourneyPage from "./pages/FoolsJourneyPage.tsx";
import TrailsPage from "./pages/TrailsPage.tsx";
import DailyChallengesPage from "./pages/DailyChallengesPage.tsx";
import ArcanosMenoresModulePage from "./pages/ArcanosMenoresModulePage.tsx";




// Eager Module & Lesson Pages (Crucial for Journey Continuity)
import NaipePage from "./pages/NaipePage.tsx";
import NaipeIntroPage from "./pages/NaipeIntroPage.tsx";
import ArcanoMenorLessonPage from "./pages/ArcanoMenorLessonPage.tsx";
import AmorPage from "./pages/AmorPage.tsx";
import AmorLessonPage from "./pages/AmorLessonPage.tsx";
import LeituraSimbolicaPage from "./pages/LeituraSimbolicaPage.tsx";
import LeituraSimbolicaLessonPage from "./pages/LeituraSimbolicaLessonPage.tsx";
import ArquiteturaMenoresPage from "./pages/ArquiteturaMenoresPage.tsx";
import ArquiteturaMenoresLessonPage from "./pages/ArquiteturaMenoresLessonPage.tsx";
import PraticaPage from "./pages/PraticaPage.tsx";
import PraticaLessonPage from "./pages/PraticaLessonPage.tsx";

// Lazy: strictly non-critical or rarely accessed
const AdminPage = lazy(() => import("./pages/AdminPage.tsx"));
const FundamentosPage = lazy(() => import("./pages/FundamentosPage.tsx"));
const FundamentosLessonPage = lazy(() => import("./pages/FundamentosLessonPage.tsx"));
const BetaInvitePage = lazy(() => import("./pages/BetaInvitePage.tsx"));
const AcessoComprado = lazy(() => import("./pages/AcessoComprado.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const JourneyJournalPage = lazy(() => import("./pages/JourneyJournalPage.tsx"));
const CombinacoesPage = lazy(() => import("./pages/CombinacoesPage.tsx"));
const CombinacoesLessonPage = lazy(() => import("./pages/CombinacoesLessonPage.tsx"));
const TiragensPage = lazy(() => import("./pages/TiragensPage.tsx"));
const TiragensLessonPage = lazy(() => import("./pages/TiragensLessonPage.tsx"));
const EspiritualidadePage = lazy(() => import("./pages/EspiritualidadePage.tsx"));
const EspiritualidadeLessonPage = lazy(() => import("./pages/EspiritualidadeLessonPage.tsx"));
const MesaTaroPage = lazy(() => import("./pages/MesaTaroPage.tsx"));
const MesaTaroLessonPage = lazy(() => import("./pages/MesaTaroLessonPage.tsx"));
const LeituraAplicadaPage = lazy(() => import("./pages/LeituraAplicadaPage.tsx"));
const LeituraAplicadaLessonPage = lazy(() => import("./pages/LeituraAplicadaLessonPage.tsx"));
const TrabalharTaroPage = lazy(() => import("./pages/TrabalharTaroPage.tsx"));
const TrabalharTaroLessonPage = lazy(() => import("./pages/TrabalharTaroLessonPage.tsx"));
const ReviewPage = lazy(() => import("./pages/ReviewPage.tsx"));
const CertificatesPage = lazy(() => import("./pages/CertificatesPage.tsx"));
const SymbolLibraryPage = lazy(() => import("./pages/SymbolLibraryPage.tsx"));
const StudyRoutinePage = lazy(() => import("./pages/StudyRoutinePage.tsx"));
const CartasCortePage = lazy(() => import("./pages/CartasCortePage.tsx"));
const NumerologiaPage = lazy(() => import("./pages/NumerologiaPage.tsx"));
const PresentationPage = lazy(() => import("./pages/PresentationPage.tsx"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage.tsx"));
const PrivacyPage = lazy(() => import("./pages/legal/PrivacyPage.tsx"));
const TermsPage = lazy(() => import("./pages/legal/TermsPage.tsx"));
import SupportPage from "./pages/legal/OfficialSupport.tsx";
const DeleteAccountPage = lazy(() => import("./pages/legal/DeleteAccountPage.tsx"));
const ValidateCertificatePage = lazy(() => import("./pages/ValidateCertificatePage.tsx"));
const CertificateVisualModel = lazy(() => import("./pages/CertificateVisualModel.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAF5EF] relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#C8A66A] blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#C8A66A] blur-[120px]" />
    </div>
    <div className="text-center space-y-6 relative z-10">
      <div className="w-12 h-12 rounded-full border-2 border-[#C8A66A]/20 border-t-[#C8A66A] animate-spin mx-auto" />
      <div className="space-y-2">
        <p className="text-[10px] text-[#5B1F3D]/80 font-heading tracking-[0.3em] uppercase">Tarô 78 Chaves</p>
        <p className="text-[11px] text-[#5B1F3D]/60 font-body italic">Sintonizando sua jornada...</p>
      </div>
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { loading: roleLoading } = useRole();
  const { loading: premiumLoading } = usePremium();
  
  if (authLoading && !user) return <LoadingFallback />;
  if (!authLoading && !user) return <Navigate to="/" replace />;
  if ((roleLoading || premiumLoading) && !user) return <LoadingFallback />;
  
  return (
    <>
      <SessionInitializer />
      {children}
    </>
  );
};

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { isFirstVisit, loading: progressLoading } = useProgress();
  
  if (loading || progressLoading) return <LoadingFallback />;
  if (user) {
    if (isFirstVisit) return <Navigate to="/module/fundamentos" replace />;
    return <Navigate to="/app" replace />;
  }
  return <>{children}</>;
};

const AnalyticsTracker = () => {
  const location = useLocation();
  useUTMTracker();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
  return null;
};

const AppShell = ({ children }: { children?: React.ReactNode }) => {
  const { progress } = useProgress();
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF5EF]">
      <Header 
        streak={progress.streak} 
      />

      <main className="flex-1 pb-24 relative overflow-y-auto h-[calc(100vh-72px)]">
        {/* Suspense removed from here to prevent content vanishing between eager routes */}
        {children || <Outlet />}
      </main>
      <BottomNav />
    </div>
  );
};


const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={null}>
    {children}
  </Suspense>
);

const AppRoutes = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Debug for route matching in external preview
    if (location.pathname.includes("jornada")) {
      console.log("[RouteDebug] Current path:", location.pathname);
      console.log("[RouteDebug] Is authenticated:", !!localStorage.getItem("supabase.auth.token"));
    }
  }, [location.pathname]);



  return (
    <>
      <AnalyticsTracker />
      <ConsentBanner />
      <Routes>
        <Route path="/jornada" element={<ProtectedRoute><AppShell><SecurityGate><FoolsJourneyPage /></SecurityGate></AppShell></ProtectedRoute>} />
        <Route path="/jornada-do-louco" element={<ProtectedRoute><AppShell><SecurityGate><FoolsJourneyPage /></SecurityGate></AppShell></ProtectedRoute>} />

        <Route path="/" element={<LandingPage />} />
        <Route path="/venda" element={<LandingPage isSalesPage={true} />} />
        <Route path="/acesso-comprado" element={<LazyRoute><AcessoComprado /></LazyRoute>} />
        <Route path="/auth" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
        <Route path="/reset-password" element={<LazyRoute><ResetPasswordPage /></LazyRoute>} />
        <Route path="/privacidade" element={<LazyRoute><PrivacyPage /></LazyRoute>} />
        <Route path="/termos" element={<LazyRoute><TermsPage /></LazyRoute>} />
        <Route path="/suporte" element={<SupportPage />} />
        <Route path="/excluir-conta" element={<LazyRoute><DeleteAccountPage /></LazyRoute>} />
        <Route path="/apresentacao" element={<LazyRoute><PresentationPage /></LazyRoute>} />
        <Route path="/validar-certificado" element={<LazyRoute><ValidateCertificatePage /></LazyRoute>} />
        <Route path="/visual-certificado" element={<LazyRoute><CertificateVisualModel /></LazyRoute>} />



        


        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/app" element={<DashboardPage />} />
          <Route path="/trilhas" element={<SecurityGate><TrailsPage /></SecurityGate>} />
          <Route path="/mapa" element={<SecurityGate><TrailsPage /></SecurityGate>} />


          <Route path="/desafios" element={<SecurityGate><DailyChallengesPage /></SecurityGate>} />
          <Route path="/premium" element={<SecurityGate><PremiumPage /></SecurityGate>} />
          <Route path="/perfil" element={<SecurityGate><ProfilePage /></SecurityGate>} />
          <Route path="/lesson/:id" element={<SecurityGate><LessonPage /></SecurityGate>} />
          <Route path="/module/arcanos-maiores" element={<Index />} />
          <Route path="/module/arcanos-menores" element={<SecurityGate><ArcanosMenoresModulePage /></SecurityGate>} />


          
          <Route path="/module/fundamentos" element={<LazyRoute><FundamentosPage /></LazyRoute>} />
          <Route path="/fundamentos/:order" element={<LazyRoute><FundamentosLessonPage /></LazyRoute>} />
          <Route path="/module/copas" element={<NaipePage />} />
          <Route path="/module/paus" element={<NaipePage />} />
          <Route path="/module/espadas" element={<NaipePage />} />
          <Route path="/module/ouros" element={<NaipePage />} />
          <Route path="/naipe/:naipe/intro" element={<NaipeIntroPage />} />
          <Route path="/module/cartas-corte" element={<LazyRoute><CartasCortePage /></LazyRoute>} />
          <Route path="/numerologia" element={<LazyRoute><NumerologiaPage /></LazyRoute>} />
          <Route path="/arcano-menor/:id" element={<ArcanoMenorLessonPage />} />
          <Route path="/module/combinacoes" element={<LazyRoute><CombinacoesPage /></LazyRoute>} />
          <Route path="/combinacoes/:order" element={<LazyRoute><CombinacoesLessonPage /></LazyRoute>} />
          <Route path="/module/tiragens" element={<LazyRoute><TiragensPage /></LazyRoute>} />
          <Route path="/tiragens/:order" element={<LazyRoute><TiragensLessonPage /></LazyRoute>} />
          <Route path="/module/amor" element={<AmorPage />} />
          <Route path="/amor/:order" element={<AmorLessonPage />} />
          <Route path="/module/pratica" element={<PraticaPage />} />
          <Route path="/pratica/:order" element={<PraticaLessonPage />} />
          <Route path="/module/leitura-simbolica" element={<LeituraSimbolicaPage />} />
          <Route path="/leitura-simbolica/:order" element={<LeituraSimbolicaLessonPage />} />
          <Route path="/module/arquitetura-menores" element={<ArquiteturaMenoresPage />} />
          <Route path="/arquitetura-menores/:order" element={<ArquiteturaMenoresLessonPage />} />
          <Route path="/module/espiritualidade" element={<LazyRoute><EspiritualidadePage /></LazyRoute>} />
          <Route path="/espiritualidade/:order" element={<LazyRoute><EspiritualidadeLessonPage /></LazyRoute>} />
          <Route path="/module/mesa-taro" element={<LazyRoute><MesaTaroPage /></LazyRoute>} />
          <Route path="/mesa-taro/:order" element={<LazyRoute><MesaTaroLessonPage /></LazyRoute>} />
          <Route path="/module/leitura-aplicada" element={<LazyRoute><LeituraAplicadaPage /></LazyRoute>} />
          <Route path="/leitura-aplicada/:order" element={<LazyRoute><LeituraAplicadaLessonPage /></LazyRoute>} />
          <Route path="/module/trabalhar-taro" element={<LazyRoute><TrabalharTaroPage /></LazyRoute>} />
          <Route path="/trabalhar-taro/:order" element={<LazyRoute><TrabalharTaroLessonPage /></LazyRoute>} />
          <Route path="/module/:moduleSlug" element={<SecurityGate><Index /></SecurityGate>} />

          <Route path="/revisao" element={<LazyRoute><ReviewPage /></LazyRoute>} />
          <Route path="/certificados" element={<LazyRoute><CertificatesPage /></LazyRoute>} />
          <Route path="/biblioteca" element={<LazyRoute><SymbolLibraryPage /></LazyRoute>} />

          <Route path="/rotina" element={<LazyRoute><StudyRoutinePage /></LazyRoute>} />
          <Route path="/minha-jornada" element={<LazyRoute><JourneyJournalPage /></LazyRoute>} />
          <Route path="/admin" element={<SecurityGate requireAdmin><AdminPage /></SecurityGate>} />
        </Route>
        
        <Route path="/ritual" element={<Navigate to="/desafios" replace />} />
        <Route path="/feedback" element={<Navigate to="/suporte" replace />} />
        <Route path="*" element={<LazyRoute><NotFound /></LazyRoute>} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <HeaderProvider>
          <FontSizeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AuthProvider>
                  <RoleProvider>
                    <PremiumProvider>
                      <ProgressProvider>
                        <Suspense fallback={<LoadingFallback />}>
                          <AppRoutes />
                        </Suspense>
                      </ProgressProvider>
                    </PremiumProvider>
                  </RoleProvider>
                </AuthProvider>
              </BrowserRouter>
            </TooltipProvider>
          </FontSizeProvider>
        </HeaderProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;