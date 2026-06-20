import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Cpu, Radio, HeartPulse, Gauge, Loader2, Target, Network, Layers, Activity, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import wieLogo from "@/assets/societies/WIE.jpg";
import embsLogo from "@/assets/societies/EMBS.jpg";
import csLogo from "@/assets/societies/CS.png";
import comsocLogo from "@/assets/societies/ComSoc.jpg";
import pelsLogo from "@/assets/societies/pels.png";
import srecLogo from "@/assets/srec-logo.png";
import cisLogo from "@/assets/societies/CIS.png";
import imlogo from "@/assets/societies/IM.jpg";

const logoMapping: Record<string, string> = {
  wie: wieLogo,
  embs: embsLogo,
  cs: csLogo,
  comsoc: comsocLogo,
  pels: pelsLogo,
  srec: srecLogo,
  cis: cisLogo,
  im: imlogo,
};

const societyLinks: Record<string, string> = {
  srec: "/about",
  wie: "https://wie.ieee.org/about/",
  embs: "https://www.embs.org/about/",
  cs: "https://www.computer.org/about/",
  comsoc: "https://www.comsoc.org/about/",
  pels: "https://www.ieee-pels.org/about/",
  im: "https://ieee-ims.org/about/about-ims",
  cis: "https://cis.ieee.org/about/",
};

// Extensive icon/color mapping based on index or type
const designTokens = [
  { icon: Cpu, color: "from-blue-500 to-indigo-600", bg: "bg-slate-100 text-slate-900" },
  { icon: HeartPulse, color: "from-rose-500 to-pink-600", bg: "bg-rose-50 text-rose-600" },
  { icon: Radio, color: "from-amber-400 to-orange-500", bg: "bg-orange-50 text-orange-600" },
  { icon: Gauge, color: "from-emerald-400 to-teal-500", bg: "bg-emerald-50 text-emerald-600" },
  { icon: Network, color: "from-cyan-400 to-blue-500", bg: "bg-slate-100 text-slate-500" },
  { icon: Target, color: "from-purple-500 to-violet-600", bg: "bg-purple-50 text-purple-600" },
  { icon: Layers, color: "from-fuchsia-400 to-pink-500", bg: "bg-fuchsia-50 text-fuchsia-600" },
  { icon: Activity, color: "from-lime-400 to-green-500", bg: "bg-lime-50 text-lime-600" },
];

const getSlugForSociety = (name: string, id: number) => {
  const n = name.toLowerCase();
  if (n.includes("srec")) return "srec";
  if (/\bwie\b/.test(n) || n.includes("women")) return "wie";
  if (/\bembs\b/.test(n) || n.includes("medicine")) return "embs";
  if (/\bcs\b/.test(n) || n.includes("computer")) return "cs";
  if (/\bcomsoc\b/.test(n) || n.includes("communication")) return "comsoc";
  if (/\bpels\b/.test(n) || n.includes("power")) return "pels";
  if (/\bim\b/.test(n) || n.includes("instrumentation")) return "im";
  if (/\bcis\b/.test(n) || n.includes("computational")) return "cis";
  return id.toString();
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const SocietiesSection = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { data: societies = [], isLoading } = useQuery({
    queryKey: ["societies"],
    queryFn: async () => {
      const { data } = await supabase.from("societies").select("*").order("id", { ascending: true });
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-slate-50 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-[#00629b] opacity-50" />
      </section>
    );
  }

  return (
    <section id="societies" className="py-16 md:py-20 relative overflow-hidden bg-slate-50/50 border-t border-slate-100/85">
      
      {/* Light mode background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-blue-50 to-transparent blur-3xl pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-emerald-50 to-transparent blur-3xl pointer-events-none rounded-full -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-550 font-bold text-xs tracking-widest uppercase mb-4 border border-cyan-100/80 shadow-sm">
            <Layers size={14} className="text-blue-500" />
            <span>Technical Chapters</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
            Our <span className="text-slate-900 font-serif font-medium">Societies</span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl font-light">
            Explore our diverse student chapters dedicated to pushing the boundaries of technology, innovation, and specific engineering disciplines.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {societies.map((s: any, i: number) => {
            const token = designTokens[i % designTokens.length];
            const Icon = token.icon;
            const isHovered = hoveredIdx === i;
            const linkSlug = getSlugForSociety(s.name, s.id);
            const logo = logoMapping[linkSlug];
            const externalUrl = societyLinks[linkSlug] || "https://www.ieee.org/";
            
            return (
              <motion.a
                variants={cardVariants}
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                key={s.id || s.name}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative group rounded-3xl overflow-hidden cursor-pointer bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1.5 transition-all duration-500 block"
              >
                {/* Animated gradient border effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${token.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                <div className="absolute inset-0 border border-slate-200/40 group-hover:border-transparent transition-colors duration-500 rounded-3xl pointer-events-none z-10" />
                
                <div className="relative h-full p-6 md:p-8 flex flex-col items-center text-center z-10">
                  
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ease-out z-10 relative overflow-hidden ${isHovered ? 'shadow-md scale-110 -rotate-3 border border-slate-200/30 bg-white' : 'bg-slate-50 border border-slate-100'}`}>
                    {logo ? (
                      <img src={logo} alt={`${s.name} logo`} className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${isHovered ? `bg-gradient-to-br ${token.color} text-slate-900` : 'text-slate-500'}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-serif font-extrabold text-xl text-slate-800 mb-3 tracking-tight z-10 relative">
                    {s.name}
                  </h3>
                  
                  {s.description ? (
                    <p className={`line-clamp-3 text-sm transition-colors duration-300 z-10 relative ${isHovered ? 'text-slate-600 font-normal' : 'text-slate-400 font-light'}`}>
                      {s.description}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400 italic z-10 relative">Exploring innovations pushing boundaries.</p>
                  )}
                  
                  {/* Faux button effect on hover */}
                  <div className={`mt-6 w-full pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-sm font-semibold transition-all duration-500 z-10 relative ${isHovered ? 'text-blue-650 opacity-100 translate-y-0' : 'text-slate-400 opacity-0 translate-y-1.5'}`}>
                    <span>Learn More</span> <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  
                </div>
              </motion.a>
            );
          })}
        </motion.div>
        
      </div>
    </section>
  );
};

export default SocietiesSection;
