import React from 'react';
import { motion } from 'motion/react';
import { Wine, Heart, Sparkles, Star, Moon, Coffee, Music, Gift, ArrowRight } from 'lucide-react';

const SERVICES = [
   {
      category: "Gastronomie",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2670&auto=format&fit=crop",
      items: [
         { name: "Plateau Dégustation", price: "65€", description: "Une sélection de produits du terroir et mignardises sucrées." },
         { name: "Petit-Déjeuner Royal", price: "30€", description: "Viennoiseries fraîches, fruits de saison et boissons chaudes servies en suite." },
         { name: "Champagne Louis Roederer", price: "95€", description: "Bouteille de 75cl servie sur lit de glace à votre arrivée." }
      ]
   },
   {
      category: "Bien-Être",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2670&auto=format&fit=crop",
      items: [
         { name: "Massage Duo (1h)", price: "180€", description: "Soin relaxant effectué par deux praticiennes certifiées.", duration: "60 min" },
         { name: "Rituel Bain Sensoriel", price: "45€", description: "Sels de la Mer Morte, huiles essentielles et bougies parfumées." },
         { name: "Kit Cocooning Luxury", price: "75€", description: "Peignoirs en soie (location) et coffret de soins signature." }
      ]
   },
   {
      category: "Scénographie",
      image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=2670&auto=format&fit=crop",
      items: [
         { name: "Parcours de Roses", price: "55€", description: "Chemin de pétales fraîches de l'entrée jusqu'au lit." },
         { name: "Ambiance Chandelles", price: "40€", description: "Scénographie lumineuse avec 50 bougies LED haute fidélité." },
         { name: "Pack 'Demande Unique'", price: "150€", description: "Ballons hélium, bouquet de 20 roses rouges et message personnalisé." }
      ]
   }
];

export default function Prestations() {
   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="bg-[#FAF9F6] min-h-screen overflow-x-hidden"
      >
         {/* Dark Editorial Header */}
         <section className="relative pt-64 pb-32 md:pb-48 px-4 md:px-10 bg-noir overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
               <motion.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 0.15, scale: 1 }}
                  transition={{ duration: 2 }}
                  className="absolute inset-0"
               >
                  <img
                     src="https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?q=80&w=2645&auto=format&fit=crop"
                     className="w-full h-full object-cover"
                     alt="Atmosphere"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-noir via-transparent to-noir" />
               </motion.div>
               <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="container-wide relative z-10">
               <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-16 md:gap-32">
                  <div className="max-w-5xl">
                     <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-12"
                     >

                        <h1 className="text-7xl md:text-[12vw] font-serif leading-[0.8] tracking-tighter text-white">
                           L'Art de <br />
                           <span className="italic text-gold-light opacity-90">Sublimer.</span>
                        </h1>
                     </motion.div>
                  </div>
                  <motion.div
                     initial={{ opacity: 0, x: 30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 1.2, delay: 0.4 }}
                     className="max-w-md pb-12"
                  >
                     <p className="text-2xl md:text-3xl italic font-light leading-relaxed text-white/40 font-serif border-l border-gold/20 pl-8 md:pl-12">
                        "L'excellence n'est pas un acte, <br />
                        c'est une <span className="text-white">habitude</span>."
                     </p>

                  </motion.div>
               </div>
            </div>


         </section>

         {/* Transition Overlay */}
         <div className="h-32 bg-gradient-to-b from-noir to-[#FAF9F6]" />

         <div className="container-wide px-4 md:px-10 space-y-32 md:space-y-64 pb-32 md:pb-64">
            {SERVICES.map((section, sIdx) => (
               <motion.section
                  key={section.category}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start ${sIdx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
               >
                  {/* Category Image (Left/Right) */}
                  <div className={`lg:col-span-6 relative group ${sIdx % 2 === 1 ? 'lg:order-2' : ''}`}>
                     <div className="aspect-[4/5] rounded-[3rem] md:rounded-[4rem] overflow-hidden bg-[#FAF9F6] shadow-2xl relative isolate">
                        <motion.img
                           whileHover={{ scale: 1.05 }}
                           transition={{ duration: 2 }}
                           src={section.image}
                           className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-1000"
                           alt={section.category}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-noir/40 via-transparent to-transparent opacity-60" />
                     </div>

                  </div>

                  {/* Service List (Right/Left) */}
                  <div className={`lg:col-span-6 space-y-12 md:space-y-20 py-8 ${sIdx % 2 === 1 ? 'lg:order-1' : ''}`}>
                     <div className="space-y-6">
                        <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black italic">Chapitre 0{sIdx + 1}</span>
                        <h2 className="text-5xl md:text-8xl font-serif text-noir italic leading-none">{section.category}</h2>
                     </div>

                     <div className="space-y-12 md:space-y-16">
                        {section.items.map((item, iIdx) => (
                           <div key={item.name} className="group cursor-default">
                              <div className="flex justify-between items-baseline mb-4">
                                 <h3 className="text-2xl md:text-3xl font-serif text-noir group-hover:text-gold transition-colors duration-500 italic">{item.name}</h3>
                                 <div className="flex-1 mx-8 border-b border-noir/5 border-dashed" />
                                 <span className="text-xl font-serif text-gold">{item.price}</span>
                              </div>
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                 <p className="text-lg font-serif italic text-noir/40 max-w-sm leading-relaxed">
                                    {item.description}
                                 </p>
                                 {item.duration && (
                                    <span className="text-[9px] uppercase tracking-[0.4em] text-gold font-black bg-gold/5 px-3 py-1 rounded-full">
                                       {item.duration}
                                    </span>
                                 )}
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* CTA for section */}
                     <div className="pt-8">
                        <button className="group flex items-center gap-6 text-[10px] uppercase tracking-[0.4em] font-black text-noir hover:text-gold transition-colors">
                           Sélectionner ces prestations <ArrowRight size={18} className="group-hover:translate-x-4 transition-transform" />
                        </button>
                     </div>
                  </div>
               </motion.section>
            ))}

            {/* Custom Concierge Finale */}
            <motion.section
               initial={{ opacity: 0, scale: 0.98 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="bg-white rounded-[4rem] p-16 md:p-32 shadow-3xl border border-noir/[0.03] text-center space-y-12 relative overflow-hidden"
            >
               {/* Background Decor */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

               <div className="max-w-3xl mx-auto space-y-10 relative z-10">


                  <h2 className="text-5xl md:text-8xl font-serif text-noir italic leading-[0.85] tracking-tighter">
                     Une demande <br />
                     <span className="text-gold not-italic">Hors Catalogue ?</span>
                  </h2>

                  <p className="text-xl md:text-2xl text-noir/40 font-serif italic leading-relaxed">
                     Anniversaires, demandes en mariage ou scénographies sur-mesure... <br className="hidden md:block" />
                     Confiez-nous vos rêves, nous les orchestrons en toute discrétion.
                  </p>

                  <button className="bg-noir text-white px-12 py-6 rounded-full text-[10px] uppercase tracking-[0.5em] font-black hover:bg-gold transition-all duration-500 shadow-2xl hover:scale-105">
                     Contacter le Majordome
                  </button>
               </div>
            </motion.section>
         </div>
      </motion.div>
   );
}

