import { useMemo, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Shield,
  Star,
  Loader2,
  Search,
  Users,
  X,
  Mail,
  Building2,
  Crown,
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

const ieeeImages = import.meta.glob("/src/assets/IEEE/*.{png,jpg,jpeg,webp,svg}", {
  eager: true, query: "?url", import: "default"
}) as Record<string, string>;

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

  const CURRENT_YEAR = 2025;

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
          <span className="block mt-0.5 font-medium opacity-80 text-[9px] uppercase tracking-wider">Joint Activities Co-ordinator</span>
        </>
      );
    }
    return roleText;
  };

  const getAvatarFallback = (id: string | number) => {
    return `https://randomuser.me/api/portraits/${Number(id) % 2 === 0 ? "women" : "men"}/${(Number(id) % 99) + 1}.jpg`;
  };

  const getPersonImage = (person: Person): string => {
    const dbUrl = person.image_url || person.photo || person.photo_url;

    if (dbUrl) {
      const url = dbUrl.trim();
      if (url.startsWith("http://")) {
        return "https://" + url.slice(7);
      }
      if (url.startsWith("https://")) {
        return url;
      }
      if (url.startsWith("http")) {
        return url;
      }
      const safePath = encodeURIComponent(url);
      const { data } = supabase.storage.from("office_bearers").getPublicUrl(safePath);
      return data?.publicUrl;
    }

    const localImageKey = Object.keys(ieeeImages).find(key => {
      const filename = key.split('/').pop()?.split('.')[0];
      return filename === String(person.id);
    });
    
    if (localImageKey) return ieeeImages[localImageKey];
    return getAvatarFallback(person.id);
  };

  const PersonAvatar = ({ person }: { person: Person }) => {
    const [imgSrc, setImgSrc] = useState<string | undefined>(() => getPersonImage(person));
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(getPersonImage(person));
        setHasError(false);
    }, [person]);

    return (
      <img
        src={imgSrc}
        alt={person.name || "Member"}
        className="w-14 h-14 rounded-lg object-cover border border-slate-200 shadow-sm bg-slate-50 shrink-0"
        onError={() => {
            if (!hasError) {
                setHasError(true);
                setImgSrc(getAvatarFallback(person.id));
            }
        }}
      />
    );
  };

  const StatCard = ({ icon, title, value, subtitle }: { icon: ReactNode; title: string; value: number; subtitle: string }) => (
    <div className="rounded-none border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{title}</p>
          <h3 className="mt-1 text-3xl font-bold text-slate-900">{value}</h3>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">{subtitle}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-slate-400 border border-slate-100">
          {icon}
        </div>
      </div>
    </div>
  );

  const OfficeCard = ({ person }: { person: Person }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group flex flex-col bg-white border border-slate-200 rounded-none overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-700 ease-in-out"
    >
        <div className="p-4 flex items-start gap-4">
            <PersonAvatar person={person} />
            <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#00629b] mb-1">
                {formatRoleDisplay(person.role)}
            </p>
            <h3 className="text-[15px] font-semibold text-slate-900 truncate group-hover:text-[#00629b] transition-colors leading-tight">
                <a 
                href={person.website || person.linkedin_url || person.linkedin || person.linkedin_profile || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(person.name || "")}+IEEE+SREC`}
                target="_blank" 
                rel="noopener noreferrer"
                >
                {person.name || "Unnamed"}
                </a>
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium truncate">
                <Building2 className="h-3 w-3 shrink-0" />
                <span className="truncate">{person.department || "Engineering"}</span>
            </div>
            </div>
        </div>
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium truncate">
            <Mail className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{person.email || `${person.name?.toLowerCase().replace(/[^a-z0-9]/g, '')}@srec.ac.in`}</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
        </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <section className="flex justify-center items-center h-[60vh] bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#00629b]" />
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CURRENT CORE TEAM HEADER */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase mb-4 shadow-sm">
            <Crown className="h-3 w-3" /> Core Operations {CURRENT_YEAR}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Office Bearers Directory
          </h2>
          <p className="text-slate-600 text-base leading-relaxed max-w-3xl">
            Directory of executive members, officers, and faculty advisors directing the operations of the IEEE Student Branch.
          </p>
        </div>

        {/* Action Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard icon={<Users size={20} />} title={`Team ${CURRENT_YEAR}`} value={filteredBearers.length} subtitle="Active bearers logged" />
          <StatCard icon={<Star size={20} />} title="Executives" value={currentExecutives.length} subtitle="Operational executives" />
          <StatCard icon={<Shield size={20} />} title="Faculty" value={currentAdvisors.length} subtitle="Guiding advisors" />
          <StatCard icon={<History size={20} />} title="Alumni" value={legacyBearers.length} subtitle="Historical leadership" />
        </div>

        {/* Filters Box */}
        <div className="rounded-none border border-slate-200 bg-white shadow-sm p-2 mb-10 sticky top-[72px] z-30">
            <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search team directory by name..."
                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative shrink-0 hidden sm:block">
                        <Crown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                        <select aria-label="Filter by role"
                            className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg py-2 pl-9 pr-8 text-sm text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            {availableRoles.map(r => (
                                <option key={r} value={r}>{r === "All" ? "Filter: All Roles" : `Role: ${r}`}</option>
                            ))}
                        </select>
                    </div>

                    { (search || selectedRole !== "All") && (
                        <button
                          onClick={clearFilters}
                          className="px-3 py-2 text-slate-500 hover:text-red-700 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm font-medium shrink-0"
                        >
                            <X size={14} /> <span className="hidden sm:inline">Clear</span>
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* Render Grouped Teams (2025 Current) */}
        {filteredBearers.length === 0 ? (
          <div className="rounded-none border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No personnel found</h3>
            <p className="text-sm text-slate-500 mt-1">Adjust search parameters to locate a member.</p>
          </div>
        ) : (
            <div className="mb-16">
                {counsellorGroup && (
                    <div className="mb-16 flex flex-col items-center">
                        <div className="flex items-center justify-center w-full max-w-3xl gap-6 mb-8">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200"></div>
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight text-center uppercase tracking-widest">{counsellorGroup.role}</h3>
                            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200"></div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 w-full">
                            {counsellorGroup.members.map((b) => (
                                <div key={b.id} className="w-full sm:w-[380px] lg:w-[420px]">
                                    <OfficeCard person={b} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {otherGroups.length > 0 && (
                    <div className="columns-1 md:columns-2 xl:columns-3 gap-6">
                        {otherGroups.map((group) => (
                            <div className="relative break-inside-avoid mb-8 inline-block w-full" key={group.role}>
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#00629b]">{formatRoleDisplay(group.role)}</h3>
                                    <div className="flex-1 h-px bg-slate-200"></div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {group.members.map((b) => (
                                        <OfficeCard key={b.id} person={b} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* Lower Details - CURRENT Executives & Advisors */}
        <div className="grid lg:grid-cols-2 gap-6 mb-20">
          <div className="rounded-none border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-5">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                    <Star className="w-5 h-5" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900">Executive Members</h3>
               </div>
               <span className="text-[10px] tracking-wider uppercase font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded border border-slate-200">Core {CURRENT_YEAR}</span>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {currentExecutives.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-sm text-slate-500 font-medium">System reports no executive members.</p>
                </div>
              ) : (
                currentExecutives.map((m) => (
                  <div key={m.id} className="border border-slate-100 bg-slate-50 hover:bg-slate-100 p-3.5 rounded-lg transition-colors flex justify-between items-center gap-4">
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">
                          <a 
                            href={m.website || m.linkedin_url || m.linkedin || m.linkedin_profile || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(m.name || "")}+IEEE+SREC`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-slate-900 transition-colors"
                          >
                            {m.name}
                          </a>
                        </p>
                        <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">{m.department || "General Executive"}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-none border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-5">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                    <Shield className="w-5 h-5" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900">Faculty Advisors</h3>
               </div>
               <span className="text-[10px] tracking-wider uppercase font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded border border-slate-200">Mentors</span>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {currentAdvisors.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-sm text-slate-500 font-medium">System reports no advisors.</p>
                </div>
              ) : (
                currentAdvisors.map((a) => (
                  <div key={a.id} className="border border-slate-100 bg-slate-50 hover:bg-slate-100 p-3.5 rounded-lg transition-colors">
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">
                          <a 
                            href={a.website || a.linkedin_url || a.linkedin || a.linkedin_profile || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(a.name || "")}+IEEE+SREC`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-slate-900 transition-colors"
                          >
                            {a.name}
                          </a>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">{a.role || "Advisor"}</span>
                            {a.department && <span className="text-[11px] font-medium text-slate-500 truncate">{a.department}</span>}
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* LEGACY YEAR SECTION */}
        {legacyYears.length > 0 && (
            <div className="pt-4">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        Leadership Alumni
                    </h2>
                    <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                <div className="space-y-8">
                    {legacyYears.map(year => {
                        const yearMembers = legacyBearers.filter(b => b.year === year);
                        
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
                            <div key={year} className="rounded-none border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center gap-3">
                                    <History className="h-5 w-5 text-slate-400" />
                                    Archive: {year} - {year + 1}
                                </h3>

                                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
                                    {sortedGroups.map(group => (
                                        <div key={group.role} className="flex flex-col gap-3 break-inside-avoid mb-6 inline-block w-full">
                                            <h4 className="text-[10px] font-bold tracking-widest uppercase text-slate-500 border-b border-slate-100 pb-1.5 pt-1">
                                                {formatRoleDisplay(group.role)}
                                            </h4>
                                            <div className="space-y-2">
                                                {group.members.map(member => (
                                                    <div key={member.id} className="bg-slate-50 hover:bg-slate-100 rounded-lg p-3 border border-slate-200 transition-colors">
                                                        <p className="text-sm font-semibold text-slate-800 leading-tight">{member.name}</p>
                                                        {member.department && (
                                                            <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">{member.department}</p>
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