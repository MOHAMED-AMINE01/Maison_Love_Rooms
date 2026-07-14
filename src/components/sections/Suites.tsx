import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SUITES } from '../../constants';
import { API_URL } from '../../constants';

export default function Suites() {
  const [suitesList, setSuitesList] = useState(SUITES);

  useEffect(() => {
    fetch(`${API_URL}/api/suites`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSuitesList(data.map(s => ({
            id: s.name.toLowerCase().replace(/\s+/g, '-'),
            name: s.name,
            description: s.description,
            price: s.pricePerNight.toString(),
            image: s.imageUrl || '/images/suites/suite-1.jpg',
            features: s.features || [],
            tagline: s.tagline || ''
          })));
        }
      })
      .catch(err => console.log('Utilisation des données statiques de secours pour les suites'));
  }, []);

  return (
    <section id="suites" className="py-20 md:py-32 bg-page overflow-hidden">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24 gap-8 px-4">
          <div className="max-w-2xl space-y-6 text-center md:text-start">
            <h2 className="notranslate text-5xl md:text-8xl font-serif leading-[0.85] tracking-tighter text-noir">
              Nos love rooms <span className="italic text-gold">pensées pour deux</span>
            </h2>
          </div>
          <p className="text-noir/80 font-serif italic text-lg md:text-xl max-w-sm border-l border-gold/30 pl-8 text-center md:text-start">
            Chaque chambre a été imaginée pour créer une vraie parenthèse à deux : plus d'intimité, plus de confort, moins de quotidien.
          </p>
        </div>

        <div className="space-y-32 md:space-y-48 mx-5">
          {suitesList.map((suite, index) => (
            <motion.div
              key={suite.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
            >
              {/* Image Side */}
              <div className="w-full lg:w-[55%] relative group">
                <div className="overflow-hidden rounded-[2.5rem] md:rounded-[4rem] shadow-3xl bg-noir">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src={suite.image}
                    alt={suite.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-[4/3] md:aspect-[16/10] object-cover brightness-90 group-hover:brightness-100 transition-all"
                  />
                </div>
                {/* Floating Price Tag */}
                <div className="absolute -bottom-6 right-8 md:right-16 bg-white px-8 py-4 rounded-full shadow-2xl border border-gold/10">
                  <p className="text-xl md:text-2xl font-serif text-noir">
                    À partir de <span className="text-2xl md:text-3xl text-gold">{suite.price} €</span>
                  </p>
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-[45%] space-y-8 md:space-y-10 px-4 md:px-0">
                <div className="space-y-4 md:space-y-6">
                  <div className="space-y-2">
                    <h3 translate="no" className="notranslate text-5xl md:text-7xl font-serif text-noir leading-none tracking-tight">
                      {suite.name}
                    </h3>
                  </div>

                  {suite.tagline && (
                    <p className="text-xl md:text-2xl font-serif italic text-gold/80 leading-tight">
                      {suite.tagline}
                    </p>
                  )}

                  <p className="text-lg md:text-xl text-noir/70 leading-relaxed font-light">
                    {suite.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {suite.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-5 py-2.5 rounded-full border border-noir/5 bg-gold/20 text-[9px] uppercase tracking-[0.2em] font-bold text-noir/80 hover:text-gold hover:border-gold transition-colors"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/suite/${suite.id}`}
                  className="inline-flex items-center gap-6 group"
                >
                  <div className="w-14 h-14 rounded-full bg-noir flex items-center justify-center text-white group-hover:bg-gold group-hover:text-noir transition-all duration-500 shadow-xl">
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.4em] font-black text-noir border-b border-transparent group-hover:border-gold transition-all">
                    Découvrir la chambre
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
