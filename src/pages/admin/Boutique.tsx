import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminToast, AdminConfirmModal, useAdminToast, useAdminConfirm } from '../../components/admin/AdminModal';
import { API_URL } from '../../constants';
import {
  Plus,
  Minus,
  Trash2,
  Edit3,
  ShoppingBag,
  Package,
  Gift,
  Search,
  Filter,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Tag,
  DollarSign,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Image as ImageIcon
} from "lucide-react";

interface ServiceData {
  _id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  status: 'actif' | 'inactif';
  features?: string[];
  isPopular?: boolean;
}

interface ComparisonRowData {
  label: string;
  e: boolean;
  c: boolean;
  icon?: string;
}

export default function AdminBoutique() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Onglets et paramètres comparatif
  const [activeTab, setActiveTab] = useState<'prestations' | 'comparatif'>('prestations');
  const [comparisonTable, setComparisonTable] = useState<ComparisonRowData[]>([]);
  const [savingSettings, setSavingSettings] = useState(false);

  // Custom Dropdowns State
  const [openFormStatus, setOpenFormStatus] = useState(false);

  // Modal/Drawer State
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceData>({
    name: '',
    description: '',
    price: 189,
    imageUrl: '',
    status: 'actif',
    features: [],
    isPopular: false
  });
  const [featuresText, setFeaturesText] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const { toast, showToast, hideToast } = useAdminToast();
  const { confirm: confirmState, showConfirm, hideConfirm } = useAdminConfirm();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/services`);
      if (!res.ok) throw new Error('Erreur lors du chargement des services');
      const data = await res.json();
      setServices(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setComparisonTable(data.comparisonTable || []);
      }
    } catch (err) {
      console.error("Erreur de chargement des paramètres:", err);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchSettings();
  }, []);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({
      name: '',
      description: '',
      price: 189,
      imageUrl: '',
      status: 'actif',
      features: [],
      isPopular: false
    });
    setFeaturesText('');
    setIsAdding(true);
  };

  const handleOpenEdit = (srv: ServiceData) => {
    setEditId(srv._id || null);
    setFormData({
      name: srv.name,
      description: srv.description,
      price: srv.price,
      imageUrl: srv.imageUrl || '',
      status: srv.status,
      features: srv.features || [],
      isPopular: srv.isPopular || false
    });
    setFeaturesText(srv.features?.join('\n') || '');
    setIsAdding(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    showConfirm({
      title: 'Supprimer cette prestation',
      message: 'Cette action est irréversible. La prestation sera définitivement supprimée de votre catalogue.',
      onConfirm: async () => {
        hideConfirm();
        try {
          const token = localStorage.getItem('adminToken');
          const res = await fetch(`${API_URL}/api/admin/services/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setServices(services.filter(s => s._id !== id));
            showToast('success', 'Prestation supprimée avec succès.');
          } else {
            showToast('error', "Erreur lors de la suppression");
          }
        } catch (err) {
          showToast('error', "Erreur réseau lors de la suppression");
        }
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast('error', "Veuillez remplir le nom et le prix.");
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const url = editId
        ? `${API_URL}/api/admin/services/${editId}`
        : `${API_URL}/api/admin/services`;
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const savedService = await res.json();
        if (editId) {
          setServices(services.map(s => s._id === editId ? savedService : s));
        } else {
          setServices([...services, savedService]);
        }
        setIsAdding(false);
        showToast('success', editId ? 'Prestation modifiée avec succès.' : 'Prestation créée avec succès.');
      } else {
        showToast('error', "Erreur lors de l'enregistrement");
      }
    } catch (err) {
      showToast('error', "Erreur réseau lors de l'enregistrement");
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comparisonTable })
      });

      if (res.ok) {
        showToast('success', "Tableau comparatif mis à jour avec succès !");
      } else {
        showToast('error', "Erreur lors de la mise à jour");
      }
    } catch (err) {
      showToast('error', "Erreur réseau lors de la mise à jour");
    } finally {
      setSavingSettings(false);
    }
  };

  // Cloudinary Direct Upload pour l'image du service
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const uploadPreset = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET || 'maison_love_room';
    const cloudName = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME || 'djks8n2nh';

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', uploadPreset);
    data.append('cloud_name', cloudName);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: data
      });
      const uploaded = await res.json();
      if (uploaded.secure_url) {
        setFormData({ ...formData, imageUrl: uploaded.secure_url });
      } else {
        showToast('error', "Erreur Cloudinary: " + (uploaded.error?.message || "Upload échoué"));
      }
    } catch (err) {
      showToast('error', "Erreur réseau lors de l'upload de l'image");
    } finally {
      setUploadingImage(false);
    }
  };

  // Filtrage
  const filteredServices = services.filter(srv => {
    return srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination Calculations
  const totalItems = filteredServices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [services, totalPages]);

  // Statistiques dynamiques
  const activeCount = services.filter(s => s.status === 'actif').length;
  const avgPrice = services.length > 0 ? Math.round(services.reduce((acc, s) => acc + s.price, 0) / services.length) : 0;

  return (
    <div className="space-y-10 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-admin-card p-6 border border-admin-border rounded-xl shadow-xl">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Produits & Services</span>
          <h2 className="text-3xl sm:text-4xl font-serif">Boutique & Prestations</h2>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3.5 bg-gold text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all shadow-xl shadow-gold/10"
        >
          <Plus size={16} />
          <span>Nouvelle Prestation</span>
        </button>
      </div>

      {/* Onglets */}
      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('prestations')}
          className={`pb-2 px-4 border-b-2 transition-all font-bold tracking-wide ${activeTab === 'prestations' ? 'border-gold text-gold' : 'border-transparent text-white/50 hover:text-white'}`}
        >
          Liste des Prestations
        </button>
        <button
          onClick={() => setActiveTab('comparatif')}
          className={`pb-2 px-4 border-b-2 transition-all font-bold tracking-wide ${activeTab === 'comparatif' ? 'border-gold text-gold' : 'border-transparent text-white/50 hover:text-white'}`}
        >
          Tableau Comparatif (Expérience)
        </button>
      </div>

      {activeTab === 'prestations' && (
        <>
          {/* Statistiques */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {[
          { label: "Prestations Totales", value: services.length.toString(), icon: Package },
          { label: "Services Actifs", value: activeCount.toString(), icon: CheckCircle2 },
          { label: "Prix Moyen", value: `${avgPrice}€`, icon: DollarSign },
        ].map((stat, i) => (
          <div key={i} className={`admin-card p-3 sm:p-6 flex flex-col items-center text-center gap-4 shadow-xl ${i === 2 ? 'col-span-2 sm:col-span-1' : ''}`}>
            <div className="p-3 w-fit rounded-xl bg-gold/10 text-gold">
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{stat.label}</p>
              <p className="text-2xl font-serif mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres et Recherche */}
      <div className="admin-card p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-8 border-b border-admin-border pb-6">
          <div className="relative group w-full md:w-96">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="Rechercher une prestation par nom ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl pl-10 pr-4 py-3 text-sm focus:border-gold/30 transition-all text-white/80 focus:ring-0"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-center">
            {error}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-white/40 space-y-4">
            <Package size={48} className="text-white/20" />
            <p className="text-lg">Aucune prestation trouvée</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-admin-border">
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Image / Prestation</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Description</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Statut</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Prix</th>
                  <th className="pb-4 text-right text-[10px] uppercase tracking-widest text-white/20 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedServices.map((prod, i) => (
                  <motion.tr
                    key={prod._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-admin-border/50 group hover:bg-white/[0.02] transition-all"
                  >
                    <td className="py-6 flex flex-col justify-center gap-1 pr-4">
                      <span className="font-semibold text-base group-hover:text-gold transition-colors text-white/90 flex items-center gap-2">
                        {prod.name}
                        {prod.isPopular && <Star size={12} className="text-gold fill-gold" title="Recommandé" />}
                      </span>
                    </td>
                    <td className="py-6 pr-4 max-w-xs">
                      <p className="text-xs text-white/60 line-clamp-2">{prod.description}</p>
                    </td>
                    <td className="py-6 pr-4">
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${prod.status === 'actif'
                        ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                        : 'bg-rose-400/10 text-rose-400 border-rose-400/20'
                        }`}>
                        {prod.status}
                      </span>
                    </td>
                    <td className="py-6 font-serif text-lg text-gold pr-4">{prod.price}€</td>
                    <td className="py-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-gold hover:text-black hover:border-gold transition-all text-white/60"
                        title="Modifier"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-all text-white/60"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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
      </>
      )}

      {activeTab === 'comparatif' && (
        <div className="admin-card p-8 shadow-2xl space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-admin-border pb-6 gap-4">
            <div>
              <h3 className="text-2xl font-serif">Configuration du Tableau Comparatif</h3>
              <p className="text-sm text-white/50 mt-1">Gérez les lignes du tableau affiché sur la page Expérience et cochez ce qui est inclus dans chaque formule.</p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-6 py-3 bg-gold text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              {savingSettings ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>

          <div className="space-y-4">
            {/* Table Header mock */}
            <div className="hidden sm:flex gap-6 px-5 py-2 text-[10px] uppercase tracking-widest text-white/40 font-bold border-b border-white/5">
               <div className="flex-1 min-w-[250px]">Prestation</div>
               <div className="w-[120px] text-center">Essentielle</div>
               <div className="w-[120px] text-center text-gold">Complète</div>
               <div className="w-[40px]"></div>
            </div>

            {comparisonTable.map((row, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-6 bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl items-start sm:items-center">
                <div className="flex-1 w-full min-w-[250px]">
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => {
                      const newTable = [...comparisonTable];
                      newTable[idx].label = e.target.value;
                      setComparisonTable(newTable);
                    }}
                    placeholder="ex: Bouteille de Champagne"
                    className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-gold transition-colors"
                  />
                </div>
                
                <div className="flex gap-6 w-full sm:w-auto">
                   <label className="flex-1 sm:w-[120px] flex flex-col sm:flex-row items-center justify-center gap-3 cursor-pointer group">
                     <span className="sm:hidden text-[10px] uppercase text-white/40">Essentielle</span>
                     <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${row.e ? 'bg-gold/20 border-gold text-gold' : 'border-white/20 text-transparent group-hover:border-white/40'}`}>
                       <input 
                         type="checkbox" 
                         className="hidden"
                         checked={row.e}
                         onChange={(e) => {
                            const newTable = [...comparisonTable];
                            newTable[idx].e = e.target.checked;
                            setComparisonTable(newTable);
                         }}
                       />
                       <CheckCircle2 size={14} />
                     </div>
                   </label>
                   
                   <label className="flex-1 sm:w-[120px] flex flex-col sm:flex-row items-center justify-center gap-3 cursor-pointer group">
                     <span className="sm:hidden text-[10px] uppercase text-gold">Complète</span>
                     <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${row.c ? 'bg-gold border-gold text-black' : 'border-gold/30 text-transparent group-hover:border-gold/50'}`}>
                       <input 
                         type="checkbox" 
                         className="hidden"
                         checked={row.c}
                         onChange={(e) => {
                            const newTable = [...comparisonTable];
                            newTable[idx].c = e.target.checked;
                            setComparisonTable(newTable);
                         }}
                       />
                       <CheckCircle2 size={14} />
                     </div>
                   </label>
                </div>

                <div className="pt-2 sm:pt-0 w-full sm:w-[40px] flex justify-end">
                  <button
                    onClick={() => {
                      const newTable = [...comparisonTable];
                      newTable.splice(idx, 1);
                      setComparisonTable(newTable);
                    }}
                    className="p-3 w-full sm:w-auto flex justify-center bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-all"
                    title="Supprimer la ligne"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => setComparisonTable([...comparisonTable, { label: '', e: false, c: false }])}
              className="w-full py-6 mt-4 border-2 border-dashed border-white/10 rounded-xl text-white/40 hover:bg-white/[0.02] hover:text-gold hover:border-gold/30 transition-all flex flex-col items-center justify-center gap-2"
            >
              <Plus size={24} />
              <span className="text-sm font-bold uppercase tracking-widest">Ajouter une ligne au tableau</span>
            </button>
          </div>
        </div>
      )}

      {/* Drawer Ajout / Modification */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
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
                  <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                    {editId ? "Modification" : "Création"}
                  </span>
                  <h2 className="text-2xl font-serif">
                    {editId ? "Modifier la Prestation" : "Nouvelle Prestation"}
                  </h2>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-full hover:bg-rose-400/10 hover:text-rose-400 transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                {/* Nom */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Nom de la prestation *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Formule Essentielle"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-gold rounded-xl px-5 py-4 text-sm text-white placeholder:text-white/20 outline-none transition-all shadow-inner font-medium"
                  />
                </div>

                {/* Prix */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Prix (€) *</label>
                  <div className="flex items-center bg-[#0D0D0D] border border-white/10 focus-within:border-gold rounded-xl overflow-hidden shadow-inner transition-all w-full md:w-1/2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, price: Math.max(0, formData.price - 5) })}
                      className="px-4 py-4 text-white/40 hover:text-gold hover:bg-white/[0.03] transition-all flex items-center justify-center border-r border-white/5"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="ex: 189"
                      className="w-full bg-transparent px-4 py-4 text-center text-sm text-white placeholder:text-white/20 outline-none font-serif text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, price: formData.price + 5 })}
                      className="px-4 py-4 text-white/40 hover:text-gold hover:bg-white/[0.03] transition-all flex items-center justify-center border-l border-white/5"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Statut */}
                <div className="space-y-2 relative">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Statut</label>
                  <button
                    type="button"
                    onClick={() => setOpenFormStatus(!openFormStatus)}
                    className="w-full flex items-center justify-between bg-[#0D0D0D] border border-white/10 focus:border-gold rounded-xl px-5 py-4 text-sm text-white outline-none transition-all shadow-inner font-medium cursor-pointer"
                  >
                    <span>{formData.status === 'actif' ? 'Actif (Visible sur le site)' : 'Inactif (Masqué)'}</span>
                    <ChevronDown size={16} className={`text-white/40 transition-transform duration-300 ${openFormStatus ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFormStatus && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 py-1"
                      >
                        {[
                          { value: 'actif', label: 'Actif (Visible sur le site)' },
                          { value: 'inactif', label: 'Inactif (Masqué)' }
                        ].map((st) => (
                          <button
                            key={st.value}
                            type="button"
                            onClick={() => { setFormData({ ...formData, status: st.value as any }); setOpenFormStatus(false); }}
                            className={`w-full text-left px-5 py-3 text-sm transition-all ${formData.status === st.value ? 'bg-gold/10 text-gold font-bold' : 'text-white/80 hover:bg-white/[0.03] hover:text-white'}`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Recommandé (isPopular) */}
                <div className="flex items-center justify-between bg-[#0D0D0D] border border-white/10 rounded-xl px-5 py-4 shadow-inner">
                  <div className="space-y-1">
                    <label className="text-sm text-white font-bold block flex items-center gap-2">
                      <Star size={14} className="text-gold fill-gold" />
                      Mettre en avant (Recommandé)
                    </label>
                    <p className="text-[10px] text-white/40">Afficher cette prestation avec un badge spécial "Recommandé"</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPopular: !formData.isPopular })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.isPopular ? 'bg-gold' : 'bg-white/10'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${formData.isPopular ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez l'expérience ou le produit offert au client..."
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-gold rounded-xl p-5 text-sm text-white placeholder:text-white/20 outline-none transition-all shadow-inner leading-relaxed font-light"
                  />
                </div>

                {/* Fonctionnalités / Atouts */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Fonctionnalités / Atouts (Un par ligne)</label>
                  <textarea
                    rows={5}
                    value={featuresText}
                    onChange={(e) => {
                      setFeaturesText(e.target.value);
                      setFormData({ ...formData, features: e.target.value.split('\n').filter(Boolean) });
                    }}
                    placeholder="ex: Arrivée 18h / Départ 11h&#10;Accès Balnéo privatif illimité&#10;Champagne inclus"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-gold rounded-xl p-5 text-sm text-white placeholder:text-white/20 outline-none transition-all shadow-inner leading-relaxed font-light"
                  />
                </div>

                {/* Actions */}
                <div className="pt-6 flex items-center justify-end gap-4 border-t border-admin-border/50">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-6 py-4 border border-white/10 rounded-xl hover:bg-white/[0.03] hover:border-white/20 transition-all text-xs font-bold uppercase tracking-widest text-white/80"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gold text-black rounded-xl hover:bg-white hover:text-black transition-all duration-500 text-xs font-bold uppercase tracking-widest shadow-xl shadow-gold/10"
                  >
                    {editId ? "Enregistrer les modifications" : "Créer la prestation"}
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
