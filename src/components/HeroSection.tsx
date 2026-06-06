import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import img1 from "@/assets/gallery/Display/PXL_20250917_055007090.jpg";

const images = [img1];

const HeroSection = () => {
   const [currentIndex, setCurrentIndex] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentIndex((prev) => (prev + 1));
      }, 6000); // 6 seconds per slide
      return () => clearInterval(interval);
   }, []);

   return (
      <section id="home" className="relative w-full h-[100svh] flex flex-col justify-center overflow-hidden bg-black selection:bg-white selection:text-black">

         {/* Background Image Carousel Layer with Butter-Smooth Fade */}
         <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
            <AnimatePresence mode="popLayout">
               <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 1.5 } }}
                  transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${images[currentIndex % images.length]})` }}
               />
            </AnimatePresence>
            {/* Subtle overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-10 pointer-events-none"></div>
         </div>

         {/* Text on top Layer with Orchestrated Cascading Reveal */}
         <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center h-full pt-16">

            <motion.div
               initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
               animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
               transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
               className="mb-8 flex space-x-4 items-center justify-center"
            >
               <span className="text-white/80 text-[10px] md:text-sm uppercase tracking-[0.5em] md:tracking-[0.8em] font-medium">SREC Student Branch</span>
            </motion.div>

            <div className="overflow-hidden mb-6">
               <motion.h1
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 1.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl md:text-8xl lg:text-[10rem] font-serif text-white tracking-tight leading-tight md:leading-[0.9]"
               >
                  Global <br className="md:hidden" /> Excellence<motion.span
                     initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
                     className="italic text-white/50"
                  >.</motion.span>
               </motion.h1>
            </div>

            <motion.div
               initial={{ scaleX: 0, opacity: 0 }}
               animate={{ scaleX: 1, opacity: 1 }}
               transition={{ duration: 2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
               className="h-[1px] w-24 md:w-40 bg-white/40 my-8 origin-center"
            />

            <div className="overflow-hidden max-w-3xl">
               <motion.p
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 1.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white/80 text-sm md:text-lg lg:text-xl font-light uppercase tracking-[0.1em] md:tracking-[0.2em] leading-relaxed md:leading-loose"
               >
                  Empowering minds and shaping the future through uncompromising technology research.
               </motion.p>
            </div>



            {/* Slide Indicators */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
               className="absolute bottom-12 md:bottom-16 flex items-center justify-center space-x-4"
            >
            </motion.div>
         </div>

      </section>
   );
};

export default HeroSection;

