import React from 'react';
import { motion } from 'motion/react';
import { Gift, Heart } from 'lucide-react';

interface GiftCardOption {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  imageUrl: string;
  badge?: string;
}

const GIFT_CARDS: GiftCardOption[] = [
  {
    id: "gc-nuit-reve",
    name: "Nuit de Rêve",
    price: 189,
    description: "Offrez une nuit magique et inoubliable dans l'une de nos suites luxueuses.",
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop",
    badge: "Populaire",
    features: [
      "1 nuitée pour 2 personnes",
      "Valable dans toutes nos suites",
      "Accès illimité au Spa privatif",
      "Valable 1 an"
    ]
  },
  {
    id: "gc-pack-romance",
    name: "Pack Romance Ultime",
    price: 249,
    description: "Le cadeau parfait : une nuitée accompagnée de notre sélection d'attentions romantiques.",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop",
    badge: "Premium",
    features: [
      "Nuitée exceptionnelle",
      "Bouteille de Champagne au frais",
      "Pétales de roses sur le lit",
      "Départ tardif à 13h"
    ]
  },
  {
    id: "gc-carte-liberte",
    name: "Carte Liberté 100€",
    price: 100,
    description: "Un bon d'achat flexible, déductible sur la réservation ou les options boutique.",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop",
    features: [
      "Montant libre utilisable en 1 fois",
      "Cumulable avec les promotions",
      "Choix de la suite au moment de réserver",
      "Valable 1 an"
    ]
  },
  {
    id: "gc-bouquet",
    name: "Bouquet de Fleurs",
    price: 45,
    description: "Bouquet élégant composé de fleurs fraîches et parfumées pour marquer le coup.",
    imageUrl: "https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=1000&auto=format&fit=crop",
    badge: "Option",
    features: [
      "Composition florale premium",
      "Fleurs de saison fraîches",
      "Livraison discrète en chambre",
      "Présentation soignée"
    ]
  }
];

export default function CartesCadeaux() {
  return (
    <div className="min-h-screen bg-noir pt-32 pb-24 text-white font-sans selection:bg-gold/30 overflow-x-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-full w-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] bg-gold/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-gradient-to-tr from-gold/80 to-gold rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(188,155,93,0.3)] mb-6"
          >
            <Gift size={28} className="text-noir" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-page to-gold"
          >
            Cartes Cadeaux
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 max-w-2xl mx-auto text-lg"
          >
            Offrez un moment magique et hors du temps. La surprise parfaite pour célébrer votre amour ou gâter vos proches.
          </motion.p>
        </div>

        {/* Grille des Cartes Cadeaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-10 xl:gap-8 pt-8">
          {GIFT_CARDS.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="group relative"
            >
              {/* Carte Principale style "Dark Luxury" */}
              <div className="bg-gradient-to-b from-white/[0.05] to-white/[0.01] backdrop-blur-md border border-white/10 rounded-[2rem] pt-14 px-6 pb-10 flex flex-col items-center h-full relative z-10 group-hover:-translate-y-2 group-hover:border-gold/30 shadow-2xl transition-all duration-500">
                
                {/* Ligne lumineuse en bas de la carte au survol */}
                <div className="absolute bottom-0 left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-full" />

                {/* Image Circulaire qui chevauche */}
                <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-[6px] border-noir shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] relative z-10 group-hover:scale-105 transition-transform duration-500">
                      <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                    </div>
                    {/* Badge */}
                    {card.badge && (
                      <div className="absolute -top-2 -right-2 bg-gold text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(188,155,93,0.4)] border-2 border-noir z-20">
                        {card.badge}
                      </div>
                    )}
                  </div>
                </div>

                {/* Espace pour l'image */}
                <div className="mt-14 w-full text-center space-y-3 mb-8 flex-1">
                  <h3 className="text-xl lg:text-2xl font-serif font-bold text-white group-hover:text-gold transition-colors">
                    {card.name}
                  </h3>
                  <div className="text-3xl font-serif text-gold">
                    {card.price}€
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed px-2">
                    {card.description}
                  </p>
                </div>

                {/* Liste des caractéristiques avec puces or */}
                <div className="w-full space-y-3 mb-10">
                  {card.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                      <span className="text-sm text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Bouton d'Achat (Bouton Or) */}
                <button className="w-14 h-14 rounded-full bg-gold hover:bg-gold-light flex items-center justify-center text-noir shadow-[0_0_20px_rgba(188,155,93,0.3)] group-hover:shadow-[0_0_30px_rgba(188,155,93,0.5)] transition-all duration-300">
                  <Heart size={20} className="fill-current" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
