import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ShoppingBag,
  Package,
  Gift,
  Search,
  Filter
} from "lucide-react";

const PRODUCTS = [
  { id: "P1", name: "Coffret Sensuel", price: "89€", stock: 12, type: "Produit" },
  { id: "P2", name: "Champagne Ruinart", price: "120€", stock: 24, type: "Produit" },
  { id: "P3", name: "Massage 1h Duo", price: "180€", stock: "∞", type: "Prestation" },
  { id: "P4", name: "Carte Cadeau 200€", price: "200€", stock: "∞", type: "Gift Card" },
];

export default function AdminBoutique() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Produits & Services</span>
          <h2 className="text-4xl font-serif">Boutique & Prestations</h2>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all">
          <Plus size={16} />
          <span>Nouveau Produit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          { label: "Ventes ce mois", value: "3,450€", icon: ShoppingBag },
          { label: "Produits Actifs", value: "24", icon: Package },
          { label: "Bons Cadeaux", value: "112", icon: Gift },
          { label: "Nouveaux Services", value: "3", icon: ShoppingBag },
        ].map((stat, i) => (
          <div key={i} className="admin-card p-6 flex flex-col gap-4">
             <div className="p-3 w-fit rounded-xl bg-gold/10 text-gold">
                <stat.icon size={18} />
             </div>
             <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{stat.label}</p>
                <p className="text-2xl font-serif">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="admin-card p-8">
        <div className="flex items-center justify-between mb-8">
           <div className="flex gap-4">
              <div className="relative group">
                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                 <input type="text" placeholder="Filtrer..." className="bg-white/[0.03] border border-white/[0.05] rounded-xl pl-10 pr-4 py-2 text-sm focus:border-gold/30 transition-all" />
              </div>
              <button className="p-2 bg-white/[0.03] border border-white/[0.05] rounded-lg text-white/40 hover:text-white transition-colors">
                 <Filter size={18} />
              </button>
           </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-admin-border">
              <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Produit</th>
              <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Type</th>
              <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Stock</th>
              <th className="pb-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Prix</th>
              <th className="pb-4 text-right text-[10px] uppercase tracking-widest text-white/20 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((prod, i) => (
              <tr key={prod.id} className="border-b border-admin-border/50 group hover:bg-white/[0.01] transition-all">
                <td className="py-6 flex items-center gap-4">
                   <div className="w-10 h-10 bg-white/[0.03] rounded-lg border border-white/[0.05] flex items-center justify-center text-white/20">
                      <ShoppingBag size={18} />
                   </div>
                   <span className="font-medium group-hover:text-gold transition-colors">{prod.name}</span>
                </td>
                <td className="py-6">
                   <span className="text-[9px] uppercase tracking-widest font-bold text-white/40 border border-white/5 px-2 py-1 rounded bg-white/5">
                      {prod.type}
                   </span>
                </td>
                <td className="py-6 text-sm italic text-white/40">{prod.stock} unités</td>
                <td className="py-6 font-serif text-lg">{prod.price}</td>
                <td className="py-6 text-right space-x-2">
                   <button className="p-2 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-all">
                      <Edit3 size={14} />
                   </button>
                   <button className="p-2 rounded-lg hover:bg-rose-500/10 text-white/20 hover:text-rose-500 transition-all">
                      <Trash2 size={14} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
