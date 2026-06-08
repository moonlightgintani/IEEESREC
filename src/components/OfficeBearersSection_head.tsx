import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Shield,
  Star,
  Loader2,
  Search,
  Users,
  X,
  LayoutGrid,
  Rows3,
  Mail,
  Building2,
  Crown,
  Sparkles,
  ChevronRight,
  History
} from "lucide-react";
import { motion } from "framer-motion";

type Person = {
  id: number | string;
  name?: string;
  role?: string;
  department?: string;
  year?: number;
  image_url?: string;
  photo?: string;
  photo_url?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin_url?: string;
  linkedin?: string;
  linkedin_profile?: string;
};

// Hierarchy definition for sorting roles
const ROLE_HIERARCHY = [
  "Chairperson",
  "Chair",
  "Vice Chairperson",
  "Vice Chair",
  "Secretary",
  "Joint Secretary",
  "Treasurer",
  "Joint Treasurer",
  "Webmaster",
  "Technical Head",
  "Technical Lead",
  "Design Head",
  "Design Lead",
  "Content Head",
  "PRO",
  "Public Relations",
];

const getRoleWeight = (role: string) => {
  const r = role.trim().toLowerCase();
  const index = ROLE_HIERARCHY.findIndex(h => r.includes(h.toLowerCase()));
  return index === -1 ? 999 : index;
};

const OfficeBearersSection = () => {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const CURRENT_YEAR = 2025; // The active core year

  const { data: officeBearers = [], isLoading: isLoadingOB } = useQuery<Person[]>({
    queryKey: ["office_bearers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_bearers")
        .select("*")
        .order("year", { ascending: false })
        .order("id", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const { data: executiveMembers = [], isLoading: isLoadingEM } = useQuery<Person[]>({
    queryKey: ["executive_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("executive_members")
        .select("*")
        .order("year", { ascending: false })
        .order("id", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const { data: advisors = [], isLoading: isLoadingAdv } = useQuery<Person[]>({
    queryKey: ["advisors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advisors")
        .select("*")
        .order("year", { ascending: false })
        .order("id", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const isLoading = isLoadingOB || isLoadingEM || isLoadingAdv;

  // Separation of Current vs Legacy
  const currentBearers = useMemo(() => officeBearers.filter(b => b.year === CURRENT_YEAR || !b.year), [officeBearers]);
  const legacyBearers = useMemo(() => officeBearers.filter(b => b.year && b.year !== CURRENT_YEAR), [officeBearers]);
  
  const currentExecutives = useMemo(() => executiveMembers.filter(m => m.year === CURRENT_YEAR || !m.year), [executiveMembers]);
  const currentAdvisors = useMemo(() => advisors.filter(a => a.year === CURRENT_YEAR || !a.year), [advisors]);

  const legacyYears = useMemo(() => {
    return Array.from(new Set(legacyBearers.map(b => b.year as number))).sort((a,b) => b - a);
  }, [legacyBearers]);

  const availableRoles = useMemo(() => {
    const roles = Array.from(
      new Set(
        currentBearers
          .map((b) => b.role?.trim())
          .filter((role): role is string => Boolean(role))
      )
    ).sort((a, b) => a.localeCompare(b));

    return ["All", ...roles];
  }, [currentBearers]);

  const filteredBearers = useMemo(() => {
    return currentBearers.filter((b) => {
      const matchesRole = selectedRole === "All" || b.role === selectedRole;
      const term = search.toLowerCase();

      const matchesSearch =
        !term ||
        (b.name || "").toLowerCase().includes(term) ||
        (b.role || "").toLowerCase().includes(term) ||
        (b.department || "").toLowerCase().includes(term);

      return matchesRole && matchesSearch;
    });
  }, [currentBearers, selectedRole, search]);

  const groupedBearers = useMemo(() => {
    const groups: Record<string, Person[]> = {};
    filteredBearers.forEach(b => {
        const role = (b.role || "Member").trim();
        if (!groups[role]) groups[role] = [];
        groups[role].push(b);
    });

    return Object.keys(groups)
        .sort((a, b) => getRoleWeight(a) - getRoleWeight(b))
        .map(role => ({
            role,
            members: groups[role]
        }));
  }, [filteredBearers]);

  const { counsellorGroup, otherGroups } = useMemo(() => {
    const cGroup = groupedBearers.find(g => g.role.toLowerCase().includes("counsellor") || g.role.toLowerCase().includes("counselor"));
    const oGroups = groupedBearers.filter(g => g !== cGroup);
    return { counsellorGroup: cGroup, otherGroups: oGroups };
  }, [groupedBearers]);

  const clearFilters = () => {
    setSelectedRole("All");
    setSearch("");
  };

  const formatRoleDisplay = (roleText?: string) => {
    if (!roleText) return "Office Bearer";
    if (roleText.toLowerCase().includes("executive member joint")) {
      return (
        <>
          <span className="block">Executive Member</span>
          <span className="block mt-0.5 opacity-90">Joint Activities Co-ordinator</span>
        </>
      );
    }
    return roleText;
  };

  const getAvatarFallback = (id: string | number) => {
    return `https://randomuser.me/api/portraits/${Number(id) % 2 === 0 ? "women" : "men"}/${(Number(id) % 99) + 1}.jpg`;
  };

  const PersonAvatar = ({ person }: { person: Person }) => {
    const imageUrl = person.photo || person.photo_url || person.image_url || getAvatarFallback(person.id);
    return (
      <img
        src={imageUrl}
        alt={person.name || "Member"}
        className="w-16 h-16 rounded-[1.25rem] object-cover border border-slate-200 shadow-sm"
      />
    );
  };

  const StatCard = ({ icon, title, value, subtitle }: any) => (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{title}</p>
          <h3 className="mt-2 text-4xl font-black text-slate-900">{value}</h3>
          <p className="mt-2 text-xs text-slate-500 font-medium">{subtitle}</p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-4 text-[#00629b]">
          {icon}
        </div>
      </div>
    </div>
  );

  const OfficeCard = ({ person }: { person: Person }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-300"
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
            <PersonAvatar person={person} />
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#00629b] group-hover:text-white text-slate-400 transition-colors">
                <ChevronRight size={16} />
            </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#00629b] mb-1 leading-relaxed">
            {formatRoleDisplay(person.role)}
          </p>
          <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-[#00629b] transition-colors">
            <a 
              href={person.website || person.linkedin_url || person.linkedin || person.linkedin_profile || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(person.name || "")}+IEEE+SREC`}
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline decoration-2 underline-offset-2"
            >
              {person.name || "Unnamed Member"}
            </a>
          </h3>

          {person.department && (
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span className="line-clamp-1">{person.department}</span>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            {person.email ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="line-clamp-1">{person.email}</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="line-clamp-1 truncate">{person.name?.toLowerCase().replace(/[^a-z0-9]/g, '')}@srec.ac.in</span>
                </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const OfficeListItem = ({ person }: { person: Person }) => (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:justify-between">
        <div className="flex items-center gap-5 min-w-0">
          <PersonAvatar person={person} />
          <div className="min-w-0">
            <h3 className="text-xl font-black text-slate-900 group-hover:text-[#00629b] transition-colors">
              <a 
                href={person.website || person.linkedin_url || person.linkedin || person.linkedin_profile || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(person.name || "")}+IEEE+SREC`}
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline decoration-2 underline-offset-2"
              >
                {person.name || "Unnamed Member"}
              </a>
            </h3>
            <p className="text-sm font-bold text-[#00629b] tracking-wide uppercase mt-0.5 leading-tight">{formatRoleDisplay(person.role)}</p>
            {person.department && (
              <p className="text-sm text-slate-500 font-medium mt-1">{person.department}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-2 text-sm text-slate-500 font-medium bg-slate-50 p-4 rounded-2xl">
          {person.email ? (
            <div className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              {person.email}
            </div>
          ) : (
              <div className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              {person.name?.toLowerCase().replace(/[^a-z0-9]/g, '')}@srec.ac.in
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <section className="flex justify-center items-center h-screen bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-[#00629b]" />
        <span className="ml-4 font-bold text-slate-500 tracking-wider animate-pulse">LOADING TEAMS...</span>
      </section>
    );
  }

  return (
    <section className="py-24 bg-slate-50 text-slate-800">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* CURRENT CORE TEAM SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00629b]/10 border border-[#00629b]/20 text-[#00629b] text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
            <Sparkles size={14} />
            {CURRENT_YEAR} Leadership Team
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Office Bearers
          </h2>

          <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Explore the brilliant minds, executive members, and wise advisors who spearhead the IEEE Student Branch.
          </p>
        </div>

        {/* Action Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<Users size={28} />}
            title={`${CURRENT_YEAR} Team`}
            value={filteredBearers.length}
            subtitle="Office bearers shown"
          />
          <StatCard
            icon={<Star size={28} />}
            title="Executive"
            value={currentExecutives.length}
            subtitle="Currently serving"
          />
          <StatCard
            icon={<Shield size={28} />}
            title="Advisors"
            value={currentAdvisors.length}
            subtitle="Guiding mentors"
          />
          <StatCard
            icon={<History size={28} />}
            title="Legacy"
            value={legacyBearers.length}
            subtitle="Past historical members"
          />
        </div>

        {/* Filters Box */}
        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
                <div className="relative w-full xl:max-w-md">
                    <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search heroes by name or department..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none focus:ring-2 focus:ring-[#00629b]/20 focus:border-[#00629b] transition"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative shrink-0">
                        <Crown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                        <select aria-label="Filter by role"
                            className="pl-12 pr-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#00629b]/20 text-sm font-bold appearance-none cursor-pointer max-w-[200px]"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            {availableRoles.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    { (search || selectedRole !== "All") && (
                        <button
                        onClick={clearFilters}
                        className="px-6 py-4 rounded-2xl text-sm font-bold bg-white text-slate-500 border border-slate-200 hover:text-red-500 hover:border-red-200 transition-colors inline-flex items-center gap-2"
                        >
                            <X size={16} /> Reset
                        </button>
                    )}

                    <div className="w-px h-10 bg-slate-200 hidden md:block mx-1"></div>

                    <div className="flex bg-slate-100 p-2 rounded-2xl border border-slate-200">
                        <button
                            aria-label="Grid view"
                            onClick={() => setViewMode("grid")}
                            className={`p-2.5 rounded-xl transition ${viewMode === "grid" ? "bg-white shadow-sm text-[#00629b]" : "text-slate-400 hover:text-slate-700"}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            aria-label="List view"
                            onClick={() => setViewMode("list")}
                            className={`p-2.5 rounded-xl transition ${viewMode === "list" ? "bg-white shadow-sm text-[#00629b]" : "text-slate-400 hover:text-slate-700"}`}
                        >
                            <Rows3 size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Render Grouped Teams (2025 Current) */}
        {filteredBearers.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white py-32 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">No leaders found for {CURRENT_YEAR}</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Try clearing your filters or using a different search term to find members.</p>
          </div>
        ) : (
            <div className="mb-24">
                {counsellorGroup && (
                    <div className="max-w-md mx-auto mb-20">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative text-center" 
                        >
                            <div className="flex flex-col items-center gap-4 mb-8">
                                <h3 className="text-3xl font-black text-[#00629b] tracking-tight">{counsellorGroup.role}</h3>
                                <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-blue-300 to-transparent rounded-full opacity-70"></div>
                            </div>
                            <div className={viewMode === "grid" ? "grid grid-cols-1 gap-6 text-left" : "space-y-4 text-left"}>
                                {counsellorGroup.members.map((b) => (
                                    viewMode === "grid" ? <OfficeCard key={b.id} person={b} /> : <OfficeListItem key={b.id} person={b} />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}

                {otherGroups.length > 0 && (
                    <div className="columns-1 md:columns-2 xl:columns-3 gap-8">
                        {otherGroups.map((group) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative break-inside-avoid mb-12 inline-block w-full" 
                                key={group.role}
                            >
                                <div className="flex items-center gap-4 mb-8 mt-4">
                                    <h3 className="text-2xl font-black text-[#00629b] tracking-tight leading-tight">{formatRoleDisplay(group.role)}</h3>
                                    <div className="h-[2px] bg-gradient-to-r from-blue-200 to-transparent flex-grow rounded-full opacity-70"></div>
                                </div>

                                <div className={viewMode === "grid" ? "grid grid-cols-1 gap-6" : "space-y-4"}>
                                    {group.members.map((b) => (
                                        viewMode === "grid" ? <OfficeCard key={b.id} person={b} /> : <OfficeListItem key={b.id} person={b} />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* Lower Details - CURRENT Executives & Advisors */}
        <div className="grid lg:grid-cols-2 gap-8 mb-32">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                 <Star className="text-amber-500 w-7 h-7" />
               </div>
               <div>
                 <h3 className="text-2xl font-black text-slate-800">Executive Members</h3>
                 <p className="text-sm font-medium text-slate-500 mt-1">{CURRENT_YEAR} Core</p>
               </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {currentExecutives.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-2xl border-slate-200 bg-slate-50">
                    <p className="text-sm text-slate-500 font-bold">No executive members found.</p>
                </div>
              ) : (
                currentExecutives.map((m) => (
                  <div key={m.id} className="flex items-center border border-slate-100 bg-slate-50/50 p-4 rounded-2xl gap-4 hover:bg-amber-50/30 transition-colors">
                    <img src={m.photo || m.photo_url || m.image_url || getAvatarFallback(m.id)} alt="Avatar" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                    <div className="flex-grow min-w-0">
                        <p className="font-bold text-slate-800 truncate">
                          <a 
                            href={m.website || m.linkedin_url || m.linkedin || m.linkedin_profile || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(m.name || "")}+IEEE+SREC`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-[#00629b] transition-colors"
                          >
                            {m.name}
                          </a>
                        </p>
                        <p className="text-xs font-semibold text-slate-500 truncate">{m.department || "General Executive"}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                 <Shield className="text-emerald-600 w-7 h-7" />
               </div>
               <div>
                 <h3 className="text-2xl font-black text-slate-800">Faculty Advisors</h3>
                 <p className="text-sm font-medium text-slate-500 mt-1">{CURRENT_YEAR} Mentors</p>
               </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {currentAdvisors.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-2xl border-slate-200 bg-slate-50">
                    <p className="text-sm text-slate-500 font-bold">No advisors found.</p>
                </div>
              ) : (
                currentAdvisors.map((a) => (
                  <div key={a.id} className="flex items-center border border-slate-100 bg-slate-50/50 p-4 rounded-2xl gap-4 hover:bg-emerald-50/30 transition-colors">
                    <img src={a.photo || a.photo_url || a.image_url || getAvatarFallback(a.id)} alt="Avatar" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                    <div className="flex-grow min-w-0">
                        <p className="font-bold text-slate-800 truncate">
                          <a 
                            href={a.website || a.linkedin_url || a.linkedin || a.linkedin_profile || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(a.name || "")}+IEEE+SREC`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-[#00629b] transition-colors"
                          >
                            {a.name}
                          </a>
                        </p>
                        <p className="text-xs font-black text-[#00629b] uppercase tracking-wider mt-0.5 truncate">{a.role || "Advisor"}</p>
                        {a.department && <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">{a.department}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* LEGACY YEAR SECTION (NO IMAGES, SEPARATE) */}
        {legacyYears.length > 0 && (
            <div className="border-t-2 border-dashed border-slate-200 pt-20 mt-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-6">
                        <History size={32} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-400 mb-4 tracking-tight">
                        Leadership Alumni
                    </h2>
                    <p className="text-slate-500 text-lg">
                        Honoring the past office bearers who laid the foundation for our student branch.
                    </p>
                </div>

                <div className="space-y-12">
                    {legacyYears.map(year => {
                        const yearMembers = legacyBearers.filter(b => b.year === year);
                        
                        // Group legacy bearers by role
                        const legacyGroups: Record<string, Person[]> = {};
                        yearMembers.forEach(b => {
                            const role = (b.role || "Member").trim();
                            if (!legacyGroups[role]) legacyGroups[role] = [];
                            legacyGroups[role].push(b);
                        });
                        const sortedGroups = Object.keys(legacyGroups)
                            .sort((a,b) => getRoleWeight(a) - getRoleWeight(b))
                            .map(role => ({ role, members: legacyGroups[role] }));

                        return (
                            <div key={year} className="rounded-[2rem] border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
                                <h3 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-6">
                                    Class of {year} - {year + 1}
                                </h3>

                                <div className="columns-1 md:columns-2 xl:columns-3 gap-8">
                                    {sortedGroups.map(group => (
                                        <div key={group.role} className="break-inside-avoid mb-8 inline-block w-full">
                                            <h4 className="text-sm font-black tracking-widest uppercase text-[#00629b] leading-tight mb-3">
                                                {formatRoleDisplay(group.role)}
                                            </h4>
                                            <div className="space-y-2">
                                                {group.members.map(member => (
                                                    <div key={member.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                        <p className="font-bold text-slate-800">{member.name}</p>
                                                        {member.department && (
                                                            <p className="text-xs text-slate-500 font-medium mt-1">{member.department}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

      </div>
    </section>
  );
};

export default OfficeBearersSection;