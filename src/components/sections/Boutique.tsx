import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star } from 'lucide-react';

const PRODUCTS = [
  { 
    name: "Bougie Signature", 
    price: "45€", 
    category: "Ambiance",
    image: "https://images.unsplash.com/photo-1596433809252-260c2745dfdd?q=80&w=2000&auto=format&fit=crop",
    featured: true
  },
  { 
    name: "Huile de Massage", 
    price: "35€", 
    category: "Bien-être",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=2000&auto=format&fit=crop",
    featured: false
  },
  { 
    name: "Peignoir Prestige", 
    price: "120€", 
    category: "Confort",
    image: "https://images.unsplash.com/photo-1621335829175-95f437384d7c?q=80&w=2000&auto=format&fit=crop",
    featured: false
  }
];

export default function Boutique() {
  return (
    <section id="boutique" className="py-24 md:py-48 bg-[#FAF9F6] overflow-hidden">
      <div className="container-wide px-4 md:px-8">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24 md:mb-32">
          <div className="space-y-8 text-center lg:text-left">

            <h2 className="text-5xl md:text-8xl font-serif leading-[0.85] tracking-tighter text-noir">
              Emportez <br />
              <span className="italic text-gold">l'Émotion.</span>
            </h2>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-6">
            <p className="max-w-xs text-center lg:text-right text-lg text-noir/40 font-serif italic leading-relaxed">
              "Prolongez l'expérience Maison Love Room au-delà de nos suites avec notre sélection d'essentiels."
            </p>
            <Link to="/prestations" className="group flex items-center gap-6 text-[11px] uppercase tracking-[0.5em] font-black text-noir hover:text-gold transition-colors">
              Voir l'univers complet <ArrowRight size={18} className="group-hover:translate-x-4 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          {PRODUCTS.map((product, idx) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-[2rem] md:rounded-[4rem] overflow-hidden mb-8 md:mb-10 bg-noir shadow-2xl">
                {/* Product Image */}
                <motion.img
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 1.5 }}
                  src={product.image}
                  className="w-full h-full object-cover brightness-95 group-hover:brightness-100 transition-all duration-1000"
                  alt={product.name}
                />

                {/* Top Label (e.g. Featured) */}
                {product.featured && (
                  <div className="absolute top-6 right-6">
                    <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[8px] uppercase tracking-widest font-black text-white">
                      Best Seller
                    </span>
                  </div>
                )}

                {/* Hover Interaction Overlay */}
                <div className="absolute inset-0 bg-noir/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-noir px-8 py-4 rounded-full flex items-center gap-4 text-[10px] uppercase tracking-widest font-black shadow-2xl translate-y-10 group-hover:translate-y-0 transition-transform duration-700"
                  >
                    <ShoppingBag size={16} />
                    Commander
                  </motion.button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-gold font-black italic mb-2">
                    {product.category}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-serif text-noir tracking-tight group-hover:text-gold transition-colors italic">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center justify-center gap-6 pt-2">
                  <div className="h-px w-8 bg-gold/20" />
                  <span className="text-xl font-serif text-noir italic">{product.price}</span>
                  <div className="h-px w-8 bg-gold/20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>



      </div>
    </section>
  );
}
