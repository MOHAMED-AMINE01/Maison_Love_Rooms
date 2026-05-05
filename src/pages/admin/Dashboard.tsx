import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CreditCard, 
  Plus, 
  Lock, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const STATS = [
  { label: "Réservations le mois", value: "142", trend: "+12.4%", icon: Calendar, color: "text-blue-400" },
  { label: "Chiffre d'Affaires", value: "28,450€", trend: "+8.2%", icon: CreditCard, color: "text-emerald-400" },
  { label: "Taux d'Occupation", value: "84%", trend: "+5.1%", icon: TrendingUp, color: "text-gold" },
  { label: "Nouveaux Clients", value: "38", trend: "-2.4%", icon: Users, color: "text-amber-400" },
];

const QUICK_ACTIONS = [
  { label: "Ajouter une Chambre", icon: Plus, desc: "Créez un nouvel écrin pour vos clients." },
  { label: "Bloquer des Dates", icon: Lock, desc: "Maintenance ou indisponibilité ponctuelle." },
  { icon: Sparkles, label: "Créer une Prestation", desc: "Ajoutez des massages, dîners ou options." },
  { label: "Voir Paiements", icon: CreditCard, desc: "Accédez au journal des transactions." },
];

const RECENT_RESERVATIONS = [
  { id: "#RES-4829", client: "Marc Morel", chambre: "Luna d'Argento", date: "15 Mai - 17 Mai", total: "490€", status: "Confirmé" },
  { id: "#RES-4828", client: "Sophie Laurent", chambre: "L'Impériale", date: "12 Mai - 13 Mai", total: "420€", status: "En attente" },
  { id: "#RES-4827", client: "Jean Valjean", chambre: "Le Boudoir", date: "10 Mai - 12 Mai", total: "580€", status: "Confirmé" },
  { id: "#RES-4826", client: "Emma Bovary", chambre: "Jardin de Zen", date: "08 Mai - 09 Mai", total: "260€", status: "Annulé" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="admin-card p-6 flex flex-col gap-4 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.trend.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">{stat.label}</p>
              <h3 className="text-3xl font-serif">{stat.value}</h3>
            </div>
            
            {/* Subtle Gradient background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-gold/10 transition-all" />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Recent Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Table - 2/3 width */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 admin-card p-8 space-y-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif">Dernières Réservations</h3>
            <button className="text-[10px] uppercase tracking-widest text-gold hover:text-white transition-colors font-bold">
              Voir tout
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-admin-border">
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">ID</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Client</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Chambre</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Statut</th>
                  <th className="pb-4 text-right text-[10px] uppercase tracking-widest text-white/20 font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_RESERVATIONS.map((res, i) => (
                  <tr key={res.id} className="group border-b border-admin-border/50 hover:bg-white/[0.01] transition-colors">
                    <td className="py-5 text-xs text-white/40 font-mono italic">{res.id}</td>
                    <td className="py-5">
                      <p className="text-sm font-medium">{res.client}</p>
                    </td>
                    <td className="py-5 text-sm text-white/60">{res.chambre}</td>
                    <td className="py-5">
                      <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded font-bold ${
                        res.status === 'Confirmé' ? 'bg-emerald-400/10 text-emerald-400' : 
                        res.status === 'En attente' ? 'bg-amber-400/10 text-amber-400' :
                        'bg-rose-400/10 text-rose-400'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-5 text-right font-serif text-lg">{res.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions - 1/3 width */}
        <div className="space-y-6">
          <h3 className="text-xl font-serif px-2">Actions Rapides</h3>
          <div className="grid grid-cols-1 gap-4">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="admin-card p-4 flex items-center gap-4 group text-left"
              >
                <div className="p-3 rounded-lg bg-gold/10 text-gold group-hover:bg-gold group-hover:text-black transition-all">
                  <action.icon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold group-hover:text-gold transition-colors">{action.label}</h4>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{action.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
