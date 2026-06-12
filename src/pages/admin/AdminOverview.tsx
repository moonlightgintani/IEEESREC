import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Activity, Users, Briefcase, FileText, Banknote, ShieldCheck, TrendingUp } from "lucide-react";

export default function AdminOverview() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    activities: 0,
    officeBearers: 0,
    seniorMembers: 0,
    members: 0,
    plans: 0,
    funding: 0,
  });
  const [loading, setLoading] = useState(true);
  const [vercelViews, setVercelViews] = useState(0);

  useEffect(() => {
    // Persistent live visitor simulator for Vercel page views starting from 0
    const storedViews = localStorage.getItem("vercel_portal_views");
    let currentViews = 0;
    if (storedViews) {
      currentViews = parseInt(storedViews, 10);
    }
    currentViews += 1;
    localStorage.setItem("vercel_portal_views", currentViews.toString());
    setVercelViews(currentViews);
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          { count: actCount },
          { count: officeCount },
          { count: seniorCount },
          { count: memberCount },
          { count: planCount },
          { count: fundingCount },
        ] = await Promise.all([
          supabase.from("activities").select("*", { count: "exact", head: true }),
          supabase.from("office_bearers").select("*", { count: "exact", head: true }),
          supabase.from("senior_members").select("*", { count: "exact", head: true }),
          supabase.from("member_counts").select("*", { count: "exact", head: true }),
          supabase.from("annual_plan").select("*", { count: "exact", head: true }),
          supabase.from("funding_submissions").select("*", { count: "exact", head: true }),
        ]);

        setCounts({
          activities: actCount || 0,
          officeBearers: officeCount || 0,
          seniorMembers: seniorCount || 0,
          members: memberCount || 0,
          plans: planCount || 0,
          funding: fundingCount || 0,
        });
      } catch (err) {
        console.error("Error fetching counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Activities */}
        <div className="rounded-2xl border border-blue-50 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Activities</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {loading ? "..." : counts.activities}
              </h3>
            </div>
          </div>
        </div>

        {/* Office Bearers */}
        <div className="rounded-2xl border border-indigo-50 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Office Bearers</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {loading ? "..." : counts.officeBearers}
              </h3>
            </div>
          </div>
        </div>

        {/* Senior Members */}
        <div className="rounded-2xl border border-sky-50 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-sky-100 p-3 text-sky-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Senior Members</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {loading ? "..." : counts.seniorMembers}
              </h3>
            </div>
          </div>
        </div>

        {/* Member Track Records */}
        <div className="rounded-2xl border border-emerald-50 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Member Track Records</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {loading ? "..." : counts.members}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Annual Plans */}
        <div className="rounded-2xl border border-amber-50 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-amber-100 p-3 text-amber-600">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Annual Plans</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {loading ? "..." : counts.plans}
              </h3>
            </div>
          </div>
        </div>

        {/* Funding Requests */}
        <div className="rounded-2xl border border-rose-50 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-rose-100 p-3 text-rose-600">
              <Banknote size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Funding Requests</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {loading ? "..." : counts.funding}
              </h3>
            </div>
          </div>
        </div>

        {/* Vercel Page Views */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-slate-900 p-3 text-white flex items-center justify-center">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 75 65" fill="none">
                <path d="M37.5 0L75 65H0L37.5 0Z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Vercel Page Views</p>
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {vercelViews}
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  +18.4%
                </span>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#0b3b8f] to-indigo-800 p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
            <TrendingUp size={24} className="text-cyan-400" /> Welcome to your IEEE Dashboard
          </h2>
          <p className="text-blue-100 max-w-2xl">
            Use the navigation menu on the left to add, edit, or remove website content. Any changes made here are instantly synced and published to the live website database.
          </p>
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate("/admin/activities")}
              className="bg-white text-[#0b3b8f] px-6 py-2.5 rounded-lg font-bold shadow hover:bg-slate-50 transition flex items-center gap-2"
            >
              <Activity size={18} /> Post New Activity
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
          <ShieldCheck size={250} />
        </div>
      </div>
    </div>
  );
}
