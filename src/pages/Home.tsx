import React from 'react';
import Hero from '../components/sections/Hero';
import Ritual from '../components/sections/Ritual';
import Suites from '../components/sections/Suites';
import Services from '../components/sections/Services';
import Boutique from '../components/sections/Boutique';
import FAQ from '../components/sections/FAQ';
import Atmosphere from '../components/sections/Atmosphere';
import { motion } from 'motion/react';
import { ShieldCheck, Clock, EyeOff, Sparkles, Star } from 'lucide-react';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative"
    >
      <Hero />

      <div className="bg-page">
        <Ritual />

        <Suites />

        <Atmosphere />

        <Services />

        {/* Editorial Section - The Manifesto */}
        <section id="manifeste" className="py-24 md:py-48 bg-[#FAF9F6] mx-5 relative overflow-hidden">
          <div className="container-wide relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">

              {/* Left Column: Atmospheric Image with Premium Frame */}
              <div className="lg:col-span-5 relative">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="relative group"
                >
                  <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.2)] relative">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 2 }}
                      src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2670&auto=format&fit=crop"
                      className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                      alt="L'Art de vivre Maison Love Rooms"
                    />
                    <div className="absolute inset-0 bg-gold/5 mix-blend-overlay" />
                    <div className="absolute inset-0 border-[1px] border-white/20 m-6 pointer-events-none" />
                  </div>


                </motion.div>

                {/* Background Shape */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-gold/5 rounded-full blur-3xl -z-10" />
              </div>

              {/* Right Column: Manifesto Text with Editorial Layout */}
              <div className="lg:col-span-7 space-y-16 md:space-y-24">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                  className="space-y-12"
                >
                  <div className="space-y-8 text-center md:text-left">

                    <h3 className="text-4xl md:text-[6vw] lg:text-[7vw] font-serif italic text-noir leading-[0.85] tracking-tighter">
                      "Le luxe est <br className="hidden md:block" />
                      <span className="text-gold not-italic">la discrétion</span> <br className="hidden md:block" />
                      de l'esprit."
                    </h3>
                  </div>

                  <div className="flex flex-col md:flex-row gap-12 items-start">
                    <p className="text-xl md:text-2xl text-noir/40 font-serif italic leading-relaxed max-w-2xl border-l border-gold/20 pl-8 md:pl-12">
                      Chez Maison Love Rooms, nous cultivons une élégance sans artifice, où le silence et l'intimité sont les véritables joyaux de nos suites parisiennes.
                    </p>
                  </div>
                </motion.div>



              </div>
            </div>
          </div>

          {/* Large Floating Decorative Text (Parallax Effect) */}
          <motion.div
            style={{ x: '-10%' }}
            whileInView={{ x: '10%' }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-1/2 left-0 w-full text-[15vw] lg:text-[25vw] font-serif italic text-gold/[0.04] pointer-events-none select-none -translate-y-1/2 whitespace-nowrap"
          >
            Maison Love Rooms
          </motion.div>
        </section>

        <Boutique />
        <FAQ />
      </div>
    </motion.div>
  );
}
