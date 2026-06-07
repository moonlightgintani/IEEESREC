import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, FolderOpen, Eye, FileArchive, Search, Calendar, BadgeInfo } from "lucide-react";
import { useMemo, useState } from "react";
import { resolveAssetUrl } from "@/lib/utils";

/* =========================
   AUTO IMPORT DOCUMENTS
========================= */
const localDocs = import.meta.glob("/src/assets/gallery/IEEE Events/**/*.{doc,docx,pdf}", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

const getLocalGroupedDocs = () => {
  const grouped: Record<string, { id: string, name: string, url: string, path: string, type: string }[]> = {};
  Object.entries(localDocs).forEach(([path, url], idx) => {
    const parts = path.split("/");
    const folder = parts[parts.length - 2];
    const fileName = parts[parts.length - 1];
    const isPdf = fileName.toLowerCase().endsWith('.pdf');
    const isDocx = fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc');
    
    if (!grouped[folder]) grouped[folder] = [];
    grouped[folder].push({ 
      id: `doc-${idx}`,
      name: fileName.replace(/\.(doc|docx|pdf)$/i, ''), 
      url: resolveAssetUrl(url),
      path: path,
      type: isPdf ? 'PDF' : isDocx ? 'Word' : 'Doc'
    });
  });
  return grouped;
};


const ReportsPage = () => {
  const groupedDocs = useMemo(() => getLocalGroupedDocs(), []);
  
  const sortedFolders = Object.keys(groupedDocs).sort((a, b) => b.localeCompare(a));
  const [activeFolder, setActiveFolder] = useState<string>(sortedFolders[0] || "");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = useMemo(() => {
    if (!activeFolder || !groupedDocs[activeFolder]) return [];
    if (!searchQuery) return groupedDocs[activeFolder];
    return groupedDocs[activeFolder].filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activeFolder, searchQuery, groupedDocs]);

  // Card Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100, damping: 12 } },
    hover: { y: -8, transition: { type: "spring" as const, stiffness: 400, damping: 10 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden flex flex-col">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-indigo-400/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

      <Navbar />
      
      {/* CREATIVE HEADER */}
      <section className="relative pt-20 pb-16 md:pt-24 md:pb-20 overflow-hidden bg-gradient-to-b from-blue-50 via-slate-55 to-white border-b border-slate-200/60">
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

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 backdrop-blur text-xs font-semibold text-blue-700 shadow-[0_4px_12px_rgba(59,130,246,0.05)] mb-4">
            <BadgeInfo size={13} className="text-blue-500" /> Digital Archive
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-3">
            Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 drop-shadow-[0_4px_15px_rgba(37,99,235,0.08)]">Vault</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-550 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Explore our curated repository of technical reports, event documentations, and historical records.
          </motion.p>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 pb-10 -mt-6 md:-mt-8 relative z-20 flex-grow w-full">
        {sortedFolders.length === 0 ? (
           <div className="text-center py-16 bg-white border border-dashed border-slate-200/80 rounded-2xl shadow-xl backdrop-blur-xl">
             <FileArchive size={40} className="mx-auto text-slate-400 mb-3 animate-pulse" />
             <p className="font-bold text-base text-slate-800">No documents in the vault.</p>
             <p className="text-xs mt-1 text-slate-500">Upload records to your structured local gallery to see them here.</p>
           </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* SIDEBAR FILTER BAR */}
            <div className="w-full lg:w-72 lg:sticky lg:top-24 z-30 shrink-0">
              <div className="bg-white/95 backdrop-blur-2xl rounded-2xl p-5 shadow-xl border border-slate-200/60">
                <div className="flex items-center justify-between mb-3 px-1 select-none">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Calendar size={12} className="text-blue-500" /> Chronological Filter
                  </h3>
                </div>
                
                {/* Responsive scrolling pill list (horizontal scroll on mobile, vertical stack on desktop) */}
                <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0 gap-2 snap-x scrollbar-hide">
                  {sortedFolders.map(folder => {
                    const isActive = activeFolder === folder;
                    return (
                      <button
                        key={folder}
                        onClick={() => { setActiveFolder(folder); setSearchQuery(""); }}
                        className={`shrink-0 snap-start flex items-center justify-between w-auto lg:w-full gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-bold group relative overflow-hidden ${
                          isActive ? "text-white shadow-md shadow-blue-500/20 scale-[1.01]" : "bg-slate-100/80 hover:bg-slate-200/60 text-slate-650 hover:text-slate-900 border border-slate-200/40 hover:border-slate-200/80"
                        }`}
                      >
                        {/* Selected Background animation */}
                        {isActive && (
                          <motion.div layoutId="activeVaultTab" className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400/20" />
                        )}
                        
                        <span className="relative z-10 flex items-center gap-1.5 text-xs tracking-wide whitespace-nowrap">
                          <FolderOpen size={14} className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-800 transition-colors"} />
                          {folder.replace('IEEE', '').trim()}
                        </span>
                        
                        <span className={`relative z-10 text-[9px] px-2 py-0.5 rounded-full font-black tracking-widest ${
                          isActive ? "bg-white/20 text-white backdrop-blur-sm" : "bg-white text-slate-500 border border-slate-200/60"
                        }`}>
                          {groupedDocs[folder].length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* VAULT CONTENT AREA */}
            <div className="flex-1 w-full space-y-4">
              
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-white/95 backdrop-blur-2xl rounded-2xl p-4 px-6 shadow-xl border border-slate-200/60 gap-3">
                 <h2 className="text-lg font-extrabold text-slate-850 flex items-center gap-2">
                   {activeFolder} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-black">Archive</span>
                 </h2>
                 <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search reports..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs font-semibold rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:shadow-[0_0_15px_rgba(59,130,246,0.08)] transition-all duration-300 shadow-inner"
                    />
                 </div>
              </div>

              {/* Document Grid */}
              {filteredDocs.length === 0 ? (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center text-slate-500 bg-white backdrop-blur-sm rounded-2xl border border-slate-200 border-dashed shadow-xl">
                    <Search size={40} className="mx-auto mb-4 text-blue-500/30 animate-pulse" />
                    <p className="font-bold text-lg text-slate-800">No matching records found.</p>
                    <p className="text-xs mt-1 font-light text-slate-500">Try adjusting your search criteria.</p>
                 </motion.div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredDocs.map((doc) => (
                      <motion.div
                        layout
                        key={doc.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group relative flex flex-col p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md hover:shadow-xl hover:border-blue-500/30 transition-all duration-500 overflow-hidden"
                      >
                        {/* Subtle overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                          {/* Top row: Icon & Badge */}
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110 shadow-inner ${
                              doc.type === 'PDF' 
                                ? "bg-rose-50 text-rose-600 border border-rose-100" 
                                : "bg-blue-50 text-blue-600 border border-blue-100"
                            }`}>
                              <FileText size={22} strokeWidth={2.5} />
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full shadow-sm border ${
                              doc.type === 'PDF' ? "bg-rose-50 text-rose-655 border-rose-100" : "bg-blue-50 text-blue-655 border-blue-100"
                            }`}>
                              {doc.type}
                            </span>
                          </div>

                          {/* Title */}
                          <div className="mb-4 flex-1">
                            <h4 className="font-bold text-sm text-slate-800 line-clamp-2 leading-[1.4] tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                              {doc.name}
                            </h4>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-[0.4] flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60 hover:border-slate-300 rounded-lg text-[10px] font-bold transition-all duration-300 group/btn"
                            >
                              <Eye size={14} className="group-hover/btn:-mt-0.5 transition-transform" /> 
                              <span className="hidden sm:inline">Preview</span>
                            </a>
                            <a
                              href={doc.url}
                              download={doc.name}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-[10px] font-bold shadow-md border border-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 group/btn"
                            >
                              <Download size={14} className="group-hover/btn:translate-y-0.5 transition-transform" /> Download File
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
            
          </div>
        )}
      </section>
      
      <Footer />
    </div>
  );
};

export default ReportsPage;
