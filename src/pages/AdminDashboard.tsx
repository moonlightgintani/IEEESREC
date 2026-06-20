import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Users,
  Settings,
  Briefcase,
  FileText,
  Banknote,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Globe,
} from "lucide-react";

import AdminOverview from "./admin/AdminOverview";
import AdminActivities from "./admin/AdminActivities";
import AdminOfficeBearers from "./admin/AdminOfficeBearers";
import AdminMembers from "./admin/AdminMembers";
import AdminPlans from "./admin/AdminPlans";
import AdminFunding from "./admin/AdminFunding";
import AdminSeniorMembers from "./admin/AdminSeniorMembers";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const localAdmin = sessionStorage.getItem("admin_auth");
      if (!session && localAdmin !== "true") {
        navigate("/admin-login");
      }
    };
    checkAuth();
  }, [navigate]);

  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path.endsWith("/activities")) return "activities";
    if (path.endsWith("/office")) return "office";
    if (path.endsWith("/members")) return "members";
    if (path.endsWith("/plans")) return "plans";
    if (path.endsWith("/funding")) return "funding";
    if (path.endsWith("/senior")) return "senior";
    return "overview";
  }, [location.pathname]);

  const tabs = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { id: "activities", label: "Activities", icon: <Activity size={18} /> },
    { id: "office", label: "Office Bearers", icon: <Briefcase size={18} /> },
    { id: "members", label: "Members", icon: <Users size={18} /> },
    { id: "plans", label: "Annual Plans", icon: <FileText size={18} /> },
    { id: "funding", label: "Funding", icon: <Banknote size={18} /> },
    { id: "senior", label: "Senior Members", icon: <ShieldCheck size={18} /> },
  ] as const;

  const handleSignOut = async (redirectTo = "/admin-login") => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Sign out error:", e);
    }
    sessionStorage.removeItem("admin_auth");
    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Sticky Top Header (Resides to the right of the sidebar on desktop) */}
      <header className="fixed top-0 left-0 lg:left-[260px] xl:left-[280px] right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu (Mobile/Tablet) */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 active:scale-95 transition-all"
            title="Open Menu"
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
          
          {/* Show simplified portal branding only on mobile/tablet header */}
          <div className="lg:hidden flex items-center gap-2">
            <span className="font-serif text-[#0b3b8f] font-black text-lg sm:text-xl tracking-tight">
              IEEE <span className="text-slate-800 font-sans font-medium">SREC</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#0b3b8f]/10 text-[#0b3b8f] text-[9px] font-bold uppercase">
              Admin
            </span>
          </div>

          {/* On desktop, display the current section name */}
          <h2 className="hidden lg:block text-lg font-bold text-slate-800 capitalize">
            {activeTab === "overview" ? "System Overview" : `${activeTab} Management`}
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0b3b8f] bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 transition-all"
          >
            <Globe size={14} />
            <span className="hidden md:inline">View Public Site</span>
          </Link>
          
          <button
            onClick={() => handleSignOut("/admin-login")}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-3 py-2 rounded-xl border border-red-100 hover:border-red-600 transition-all"
            title="Sign Out"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Drawer Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-white shadow-2xl z-50 lg:hidden flex flex-col border-r border-slate-200"
            >
              <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
                <div>
                  <h1 className="text-lg font-black tracking-wider text-slate-900">
                    ADMIN PORTAL
                  </h1>
                  <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#0b3b8f]">
                    <Settings size={12} /> System Control
                  </p>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                  title="Close Menu"
                  aria-label="Close Menu"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      navigate(tab.id === "overview" ? "/admin" : `/admin/${tab.id}`);
                      setIsMobileSidebarOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-[#0b3b8f] text-white shadow-md shadow-[#0b3b8f]/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-[#0b3b8f]"
                    }`}
                  >
                    {tab.icon} <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
              
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 min-h-screen">
        {/* DESKTOP SIDEBAR (lg and above) - FULL HEIGHT starting from top-0 */}
        <aside className="hidden lg:flex flex-col w-[260px] xl:w-[280px] bg-white border-r border-slate-200 fixed top-0 left-0 bottom-0 overflow-y-auto shrink-0 shadow-sm z-35">
          <div className="px-6 py-6 border-b border-slate-100">
            <Link to="/admin" className="flex flex-col gap-1">
              <span className="font-serif text-[#0b3b8f] font-black text-2xl tracking-tight">
                IEEE <span className="text-slate-800 font-sans font-medium">SREC</span>
              </span>
              <span className="w-fit px-2 py-0.5 rounded-md bg-[#0b3b8f]/10 text-[#0b3b8f] text-[9px] font-bold uppercase tracking-wider">
                System Administration
              </span>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  navigate(tab.id === "overview" ? "/admin" : `/admin/${tab.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-[#0b3b8f] text-white shadow-md shadow-[#0b3b8f]/20 scale-[1.02]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-[#0b3b8f]"
                }`}
              >
                {tab.icon} <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Sidebar space placeholder for desktop */}
        <div className="hidden lg:block lg:w-[260px] xl:w-[280px] shrink-0" />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col bg-slate-50 pt-16">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[1200px] mx-auto pb-20">
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/activities" element={<AdminActivities />} />
              <Route path="/office" element={<AdminOfficeBearers />} />
              <Route path="/members" element={<AdminMembers />} />
              <Route path="/plans" element={<AdminPlans />} />
              <Route path="/funding" element={<AdminFunding />} />
              <Route path="/senior" element={<AdminSeniorMembers />} />
            </Routes>
          </main>

          {/* Simple compact copyright footer */}
          <footer className="py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-400 shrink-0">
            &copy; {new Date().getFullYear()} IEEE SREC Student Branch. All Rights Reserved.
          </footer>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;