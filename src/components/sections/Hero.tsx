import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <section id="hero" className="relative min-h-[100svh] bg-[#121212] flex items-center py-34 lg:pb-0 lg:pt-15 overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-noir/20 to-transparent z-0" />

      <div className="container-wide relative z-10 px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left Column: Text Content */}
          <div className="flex flex-col items-start space-y-10 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className="space-y-8"
            >


              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] tracking-tight text-white font-serif max-w-xl">
                L'Émotion <br />
                <span className="italic text-white/40">en Héritage.</span>
              </h1>

              <p className="max-w-md text-lg md:text-xl font-light text-white/30 leading-relaxed font-sans">
                Une parenthèse suspendue au cœur de Paris. Redécouvrez la volupté dans nos écrins de prestige, pensés pour l'inoubliable.
              </p>
            </motion.div>

            {/* Pill Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex flex-col gap-4 w-full sm:w-auto"
            >
              <a
                href="#suites"
                className="group flex items-center justify-between gap-8 px-10 py-5 rounded-full border border-gold/40 bg-gold/5 text-gold hover:bg-gold hover:text-noir transition-all duration-500"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Découvrir nos suites</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#booking"
                className="group flex items-center justify-between gap-8 px-10 py-5 rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white hover:text-noir transition-all duration-500"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Vérifier les disponibilités</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
          {/* Right Column: Organic Image Composition */}
          <div className="relative h-[450px] md:h-[550px] lg:h-[700px] xl:h-[650px] order-1 lg:order-2 flex items-center justify-center mb-12 lg:mb-0">

            {/* Doodles (SVG Scribbles) - Hidden on mobile to keep it clean */}
            <div className="absolute inset-0 pointer-events-none z-20 hidden md:block">
              {/* Rays doodle (top right of main image) */}
              <motion.svg
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1 }}
                className="absolute top-0 right-10 w-24 h-24 text-white" viewBox="0 0 100 100"
              >
                <path d="M50 10 L50 30 M80 20 L70 35 M90 50 L70 50 M80 80 L70 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </motion.svg>

              {/* Rays doodle (bottom of middle image) */}
              <motion.svg
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-1/4 left-1/4 w-16 h-16 text-white" viewBox="0 0 100 100"
              >
                <path d="M10 50 L30 50 M20 20 L35 35 M50 10 L50 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </motion.svg>

              {/* Swirl doodle (bottom left) */}
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 2, delay: 1.5 }}
                className="absolute bottom-10 left-0 w-32 h-32 text-white" viewBox="0 0 100 100"
              >
                <path d="M20,80 Q40,40 60,80 T90,20 Q10,10 20,80" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </motion.svg>
            </div>

            {/* Main Arch Image (Right) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className="absolute right-0 w-[75%] md:w-[65%] h-full rounded-t-[8rem] md:rounded-t-[10rem] rounded-b-[1.5rem] md:rounded-b-[2rem] overflow-hidden border-[8px] md:border-[10px] border-white/5 shadow-2xl z-10"
            >
              <img
                src="/IMG_6701.jpeg"
                className="w-full h-full object-cover"
                alt="Main view"
              />
            </motion.div>

            {/* Secondary Organic Image (Top Left of main) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -30, y: -30 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              className="absolute top-8 md:top-10 left-4 md:left-10 w-[50%] md:w-[45%] h-[50%] md:h-[55%] overflow-hidden z-20"
              style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
            >
              <div className="absolute inset-0 border-[4px] md:border-[6px] border-white/10 rounded-inherit pointer-events-none" />
              <img
                src="/IMG_6409.jpeg"
                className="w-full h-full object-cover scale-110"
                alt="Room detail"
              />
            </motion.div>

            {/* Third Organic Image (Bottom Left of main) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -30, y: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
              className="absolute bottom-8 md:bottom-10 left-[10%] md:left-[15%] w-[45%] md:w-[40%] h-[35%] md:h-[40%] overflow-hidden z-20 shadow-xl"
              style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 70%" }}
            >
              <div className="absolute inset-0 border-[4px] md:border-[6px] border-white/10 rounded-inherit pointer-events-none" />
              <img
                src="/IMG_6309.jpeg"
                className="w-full h-full object-cover"
                alt="Bathroom detail"
              />
            </motion.div>

            {/* Doodle Cross / Sparkle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-20 right-1/4 z-30 text-white/40 hidden md:block"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L12 22M2 12L22 12" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>


    </section>
  );
}
