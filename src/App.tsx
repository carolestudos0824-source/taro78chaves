import { lazy, Suspense, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { FontSizeProvider } from "@/contexts/font-size-context";
import { HeaderProvider } from "@/contexts/header-context";
import { Header } from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SessionInitializer from "@/components/SessionInitializer";
import { initGA, trackPageView, useUTMTracker } from "@/lib/analytics";
import { useProgress } from "@/hooks/use-progress";

// Eager: critical path
import LandingPage from "./pages/LandingPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import ModulesPage from "./pages/ModulesPage.tsx";

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

const AcessoComprado = lazy(() => import("./pages/AcessoComprado.tsx"));
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
const ValidateCertificatePage = lazy(() => import("./pages/ValidateCertificatePage.tsx"));

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

const MinimalLoader = () => (
  <div className="flex-1 flex items-center justify-center py-20 bg-transparent">
    <div className="w-8 h-8 rounded-full border-2 border-gold/20 border-t-gold animate-spin mx-auto" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/" replace />;
  
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
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

const AppShell = () => {
  const { progress } = useProgress();
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <Header 
        streak={progress.streak} 
        xp={progress.xp} 
        level={progress.level} 
      />
      <main className="flex-1 pb-24">
        <Suspense fallback={<MinimalLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AnalyticsTracker />
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/venda" element={<LandingPage isSalesPage={true} />} />
        <Route path="/acesso-comprado" element={<AcessoComprado />} />
        <Route path="/auth" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/termos" element={<TermsPage />} />
        <Route path="/suporte" element={<SupportPage />} />
        <Route path="/excluir-conta" element={<DeleteAccountPage />} />
        <Route path="/apresentacao" element={<PresentationPage />} />
        <Route path="/validar-certificado" element={<ValidateCertificatePage />} />

        {/* Rotas Protegidas dentro do AppShell */}
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/app" element={<ModulesPage />} />
          <Route path="/trilhas" element={<TrailsPage />} />
          <Route path="/desafios" element={<DailyChallengesPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/jornada-do-louco" element={<FoolsJourneyPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/module/:moduleSlug" element={<Index />} />
          
          <Route path="/module/fundamentos" element={<FundamentosPage />} />
          <Route path="/fundamentos/:order" element={<FundamentosLessonPage />} />
          <Route path="/module/copas" element={<NaipePage />} />
          <Route path="/module/paus" element={<NaipePage />} />
          <Route path="/module/espadas" element={<NaipePage />} />
          <Route path="/module/ouros" element={<NaipePage />} />
          <Route path="/naipe/:naipe/intro" element={<NaipeIntroPage />} />
          <Route path="/module/cartas-corte" element={<CartasCortePage />} />
          <Route path="/cartas-corte" element={<Navigate to="/module/cartas-corte" replace />} />
          <Route path="/numerologia" element={<NumerologiaPage />} />
          <Route path="/arcano-menor/:id" element={<ArcanoMenorLessonPage />} />
          <Route path="/module/combinacoes" element={<CombinacoesPage />} />
          <Route path="/combinacoes/:order" element={<CombinacoesLessonPage />} />
          <Route path="/module/tiragens" element={<TiragensPage />} />
          <Route path="/tiragens/:order" element={<TiragensLessonPage />} />
          <Route path="/module/amor" element={<AmorPage />} />
          <Route path="/amor/:order" element={<AmorLessonPage />} />
          <Route path="/module/pratica" element={<PraticaPage />} />
          <Route path="/pratica/:order" element={<PraticaLessonPage />} />
          <Route path="/module/leitura-simbolica" element={<LeituraSimbolicaPage />} />
          <Route path="/leitura-simbolica/:order" element={<LeituraSimbolicaLessonPage />} />
          <Route path="/module/arquitetura-menores" element={<ArquiteturaMenoresPage />} />
          <Route path="/arquitetura-menores/:order" element={<ArquiteturaMenoresLessonPage />} />
          <Route path="/module/espiritualidade" element={<EspiritualidadePage />} />
          <Route path="/espiritualidade/:order" element={<EspiritualidadeLessonPage />} />
          <Route path="/module/mesa-taro" element={<MesaTaroPage />} />
          <Route path="/mesa-taro/:order" element={<MesaTaroLessonPage />} />
          <Route path="/module/leitura-aplicada" element={<LeituraAplicadaPage />} />
          <Route path="/leitura-aplicada/:order" element={<LeituraAplicadaLessonPage />} />
          <Route path="/module/trabalhar-taro" element={<TrabalharTaroPage />} />
          <Route path="/trabalhar-taro/:order" element={<TrabalharTaroLessonPage />} />
          
          <Route path="/revisao" element={<ReviewPage />} />
          <Route path="/certificados" element={<CertificatesPage />} />
          <Route path="/biblioteca" element={<SymbolLibraryPage />} />
          <Route path="/rotina" element={<StudyRoutinePage />} />
          <Route path="/minha-jornada" element={<JourneyJournalPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
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
                  <AppRoutes />
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
