import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const FAQS = [
  {
    question: "Comment se déroule l'arrivée dans la suite ?",
    answer: "Pour une discrétion totale, l'accès se fait de manière 100% autonome. Le jour de votre réservation, vous recevrez un code unique par SMS et email vous permettant de déverrouiller votre suite (Love Story ou Baguerra) à l'heure convenue."
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

  return (
    <section id="faq" className="pt-24 md:pt-48 pb-12 md:pb-20 mx-3 bg-[#FAF9F6] border-t border-noir/5">
      <div className="container-wide px-4 md:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32">

          {/* Left Column: Editorial Header */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >

              <h2 className="text-5xl md:text-7xl text-center md:text-left font-serif leading-[0.85] tracking-tighter text-noir">
                Vos questions, <br className="hidden md:block" />
                <span className="italic text-gold">nos réponses.</span>
              </h2>
              <p className="text-xl text-noir/40 font-serif italic leading-relaxed max-w-sm text-center md:text-left">
                "Parce que la sérénité commence par la clarté, nous avons anticipé chacun de vos besoins."
              </p>
            </motion.div>

          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
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
                    className="w-full py-8 flex items-center justify-between text-left group"
                  >
                    <span className={`text-xl md:text-2xl font-serif transition-all duration-300 ${openIndex === idx ? 'text-gold' : 'text-noir/80 group-hover:text-noir'}`}>
                      {faq.question}
                    </span>
                    <div className={`transition-transform duration-500 ${openIndex === idx ? 'rotate-180 text-gold' : 'text-noir/30'}`}>
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

      </div>
    </section>
  );
}
