import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Mail, ExternalLink, GraduationCap, Award, Search, LayoutGrid, Users, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

type SeniorMember = {
  id: number;
  name: string;
  s_no: number | null;
  current_role: string | null;
  college: string | null;
  linkedin_url: string | null;
  image_url: string | null;
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } as any
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 } as any
  },
};

const ExecutiveCard = ({ member }: { member: SeniorMember }) => {
  const roleParts = member.current_role ? member.current_role.split(" - ") : ["Executive Leadership"];
  const primaryRole = roleParts[0];
  const secondaryRole = roleParts.slice(1).join(" - ");

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="group relative bg-white border border-slate-200/80 rounded-3xl shadow-lg hover:shadow-2xl hover:border-blue-500/35 transition-all duration-500 overflow-hidden flex flex-col md:flex-row h-full items-stretch"
    >
      {/* Top/Side Accent Gradient */}
      <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-blue-600 via-indigo-600 to-cyan-500 hidden md:block" />
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 md:hidden" />

      {/* Avatar Container */}
      <div className="relative w-full md:w-52 aspect-square md:aspect-auto shrink-0 bg-slate-50 overflow-hidden border-b md:border-b-0 md:border-r border-slate-100 flex items-center justify-center p-6">
        <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-700">
          <img
            src={member.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=2563EB&color=fff&size=512`}
            alt={member.name}
            className="w-full h-full object-cover object-top"
          />
          {/* Subtle elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-80" />
        </div>
        {/* Decorative background glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-100/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>

      {/* Profile Details */}
      <div className="p-8 flex flex-col justify-between flex-grow relative bg-white">
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-indigo-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap gap-2 items-center mb-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-wider text-blue-700 shadow-sm">
              <Award size={12} className="text-blue-600 animate-pulse" />
              {primaryRole}
            </span>
            {secondaryRole && (
              <span className="text-slate-500 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                {secondaryRole}
              </span>
            )}
          </div>

          {member.linkedin_url ? (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-black text-slate-900 hover:text-blue-600 transition-colors inline-flex items-center gap-2 group/link mb-2"
            >
              {member.name}
              <ExternalLink size={16} className="opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-blue-400" />
            </a>
          ) : (
            <h3 className="text-2xl font-black text-slate-900 mb-2">{member.name}</h3>
          )}

          <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed max-w-xl mb-4 italic">
            "Providing academic mentorship, driving technological research, and steering the student branch toward exceptional milestones."
          </p>
        </div>

        <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs font-bold text-slate-600 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <MapPin size={12} />
            </div>
            <span className="truncate">{member.college || "Sri Ramakrishna Engineering College"}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Mail size={12} />
            </div>
            <a
              href={`mailto:${member.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in`}
              className="hover:text-blue-600 transition-colors truncate"
            >
              {member.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AdvisoryCard = ({ member, isFeatured }: { member: SeniorMember; isFeatured: boolean }) => {
  const roleParts = member.current_role ? member.current_role.split(" - ") : ["Senior Member"];
  const primaryRole = roleParts[0];
  const secondaryRole = roleParts.slice(1).join(" - ");

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -5 }}
      className={`group relative bg-white border border-slate-200/80 rounded-2xl shadow-md hover:shadow-xl hover:border-blue-500/35 transition-all duration-500 flex flex-col overflow-hidden h-full ${
        isFeatured ? "ring-1 ring-blue-500/10" : ""
      }`}
    >
      {/* Top Accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

      {/* Avatar Image container */}
      <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden shrink-0">
        <img
          src={member.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=2563EB&color=fff&size=512`}
          alt={member.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />
        {/* Soft elegant gradient shadow on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />
        
        {/* Floating role badge */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur shadow-sm text-[10px] font-black uppercase tracking-wider text-slate-800 border border-slate-200/60 w-full">
            {isFeatured ? (
              <Award size={12} className="text-blue-600 shrink-0" />
            ) : (
              <GraduationCap size={12} className="text-slate-600 shrink-0" />
            )}
            <span className="truncate">{primaryRole}</span>
          </div>
        </div>
      </div>

      {/* Content panel */}
      <div className="p-5 flex flex-col flex-grow relative bg-white">
        {/* Hover decorative background glow */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="mb-4 relative z-10">
          {member.linkedin_url ? (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-extrabold text-slate-900 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5 group/link"
            >
              {member.name}
              <ExternalLink size={13} className="opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-blue-400" />
            </a>
          ) : (
            <h3 className="text-base font-extrabold text-slate-900">{member.name}</h3>
          )}
          {secondaryRole && (
            <p className="text-slate-500 text-xs mt-1 font-semibold">{secondaryRole}</p>
          )}
        </div>

        <div className="mt-auto space-y-2 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500 relative z-10">
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-blue-600 shrink-0" />
            <span className="truncate">{member.college || "Sri Ramakrishna Engineering College"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={12} className="text-blue-600 shrink-0" />
            <a
              href={`mailto:${member.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in`}
              className="hover:text-blue-600 transition-colors truncate"
            >
              {member.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SeniorMembersPage = () => {
  const [seniorMembers, setSeniorMembers] = useState<SeniorMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"tiers" | "grid" | "directory">("tiers");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "leadership" | "advisory" | "others">("all");

  useEffect(() => {
    const fetchSeniors = async () => {
      const { data } = await supabase.from("senior_members").select("*").order("s_no", { ascending: true });
      if (data) setSeniorMembers(data);
      setLoading(false);
    };
    fetchSeniors();
  }, []);

  const filteredMembers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    
    // First, filter by search term
    let result = seniorMembers.filter(m => 
      !term || 
      m.name.toLowerCase().includes(term) || 
      (m.current_role || "").toLowerCase().includes(term) || 
      (m.college || "").toLowerCase().includes(term)
    );

    // Then, filter by selected category
    if (selectedCategory !== "all") {
      result = result.filter(m => {
        const role = (m.current_role || "").toLowerCase();
        if (selectedCategory === "leadership") {
          return role.includes("counsellor") || role.includes("counselor");
        } else if (selectedCategory === "advisory") {
          return role.includes("advisor") || role.includes("advisory");
        } else {
          return !role.includes("counsellor") && !role.includes("counselor") && !role.includes("advisor") && !role.includes("advisory");
        }
      });
    }

    return result;
  }, [seniorMembers, searchTerm, selectedCategory]);

  // Group members into Leadership (Counsellors, Advisors) and others
  const groupedMembers = useMemo(() => {
    const leadership: SeniorMember[] = [];
    const advisors: SeniorMember[] = [];
    const others: SeniorMember[] = [];

    filteredMembers.forEach(m => {
      const role = (m.current_role || "").toLowerCase();
      if (role.includes("counsellor") || role.includes("counselor")) {
        leadership.push(m);
      } else if (role.includes("advisor") || role.includes("advisory")) {
        advisors.push(m);
      } else {
        others.push(m);
      }
    });

    return { leadership, advisors, others };
  }, [filteredMembers]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden flex flex-col">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-indigo-400/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

      <Navbar />

      {/* CREATIVE HERO */}
      <section className="relative pt-24 pb-14 md:pt-28 md:pb-18 overflow-hidden bg-gradient-to-b from-blue-50 via-slate-50 to-white border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none" />
        
        {/* Soft floating accents */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 right-24 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 backdrop-blur text-xs font-semibold text-blue-700 shadow-[0_4px_12px_rgba(59,130,246,0.05)] mb-4"
          >
            <GraduationCap size={14} className="text-blue-600" />
            Advisory Board
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight mb-3 text-slate-900"
          >
            Senior<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 drop-shadow-[0_4px_15px_rgba(37,99,235,0.08)]"> Members</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed font-light"
          >
            The guiding force behind IEEE SREC. Our esteemed faculty members provide the vision, academic rigor, and mentorship that drive our student branch forward.
          </motion.p>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="relative -mt-8 mb-10 max-w-7xl mx-auto px-6 md:px-8 z-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: "Advisory Council", value: "Executive Mentorship", desc: "Steering global operations", icon: Award },
            { label: "Active Guidance", value: "Continuous Support", desc: "Bridging academia & industry", icon: Users },
            { label: "Faculty Mentors", value: "Research Focused", desc: "Fostering technical innovation", icon: GraduationCap }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Icon size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">{stat.label}</h4>
                  <p className="text-slate-800 text-sm font-black mt-0.5">{stat.value}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5 font-semibold">{stat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 md:px-8 pb-16 relative z-10 flex-grow w-full">
        
        {/* CONTROL BAR */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-slate-200/60 p-4 md:p-5 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search members by name, role, college..."
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-xs text-slate-800 placeholder-slate-400 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {[
              { id: "all", label: "All Members" },
              { id: "leadership", label: "Leadership" },
              { id: "advisory", label: "Advisors" },
              { id: "others", label: "Faculty Board" }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex bg-slate-100 border border-slate-200/60 p-1 rounded-xl shrink-0">
            {[
              { id: "tiers", icon: Users, label: "Tiers" },
              { id: "grid", icon: LayoutGrid, label: "Grid" },
              { id: "directory", icon: List, label: "Directory" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as "tiers" | "grid" | "directory")}
                className={`px-4 py-2 rounded-lg flex items-center gap-1.5 font-bold text-xs transition-all ${
                  viewMode === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md text-white border border-blue-500/20"
                    : "text-slate-650 hover:text-slate-950"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING & DATA DISPLAY */}
        {loading ? (
          <div className="py-24 flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-600 rounded-full animate-spin shadow-md" />
            <p className="mt-4 text-slate-500 text-sm font-medium tracking-wide">Loading Advisory Board...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed py-16 text-center px-4 shadow-md max-w-2xl mx-auto">
            <GraduationCap size={48} className="mx-auto text-slate-400 mb-3 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Senior Members Found</h3>
            <p className="text-slate-550 text-xs font-light">
              Try adjusting your search query or check the database.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: TIERS */}
            {viewMode === "tiers" && (
              <motion.div
                key="tiers"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={stagger}
                className="space-y-12"
              >
                {/* Leadership Tier */}
                {groupedMembers.leadership.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <Award className="text-blue-600 animate-pulse" size={18} />
                      <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Executive Leadership</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {groupedMembers.leadership.map(member => (
                        <ExecutiveCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Advisory Council Tier */}
                {groupedMembers.advisors.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <Award className="text-blue-600" size={18} />
                      <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Advisory Council</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedMembers.advisors.map(member => (
                        <AdvisoryCard key={member.id} member={member} isFeatured={true} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Faculty Advisors / Others Tier */}
                {groupedMembers.others.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <GraduationCap className="text-blue-600" size={18} />
                      <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Faculty Advisors & Senior Members</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {groupedMembers.others.map(member => (
                        <AdvisoryCard key={member.id} member={member} isFeatured={false} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW 2: GRID */}
            {viewMode === "grid" && (
              <motion.div
                key="grid"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={stagger}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredMembers.map(member => {
                  const role = (member.current_role || "").toLowerCase();
                  const isLeadOrAdvisor = role.includes("counsellor") || role.includes("counselor") || role.includes("advisor") || role.includes("advisory");
                  return (
                    <AdvisoryCard key={member.id} member={member} isFeatured={isLeadOrAdvisor} />
                  );
                })}
              </motion.div>
            )}

            {/* VIEW 3: DIRECTORY */}
            {viewMode === "directory" && (
              <motion.div
                key="directory"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border border-slate-200/80 rounded-2xl shadow-md overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/60">
                        <th className="px-6 py-4 text-left font-bold text-slate-500 text-xs uppercase tracking-wider">Member Details</th>
                        <th className="px-6 py-4 text-left font-bold text-slate-500 text-xs uppercase tracking-wider">Designation / Role</th>
                        <th className="px-6 py-4 text-left font-bold text-slate-500 text-xs uppercase tracking-wider">Institution</th>
                        <th className="px-6 py-4 text-center font-bold text-slate-500 text-xs uppercase tracking-wider font-sans">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map(member => (
                        <tr key={member.id} className="border-b border-slate-100 hover:bg-blue-50/15 transition-colors duration-155">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={member.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=2563EB&color=fff`}
                                alt={member.name}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                              />
                              <div>
                                <div className="font-extrabold text-slate-900 text-sm">{member.name}</div>
                                <span className="text-[10px] text-slate-400 font-semibold">{member.college ? "Faculty Board" : "IEEE Member"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              {member.current_role || "Senior Member"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-xs font-semibold">
                            {member.college || "Sri Ramakrishna Engineering College"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {member.linkedin_url && (
                                <a
                                  href={member.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm duration-200"
                                  title="LinkedIn Profile"
                                >
                                  <ExternalLink size={12} />
                                </a>
                              )}
                              <a
                                href={`mailto:${member.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in`}
                                className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm duration-200"
                                title="Send Email"
                              >
                                <Mail size={12} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SeniorMembersPage;