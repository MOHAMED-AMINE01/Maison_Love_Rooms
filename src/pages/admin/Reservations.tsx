import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowRight, 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const RESERVATIONS = [
  { id: "#RES-4829", client: "Marc Morel", email: "m.morel@gmail.com", telephone: "+33 6 12 34 56 78", chambre: "Luna d'Argento", date: "15 Mai - 17 Mai", total: "490€", status: "Confirmé", payé: true, caution: "Validée" },
  { id: "#RES-4828", client: "Sophie Laurent", email: "s.laurent@pro.fr", telephone: "+33 7 45 89 23 11", chambre: "L'Impériale", date: "12 Mai - 13 Mai", total: "420€", status: "En attente", payé: true, caution: "En attente" },
  { id: "#RES-4827", client: "Jean Valjean", email: "valjean.j@outlook.com", telephone: "+33 6 98 76 54 32", chambre: "Le Boudoir", date: "10 Mai - 12 Mai", total: "580€", status: "Confirmé", payé: false, caution: "Validée" },
  { id: "#RES-4826", client: "Emma Bovary", email: "emma.b@orange.fr", telephone: "+33 6 55 44 33 22", chambre: "Jardin de Zen", date: "08 Mai - 09 Mai", total: "260€", status: "Annulé", payé: false, caution: "Annulée" },
];

export default function AdminReservations() {
  const [selectedRes, setSelectedRes] = useState<any>(null);

  return (
    <div className="space-y-8 relative">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-admin-card p-6 border border-admin-border rounded-xl">
        <div className="relative group w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
          <input 
            type="text" 
            placeholder="Rechercher par client, ID ou chambre..." 
            className="w-full bg-white/[0.03] border border-white/[0.05] focus:border-gold/30 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-0 transition-all" 
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl hover:bg-white/[0.05] transition-all text-sm group">
            <Filter size={16} className="text-white/40 group-hover:text-gold transition-colors" />
            <span>Filtres</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl hover:bg-white/[0.05] transition-all text-sm group">
             <Download size={16} className="text-white/40 group-hover:text-gold transition-colors" />
             <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card p-8 min-h-[600px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-admin-border">
                <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Client / ID</th>
                <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Hébergement</th>
                <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Séjour</th>
                <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Statut</th>
                <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Paiement</th>
                <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {RESERVATIONS.map((res, i) => (
                <motion.tr 
                  key={res.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group border-b border-admin-border/50 hover:bg-white/[0.01] transition-all cursor-pointer"
                  onClick={() => setSelectedRes(res)}
                >
                  <td className="py-6">
                    <p className="text-sm font-semibold group-hover:text-gold transition-colors">{res.client}</p>
                    <p className="text-[10px] font-mono text-white/20 mt-1">{res.id}</p>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gold/40" />
                      <span className="text-sm text-white/60">{res.chambre}</span>
                    </div>
                  </td>
                  <td className="py-6">
                    <p className="text-sm">{res.date}</p>
                  </td>
                  <td className="py-6">
                    <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded font-bold ${
                      res.status === 'Confirmé' ? 'bg-emerald-400/10 text-emerald-400' : 
                      res.status === 'En attente' ? 'bg-amber-400/10 text-amber-400' :
                      'bg-rose-400/10 text-rose-400'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="py-6">
                    <div className="flex flex-col gap-1">
                      <div className={`flex items-center gap-2 text-[10px] font-bold ${res.payé ? 'text-emerald-400/60' : 'text-rose-400/60'}`}>
                        {res.payé ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                        {res.payé ? 'Payé' : 'Non payé'}
                      </div>
                      <div className="text-[9px] text-white/20 font-medium">Caution: {res.caution}</div>
                    </div>
                  </td>
                  <td className="py-6 text-right">
                    <button className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-gold hover:text-black transition-all">
                      <ArrowRight size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {selectedRes && (
          <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedRes(null)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
             />
             <motion.div
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 30, stiffness: 300 }}
               className="fixed top-0 right-0 h-full w-[500px] bg-admin-bg border-l border-admin-border z-[110] p-12 overflow-y-auto"
             >
                <div className="flex justify-between items-center mb-12">
                   <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Détails Réservation</span>
                      <h2 className="text-3xl font-serif">{selectedRes.id}</h2>
                   </div>
                   <button onClick={() => setSelectedRes(null)} className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-full hover:bg-rose-400/10 hover:text-rose-400 transition-all">
                      <X size={20} />
                   </button>
                </div>

                <div className="space-y-10">
                   {/* Client Section */}
                   <div className="admin-card p-6 space-y-6">
                      <div className="flex items-center gap-4 border-b border-admin-border pb-4">
                         <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                            <User size={24} />
                         </div>
                         <div>
                            <h4 className="text-lg font-medium">{selectedRes.client}</h4>
                            <p className="text-xs text-white/40">Client régulier</p>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center gap-4">
                            <Mail size={16} className="text-white/20" />
                            <span className="text-sm text-white/60">{selectedRes.email}</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <Phone size={16} className="text-white/20" />
                            <span className="text-sm text-white/60">{selectedRes.telephone}</span>
                         </div>
                      </div>
                   </div>

                   {/* Stay Section */}
                   <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest text-white/20 font-bold pl-2">Hébergement & Séjour</h4>
                      <div className="admin-card p-6 grid grid-cols-2 gap-6">
                         <div className="space-y-1">
                            <span className="text-[10px] text-white/30 uppercase font-bold">Chambre</span>
                            <div className="flex items-center gap-2">
                               <Calendar size={14} className="text-gold" />
                               <span className="text-sm font-medium">{selectedRes.chambre}</span>
                            </div>
                         </div>
                         <div className="space-y-1">
                            <span className="text-[10px] text-white/30 uppercase font-bold">Dates</span>
                            <p className="text-sm">{selectedRes.date}</p>
                         </div>
                      </div>
                   </div>

                   {/* Billing Section */}
                   <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest text-white/20 font-bold pl-2">Finances</h4>
                      <div className="admin-card p-6 space-y-6">
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-white/40">Montant total déposé</span>
                            <span className="text-3xl font-serif text-gold">{selectedRes.total}</span>
                         </div>
                         <div className="flex items-center gap-3 p-4 bg-white/[0.03] rounded-lg">
                            <CreditCard size={16} className="text-emerald-400" />
                            <span className="text-xs font-medium">Payé via Stripe (•••• 4242)</span>
                         </div>
                      </div>
                   </div>

                   {/* Actions Group */}
                   <div className="grid grid-cols-2 gap-4 pt-12">
                      <button className="flex items-center justify-center gap-2 px-6 py-4 border border-admin-border rounded-xl hover:bg-white/[0.03] transition-all text-sm font-bold uppercase tracking-widest">
                         Renvoi mail
                      </button>
                      <button className="flex items-center justify-center gap-2 px-6 py-4 bg-gold text-black rounded-xl hover:bg-gold-light transition-all text-sm font-bold uppercase tracking-widest">
                         Annuler
                      </button>
                   </div>
                </div>
             </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
