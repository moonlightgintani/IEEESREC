import { useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
      <Navbar />

      <div className="flex flex-1 w-full mx-auto justify-center max-w-[1600px]">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-[260px] xl:w-[280px] bg-white border-r border-slate-200 sticky top-0 h-screen overflow-y-auto shrink-0 shadow-sm z-30">
          <div className="px-6 py-8">
            <h1 className="text-xl xl:text-2xl font-black tracking-wider text-slate-900 border-b border-slate-100 pb-3 mb-2">
              ADMIN PORTAL
            </h1>
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0b3b8f]">
              <Settings size={14} /> System Control
            </p>
          </div>
          <nav className="flex-1 px-4 space-y-1.5 pb-6">
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
          <div className="p-4 border-t border-slate-100 sticky bottom-0 bg-white">
            <Link
              to="/"
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-red-50 text-red-600 border border-red-100 px-5 py-3 font-semibold hover:bg-red-100 transition-colors"
            >
              <LogOut size={16} /> Exit Admin
            </Link>
          </div>
        </aside>

        {/* MAIN PANEL */}
        <div className="flex-1 w-full min-w-0 flex flex-col relative">
          {/* MOBILE NAV HORIZONTAL */}
          <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-40 px-3 py-3 shadow-sm">
            <nav className="flex overflow-x-auto gap-2 scrollbar-hide snap-x">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    navigate(tab.id === "overview" ? "/admin" : `/admin/${tab.id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`flex whitespace-nowrap items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition snap-start border ${
                    activeTab === tab.id
                      ? "bg-[#0b3b8f] text-white border-[#0b3b8f] shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <main className="flex-1 p-4 sm:p-6 lg:p-10 w-full max-w-[1200px] mx-auto pb-20">
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;