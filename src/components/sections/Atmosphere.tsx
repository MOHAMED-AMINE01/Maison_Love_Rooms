import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowUpRight } from 'lucide-react';

const MOMENTS = [
  {
    title: "L'Éveil des Sens",
    description: "Un rituel matinal où le café fraîchement torréfié rencontre la douceur des viennoiseries artisanales.",
    image: "/IMG_6403.jpeg",
    category: "Matinée"
  },
  {
    title: "Le Bain Sacré",
    description: "Une immersion profonde dans des eaux infusées aux essences botaniques rares.",
    image: "/IMG_6405.jpeg",
    category: "Rituel"
  },
  {
    title: "L'Heure Bleue",
    description: "La magie des ombres et des lumières tamisées pour une fin de journée sereine.",
    image: "/IMG_6407.jpeg",
    category: "Sérénité"
  }
];

export default function Atmosphere() {
  return (
    <section id="atmosphere" className="py-24 md:py-48 bg-[#FAF9F6] overflow-hidden">
      <div className="container-wide px-4 md:px-8">

        {/* Section Header: Centered on Mobile, Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-20 md:mb-32 items-end text-center lg:text-left">
          <div className="lg:col-span-7 space-y-6 md:space-y-8">

            <h2 className="text-4xl md:text-5xl lg:text-[7vw] font-serif leading-[0.85] tracking-tighter text-noir">
              Une <span className="italic text-gold">Atmosphère</span> <br />
              hors du temps.
            </h2>
          </div>
          <div className="lg:col-span-5 border-l-0 lg:border-l border-noir/5 pl-0 lg:pl-12 pb-2">
            <p className="text-lg md:text-xl text-noir/40 font-serif italic leading-relaxed max-w-sm mx-auto lg:mx-0">
              "Nous créons des espaces où le silence devient une mélodie, et chaque détail une invitation au voyage intérieur."
            </p>
          </div>
        </div>

        {/* Responsive Grid: 2 cols on mobile, 3 on desktop, 3rd is full-width on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12">
          {MOMENTS.map((moment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-[1.5rem] md:rounded-[4rem] bg-noir aspect-[4/5] 
                           ${index === 2 ? 'col-span-2 md:col-span-1 aspect-[16/10] md:aspect-[4/5]' : ''}`}
            >
              {/* Image */}
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.5 }}
                src={moment.image}
                alt={moment.title}
                className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-1000 grayscale-[30%] group-hover:grayscale-0"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 md:p-14 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="bg-white/10 backdrop-blur-md border border-white/10 px-4 md:px-6 py-2 rounded-full text-[7px] md:text-[10px] uppercase tracking-[0.4em] font-black text-white">
                    {moment.category}
                  </span>
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                {/* Aligned Content area: Title & Description */}
                <div className="transform translate-y-12 md:translate-y-16 group-hover:translate-y-0 transition-transform duration-700 ease-[0.22, 1, 0.36, 1]">
                  <h3 className="text-xl md:text-4xl font-serif text-white tracking-tight italic mb-4 md:mb-6">
                    {moment.title}
                  </h3>
                  <p className="text-[10px] md:text-base text-white/50 font-serif italic leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    {moment.description}
                  </p>
                </div>
              </div>

              {/* Decorative Border (Hover) */}
              <div className="absolute inset-4 md:inset-8 border border-white/10 rounded-[1.2rem] md:rounded-[3rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
