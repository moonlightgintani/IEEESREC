import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X, ChevronLeft, ChevronRight, Image as ImageIcon, Maximize2, ArrowRight, Heart, Share2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { resolveAssetUrl } from "@/lib/utils";

/* =========================
   AUTO IMPORT IMAGES (LOCAL GITHUB)
========================= */
const localImages = import.meta.glob("/src/assets/gallery/**/*.{jpg,png,jpeg}", { eager: true });
const officeBearerImages = import.meta.glob("/src/assets/IEEE/*.{png,jpg,jpeg,webp,svg}", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const teamAvatars = Object.values(officeBearerImages).slice(0, 3);

const getLocalGroupedImages = () => {
  const grouped: Record<string, { url: string }[]> = {};
  Object.entries(localImages).forEach(([path, module]: any) => {
    const parts = path.split("/");
    const folder = parts[parts.length - 2];
    if (!grouped[folder]) grouped[folder] = [];
    grouped[folder].push({ url: resolveAssetUrl(module.default) });
  });
  return grouped;
};


/* =========================
   FORMAT FOLDER NAME
========================= */
const formatEventName = (folder: string) => {
  return folder.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

/* =========================
   LIGHTBOX & GALLERY IMAGE
========================= */
const Lightbox = ({ images, currentImg, setCurrentImg, onClose }: { images: { url: string }[]; currentImg: string | null; setCurrentImg: (url: string) => void; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = currentImg ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [currentImg]);

  useEffect(() => {
    if (!currentImg) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      const currentIndex = images.findIndex((img) => img.url === currentImg);
      if (currentIndex === -1) return;
      if (e.key === "ArrowLeft" && currentIndex > 0) setCurrentImg(images[currentIndex - 1].url);
      else if (e.key === "ArrowRight" && currentIndex < images.length - 1) setCurrentImg(images[currentIndex + 1].url);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentImg, images, setCurrentImg, onClose]);

  if (!currentImg) return null;

  const currentIndex = images.findIndex((img) => img.url === currentImg);
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) setCurrentImg(images[currentIndex - 1].url);
  };
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < images.length - 1) setCurrentImg(images[currentIndex + 1].url);
  };

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[10000] w-screen h-screen backdrop-blur-md" onClick={onClose}>
      <motion.img 
        key={currentImg}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        src={currentImg} 
        className="max-w-[95%] max-h-[95%] object-contain select-none" 
        alt="Fullscreen Gallery" 
      />
      
      {currentIndex > 0 && (
        <button 
          aria-label="Previous image"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/20 hover:bg-black/50 p-3 md:p-4 rounded-full transition-all duration-300 z-10 border border-white/10" 
          onClick={handlePrev}
        >
          <ChevronLeft size={32} />
        </button>
      )}
      
      {currentIndex < images.length - 1 && (
        <button 
          aria-label="Next image"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/20 hover:bg-black/50 p-3 md:p-4 rounded-full transition-all duration-300 z-10 border border-white/10" 
          onClick={handleNext}
        >
          <ChevronRight size={32} />
        </button>
      )}

      <button aria-label="Close" className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 z-10" onClick={(e) => { e.stopPropagation(); onClose(); }}>
        <X size={28} />
      </button>
    </div>
  );
};

const GalleryImage = ({ src, onClick }: { src: string; onClick: (src: string) => void }) => (
  <motion.div className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-sm bg-slate-100" whileHover={{ scale: 1.02 }}>
    <img src={src} onClick={() => onClick(src)} alt="Gallery thumbnail" className="w-full h-48 md:h-60 object-cover transition duration-700 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
  </motion.div>
);

/* =========================
   EVENT SECTION
========================= */
const EventSection = ({ folder, images }: { folder: string, images: { url: string }[] }) => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const eventName = formatEventName(folder);

  useEffect(() => {
    if (isFullScreen || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length, isFullScreen]);

  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = "hidden";
    } else if (!selectedImg) {
      document.body.style.overflow = "";
    }
    return () => { if (!selectedImg) document.body.style.overflow = ""; };
  }, [isFullScreen, selectedImg]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
    >
      {/* Slideshow part */}
      <div 
        className="relative w-full aspect-video cursor-pointer bg-slate-100 overflow-hidden"
        onClick={() => setIsFullScreen(true)}
      >
        <AnimatePresence mode="wait">
          {images.length > 0 && (
              <motion.img
                key={currentIndex}
                src={images[currentIndex].url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
              />
          )}
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Working elements: Top badging */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg font-bold text-[#0b3b8f] text-[10px] uppercase tracking-widest flex items-center gap-1.5 shadow-sm transform group-hover:translate-x-1 transition-transform">
          <ImageIcon size={12}/> Event Album
        </div>

        {/* Quick action buttons on hover */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
            <button aria-label="Like" className="bg-white/20 hover:bg-white/50 backdrop-blur-md text-white p-2 rounded-full border border-white/20 transition-all shadow-lg" onClick={(e) => { e.stopPropagation(); }}>
                <Heart size={14} className="hover:scale-110 transition-transform" />
            </button>
            <button aria-label="Share" className="bg-white/20 hover:bg-white/50 backdrop-blur-md text-white p-2 rounded-full border border-white/20 transition-all shadow-lg" onClick={(e) => { e.stopPropagation(); }}>
                <Share2 size={14} className="hover:scale-110 transition-transform" />
            </button>
        </div>
        
        {/* Central interactive icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
           <button aria-label="Maximize" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-4 rounded-full border border-white/40 transform scale-90 group-hover:scale-100 transition-all shadow-xl">
               <Maximize2 size={24} />
           </button>
        </div>

        {/* Bottom bar integration for dots and image count */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10 pointer-events-none">
            <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl text-white font-semibold text-[10px] uppercase tracking-wider flex items-center gap-1.5 border border-white/10 shadow-lg pointer-events-auto transform group-hover:-translate-y-1 transition-transform">
               <ImageIcon size={12} /> {images.length} Photos
            </div>
            
        </div>
      </div>

      {/* Info part */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white z-10">
          <div>
             <div className="flex -space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity mb-2">
                 {teamAvatars.map((imgUrl, n) => (
                     <div key={n} className="w-6 h-6 rounded-full bg-slate-200 border border-white shadow-sm overflow-hidden flex items-center justify-center">
                         <img src={imgUrl} alt="team member" className="w-full h-full object-cover" />
                     </div>
                 ))}
             </div>
             
             <h2 
                 className="text-lg font-black text-slate-900 tracking-tight cursor-pointer hover:text-[#0b3b8f] transition-colors leading-tight line-clamp-2 mt-2"
                 onClick={() => setIsFullScreen(true)}
             >
                 {eventName}
             </h2>
          </div>
          <button 
             onClick={() => setIsFullScreen(true)}
             className="mt-6 w-full text-xs font-bold text-[#0b3b8f] bg-[#0b3b8f]/5 hover:bg-[#0b3b8f] hover:text-white border border-[#0b3b8f]/10 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group/btn"
          >
             Browse Media <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
      </div>

      {/* Fullscreen Grid Overlay */}
      <AnimatePresence>
          {isFullScreen && (
            <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed inset-0 bg-white z-[9900] overflow-y-auto w-screen h-screen scroll-smooth"
            >
                <div className="sticky top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center bg-white/90 border-b border-slate-200 z-[9950] backdrop-blur-md shadow-sm">
                    <div>
                       <h2 className="text-slate-900 text-xl md:text-2xl font-black tracking-tight">{eventName}</h2>
                       <div className="flex items-center gap-3 mt-1.5">
                           <p className="text-slate-500 text-xs md:text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5"><ImageIcon size={14}/>{images.length} Captured Moments</p>
                       </div>
                    </div>
                    <button 
                       aria-label="Close"
                       className="text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 p-3 rounded-full transition-all duration-300 border border-slate-200" 
                       onClick={() => setIsFullScreen(false)}
                    >
                       <X size={24} />
                    </button>
                </div>
          
                <div className="p-4 md:p-8 md:pt-10 pb-20 bg-slate-50 min-h-screen">
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 max-w-[1600px] mx-auto space-y-4 md:space-y-6">
                        {images.map((img, i) => (
                            <motion.div 
                               initial={{ opacity: 0, y: 20 }}
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
                               key={i} 
                               className="rounded-2xl overflow-hidden bg-slate-200 border border-slate-200/50 relative group cursor-pointer shadow-sm hover:shadow-xl transition-all inline-block w-full break-inside-avoid"
                               onClick={() => setSelectedImg(img.url)}
                            >
                                <img src={img.url} className="w-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-[1.02]" alt="Event content" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                                <div className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 shadow-lg scale-90 group-hover:scale-100">
                                   <Maximize2 size={16} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
          )}
      </AnimatePresence>

      <Lightbox images={images} currentImg={selectedImg} setCurrentImg={setSelectedImg} onClose={() => setSelectedImg(null)} />
    </motion.div>
  );
};

/* =========================
   MAIN PAGE
========================= */
const GalleryPage = () => {
  const allDivisions = useMemo(() => {
    return getLocalGroupedImages();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-32 pb-16 text-center max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0b3b8f] text-[10px] font-black uppercase tracking-widest mb-6">
          Official Photography
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Event <span className="text-[#0b3b8f]">Gallery</span></h1>
        <p className="text-slate-500 mt-4 text-base md:text-lg max-w-2xl mx-auto">
          Explore the memories and milestones of our student branch.
        </p>
      </section>
      <section className="max-w-[1600px] mx-auto px-4 pb-20">
        {Object.entries(allDivisions).length === 0 ? (
           <div className="text-center text-slate-500 py-12 border border-dashed border-slate-300 rounded-3xl mx-auto max-w-lg">No gallery divisions found. Upload images to the local folder structure to view them here.</div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {Object.entries(allDivisions).map(([folder, imgs]) => (
               <EventSection key={folder} folder={folder} images={imgs} />
             ))}
           </div>
        )}
      </section>
      <Footer />
    </div>
  );
};
export default GalleryPage;