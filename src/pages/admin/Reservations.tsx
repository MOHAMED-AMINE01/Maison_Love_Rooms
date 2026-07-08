import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { AdminToast, AdminConfirmModal, useAdminToast, useAdminConfirm } from '../../components/admin/AdminModal';
import CustomDatePicker from '../../components/ui/CustomDatePicker';
import { API_URL } from '../../constants';
import { adminFetch } from '../../utils/apiClient';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowRight, 
  X, 
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Heart,
  ShieldCheck,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Save,
  Users,
  Sparkles,
  MessageSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Star
} from "lucide-react";

interface Reservation {
  _id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  suiteName: string;
  checkIn: string;
  checkOut: string;
  arrivalTime?: string;
  numberOfPersons: number;
  services: string[];
  formuleName?: string;
  formulePrice?: number;
  prestations?: { name: string; unitPrice: number; quantity: number; variant?: string; lineTotal: number }[];
  occasion?: string;
  specialRequest?: string;
  internalNote?: string;
  totalPrice: number;
  consentGiven?: boolean;
  status: 'en_attente' | 'confirmee' | 'validee' | 'annulee' | 'terminee';
  createdAt: string;
}

interface Suite {
  _id: string;
  name: string;
  pricePerNight: number;
}

export default function AdminReservations() {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'new') {
      setIsAdding(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [suites, setSuites] = useState<Suite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('tous');
  
  // State pour l'édition dans le tiroir
  const [updating, setUpdating] = useState(false);
  const [internalNote, setInternalNote] = useState('');
  const [status, setStatus] = useState<any>('');

  // State pour l'ajout d'une réservation manuelle
  const [isAdding, setIsAdding] = useState(false);
  const [addingRes, setAddingRes] = useState(false);
  const [openSuiteDropdown, setOpenSuiteDropdown] = useState(false);
  const [openAddStatusDropdown, setOpenAddStatusDropdown] = useState(false);
  const [maxNights, setMaxNights] = useState(2);
  const [selectedFormula, setSelectedFormula] = useState<'essentielle' | 'complete'>('essentielle');
  const [openFormulaDropdown, setOpenFormulaDropdown] = useState(false);
  const [newResData, setNewResData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    suiteName: '',
    checkIn: '',
    checkOut: '',
    numberOfPersons: 2,
    services: [] as string[],
    specialRequest: '',
    internalNote: '',
    totalPrice: 189,
    status: 'confirmee' as any
  });

  const { toast, showToast, hideToast } = useAdminToast();
  const { confirm: confirmState, showConfirm, hideConfirm } = useAdminConfirm();
  const [openFilterDropdown, setOpenFilterDropdown] = useState(false);
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);

  // Charger les réservations & suites
  const fetchData = async () => {
    setLoading(true);
    try {
      
      
      // 1. Fetch Reservations
      const resReservations = await adminFetch('/api/admin/reservations');
      if (resReservations.ok) {
        const dataRes = await resReservations.json();
        setReservations(dataRes);
      }

      // 2. Fetch Suites
      const resSuites = await adminFetch('/api/admin/suites');
      if (resSuites.ok) {
        const dataSuites = await resSuites.json();
        setSuites(dataSuites);
        if (dataSuites.length > 0) {
          setNewResData(prev => ({ ...prev, suiteName: dataSuites[0].name }));
        }
      }

      // 3. Fetch Settings for maxNights
      const resSettings = await fetch(`${API_URL}/api/settings`);
      if (resSettings.ok) {
        const dataSettings = await resSettings.json();
        if (dataSettings && dataSettings.maxNights !== undefined) {
          setMaxNights(dataSettings.maxNights);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calcul automatique du prix total pour la création manuelle
  useEffect(() => {
    if (!isAdding) return;
    const selectedSuite = suites.find(s => s.name === newResData.suiteName) || { pricePerNight: 189 };
    let basePrice = selectedSuite.pricePerNight || 189;
    if (selectedFormula === 'complete') {
      basePrice += 110;
    }
    
    let nights = 1;
    if (newResData.checkIn && newResData.checkOut) {
      const diffTime = new Date(newResData.checkOut).getTime() - new Date(newResData.checkIn).getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) nights = diffDays;
    }

    let servicesCost = 0;
    if (newResData.services.includes('Pétales de Roses')) servicesCost += 40;
    if (newResData.services.includes('Love Box')) servicesCost += 50;
    if (newResData.services.includes('Champagne Premium')) servicesCost += 70;
    if (newResData.services.includes('Dîner aux chandelles')) servicesCost += 90;

    const calculated = (basePrice * nights) + servicesCost;
    setNewResData(prev => ({ ...prev, totalPrice: calculated }));
  }, [newResData.checkIn, newResData.checkOut, newResData.suiteName, newResData.services, selectedFormula, isAdding, suites]);

  const handleOpenDrawer = (res: Reservation) => {
    setSelectedRes(res);
    setInternalNote(res.internalNote || '');
    setStatus(res.status);
  };

  const handleUpdateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRes) return;
    setUpdating(true);
    try {
      
      const res = await adminFetch(`/api/admin/reservations/${selectedRes._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...selectedRes,
          status,
          internalNote
        })
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour');
      const data = await res.json();
      // La réponse est maintenant { reservation, refund } 
      const updated = data.reservation ?? data;
      setReservations(reservations.map(r => r._id === updated._id ? updated : r));
      setSelectedRes(updated);
      if (data.refund) {
        showToast('success', `Réservation annulée & remboursée automatiquement sur Stripe (ID: ${data.refund.id}) ✓`);
      } else {
        showToast('success', 'Réservation mise à jour avec succès !');
      }
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingRes(true);
    try {
      
      const payload = {
        ...newResData,
        specialRequest: newResData.specialRequest 
          ? `Formule : ${selectedFormula}\n${newResData.specialRequest}` 
          : `Formule : ${selectedFormula}`
      };
      const res = await adminFetch('/api/admin/reservations', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Erreur lors de la création de la réservation");
      const created = await res.json();
      setReservations([created, ...reservations]);
      setIsAdding(false);
      // Reset form
      setNewResData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        suiteName: suites[0]?.name || '',
        checkIn: '',
        checkOut: '',
        numberOfPersons: 2,
        services: [],
        specialRequest: '',
        internalNote: '',
        totalPrice: 189,
        status: 'confirmee'
      });
      setSelectedFormula('essentielle');
      showToast('success', 'Nouvelle réservation manuelle enregistrée !');
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setAddingRes(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    showConfirm({
      title: 'Supprimer cette réservation',
      message: 'Cette action est irréversible. La réservation sera définitivement supprimée de l\'historique.',
      onConfirm: async () => {
        hideConfirm();
        try {
          
          const res = await adminFetch(`/api/admin/reservations/${id}`, {
            method: 'DELETE'
          });
          if (!res.ok) throw new Error('Erreur lors du traitement');
          setReservations(reservations.filter(r => r._id !== id));
          if (selectedRes?._id === id) setSelectedRes(null);
          showToast('success', 'Réservation supprimée avec succès.');
        } catch (err: any) {
          showToast('error', err.message);
        }
      }
    });
  };

  const toggleService = (srv: string) => {
    if (newResData.services.includes(srv)) {
      setNewResData({ ...newResData, services: newResData.services.filter(s => s !== srv) });
    } else {
      setNewResData({ ...newResData, services: [...newResData.services, srv] });
    }
  };

  // Filtrage
  const filteredReservations = reservations.filter(res => {
    const matchSearch = res.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        res.suiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        res._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'tous' || res.status === statusFilter || (statusFilter === 'confirmee' && res.status === 'validee');
    return matchSearch && matchStatus;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const totalItems = filteredReservations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReservations = filteredReservations.slice(startIndex, endIndex);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmee':
      case 'validee':
        return <span className="bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">Confirmée</span>;
      case 'en_attente':
        return <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">En attente</span>;
      case 'annulee':
        return <span className="bg-rose-400/10 text-rose-400 border border-rose-400/20 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">Annulée</span>;
      case 'terminee':
        return <span className="bg-blue-400/10 text-blue-400 border border-blue-400/20 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">Terminée</span>;
      default:
        return <span className="bg-white/10 text-white border border-white/20 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-center bg-admin-card p-6 border border-admin-border rounded-xl shadow-xl">
        <div className="relative group flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
          <input 
            type="text" 
            placeholder="Rechercher par client, ID ou chambre..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.05] focus:border-gold/30 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-0 transition-all text-white/80 outline-none" 
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 justify-end">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenFilterDropdown(!openFilterDropdown)}
              className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm text-white/80 hover:border-white/10 transition-all cursor-pointer outline-none"
            >
              <Filter size={16} className="text-white/40" />
              <span>{statusFilter === 'tous' ? 'Tous les statuts' : statusFilter === 'en_attente' ? 'En attente' : statusFilter === 'confirmee' ? 'Confirmée' : statusFilter === 'annulee' ? 'Annulée' : 'Terminée'}</span>
              <ChevronDown size={14} className={`text-white/40 transition-transform ${openFilterDropdown ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openFilterDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-50 top-full right-0 mt-2 min-w-[180px] bg-[#0D121E] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60"
                >
                  {[
                    { value: 'tous', label: 'Tous les statuts' },
                    { value: 'en_attente', label: 'En attente' },
                    { value: 'confirmee', label: 'Confirmée' },
                    { value: 'annulee', label: 'Annulée' },
                    { value: 'terminee', label: 'Terminée' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setStatusFilter(opt.value); setOpenFilterDropdown(false); }}
                      className={`w-full px-4 py-3 text-sm text-left flex items-center justify-between hover:bg-white/5 transition-colors ${statusFilter === opt.value ? 'text-gold' : 'text-white/70'}`}
                    >
                      {opt.label}
                      {statusFilter === opt.value && <CheckCircle2 size={14} className="text-gold" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsAdding(true)} 
            className="flex items-center gap-2 px-5 py-3 bg-gold text-black rounded-xl hover:bg-gold-light transition-all text-sm font-semibold shadow-lg shadow-gold/5 cursor-pointer"
          >
             <Plus size={16} />
             <span>Nouvelle Réservation</span>
          </button>
        </div>
      </div>

      {/* Table & Grid view */}
      <div className="admin-card p-6 sm:p-8 min-h-[600px] shadow-2xl">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-center">
            {error}
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-white/40 space-y-4">
            <Calendar size={48} className="text-white/20" />
            <p className="text-lg">Aucune réservation trouvée</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-admin-border">
                    <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Client / ID</th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Hébergement</th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Séjour</th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Options</th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Statut</th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Total</th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReservations.map((res, i) => (
                    <motion.tr 
                      key={res._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group border-b border-admin-border/50 hover:bg-white/[0.02] transition-all cursor-pointer"
                      onClick={() => handleOpenDrawer(res)}
                    >
                      <td className="py-6 pr-4">
                        <p className="text-sm font-semibold group-hover:text-gold transition-colors">{res.clientName}</p>
                        <p className="text-[10px] font-mono text-white/20 mt-1">#{res._id.slice(-6).toUpperCase()}</p>
                      </td>
                      <td className="py-6 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gold/40" />
                          <span className="text-sm font-medium text-white/80">{res.suiteName}</span>
                        </div>
                      </td>
                      <td className="py-6 pr-4">
                        <p className="text-xs text-white/80">{formatDate(res.checkIn)} - {formatDate(res.checkOut)}</p>
                        <div className="flex items-center gap-1 text-[10px] text-white/40 mt-1">
                          <Users size={12} />
                          <span>{res.numberOfPersons} pers.</span>
                        </div>
                      </td>
                      <td className="py-6 pr-4">
                        <div className="flex flex-wrap gap-1">
                          {res.services && res.services.length > 0 ? (
                            res.services.map((srv, idx) => (
                              <span key={idx} className="bg-gold/10 text-gold border border-gold/20 text-[9px] px-2 py-0.5 rounded font-medium">
                                {srv}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-white/20 italic">Aucune option</span>
                          )}
                        </div>
                      </td>
                      <td className="py-6 pr-4">
                        {getStatusBadge(res.status)}
                      </td>
                      <td className="py-6 pr-4">
                        <p className="text-base font-serif text-gold">{res.totalPrice}€</p>
                      </td>
                      <td className="py-6 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => handleDelete(res._id, e)}
                            className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-all text-white/40 cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleOpenDrawer(res)}
                            className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-gold hover:text-black transition-all cursor-pointer"
                          >
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Beautiful Card Grid View */}
            <div className="block lg:hidden space-y-4">
              {paginatedReservations.map((res, i) => (
                <motion.div
                  key={res._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleOpenDrawer(res)}
                  className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 hover:border-gold/30 transition-all cursor-pointer space-y-4 relative group"
                >
                  {/* Header Row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold group-hover:text-gold transition-colors text-white">{res.clientName}</h4>
                      <p className="text-[10px] font-mono text-white/30 mt-0.5">#{res._id.slice(-6).toUpperCase()}</p>
                    </div>
                    {getStatusBadge(res.status)}
                  </div>

                  {/* Accommodation & Pricing */}
                  <div className="flex items-center justify-between border-t border-b border-white/5 py-3.5 my-1">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold block">Hébergement</span>
                      <span className="text-xs font-semibold text-white/80">{res.suiteName}</span>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold block">Total</span>
                      <span className="text-base font-serif text-gold font-bold">{res.totalPrice}€</span>
                    </div>
                  </div>

                  {/* Dates Row */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold block">Arrivée</span>
                      <span className="text-white/80 font-medium">{formatDate(res.checkIn)}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold block">Départ</span>
                      <span className="text-white/80 font-medium">{formatDate(res.checkOut)}</span>
                    </div>
                  </div>

                  {/* Options & Action Row */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-wrap gap-1 max-w-[70%]">
                      {res.services && res.services.length > 0 ? (
                        res.services.slice(0, 2).map((srv, idx) => (
                          <span key={idx} className="bg-gold/10 text-gold border border-gold/20 text-[8px] px-2 py-0.5 rounded font-medium truncate max-w-[100px]">
                            {srv}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] text-white/20 italic">Aucune option</span>
                      )}
                      {res.services && res.services.length > 2 && (
                        <span className="text-[8px] bg-white/5 border border-white/10 text-white/40 px-1.5 py-0.5 rounded">
                          +{res.services.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={(e) => handleDelete(res._id, e)}
                        className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-all text-white/30 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                      <button 
                        onClick={() => handleOpenDrawer(res)}
                        className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-gold hover:text-black transition-all cursor-pointer flex items-center justify-center"
                      >
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controller */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-6 mt-8 gap-4 select-none">
                <span className="text-xs text-white/40">
                  Affichage de <span className="font-semibold text-white">{startIndex + 1}</span> à <span className="font-semibold text-white">{Math.min(endIndex, totalItems)}</span> sur <span className="font-semibold text-white">{totalItems}</span> entrées
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`p-2.5 rounded-xl border border-white/[0.05] transition-all flex items-center justify-center cursor-pointer ${
                      currentPage === 1 
                        ? 'text-white/20 bg-white/[0.01] pointer-events-none' 
                        : 'text-white/60 bg-white/[0.03] hover:border-gold hover:text-gold hover:bg-gold/5'
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-[40px] h-[40px] rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer border ${
                          currentPage === pageNum
                            ? 'bg-gold text-black border-gold shadow-[0_0_15px_rgba(188,155,93,0.25)]'
                            : 'bg-white/[0.03] border-white/[0.05] text-white/60 hover:border-gold/30 hover:text-gold hover:bg-gold/5'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2.5 rounded-xl border border-white/[0.05] transition-all flex items-center justify-center cursor-pointer ${
                      currentPage === totalPages 
                        ? 'text-white/20 bg-white/[0.01] pointer-events-none' 
                        : 'text-white/60 bg-white/[0.03] hover:border-gold hover:text-gold hover:bg-gold/5'
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL AJOUT RESERVATION MANUELLE */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-[120]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[700px] bg-admin-bg border border-admin-border z-[130] rounded-3xl p-6 sm:p-10 overflow-y-auto shadow-2xl max-w-full flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-6 border-b border-white/5 flex-shrink-0">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-gold font-bold">Ajout Manuel</span>
                  <h3 className="text-2xl font-serif text-white">Créer une Réservation</h3>
                </div>
                <button 
                  onClick={() => setIsAdding(false)} 
                  className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-full hover:bg-rose-400/10 hover:text-rose-400 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleCreateReservation} className="space-y-6 py-6 flex-1 overflow-y-auto pr-1">
                
                {/* Client Information */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest text-white/20 font-bold border-b border-white/5 pb-1">Coordonnées du Client</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Nom complet</label>
                      <input 
                        type="text" 
                        required
                        value={newResData.clientName}
                        onChange={e => setNewResData({ ...newResData, clientName: e.target.value })}
                        placeholder="Ex: Jean Dupont"
                        className="w-full bg-white/[0.03] border border-white/[0.05] focus:border-gold/30 rounded-xl px-4 py-3 text-sm text-white/80 outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Adresse Email</label>
                      <input 
                        type="email" 
                        required
                        value={newResData.clientEmail}
                        onChange={e => setNewResData({ ...newResData, clientEmail: e.target.value })}
                        placeholder="Ex: jean.dupont@email.com"
                        className="w-full bg-white/[0.03] border border-white/[0.05] focus:border-gold/30 rounded-xl px-4 py-3 text-sm text-white/80 outline-none" 
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Téléphone (Optionnel)</label>
                      <input 
                        type="text" 
                        value={newResData.clientPhone}
                        onChange={e => setNewResData({ ...newResData, clientPhone: e.target.value })}
                        placeholder="Ex: +33 6 12 34 56 78"
                        className="w-full bg-white/[0.03] border border-white/[0.05] focus:border-gold/30 rounded-xl px-4 py-3 text-sm text-white/80 outline-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* Stay & Room Details */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-[10px] uppercase tracking-widest text-white/20 font-bold border-b border-white/5 pb-1">Hébergement & Dates</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    
                    {/* Suite Selector Dropdown */}
                    <div className="space-y-2 relative">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Sélectionner la Suite</label>
                      <button
                        type="button"
                        onClick={() => setOpenSuiteDropdown(!openSuiteDropdown)}
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white outline-none flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-semibold text-white">{newResData.suiteName || 'Sélectionner...'}</span>
                        <ChevronDown size={14} className={`text-white/40 transition-transform ${openSuiteDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openSuiteDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute z-[99] top-full left-0 right-0 mt-2 bg-[#0D121E] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60"
                          >
                            {suites.map(s => (
                              <button
                                key={s._id}
                                type="button"
                                onClick={() => {
                                  setNewResData({ ...newResData, suiteName: s.name });
                                  setOpenSuiteDropdown(false);
                                }}
                                className={`w-full px-4 py-3 text-sm text-left flex items-center justify-between hover:bg-white/5 transition-colors ${
                                  newResData.suiteName === s.name ? 'text-gold' : 'text-white/70'
                                }`}
                              >
                                <span>{s.name} ({s.pricePerNight}€/nuit)</span>
                                {newResData.suiteName === s.name && <CheckCircle2 size={14} className="text-gold" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Formula Selector Dropdown */}
                    <div className="space-y-2 relative">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Sélectionner la Formule</label>
                      <button
                        type="button"
                        onClick={() => setOpenFormulaDropdown(!openFormulaDropdown)}
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white outline-none flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-semibold text-white">
                          {selectedFormula === 'complete' ? 'Formule Complète (+110€/nuit)' : 'Formule Essentielle'}
                        </span>
                        <ChevronDown size={14} className={`text-white/40 transition-transform ${openFormulaDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openFormulaDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute z-[99] top-full left-0 right-0 mt-2 bg-[#0D121E] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60"
                          >
                            {[
                              { value: 'essentielle', label: 'Formule Essentielle' },
                              { value: 'complete', label: 'Formule Complète (+110€/nuit)' }
                            ].map(f => (
                              <button
                                key={f.value}
                                type="button"
                                onClick={() => {
                                  setSelectedFormula(f.value as any);
                                  setOpenFormulaDropdown(false);
                                }}
                                className={`w-full px-4 py-3 text-sm text-left flex items-center justify-between hover:bg-white/5 transition-colors ${
                                  selectedFormula === f.value ? 'text-gold' : 'text-white/70'
                                }`}
                              >
                                <span>{f.label}</span>
                                {selectedFormula === f.value && <CheckCircle2 size={14} className="text-gold" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Persons Incrementor */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold block">Nombre de Personnes (Max 2)</label>
                      <div className="flex items-center justify-between h-[46px] w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-2">
                        <button
                          type="button"
                          onClick={() => setNewResData(prev => ({ ...prev, numberOfPersons: Math.max(1, prev.numberOfPersons - 1) }))}
                          className="w-10 h-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/10 transition-colors text-white cursor-pointer select-none shrink-0"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="flex-1 text-center text-sm text-white font-semibold select-none">
                          {newResData.numberOfPersons} Pers.
                        </span>
                        <button
                          type="button"
                          onClick={() => setNewResData(prev => ({ ...prev, numberOfPersons: Math.min(2, prev.numberOfPersons + 1) }))}
                          className="w-10 h-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/10 transition-colors text-white cursor-pointer select-none shrink-0"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 relative z-[95]">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Date d'Arrivée (Check-In)</label>
                      <CustomDatePicker
                        value={newResData.checkIn}
                        variant="compact"
                        onChange={(val) => {
                          setNewResData(prev => {
                            let newCheckOut = prev.checkOut;
                            if (newCheckOut) {
                              const diff = (new Date(newCheckOut).getTime() - new Date(val).getTime()) / (1000 * 60 * 60 * 24);
                              if (val >= newCheckOut || diff > maxNights) {
                                newCheckOut = '';
                              }
                            }
                            return { ...prev, checkIn: val, checkOut: newCheckOut };
                          });
                        }}
                        minDate={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2 relative z-[95]">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Date de Départ (Check-Out) - Max {maxNights} nuits</label>
                      <CustomDatePicker
                        value={newResData.checkOut}
                        variant="compact"
                        onChange={(val) => setNewResData({ ...newResData, checkOut: val })}
                        minDate={(() => {
                          if (!newResData.checkIn) return new Date().toISOString().split('T')[0];
                          const date = new Date(newResData.checkIn);
                          date.setDate(date.getDate() + 1);
                          return date.toISOString().split('T')[0];
                        })()}
                        maxDate={(() => {
                          if (!newResData.checkIn) return undefined;
                          const date = new Date(newResData.checkIn);
                          date.setDate(date.getDate() + maxNights);
                          return date.toISOString().split('T')[0];
                        })()}
                      />
                    </div>

                     {/* Dynamic Price Indicator Card */}
                     <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-gold font-bold block">Prix Total Estimé</label>
                       <div className="flex items-center justify-between h-[46px] w-full bg-gold/5 border border-gold/20 rounded-xl px-4 select-none shadow-[0_0_15px_rgba(188,155,93,0.05)]">
                         <span className="text-sm text-gold font-bold font-serif">{newResData.totalPrice} € TTC</span>
                         <CreditCard size={14} className="text-gold/60" />
                       </div>
                     </div>

                  </div>
                </div>

                {/* Notes & Requests */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-[10px] uppercase tracking-widest text-white/20 font-bold border-b border-white/5 pb-1">Notes & Demandes</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Demandes Spéciales du client</label>
                      <textarea
                        value={newResData.specialRequest}
                        onChange={e => setNewResData({ ...newResData, specialRequest: e.target.value })}
                        placeholder="Allergies, surprise d'anniversaire, etc..."
                        rows={2}
                        className="w-full bg-white/[0.03] border border-white/[0.05] focus:border-gold/30 rounded-xl px-4 py-3 text-sm text-white/80 outline-none resize-none font-light"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Note Interne (Réservé Conciergerie)</label>
                      <textarea
                        value={newResData.internalNote}
                        onChange={e => setNewResData({ ...newResData, internalNote: e.target.value })}
                        placeholder="Notes privées..."
                        rows={2}
                        className="w-full bg-white/[0.03] border border-white/[0.05] focus:border-gold/30 rounded-xl px-4 py-3 text-sm text-white/80 outline-none resize-none font-light"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing & Status */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-[10px] uppercase tracking-widest text-white/20 font-bold border-b border-white/5 pb-1">Statut & Prix Final</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Status Dropdown */}
                    <div className="space-y-2 relative">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Statut Initial</label>
                      <button
                        type="button"
                        onClick={() => setOpenAddStatusDropdown(!openAddStatusDropdown)}
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white outline-none flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${newResData.status === 'confirmee' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          {newResData.status === 'confirmee' ? 'Confirmée' : 'En attente'}
                        </span>
                        <ChevronDown size={14} className={`text-white/40 transition-transform ${openAddStatusDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openAddStatusDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute z-[99] top-full left-0 right-0 mt-2 bg-[#0D121E] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60"
                          >
                            {[
                              { value: 'confirmee', label: 'Confirmée', color: 'bg-emerald-400' },
                              { value: 'en_attente', label: 'En attente', color: 'bg-amber-400' }
                            ].map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setNewResData({ ...newResData, status: opt.value as any });
                                  setOpenAddStatusDropdown(false);
                                }}
                                className={`w-full px-4 py-3 text-sm text-left flex items-center justify-between hover:bg-white/5 transition-colors ${
                                  newResData.status === opt.value ? 'text-gold' : 'text-white/70'
                                }`}
                              >
                                <span className="flex items-center gap-3">
                                  <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                                  {opt.label}
                                </span>
                                {newResData.status === opt.value && <CheckCircle2 size={14} className="text-gold" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Price Input with Manual Override */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold block">Prix Total Modifiable (€)</label>
                      <div className="flex items-center h-[46px] w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-2">
                        <button
                          type="button"
                          onClick={() => setNewResData(prev => ({ ...prev, totalPrice: Math.max(0, prev.totalPrice - 10) }))}
                          className="w-10 h-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/10 transition-colors text-white cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="text"
                          value={newResData.totalPrice}
                          onChange={e => {
                            const cleanVal = e.target.value.replace(/\D/g, '');
                            setNewResData({ ...newResData, totalPrice: cleanVal ? Number(cleanVal) : 0 });
                          }}
                          className="flex-1 text-center bg-transparent border-none text-sm text-gold font-serif outline-none focus:ring-0 w-full min-w-0"
                        />
                        <button
                          type="button"
                          onClick={() => setNewResData(prev => ({ ...prev, totalPrice: prev.totalPrice + 10 }))}
                          className="w-10 h-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/10 transition-colors text-white cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </form>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/5 flex-shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)} 
                  className="px-6 py-3.5 border border-admin-border rounded-xl hover:bg-white/[0.03] transition-all text-xs font-bold uppercase tracking-widest cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleCreateReservation}
                  disabled={addingRes || !newResData.clientName || !newResData.clientEmail || !newResData.checkIn || !newResData.checkOut}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gold text-black rounded-xl hover:bg-gold-light transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-30 disabled:hover:bg-gold shadow-xl shadow-gold/10 cursor-pointer"
                >
                  {addingRes ? 'Création...' : 'Créer la réservation'}
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Drawer d'inspection et modification */}
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
               className="fixed top-0 right-0 h-full w-full max-w-[550px] bg-admin-bg border-l border-admin-border z-[110] p-6 sm:p-10 overflow-y-auto shadow-2xl"
             >
                <div className="flex justify-between items-center mb-10 border-b border-admin-border pb-6">
                   <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Détails de la demande</span>
                      <h2 className="text-2xl font-serif">#{selectedRes._id.slice(-6).toUpperCase()}</h2>
                   </div>
                   <button onClick={() => setSelectedRes(null)} className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-full hover:bg-rose-400/10 hover:text-rose-400 transition-all cursor-pointer">
                      <X size={20} />
                   </button>
                </div>

                <form onSubmit={handleUpdateReservation} className="space-y-8">
                   {/* Statut de la réservation */}
                   <div className="admin-card p-6 space-y-4 border border-gold/20 bg-gold/[0.02]">
                      <label className="text-[10px] uppercase tracking-widest text-gold font-bold block">Statut de la réservation</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenStatusDropdown(!openStatusDropdown)}
                          className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm focus:border-gold transition-all text-white font-semibold flex items-center justify-between cursor-pointer outline-none"
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${status === 'confirmee' ? 'bg-emerald-400' : status === 'en_attente' ? 'bg-amber-400' : status === 'annulee' ? 'bg-rose-400' : 'bg-blue-400'}`} />
                            {status === 'en_attente' ? 'En attente' : status === 'confirmee' ? 'Confirmée' : status === 'annulee' ? 'Annulée' : 'Terminée'}
                          </span>
                          <ChevronDown size={14} className={`text-white/40 transition-transform ${openStatusDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {openStatusDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="absolute z-[99] top-full left-0 right-0 mt-2 bg-[#0D121E] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60"
                            >
                              {[
                                { value: 'en_attente', label: 'En attente', color: 'bg-amber-400' },
                                { value: 'confirmee', label: 'Confirmée', color: 'bg-emerald-400' },
                                { value: 'annulee', label: 'Annulée', color: 'bg-rose-400' },
                                { value: 'terminee', label: 'Terminée', color: 'bg-blue-400' },
                              ].map(opt => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => { setStatus(opt.value); setOpenStatusDropdown(false); }}
                                  className={`w-full px-4 py-3 text-sm text-left flex items-center justify-between hover:bg-white/5 transition-colors ${status === opt.value ? 'text-gold' : 'text-white/70'}`}
                                >
                                  <span className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                                    {opt.label}
                                  </span>
                                  {status === opt.value && <CheckCircle2 size={14} className="text-gold" />}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                   </div>

                   {/* Client Section */}
                   <div className="admin-card p-6 space-y-6">
                      <div className="flex items-center gap-4 border-b border-admin-border pb-4">
                         <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                            <User size={24} />
                         </div>
                         <div>
                            <h4 className="text-lg font-medium">{selectedRes.clientName}</h4>
                            <p className="text-xs text-white/40">Date de demande : {formatDate(selectedRes.createdAt || new Date().toISOString())}</p>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center gap-4">
                            <Mail size={16} className="text-white/20" />
                            <a href={`mailto:${selectedRes.clientEmail}`} className="text-sm text-gold hover:underline">{selectedRes.clientEmail}</a>
                         </div>
                         {selectedRes.clientPhone && (
                           <div className="flex items-center gap-4">
                              <Phone size={16} className="text-white/20" />
                              <a href={`tel:${selectedRes.clientPhone}`} className="text-sm text-white/80 hover:text-gold">{selectedRes.clientPhone}</a>
                           </div>
                         )}
                         {selectedRes.clientAddress && (
                           <div className="flex items-start gap-4">
                              <MapPin size={16} className="text-white/20 mt-0.5" />
                              <span className="text-sm text-white/80">{selectedRes.clientAddress}</span>
                           </div>
                         )}
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
                               <span className="text-sm font-medium">{selectedRes.suiteName}</span>
                            </div>
                         </div>
                         <div className="space-y-1">
                            <span className="text-[10px] text-white/30 uppercase font-bold">Personnes</span>
                            <div className="flex items-center gap-2">
                               <Users size={14} className="text-white/40" />
                               <span className="text-sm font-medium">{selectedRes.numberOfPersons} personne(s)</span>
                            </div>
                         </div>
                         {selectedRes.arrivalTime && (
                           <div className="space-y-1">
                              <span className="text-[10px] text-white/30 uppercase font-bold">Heure d'arrivée</span>
                              <div className="flex items-center gap-2">
                                 <Clock size={14} className="text-white/40" />
                                 <span className="text-sm font-medium">{selectedRes.arrivalTime}</span>
                              </div>
                           </div>
                         )}
                         {selectedRes.occasion && (
                           <div className="space-y-1">
                              <span className="text-[10px] text-white/30 uppercase font-bold">Occasion</span>
                              <div className="flex items-center gap-2">
                                 <Heart size={14} className="text-gold" />
                                 <span className="text-sm font-medium">{selectedRes.occasion}</span>
                              </div>
                           </div>
                         )}
                         <div className="col-span-2 space-y-1 border-t border-white/5 pt-4">
                            <span className="text-[10px] text-white/30 uppercase font-bold block mb-1">Période réservée</span>
                            <p className="text-sm text-white/80 font-medium">{formatDate(selectedRes.checkIn)} au {formatDate(selectedRes.checkOut)}</p>
                         </div>
                      </div>
                   </div>

                   {/* Formule choisie */}
                   {selectedRes.formuleName && (
                     <div className="space-y-4">
                        <h4 className="text-[10px] uppercase tracking-widest text-white/20 font-bold pl-2">Formule</h4>
                        <div className="admin-card p-6 flex items-center justify-between">
                           <div className="flex items-center gap-2 text-white/90 font-semibold">
                              <Star size={14} className="text-gold fill-gold" />
                              <span>{selectedRes.formuleName}</span>
                           </div>
                           {selectedRes.formulePrice != null && (
                              <span className="font-serif text-gold">{selectedRes.formulePrice}€</span>
                           )}
                        </div>
                     </div>
                   )}

                   {/* Prestations choisies */}
                   <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest text-white/20 font-bold pl-2">Prestations choisies</h4>
                      <div className="admin-card p-6 space-y-3">
                         {selectedRes.prestations && selectedRes.prestations.length > 0 ? (
                           selectedRes.prestations.map((p, idx) => (
                             <div key={idx} className="flex items-center justify-between gap-3 text-sm border-b border-white/5 last:border-0 pb-2 last:pb-0">
                               <span className="flex items-center gap-2 text-white/80">
                                 <Sparkles size={14} className="text-gold" />
                                 {p.name}{p.quantity > 1 ? ` × ${p.quantity}` : ''}
                               </span>
                               <span className="font-serif text-gold">{p.lineTotal}€</span>
                             </div>
                           ))
                         ) : selectedRes.services && selectedRes.services.length > 0 ? (
                           <div className="flex flex-wrap gap-2">
                             {selectedRes.services.map((srv, idx) => (
                               <div key={idx} className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-xl px-4 py-2 text-gold text-xs font-semibold">
                                 <Sparkles size={14} />
                                 <span>{srv}</span>
                               </div>
                             ))}
                           </div>
                         ) : (
                           <p className="text-xs text-white/40 italic">Aucune prestation sélectionnée par le client.</p>
                         )}
                      </div>
                   </div>

                   {/* Message / Demande spéciale du client */}
                   {selectedRes.specialRequest && (
                     <div className="space-y-4">
                        <h4 className="text-[10px] uppercase tracking-widest text-white/20 font-bold pl-2">Message du client</h4>
                        <div className="admin-card p-6 bg-white/[0.02] border-white/10">
                           <div className="flex gap-3 items-start text-sm text-white/80 italic">
                             <MessageSquare size={16} className="text-gold mt-1 flex-shrink-0" />
                             <p>{selectedRes.specialRequest}</p>
                           </div>
                        </div>
                     </div>
                   )}

                   {/* Consentement du client */}
                   {selectedRes.consentGiven && (
                     <div className="flex items-center gap-2 text-xs text-emerald-400/80 pl-2">
                        <ShieldCheck size={14} />
                        <span>Conditions & consentement RGPD acceptés par le client</span>
                     </div>
                   )}

                   {/* Note interne (Admin uniquement) */}
                   <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest text-gold font-bold pl-2">Note interne (Invisible pour le client)</h4>
                      <div className="admin-card p-6 space-y-4">
                         <textarea 
                           value={internalNote}
                           onChange={(e) => setInternalNote(e.target.value)}
                           placeholder="Ajouter une note de conciergerie (ex: Client VIP, bouteille offerte, attention aux allergies)..."
                           rows={4}
                           className="w-full bg-white/[0.03] border border-white/[0.05] focus:border-gold/30 rounded-xl p-4 text-sm text-white/80 focus:ring-0 transition-all placeholder:text-white/20 outline-none resize-none font-light"
                         />
                      </div>
                   </div>

                   {/* Billing Section */}
                   <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest text-white/20 font-bold pl-2">Finances</h4>
                      <div className="admin-card p-6 space-y-6 bg-gold/[0.02] border-gold/10">
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-white/60 font-medium">Montant total</span>
                            <span className="text-3xl font-serif text-gold">{selectedRes.totalPrice}€</span>
                         </div>
                      </div>
                   </div>

                   {/* Actions Group */}
                   <div className="pt-6 flex items-center justify-end gap-4">
                      <button 
                        type="button"
                        onClick={() => setSelectedRes(null)} 
                        className="px-6 py-4 border border-admin-border rounded-xl hover:bg-white/[0.03] transition-all text-xs font-bold uppercase tracking-widest cursor-pointer"
                      >
                         Annuler
                      </button>
                      <button 
                        type="submit"
                        disabled={updating}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-gold text-black rounded-xl hover:bg-gold-light transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-50 shadow-xl shadow-gold/10 cursor-pointer"
                      >
                         <Save size={16} />
                         {updating ? 'Enregistrement...' : 'Enregistrer les modifications'}
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
