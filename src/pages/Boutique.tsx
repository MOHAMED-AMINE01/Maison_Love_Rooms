import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, Heart, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PRODUCTS = [
  {
    id: 1,
    name: "Bougie Signature",
    category: "Ambiance",
    price: 45,
    description: "Le parfum emblématique de nos suites (Néroli & Ambre) à emporter chez vous.",
    image: "https://images.unsplash.com/photo-1596433809252-260c2745dfdd?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Huile de Massage",
    category: "Bien-être",
    price: 35,
    description: "Un élixir soyeux aux huiles précieuses pour prolonger le rituel Maison Love Rooms.",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Peignoir Prestige",
    category: "Confort",
    price: 120,
    description: "La caresse de la soie et le confort d'un Palace, disponible en édition limitée.",
    image: "https://images.unsplash.com/photo-1621335829175-95f437384d7c?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Coffret Rituel Duo",
    category: "Édition Limitée",
    price: 185,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop"
  }
];

export default function Boutique() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#0A0A0A] min-h-screen overflow-x-hidden selection:bg-gold/30"
    >
      {/* Cinematic Full-Width Hero */}
      <section className="relative min-h-[90vh] flex items-center pt-32 px-4 md:px-10 bg-noir overflow-hidden">
        {/* Background Image with Deep Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
              className="w-full h-full object-cover grayscale brightness-50"
              alt="Boutique Atmosphere"
            />
            {/* Multi-layered Gradients */}
            <div className="absolute inset-0 bg-gradient-xto-r from-noir via-noir/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-b from-noir/40 via-transparent to-transparent" />
          </motion.div>
        </div>

        <div className="container-wide relative z-10 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">

            {/* Left Column: Hero Title */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl"
            >
              <h1 className="text-7xl text-center md:text-left md:text-[10vw] font-serif leading-[0.8] tracking-tighter text-white">
                L'Héritage à <br />
                <span className="italic text-gold opacity-90">Emporter.</span>
              </h1>
            </motion.div>

            {/* Right Column: Quote */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="lg:max-w-md text-center md:text-right lg:mt-48"
            >
              <p className="text-2xl md:text-3xl italic font-light leading-relaxed text-white/40 font-serif md:border-r border-gold/20 pr-8 md:pr-12">
                "L'excellence n'est pas un acte, <br className="hidden md:block" />
                c'est une <span className="text-white">habitude</span>."
              </p>

            </motion.div>
          </div>
        </div>

        {/* Bottom Cinematic Fade */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
      </section>

      {/* Product Catalog */}
      <div className="container-wide px-4 md:px-10 pb-48">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32">
          {PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden relative rounded-[2rem] bg-noir shadow-2xl relative isolate group">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 2 }}
                  src={product.image}
                  className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-1000"
                  alt={product.name}
                />

                {/* Hover Overlay */}
                {/*  <div className="absolute inset-0 bg-noir/40 opacity-0 group-hover:opacity-100 transition-all duration-700 backdrop-blur-[2px] flex items-center justify-center">
                  <Link to="/checkout" className="bg-white text-noir px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.4em] font-black flex items-center gap-4 hover:bg-gold hover:text-white transition-all transform scale-90 group-hover:scale-100">
                    Acquérir
                    <ShoppingBag size={14} />
                  </Link>
                </div> */}

                {/* Floating Metadata */}
                <div className="absolute top-8 left-8">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-white/60 font-black px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10">
                    {product.category}
                  </span>
                </div>

                <button className="absolute top-8 right-8 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-noir transition-all duration-500">
                  <Heart size={18} />
                </button>
              </div>

              <div className="mt-12 flex justify-between items-start border-t border-white/5 pt-8">
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-4xl font-serif text-white group-hover:text-gold transition-colors duration-500">{product.name}</h3>
                  <p className="text-lg md:text-xl font-serif italic text-white/40 max-w-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-serif text-gold block">{product.price}€</span>
                  <div className="mt-2 h-1 w-full bg-gold/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gold/40"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </motion.div>
  );
}
