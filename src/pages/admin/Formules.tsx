import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminToast, AdminConfirmModal, useAdminToast, useAdminConfirm } from '../../components/admin/AdminModal';
import { adminFetch } from '../../utils/apiClient';
import {
  Plus, Minus, Trash2, Edit3, Package, CheckCircle2, DollarSign,
  X, ChevronDown, Star, Search
} from "lucide-react";

interface FormuleData {
  _id?: string;
  name: string;
  suiteName: string;
  description: string;
  price: number;
  billingType: 'nuit' | 'apres_midi' | 'forfait';
  features: string[];
  imageUrl: string;
  isPopular: boolean;
  status: 'actif' | 'inactif';
  order: number;
}

const BILLING_LABELS: Record<string, string> = {
  nuit: 'Par nuit',
  apres_midi: 'Après-midi',
  forfait: 'Forfait fixe',
};

const emptyFormule: FormuleData = {
  name: '', suiteName: '', description: '', price: 189,
  billingType: 'nuit', features: [], imageUrl: '', isPopular: false,
  status: 'actif', order: 0,
};

export default function AdminFormules() {
  const [formules, setFormules] = useState<FormuleData[]>([]);
  const [suites, setSuites] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormuleData>(emptyFormule);
  const [featuresText, setFeaturesText] = useState('');
  const [openBilling, setOpenBilling] = useState(false);
  const [openSuite, setOpenSuite] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  const { toast, showToast, hideToast } = useAdminToast();
  const { confirm: confirmState, showConfirm, hideConfirm } = useAdminConfirm();

  const fetchFormules = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/formules');
      if (!res.ok) throw new Error('Erreur lors du chargement des formules');
      setFormules(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuites = async () => {
    try {
      const res = await adminFetch('/api/admin/suites');
      if (res.ok) {
        const data = await res.json();
        setSuites(Array.isArray(data) ? data.map((s: any) => ({ _id: s._id, name: s.name })) : []);
      }
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchFormules();
    fetchSuites();
  }, []);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({ ...emptyFormule, suiteName: suites[0]?.name || '' });
    setFeaturesText('');
    setIsAdding(true);
  };

  const handleOpenEdit = (f: FormuleData) => {
    setEditId(f._id || null);
    setFormData({ ...f });
    setFeaturesText((f.features || []).join('\n'));
    setIsAdding(true);
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    showConfirm({
      title: 'Supprimer cette formule',
      message: 'Cette action est irréversible. La formule sera retirée du tunnel de réservation.',
      onConfirm: async () => {
        hideConfirm();
        try {
          const res = await adminFetch(`/api/admin/formules/${id}`, { method: 'DELETE' });
          if (res.ok) {
            setFormules(formules.filter(f => f._id !== id));
            showToast('success', 'Formule supprimée.');
          } else showToast('error', "Erreur lors de la suppression");
        } catch {
          showToast('error', "Erreur réseau lors de la suppression");
        }
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.suiteName || !formData.price) {
      showToast('error', "Nom, suite et prix sont obligatoires.");
      return;
    }
    try {
      const endpoint = editId ? `/api/admin/formules/${editId}` : `/api/admin/formules`;
      const method = editId ? 'PUT' : 'POST';
      const res = await adminFetch(endpoint, { method, body: JSON.stringify(formData) });
      if (res.ok) {
        const saved = await res.json();
        if (editId) setFormules(formules.map(f => f._id === editId ? saved : f));
        else setFormules([...formules, saved]);
        setIsAdding(false);
        showToast('success', editId ? 'Formule modifiée.' : 'Formule créée.');
      } else showToast('error', "Erreur lors de l'enregistrement");
    } catch {
      showToast('error', "Erreur réseau lors de l'enregistrement");
    }
  };

  const filtered = formules.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.suiteName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const activeCount = formules.filter(f => f.status === 'actif').length;
  const avgPrice = formules.length > 0 ? Math.round(formules.reduce((a, f) => a + f.price, 0) / formules.length) : 0;

  return (
    <div className="space-y-10 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-admin-card p-6 border border-admin-border rounded-xl shadow-xl">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Offre principale</span>
          <h2 className="text-3xl sm:text-4xl font-serif">Formules</h2>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center gap-2 px-6 py-3.5 bg-gold text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all shadow-xl shadow-gold/10">
          <Plus size={16} /><span>Nouvelle Formule</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {[
          { label: "Formules Totales", value: formules.length.toString(), icon: Package },
          { label: "Formules Actives", value: activeCount.toString(), icon: CheckCircle2 },
          { label: "Prix Moyen", value: `${avgPrice} €`, icon: DollarSign },
        ].map((stat, i) => (
          <div key={i} className={`admin-card p-3 sm:p-6 flex flex-col items-center text-center gap-4 shadow-xl ${i === 2 ? 'col-span-2 sm:col-span-1' : ''}`}>
            <div className="p-3 w-fit rounded-xl bg-gold/10 text-gold"><stat.icon size={18} /></div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{stat.label}</p>
              <p className="text-2xl font-serif mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="admin-card p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8 border-b border-admin-border pb-6">
          <div className="relative group w-full md:w-96">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input type="text" placeholder="Rechercher une formule (nom ou suite)..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl pl-10 pr-4 py-3 text-sm focus:border-gold/30 transition-all text-white/80 focus:ring-0" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
        ) : error ? (
          <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-center">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-white/40 space-y-4"><Package size={48} className="text-white/20" /><p className="text-lg">Aucune formule</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-admin-border">
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Formule</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Suite</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Tarif</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Statut</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Prix</th>
                  <th className="pb-4 text-right text-[10px] uppercase tracking-widest text-white/20 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f, i) => (
                  <motion.tr key={f._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-admin-border/50 group hover:bg-white/[0.02] transition-all">
                    <td className="py-6 pr-4">
                      <span className="font-semibold text-base group-hover:text-gold transition-colors text-white/90 flex items-center gap-2">
                        {f.name}{f.isPopular && <Star size={12} className="text-gold fill-gold" />}
                      </span>
                    </td>
                    <td className="py-6 pr-4 text-sm text-white/60">{f.suiteName}</td>
                    <td className="py-6 pr-4 text-xs text-white/50">{BILLING_LABELS[f.billingType]}</td>
                    <td className="py-6 pr-4">
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${f.status === 'actif' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-rose-400/10 text-rose-400 border-rose-400/20'}`}>{f.status}</span>
                    </td>
                    <td className="py-6 font-serif text-lg text-gold pr-4">{f.price} €</td>
                    <td className="py-6 text-right space-x-2">
                      <button onClick={() => handleOpenEdit(f)} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-gold hover:text-black hover:border-gold transition-all text-white/60"><Edit3 size={14} /></button>
                      <button onClick={() => handleDelete(f._id)} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-all text-white/60"><Trash2 size={14} /></button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-[550px] bg-admin-bg border-l border-admin-border z-[110] p-6 sm:p-10 overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-10 border-b border-admin-border pb-6">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-bold">{editId ? "Modification" : "Création"}</span>
                  <h2 className="text-2xl font-serif">{editId ? "Modifier la Formule" : "Nouvelle Formule"}</h2>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-full hover:bg-rose-400/10 hover:text-rose-400 transition-all"><X size={20} /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Nom de la formule *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Nuit Complète" className="w-full bg-[#0D0D0D] border border-white/10 focus:border-gold rounded-xl px-5 py-4 text-sm text-white placeholder:text-white/20 outline-none transition-all shadow-inner font-medium" />
                </div>

                {/* Suite */}
                <div className="space-y-2 relative">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Suite rattachée *</label>
                  <button type="button" onClick={() => setOpenSuite(!openSuite)}
                    className="w-full flex items-center justify-between bg-[#0D0D0D] border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none transition-all shadow-inner font-medium cursor-pointer">
                    <span>{formData.suiteName || 'Choisir une suite'}</span>
                    <ChevronDown size={16} className={`text-white/40 transition-transform ${openSuite ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openSuite && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 py-1">
                        {suites.map(s => (
                          <button key={s._id} type="button" onClick={() => { setFormData({ ...formData, suiteName: s.name }); setOpenSuite(false); }}
                            className={`w-full text-left px-5 py-3 text-sm transition-all ${formData.suiteName === s.name ? 'bg-gold/10 text-gold font-bold' : 'text-white/80 hover:bg-white/[0.03]'}`}>{s.name}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Prix */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Prix (€) *</label>
                  <div className="flex items-center bg-[#0D0D0D] border border-white/10 focus-within:border-gold rounded-xl overflow-hidden shadow-inner w-full md:w-1/2">
                    <button type="button" onClick={() => setFormData({ ...formData, price: Math.max(0, formData.price - 5) })} className="px-4 py-4 text-white/40 hover:text-gold border-r border-white/5"><Minus size={16} /></button>
                    <input type="number" required min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-transparent px-4 py-4 text-center text-white outline-none font-serif text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    <button type="button" onClick={() => setFormData({ ...formData, price: formData.price + 5 })} className="px-4 py-4 text-white/40 hover:text-gold border-l border-white/5"><Plus size={16} /></button>
                  </div>
                </div>

                {/* Type de tarif */}
                <div className="space-y-2 relative">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Type de tarif</label>
                  <button type="button" onClick={() => setOpenBilling(!openBilling)}
                    className="w-full flex items-center justify-between bg-[#0D0D0D] border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none shadow-inner font-medium cursor-pointer">
                    <span>{BILLING_LABELS[formData.billingType]}</span>
                    <ChevronDown size={16} className={`text-white/40 transition-transform ${openBilling ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openBilling && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 py-1">
                        {(['nuit', 'apres_midi', 'forfait'] as const).map(bt => (
                          <button key={bt} type="button" onClick={() => { setFormData({ ...formData, billingType: bt }); setOpenBilling(false); }}
                            className={`w-full text-left px-5 py-3 text-sm transition-all ${formData.billingType === bt ? 'bg-gold/10 text-gold font-bold' : 'text-white/80 hover:bg-white/[0.03]'}`}>{BILLING_LABELS[bt]}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <p className="text-[10px] text-white/40">"Par nuit" est multiplié par le nombre de nuits. "Après-midi" / "Forfait" = prix fixe.</p>
                </div>

                {/* Statut */}
                <div className="space-y-2 relative">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Statut</label>
                  <button type="button" onClick={() => setOpenStatus(!openStatus)}
                    className="w-full flex items-center justify-between bg-[#0D0D0D] border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none shadow-inner font-medium cursor-pointer">
                    <span>{formData.status === 'actif' ? 'Actif (Visible sur le site)' : 'Inactif (Masqué)'}</span>
                    <ChevronDown size={16} className={`text-white/40 transition-transform ${openStatus ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openStatus && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 py-1">
                        {[{ value: 'actif', label: 'Actif (Visible sur le site)' }, { value: 'inactif', label: 'Inactif (Masqué)' }].map(st => (
                          <button key={st.value} type="button" onClick={() => { setFormData({ ...formData, status: st.value as any }); setOpenStatus(false); }}
                            className={`w-full text-left px-5 py-3 text-sm transition-all ${formData.status === st.value ? 'bg-gold/10 text-gold font-bold' : 'text-white/80 hover:bg-white/[0.03]'}`}>{st.label}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Recommandé */}
                <div className="flex items-center justify-between bg-[#0D0D0D] border border-white/10 rounded-xl px-5 py-4 shadow-inner">
                  <label className="text-sm text-white font-bold flex items-center gap-2"><Star size={14} className="text-gold fill-gold" /> Mettre en avant (Recommandé)</label>
                  <button type="button" onClick={() => setFormData({ ...formData, isPopular: !formData.isPopular })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.isPopular ? 'bg-gold' : 'bg-white/10'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${formData.isPopular ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Description *</label>
                  <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez la formule..." className="w-full bg-[#0D0D0D] border border-white/10 focus:border-gold rounded-xl p-5 text-sm text-white placeholder:text-white/20 outline-none shadow-inner leading-relaxed font-light" />
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Ce qui est inclus (Un par ligne)</label>
                  <textarea rows={6} value={featuresText}
                    onChange={(e) => { setFeaturesText(e.target.value); setFormData({ ...formData, features: e.target.value.split('\n').filter(Boolean) }); }}
                    placeholder="ex: Champagne offert&#10;Balnéo privatif&#10;Ménage inclus" className="w-full bg-[#0D0D0D] border border-white/10 focus:border-gold rounded-xl p-5 text-sm text-white placeholder:text-white/20 outline-none shadow-inner leading-relaxed font-light" />
                </div>

                {/* Image */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-bold block">Image (URL)</label>
                  <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..." className="w-full bg-[#0D0D0D] border border-white/10 focus:border-gold rounded-xl px-5 py-4 text-sm text-white placeholder:text-white/20 outline-none shadow-inner" />
                </div>

                <div className="pt-6 flex items-center justify-end gap-4 border-t border-admin-border/50">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-4 border border-white/10 rounded-xl hover:bg-white/[0.03] transition-all text-xs font-bold uppercase tracking-widest text-white/80">Annuler</button>
                  <button type="submit" className="px-8 py-4 bg-gold text-black rounded-xl hover:bg-white transition-all text-xs font-bold uppercase tracking-widest shadow-xl shadow-gold/10">{editId ? "Enregistrer" : "Créer la formule"}</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AdminToast show={toast.show} type={toast.type} message={toast.message} onClose={hideToast} />
      <AdminConfirmModal show={confirmState.show} title={confirmState.title} message={confirmState.message} type={confirmState.type} onConfirm={confirmState.onConfirm} onCancel={hideConfirm} />
    </div>
  );
}
