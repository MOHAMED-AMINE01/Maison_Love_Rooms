import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Loader, Plus, Minus } from "lucide-react";
import { AdminToast, useAdminToast } from '../../components/admin/AdminModal';
import { adminFetch } from '../../utils/apiClient';

export default function AdminSettings() {
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const { toast, showToast, hideToast } = useAdminToast();

   const [formData, setFormData] = useState({
      establishmentName: '',
      email: '',
      phone: '',
      address: '',
      instagram: '',
      whatsapp: '',
      checkInTime: '',
      checkOutTime: '',
      maxNights: 2
   });

   // Récupération des paramètres
   useEffect(() => {
      const fetchSettings = async () => {
         try {
            const res = await adminFetch('/api/admin/settings');
            if (res.ok) {
               const data = await res.json();
               setFormData({
                  establishmentName: data.establishmentName || 'Maison Love Rooms',
                  email: data.email || 'conciergerie@maisonloveroom.fr',
                  phone: data.phone || '+33 1 23 45 67 89',
                  address: data.address || 'Centre-ville, 37000 Tours',
                  instagram: data.instagram || '@maisonloveroom',
                  whatsapp: data.whatsapp || '+33 1 23 45 67 89',
                  checkInTime: data.checkInTime || '18:00',
                  checkOutTime: data.checkOutTime || '11:00',
                  maxNights: data.maxNights !== undefined ? data.maxNights : 2
               });
            } else {
               showToast('error', "Erreur lors du chargement des paramètres");
            }
         } catch (err) {
            showToast('error', "Erreur réseau lors de la récupération des paramètres");
         } finally {
            setLoading(false);
         }
      };

      fetchSettings();
   }, []);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      try {
         const res = await adminFetch('/api/admin/settings', {
            method: 'PUT',
            body: JSON.stringify(formData)
         });

         if (res.ok) {
            showToast('success', "Paramètres mis à jour avec succès");
         } else {
            const errData = await res.json();
            showToast('error', errData.message || "Erreur de mise à jour");
         }
      } catch (err) {
         showToast('error', "Impossible de se connecter au serveur");
      } finally {
         setSaving(false);
      }
   };

   if (loading) {
      return (
         <div className="flex h-[60vh] items-center justify-center">
            <Loader className="animate-spin text-gold" size={32} />
         </div>
      );
   }

   return (
      <div className="space-y-12 max-w-5xl mx-auto">
         <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Système</span>
            <h2 className="text-4xl font-serif italic font-light">Paramètres Généraux</h2>
         </div>

         <form onSubmit={handleSubmit} className="space-y-8">
            <div className="admin-card p-10 space-y-10">
               <div className="space-y-2 border-b border-admin-border pb-6">
                  <h3 className="text-xl font-serif">Informations de contact</h3>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Identité publique de Maison Love Rooms</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 block">Nom de l'établissement</label>
                     <input 
                        type="text" 
                        value={formData.establishmentName} 
                        onChange={e => setFormData({ ...formData, establishmentName: e.target.value })}
                        required
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white/80 outline-none" 
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 block">Email Conciergerie</label>
                     <input 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white/80 outline-none" 
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 block">Téléphone</label>
                     <input 
                        type="text" 
                        value={formData.phone} 
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white/80 outline-none" 
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 block">Adresse de l'établissement</label>
                     <input 
                        type="text" 
                        value={formData.address} 
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        required
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white/80 outline-none" 
                     />
                  </div>
               </div>

               <div className="space-y-6 pt-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/20 border-b border-white/5 pb-2">Réseaux & Messagerie</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="flex items-center bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3.5 overflow-hidden">
                        <span className="text-[10px] text-white/20 font-bold mr-3">INSTAGRAM</span>
                        <input 
                           type="text" 
                           value={formData.instagram} 
                           onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                           required
                           className="bg-transparent text-sm text-white/80 focus:text-gold outline-none w-full border-none p-0 focus:ring-0" 
                        />
                     </div>
                     <div className="flex items-center bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3.5 overflow-hidden">
                        <span className="text-[10px] text-white/20 font-bold mr-3">WHATSAPP</span>
                        <input 
                           type="text" 
                           value={formData.whatsapp} 
                           onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                           required
                           className="bg-transparent text-sm text-white/80 focus:text-gold outline-none w-full border-none p-0 focus:ring-0" 
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-6 pt-6 border-t border-white/5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/20 border-b border-white/5 pb-2">Horaires & Durée du Séjour</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 block">Heure d'arrivée (Check-In)</label>
                        <input 
                           type="text" 
                           value={formData.checkInTime} 
                           onChange={e => setFormData({ ...formData, checkInTime: e.target.value })}
                           placeholder="ex: 18:00 ou 18h"
                           required
                           className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white/80 outline-none" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 block">Heure de départ (Check-Out)</label>
                        <input 
                           type="text" 
                           value={formData.checkOutTime} 
                           onChange={e => setFormData({ ...formData, checkOutTime: e.target.value })}
                           placeholder="ex: 11:00 ou 11h"
                           required
                           className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white/80 outline-none" 
                        />
                     </div>
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 block">Nombre Max de Nuits</label>
                         <div className="flex items-center h-[46px] w-full bg-white/[0.03] border border-white/[0.05] rounded-xl overflow-hidden px-2">
                            <button
                               type="button"
                               onClick={() => setFormData(prev => ({ ...prev, maxNights: Math.max(1, prev.maxNights - 1) }))}
                               className="w-10 h-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/10 transition-colors text-white cursor-pointer"
                            >
                               <Minus size={14} />
                            </button>
                            <input
                               type="text"
                               readOnly
                               value={`${formData.maxNights} Nuit${formData.maxNights > 1 ? 's' : ''}`}
                               className="flex-1 text-center bg-transparent border-none text-sm text-white/80 font-semibold outline-none focus:ring-0"
                            />
                            <button
                               type="button"
                               onClick={() => setFormData(prev => ({ ...prev, maxNights: Math.min(30, prev.maxNights + 1) }))}
                               className="w-10 h-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/10 transition-colors text-white cursor-pointer"
                            >
                               <Plus size={14} />
                            </button>
                         </div>
                      </div>
                  </div>
               </div>

               <div className="pt-10 flex justify-end">
                  <button 
                     type="submit"
                     disabled={saving}
                     className="flex items-center gap-3 px-10 py-5 bg-gold text-black rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold-light transition-all shadow-xl shadow-gold/10 disabled:opacity-55"
                  >
                     {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                     Mettre à jour
                  </button>
               </div>
            </div>
         </form>

         {/* Toasts */}
         <AdminToast {...toast} onClose={hideToast} />
      </div>
   );
}
