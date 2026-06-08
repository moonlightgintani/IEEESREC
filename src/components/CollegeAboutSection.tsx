import { useState } from "react";
import { BookOpen, Trophy, Target, Building, ChevronRight, Award, Compass, Globe } from "lucide-react";
import srecLogo from "@/assets/srec-logo.png";

const features = [
  { 
    id: "campus", 
    icon: Building, 
    title: "Established Campus", 
    desc: "A lush 45-acre green campus equipped with state-of-the-art infrastructure, massive central library, and high-tech modern laboratories.", 
    stat: "45 Acres",
    color: "from-emerald-400 to-green-600"
  },
  { 
    id: "vision", 
    icon: Target, 
    title: "Visionary Goals", 
    desc: "Committed to producing world-class engineers through quality education, applied research, and industry-oriented curriculum bridging the tech gap.", 
    stat: "Global Standards",
    color: "from-[#00629b] to-blue-600"
  },
  { 
    id: "academic", 
    icon: BookOpen, 
    title: "Academic Excellence", 
    desc: "Offering a wide range of NBA accredited undergraduate and postgraduate programs across advanced engineering disciplines.", 
    stat: "15+ Programs",
    color: "from-purple-500 to-indigo-600"
  },
  { 
    id: "awards", 
    icon: Trophy, 
    title: "Awards & Recognition", 
    desc: "Consistent top-tier ranks nationally for exceptional academic performance, robust placement records, and cutting-edge research grants.", 
    stat: "Top Rankings",
    color: "from-amber-400 to-orange-500"
  },
];

const CollegeAboutSection = () => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>("campus");

  return (
    <section id="college" className="py-12 md:py-16 relative overflow-hidden bg-white">
      
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -skew-x-12 translate-x-32 -z-10" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-100/50 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-xs tracking-widest uppercase mb-4 border border-emerald-100">
              <Building size={14} />
              <span>Our Institution</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Sri Ramakrishna <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Engineering College</span>
            </h2>
          </div>
          <div className="max-w-md text-slate-600 leading-relaxed md:text-right text-lg">
            Established in 1994 by the <span className="font-bold text-slate-800">SNR Sons Charitable Trust</span>. SREC has grown into an eminent institution of international standards, empowering innovators.
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Visual Area - Interactive Showcase */}
          <div className="relative aspect-square md:aspect-video lg:aspect-square bg-white rounded-none md:rounded-none overflow-hidden group shadow-sm hover:shadow-lg border border-slate-100">
            {/* Dynamic Background matching hovered item */}
            <div className="absolute inset-0 bg-white transition-colors duration-700" />
            
            {/* Display large stat or icon based on hover */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 text-slate-900">
              <div className="relative mb-8 transform transition-transform duration-500 group-hover:scale-105">
                <div className="absolute inset-0 bg-slate-100/80 blur-2xl rounded-full" />
                <img src={srecLogo} alt="SREC Emblem" className="h-32 md:h-48 object-contain drop-shadow-sm relative z-10" />
              </div>
              
              <div className="h-24 overflow-hidden relative w-full flex items-center justify-center">
                {features.map((f) => (
                  <div 
                    key={`stat-${f.id}`}
                    className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${hoveredFeature === f.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  >
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${f.color} font-bold tracking-tight text-3xl md:text-4xl filter saturate-150`}>
                      {f.stat}
                    </span>
                    <span className="text-slate-500 uppercase tracking-widest text-sm font-semibold mt-2">
                      {f.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Decorative Overlay Gradients */}
            {features.map((f) => (
              <div 
                key={`bg-${f.id}`} 
                className={`absolute inset-0 bg-gradient-to-br ${f.color} transition-opacity duration-700 ${hoveredFeature === f.id ? 'opacity-10' : 'opacity-0'}`} 
              />
            ))}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          {/* Right Area - Interactive List */}
          <div className="flex flex-col gap-4">
            {features.map((f) => {
              const isHovered = hoveredFeature === f.id;
              return (
                <div 
                  key={f.id}
                  onMouseEnter={() => setHoveredFeature(f.id)}
                  onClick={() => setHoveredFeature(f.id)}
                  className={`p-6 md:p-8 rounded-none border transition-all duration-700 ease-in-out cursor-pointer group flex gap-6 ${isHovered ? 'bg-white shadow-sm hover:shadow-lg border-slate-100 scale-[1.02] transform -translate-y-1' : 'bg-transparent border-slate-200 hover:bg-slate-50'}`}
                >
                  <div className={`w-14 h-14 rounded-none flex items-center justify-center shrink-0 transition-colors duration-500 ${isHovered ? `bg-gradient-to-br ${f.color} text-slate-900 shadow-lg` : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                    <f.icon size={26} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isHovered ? 'text-slate-900' : 'text-slate-700'}`}>
                      {f.title}
                    </h3>
                    <p className={`line-clamp-2 md:line-clamp-none transition-all duration-700 ease-in-out overflow-hidden ${isHovered ? 'text-slate-600 max-h-40 opacity-100' : 'text-slate-500 max-h-0 md:max-h-16 opacity-70 md:opacity-100'}`}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default CollegeAboutSection;
