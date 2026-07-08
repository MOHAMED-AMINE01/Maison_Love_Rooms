import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { AdminToast, AdminConfirmModal, useAdminToast, useAdminConfirm } from '../../components/admin/AdminModal';
import CustomDatePicker from '../../components/ui/CustomDatePicker';
import { API_URL } from '../../constants';
import { adminFetch } from '../../utils/apiClient';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Clock,
  Sparkles,
  AlertCircle,
  X,
  Unlock,
  BedDouble,
  CheckCircle,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  RefreshCw,
  Link2,
  Copy,
  Check
} from "lucide-react";

interface BlockedDate {
  _id?: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface SuiteData {
  _id: string;
  name: string;
  imageUrl: string;
  blockedDates: BlockedDate[];
  icalUrls?: { airbnb: string; booking: string };
}

interface ReservationData {
  _id: string;
  suite: { _id: string; name: string };
  checkIn: string;
  checkOut: string;
  status: string;
  clientName: string;
}

export default function AdminDisponibilites() {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'block') {
      setIsBlocking(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  const [suites, setSuites] = useState<SuiteData[]>([]);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Navigation Calendrier
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal de blocage
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockForm, setBlockForm] = useState({
    suiteId: '',
    startDate: '',
    endDate: '',
    reason: 'Maintenance / Nettoyage'
  });

  const { toast, showToast, hideToast } = useAdminToast();
  const { confirm: confirmState, showConfirm, hideConfirm } = useAdminConfirm();

  const [openSuiteDropdown, setOpenSuiteDropdown] = useState(false);
  const [openReasonDropdown, setOpenReasonDropdown] = useState(false);

  // Synchronisation iCal (Airbnb / Booking)
  const [icalDrafts, setIcalDrafts] = useState<Record<string, { airbnb: string; booking: string }>>({});
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const saveIcalUrls = async (suiteId: string) => {
    const draft = icalDrafts[suiteId] || { airbnb: '', booking: '' };
    try {
      const res = await adminFetch(`/api/admin/suites/${suiteId}/ical`, {
        method: 'PATCH',
        body: JSON.stringify({ icalUrls: draft }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSuites(prev => prev.map(s => s._id === suiteId ? updated : s));
        showToast('success', 'Liens iCal enregistrés.');
      } else showToast('error', "Erreur lors de l'enregistrement des liens.");
    } catch {
      showToast('error', 'Erreur réseau.');
    }
  };

  const runIcalSync = async (suiteId: string) => {
    setSyncingId(suiteId);
    try {
      const res = await adminFetch(`/api/admin/suites/${suiteId}/sync-ical`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.suite) setSuites(prev => prev.map(s => s._id === suiteId ? data.suite : s));
        const parts = Object.entries(data.summary || {}).map(([k, v]) => `${k}: ${v}`).join(' · ');
        showToast('success', `Synchronisation terminée. ${parts}`);
      } else {
        showToast('error', 'Erreur lors de la synchronisation.');
      }
    } catch {
      showToast('error', 'Erreur réseau lors de la synchronisation.');
    } finally {
      setSyncingId(null);
    }
  };

  const copyExportUrl = (suiteId: string) => {
    const url = `${API_URL}/api/ical/${suiteId}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedId(suiteId);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => showToast('error', 'Copie impossible.'));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      
      const [suitesRes, resRes] = await Promise.all([
        adminFetch('/api/admin/suites'),
        adminFetch('/api/admin/reservations')
      ]);

      if (!suitesRes.ok || !resRes.ok) throw new Error('Erreur de chargement des données');

      const suitesData = await suitesRes.json();
      const resData = await resRes.json();

      setSuites(suitesData);
      setReservations(resData);
      const drafts: Record<string, { airbnb: string; booking: string }> = {};
      suitesData.forEach((s: SuiteData) => {
        drafts[s._id] = { airbnb: s.icalUrls?.airbnb || '', booking: s.icalUrls?.booking || '' };
      });
      setIcalDrafts(drafts);
      if (suitesData.length > 0) {
        setBlockForm(prev => ({ ...prev, suiteId: suitesData[0]._id }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleBlockDates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockForm.suiteId || !blockForm.startDate || !blockForm.endDate) {
      showToast('error', "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      
      const res = await adminFetch(`/api/admin/suites/${blockForm.suiteId}/block-dates`, {
        method: 'POST',
        body: JSON.stringify({
          startDate: blockForm.startDate,
          endDate: blockForm.endDate,
          reason: blockForm.reason
        })
      });

      if (res.ok) {
        const updatedSuite = await res.json();
        setSuites(suites.map(s => s._id === updatedSuite._id ? updatedSuite : s));
        setIsBlocking(false);
        setBlockForm({
          suiteId: suites[0]?._id || '',
          startDate: '',
          endDate: '',
          reason: 'Maintenance / Nettoyage'
        });
        showToast('success', 'Période bloquée avec succès.');
      } else {
        showToast('error', "Erreur lors du blocage des dates");
      }
    } catch (err) {
      showToast('error', "Erreur réseau lors du blocage");
    }
  };

  const handleUnblockDate = async (suiteId: string, blockId: string) => {
    showConfirm({
      title: 'Débloquer cette période',
      message: 'Cette période redeviendra disponible à la réservation.',
      type: 'warning',
      onConfirm: async () => {
        hideConfirm();
        try {
          
          const res = await adminFetch(`/api/admin/suites/${suiteId}/block-dates/${blockId}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            const updatedSuite = await res.json();
            setSuites(suites.map(s => s._id === updatedSuite._id ? updatedSuite : s));
            showToast('success', 'Période débloquée avec succès.');
          } else {
            showToast('error', "Erreur lors du déblocage");
          }
        } catch (err) {
          showToast('error', "Erreur réseau lors du déblocage");
        }
      }
    });
  };

  // Helper pour le nombre de jours dans le mois actuel
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  // Helper pour vérifier le statut d'un jour pour une suite
  const getDayStatus = (suiteId: string, day: number) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    checkDate.setHours(0, 0, 0, 0);

    // 1. Vérifier les blocages manuels (Maintenance)
    const suite = suites.find(s => s._id === suiteId);
    if (suite && suite.blockedDates) {
      for (const b of suite.blockedDates) {
        const start = new Date(b.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(b.endDate);
        end.setHours(23, 59, 59, 999);

        if (checkDate >= start && checkDate <= end) {
          return { status: 'maintenance', reason: b.reason, blockId: b._id };
        }
      }
    }

    // 2. Vérifier les réservations (Occupé)
    const suiteReservations = reservations.filter(r => r.suite?._id === suiteId && r.status !== 'annulee');
    for (const r of suiteReservations) {
      const checkIn = new Date(r.checkIn);
      checkIn.setHours(0, 0, 0, 0);
      const checkOut = new Date(r.checkOut);
      checkOut.setHours(23, 59, 59, 999);

      if (checkDate >= checkIn && checkDate <= checkOut) {
        return { status: 'occupe', reservation: r };
      }
    }

    return { status: 'libre' };
  };

  // Rassembler tous les prochains blocages pour la liste latérale
  const allBlockedDates = suites.flatMap(s => 
    (s.blockedDates || []).map(b => ({
      ...b,
      suiteName: s.name,
      suiteId: s._id
    }))
  ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-10 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-admin-card p-6 border border-admin-border rounded-xl shadow-xl">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Planning & État</span>
          <h2 className="text-3xl sm:text-4xl font-serif">Disponibilités & Calendrier</h2>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <button 
            onClick={() => setIsBlocking(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-gold text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all shadow-xl shadow-gold/10 w-full sm:w-auto justify-center"
          >
            <Lock size={16} />
            <span>Bloquer des Dates</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-center">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
           {/* Navigation Calendrier & Légende & Liste des blocages */}
           <div className="space-y-8">
              <div className="admin-card p-6 space-y-6 shadow-xl">
                 <div className="flex items-center justify-between border-b border-admin-border pb-4">
                    <h4 className="text-base font-serif font-bold tracking-wide capitalize text-gold">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h4>
                    <div className="flex gap-2">
                       <button onClick={handlePrevMonth} className="p-2 bg-white/[0.03] border border-white/[0.05] rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"><ChevronLeft size={16} /></button>
                       <button onClick={handleNextMonth} className="p-2 bg-white/[0.03] border border-white/[0.05] rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"><ChevronRight size={16} /></button>
                    </div>
                 </div>
                 
                 <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                       <div className="w-3.5 h-3.5 rounded bg-emerald-400/20 border border-emerald-400" />
                       <span className="text-xs text-white/70 uppercase tracking-widest font-medium">Libre / Disponible</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-3.5 h-3.5 rounded bg-rose-400/20 border border-rose-400" />
                       <span className="text-xs text-white/70 uppercase tracking-widest font-medium">Réservé (Occupé)</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-3.5 h-3.5 rounded bg-amber-400/20 border border-amber-400" />
                       <span className="text-xs text-white/70 uppercase tracking-widest font-medium">Bloqué (Maintenance)</span>
                    </div>
                 </div>
              </div>

              {/* Liste des prochains blocages */}
              <div className="admin-card p-6 space-y-4 shadow-xl">
                 <h4 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2 border-b border-admin-border pb-4">
                    <AlertCircle size={14} /> Périodes Bloquées (manuelles + Airbnb / Booking)
                 </h4>
                 {allBlockedDates.length === 0 ? (
                   <p className="text-xs text-white/40 italic py-2">Aucune date bloquée actuellement.</p>
                 ) : (
                   <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {allBlockedDates.map((item, i) => (
                        <motion.div 
                          key={item._id || i} 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center justify-between gap-2 group hover:border-white/10 transition-all"
                        >
                           <div>
                              <p className="text-xs font-bold text-white/90">{item.suiteName}</p>
                              <p className="text-[10px] text-amber-400 font-semibold mt-0.5">{item.reason}</p>
                              <span className="text-[10px] text-white/40 block mt-1">
                                {new Date(item.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - {new Date(item.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                              </span>
                           </div>
                           <button 
                             onClick={() => item._id && handleUnblockDate(item.suiteId, item._id)}
                             className="p-2 rounded-lg bg-white/[0.03] hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-all"
                             title="Débloquer cette période"
                           >
                              <Unlock size={14} />
                           </button>
                        </motion.div>
                      ))}
                   </div>
                 )}
              </div>
           </div>

           {/* Grille du Calendrier par Suite */}
           <div className="lg:col-span-3 space-y-10">
              {suites.map((suite) => (
                <div key={suite._id} className="admin-card p-8 shadow-2xl">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-admin-border pb-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-white/[0.03]">
                            <img src={suite.imageUrl} alt={suite.name} className="w-full h-full object-cover opacity-80" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-serif text-white/90">{suite.name}</h3>
                            <p className="text-xs text-white/40 tracking-wider uppercase mt-0.5">Planning mensuel</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => {
                          setBlockForm(prev => ({ ...prev, suiteId: suite._id }));
                          setIsBlocking(true);
                        }}
                        className="text-xs uppercase font-bold tracking-widest text-gold hover:text-gold-light transition-colors flex items-center gap-2 self-start sm:self-auto bg-gold/10 px-4 py-2 rounded-lg border border-gold/20"
                      >
                         <Lock size={12} /> Bloquer des dates
                      </button>
                   </div>

                   {/* Synchronisation iCal Airbnb / Booking */}
                   <div className="mb-8 p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-4">
                      <div className="flex items-center gap-2 text-white/80">
                         <Link2 size={14} className="text-gold" />
                         <span className="text-xs uppercase tracking-widest font-bold">Synchronisation des calendriers</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Lien iCal Airbnb</label>
                            <input type="text" value={icalDrafts[suite._id]?.airbnb || ''}
                               onChange={(e) => setIcalDrafts(prev => ({ ...prev, [suite._id]: { airbnb: e.target.value, booking: prev[suite._id]?.booking || '' } }))}
                               placeholder="https://www.airbnb.com/calendar/ical/..."
                               className="w-full bg-[#0D0D0D] border border-white/10 focus:border-gold rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-white/20 outline-none transition-all" />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Lien iCal Booking</label>
                            <input type="text" value={icalDrafts[suite._id]?.booking || ''}
                               onChange={(e) => setIcalDrafts(prev => ({ ...prev, [suite._id]: { airbnb: prev[suite._id]?.airbnb || '', booking: e.target.value } }))}
                               placeholder="https://ical.booking.com/v1/export?..."
                               className="w-full bg-[#0D0D0D] border border-white/10 focus:border-gold rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-white/20 outline-none transition-all" />
                         </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                         <button onClick={() => saveIcalUrls(suite._id)}
                            className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:border-gold hover:text-gold text-[10px] uppercase tracking-widest font-bold transition-all">
                            Enregistrer les liens
                         </button>
                         <button onClick={() => runIcalSync(suite._id)} disabled={syncingId === suite._id}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20 text-[10px] uppercase tracking-widest font-bold transition-all disabled:opacity-50">
                            <RefreshCw size={12} className={syncingId === suite._id ? 'animate-spin' : ''} />
                            {syncingId === suite._id ? 'Synchro…' : 'Synchroniser maintenant'}
                         </button>
                      </div>
                      <div className="pt-3 border-t border-white/5 space-y-1.5">
                         <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Lien à coller dans Airbnb / Booking (export des réservations du site)</label>
                         <div className="flex items-center gap-2">
                            <input readOnly value={`${API_URL}/api/ical/${suite._id}`}
                               className="flex-1 bg-[#0D0D0D] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white/60 outline-none" />
                            <button onClick={() => copyExportUrl(suite._id)} title="Copier"
                               className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white/60 hover:text-gold hover:border-gold transition-all">
                               {copiedId === suite._id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </button>
                         </div>
                      </div>
                   </div>

                    {/* En-tête des jours de la semaine */}
                    <div className="grid grid-cols-7 gap-2 text-center text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3 pb-2 border-b border-white/5">
                       <span>Lun</span>
                       <span>Mar</span>
                       <span>Mer</span>
                       <span>Jeu</span>
                       <span>Ven</span>
                       <span>Sam</span>
                       <span>Dim</span>
                    </div>

                    {/* Grille des jours en format calendrier mensuel */}
                    <div className="grid grid-cols-7 gap-2">
                       {/* Cellules de remplissage pour le début du mois */}
                       {[...Array(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() === 0 ? 6 : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() - 1)].map((_, idx) => (
                          <div key={`empty-${idx}`} className="aspect-square bg-transparent border border-transparent pointer-events-none opacity-0" />
                       ))}

                       {/* Jours du mois */}
                       {[...Array(daysInMonth)].map((_, day) => {
                         const dayNum = day + 1;
                         const statusInfo = getDayStatus(suite._id, dayNum);
                         const isToday = new Date().getDate() === dayNum && 
                                         new Date().getMonth() === currentDate.getMonth() && 
                                         new Date().getFullYear() === currentDate.getFullYear();
                         
                         return (
                           <div 
                             key={dayNum} 
                             title={
                               statusInfo.status === 'occupe' ? `Réservé par ${statusInfo.reservation?.clientName}` :
                               statusInfo.status === 'maintenance' ? `Bloqué: ${statusInfo.reason}` :
                               `Disponible`
                             }
                             className={`aspect-square relative rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer hover:scale-[1.05] active:scale-[0.98] p-1.5 ${
                               statusInfo.status === 'occupe' 
                                 ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-lg shadow-rose-500/5 hover:bg-rose-500/20' :
                               statusInfo.status === 'maintenance' 
                                 ? 'bg-amber-400/10 border-amber-400/30 text-amber-400 shadow-lg shadow-amber-400/5 hover:bg-amber-400/20' :
                               'bg-emerald-400/[0.02] border-emerald-400/10 text-emerald-400/60 hover:border-emerald-400/30 hover:text-emerald-400 hover:bg-emerald-400/[0.05]'
                             } ${isToday ? 'ring-1 ring-gold/40 border-gold shadow-[0_0_15px_rgba(188,155,93,0.15)]' : ''}`}
                           >
                              {isToday && (
                                 <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#BC9B5D] animate-pulse" />
                              )}
                              <span className={`text-xs font-bold ${isToday ? 'text-gold' : ''}`}>{dayNum}</span>
                              {statusInfo.status === 'occupe' && <Clock size={12} className="text-rose-400 animate-pulse mt-0.5" />}
                              {statusInfo.status === 'maintenance' && <Lock size={12} className="text-amber-400 mt-0.5" />}
                           </div>
                         );
                       })}
                    </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Drawer de Blocage de dates */}
      <AnimatePresence>
        {isBlocking && (
          <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsBlocking(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
             />
             <motion.div
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 30, stiffness: 300 }}
               className="fixed top-0 right-0 h-full w-full max-w-[500px] bg-admin-bg border-l border-admin-border z-[110] p-6 sm:p-10 overflow-y-auto shadow-2xl"
             >
                <div className="flex justify-between items-center mb-10 border-b border-admin-border pb-6">
                   <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Calendrier</span>
                      <h2 className="text-2xl font-serif">Bloquer des Dates</h2>
                   </div>
                   <button onClick={() => setIsBlocking(false)} className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-full hover:bg-rose-400/10 hover:text-rose-400 transition-all">
                      <X size={20} />
                   </button>
                </div>

                <form onSubmit={handleBlockDates} className="space-y-6">
                   {/* Sélection de la Suite */}
                   <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Suite / Chambre *</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenSuiteDropdown(!openSuiteDropdown)}
                          className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm focus:border-gold transition-all text-white font-semibold flex items-center justify-between"
                        >
                          <span>{suites.find(s => s._id === blockForm.suiteId)?.name || 'Sélectionner une suite'}</span>
                          <ChevronDown size={14} className={`text-white/40 transition-transform ${openSuiteDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {openSuiteDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="absolute z-50 top-full left-0 right-0 mt-2 bg-[#0D121E] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60"
                            >
                              {suites.map(s => (
                                <button
                                  key={s._id}
                                  type="button"
                                  onClick={() => {
                                    setBlockForm({...blockForm, suiteId: s._id});
                                    setOpenSuiteDropdown(false);
                                  }}
                                  className={`w-full px-4 py-3 text-sm text-left flex items-center justify-between hover:bg-white/5 transition-colors ${blockForm.suiteId === s._id ? 'text-gold' : 'text-white/70'}`}
                                >
                                  {s.name}
                                  {blockForm.suiteId === s._id && <CheckCircle2 size={14} className="text-gold" />}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                   </div>

                   {/* Date de début */}
                   <div className="space-y-2 relative z-[95]">
                      <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Date de début *</label>
                      <CustomDatePicker
                        value={blockForm.startDate}
                        onChange={(val) => setBlockForm({...blockForm, startDate: val})}
                        minDate={new Date().toISOString().split('T')[0]}
                      />
                   </div>

                   {/* Date de fin */}
                   <div className="space-y-2 relative z-[95]">
                      <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Date de fin *</label>
                      <CustomDatePicker
                        value={blockForm.endDate}
                        onChange={(val) => setBlockForm({...blockForm, endDate: val})}
                        minDate={blockForm.startDate || new Date().toISOString().split('T')[0]}
                      />
                   </div>

                   {/* Motif */}
                   <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Motif du blocage *</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenReasonDropdown(!openReasonDropdown)}
                          className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm focus:border-gold transition-all text-white font-semibold flex items-center justify-between"
                        >
                          <span>{blockForm.reason}</span>
                          <ChevronDown size={14} className={`text-white/40 transition-transform ${openReasonDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {openReasonDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="absolute z-50 top-full left-0 right-0 mt-2 bg-[#0D121E] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60"
                            >
                              {[
                                "Maintenance / Nettoyage",
                                "Travaux de rénovation",
                                "Fermeture annuelle / Congés",
                                "Réservation externe / Privatisé"
                              ].map(reason => (
                                <button
                                  key={reason}
                                  type="button"
                                  onClick={() => {
                                    setBlockForm({...blockForm, reason});
                                    setOpenReasonDropdown(false);
                                  }}
                                  className={`w-full px-4 py-3 text-sm text-left flex items-center justify-between hover:bg-white/5 transition-colors ${blockForm.reason === reason ? 'text-gold' : 'text-white/70'}`}
                                >
                                  {reason}
                                  {blockForm.reason === reason && <CheckCircle2 size={14} className="text-gold" />}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                   </div>

                   {/* Actions */}
                   <div className="pt-6 flex items-center justify-end gap-4">
                      <button 
                        type="button" 
                        onClick={() => setIsBlocking(false)}
                        className="px-6 py-4 border border-admin-border rounded-xl hover:bg-white/[0.03] transition-all text-xs font-bold uppercase tracking-widest"
                      >
                         Annuler
                      </button>
                      <button 
                        type="submit" 
                        className="px-8 py-4 bg-gold text-black rounded-xl hover:bg-gold-light transition-all text-xs font-bold uppercase tracking-widest shadow-xl shadow-gold/10"
                      >
                         Bloquer la période
                      </button>
                   </div>
                </form>
             </motion.div>
          </>
        )}
      </AnimatePresence>

      <AdminToast show={toast.show} type={toast.type} message={toast.message} onClose={hideToast} />
      <AdminConfirmModal
        show={confirmState.show}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
        onConfirm={confirmState.onConfirm}
        onCancel={hideConfirm}
      />
    </div>
  );
}
