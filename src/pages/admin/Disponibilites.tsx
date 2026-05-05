import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Clock,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { SUITES } from '../../constants';

export default function AdminDisponibilites() {
  const years = [2024];
  const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Planning & État</span>
          <h2 className="text-4xl font-serif">Disponibilités</h2>
        </div>
        
        <div className="flex gap-4">
          <div className="flex p-1 bg-white/[0.03] border border-white/[0.05] rounded-xl overflow-hidden">
             <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-gold text-black rounded-lg transition-all">Vue Calendrier</button>
             <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">Vue Liste</button>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/5 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
            <Lock size={16} className="text-gold" />
            <span>Bloquer des Dates</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
         {/* Calendar Navigation & Legend */}
         <div className="space-y-8">
            <div className="admin-card p-6 space-y-6">
               <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-white/60">Mai 2024</h4>
                  <div className="flex gap-2">
                     <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ChevronLeft size={16} /></button>
                     <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ChevronRight size={16} /></button>
                  </div>
               </div>
               
               <div className="space-y-3">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded bg-emerald-400/20 border border-emerald-400" />
                     <span className="text-xs text-white/40 uppercase tracking-widest font-medium">Libre</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded bg-rose-400/20 border border-rose-400" />
                     <span className="text-xs text-white/40 uppercase tracking-widest font-medium">Occupé</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded bg-amber-400/20 border border-amber-400" />
                     <span className="text-xs text-white/40 uppercase tracking-widest font-medium">Maintenance</span>
                  </div>
               </div>
            </div>

            <div className="admin-card p-6 space-y-4">
               <h4 className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-2">
                  <AlertCircle size={12} /> Prochains Blocages
               </h4>
               <div className="space-y-4">
                  {[
                    { label: "Suites Luna", date: "18-20 Mai", reason: "Peinture" },
                    { label: "L'Impériale", date: "22 Mai", reason: "Nettoyage annuel" }
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                       <p className="text-xs font-bold">{item.label}</p>
                       <div className="flex justify-between items-center mt-1">
                          <span className="text-[10px] text-white/20 uppercase tracking-widest">{item.date}</span>
                          <span className="text-[10px] text-amber-400 font-bold uppercase">{item.reason}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Calendar Grid */}
         <div className="lg:col-span-3 space-y-10">
            {SUITES.map((suite, i) => (
              <div key={suite.id} className="admin-card p-8">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                          <img src={suite.image} className="w-full h-full object-cover grayscale opacity-40" />
                       </div>
                       <h3 className="text-xl font-serif">{suite.name}</h3>
                    </div>
                    <button className="text-[10px] uppercase font-bold tracking-widest text-gold hover:text-white transition-colors">
                       Voir les détails
                    </button>
                 </div>

                 <div className="grid grid-cols-7 md:grid-cols-15 xl:grid-cols-31 gap-1">
                    {[...Array(31)].map((_, day) => {
                      const isOccupied = (day + i) % 5 === 0;
                      const isMaintenance = day === 18 && i === 0;
                      
                      return (
                        <div 
                          key={day} 
                          className={`aspect-square min-w-[32px] rounded-md border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer hover:scale-110 active:scale-95 ${
                            isOccupied ? 'bg-rose-400/10 border-rose-400/40 text-rose-400' :
                            isMaintenance ? 'bg-amber-400/20 border-amber-400 text-amber-400' :
                            'bg-emerald-400/5 border-emerald-400/10 text-emerald-400/60 hover:border-emerald-400'
                          }`}
                        >
                           <span className="text-[9px] font-bold">{day + 1}</span>
                           {isOccupied && <Clock size={8} />}
                           {isMaintenance && <Lock size={8} />}
                        </div>
                      );
                    })}
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
