import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Plus, Edit3, Trash2, Search } from 'lucide-react';
import { AdminToast, useAdminToast } from '../../components/admin/AdminModal';

// Using mock data similar to the public page for consistency in the UI presentation
interface GiftCardData {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  features: string[];
  status: 'actif' | 'inactif';
  badge?: string;
}

const MOCK_CARDS: GiftCardData[] = [
  {
    _id: "gc-nuit-reve",
    name: "Nuit de Rêve",
    price: 189,
    description: "Offrez une nuit magique et inoubliable dans l'une de nos suites luxueuses.",
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop",
    badge: "Populaire",
    status: 'actif',
    features: ["1 nuitée pour 2 personnes", "Valable dans toutes nos suites", "Accès illimité au Spa privatif", "Valable 1 an"]
  },
  {
    _id: "gc-pack-romance",
    name: "Pack Romance Ultime",
    price: 249,
    description: "Le cadeau parfait : une nuitée accompagnée de notre sélection d'attentions romantiques.",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop",
    badge: "Premium",
    status: 'actif',
    features: ["Nuitée exceptionnelle", "Bouteille de Champagne au frais", "Pétales de roses sur le lit", "Départ tardif à 13h"]
  },
  {
    _id: "gc-carte-liberte",
    name: "Carte Liberté 100€",
    price: 100,
    description: "Un bon d'achat flexible, déductible sur la réservation ou les options boutique.",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop",
    status: 'actif',
    features: ["Montant libre utilisable en 1 fois", "Cumulable avec les promotions", "Choix de la suite au moment de réserver", "Valable 1 an"]
  },
  {
    _id: "gc-bouquet",
    name: "Bouquet de Fleurs",
    price: 45,
    description: "Bouquet élégant composé de fleurs fraîches et parfumées pour marquer le coup.",
    imageUrl: "https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=1000&auto=format&fit=crop",
    badge: "Option",
    status: 'actif',
    features: ["Composition florale premium", "Fleurs de saison", "Livraison en chambre", "Présentation soignée"]
  }
];

export default function AdminCartesCadeaux() {
  const [cards, setCards] = useState<GiftCardData[]>(MOCK_CARDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { toast, showToast, hideToast } = useAdminToast();

  const filteredCards = cards.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCards = filteredCards.slice(startIndex, endIndex);

  // Remise à zéro de la page si la recherche change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-12">
      <AdminToast {...toast} onClose={hideToast} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest">
            <Gift size={14} />
            <span>Nouveau Module</span>
          </div>
          <h2 className="text-4xl font-serif italic font-light text-white">Cartes Cadeaux</h2>
          <p className="text-white/60">Gérez vos offres, chèques cadeaux et bons d'achat.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input 
              type="text"
              placeholder="Rechercher une carte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white focus:outline-none focus:border-rose-500/50 transition-colors"
            />
          </div>
          <button 
            onClick={() => showToast('success', "Fonctionnalité en cours de déploiement !")}
            className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-rose-500/25 transition-all hover:-translate-y-0.5"
          >
            <Plus size={20} />
            <span>Créer une carte</span>
          </button>
        </div>
      </div>

      {/* Grille des Cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {paginatedCards.map((card) => (
            <motion.div
              key={card._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="admin-card overflow-hidden group border border-rose-500/10 hover:border-rose-500/30"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={card.imageUrl} 
                  alt={card.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] to-transparent" />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10 text-white">
                  {card.price}€
                </div>
                {card.badge && (
                  <div className="absolute top-4 left-4 bg-rose-500 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                    {card.badge}
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{card.name}</h3>
                    <p className="text-sm text-white/50 line-clamp-2 mt-1">{card.description}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/[0.05]">
                  <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">Avantages Inclus</p>
                  {card.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                  {card.features.length > 3 && (
                    <div className="text-xs text-white/40 italic">+{card.features.length - 3} autres avantages</div>
                  )}
                </div>

                <div className="pt-6 flex justify-between items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${card.status === 'actif' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-white/40 border-white/10'}`}>
                    {card.status === 'actif' ? 'En ligne' : 'Désactivé'}
                  </span>
                  
                  <div className="flex gap-2">
                    <button onClick={() => showToast('success', "Mode édition disponible bientôt")} className="p-2 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => showToast('error', "Suppression bloquée en mode démo")} className="p-2 bg-rose-500/5 text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination Controller */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-6 mt-8 gap-4 select-none">
          <span className="text-xs text-white/40">
            Affichage de <span className="font-semibold text-white">{startIndex + 1}</span> à <span className="font-semibold text-white">{Math.min(endIndex, filteredCards.length)}</span> sur <span className="font-semibold text-white">{filteredCards.length}</span> entrées
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-gold hover:text-black hover:border-gold transition-all text-white/60 disabled:opacity-30 disabled:pointer-events-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    currentPage === idx + 1
                      ? 'bg-gold text-black shadow-lg shadow-gold/20'
                      : 'bg-white/[0.02] border border-white/[0.05] text-white/60 hover:bg-white/10'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-gold hover:text-black hover:border-gold transition-all text-white/60 disabled:opacity-30 disabled:pointer-events-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
