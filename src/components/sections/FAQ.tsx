import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { API_URL } from '../../constants';

const FAQS = [
  {
    question: "Comment se déroule l'arrivée ?",
    answer: "Pour préserver votre intimité, l’arrivée se fait en autonomie. Le jour de votre réservation, vous recevez un code d’accès par SMS et email pour entrer dans votre suite à l’heure prévue."
  },
  {
    question: "La confidentialité est-elle réellement garantie ?",
    answer: "Absolument. Nous avons conçu l'expérience Maison Love Rooms pour qu'aucun contact physique ne soit nécessaire. L'entrée est privée, sans réception ni personnel visible, vous garantissant une intimité absolue."
  },
  {
    question: "Quels sont les tarifs et formules proposés ?",
    answer: "Nos tarifs débutent à 189€ la nuit avec une bouteille de champagne offerte. Nous proposons également une formule complète à 299€ incluant champagne, softs, décoration romantique, plateau repas et petit-déjeuner gourmand."
  },
  {
    question: "Quels sont les équipements inclus dans les chambres ?",
    answer: "Chaque suite dispose d'un espace bien-être privé (Balnéo pour Love Story, Spa pour Baguerra), d'un lit King Size, d'une cuisine équipée, et d'un système audio Bluetooth pour créer votre propre atmosphère."
  },
  {
    question: "Y a-t-il une durée minimum de réservation ?",
    answer: "La durée de réservation est d'une nuit minimum et de deux nuits maximum, afin de préserver l'exclusivité et la qualité de préparation de nos écrins."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState(FAQS);

  useEffect(() => {
    fetch(`${API_URL}/api/faqs`)
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data.map((f: any) => ({ question: f.question, answer: f.answer })));
        }
      })
      .catch(() => console.log('Utilisation des FAQ statiques de secours'));
  }, []);

  return (
    <section id="faq" className="pt-24 md:pt-48 pb-12 md:pb-20 mx-3 bg-[#FAF9F6] border-t border-noir/5">
      <div className="container-wide px-4 md:px-8">

        {/* Header centré (au-dessus) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 md:mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-serif leading-[0.9] tracking-tighter text-noir">
            Vos questions, <br />
            <span className="italic text-gold">nos réponses.</span>
          </h2>
        </motion.div>

        {/* Accordion (en dessous, centré) */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`border-b border-noir/10 overflow-hidden transition-all duration-500 ${openIndex === idx ? 'pb-8' : 'pb-0'}`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full py-8 flex items-center justify-between text-left group gap-6"
                >
                  <span className={`text-xl md:text-2xl font-serif transition-all duration-300 ${openIndex === idx ? 'text-gold' : 'text-noir/80 group-hover:text-noir'}`}>
                    {faq.question}
                  </span>
                  <div className={`shrink-0 transition-transform duration-500 ${openIndex === idx ? 'rotate-180 text-gold' : 'text-noir/30'}`}>
                    <ChevronDown size={24} strokeWidth={1} />
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="text-lg text-noir/50 font-serif italic leading-relaxed pr-12">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
