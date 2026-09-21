import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminToast, AdminConfirmModal, useAdminToast, useAdminConfirm } from '../../components/admin/AdminModal';
import {
   Plus,
   Minus,
   Trash2,
   Edit3,
   Image as ImageIcon,
   Wifi,
   Projector,
   Dices,
   Wind,
   Coffee,
   X,
   Save,
   Grid,
   List as ListIcon,
   Sparkles,
   Loader,
   ChevronDown,
   ChevronLeft,
   ChevronRight,
   CheckCircle2,
   Utensils,
   Heart
} from "lucide-react";
import { SUITES, API_URL } from '../../constants';
import { adminFetch } from '../../utils/apiClient';

interface SuiteData {
   _id?: string;
   name: string;
   tagline?: string;
   description: string;
   longDescription?: string;
   presentationTitle?: string;
   atouts?: string;
   callToAction?: string;
   pricePerNight: number;
   features: string[];
   status: string;
   imageUrl: string;
   images?: string[];
}

export default function AdminChambres() {
   const [suites, setSuites] = useState<SuiteData[]>([]);
   const [loading, setLoading] = useState(true);
   const [isAdding, setIsAdding] = useState(false);
   const [view, setView] = useState<'grid' | 'list'>('grid');

   // Pagination
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 8;

   const totalItems = suites.length;
   const totalPages = Math.ceil(totalItems / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
   const paginatedSuites = suites.slice(startIndex, endIndex);

   useEffect(() => {
      if (currentPage > totalPages && totalPages > 0) {
         setCurrentPage(totalPages);
      }
   }, [suites, totalPages]);

   // Form & Edit state
   const [editId, setEditId] = useState<string | null>(null);
   const [uploadingImage, setUploadingImage] = useState(false);
   const [uploadingGallery, setUploadingGallery] = useState(false);
   const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
   const [formData, setFormData] = useState<SuiteData>({
      name: '',
      tagline: '',
      description: '',
      longDescription: '',
      presentationTitle: '',
      atouts: '',
      callToAction: '',
      pricePerNight: 189,
      features: ['Balnéo Privative', 'Champagne Inclus'],
      status: 'disponible',
      imageUrl: '',
      images: []
   });

   const { toast, showToast, hideToast } = useAdminToast();
   const { confirm: confirmState, showConfirm, hideConfirm } = useAdminConfirm();

   // Fetch suites from backend
   const fetchSuites = async () => {
      try {
         const res = await adminFetch('/api/admin/suites');
         if (res.ok) {
            const data = await res.json();
            setSuites(data);
         } else {
            // Fallback to constants if backend has error
            setSuites(SUITES.map(s => ({
               _id: s.id,
               name: s.name,
               description: s.description,
               pricePerNight: s.price,
               features: s.features,
               status: 'disponible',
               imageUrl: s.image,
               images: s.images || []
            })));
         }
      } catch (err) {
         // Fallback to constants if backend unreachable
         setSuites(SUITES.map(s => ({
            _id: s.id,
            name: s.name,
            description: s.description,
            pricePerNight: s.price,
            features: s.features,
            status: 'disponible',
            imageUrl: s.image,
            images: s.images || []
         })));
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchSuites();
   }, []);

   const handleOpenAdd = () => {
      setEditId(null);
      setFormData({
         name: '',
         tagline: '',
         description: '',
         longDescription: '',
         presentationTitle: '',
         atouts: '',
         callToAction: '',
         pricePerNight: 189,
         features: ['Balnéo Privative', 'Champagne Inclus'],
         status: 'disponible',
         imageUrl: '',
         images: []
      });
      setIsAdding(true);
   };

   const handleOpenEdit = (suite: SuiteData) => {
      setEditId(suite._id || null);
      setFormData({
         name: suite.name,
         tagline: suite.tagline || '',
         description: suite.description,
         longDescription: suite.longDescription || '',
         presentationTitle: suite.presentationTitle || '',
         atouts: suite.atouts || '',
         callToAction: suite.callToAction || '',
         pricePerNight: suite.pricePerNight,
         features: suite.features || [],
         status: suite.status || 'disponible',
         imageUrl: suite.imageUrl,
         images: suite.images || []
      });
      setIsAdding(true);
   };

   const handleDelete = async (id?: string) => {
      if (!id) return;
      showConfirm({
         title: 'Supprimer cette chambre',
         message: 'Cette action est irréversible. La chambre et toutes ses images seront définitivement supprimées.',
         onConfirm: async () => {
            hideConfirm();
            try {

               const res = await adminFetch(`/api/admin/suites/${id}`, {
                  method: 'DELETE'
               });
               if (res.ok) {
                  setSuites(suites.filter(s => s._id !== id));
                  showToast('success', 'Chambre supprimée avec succès.');
               } else {
                  showToast('error', "Erreur lors de la suppression");
               }
            } catch (err) {
               showToast('error', "Erreur réseau lors de la suppression");
            }
         }
      });
   };

   const handleSave = async () => {
      if (!formData.name || !formData.pricePerNight) {
         showToast('error', "Veuillez remplir le nom et le prix.");
         return;
      }

      try {
         const endpoint = editId
            ? `/api/admin/suites/${editId}`
            : `/api/admin/suites`;
         const method = editId ? 'PUT' : 'POST';

         const res = await adminFetch(endpoint, {
            method,
            body: JSON.stringify(formData)
         });

         if (res.ok) {
            const savedSuite = await res.json();
            if (editId) {
               setSuites(suites.map(s => s._id === editId ? savedSuite : s));
            } else {
               setSuites([...suites, savedSuite]);
            }
            setIsAdding(false);
            showToast('success', editId ? 'Chambre modifiée avec succès.' : 'Chambre créée avec succès.');
         } else {
            showToast('error', "Erreur lors de l'enregistrement de la suite");
         }
      } catch (err) {
         showToast('error', "Erreur réseau lors de l'enregistrement");
      }
   };

   // Cloudinary Direct Upload pour l'image principale
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

   // Cloudinary Direct Upload pour la galerie d'images supplémentaires
   const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setUploadingGallery(true);
      const uploadPreset = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET || 'maison_love_room';
      const cloudName = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME || 'djks8n2nh';

      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
         const file = files[i];
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
               uploadedUrls.push(uploaded.secure_url);
            }
         } catch (err) {
            console.error("Erreur upload galerie", err);
         }
      }

      setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...uploadedUrls] }));
      setUploadingGallery(false);
   };

   const removeGalleryImage = (index: number) => {
      setFormData(prev => ({
         ...prev,
         images: (prev.images || []).filter((_, i) => i !== index)
      }));
   };

   const toggleFeature = (feature: string) => {
      if (formData.features.includes(feature)) {
         setFormData({ ...formData, features: formData.features.filter(f => f !== feature) });
      } else {
         setFormData({ ...formData, features: [...formData.features, feature] });
      }
   };

   const AVAILABLE_FEATURES = [
      { icon: Wifi, label: "Fibre Wi-Fi" },
      { icon: Projector, label: "Rétroprojecteur" },
      { icon: Coffee, label: "Nespresso" },
      { icon: Wind, label: "Spa Privatif" },
      { icon: Dices, label: "Jeux de société pour adultes" },
      { icon: Wind, label: "Balnéo Privative" },
      { icon: Coffee, label: "Champagne Inclus" },
      { icon: Sparkles, label: "Décoration Jungle" },
      { icon: Utensils, label: "Cuisine Indépendante" },
      { icon: Heart, label: "Ambiance Immersive" },
      { icon: Heart, label: "Douche en duo" },
      { icon: Sparkles, label: "Décoration Chic" },
      { icon: Utensils, label: "Kitchenette" }
   ];

   return (
      <div className="space-y-10">
         {/* Header */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-2">
               <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Gestion du Stock</span>
               <h2 className="text-3xl sm:text-4xl font-serif">Gestion des Chambres</h2>
            </div>

            <div className="flex gap-4 w-full sm:w-auto justify-end">
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
                  onClick={handleOpenAdd}
                  className="flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all shadow-lg shadow-gold/20"
               >
                  <Plus size={16} />
                  <span>Nouvelle Chambre</span>
               </button>
            </div>
         </div>

         {/* Grid of Suites */}
         {loading ? (
            <div className="flex items-center justify-center py-24 text-gold">
               <Loader className="animate-spin" size={40} />
            </div>
         ) : (
            <>
               <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                  {paginatedSuites.map((suite, i) => (
                     <motion.div
                        key={suite._id || suite.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`admin-card group overflow-hidden ${view === 'list' ? 'flex flex-col sm:flex-row items-stretch sm:items-center' : 'flex flex-col'}`}
                     >
                        <div className={`relative overflow-hidden ${view === 'list' ? 'w-full sm:w-64 h-48 sm:h-auto sm:aspect-video flex-shrink-0' : 'aspect-video w-full'}`}>
                           <img
                              src={suite.imageUrl || "/photos/love-story-1.jpeg"}
                              alt={suite.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-transparent to-transparent" />
                           <div className="absolute top-4 right-4 flex gap-2 z-10">
                              <button
                                 onClick={() => handleOpenEdit(suite)}
                                 className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-gold hover:text-black transition-all text-white"
                              >
                                 <Edit3 size={14} />
                              </button>
                              <button
                                 onClick={() => handleDelete(suite._id)}
                                 className="p-2 rounded-lg bg-rose-500/20 backdrop-blur-md hover:bg-rose-500 transition-all text-rose-500 hover:text-white"
                              >
                                 <Trash2 size={14} />
                              </button>
                           </div>
                        </div>

                        <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                           <div>
                              <div className="space-y-1">
                                 <span className="text-[10px] text-gold font-bold uppercase tracking-widest">À partir de {suite.pricePerNight} €</span>
                                 <h4 className="text-xl font-serif">{suite.name}</h4>
                              </div>
                              <p className="text-xs text-white/60 line-clamp-2 mt-2 font-serif italic">{suite.description}</p>
                           </div>

                           <div className="flex flex-wrap gap-1.5 my-4">
                              {suite.features?.slice(0, 4).map(f => (
                                 <span key={f} className="text-[9px] uppercase tracking-wider px-2.5 py-1 bg-white/[0.04] rounded-md border border-white/[0.05] text-white/70">
                                    {f}
                                 </span>
                              ))}
                           </div>

                           <div className="pt-4 flex items-center justify-between border-t border-white/[0.05] mt-auto">
                              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                 {suite.status || 'Disponible'}
                              </span>
                              <span className="text-[10px] text-white/20 uppercase tracking-widest font-mono">ID: {suite._id?.slice(-6) || 'DEMO'}</span>
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
                           className={`p-2.5 rounded-xl border border-white/[0.05] transition-all flex items-center justify-center cursor-pointer ${currentPage === 1
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
                                 className={`w-[40px] h-[40px] rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer border ${currentPage === pageNum
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
                           className={`p-2.5 rounded-xl border border-white/[0.05] transition-all flex items-center justify-center cursor-pointer ${currentPage === totalPages
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

         {/* Add/Edit Modal */}
         <AnimatePresence>
            {isAdding && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 sm:p-6"
               >
                  <motion.div
                     initial={{ y: 50, scale: 0.95 }}
                     animate={{ y: 0, scale: 1 }}
                     className="bg-[#0D121E] border border-white/[0.05] rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                  >
                     <div className="p-6 sm:p-8 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                              <Plus size={20} />
                           </div>
                           <h3 className="text-xl sm:text-2xl font-serif italic text-white">
                              {editId ? "Modifier la chambre" : "Nouvelle chambre"}
                           </h3>
                        </div>
                        <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white">
                           <X size={24} />
                        </button>
                     </div>

                     <div className="flex-1 overflow-y-auto p-6 lg:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                           {/* Form Side */}
                           <div className="space-y-8">
                              <div className="space-y-6">
                                 <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold border-b border-white/5 pb-2">Informations Générales</h4>
                                 <div className="grid gap-6">
                                    <div className="space-y-2">
                                       <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Nom de la Suite</label>
                                       <input
                                          type="text"
                                          value={formData.name}
                                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                                          className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all font-serif italic text-lg text-white outline-none"
                                          placeholder="Ex: Love Story"
                                       />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Sous-titre (accroche)</label>
                                       <input
                                          type="text"
                                          value={formData.tagline || ''}
                                          onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                                          className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all font-serif italic text-white outline-none"
                                          placeholder="Ex: Un cocon discret pour se retrouver à deux, idéale pour une nuit calme et complice."
                                       />
                                       <p className="text-[10px] text-white/30 leading-relaxed">Courte phrase affichée sous le nom de la chambre sur l'accueil et la page de la chambre.</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                       <div className="space-y-2">
                                          <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Prix par Nuit (€)</label>
                                          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.05] rounded-xl p-1.5 focus-within:border-gold/30 transition-all">
                                             <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, pricePerNight: Math.max(0, formData.pricePerNight - 10) })}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/[0.05] text-white/50 hover:text-gold hover:bg-white/10 transition-colors shrink-0"
                                             >
                                                <Minus size={16} />
                                             </button>
                                             <input
                                                type="text"
                                                value={formData.pricePerNight}
                                                onChange={e => {
                                                   const cleanVal = e.target.value.replace(/\D/g, '');
                                                   setFormData({ ...formData, pricePerNight: cleanVal ? Number(cleanVal) : 0 });
                                                }}
                                                className="w-full min-w-0 bg-transparent text-center text-lg font-serif text-gold font-bold py-2 outline-none border-none focus:ring-0"
                                                placeholder="189"
                                             />
                                             <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, pricePerNight: formData.pricePerNight + 10 })}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/[0.05] text-white/50 hover:text-gold hover:bg-white/10 transition-colors shrink-0"
                                             >
                                                <Plus size={16} />
                                             </button>
                                          </div>
                                       </div>
                                       <div className="space-y-2 relative">
                                          <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Statut</label>
                                          <button
                                             type="button"
                                             onClick={() => setOpenStatusDropdown(!openStatusDropdown)}
                                             className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white outline-none flex items-center justify-between"
                                          >
                                             <span className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${formData.status === 'disponible' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                                {formData.status === 'disponible' ? 'Disponible' : 'En maintenance'}
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
                                                      { value: 'disponible', label: 'Disponible', color: 'bg-emerald-400' },
                                                      { value: 'maintenance', label: 'En maintenance', color: 'bg-amber-400' },
                                                   ].map(opt => (
                                                      <button
                                                         key={opt.value}
                                                         type="button"
                                                         onClick={() => {
                                                            setFormData({ ...formData, status: opt.value });
                                                            setOpenStatusDropdown(false);
                                                         }}
                                                         className={`w-full px-4 py-3 text-sm text-left flex items-center justify-between hover:bg-white/5 transition-colors ${formData.status === opt.value ? 'text-gold' : 'text-white/70'
                                                            }`}
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
                                    <div className="space-y-2">
                                       <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Description Courte</label>
                                       <textarea
                                          value={formData.description}
                                          onChange={e => setFormData({ ...formData, description: e.target.value })}
                                          className="w-full h-32 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all resize-none font-serif italic text-white outline-none"
                                          placeholder="Une invitation au voyage, élégante et raffinée..."
                                       />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Titre de Présentation</label>
                                       <input
                                          type="text"
                                          value={formData.presentationTitle}
                                          onChange={e => setFormData({ ...formData, presentationTitle: e.target.value })}
                                          className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all font-serif text-white outline-none"
                                          placeholder="Ex: Gatsby Love Room – Luxe, Glamour & Séduction"
                                       />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Texte de Présentation (Long)</label>
                                       <textarea
                                          value={formData.longDescription}
                                          onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
                                          className="w-full h-48 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all resize-none font-serif text-white outline-none"
                                          placeholder="Le long texte de présentation avec plusieurs paragraphes..."
                                       />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Atouts (Description des équipements)</label>
                                       <textarea
                                          value={formData.atouts}
                                          onChange={e => setFormData({ ...formData, atouts: e.target.value })}
                                          className="w-full h-20 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all resize-none font-serif text-white outline-none"
                                          placeholder="Ex: Balnéo privative Ambiance inspirée des Années Folles Éclairage tamisé..."
                                       />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-xs text-white/40 font-bold uppercase tracking-widest">Appel à l'Action (Call-to-Action)</label>
                                       <textarea
                                          value={formData.callToAction}
                                          onChange={e => setFormData({ ...formData, callToAction: e.target.value })}
                                          className="w-full h-16 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all resize-none font-serif text-white outline-none"
                                          placeholder="Ex: Laissez-vous transporter dans un univers où le luxe, la passion et l'élégance se mêlent..."
                                       />
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-6">
                                 <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold border-b border-white/5 pb-2">Équipements</h4>
                                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    {AVAILABLE_FEATURES.map(item => {
                                       const isSelected = formData.features.includes(item.label);
                                       const Icon = item.icon;
                                       return (
                                          <button
                                             key={item.label}
                                             type="button"
                                             onClick={() => toggleFeature(item.label)}
                                             className={`p-3 border rounded-xl text-center transition-all group flex flex-col items-center justify-center ${isSelected
                                                ? 'bg-gold/10 border-gold text-gold shadow-lg shadow-gold/5'
                                                : 'bg-white/[0.02] border-white/[0.05] text-white/40 hover:border-white/20 hover:text-white'
                                                }`}
                                          >
                                             <Icon size={18} className={`mb-2 transition-colors ${isSelected ? 'text-gold' : 'text-white/20 group-hover:text-white/60'}`} />
                                             <span className="text-[9px] uppercase tracking-wider block font-medium">{item.label}</span>
                                          </button>
                                       );
                                    })}
                                 </div>
                              </div>
                           </div>

                           {/* Media Side */}
                           <div className="space-y-8">
                              <div className="space-y-6">
                                 <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold border-b border-white/5 pb-2">Galerie & Image Principale</h4>

                                 <label className="aspect-video bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-gold/30 transition-all cursor-pointer group relative overflow-hidden">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    {formData.imageUrl ? (
                                       <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover absolute inset-0 opacity-80" />
                                    ) : null}
                                    <div className={`w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center text-white/20 group-hover:text-gold transition-colors z-10 ${formData.imageUrl ? 'bg-[#0A0E17]/80 backdrop-blur-md border border-white/10' : ''}`}>
                                       {uploadingImage ? <Loader className="animate-spin text-gold" size={32} /> : <ImageIcon size={32} />}
                                    </div>
                                    <div className={`text-center z-10 ${formData.imageUrl ? 'bg-[#0A0E17]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10' : ''}`}>
                                       <p className="text-sm font-medium text-white">
                                          {uploadingImage ? "Chargement sur Cloudinary..." : (formData.imageUrl ? "Modifier l'image principale" : "Glissez ou cliquez pour charger via Cloudinary")}
                                       </p>
                                       <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                                          {uploadingImage ? "Veuillez patienter" : "CLOUDINARY SECURE UPLOAD"}
                                       </p>
                                    </div>
                                 </label>

                                 {formData.imageUrl && (
                                    <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center justify-between">
                                       <span className="text-xs text-white/60 truncate max-w-[300px] font-mono">{formData.imageUrl}</span>
                                       <button
                                          type="button"
                                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                          className="text-xs text-rose-400 hover:underline ml-4 flex-shrink-0"
                                       >
                                          Supprimer
                                       </button>
                                    </div>
                                 )}

                                 {/* Galerie Secondaire */}
                                 <div className="space-y-4 pt-4 border-t border-white/[0.05]">
                                    <div className="flex items-center justify-between">
                                       <label className="text-xs text-white/40 font-bold uppercase tracking-widest block">Images Supplémentaires (Galerie)</label>
                                       <label className="text-xs text-gold hover:underline cursor-pointer flex items-center gap-1.5">
                                          <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                                          {uploadingGallery ? <Loader className="animate-spin" size={14} /> : <Plus size={14} />}
                                          {uploadingGallery ? "Chargement..." : "Ajouter des photos"}
                                       </label>
                                    </div>

                                    {(formData.images || []).length === 0 ? (
                                       <div className="p-6 bg-white/[0.01] border border-white/[0.05] rounded-xl text-center text-xs text-white/40 italic font-serif">
                                          Aucune image supplémentaire dans la galerie.
                                       </div>
                                    ) : (
                                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                          {(formData.images || []).map((img, idx) => (
                                             <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group bg-[#0A0E17]">
                                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                                                <button
                                                   type="button"
                                                   onClick={() => removeGalleryImage(idx)}
                                                   className="absolute top-2 right-2 p-1.5 bg-rose-500/80 hover:bg-rose-500 text-white rounded-lg backdrop-blur-md transition-all shadow-lg"
                                                >
                                                   <Trash2 size={12} />
                                                </button>
                                             </div>
                                          ))}
                                       </div>
                                    )}
                                 </div>
                              </div>


                           </div>
                        </div>
                     </div>

                     <div className="p-6 sm:p-8 bg-white/[0.02] border-t border-white/[0.05] flex justify-end gap-4">
                        <button
                           onClick={() => setIsAdding(false)}
                           className="px-6 py-3.5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-white/80"
                        >
                           Abandonner
                        </button>
                        <button
                           onClick={handleSave}
                           disabled={uploadingImage || uploadingGallery}
                           className="px-8 py-3.5 bg-gold text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gold-light transition-all flex items-center gap-3 shadow-lg shadow-gold/20 disabled:opacity-50"
                        >
                           <Save size={16} />
                           {editId ? "Enregistrer les modifications" : "Créer la Chambre"}
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
