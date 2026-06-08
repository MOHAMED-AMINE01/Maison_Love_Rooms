import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants';
import { adminFetch } from '../../utils/apiClient';
import { 
  BedDouble, 
  CheckCircle, 
  Clock, 
  XCircle, 
  CalendarDays, 
  Plus, 
  Users, 
  ArrowRight,
  TrendingUp,
  CreditCard,
  Sparkles
} from "lucide-react";

interface DashboardStats {
  totalReservations: number;
  valideeReservations: number;
  attenteReservations: number;
  annuleeReservations: number;
  totalRevenue: number;
  tauxOccupation: number;
  nouveauxClients: number;
  revenueGrowth: number;
}

interface Reservation {
  _id: string;
  clientName: string;
  suiteName: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalReservations: 5,
    valideeReservations: 3,
    attenteReservations: 1,
    annuleeReservations: 1,
    totalRevenue: 1512,
    tauxOccupation: 88,
    nouveauxClients: 12,
    revenueGrowth: 14.8
  });

  const [reservations, setReservations] = useState<Reservation[]>([
    { _id: "RES-4829", clientName: "Marc Morel", suiteName: "Love Story", checkIn: "2026-05-15", checkOut: "2026-05-17", totalPrice: 378, status: "validee" },
    { _id: "RES-4828", clientName: "Sophie Laurent", suiteName: "Baguerra", checkIn: "2026-05-12", checkOut: "2026-05-13", totalPrice: 189, status: "en_attente" },
    { _id: "RES-4827", clientName: "Jean Valjean", suiteName: "Love Story", checkIn: "2026-05-10", checkOut: "2026-05-12", totalPrice: 378, status: "validee" },
    { _id: "RES-4826", clientName: "Emma Bovary", suiteName: "Baguerra", checkIn: "2026-05-08", checkOut: "2026-05-09", totalPrice: 189, status: "annulee" },
  ]);

  const [suitesCount, setSuitesCount] = useState(2);
  const [suitesActiveCount, setSuitesActiveCount] = useState(2);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch Stats
        const statsRes = await adminFetch('/api/admin/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch Reservations
        const resRes = await adminFetch('/api/admin/reservations');
        if (resRes.ok) {
          const resData = await resRes.json();
          setReservations(resData.slice(0, 5)); // 5 dernières
        }

        // Fetch Suites Count
        const suitesRes = await adminFetch('/api/admin/suites');
        if (suitesRes.ok) {
          const suitesData = await suitesRes.json();
          setSuitesCount(suitesData.length);
          setSuitesActiveCount(suitesData.filter((s: any) => s.status === 'Disponible' || s.status === 'actif').length);
        }
      } catch (error) {
        console.log('Mode démo actif (Backend non connecté)');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Cartes de statistiques aux couleurs Maison Love Room
  const STAT_CARDS = [
    { 
      label: "Chambres totales", 
      value: suitesCount.toString(), 
      pill: "Total", 
      icon: BedDouble, 
      iconBg: "bg-gold/20 text-gold border border-gold/30",
      pillBg: "bg-white/[0.05] text-white/60"
    },
    { 
      label: "Chambres actives", 
      value: suitesActiveCount.toString(), 
      pill: "En ligne", 
      icon: CheckCircle, 
      iconBg: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      pillBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
    },

    { 
      label: "En attente", 
      value: stats.attenteReservations.toString(), 
      pill: "Cautions", 
      icon: Clock, 
      iconBg: "bg-white/10 text-white/60 border border-white/20",
      pillBg: "bg-white/[0.05] text-white/60"
    },
    { 
      label: "Annulées", 
      value: stats.annuleeReservations.toString(), 
      pill: "Archivées", 
      icon: XCircle, 
      iconBg: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
      pillBg: "bg-amber-500/10 text-amber-400 border border-amber-500/20"
    },
    { 
      label: "Réservations reçues", 
      value: stats.totalReservations.toString(), 
      pill: "Clients", 
      icon: CalendarDays, 
      iconBg: "bg-gold-light/20 text-gold-light border border-gold-light/30",
      pillBg: "bg-gold-light/10 text-gold-light border border-gold-light/20"
    },
  ];

  const monthlyObjective = (suitesCount || 2) * 15 * 189;
  const objectivePercentage = Math.round((stats.totalRevenue / (monthlyObjective || 1)) * 100);

  return (
    <div className="space-y-12">
      {/* Grille de Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {STAT_CARDS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`bg-[#131824]/90 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center justify-between shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-300 h-48 ${i === STAT_CARDS.length - 1 && STAT_CARDS.length % 2 !== 0 ? 'col-span-2 md:col-span-1' : ''}`}
          >
            {/* Top Row : Icon & Pill */}
            <div className="flex items-center justify-between w-full">
              <div className={`p-3 rounded-xl flex items-center justify-center shadow-lg ${stat.iconBg}`}>
                <stat.icon size={22} />
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full ${stat.pillBg}`}>
                {stat.pill}
              </span>
            </div>

            {/* Middle & Bottom : Big Number & Label */}
            <div className="mt-4 space-y-1">
              <h3 className="text-4xl font-serif font-bold text-white tracking-wide">{stat.value}</h3>
              <p className="text-white/40 text-xs tracking-wide font-medium">{stat.label}</p>
            </div>

            {/* Subtle Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/[0.04] transition-all duration-500 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Section Actions Rapides aux couleurs Maison Love Room */}
      <div className="space-y-6">
        <h2 className="text-xl font-serif tracking-wide text-white">Actions rapides</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Carte Or/Bronze : Créer une réservation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate('/admin/reservations?action=new')}
            className="bg-gradient-to-r from-[#4A3B22]/80 via-[#8C6D3D]/40 to-[#0F172A]/80 border border-gold/30 rounded-2xl p-8 shadow-2xl shadow-gold/10 flex flex-col justify-between relative overflow-hidden group hover:border-gold/50 transition-all duration-500 h-56 cursor-pointer"
          >
            <div className="p-4 rounded-2xl bg-gold text-black w-14 h-14 flex items-center justify-center shadow-lg shadow-gold/30 group-hover:scale-110 transition-transform duration-500">
              <Plus size={28} />
            </div>

            <div className="space-y-2 pr-12">
              <h3 className="text-2xl font-serif font-bold text-white tracking-wide group-hover:text-gold-light transition-colors">
                Créer une réservation
              </h3>
              <p className="text-white/60 text-sm tracking-wide">
                Ajouter et valider une nouvelle réservation en direct sur le planning
              </p>
            </div>

            <div className="absolute bottom-8 right-8 text-gold group-hover:translate-x-2 transition-transform duration-300">
              <ArrowRight size={24} />
            </div>

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-all duration-500 pointer-events-none" />
          </motion.div>

          {/* Carte Velours Violet : Boutique & Extras */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate('/admin/boutique')}
            className="bg-gradient-to-r from-[#2E185B]/80 via-[#4A1D70]/40 to-[#0F172A]/80 border border-purple-500/30 rounded-2xl p-8 shadow-2xl shadow-purple-500/10 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/50 transition-all duration-500 h-56 cursor-pointer"
          >
            <div className="p-4 rounded-2xl bg-purple-600 text-white w-14 h-14 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-500">
              <Sparkles size={28} />
            </div>

            <div className="space-y-2 pr-12">
              <h3 className="text-2xl font-serif font-bold text-white tracking-wide group-hover:text-purple-200 transition-colors">
                Boutique & Extras
              </h3>
              <p className="text-white/60 text-sm tracking-wide">
                Personnaliser vos options romantiques (Champagne, roses, coffrets) et tarifs
              </p>
            </div>

            <div className="absolute bottom-8 right-8 text-purple-400 group-hover:translate-x-2 transition-transform duration-300">
              <ArrowRight size={24} />
            </div>

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-200/20 transition-all duration-500 pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Section Complémentaire : Chiffre d'Affaires & Dernières Réservations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        {/* Dernières Réservations - 2/3 */}
        <div className="lg:col-span-2 bg-[#131824]/90 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-8 space-y-8 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-white tracking-wide">Dernières Réservations</h3>
              <p className="text-white/40 text-xs tracking-wide mt-1">Activité récente de vos suites</p>
            </div>
            <button 
              onClick={() => navigate('/admin/reservations')}
              className="text-xs uppercase tracking-widest text-gold hover:text-white transition-colors font-bold bg-gold/10 px-4 py-2 rounded-xl border border-gold/20 cursor-pointer"
            >
              Voir tout
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.05] text-white/30 text-[10px] uppercase tracking-widest font-bold">
                  <th className="pb-4">ID</th>
                  <th className="pb-4">Client</th>
                  <th className="pb-4">Suite</th>
                  <th className="pb-4">Statut</th>
                  <th className="pb-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {reservations.map((res) => (
                  <tr key={res._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 text-xs text-white/40 font-mono italic">{res._id}</td>
                    <td className="py-5 text-sm font-medium text-white">{res.clientName}</td>
                    <td className="py-5 text-sm text-white/60">{res.suiteName}</td>
                    <td className="py-5">
                      <span className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold border ${
                        (res.status === 'validee' || res.status === 'confirmee') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        res.status === 'en_attente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        res.status === 'terminee' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {(res.status === 'validee' || res.status === 'confirmee') ? 'Confirmé' : 
                         res.status === 'en_attente' ? 'En attente' : 
                         res.status === 'terminee' ? 'Terminé' : 'Annulé'}
                      </span>
                    </td>
                    <td className="py-5 text-right font-serif text-lg font-bold text-white">{res.totalPrice}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chiffre d'affaires & Performance - 1/3 */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-[#1E293B]/80 to-[#0F172A]/90 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-white/[0.05] text-gold border border-white/10">
                <CreditCard size={22} />
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border ${
                stats.revenueGrowth >= 0 
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                  : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
              }`}>
                <TrendingUp size={12} className={stats.revenueGrowth < 0 ? 'rotate-180 text-rose-400' : 'text-emerald-400'} /> 
                {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}%
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Chiffre d'Affaires</p>
              <h3 className="text-4xl font-serif font-bold text-white tracking-wide">{stats.totalRevenue.toLocaleString()}€</h3>
              <p className="text-white/40 text-xs tracking-wide pt-2">
                Objectif de {monthlyObjective.toLocaleString()}€ atteint à {objectivePercentage}%
              </p>
            </div>

            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-all duration-500 pointer-events-none" />
          </div>

          <div className="bg-[#131824]/90 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gold/20 text-gold border border-gold/30">
                <Sparkles size={22} />
              </div>
              <div>
                <h4 className="text-base font-serif font-bold text-white">Taux d'Occupation</h4>
                <p className="text-white/40 text-xs tracking-wide">Moyenne sur les 30 derniers jours</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-white/60">Performance</span>
                <span className="text-gold">{stats.tauxOccupation}%</span>
              </div>
              <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden p-[1px] border border-white/[0.05]">
                <div 
                  className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full shadow-lg shadow-gold/50" 
                  style={{ width: `${stats.tauxOccupation}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


