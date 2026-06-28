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
import FundingsPlanPage from "./pages/FundingsPlanPage.tsx";
import SeniorMembersPage from "./pages/SeniorMembersPage.tsx";
import TeamPage from "./pages/Team.tsx";
import ReportsPage from "./pages/ReportsPage.tsx";



import PageTransition from "./components/PageTransition.tsx";

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
            <Route path="/" element={<PageTransition><Index /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/activities" element={<PageTransition><ActivitiesPage /></PageTransition>} />
            <Route path="/Team" element={<PageTransition><TeamPage /></PageTransition>} />
            <Route path="/office-bearers" element={<PageTransition><OfficeBearersPage /></PageTransition>} />
            <Route path="/members" element={<PageTransition><MembersPage /></PageTransition>} />
            <Route path="/senior-members" element={<PageTransition><SeniorMembersPage /></PageTransition>} />
            <Route path="/awards" element={<PageTransition><AwardsPage /></PageTransition>} />
            <Route path="/reports" element={<PageTransition><ReportsPage /></PageTransition>} />
            <Route path="/annual-plans" element={<PageTransition><AnnualPlansPage /></PageTransition>} />
            <Route path="/funding" element={<PageTransition><FundingsPlanPage /></PageTransition>} />
            <Route path="/societies" element={<PageTransition><SocietiesPage /></PageTransition>} />
            <Route path="/societies/srec" element={<PageTransition><SrecBranchPage /></PageTransition>} />
            <Route path="/societies/wie" element={<PageTransition><WiePage /></PageTransition>} />
            <Route path="/societies/embs" element={<PageTransition><EmbsPage /></PageTransition>} />
            <Route path="/societies/cs" element={<PageTransition><CsPage /></PageTransition>} />
            <Route path="/societies/comsoc" element={<PageTransition><ComsocPage /></PageTransition>} />
            <Route path="/societies/pels" element={<PageTransition><PelsPage /></PageTransition>} />
            <Route path="/societies/im" element={<PageTransition><ImPage /></PageTransition>} />
            <Route path="/societies/cis" element={<PageTransition><CisPage /></PageTransition>} />
            <Route path="/join" element={<PageTransition><JoinPage /></PageTransition>} />
            <Route path="/societies/:id" element={<PageTransition><SocietyDetailPage /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
            <Route path="/admin-login" element={<PageTransition><AdminLoginPage /></PageTransition>} />
            <Route path="/admin/*" element={<PageTransition><AdminDashboardRoute /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </RouterComponent>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;