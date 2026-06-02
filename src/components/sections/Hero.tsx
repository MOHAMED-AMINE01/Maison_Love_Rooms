import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

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
    <section ref={containerRef} id="hero" className="relative min-h-[100svh] bg-[#121212] flex items-center py-34 lg:pb-0 lg:pt-15 overflow-hidden">
      {/* Background Decorative Gradients & Grain */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(188,155,93,0.05),transparent_50%)] z-0" />
      <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-noir/40 to-transparent z-0" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0" style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />

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

              <p className="max-w-md text-lg md:text-xl font-light text-white/40 leading-relaxed font-sans border-l border-white/10 pl-8">
                Une adresse confidentielle au cœur de Paris. Redécouvrez la volupté dans nos chambres de prestige, pensés pour l'inoubliable.
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
                href="/experience"
                className="group flex items-center justify-between gap-8 px-10 py-5 rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white hover:text-noir transition-all duration-500"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Découvrir l'expérience</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* Right Column: Three Homogeneous Circles in Staircase Layout */}
          <div className="relative h-[450px] md:h-[550px] lg:h-[600px] order-1 lg:order-2 flex items-center justify-center mb-12 lg:mb-0 w-full max-w-[500px] mx-auto">

            {/* Background Decorative Rings */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-[80%] aspect-square border border-gold rounded-full" />
              <div className="w-[60%] aspect-square border border-white/20 rounded-full absolute" />
            </div>

            {/* Circle 1: Top Left */}
            <motion.div
              style={{ y: y1 }}
              initial={{ opacity: 0, x: -30, y: -30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute top-0 left-0 w-[55%] aspect-square z-10"
            >
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                <img src="/IMG_6701.jpeg" className="w-full h-full object-cover" alt="View 1" decoding="async" fetchPriority="high" />
              </div>
            </motion.div>

            {/* Circle 2: Middle Right (Offset) */}
            <motion.div
              style={{ y: y2 }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              className="absolute top-1/2 right-0 -translate-y-1/2 w-[55%] aspect-square z-20"
            >
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#121212] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                <img src="/IMG_6406.jpeg" className="w-full h-full object-cover" alt="View 2" decoding="async" />
              </div>
              {/* Subtle Gold Ring on the Middle Circle */}
              <div className="absolute inset-0 rounded-full border border-gold/30 pointer-events-none" />
            </motion.div>

            {/* Circle 3: Bottom Left */}
            <motion.div
              style={{ y: y3 }}
              initial={{ opacity: 0, x: -30, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
              className="absolute bottom-0 left-0 w-[55%] aspect-square z-10"
            >
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                <img src="/IMG_6403.jpeg" className="w-full h-full object-cover" alt="View 3" decoding="async" />
              </div>
            </motion.div>

            {/* Central Decorative Sparkle */}
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 text-gold/40"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 2L12 22M2 12L22 12" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}
