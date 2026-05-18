import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Wine, Heart, Sparkles, Moon, Check, Clock, ShieldCheck, Star, Utensils, Zap, Key, EyeOff, Instagram, ArrowRight } from 'lucide-react';
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



const COMPARISON_DATA = [
  { label: "Check-in 18h / Check-out 11h", e: true, c: true },
  { icon: Sparkles, label: "Balnéo privatif illimité", e: true, c: true },
  { icon: Wine, label: "Bouteille de Champagne", e: true, c: true },
  { icon: Heart, label: "Ambiance Romantique (Bougies LED)", e: true, c: true },
  { label: "Linge complet & Hygiène", e: true, c: true },
  { label: "Ménage Premium", e: true, c: true },
  { icon: Utensils, label: "Plateau Repas (Salé & Sucré)", e: false, c: true },
  { label: "Petit-Déjeuner (Pancakes, Fruits...)", e: false, c: true },
  { label: "Softs & Eaux Pétillantes", e: false, c: true },
  { icon: Zap, label: "Ambiance (Jeux, Musique Bluetooth)", e: false, c: true },
  { label: "Peignoirs de bain Premium", e: false, c: true },
];

// Mappe un label à une icône Lucide via mots-clés
const getIconForLabel = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('champagne') || l.includes('bouteille') || l.includes('vin')) return Wine;
  if (l.includes('balnéo') || l.includes('spa') || l.includes('jacuzzi')) return Sparkles;
  if (l.includes('romantique') || l.includes('bougies') || l.includes('pétales') || l.includes('rose')) return Heart;
  if (l.includes('repas') || l.includes('petit-déjeuner') || l.includes('dîner') || l.includes('traiteur')) return Utensils;
  if (l.includes('musique') || l.includes('jeux') || l.includes('bluetooth') || l.includes('ambiance')) return Zap;
  return null;
};

export default function Experience() {
  const [formulesList, setFormulesList] = useState(FORMULES);
  const [comparisonData, setComparisonData] = useState(COMPARISON_DATA);
  const [checkInTime, setCheckInTime] = useState("18h");
  const [checkOutTime, setCheckOutTime] = useState("11h");
  const [maxNights, setMaxNights] = useState(2);
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsScrollable(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    const timeout = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', checkScroll);
    };
  }, [formulesList]);

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
              c: row.c,
              icon: getIconForLabel(row.label)
            }));
            setComparisonData(rows);
          }
        }
      })
      .catch(() => console.log('Utilisation du tableau comparatif statique de secours'));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#FAF9F6] min-h-screen font-sans selection:bg-gold/30"
    >
      {/* Hero Section - Balanced height */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2670&auto=format&fit=crop"
            className="w-full h-full object-cover brightness-[0.55]"
            alt="Experience background"
          />
        </motion.div>

        <div className="container-wide relative z-10 px-6 md:px-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-7xl font-serif text-white leading-tight tracking-tighter mb-6"
          >
            L'Expérience <br />
            <span className="italic text-white">Absolue</span>
          </motion.h1>
        </div>
      </section>

      {/* Arrival Ritual Section - Minimalist & Compact */}
      <section className="py-12 md:py-24 bg-white border-b border-noir/5">
        <div className="container-wide px-6 md:px-12">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-serif text-noir">Le <span className="italic text-gold">Rituel</span> d'Arrivée</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              { icon: <ShieldCheck size={32} strokeWidth={1} />, title: "Discrétion Absolue", desc: "Confirmation par email crypté. Aucune mention 'Love Room' sur vos relevés bancaires." },
              { icon: <Key size={32} strokeWidth={1} />, title: "Check-in Autonome", desc: "Entrée privée avec code unique reçu par SMS. Pas de réception, pas de personnel." },
              { icon: <EyeOff size={32} strokeWidth={1} />, title: "Insonorisation", desc: "Chambres pensées comme des cocons, parfaitement insonorisées pour une intimité totale." }
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
      <section className="py-20 md:py-32 bg-[#FAF9F6] relative overflow-hidden">
        <div className="container-wide px-6 md:px-12 relative z-10">
          <div className="text-center mb-8 md:mb-12 space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif text-noir leading-none">Nos <span className="italic text-gold">Offres</span></h2>
          </div>

          {isScrollable && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end items-center gap-2 text-noir/40 mb-4 pr-4 md:pr-0"
            >
               <span className="text-[10px] uppercase tracking-widest font-bold">Faites défiler pour voir plus</span>
               <motion.div
                 animate={{ x: [0, 5, 0] }}
                 transition={{ repeat: Infinity, duration: 1.5 }}
               >
                 <ArrowRight size={14} />
               </motion.div>
            </motion.div>
          )}

          <div 
            ref={scrollContainerRef}
            className={
            formulesList.length === 1 
              ? "grid grid-cols-1 max-w-2xl mx-auto mb-20 md:mb-32 pt-8" 
              : formulesList.length === 2 
              ? "grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto mb-20 md:mb-32 pt-8" 
              : "flex overflow-x-auto pt-8 pb-8 gap-8 snap-x snap-mandatory scrollbar-none mb-20 md:mb-32 px-4 -mx-4 md:px-0 md:mx-0"
          }>
            {formulesList.map((formule, idx) => (
              <motion.div
                key={formule.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`relative p-10 md:p-12 rounded-[3.5rem] border border-noir/[0.05] flex flex-col ${formulesList.length >= 3 ? 'w-[350px] md:w-[420px] shrink-0 snap-center' : ''} ${formule.popular ? 'bg-white border-gold/30 shadow-xl' : 'bg-white/50'}`}
              >
                {formule.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gold text-white px-6 py-2 rounded-full text-[8px] uppercase tracking-[0.3em] font-black shadow-lg flex items-center gap-2">
                    <Star size={10} fill="white" /> Recommandé
                  </div>
                )}

                <div className="mb-8 text-center md:text-left">
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

          {/* Comparison Table - Refined sizing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto overflow-x-auto bg-white p-8 md:p-12 rounded-[3rem] border border-noir/[0.05] shadow-sm"
          >
            <h4 className="text-2xl font-serif text-noir mb-8 text-center">Tableau <span className="italic text-gold">Comparatif</span></h4>
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-noir/10">
                  <th className="py-4 text-[8px] uppercase tracking-widest text-noir/80 font-black">Prestation</th>
                  <th className="py-4 text-[8px] uppercase tracking-widest text-noir/80 font-black text-center">Essentielle</th>
                  <th className="py-4 text-[8px] uppercase tracking-widest text-gold font-black text-center">Complète</th>
                </tr>
              </thead>
              <tbody className="text-noir/50">
                {comparisonData.map((row, i) => (
                  <tr key={i} className="border-b border-noir/5 hover:bg-noir/[0.02] transition-colors">
                    <td className="py-4 flex items-center gap-4">
                      {row.icon && <row.icon size={14} className="text-gold/40" />}
                      <span className="text-xs font-light text-noir/80">{row.label}</span>
                    </td>
                    <td className="py-4 text-center">
                      {row.e ? <Check size={14} className="mx-auto text-noir/80" /> : <span className="text-noir/55">—</span>}
                    </td>
                    <td className="py-4 text-center">
                      {row.c ? <Check size={14} className="mx-auto text-gold" /> : <span className="text-noir/5">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Practical Info Banner - Compacted */}
      <section className="bg-[#FAF9F6] py-16 md:py-24">
        <div className="container-wide px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-10 md:p-16 bg-gold/[0.1] rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 relative overflow-hidden shadow-xl"
          >
            <div className="space-y-4 text-center md:text-left z-10">
              <h2 className="text-4xl md:text-5xl font-serif leading-none italic text-noir">Infos Pratiques</h2>
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
                 <p className="text-xl md:text-2xl font-serif text-noir">1 à {maxNights} nuits <br /> maximum</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
