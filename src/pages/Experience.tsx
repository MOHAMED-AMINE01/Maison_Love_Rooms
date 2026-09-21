import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Moon, Check, Clock, Star, DoorOpen, KeyRound, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../constants';

const FORMULES = [
  {
    name: "Formule Essentielle",
    price: "189 €",
    billingType: "nuit",
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
    price: "299 €",
    billingType: "nuit",
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

export default function Experience() {
  const [formulesList, setFormulesList] = useState(FORMULES);
  const [checkInTime, setCheckInTime] = useState("18 h");
  const [checkOutTime, setCheckOutTime] = useState("11 h");

  useEffect(() => {
    // Formules (offre principale) — dédoublonnées par nom pour l'aperçu marketing.
    fetch(`${API_URL}/api/formules`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const seen = new Set<string>();
          const unique = data.filter((f: any) => {
            if (seen.has(f.name)) return false;
            seen.add(f.name);
            return true;
          });
          const mapped = unique.map((f: any, idx: number) => ({
            name: f.name,
            price: `${f.price} €`,
            billingType: f.billingType || 'nuit',
            description: f.description,
            features: f.features && f.features.length > 0 ? f.features : (FORMULES[idx]?.features || FORMULES[0].features),
            cta: /complè?te/i.test(f.name) ? "Réserver l'expérience complète" : "Réserver cette formule",
            popular: f.isPopular === true
          }));
          setFormulesList(mapped);
        }
      })
      .catch(() => console.log('Utilisation des formules statiques de secours'));

    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.checkInTime) setCheckInTime(data.checkInTime.replace(':', ' h'));
          if (data.checkOutTime) setCheckOutTime(data.checkOutTime.replace(':', ' h'));
        }
      })
      .catch(() => console.log('Paramètres non disponibles'));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-page min-h-screen font-sans selection:bg-gold/30"
    >
      {/* Hero — Horaires d'arrivée et de départ */}
      <section className="relative h-[55vh] md:h-[50vh] flex items-center overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2 }} className="absolute inset-0">
          <img
            src="/photos/maison-1.jpeg"
            className="w-full h-full object-cover brightness-[0.35]"
            alt="Experience background"
          />
        </motion.div>

        <div className="container-wide relative z-10 px-6 md:px-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl md:text-7xl font-serif text-gold leading-tight tracking-tighter mb-8"
          >
            Horaires d'arrivée et de départ
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center">
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

      {/* Rituel d'arrivée */}
      <section className="py-12 md:py-16 bg-page border-b border-gold/10">
        <div className="container-wide px-6 md:px-12">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-serif text-noir">Votre arrivée en toute <span className="italic text-gold">simplicité</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              { icon: <DoorOpen size={28} strokeWidth={1} />, title: "Accès indépendant", desc: "L'accès à votre hébergement est indépendant, sécurisé et autonome." },
              { icon: <KeyRound size={28} strokeWidth={1} />, title: "Code d'accès", desc: "Le jour de votre arrivée, nous vous communiquons un code unique qui vous permettra de rentrer, de façon sécurisée et en toute autonomie." },
              { icon: <Car size={28} strokeWidth={1} />, title: "Stationnement", desc: "Vous pouvez ainsi vous garer gratuitement et facilement sur une place réservée." }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white via-[#EFE6D2] to-white p-6 md:p-8 rounded-2xl md:rounded-3xl space-y-3 text-center border border-gold/10 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-500"
              >
                <div className="text-gold flex justify-center">{step.icon}</div>
                <h3 className="text-lg font-serif text-noir">{step.title}</h3>
                <p className="text-[12px] text-noir/50 font-light leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos formules (aperçu) */}
      <section className="py-16 md:py-20 bg-page relative overflow-hidden border-t border-gold/10">
        <div className="container-wide px-6 md:px-12 relative z-10">
          <div className="text-center mb-6 md:mb-10 space-y-2">
            <h2 className="text-3xl md:text-5xl font-serif text-noir leading-none">Nos <span className="italic text-gold">formules</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
            {formulesList.map((formule, idx) => (
              <motion.div
                key={formule.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12 }}
                className={`relative p-8 md:p-10 rounded-2xl md:rounded-3xl border flex flex-col h-full transition-all duration-500 ${formule.popular ? 'bg-gold/5 border-gold/40 shadow-lg hover:shadow-xl' : 'bg-gold/4 border-gold/10 hover:border-gold/20 shadow-sm'}`}
              >
                {formule.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gold text-noir px-6 py-2 rounded-full text-[8px] uppercase tracking-[0.3em] font-black shadow-lg flex items-center gap-2">
                    <Star size={10} fill="white" /> Recommandé
                  </div>
                )}

                <div className="mb-6 text-center md:text-left flex flex-col justify-start">
                  <h3 className="text-2xl md:text-3xl font-serif text-noir mb-2">{formule.name}</h3>
                  <p className="text-noir/80 font-serif italic text-xs md:text-sm leading-relaxed">{formule.description}</p>
                </div>

                <div className="mb-8 flex justify-center md:justify-start">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-serif text-noir">{formule.price}</span>
                    {formule.billingType === 'nuit' ? (
                      <span className="text-noir/70 text-sm font-serif italic">/ nuit</span>
                    ) : formule.billingType === 'apres_midi' ? (
                      <span className="text-noir/70 text-sm font-serif italic">/ après-midi</span>
                    ) : null}
                  </div>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {formule.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-noir/80">
                      <div className="mt-0.5 w-3.5 h-3.5 rounded-full border border-gold/40 flex items-center justify-center text-gold shrink-0">
                        <Check size={7} />
                      </div>
                      <span className="text-xs font-light leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/checkout" state={{ formuleName: formule.name }} className={`block w-full py-3.5 rounded-full text-center text-[9px] uppercase tracking-[0.3em] font-bold transition-all duration-500 ${formule.popular ? 'bg-gold text-noir hover:bg-gold-light' : 'border border-gold/20 text-noir/60 hover:bg-noir/5 hover:border-gold/40'}`}>
                  {formule.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infos pratiques */}
      <section className="bg-page py-16 md:py-24">
        <div className="container-wide px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-10 md:p-16 bg-gold/[0.1] rounded-[3.5rem] text-noir flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 relative overflow-hidden shadow-xl"
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
    </motion.div>
  );
}
