import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Mail, ShieldCheck, ArrowRight, Download } from 'lucide-react';

export default function Confirmation() {
   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="bg-[#0A0A0A] min-h-screen flex items-center justify-center pt-40 pb-20 px-4 md:px-8 text-white font-sans selection:bg-gold/30"
      >
         <div className="container-wide max-w-4xl text-center">
            <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
               className="space-y-12 relative"
            >
               {/* Decorative Background Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

               <div className="flex flex-col items-center gap-8 relative z-10">
                  <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] bg-[#121212] border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(188,155,93,0.15)] relative">
                     <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="relative z-10 text-gold"
                     >
                        <CheckCircle2 size={50} strokeWidth={1} />
                     </motion.div>
                     <div className="absolute inset-0 bg-gold/10 blur-[40px] rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-4">
                     <h1 className="text-4xl sm:text-5xl md:text-8xl font-serif tracking-tight text-white">C'est <span className="italic font-light text-white/30">Confirmé.</span></h1>
                  </div>
               </div>

               <div className="bg-[#121212] border border-white/5 p-8 sm:p-12 md:p-20 rounded-3xl shadow-2xl space-y-12 text-left relative overflow-hidden z-10">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-white hidden sm:block">
                     <ShieldCheck size={160} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 relative z-10">
                     <div className="space-y-8">
                        <div className="space-y-2">
                           <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Référence de réservation</span>
                           <p className="text-xl sm:text-2xl font-serif tracking-widest text-white">ML-8924-XQ</p>
                        </div>
                        <div className="space-y-2">
                           <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Suite réservée</span>
                           <p className="text-xl sm:text-2xl font-serif italic text-gold">Suite Nomade</p>
                        </div>
                     </div>
                     <div className="space-y-8">
                        <div className="flex items-start gap-4 sm:gap-6">
                           <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                              <Mail size={18} className="text-white/60" />
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-[10px] sm:text-sm font-bold uppercase tracking-widest font-sans text-white/60">Instructions par mail</h4>
                              <p className="text-xs sm:text-sm italic font-light text-white/40 leading-relaxed">
                                 Vous allez recevoir vos codes d'accès et le manuel de la suite par e-mail d'ici quelques minutes.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-end gap-8 text-center md:text-left">

                     <button className="flex items-center justify-center md:justify-end gap-4 text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 hover:text-gold transition-colors">
                        <Download size={16} />
                        <span>Télécharger Reçu</span>
                     </button>
                  </div>
               </div>

               <div className="pt-8 sm:pt-12 flex flex-col items-center gap-8 sm:gap-12 relative z-10">
                  <Link
                     to="/"
                     className="relative overflow-hidden px-8 sm:px-10 py-5 sm:py-6 w-full sm:w-auto bg-gold text-[#0A0A0A] text-[10px] sm:text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-white transition-all duration-700 flex items-center justify-center gap-4 group rounded-full"
                  >
                     <span>Retour à l'accueil</span>
                     <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </Link>


               </div>
            </motion.div>
         </div>
      </motion.div>
   );
}
