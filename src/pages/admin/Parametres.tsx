import React from 'react';
import { motion } from 'motion/react';
import {
   Building2,
   Clock,
   MessageSquare,
   Shield,
   Users,
   Bell,
   Save,
   Globe
} from "lucide-react";

export default function AdminSettings() {
   return (
      <div className="space-y-12">
         <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Système</span>
            <h2 className="text-4xl font-serif italic font-light">Paramètres Généraux</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Sidebar Settings Navigation */}
            <div className="space-y-2">
               {[
                  { icon: Building2, label: "Coordonnées de l'Établissement", active: true },
                  { icon: Clock, label: "Horaires & Check-in/out", active: false },
                  { icon: MessageSquare, label: "Messages Automatiques", active: false },
                  { icon: Shield, label: "Sécurité & RGPD", active: false },
                  { icon: Globe, label: "Site Web & SEO", active: false },
                  { icon: Users, label: "Gestion des Administrateurs", active: false },
                  { icon: Bell, label: "Notifications Système", active: false },
               ].map((item, i) => (
                  <button key={i} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-left transition-all ${item.active ? 'bg-gold text-black' : 'text-white/40 hover:text-white hover:bg-white/[0.03]'}`}>
                     <item.icon size={18} />
                     <span className="text-sm font-medium tracking-wide">{item.label}</span>
                  </button>
               ))}
            </div>

            {/* Content Settings */}
            <div className="md:col-span-2 space-y-8">
               <div className="admin-card p-10 space-y-10">
                  <div className="space-y-2 border-b border-admin-border pb-6">
                     <h3 className="text-xl font-serif">Informations de contact</h3>
                     <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Identité publique de Maison Love Room</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 block">Nom de l'établissement</label>
                        <input type="text" defaultValue="Maison Love Rooms" className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white/80" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 block">Email Conciergerie</label>
                        <input type="email" defaultValue="conciergerie@maisonloveroom.fr" className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white/80" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 block">Téléphone</label>
                        <input type="text" defaultValue="+33 1 23 45 67 89" className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white/80" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 block">Adresse Parisienne</label>
                        <input type="text" defaultValue="Rue des Saints-Pères, 75006 Paris" className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:border-gold/30 transition-all text-white/80" />
                     </div>
                  </div>

                  <div className="space-y-6 pt-6">
                     <h4 className="text-xs font-bold uppercase tracking-widest text-white/20 border-b border-white/5 pb-2">Réseaux Sociaux</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 overflow-hidden">
                           <span className="text-[10px] text-white/20 font-bold mr-3">INSTAGRAM</span>
                           <a href="https://www.instagram.com/maisonloverooms/">@maisonloveroom</a>
                        </div>
                        <div className="flex items-center bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 overflow-hidden">
                           <span className="text-[10px] text-white/20 font-bold mr-3">FACEBOOK</span>
                           <a href="https://www.facebook.com/maisonloverooms/">@Maison Love Rooms Paris</a>
                        </div>
                     </div>
                  </div>

                  <div className="pt-10 flex justify-end">
                     <button className="flex items-center gap-3 px-10 py-5 bg-gold text-black rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold-light transition-all shadow-xl shadow-gold/10">
                        <Save size={18} />
                        Mettre à jour
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
