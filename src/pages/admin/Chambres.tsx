import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
   Plus,
   Trash2,
   Edit3,
   Image as ImageIcon,
   Wifi,
   Tv,
   Wind,
   Coffee,
   X,
   Save,
   Grid,
   List as ListIcon,
   Sparkles
} from "lucide-react";
import { SUITES } from '../../constants';

export default function AdminChambres() {
   const [isAdding, setIsAdding] = useState(false);
   const [view, setView] = useState<'grid' | 'list'>('grid');

   return (
      <div className="space-y-10">
         {/* Header */}
         <div className="flex justify-between items-end">
            <div className="space-y-2">
               <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Gestion des Stock</span>
               <h2 className="text-4xl font-serif">Gestion des Chambres</h2>
            </div>

            <div className="flex gap-4">
               <div className="flex p-1 bg-white/[0.03] border border-white/[0.05] rounded-xl">
                  <button
                     onClick={() => setView('grid')}
                     className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-gold text-black' : 'text-white/40 hover:text-white'}`}
                  >
                     <Grid size={18} />
                  </button>
                  <button
                     onClick={() => setView('list')}
                     className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-gold text-black' : 'text-white/40 hover:text-white'}`}
                  >
                     <ListIcon size={18} />
                  </button>
               </div>
               <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all"
               >
                  <Plus size={16} />
                  <span>Nouvelle Chambre</span>
               </button>
            </div>
         </div>

         {/* Grid of Suites */}
         <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
            {SUITES.map((suite, i) => (
               <motion.div
                  key={suite.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`admin-card group overflow-hidden ${view === 'list' ? 'flex items-center' : ''}`}
               >
                  <div className={`relative overflow-hidden ${view === 'list' ? 'w-48 h-32 aspect-video' : 'aspect-video'}`}>
                     <img
                        src={suite.image}
                        alt={suite.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                        onError={(e) => { (e.target as any).src = suite.fallback; }}
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                     <div className="absolute top-4 right-4 flex gap-2">
                        <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all">
                           <Edit3 size={14} />
                        </button>
                        <button className="p-2 rounded-lg bg-rose-500/20 backdrop-blur-md hover:bg-rose-500 transition-all text-rose-500 hover:text-white">
                           <Trash2 size={14} />
                        </button>
                     </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1">
                     <div className="space-y-1">
                        <span className="text-[10px] text-gold font-bold uppercase tracking-widest">A partir de {suite.price}€</span>
                        <h4 className="text-xl font-serif">{suite.name}</h4>
                     </div>

                     <div className="flex flex-wrap gap-2">
                        {suite.features.slice(0, 3).map(f => (
                           <span key={f} className="text-[8px] uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md border border-white/5 text-white/40">
                              {f}
                           </span>
                        ))}
                     </div>

                     <div className="pt-2 flex items-center justify-between border-t border-admin-border">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                           Disponible
                        </span>
                        <span className="text-[10px] text-white/20 uppercase tracking-widest">ID: {suite.id}</span>
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>

         {/* Add/Edit Modal */}
         <AnimatePresence>
            {isAdding && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-6"
               >
                  <motion.div
                     initial={{ y: 50, scale: 0.95 }}
                     animate={{ y: 0, scale: 1 }}
                     className="bg-admin-bg border border-admin-border rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
                  >
                     <div className="p-8 border-b border-admin-border flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                              <Plus size={20} />
                           </div>
                           <h3 className="text-2xl font-serif italic">Nouvel Écrin</h3>
                        </div>
                        <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                           <X size={24} />
                        </button>
                     </div>

                     <div className="flex-1 overflow-y-auto p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                           {/* Form Side */}
                           <div className="space-y-8">
                              <div className="space-y-6">
                                 <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold border-b border-white/5 pb-2">Informations Générales</h4>
                                 <div className="grid gap-6">
                                    <div className="space-y-2">
                                       <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Nom de la Suite</label>
                                       <input type="text" className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all font-serif italic text-lg" placeholder="Ex: L'Écrin d'Argent" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                       <div className="space-y-2">
                                          <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Prix par Nuit</label>
                                          <input type="number" className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all" placeholder="250" />
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Capacité</label>
                                          <select className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all">
                                             <option>2 Personnes</option>
                                             <option>4 Personnes</option>
                                          </select>
                                       </div>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Description Courte</label>
                                       <textarea className="w-full h-32 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all resize-none font-serif italic" placeholder="Une invitation au voyage..."></textarea>
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-6">
                                 <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold border-b border-white/5 pb-2">Équipements</h4>
                                 <div className="grid grid-cols-3 gap-2">
                                    {[
                                       { icon: Wifi, label: "Fibre Wifi" },
                                       { icon: Tv, label: "Cinema 4K" },
                                       { icon: Wind, label: "Hammam" },
                                       { icon: Coffee, label: "Nespresso" },
                                       { icon: Wind, label: "Spa" },
                                       { icon: Sparkles, label: "Ciel Etoile" }
                                    ].map(item => (
                                       <button key={item.label} className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg text-center hover:border-gold/30 transition-all group">
                                          <item.icon size={16} className="mx-auto mb-2 text-white/20 group-hover:text-gold transition-colors" />
                                          <span className="text-[8px] uppercase tracking-widest block">{item.label}</span>
                                       </button>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           {/* Media Side */}
                           <div className="space-y-8">
                              <div className="space-y-6">
                                 <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold border-b border-white/5 pb-2">Galerie Photos</h4>
                                 <div className="aspect-video bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-gold/30 transition-all cursor-pointer group">
                                    <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center text-white/20 group-hover:text-gold transition-colors">
                                       <ImageIcon size={32} />
                                    </div>
                                    <div className="text-center">
                                       <p className="text-sm font-medium">Glissez vos images ici</p>
                                       <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">OU CLIQUEZ POUR EXPLORER</p>
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-3 gap-4">
                                    {[1, 2, 3].map(i => (
                                       <div key={i} className="aspect-square bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-center text-white/10">
                                          <ImageIcon size={16} />
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              <div className="p-8 bg-gold/5 border border-gold/10 rounded-2xl space-y-4">
                                 <h5 className="text-xs font-bold text-gold uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles size={14} />
                                    Conseil Boutique
                                 </h5>
                                 <p className="text-xs text-white/60 italic leading-relaxed font-serif">
                                    "N'oubliez pas d'utiliser des photos en haute résolution avec une luminosité tamisée pour conserver l'esprit luxueux de Maison Love Rooms."
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="p-8 bg-white/[0.02] border-t border-admin-border flex justify-end gap-4">
                        <button onClick={() => setIsAdding(false)} className="px-8 py-4 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
                           Abandonner
                        </button>
                        <button className="px-8 py-4 bg-gold text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gold-light transition-all flex items-center gap-3">
                           <Save size={16} />
                           Enregistrer l'Écrin
                        </button>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}
