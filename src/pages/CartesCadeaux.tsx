import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_URL } from '../constants';

const CARDS_PER_PAGE = 3;

interface GiftCardData {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  features: string[];
  badge?: string;
  status: 'actif' | 'inactif';
}

export default function CartesCadeaux() {
  const [cards, setCards] = useState<GiftCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const totalPages = Math.max(1, Math.ceil(cards.length / CARDS_PER_PAGE));
  const visibleCards = cards.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  const goToPage = (next: number) => {
    setDirection(next > page ? 1 : -1);
    setPage(next);
  };
  const prevPage = () => goToPage(page === 0 ? totalPages - 1 : page - 1);
  const nextPage = () => goToPage(page === totalPages - 1 ? 0 : page + 1);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/gift-cards`);
        if (res.ok) {
          const data = await res.json();
          setCards(data.filter((card: GiftCardData) => card.status === 'actif'));
        }
      } catch (err) {
        console.error('Erreur lors du chargement des cartes cadeaux', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

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
            Cartes cadeaux
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 max-w-2xl mx-auto text-lg"
          >
            Que ce soit pour raviver la flamme, fêter un moment précieux ou simplement vous retrouver, Maison Love Rooms vous promet une parenthèse magique et inoubliable.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gold/80 max-w-2xl mx-auto text-base italic font-serif"
          >
            Contactez nous pour en savoir plus et recevoir votre carte cadeau (offerte)
          </motion.p>
        </div>

        {/* Carousel des Cartes Cadeaux */}
        <div className="relative px-0 md:px-16">

          {/* Flèche gauche */}
          {totalPages > 1 && (
            <button
              onClick={prevPage}
              aria-label="Cartes précédentes"
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/15 bg-white/5 backdrop-blur-md items-center justify-center text-white/70 hover:text-noir hover:bg-gold hover:border-gold transition-all duration-300"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Flèche droite */}
          {totalPages > 1 && (
            <button
              onClick={nextPage}
              aria-label="Cartes suivantes"
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/15 bg-white/5 backdrop-blur-md items-center justify-center text-white/70 hover:text-noir hover:bg-gold hover:border-gold transition-all duration-300"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Conteneur des 3 cartes visibles */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              initial={{ opacity: 0, x: direction >= 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction >= 0 ? -80 : 80 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-10 pt-8"
            >
              {visibleCards.map((card, idx) => (
                <motion.div
                  key={card._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * idx }}
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
            </motion.div>
          </AnimatePresence>

          {/* Points de pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-16">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  aria-label={`Aller à la page ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${i === page ? 'w-8 h-2 bg-gold' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                    }`}
                />
              ))}
            </div>
          )}

          {/* Flèches mobiles (sous les cartes) */}
          {totalPages > 1 && (
            <div className="flex md:hidden items-center justify-center gap-4 mt-8">
              <button
                onClick={prevPage}
                aria-label="Cartes précédentes"
                className="w-12 h-12 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/70 active:bg-gold active:text-noir transition-all"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={nextPage}
                aria-label="Cartes suivantes"
                className="w-12 h-12 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/70 active:bg-gold active:text-noir transition-all"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
