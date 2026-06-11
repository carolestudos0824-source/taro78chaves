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

// Alias route for /jornada
const JornadaAlias = () => <Navigate to="/jornada-do-louco" replace />;

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
      <p className="text-[#C8A66A] font-heading font-black tracking-widest uppercase text-[10px]">Portal de Sabedoria</p>
    </div>
  </div>
);

const AppRoutes = () => {
  const location = useLocation();
  const { isAuditor } = useRole();
  const { user } = useAuth();
  const { isPremium } = usePremium();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  useUTMTracker();

  return (
    <div className=\"flex flex-col min-h-screen\">
      <Header />
      <main className=\"flex-grow\">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path=\"/\" element={<LandingPage />} />
            <Route path=\"/auth\" element={<AuthPage />} />
            <Route path=\"/beta-invite\" element={<BetaInvitePage />} />
            
            {/* Protected Routes Wrapper */}
            <Route element={<SecurityGate />}>
              <Route path=\"/app\" element={<DashboardPage />} />
              <Route path=\"/profile\" element={<ProfilePage />} />
              <Route path=\"/premium\" element={<PremiumPage />} />
              <Route path=\"/acesso-comprado\" element={<AcessoComprado />} />
              
              <Route path=\"/fundamentos\" element={<FundamentosPage />} />
              <Route path=\"/fundamentos/:lessonId\" element={<FundamentosLessonPage />} />
              
              <Route path=\"/jornada-do-louco\" element={<FoolsJourneyPage />} />
              <Route path=\"/jornada\" element={<JornadaAlias />} />
              <Route path=\"/trails\" element={<TrailsPage />} />
              
              <Route path=\"/lesson/:id\" element={<LessonPage />} />
              
              <Route path=\"/journal\" element={<JourneyJournalPage />} />
              <Route path=\"/daily-challenges\" element={<DailyChallengesPage />} />
              
              {/* Module & Lesson Specific Routes */}
              <Route path=\"/arcanos-menores\" element={<ArcanosMenoresModulePage />} />
              <Route path=\"/naipe/:naipeId\" element={<NaipePage />} />
              <Route path=\"/naipe/:naipeId/intro\" element={<NaipeIntroPage />} />
              <Route path=\"/arcanos-menores/:naipe/:rank\" element={<ArcanoMenorLessonPage />} />
              
              <Route path=\"/amor\" element={<AmorPage />} />
              <Route path=\"/amor/lesson\" element={<AmorLessonPage />} />
              
              <Route path=\"/leitura-simbolica\" element={<LeituraSimbolicaPage />} />
              <Route path=\"/leitura-simbolica/lesson\" element={<LeituraSimbolicaLessonPage />} />
              
              <Route path=\"/arquitetura-menores\" element={<ArquiteturaMenoresPage />} />
              <Route path=\"/arquitetura-menores/lesson\" element={<ArquiteturaMenoresLessonPage />} />
              
              <Route path=\"/pratica\" element={<PraticaPage />} />
              <Route path=\"/pratica/lesson\" element={<PraticaLessonPage />} />

              <Route path=\"/combinacoes\" element={<CombinacoesPage />} />
              <Route path=\"/combinacoes/:id\" element={<CombinacoesLessonPage />} />

              <Route path=\"/tiragens\" element={<TiragensPage />} />
              <Route path=\"/tiragens/:id\" element={<TiragensLessonPage />} />

              <Route path=\"/espiritualidade\" element={<EspiritualidadePage />} />
              <Route path=\"/espiritualidade/:id\" element={<EspiritualidadeLessonPage />} />

              <Route path=\"/mesa-taro\" element={<MesaTaroPage />} />
              <Route path=\"/mesa-taro/:id\" element={<MesaTaroLessonPage />} />

              <Route path=\"/leitura-aplicada\" element={<LeituraAplicadaPage />} />
              <Route path=\"/leitura-aplicada/:id\" element={<LeituraAplicadaLessonPage />} />

              <Route path=\"/trabalhar-taro\" element={<TrabalharTaroPage />} />
              <Route path=\"/trabalhar-taro/:id\" element={<TrabalharTaroLessonPage />} />
              
              <Route path=\"/review/:id\" element={<ReviewPage />} />
              <Route path=\"/certificates\" element={<CertificatesPage />} />
              <Route path=\"/library\" element={<SymbolLibraryPage />} />
              <Route path=\"/study-routine\" element={<StudyRoutinePage />} />
              <Route path=\"/cartas-corte\" element={<CartasCortePage />} />
              <Route path=\"/numerologia\" element={<NumerologiaPage />} />
              <Route path=\"/presentation\" element={<PresentationPage />} />
            </Route>

            {/* Admin/Legal routes */}
            <Route path=\"/admin\" element={<AdminPage />} />
            <Route path=\"/reset-password\" element={<ResetPasswordPage />} />
            <Route path=\"/privacy\" element={<PrivacyPage />} />
            <Route path=\"/terms\" element={<TermsPage />} />
            <Route path=\"/support\" element={<SupportPage />} />
            <Route path=\"/delete-account\" element={<DeleteAccountPage />} />
            <Route path=\"/validate-certificate\" element={<ValidateCertificatePage />} />
            <Route path=\"/certificate-model\" element={<CertificateVisualModel />} />
            
            <Route path=\"*\" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <BottomNav />
      <SessionInitializer />
      <ConsentBanner />
    </div>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RoleProvider>
          <PremiumProvider>
            <ProgressProvider>
              <FontSizeProvider>
                <HeaderProvider>
                  <TooltipProvider>
                    <BrowserRouter>
                      <AppRoutes />
                      <Toaster />
                      <Sonner position=\"top-center\" expand={true} richColors />
                    </BrowserRouter>
                  </TooltipProvider>
                </HeaderProvider>
              </FontSizeProvider>
            </ProgressProvider>
          </PremiumProvider>
        </RoleProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;