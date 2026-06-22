import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Check, Clock, Star, ChevronLeft, ChevronRight, DoorOpen, KeyRound, Car, Gift, Heart, ShoppingBag, X } from 'lucide-react';
import { API_URL } from '../constants';

const FORMULES = [
  {
    name: "Formule Essentielle",
    price: "189€",
    description: "Une parenthèse enchantée centrée sur l'essentiel du prestige et de l'intimité.",
    features: [
      "Arrivée 18h / Départ 11h",
      "Accès Balnéo privatif illimité",
      "Ambiance romantique (Bougies LED)",
      "1 Bouteille de champagne offerte",
      "Linge de lit & Serviettes épaisses",
      "Café Nespresso & Thés à disposition",
      "Produits de douche & Hygiène",
      "Ménage premium inclus"
    ],
    cta: "Réserver cette formule",
    popular: false
  },
  {
    name: "Formule Complète",
    price: "299€",
    description: "L'immersion totale. Chaque détail est orchestré pour une nuit inoubliable.",
    features: [
      "Tout le contenu de l'Essentielle",
      "1/2 Bouteille de soft / Eau pétillante",
      "Plateau Repas (Salé & Sucré) pour 2",
      "Petit-déjeuner complet (Pancakes...)",
      "Décoration pétales de roses",
      "Ambiance Musicale (Enceinte Bluetooth)",
      "Boîtes de jeux & Accessoires",
      "Peignoirs premium à disposition"
    ],
    cta: "Réserver l'expérience complète",
    popular: true
  }
];



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

const GIFT_CARDS_PER_PAGE = 4;

interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  status: 'actif' | 'inactif';
}

const COMPARISON_DATA = [
  { label: "Check-in 18h / Check-out 11h", e: true, c: true },
  { label: "Balnéo privatif illimité", e: true, c: true },
  { label: "Bouteille de Champagne", e: true, c: true },
  { label: "Ambiance Romantique (Bougies LED)", e: true, c: true },
  { label: "Linge complet & Hygiène", e: true, c: true },
  { label: "Ménage Premium", e: true, c: true },
  { label: "Plateau Repas (Salé & Sucré)", e: false, c: true },
  { label: "Petit-Déjeuner (Pancakes, Fruits...)", e: false, c: true },
  { label: "Softs & Eaux Pétillantes", e: false, c: true },
  { label: "Ambiance (Jeux, Musique Bluetooth)", e: false, c: true },
  { label: "Peignoirs de bain Premium", e: false, c: true },
];

export default function Experience() {
  const [formulesList, setFormulesList] = useState(FORMULES);
  const [comparisonData, setComparisonData] = useState(COMPARISON_DATA);
  const [checkInTime, setCheckInTime] = useState("18h");
  const [checkOutTime, setCheckOutTime] = useState("11h");
  const [maxNights, setMaxNights] = useState(2);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Cartes cadeaux (anciennement une page dédiée, désormais intégrée ici)
  const [giftCards, setGiftCards] = useState<GiftCardData[]>([]);
  const [giftPage, setGiftPage] = useState(0);
  const [giftDir, setGiftDir] = useState(0);
  const giftTotalPages = Math.max(1, Math.ceil(giftCards.length / GIFT_CARDS_PER_PAGE));
  const visibleGiftCards = giftCards.slice(
    giftPage * GIFT_CARDS_PER_PAGE,
    giftPage * GIFT_CARDS_PER_PAGE + GIFT_CARDS_PER_PAGE
  );
  const goToGiftPage = (next: number) => {
    setGiftDir(next > giftPage ? 1 : -1);
    setGiftPage(next);
  };
  const prevGiftPage = () => goToGiftPage(giftPage === 0 ? giftTotalPages - 1 : giftPage - 1);
  const nextGiftPage = () => goToGiftPage(giftPage === giftTotalPages - 1 ? 0 : giftPage + 1);

  // Produits / boutique (vente en ligne sans paiement, décrément auto du stock)
  const [products, setProducts] = useState<ProductData[]>([]);
  const [orderProduct, setOrderProduct] = useState<ProductData | null>(null);
  const [orderForm, setOrderForm] = useState({ name: '', email: '', phone: '' });
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');

  const openOrderModal = (product: ProductData) => {
    setOrderProduct(product);
    setOrderForm({ name: '', email: '', phone: '' });
    setOrderSuccess(false);
    setOrderError('');
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderProduct) return;
    if (!orderForm.name || !orderForm.email) {
      setOrderError('Merci de renseigner votre nom et votre email.');
      return;
    }
    setOrderSubmitting(true);
    setOrderError('');
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ productId: orderProduct._id, quantity: 1 }],
          customerName: orderForm.name,
          customerEmail: orderForm.email,
          customerPhone: orderForm.phone,
        }),
      });
      if (res.ok) {
        // Met à jour le stock localement (décrément auto déjà effectué côté serveur)
        setProducts(prev =>
          prev.map(p => (p._id === orderProduct._id ? { ...p, stock: Math.max(0, p.stock - 1) } : p))
        );
        setOrderSuccess(true);
      } else {
        const err = await res.json().catch(() => ({}));
        setOrderError(err.message || "La commande n'a pas pu être enregistrée.");
      }
    } catch {
      setOrderError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Fetch services
    fetch(`${API_URL}/api/services`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const activeFormules = data
            .filter((s: any) => s.status === 'actif')
            .map((s: any, idx: number) => ({
              name: s.name,
              price: `${s.price}€`,
              description: s.description,
              features: s.features && s.features.length > 0 ? s.features : (FORMULES[idx]?.features || FORMULES[0].features),
              cta: s.name.toLowerCase().includes('complète') ? "Réserver l'expérience complète" : "Réserver cette formule",
              popular: s.isPopular === true
            }));
          if (activeFormules.length > 0) {
            setFormulesList(activeFormules);
          }
        }
      })
      .catch(() => console.log('Utilisation des formules statiques de secours'));

    // Fetch tableau comparatif depuis la DB
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.checkInTime) setCheckInTime(data.checkInTime.replace(':', 'h'));
          if (data.checkOutTime) setCheckOutTime(data.checkOutTime.replace(':', 'h'));
          if (data.maxNights !== undefined) setMaxNights(data.maxNights);

          if (data.comparisonTable && data.comparisonTable.length > 0) {
            const rows = data.comparisonTable.map((row: any) => ({
              label: row.label,
              e: row.e,
              c: row.c
            }));
            setComparisonData(rows);
          }
        }
      })
      .catch(() => console.log('Utilisation du tableau comparatif statique de secours'));

    // Fetch des cartes cadeaux actives
    fetch(`${API_URL}/api/admin/gift-cards`)
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        if (Array.isArray(data)) {
          setGiftCards(data.filter((card: GiftCardData) => card.status === 'actif'));
        }
      })
      .catch(() => console.log('Aucune carte cadeau disponible'));

    // Fetch des produits actifs (boutique)
    fetch(`${API_URL}/api/products`)
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(() => console.log('Aucun produit disponible'));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-page min-h-screen font-sans selection:bg-gold/30"
    >
      {/* Hero Section - Balanced height */}
      <section className="relative h-[70vh] md:h-[60vh] flex items-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2670&auto=format&fit=crop"
            className="w-full h-full object-cover brightness-[0.35]"
            alt="Experience background"
          />
        </motion.div>

        <div className="container-wide relative z-10 px-6 md:px-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-7xl font-serif text-gold leading-tight tracking-tighter mb-8"
          >
            Horaires d'arrivée et de départ
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-center text-white/80">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-widest font-light opacity-70">Arrivée</p>
                <p className="text-lg md:text-xl font-serif">À partir de {checkInTime}</p>
              </div>
              <div className="hidden md:block w-px bg-white/20"></div>
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-widest font-light opacity-70">Départ</p>
                <p className="text-lg md:text-xl font-serif">{checkOutTime} au plus tard</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Arrival Ritual Section - Minimalist & Compact */}
      <section className="py-12 md:py-24 bg-page border-b border-noir/5">
        <div className="container-wide px-6 md:px-12">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-serif text-noir">Le <span className="italic text-gold">rituel</span> d'arrivée</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              { icon: <DoorOpen size={32} strokeWidth={1} />, title: "Accès indépendant", desc: "L'accès à votre hébergement est indépendant, sécurisé et autonome." },
              { icon: <KeyRound size={32} strokeWidth={1} />, title: "Code d'accès", desc: "Le jour de votre arrivée, nous vous communiquons un code unique qui vous permettra de rentrer, de façon sécurisée et en toute autonomie." },
              { icon: <Car size={32} strokeWidth={1} />, title: "Stationnement", desc: "Vous pouvez ainsi vous garer gratuitement et facilement sur une place réservée." }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-[#FAF9F6] p-10 md:p-12 rounded-[3.5rem] space-y-4 text-center border border-noir/[0.02] shadow-sm hover:shadow-lg transition-all duration-700"
              >
                <div className="text-gold flex justify-center">{step.icon}</div>
                <h3 className="text-xl font-serif text-noir">{step.title}</h3>
                <p className="text-[13px] text-noir/50 font-light leading-relaxed max-w-[240px] mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formules - Compact Premium Section */}
      <section className="py-20 md:py-32 bg-page relative overflow-hidden">
        <div className="container-wide px-6 md:px-12 relative z-10">
          <div className="text-center mb-8 md:mb-12 space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif text-noir leading-none">Nos <span className="italic text-gold">offres</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-10 pt-8 items-start">
            {formulesList.map((formule, idx) => (
              <motion.div
                key={formule.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12 }}
                className={`relative p-10 md:p-12 rounded-[3.5rem] border border-noir/[0.05] flex flex-col h-full ${formule.popular ? 'bg-white border-gold/30 shadow-xl' : 'bg-white'}`}
              >
                {formule.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gold text-white px-6 py-2 rounded-full text-[8px] uppercase tracking-[0.3em] font-black shadow-lg flex items-center gap-2">
                    <Star size={10} fill="white" /> Recommandé
                  </div>
                )}

                <div className="mb-8 text-center md:text-left md:min-h-[140px] flex flex-col justify-start">
                  <h3 className="text-3xl md:text-4xl font-serif text-noir mb-4">{formule.name}</h3>
                  <p className="text-noir/40 font-serif italic text-sm leading-relaxed">{formule.description}</p>
                </div>

                <div className="mb-10 flex justify-center md:justify-start">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl md:text-7xl font-serif text-noir">{formule.price}</span>
                    <span className="text-noir/30 text-base font-serif italic">/ nuitée</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-16 flex-1">
                  {formule.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-noir/50">
                      <div className="mt-1.5 w-4 h-4 rounded-full border border-gold/30 flex items-center justify-center text-gold shrink-0">
                        <Check size={8} />
                      </div>
                      <span className="text-sm font-light leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a href="#suites" className={`w-full py-6 rounded-full text-center text-[10px] uppercase tracking-[0.4em] font-black transition-all duration-700 ${formule.popular ? 'bg-gold text-white hover:bg-noir' : 'border border-noir/10 text-noir/60 hover:bg-noir hover:text-white'}`}>
                  {formule.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Boutique - Produits en vente (vente en ligne, décrément auto du stock) */}
      {products.length > 0 && (
        <section className="relative bg-page py-20 md:py-32 overflow-hidden border-t border-noir/5">
          <div className="container-wide px-6 md:px-12">
            <div className="text-center space-y-4 mb-16 md:mb-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-16 h-16 bg-gradient-to-tr from-gold/80 to-gold rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(188,155,93,0.3)] mb-6"
              >
                <ShoppingBag size={28} className="text-noir" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-serif font-bold text-noir"
              >
                Notre <span className="italic text-gold">boutique</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-noir/50 max-w-2xl mx-auto text-lg"
              >
                Une sélection de produits pour prolonger l'expérience Maison Love Rooms chez vous.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {products.map((product, idx) => {
                const soldOut = product.stock <= 0;
                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.06 * idx }}
                    className="group bg-[#FAF9F6] border border-noir/[0.04] rounded-[2rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {soldOut ? (
                        <div className="absolute top-4 right-4 bg-noir/80 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full">
                          Rupture de stock
                        </div>
                      ) : product.stock <= 3 ? (
                        <div className="absolute top-4 right-4 bg-gold text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full">
                          Plus que {product.stock}
                        </div>
                      ) : null}
                    </div>

                    <div className="p-7 flex flex-col flex-1">
                      <h3 className="text-xl font-serif font-bold text-noir mb-2">{product.name}</h3>
                      <p className="text-noir/50 text-sm leading-relaxed mb-6 flex-1">{product.description}</p>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-2xl font-serif text-gold">{product.price}€</span>
                        <button
                          onClick={() => openOrderModal(product)}
                          disabled={soldOut}
                          className={`px-6 py-3 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500 ${soldOut
                            ? 'bg-noir/5 text-noir/30 cursor-not-allowed'
                            : 'bg-noir text-white hover:bg-gold'}`}
                        >
                          {soldOut ? 'Indisponible' : 'Commander'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Cartes Cadeaux - Section intégrée (anciennement page dédiée) */}
      {giftCards.length > 0 && (
        <section className="relative bg-page py-20 md:py-32 overflow-hidden border-t border-noir/5">
          <div className="container-wide px-6 md:px-12 relative z-10">
            {/* En-tête */}
            <div className="text-center space-y-4 mb-20 md:mb-24">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-16 h-16 bg-gradient-to-tr from-gold/80 to-gold rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(188,155,93,0.3)] mb-6"
              >
                <Gift size={28} className="text-noir" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-serif font-bold text-noir"
              >
                Cartes <span className="italic text-gold">cadeaux</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-noir/50 max-w-2xl mx-auto text-lg"
              >
                Que ce soit pour raviver la flamme, fêter un moment précieux ou simplement vous retrouver, Maison Love Rooms vous promet une parenthèse magique et inoubliable.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-gold max-w-2xl mx-auto text-base italic font-serif"
              >
                Contactez nous pour en savoir plus et recevoir votre carte cadeau (offerte)
              </motion.p>
            </div>

            {/* Carousel des cartes cadeaux */}
            <div className="relative px-0 md:px-0">
              {giftTotalPages > 1 && (
                <button
                  onClick={prevGiftPage}
                  aria-label="Cartes précédentes"
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border-2 border-noir/20 bg-white shadow-lg items-center justify-center text-noir hover:text-white hover:bg-gold hover:border-gold transition-all duration-300"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              {giftTotalPages > 1 && (
                <button
                  onClick={nextGiftPage}
                  aria-label="Cartes suivantes"
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border-2 border-noir/20 bg-white shadow-lg items-center justify-center text-noir hover:text-white hover:bg-gold hover:border-gold transition-all duration-300"
                >
                  <ChevronRight size={22} />
                </button>
              )}

              <AnimatePresence mode="wait" custom={giftDir}>
                <motion.div
                  key={giftPage}
                  custom={giftDir}
                  initial={{ opacity: 0, x: giftDir >= 0 ? 80 : -80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: giftDir >= 0 ? -80 : 80 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10 pt-8"
                >
                  {visibleGiftCards.map((card, idx) => (
                    <motion.div
                      key={card._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * idx }}
                      className="group relative"
                    >
                      <div className="bg-[#FAF9F6] border border-noir/[0.04] rounded-[2rem] pt-14 px-6 pb-10 flex flex-col items-center h-full relative z-10 group-hover:-translate-y-2 group-hover:border-gold/30 shadow-sm hover:shadow-xl transition-all duration-500">
                        <div className="absolute bottom-0 left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-full" />

                        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
                          <div className="relative">
                            <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-[6px] border-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] relative z-10 group-hover:scale-105 transition-transform duration-500">
                              <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                            </div>
                            {card.badge && (
                              <div className="absolute -top-2 -right-2 bg-gold text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(188,155,93,0.4)] border-2 border-white z-20">
                                {card.badge}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-14 w-full text-center space-y-3 mb-8 flex-1">
                          <h3 className="text-xl lg:text-2xl font-serif font-bold text-noir group-hover:text-gold transition-colors">
                            {card.name}
                          </h3>
                          <div className="text-3xl font-serif text-gold">
                            {card.price}€
                          </div>
                          <p className="text-noir/50 text-sm leading-relaxed px-2">
                            {card.description}
                          </p>
                        </div>

                        <div className="w-full space-y-3 mb-10">
                          {card.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                              <span className="text-sm text-noir/70">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <button className="w-14 h-14 rounded-full bg-gold hover:bg-gold-light flex items-center justify-center text-noir shadow-[0_0_20px_rgba(188,155,93,0.3)] group-hover:shadow-[0_0_30px_rgba(188,155,93,0.5)] transition-all duration-300">
                          <Heart size={20} className="fill-current" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Points de pagination */}
              {giftTotalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-16">
                  {Array.from({ length: giftTotalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToGiftPage(i)}
                      aria-label={`Aller à la page ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${i === giftPage ? 'w-8 h-2 bg-gold' : 'w-2 h-2 bg-noir/20 hover:bg-noir/40'}`}
                    />
                  ))}
                </div>
              )}

              {/* Flèches mobiles */}
              {giftTotalPages > 1 && (
                <div className="flex md:hidden items-center justify-center gap-4 mt-8">
                  <button
                    onClick={prevGiftPage}
                    aria-label="Cartes précédentes"
                    className="w-12 h-12 rounded-full border border-noir/20 bg-white flex items-center justify-center text-noir active:bg-gold active:text-white transition-all"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={nextGiftPage}
                    aria-label="Cartes suivantes"
                    className="w-12 h-12 rounded-full border border-noir/20 bg-white flex items-center justify-center text-noir active:bg-gold active:text-white transition-all"
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Practical Info Banner - Compacted */}
      <section className="bg-page py-16 md:py-24">
        <div className="container-wide px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-10 md:p-16 bg-gold/[0.1] rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 relative overflow-hidden shadow-xl"
          >
            <div className="space-y-4 text-center md:text-left z-10">
              <h2 className="text-4xl md:text-5xl font-serif leading-none italic text-noir">Infos pratiques</h2>
              <p className="text-noir/80 font-serif italic text-base md:text-lg max-w-[280px]">Tout ce qu'il faut savoir pour votre séjour.</p>
            </div>

            <div className="grid grid-cols-2 gap-8 md:gap-16 z-10">
              <div className="text-center md:text-left space-y-2">
                <div className="flex items-center gap-3 text-noir mb-1 justify-center md:justify-start">
                  <Clock size={16} />
                  <span className="text-[8px] uppercase tracking-widest font-black opacity-60">Horaires</span>
                </div>
                <p className="text-xl md:text-2xl font-serif text-noir">Arrivée {checkInTime} <br /> Départ {checkOutTime}</p>
              </div>

              <div className="text-center md:text-left space-y-2">
                <div className="flex items-center gap-3 text-noir mb-1 justify-center md:justify-start">
                  <Moon size={16} />
                  <span className="text-[8px] uppercase tracking-widest font-black opacity-60">Durée</span>
                </div>
                <p className="text-xl md:text-2xl font-serif text-noir">à partir de <br /> 1 nuit</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modale de commande (vente en ligne sans paiement — Phase 1) */}
      <AnimatePresence>
        {orderProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-noir/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-page border border-noir/10 rounded-[2rem] p-8 md:p-10 max-w-md w-full relative shadow-2xl"
            >
              <button
                onClick={() => setOrderProduct(null)}
                className="absolute top-5 right-5 text-noir/40 hover:text-noir transition-colors"
                aria-label="Fermer"
              >
                <X size={22} />
              </button>

              {orderSuccess ? (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 bg-gold/15 rounded-full mx-auto flex items-center justify-center">
                    <Check size={30} className="text-gold" />
                  </div>
                  <h3 className="text-2xl font-serif text-noir">Commande enregistrée</h3>
                  <p className="text-noir/50 text-sm leading-relaxed">
                    Merci ! Nous avons bien reçu votre commande pour <span className="font-semibold text-noir">{orderProduct.name}</span>.
                    Nous vous recontactons rapidement pour finaliser le paiement et la remise du produit.
                  </p>
                  <button
                    onClick={() => setOrderProduct(null)}
                    className="px-8 py-4 rounded-full bg-noir text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold transition-all duration-500"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <form onSubmit={submitOrder} className="space-y-5">
                  <div className="flex items-center gap-4 pb-5 border-b border-noir/10">
                    <img src={orderProduct.imageUrl} alt={orderProduct.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <h3 className="text-lg font-serif text-noir leading-tight">{orderProduct.name}</h3>
                      <span className="text-gold font-serif text-xl">{orderProduct.price}€</span>
                    </div>
                  </div>

                  <p className="text-noir/50 text-xs leading-relaxed">
                    Renseignez vos coordonnées pour passer commande. Le paiement se fait ensuite avec notre équipe (aucun débit en ligne pour le moment).
                  </p>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={orderForm.name}
                      onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 bg-white border border-noir/10 rounded-xl text-noir placeholder-noir/30 focus:outline-none focus:border-gold"
                    />
                    <input
                      type="email"
                      value={orderForm.email}
                      onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                      placeholder="Votre email"
                      className="w-full px-4 py-3 bg-white border border-noir/10 rounded-xl text-noir placeholder-noir/30 focus:outline-none focus:border-gold"
                    />
                    <input
                      type="tel"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                      placeholder="Téléphone (optionnel)"
                      className="w-full px-4 py-3 bg-white border border-noir/10 rounded-xl text-noir placeholder-noir/30 focus:outline-none focus:border-gold"
                    />
                  </div>

                  {orderError && <p className="text-red-500 text-sm">{orderError}</p>}

                  <button
                    type="submit"
                    disabled={orderSubmitting}
                    className="w-full py-4 rounded-full bg-noir text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold transition-all duration-500 disabled:opacity-50"
                  >
                    {orderSubmitting ? 'Envoi en cours...' : 'Valider la commande'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
