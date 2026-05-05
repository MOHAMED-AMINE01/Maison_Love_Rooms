import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Sparkles, Heart, Wine, Clock, Wifi, ArrowRight, Star } from 'lucide-react';

const SERVICES = [
   {
      id: "confidentiality",
      title: "Confidentialité Absolue",
      category: "Sécurité",
      description: "Accès autonome par code unique et discrétion totale garantie pour une intimité préservée.",
      image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1200&auto=format&fit=crop",
      icon: ShieldCheck
   },
   {
      id: "purity",
      title: "Propreté Palace",
      category: "Hygiène",
      description: "Protocole de désinfection de pointe et linge de maison de qualité hôtelière supérieure.",
      image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200&auto=format&fit=crop",
      icon: Sparkles
   },
   {
      id: "romance",
      title: "Mises en Scène",
      category: "Expérience",
      description: "Pétales de soie, ambiances olfactives et jeux de lumières sur mesure pour vos moments d'exception.",
      image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1200&auto=format&fit=crop",
      icon: Heart
   },
   {
      id: "gastronomy",
      title: "Conciergerie Fine",
      category: "Catering",
      description: "Une sélection de vins d'exception et de coffrets gourmands livrés avec le plus grand soin.",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop",
      icon: Wine
   },
   {
      id: "time",
      title: "Disponibilité 24/7",
      category: "Service",
      description: "Une assistance personnalisée pour répondre à tous vos besoins, tout au long de votre séjour.",
      image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200&auto=format&fit=crop",
      icon: Clock
   }
];

export default function Services() {
   const [activeId, setActiveId] = useState(SERVICES[0].id);

   return (
      <section id="services" className="py-20 md:py-32 bg-[#FAF9F6] text-noir overflow-hidden border-y border-noir/5">
         <div className="container-wide px-4 md:px-8">

            {/* Header Area */}
            <div className="flex flex-col lg:flex-row justify-between items-center mb-20 md:mb-28 gap-12 text-center lg:text-left">
               <div className="space-y-6">

                  <h2 className="text-5xl md:text-[6.5vw] font-serif leading-[0.85] tracking-tighter">
                     L'Art de <span className="italic text-gold">Recevoir.</span>
                  </h2>
               </div>
               <p className="max-w-md text-lg text-noir/40 font-serif italic leading-relaxed border-l-0 lg:border-l border-gold/20 pl-0 lg:pl-10">
                  "Chaque service est un rituel, chaque attention une promesse d'exclusivité et de sérénité absolue."
               </p>
            </div>

            {/* Enhanced Interaction Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

               {/* Service List (Left) */}
               <div className="lg:col-span-5 space-y-2">
                  {SERVICES.map((service, index) => (
                     <motion.div
                        key={service.id}
                        onMouseEnter={() => setActiveId(service.id)}
                        className="group relative py-8 border-b border-noir/5 cursor-pointer"
                     >
                        <div className="flex items-center justify-between">
                           <div className="space-y-3">
                              <div className="flex items-center gap-6">
                                 <span className="text-[10px] font-black tracking-widest text-gold/40">0{index + 1}</span>
                                 <span className="text-[9px] uppercase tracking-[0.4em] text-noir/30 group-hover:text-gold transition-colors font-black">
                                    {service.category}
                                 </span>
                              </div>
                              <h3 className={`text-3xl md:text-5xl font-serif transition-all duration-500 ${activeId === service.id ? 'text-gold translate-x-4' : 'text-noir/80 group-hover:text-noir'}`}>
                                 {service.title}
                              </h3>
                           </div>

                        </div>

                        {/* Mobile view accordion */}
                        <motion.div
                           initial={false}
                           animate={{ height: activeId === service.id ? 'auto' : 0, opacity: activeId === service.id ? 1 : 0 }}
                           className="lg:hidden overflow-hidden"
                        >
                           <div className="pt-8 pb-4 space-y-6">
                              <img src={service.image} className="w-full aspect-[16/10] object-cover rounded-[2rem] shadow-xl" alt={service.title} />
                              <p className="text-noir/60 font-serif italic text-base leading-relaxed">
                                 {service.description}
                              </p>
                           </div>
                        </motion.div>
                     </motion.div>
                  ))}
               </div>

               {/* Large Cinematic Preview (Right - Desktop Only) */}
               <div className="hidden lg:block lg:col-span-7 relative aspect-[16/11] rounded-[3.5rem] md:rounded-[4.5rem] overflow-hidden shadow-3xl bg-white border border-noir/5">
                  <AnimatePresence mode="wait">
                     <motion.div
                        key={activeId}
                        initial={{ opacity: 0, scale: 1.1, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: -20 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                     >
                        <img
                           src={SERVICES.find(s => s.id === activeId)?.image}
                           className="w-full h-full object-cover brightness-[0.95]"
                           alt="Service Preview"
                        />
                        {/* Luxury Vignette Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-noir/40 via-transparent to-transparent opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent opacity-40" />


                     </motion.div>
                  </AnimatePresence>

               </div>

            </div>

         </div>
      </section>
   );
}

