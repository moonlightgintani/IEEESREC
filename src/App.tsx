import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { Capacitor } from "@capacitor/core";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import Index from "./pages/Index";
import OfficeBearersPage from "./pages/OfficeBearersPage";
import AboutPage from "./pages/AboutPage";
import SocietiesPage from "./pages/SocietiesPage";
import SocietyDetailPage from "./pages/SocietyDetailPage";
import SrecBranchPage from "./pages/SrecBranchPage";
import WiePage from "./pages/WiePage";
import EmbsPage from "./pages/EmbsPage";
import CsPage from "./pages/CsPage";
import ComsocPage from "./pages/ComsocPage";
import PelsPage from "./pages/PelsPage";
import ImPage from "./pages/ImPage";
import CisPage from "./pages/CisPage";
import JoinPage from "./pages/JoinPage";
import ContactPage from "./pages/ContactPage";
import MembersPage from "./pages/MembersPage";
import AdminDashboardRoute from "./pages/AdminDashboard.tsx";
import AdminLoginPage from "./pages/AdminLoginPage.tsx";
import AwardsPage from "./pages/AwardsPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import ActivitiesPage from "./pages/ActivitiesPage.tsx";
import AnnualPlansPage from "./pages/AnnualPlansPage.tsx";
import Gallery from "./pages/Gallery.tsx";
import FundingsPlanPage from "./pages/FundingsPlanPage.tsx";
import SeniorMembersPage from "./pages/SeniorMembersPage.tsx";
import TeamPage from "./pages/Team.tsx";
import ReportsPage from "./pages/ReportsPage.tsx";



const queryClient = new QueryClient();

// Use HashRouter for native app platforms to prevent WebView routing failures,
// and BrowserRouter for web platforms (like Vercel) to maintain clean URLs.
// Declared outside to prevent React from recreating the component definition on every render loop.
const RouterComponent = Capacitor.isNativePlatform() ? HashRouter : BrowserRouter;

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!Capacitor.isNativePlatform() && <SpeedInsights />}
        {!Capacitor.isNativePlatform() && <Analytics />}
        {!Capacitor.isNativePlatform() && <PWAInstallPrompt />}
        <RouterComponent>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/Team" element={<TeamPage />} />
            <Route path="/office-bearers" element={<OfficeBearersPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/senior-members" element={<SeniorMembersPage />} />
            <Route path="/awards" element={<AwardsPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/annual-plans" element={<AnnualPlansPage />} />
            <Route path="/funding" element={<FundingsPlanPage />} />
            <Route path="/societies" element={<SocietiesPage />} />
            <Route path="/societies/srec" element={<SrecBranchPage />} />
            <Route path="/societies/wie" element={<WiePage />} />
            <Route path="/societies/embs" element={<EmbsPage />} />
            <Route path="/societies/cs" element={<CsPage />} />
            <Route path="/societies/comsoc" element={<ComsocPage />} />
            <Route path="/societies/pels" element={<PelsPage />} />
            <Route path="/societies/im" element={<ImPage />} />
            <Route path="/societies/cis" element={<CisPage />} />
            <Route path="/join" element={<JoinPage />} />
            <Route path="/societies/:id" element={<SocietyDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin/*" element={<AdminDashboardRoute />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RouterComponent>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;