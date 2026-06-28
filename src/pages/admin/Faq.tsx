import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
   Plus,
   Edit3,
   Trash2,
   X,
   Save,
   Loader,
   HelpCircle,
   ChevronDown,
   CheckCircle2,
   GripVertical
} from 'lucide-react';
import { AdminToast, AdminConfirmModal, useAdminToast, useAdminConfirm } from '../../components/admin/AdminModal';
import { adminFetch } from '../../utils/apiClient';

interface FaqData {
   _id?: string;
   question: string;
   answer: string;
   order: number;
   status: 'actif' | 'inactif';
}

const emptyForm: FaqData = {
   question: '',
   answer: '',
   order: 0,
   status: 'actif',
};

export default function AdminFaq() {
   const [faqs, setFaqs] = useState<FaqData[]>([]);
   const [loading, setLoading] = useState(true);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editId, setEditId] = useState<string | null>(null);
   const [formData, setFormData] = useState<FaqData>(emptyForm);
   const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
   const [saving, setSaving] = useState(false);

   const { toast, showToast, hideToast } = useAdminToast();
   const { confirm: confirmState, showConfirm, hideConfirm } = useAdminConfirm();

   const fetchFaqs = async () => {
      setLoading(true);
      try {
         const res = await adminFetch('/api/admin/faqs');
         if (res.ok) {
            const data = await res.json();
            setFaqs(Array.isArray(data) ? data : []);
         } else {
            showToast('error', 'Erreur lors du chargement des FAQ');
         }
      } catch (err) {
         showToast('error', 'Erreur réseau lors du chargement des FAQ');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchFaqs();
   }, []);

   const handleOpenAdd = () => {
      setEditId(null);
      // Nouvelle question placée en fin de liste par défaut
      const nextOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.order || 0)) + 1 : 1;
      setFormData({ ...emptyForm, order: nextOrder });
      setIsModalOpen(true);
   };

   const handleOpenEdit = (faq: FaqData) => {
      setEditId(faq._id || null);
      setFormData({
         question: faq.question,
         answer: faq.answer,
         order: faq.order || 0,
         status: faq.status || 'actif',
      });
      setIsModalOpen(true);
   };

   const handleSave = async () => {
      if (!formData.question.trim() || !formData.answer.trim()) {
         showToast('error', 'Veuillez remplir la question et la réponse.');
         return;
      }
      setSaving(true);
      try {
         const endpoint = editId ? `/api/admin/faqs/${editId}` : '/api/admin/faqs';
         const method = editId ? 'PUT' : 'POST';
         const res = await adminFetch(endpoint, {
            method,
            body: JSON.stringify(formData),
         });
         if (res.ok) {
            const saved = await res.json();
            if (editId) {
               setFaqs(prev => prev.map(f => (f._id === editId ? saved : f)));
            } else {
               setFaqs(prev => [...prev, saved]);
            }
            setIsModalOpen(false);
            showToast('success', editId ? 'Question modifiée avec succès.' : 'Question ajoutée avec succès.');
         } else {
            const err = await res.json().catch(() => ({}));
            showToast('error', err.message || "Erreur lors de l'enregistrement.");
         }
      } catch (err) {
         showToast('error', "Erreur réseau lors de l'enregistrement.");
      } finally {
         setSaving(false);
      }
   };

   const handleDelete = (id?: string) => {
      if (!id) return;
      showConfirm({
         title: 'Supprimer cette question',
         message: 'Cette action est irréversible. La question sera définitivement retirée de la FAQ.',
         onConfirm: async () => {
            hideConfirm();
            try {
               const res = await adminFetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
               if (res.ok) {
                  setFaqs(prev => prev.filter(f => f._id !== id));
                  showToast('success', 'Question supprimée.');
               } else {
                  showToast('error', 'Erreur lors de la suppression.');
               }
            } catch (err) {
               showToast('error', 'Erreur réseau lors de la suppression.');
            }
         },
      });
   };

   const toggleStatus = async (faq: FaqData) => {
      if (!faq._id) return;
      const newStatus = faq.status === 'actif' ? 'inactif' : 'actif';
      try {
         const res = await adminFetch(`/api/admin/faqs/${faq._id}`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus }),
         });
         if (res.ok) {
            const saved = await res.json();
            setFaqs(prev => prev.map(f => (f._id === faq._id ? saved : f)));
         } else {
            showToast('error', 'Erreur lors du changement de statut.');
         }
      } catch (err) {
         showToast('error', 'Erreur réseau lors du changement de statut.');
      }
   };

   return (
      <div className="space-y-10">
         {/* Header */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-2">
               <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Contenu du site</span>
               <h2 className="text-3xl sm:text-4xl font-serif">Foire aux questions</h2>
            </div>
            <button
               onClick={handleOpenAdd}
               className="flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all shadow-lg shadow-gold/20"
            >
               <Plus size={16} />
               <span>Nouvelle question</span>
            </button>
         </div>

         {loading ? (
            <div className="flex items-center justify-center py-24 text-gold">
               <Loader className="animate-spin" size={40} />
            </div>
         ) : faqs.length === 0 ? (
            <div className="admin-card p-16 text-center text-white/40">
               <HelpCircle size={40} className="mx-auto mb-4 text-white/20" />
               <p className="font-serif italic">Aucune question pour le moment. Ajoutez votre première FAQ.</p>
            </div>
         ) : (
            <div className="space-y-4">
               {faqs.map((faq, i) => (
                  <motion.div
                     key={faq._id || i}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.04 }}
                     className="admin-card p-6 flex items-start gap-4"
                  >
                     <div className="flex items-center gap-3 pt-1 text-white/20">
                        <GripVertical size={16} />
                        <span className="text-xs font-mono text-white/40 w-6 text-center">{faq.order}</span>
                     </div>

                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                           <h4 className="text-lg font-serif text-white">{faq.question}</h4>
                           <button
                              onClick={() => toggleStatus(faq)}
                              className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border transition-all ${faq.status === 'actif'
                                 ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5 hover:bg-emerald-400/10'
                                 : 'text-white/40 border-white/10 bg-white/[0.02] hover:bg-white/5'}`}
                           >
                              {faq.status === 'actif' ? 'Visible' : 'Masquée'}
                           </button>
                        </div>
                        <p className="text-sm text-white/50 mt-2 font-serif italic line-clamp-2">{faq.answer}</p>
                     </div>

                     <div className="flex gap-2 flex-shrink-0">
                        <button
                           onClick={() => handleOpenEdit(faq)}
                           className="p-2 rounded-lg bg-white/[0.04] hover:bg-gold hover:text-black transition-all text-white/70"
                        >
                           <Edit3 size={16} />
                        </button>
                        <button
                           onClick={() => handleDelete(faq._id)}
                           className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 transition-all text-rose-400 hover:text-white"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </motion.div>
               ))}
            </div>
         )}

         {/* Add/Edit Modal */}
         <AnimatePresence>
            {isModalOpen && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 sm:p-6"
               >
                  <motion.div
                     initial={{ y: 50, scale: 0.95 }}
                     animate={{ y: 0, scale: 1 }}
                     className="bg-[#0D121E] border border-white/[0.05] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                  >
                     <div className="p-6 sm:p-8 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                              <HelpCircle size={20} />
                           </div>
                           <h3 className="text-xl sm:text-2xl font-serif italic text-white">
                              {editId ? 'Modifier la question' : 'Nouvelle question'}
                           </h3>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white">
                           <X size={24} />
                        </button>
                     </div>

                     <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6">
                        <div className="space-y-2">
                           <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Question</label>
                           <input
                              type="text"
                              value={formData.question}
                              onChange={e => setFormData({ ...formData, question: e.target.value })}
                              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all font-serif text-white outline-none"
                              placeholder="Ex: Comment se déroule l'arrivée ?"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Réponse</label>
                           <textarea
                              value={formData.answer}
                              onChange={e => setFormData({ ...formData, answer: e.target.value })}
                              className="w-full h-40 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all resize-none font-serif italic text-white outline-none"
                              placeholder="Saisissez la réponse affichée sur le site..."
                           />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Ordre d'affichage</label>
                              <input
                                 type="number"
                                 value={formData.order}
                                 onChange={e => setFormData({ ...formData, order: Number(e.target.value) || 0 })}
                                 className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white outline-none"
                                 placeholder="1"
                              />
                              <p className="text-[10px] text-white/30">Les petits nombres apparaissent en premier.</p>
                           </div>

                           <div className="space-y-2 relative">
                              <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Statut</label>
                              <button
                                 type="button"
                                 onClick={() => setOpenStatusDropdown(!openStatusDropdown)}
                                 className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white outline-none flex items-center justify-between"
                              >
                                 <span className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${formData.status === 'actif' ? 'bg-emerald-400' : 'bg-white/30'}`} />
                                    {formData.status === 'actif' ? 'Visible sur le site' : 'Masquée'}
                                 </span>
                                 <ChevronDown size={14} className={`text-white/40 transition-transform ${openStatusDropdown ? 'rotate-180' : ''}`} />
                              </button>
                              <AnimatePresence>
                                 {openStatusDropdown && (
                                    <motion.div
                                       initial={{ opacity: 0, y: -5 }}
                                       animate={{ opacity: 1, y: 0 }}
                                       exit={{ opacity: 0, y: -5 }}
                                       className="absolute z-50 top-full left-0 right-0 mt-2 bg-[#0D121E] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60"
                                    >
                                       {[
                                          { value: 'actif', label: 'Visible sur le site', color: 'bg-emerald-400' },
                                          { value: 'inactif', label: 'Masquée', color: 'bg-white/30' },
                                       ].map(opt => (
                                          <button
                                             key={opt.value}
                                             type="button"
                                             onClick={() => {
                                                setFormData({ ...formData, status: opt.value as 'actif' | 'inactif' });
                                                setOpenStatusDropdown(false);
                                             }}
                                             className={`w-full px-4 py-3 text-sm text-left flex items-center justify-between hover:bg-white/5 transition-colors ${formData.status === opt.value ? 'text-gold' : 'text-white/70'}`}
                                          >
                                             <span className="flex items-center gap-3">
                                                <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                                                {opt.label}
                                             </span>
                                             {formData.status === opt.value && <CheckCircle2 size={14} className="text-gold" />}
                                          </button>
                                       ))}
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>
                        </div>
                     </div>

                     <div className="p-6 sm:p-8 bg-white/[0.02] border-t border-white/[0.05] flex justify-end gap-4">
                        <button
                           onClick={() => setIsModalOpen(false)}
                           className="px-6 py-3.5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-white/80"
                        >
                           Annuler
                        </button>
                        <button
                           onClick={handleSave}
                           disabled={saving}
                           className="px-8 py-3.5 bg-gold text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gold-light transition-all flex items-center gap-3 shadow-lg shadow-gold/20 disabled:opacity-50"
                        >
                           {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                           {editId ? 'Enregistrer' : 'Ajouter'}
                        </button>
                     </div>
                  </motion.div>
               </motion.div>
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
