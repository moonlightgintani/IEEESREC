import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CalendarDays,
  Users,
  Search,
  Filter,
  UserRound,
  ArrowUpDown,
  X,
  BarChart3,
  Star,
  Activity
} from "lucide-react";

type ActivityItem = {
  id: number;
  s_no?: number;
  event: string;
  date?: string;
  chief_guest?: string;
  participants?: string;
  image_url?: string | null;
};

const fallbackImage = "https://placehold.co/800x500?text=No+Image";

const getValidImageUrl = (url?: string | null) => {
  if (!url || !url.trim()) return fallbackImage;
  const target = url.trim();
  
  if (target.includes("drive.google.com")) {
    const match = target.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match?.[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return fallbackImage;
  }
  
  if (target.startsWith("http://") || target.startsWith("https://")) {
    return target;
  }
  
  const { data } = supabase.storage.from("activities").getPublicUrl(target);
  return data?.publicUrl || fallbackImage;
};

const parseYearFromDate = (dateStr?: string) => {
  if (!dateStr) return "Unknown";
  const years = dateStr.match(/\b(19|20)\d{2}\b/g);
  return years && years.length > 0 ? years[years.length - 1] : "Unknown";
};

const getParticipantCount = (participants?: string) => {
  if (!participants) return 0;
  const match = participants.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const StatsGraphicModule = ({ activities }: { activities: ActivityItem[] }) => {
  const chartData = useMemo(() => {
     const counts: Record<string, number> = {};
     activities.forEach(a => {
        const y = parseYearFromDate(a.date);
        if(y !== "Unknown") counts[y] = (counts[y] || 0) + 1;
     });
     return Object.entries(counts).sort((a,b) => Number(a[0]) - Number(b[0])).slice(-8); 
  }, [activities]);

  const max = Math.max(...chartData.map(d => d[1]), 1);

  return (
     <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hidden lg:flex flex-col gap-4 shrink-0 w-[280px]">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs tracking-wide">
             <BarChart3 className="h-4 w-4 text-slate-400" /> Event Activity Trend
           </div>
        </div>
        <div className="flex items-end justify-between h-20 gap-1.5 pt-2">
           {chartData.map(([year, count]) => (
              <div key={year} className="flex flex-col items-center gap-1.5 w-full relative group">
                 <div className="absolute -top-6 bg-slate-800 text-white text-[10px] rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                   {count} Events
                 </div>
                 <div className="w-full bg-slate-100 rounded-[2px] overflow-hidden flex items-end h-full">
                    <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: `${(count / max) * 100}%` }}
                       transition={{ duration: 0.7, ease: "easeOut" }}
                       className="w-full bg-blue-600 group-hover:bg-blue-500 transition-colors"
                    />
                 </div>
                 <span className="text-[9px] font-medium text-slate-400">{year.slice(2)}</span>
              </div>
           ))}
        </div>
     </div>
  );
};

const ActivityCard = ({ item, onClick }: { item: ActivityItem; onClick: () => void }) => {
  const resolvedImage = getValidImageUrl(item.image_url);
  const [imgSrc, setImgSrc] = useState(resolvedImage);
  const participantCount = getParticipantCount(item.participants);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col h-[340px] group"
    >
      <div className="relative h-44 w-full bg-slate-100 border-b border-slate-100 shrink-0">
        <img 
          src={imgSrc} 
          alt={item.event}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-95" 
          onError={() => setImgSrc(fallbackImage)}
        />
        <div className="absolute top-2 left-2 bg-white text-slate-800 text-[9px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider border border-slate-100/50">
          {parseYearFromDate(item.date)}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-900 text-[15px] leading-snug line-clamp-2 mb-3">
          {item.event}
        </h3>
        <div className="space-y-1.5 mb-auto text-[13px] text-slate-500">
           <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-slate-400 shrink-0" /> <span className="truncate">{item.date || "TBD"}</span></div>
           <div className="flex items-center gap-2"><UserRound className="h-3.5 w-3.5 text-slate-400 shrink-0" /> <span className="truncate">{item.chief_guest || "No Guest Provided"}</span></div>
        </div>
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
           <div className="flex items-center gap-1.5 font-medium text-slate-700">
             <Users className="h-3.5 w-3.5 text-slate-400" /> {participantCount}
           </div>
           <span className="text-[10px] text-slate-400 font-medium">#{item.s_no || item.id}</span>
        </div>
      </div>
    </div>
  );
};

const ActivitiesPage = () => {
  const [selectedYear, setSelectedYear] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "s_no" | "participants" | "event">("latest");
  const [selectedModalItem, setSelectedModalItem] = useState<ActivityItem | null>(null);

  useEffect(() => {
    if (selectedModalItem) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedModalItem]);

  const { data: activities = [], isLoading, isError, error } = useQuery<ActivityItem[]>({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("id, s_no, event, date, chief_guest, participants, image_url")
        .order("s_no", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(activities.map((item) => parseYearFromDate(item.date))))
      .filter((year) => year !== "Unknown")
      .sort((a, b) => Number(b) - Number(a));
    return ["All", ...uniqueYears];
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const result = activities.filter((item) => {
      const itemYear = parseYearFromDate(item.date);
      const matchesYear = selectedYear === "All" || itemYear === selectedYear;
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        item.event?.toLowerCase().includes(search) ||
        item.chief_guest?.toLowerCase().includes(search) ||
        item.participants?.toLowerCase().includes(search) ||
        item.date?.toLowerCase().includes(search);
      return matchesYear && matchesSearch;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "event") return a.event.localeCompare(b.event);
      if (sortBy === "participants") return getParticipantCount(b.participants) - getParticipantCount(a.participants);
      if (sortBy === "s_no") return (a.s_no || 0) - (b.s_no || 0);

      const yearA = Number(parseYearFromDate(a.date)) || 0;
      const yearB = Number(parseYearFromDate(b.date)) || 0;

      if (sortBy === "oldest") {
        if (yearA !== yearB) return yearA - yearB;
        return (a.s_no || 0) - (b.s_no || 0);
      }
      if (yearA !== yearB) return yearB - yearA;
      return (b.s_no || 0) - (a.s_no || 0);
    });
  }, [activities, selectedYear, searchTerm, sortBy]);

  const totalParticipants = useMemo(() => filteredActivities.reduce((sum, item) => sum + getParticipantCount(item.participants), 0), [filteredActivities]);

  const featuredActivity = useMemo(() => {
    if (!filteredActivities.length) return null;
    return [...filteredActivities].sort((a, b) => getParticipantCount(b.participants) - getParticipantCount(a.participants))[0];
  }, [filteredActivities]);

  const groupedActivities = useMemo(() => {
    if (sortBy === "participants" || sortBy === "event" || sortBy === "s_no") {
      return { "Directory Results": filteredActivities };
    }
    const groups: Record<string, typeof filteredActivities> = {};
    filteredActivities.forEach((item) => {
      const year = parseYearFromDate(item.date);
      if (!groups[year]) groups[year] = [];
      groups[year].push(item);
    });
    return groups;
  }, [filteredActivities, sortBy]);

  const groupKeys = useMemo(() => {
     const keys = Object.keys(groupedActivities);
     if (keys.length === 1 && keys[0] === "Directory Results") return keys;
     return keys.sort((a, b) => {
        if (sortBy === "oldest") return Number(a) - Number(b);
        return Number(b) - Number(a); 
     });
  }, [groupedActivities, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      <div className="bg-white border-b border-slate-200 pt-10 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Event Directory</h1>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Log and analyze official technical programs, seminars, and organizational activities.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10 shrink-0">
                <div className="flex gap-10 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Operations</p>
                    <p className="text-2xl font-bold text-slate-900">{activities.length}</p>
                  </div>
                  <div className="w-px bg-slate-200"></div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Total Reach</p>
                    <p className="text-2xl font-bold text-slate-900">{totalParticipants}</p>
                  </div>
                </div>

                {activities.length > 0 && <StatsGraphicModule activities={activities} />}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm mb-8 sticky top-[72px] z-30">
          <div className="flex flex-col md:flex-row gap-2">
             <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <input
                  type="text"
                  placeholder="Search events, guests, or IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
               />
             </div>
             
             <div className="flex min-w-0 gap-2">
               <div className="relative shrink-0 hidden sm:block">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    aria-label="Filter by year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg py-2 pl-9 pr-8 text-sm text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  >
                    {years.map(y => <option key={y} value={y}>{y === "All" ? "Filter: All Years" : `Year: ${y}`}</option>)}
                  </select>
               </div>

               <div className="relative shrink-0 hidden sm:block">
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    aria-label="Sort activities"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "latest" | "oldest" | "s_no" | "participants" | "event")}
                    className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg py-2 pl-9 pr-8 text-sm text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  >
                    <option value="latest">Sort: Latest</option>
                    <option value="oldest">Sort: Oldest</option>
                    <option value="participants">Sort: Highest Reach</option>
                    <option value="event">Sort: Name (A-Z)</option>
                    <option value="s_no">Sort: Record ID</option>
                  </select>
               </div>

               {(searchTerm || selectedYear !== "All" || sortBy !== "latest") && (
                 <button
                   onClick={() => { setSelectedYear("All"); setSearchTerm(""); setSortBy("latest"); }}
                   className="px-3 py-2 text-slate-500 hover:text-red-700 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm font-medium shrink-0"
                 >
                   <X className="h-4 w-4" /> <span className="hidden sm:inline">Clear</span>
                 </button>
               )}
             </div>
          </div>
        </div>

        {featuredActivity && (
          <div 
            onClick={() => setSelectedModalItem(featuredActivity)}
            className="mb-8 bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer shadow-sm group transition-all relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 transition-all group-hover:w-1.5"></div>
            
            <div className="flex-1 pl-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                 <Star className="h-3 w-3 text-slate-400" /> Featured Event
              </div>
              <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                {featuredActivity.event}
              </h2>
            </div>
            
            <div className="flex items-center gap-6 md:gap-10 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 text-sm w-full md:w-auto">
               <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 mb-0.5">Attendees</span>
                  <span className="font-semibold text-slate-900">{getParticipantCount(featuredActivity.participants)}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 mb-0.5">Date Organized</span>
                  <span className="font-semibold text-slate-900">{featuredActivity.date || "-"}</span>
               </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl h-[340px] animate-pulse flex flex-col overflow-hidden shadow-sm">
                <div className="h-44 bg-slate-100 border-b border-slate-100 shrink-0" />
                <div className="p-4 flex flex-col flex-1">
                  <div className="h-4 w-3/4 bg-slate-100 rounded mb-4" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded mb-2" />
                  <div className="h-3 w-2/3 bg-slate-100 rounded mb-auto" />
                  <div className="h-3 w-1/3 bg-slate-100 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center mt-6">
            <h3 className="text-sm font-semibold text-red-800">Unable to establish records connection</h3>
            <p className="mt-1 text-xs text-red-600">{(error as Error)?.message || "Verify your connection parameters."}</p>
          </div>
        )}

        {!isLoading && !isError && filteredActivities.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-16 text-center shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-full mb-4 border border-slate-100">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">No records found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mb-6">
              There are no matching activities mapped to your current filter constraints.
            </p>
            <button 
              onClick={() => { setSelectedYear("All"); setSearchTerm(""); setSortBy("latest"); }}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm"
            >
              Clear Requirements
            </button>
          </div>
        )}

        {!isLoading && !isError && filteredActivities.length > 0 && (
          <div className="flex flex-col gap-10">
            {groupKeys.map((yearKey) => (
              <div key={yearKey}>
                <div className="flex items-center gap-4 mb-5">
                  <h2 className="text-lg font-bold text-slate-900">{yearKey}</h2>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {groupedActivities[yearKey].map((item) => (
                    <ActivityCard 
                      key={item.id} 
                      item={item} 
                      onClick={() => setSelectedModalItem(item)} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />

      <AnimatePresence>
        {selectedModalItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedModalItem(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]"
            />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-4xl max-h-full overflow-y-auto pointer-events-auto"
              >
                <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row w-full">
                  <div className="lg:w-1/2 relative bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 min-h-[250px] lg:min-h-full flex items-center justify-center">
                     <img 
                       src={getValidImageUrl(selectedModalItem.image_url)} 
                       alt={selectedModalItem.event}
                       className="absolute inset-0 w-full h-full object-contain p-4" 
                     />
                  </div>
                  <div className="lg:w-1/2 p-6 lg:p-10 flex flex-col bg-white">
                     <div className="flex items-center justify-between mb-6">
                        <span className="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-slate-200">
                          Record ID: {selectedModalItem.s_no || selectedModalItem.id}
                        </span>
                        <button 
                           aria-label="Close modal"
                           onClick={() => setSelectedModalItem(null)} 
                           className="text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg border border-transparent hover:border-slate-200 transition-all"
                        >
                           <X className="h-4 w-4" />
                        </button>
                     </div>
                     
                     <h2 className="text-xl font-bold text-slate-900 leading-snug mb-8">
                        {selectedModalItem.event}
                     </h2>
                     
                     <div className="space-y-0 text-sm">
                       <div className="grid grid-cols-[120px_1fr] items-baseline border-b border-slate-100 pb-3 mb-3">
                         <span className="font-medium text-slate-500">Organized</span>
                         <span className="text-slate-900 font-medium">{selectedModalItem.date || "-"}</span>
                       </div>
                       <div className="grid grid-cols-[120px_1fr] items-baseline border-b border-slate-100 pb-3 mb-3">
                         <span className="font-medium text-slate-500">Representative</span>
                         <span className="text-slate-900 font-medium">{selectedModalItem.chief_guest || "-"}</span>
                       </div>
                       <div className="grid grid-cols-[120px_1fr] items-baseline border-b border-slate-100 pb-3 mb-3">
                         <span className="font-medium text-slate-500">Logging</span>
                         <span className="text-slate-900 font-medium">{getParticipantCount(selectedModalItem.participants)} Participants</span>
                       </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivitiesPage;