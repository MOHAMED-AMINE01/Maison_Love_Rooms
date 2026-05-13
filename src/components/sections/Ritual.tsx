import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router-dom";

export default function Ritual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      id="ritual"
      ref={containerRef}
      className="relative bg-[#0A0A0A] py-20 md:py-56 overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[#121212] opacity-[0.05] mix-blend-overlay" />
        <div className="absolute top-1/4 -left-20 w-64 h-64 md:w-96 md:h-96 bg-gold/10 blur-[80px] md:blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 md:w-96 md:h-96 bg-[#E91E63]/5 blur-[80px] md:blur-[120px] rounded-full" />
      </div>

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">

          {/* Top Side (Mobile) / Left Side (Desktop): Editorial Content */}
          <div className="lg:col-span-6 lg:pl-12 space-y-8 md:space-y-12 text-center lg:text-left order-1">
            <motion.div style={{ opacity }}>

              <h2 className="text-4xl md:text-6xl font-serif text-white leading-[1.2] md:leading-[1.1] tracking-tight">
                Le Concept <br />
                <span className="bg-gradient-to-r from-gold via-gold/80 to-gold bg-clip-text text-transparent italic font-light">Maison Love Rooms</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8 max-w-lg mx-auto lg:mx-0"
            >
              <p className="text-white/60 text-base md:text-lg leading-relaxed font-light">
                Plus qu'une suite, un sanctuaire dédié à l'intimité. Nous avons conçu chaque détail pour que votre séjour soit une parenthèse hors du temps, loin des regards indiscrets.
              </p>

              {/* Feature Grid - Improved Mobile Layout */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-8 pt-4 md:pt-8 border-t border-white/5">
                <div className="space-y-1 md:space-y-2 group">
                  <span className="text-2xl md:text-3xl font-serif text-gold group-hover:scale-110 transition-transform block">100%</span>
                  <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold">Privatif & Sécurisé</p>
                </div>
                <div className="space-y-1 md:space-y-2 group">
                  <span className="text-2xl md:text-3xl font-serif text-gold group-hover:scale-110 transition-transform block">24/7</span>
                  <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold">Conciergerie Dédiée</p>
                </div>
                <div className="space-y-1 md:space-y-2 group">
                  <span className="text-2xl md:text-3xl font-serif text-gold group-hover:scale-110 transition-transform block">0</span>
                  <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold">Vis-à-vis total</p>
                </div>
                <div className="space-y-1 md:space-y-2 group">
                  <span className="text-2xl md:text-3xl font-serif text-gold group-hover:scale-110 transition-transform block">Paris</span>
                  <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold">Cœur de la capitale</p>
                </div>
              </div>

              <Link
                to="/experience"
                className="group flex items-center gap-4 md:gap-6 text-gold pt-6 md:pt-8 mx-auto lg:mx-0"
              >
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold">Découvrir l'expérience</span>
                <div className="w-8 md:w-12 h-px bg-gold transition-all duration-500 group-hover:w-20" />
              </Link>
            </motion.div>
          </div>

          {/* Right Side: Dual Circles Mosaic (Aligned more horizontally) */}
          <div className="lg:col-span-6 relative h-[400px] md:h-[600px] order-2 mt-12 lg:mt-0 flex items-center justify-center">
            {/* Circle 1 (Primary) */}
            <motion.div
              style={{ y: y1 }}
              className="absolute left-0 md:left-4 w-[55%] md:w-[50%] aspect-square rounded-full overflow-hidden border border-gold/20 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-20 group -translate-y-6 md:-translate-y-12"
            >
              <img
                src="/IMG_6309.jpeg"
                alt="L'Évasion"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-noir/20 group-hover:bg-transparent transition-colors duration-700" />
              {/* Internal Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent opacity-50" />
            </motion.div>

            {/* Circle 2 (Secondary) */}
            <motion.div
              style={{ y: y2 }}
              className="absolute right-0 md:right-4 w-[55%] md:w-[50%] aspect-square rounded-full overflow-hidden border border-gold/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-30 group translate-y-6 md:translate-y-12"
            >
              <img
                src="/IMG_6409.jpeg"
                alt="Le Secret"
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
              />
              {/* Internal Glow */}
              <div className="absolute inset-0 bg-gradient-to-bl from-gold/5 to-transparent opacity-30" />
            </motion.div>


          </div>

        </div>
      </div>

    </section>
  );
}
