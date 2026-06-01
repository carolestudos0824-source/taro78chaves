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
import { trackPageView, useUTMTracker } from "@/lib/analytics";
import { useProgress } from "@/hooks/use-progress";

// Eager: critical path (Zero Flicker)
import LandingPage from "./pages/LandingPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx"; // Will be created
import Index from "./pages/Index.tsx";
import LessonPage from "./pages/LessonPage.tsx";
import PremiumPage from "./pages/PremiumPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import FoolsJourneyPage from "./pages/FoolsJourneyPage.tsx";
import TrailsPage from "./pages/TrailsPage.tsx";
import DailyChallengesPage from "./pages/DailyChallengesPage.tsx";

// Lazy: non-critical or secondary paths
const AdminPage = lazy(() => import("./pages/AdminPage.tsx"));
const FundamentosPage = lazy(() => import("./pages/FundamentosPage.tsx"));
const FundamentosLessonPage = lazy(() => import("./pages/FundamentosLessonPage.tsx"));
const BetaInvitePage = lazy(() => import("./pages/BetaInvitePage.tsx"));
const AcessoComprado = lazy(() => import("./pages/AcessoComprado.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const JourneyJournalPage = lazy(() => import("./pages/JourneyJournalPage.tsx"));

// Module pages (Secondary)
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
        <p className="text-[11px] text-[#5B1F3D]/60 font-body italic">Iniciando sua travessia...</p>
      </div>
    </div>
  </div>
);

const ShellFallback = () => (
  <div className="w-full flex-1 flex flex-col items-center justify-center bg-transparent min-h-[40vh]">
    {/* Neutral fallback to prevent visual jumps in the main shell */}
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
  if (loading) return <LoadingFallback />;
  if (user) return <Navigate to="/app" replace />;
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

const AppShell = () => {
  const { progress } = useProgress();
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF5EF]">
      <Header 
        streak={progress.streak} 
        xp={progress.xp} 
        level={progress.level} 
      />
      <main className="flex-1 pb-24 relative">
        <Suspense fallback={<ShellFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <>
      <AnalyticsTracker />
      <ConsentBanner />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/venda" element={<LandingPage isSalesPage={true} />} />
        <Route path="/acesso-comprado" element={<Suspense fallback={<LoadingFallback />}><AcessoComprado /></Suspense>} />
        <Route path="/auth" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
        <Route path="/reset-password" element={<Suspense fallback={<LoadingFallback />}><ResetPasswordPage /></Suspense>} />
        <Route path="/privacidade" element={<Suspense fallback={<LoadingFallback />}><PrivacyPage /></Suspense>} />
        <Route path="/termos" element={<Suspense fallback={<LoadingFallback />}><TermsPage /></Suspense>} />
        <Route path="/suporte" element={<SupportPage />} />
        <Route path="/feedback" element={<Navigate to="/suporte" replace />} />
        <Route path="/excluir-conta" element={<Suspense fallback={<LoadingFallback />}><DeleteAccountPage /></Suspense>} />
        <Route path="/apresentacao" element={<Suspense fallback={<LoadingFallback />}><PresentationPage /></Suspense>} />
        <Route path="/validar-certificado" element={<Suspense fallback={<LoadingFallback />}><ValidateCertificatePage /></Suspense>} />
        <Route path="/visual-certificado" element={<Suspense fallback={<LoadingFallback />}><CertificateVisualModel /></Suspense>} />
        <Route path="/certificado-visual" element={<Navigate to="/visual-certificado" replace />} />

        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/app" element={<DashboardPage />} />
          <Route path="/trilhas" element={<TrailsPage />} />
          <Route path="/desafios" element={<DailyChallengesPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/jornada-do-louco" element={<FoolsJourneyPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/module/:moduleSlug" element={<Index />} />
          
          <Route path="/module/fundamentos" element={<Suspense fallback={<ShellFallback />}><FundamentosPage /></Suspense>} />
          <Route path="/fundamentos/:order" element={<Suspense fallback={<ShellFallback />}><FundamentosLessonPage /></Suspense>} />
          <Route path="/module/copas" element={<Suspense fallback={<ShellFallback />}><NaipePage /></Suspense>} />
          <Route path="/module/paus" element={<Suspense fallback={<ShellFallback />}><NaipePage /></Suspense>} />
          <Route path="/module/espadas" element={<Suspense fallback={<ShellFallback />}><NaipePage /></Suspense>} />
          <Route path="/module/ouros" element={<Suspense fallback={<ShellFallback />}><NaipePage /></Suspense>} />
          <Route path="/naipe/:naipe/intro" element={<Suspense fallback={<ShellFallback />}><NaipeIntroPage /></Suspense>} />
          <Route path="/module/cartas-corte" element={<Suspense fallback={<ShellFallback />}><CartasCortePage /></Suspense>} />
          <Route path="/cartas-corte" element={<Navigate to="/module/cartas-corte" replace />} />
          <Route path="/numerologia" element={<Suspense fallback={<ShellFallback />}><NumerologiaPage /></Suspense>} />
          <Route path="/arcano-menor/:id" element={<Suspense fallback={<ShellFallback />}><ArcanoMenorLessonPage /></Suspense>} />
          <Route path="/module/combinacoes" element={<Suspense fallback={<ShellFallback />}><CombinacoesPage /></Suspense>} />
          <Route path="/combinacoes/:order" element={<Suspense fallback={<ShellFallback />}><CombinacoesLessonPage /></Suspense>} />
          <Route path="/module/tiragens" element={<Suspense fallback={<ShellFallback />}><TiragensPage /></Suspense>} />
          <Route path="/tiragens/:order" element={<Suspense fallback={<ShellFallback />}><TiragensLessonPage /></Suspense>} />
          <Route path="/module/amor" element={<Suspense fallback={<ShellFallback />}><AmorPage /></Suspense>} />
          <Route path="/amor/:order" element={<Suspense fallback={<ShellFallback />}><AmorLessonPage /></Suspense>} />
          <Route path="/module/pratica" element={<Suspense fallback={<ShellFallback />}><PraticaPage /></Suspense>} />
          <Route path="/pratica/:order" element={<Suspense fallback={<ShellFallback />}><PraticaLessonPage /></Suspense>} />
          <Route path="/module/leitura-simbolica" element={<Suspense fallback={<ShellFallback />}><LeituraSimbolicaPage /></Suspense>} />
          <Route path="/leitura-simbolica/:order" element={<Suspense fallback={<ShellFallback />}><LeituraSimbolicaLessonPage /></Suspense>} />
          <Route path="/module/arquitetura-menores" element={<Suspense fallback={<ShellFallback />}><ArquiteturaMenoresPage /></Suspense>} />
          <Route path="/arquitetura-menores/:order" element={<Suspense fallback={<ShellFallback />}><ArquiteturaMenoresLessonPage /></Suspense>} />
          <Route path="/module/espiritualidade" element={<Suspense fallback={<ShellFallback />}><EspiritualidadePage /></Suspense>} />
          <Route path="/espiritualidade/:order" element={<Suspense fallback={<ShellFallback />}><EspiritualidadeLessonPage /></Suspense>} />
          <Route path="/module/mesa-taro" element={<Suspense fallback={<ShellFallback />}><MesaTaroPage /></Suspense>} />
          <Route path="/mesa-taro/:order" element={<Suspense fallback={<ShellFallback />}><MesaTaroLessonPage /></Suspense>} />
          <Route path="/module/leitura-aplicada" element={<Suspense fallback={<ShellFallback />}><LeituraAplicadaPage /></Suspense>} />
          <Route path="/leitura-aplicada/:order" element={<Suspense fallback={<ShellFallback />}><LeituraAplicadaLessonPage /></Suspense>} />
          <Route path="/module/trabalhar-taro" element={<Suspense fallback={<ShellFallback />}><TrabalharTaroPage /></Suspense>} />
          <Route path="/trabalhar-taro/:order" element={<Suspense fallback={<ShellFallback />}><TrabalharTaroLessonPage /></Suspense>} />
          
          <Route path="/revisao" element={<Suspense fallback={<ShellFallback />}><ReviewPage /></Suspense>} />
          <Route path="/certificados" element={<Suspense fallback={<ShellFallback />}><CertificatesPage /></Suspense>} />
          <Route path="/biblioteca" element={<Suspense fallback={<ShellFallback />}><SymbolLibraryPage /></Suspense>} />
          <Route path="/rotina" element={<Suspense fallback={<ShellFallback />}><StudyRoutinePage /></Suspense>} />
          <Route path="/minha-jornada" element={<Suspense fallback={<ShellFallback />}><JourneyJournalPage /></Suspense>} />
          <Route path="/admin" element={<Suspense fallback={<ShellFallback />}><AdminPage /></Suspense>} />
        </Route>
        
        <Route path="*" element={<Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>} />
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
                        <AppRoutes />
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