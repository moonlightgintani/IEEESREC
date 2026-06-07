import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import ieeeLogo from "@/assets/ieee-logo.png";
import srecLogo from "@/assets/srec-logo.png";
import snrLogo from "@/assets/snr-trust-logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const MotionLink = motion(Link);

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Societies", href: "/societies" },
  { label: "Activities", href: "/activities" },
  { label: "Team", href: "/Team" },
  { label: "Awards", href: "/awards" },
  { label: "Plans", href: "/annual-plans" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reports", href: "/reports" },
  { label: "Funding", href: "/funding" },
  { label: "Contact", href: "/contact" },
  { label: "Admin", href: "/admin" },
];

const Navbar = () => {
   const [open, setOpen] = useState(false);
   const location = useLocation();
   const isHomePage = location.pathname === "/";
   
   // True if user physically scrolled down
   const [hasScrolled, setHasScrolled] = useState(false);

   useEffect(() => {
     const onScroll = () => {
        setHasScrolled(window.scrollY > 20);
     };
     window.addEventListener("scroll", onScroll);
     onScroll(); // initialize correct state
     return () => window.removeEventListener("scroll", onScroll);
   }, []);

   // The user requested the navbar to be completely white edge-to-edge at all times.
   const isSolidBackground = true;
   
   // Logos hide ONLY when user specifically scrolls down (on any page)
   const hideLogos = hasScrolled;

   return (
     <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-1000 ease-out shadow-2xl">
         
         <div className="w-full flex flex-col items-center justify-center">
            
            {/* Mobile Hamburger Icon (Always visible on mobile left corner) */}
            <div className={`xl:hidden absolute left-4 md:left-10 flex items-center z-[70] transition-all duration-1000 top-1/2 -translate-y-1/2`}>
               <button 
                  onClick={() => setOpen(true)}
                  className="p-2 rounded-xl transition-all shadow-md bg-[#002855] text-white hover:bg-[#001f42] active:scale-95"
               >
                  <Menu size={28} className="md:w-8 md:h-8" />
               </button>
            </div>

            {/* Top Row: Logos with ultra-smooth cinematic hide animation - White Background */}
            <motion.div 
               initial={false}
               animate={{ 
                  height: hideLogos ? 0 : "auto", 
                  opacity: hideLogos ? 0 : 1,
                  scale: hideLogos ? 0.95 : 1
               }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="w-full bg-white origin-top relative z-50 overflow-hidden shadow-md"
            >
               <div className="grid grid-cols-3 items-center w-full px-12 sm:px-16 xl:px-24 py-3 md:py-4 gap-4 md:gap-8">
                  <div className="flex justify-center items-center">
                     <img src={srecLogo} alt="SREC" className="h-20 sm:h-24 md:h-32 lg:h-36 w-auto object-contain flex-shrink-0" />
                  </div>
                  <div className="flex justify-center items-center">
                     <img src={ieeeLogo} alt="IEEE" className="h-20 sm:h-24 md:h-32 lg:h-36 w-auto object-contain flex-shrink-0" />
                  </div>
                  <div className="flex justify-center items-center">
                     <img src={snrLogo} alt="SNR Trust" className="h-20 sm:h-24 md:h-32 lg:h-36 w-auto object-contain flex-shrink-0" />
                  </div>
               </div>
            </motion.div>

            {/* Bottom Row: Desktop Horizontal Nav Links - Blue Background */}
            <div className="hidden xl:flex items-center justify-center gap-x-8 gap-y-2 flex-wrap w-full bg-[#002855] py-4 px-4 transition-all duration-700 shadow-inner">
               {navLinks.map((l, index) => (
                  <MotionLink
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 1.2, delay: 0.2 + (index * 0.05), ease: [0.16, 1, 0.3, 1] }}
                     key={l.label}
                     to={l.href}
                     className="text-white/90 hover:text-white font-bold tracking-[0.3em] text-[11px] uppercase transition-all duration-500 relative group"
                  >
                     {l.label}
                     <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-500 group-hover:w-full bg-white"></span>
                  </MotionLink>
               ))}
               <motion.a
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 1.2, delay: 0.2 + (navLinks.length * 0.05), ease: [0.16, 1, 0.3, 1] }}
                     href="https://vtools.vtools.ieee.org/" target="_blank"
                     className="text-white/90 hover:text-white font-bold tracking-[0.3em] text-[11px] uppercase transition-all duration-500 relative group"
                  >
                     VTOOLS
                     <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-500 group-hover:w-full bg-white"></span>
               </motion.a>
            </div>

         </div>
      </nav>

      {/* Global Transparent Spacer for Subpages to prevent content clipping under the tall fixed navbar */}
      {!isHomePage && (
         <div className="h-[140px] sm:h-[160px] md:h-[200px] lg:h-[240px] w-full bg-transparent pointer-events-none" aria-hidden="true"></div>
      )}

      {/* Mobile Sidebar/Dropdown Menu */}
      <AnimatePresence>
         {open && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
               animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
               exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
               transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
               className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl w-full h-screen overflow-y-auto"
            >
               <div className="absolute top-8 right-8">
                  <button onClick={() => setOpen(false)} className="p-3 bg-black/5 rounded-full text-black/50 hover:text-black hover:bg-black/10 transition-all">
                     <X size={32} />
                  </button>
               </div>
               <div className="flex flex-col items-center justify-center min-h-screen py-20 space-y-6">
                  {navLinks.map((l, idx) => (
                     <MotionLink
                        key={l.label}
                        to={l.href}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 + (idx * 0.05) }}
                        onClick={() => setOpen(false)}
                        className="text-black/80 text-xl tracking-[0.3em] uppercase font-medium hover:text-blue-600 transition-colors"
                     >
                        {l.label}
                     </MotionLink>
                  ))}
                  <motion.a
                     href="https://vtools.vtools.ieee.org/" target="_blank"
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: 0.1 + (navLinks.length * 0.05) }}
                     onClick={() => setOpen(false)}
                     className="text-black/80 text-xl tracking-[0.3em] uppercase font-medium hover:text-blue-600 transition-colors"
                  >
                     VTOOLS
                  </motion.a>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Floating Back to Home Button globally visible across all pages except landing page */}
      {!isHomePage && (
        <Link 
          to="/" 
          className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[40] bg-black text-white p-4 rounded-full shadow-2xl flex flex-col items-center justify-center gap-1 hover:bg-slate-900 transition-all duration-500 group w-12 h-12 md:w-14 md:h-14 border border-white/20"
          title="Back to Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 transition-transform duration-500">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
        </Link>
      )}
     </>
   )
};

export default Navbar;