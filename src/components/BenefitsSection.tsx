import { Code, Users, Rocket, Target, Cpu, Globe, ArrowRight } from "lucide-react";

const benefits = [
  {
    title: "Global Network",
    desc: "Connect with over 400,000+ technical professionals worldwide.",
    icon: Globe,
    colSpan: "md:col-span-2 lg:col-span-2",
    bg: "bg-sky-500",
    gradient: "from-sky-400 to-blue-500",
  },
  {
    title: "Leadership",
    desc: "Build essential skills by leading massive student initiatives.",
    icon: Target,
    colSpan: "md:col-span-1 lg:col-span-1",
    bg: "bg-slate-1000",
    gradient: "from-cyan-300 to-cyan-500",
  },
  {
    title: "Technical Excellence",
    desc: "Access exclusive workshops, hackathons, and IEEE Xtreme.",
    icon: Code,
    colSpan: "md:col-span-1 lg:col-span-1",
    bg: "bg-teal-400",
    gradient: "from-teal-300 to-cyan-400",
  },
  {
    title: "Research Opportunities",
    desc: "Collaborate on cutting-edge publications and impactful projects.",
    icon: Rocket,
    colSpan: "md:col-span-2 lg:col-span-2",
    bg: "bg-blue-400",
    gradient: "from-blue-400 to-sky-300",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-10 md:py-12 bg-white relative overflow-hidden">
      {/* Decorative Backgrounds */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-slate-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-50/50 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-400 font-semibold text-xs tracking-widest uppercase mb-4 border border-cyan-100 shadow-sm">
              <Cpu size={14} className="animate-pulse" />
              <span>Why Join Us</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 mb-4 leading-tight">
              Unlock Your <br/>
              <span className="text-slate-900 font-serif font-medium">True Potential</span>
            </h2>
            <p className="text-slate-600 text-lg md:text-xl mb-6 leading-relaxed max-w-lg">
              IEEE SREC isn't just a student branch; it's a launchpad. We meticulously equip you with the technical prowess, leadership acumen, and global network required to dominate the tech landscape of tomorrow.
            </p>
            <a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center gap-4 px-8 py-5 rounded-none bg-slate-900 hover:bg-[#0b3b8f] text-white font-black uppercase tracking-[0.1em] transition-all duration-500 overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(11,59,143,0.3)] hover:-translate-y-1 border border-slate-800 hover:border-[#0b3b8f]">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
               <span className="relative z-10 flex items-center pr-4 border-r border-white/20">Become a Member</span>
               <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
            </a>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {benefits.map((b) => (
                <div 
                  key={b.title} 
                  className={`group relative overflow-hidden rounded-none p-8 md:p-10 border border-slate-100 bg-white flex flex-col justify-end min-h-[280px] transition-all duration-700 ease-in-out shadow-sm hover:shadow-lg ${b.colSpan}`}
                >
                  {/* Dynamic background gradient container */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${b.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-700 -z-10`} />
                  
                  {/* Top corner subtle styling */}
                  <div className={`absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br ${b.gradient} rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none`} />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-12">
                      <div className="w-16 h-16 rounded-[1.25rem] bg-white flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 border border-slate-200 shadow-md relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-tr ${b.gradient} opacity-10`} />
                        <b.icon size={28} className="text-slate-800 group-hover:text-[#0b3b8f] transition-colors duration-500 relative z-10" strokeWidth={2.5} />
                      </div>
                      <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-cyan-200 group-hover:text-cyan-500 transition-colors duration-500">
                        <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="h-[2px] w-8 bg-slate-200 group-hover:w-16 group-hover:bg-cyan-500 transition-all duration-500 mb-6"></div>
                      <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-[#0b3b8f] transition-colors duration-500">{b.title}</h3>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-sm">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
