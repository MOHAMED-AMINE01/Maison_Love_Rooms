import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { SUITES } from '../constants';
import {
   Plus, Minus,
   Waves, Music, Utensils, Bath, Wind, Coffee,
   ShieldCheck, Sparkles
} from 'lucide-react';

export default function SuiteDetail() {
   const { id } = useParams();
   const navigate = useNavigate();
   const suite = SUITES.find(s => s.id === id);
   const [nights, setNights] = useState(1);

   if (!suite) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="text-center">
               <h1 className="text-3xl font-serif mb-6 text-white">Suite introuvable</h1>
               <Link to="/" className="text-gold font-bold uppercase tracking-widest text-xs">Retour à l'accueil</Link>
            </div>
         </div>
      );
   }

   const inclusions = [
      { icon: Waves, title: "Balnéo Privatif", desc: "Eau à 38°C dès votre arrivée" },
      { icon: Music, title: "Ambiance", desc: "Lumières et son Bluetooth" },
      { icon: Utensils, title: "Accueil", desc: "Champagne et rafraîchissements" },
      { icon: Wind, title: "Linge de lit", desc: "Qualité hôtelière premium" },
      { icon: Coffee, title: "Pause Café", desc: "Machine Nespresso à disposition" },
      { icon: Bath, title: "Hygiène", desc: "Produits de soin inclus" }
   ];

   const gallery = [
      suite.image,
      "https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=2645&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2670&auto=format&fit=crop"
   ];

   return (
      <div className="bg-[#050505] min-h-screen selection:bg-amber-500/30 text-white overflow-x-hidden">

         <main>

            {/* Full-Height Hero Section */}
            <section className="relative h-[80vh] md:h-screen overflow-hidden">
               <motion.img
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 2 }}
                  src={gallery[0]}
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
                  alt={suite.name}
               />
               <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]" />

               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-8">
                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5, duration: 1 }}
                     className="space-y-6 md:space-y-12 max-w-5xl"
                  >
                     <div className="flex items-center justify-center gap-3 md:gap-6 text-amber-500">
                        <div className="w-8 md:w-16 h-px bg-amber-500" />
                        <span className="text-[8px] md:text-[10px] uppercase tracking-[0.5em] md:tracking-[0.8em] font-black">Midnight Sanctuary</span>
                        <div className="w-8 md:w-16 h-px bg-amber-500" />
                     </div>
                     <h1 className="text-5xl md:text-[9vw] font-serif leading-[0.9] tracking-tighter italic">
                        {suite.name}
                     </h1>
                     <p className="text-lg md:text-3xl text-white/60 font-serif italic max-w-2xl mx-auto pt-4 md:pt-8">
                        "{suite.description}"
                     </p>
                  </motion.div>
               </div>

               {/* Scroll Indicator */}
               <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 md:gap-4 text-white/30">
                  <span className="text-[7px] md:text-[8px] uppercase tracking-[0.5em] font-black">Découvrir l'écrin</span>
                  <div className="w-px h-8 md:h-12 bg-gradient-to-b from-amber-500 to-transparent" />
               </div>
            </section>

            {/* Narrative Section */}
            <section className="py-20 md:py-48 bg-[#050505]">
               <div className="container-wide px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">
                     <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="space-y-8 md:space-y-12"
                     >
                        <h2 className="text-4xl md:text-7xl font-serif leading-tight">
                           Le luxe est un <br />
                           <span className="text-amber-500 italic">sentiment.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-white/40 font-serif italic leading-relaxed">
                           Chaque centimètre de la suite {suite.name} a été pensé pour exalter vos sens.
                           Des matières brutes sublimées par une lumière tamisée, créant une atmosphère de pureté absolue.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-8 md:pt-12 border-t border-white/5">
                           {inclusions.slice(0, 4).map((item, i) => (
                              <div key={i} className="flex gap-4 md:gap-6 group">
                                 <item.icon className="text-amber-500 group-hover:scale-110 transition-transform" size={24} strokeWidth={1} />
                                 <div className="space-y-1">
                                    <h4 className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black">{item.title}</h4>
                                    <p className="text-xs text-white/30 font-light">{item.desc}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </motion.div>

                     <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="relative group rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl"
                     >
                        <img
                           src={gallery[1]}
                           className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105 brightness-[0.7]"
                           alt="Detail view"
                        />
                        <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </motion.div>
                  </div>
               </div>
            </section>

            {/* Booking Module */}
            <section className="py-20 md:py-32 bg-[#0A0A0A] border-y border-white/5" id="booking">
               <div className="container-wide px-6">
                  <div className="bg-[#050505] p-8 md:p-24 rounded-[2.5rem] md:rounded-[4rem] border border-white/5">
                     <div className="flex flex-col lg:flex-row justify-between items-center gap-16 md:gap-24">

                        <div className="space-y-6 md:space-y-8 text-center lg:text-left max-w-xl">
                           <span className="text-[9px] md:text-[10px] uppercase tracking-[0.6em] text-amber-500 font-black">Planifiez votre évasion</span>
                           <h3 className="text-4xl md:text-7xl font-serif tracking-tighter italic">Réservez {suite.name}</h3>
                           <div className="flex items-center justify-center lg:justify-start gap-6 md:gap-12 pt-4 md:pt-8">
                              <div className="space-y-1">
                                 <span className="text-[8px] md:text-[9px] uppercase text-white/30 tracking-widest font-black">Nuitée dès</span>
                                 <p className="text-3xl md:text-4xl font-serif text-amber-500">{suite.price}€</p>
                              </div>
                              <div className="h-10 md:h-12 w-px bg-white/10" />
                              <div className="space-y-1">
                                 <span className="text-[8px] md:text-[9px] uppercase text-white/30 tracking-widest font-black">État</span>
                                 <p className="text-xs md:text-sm font-black text-green-500 uppercase flex items-center gap-2 tracking-widest">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    Disponible
                                 </p>
                              </div>
                           </div>
                        </div>

                        <div className="w-full lg:w-96 space-y-8 md:space-y-12 bg-white/5 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] backdrop-blur-xl border border-white/10">
                           <div className="space-y-6">
                              <label className="text-[9px] uppercase tracking-[0.5em] font-black text-white/20 text-center block w-full">Nombre de Nuits</label>
                              <div className="flex items-center justify-between p-4 md:p-6 bg-[#050505]/50 border border-white/5 rounded-[1.5rem] md:rounded-[2rem]">
                                 <button onClick={() => setNights(Math.max(1, nights - 1))} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-white/10 rounded-full hover:bg-white hover:text-[#050505] transition-all"><Minus size={14} /></button>
                                 <div className="text-center">
                                    <span className="text-3xl md:text-4xl font-serif block leading-none">{nights}</span>
                                 </div>
                                 <button onClick={() => setNights(nights + 1)} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-white/10 rounded-full hover:bg-white hover:text-[#050505] transition-all"><Plus size={14} /></button>
                              </div>
                           </div>

                           <button
                              onClick={() => navigate('/checkout')}
                              className="w-full bg-amber-500 text-[#050505] py-6 md:py-8 rounded-[1.5rem] md:rounded-[2rem] text-[10px] md:text-[11px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-black hover:bg-white transition-all shadow-3xl"
                           >
                              Confirmer ({suite.price * nights}€)
                           </button>

                           <div className="flex items-center justify-center gap-3 md:gap-4 text-white/20">
                              <ShieldCheck size={14} />
                              <p className="text-[8px] md:text-[9px] uppercase tracking-widest font-bold italic">Confidentialité garantie</p>
                           </div>
                        </div>

                     </div>
                  </div>
               </div>
            </section>

            {/* Gallery Section */}
            <section className="py-20 md:py-32 bg-[#050505]">
               <div className="container-wide px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                     <div className="space-y-6 md:space-y-8">
                        <img src={gallery[2]} className="w-full aspect-square object-cover rounded-[2rem] md:rounded-[3rem] grayscale hover:grayscale-0 transition-all duration-1000" alt="Gallery 2" />
                        <img src={gallery[3]} className="w-full aspect-[4/3] object-cover rounded-[2rem] md:rounded-[3rem]" alt="Gallery 3" />
                     </div>
                     <div className="space-y-6 md:space-y-8 pt-0 md:pt-16">
                        <img src={gallery[4]} className="w-full aspect-[4/5] object-cover rounded-[2rem] md:rounded-[3rem]" alt="Gallery 4" />
                        <div className="bg-white/5 p-10 md:p-16 rounded-[2rem] md:rounded-[3rem] border border-white/5 flex flex-col justify-center items-center text-center gap-6 md:gap-8 min-h-[300px] md:min-h-[400px]">
                           <Sparkles className="text-amber-500" size={32} md:size={48} strokeWidth={1} />
                           <h4 className="text-2xl md:text-3xl font-serif italic text-white/80">L'éveil des sens <br /> commence ici.</h4>
                           <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-black text-white/20">Prestation exclusive</p>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

         </main>

      </div>
   );
}
