import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Booking() {
  return (
    <section className="section-padding bg-noir text-white text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-gold blur-[150px] rounded-full" />
      </div>

      <div className="container-wide relative z-10 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="flex flex-col items-center gap-6">
            <span className="text-[10px] uppercase tracking-[0.6em] text-gold/60 font-bold">Prêt pour l'évasion ?</span>
            <div className="h-px w-24 bg-gold/20" />
          </div>

          <h2 className="text-6xl md:text-9xl font-serif leading-[0.9] tracking-tighter">
            Votre parenthèse <br />
            <span className="italic font-light text-white/20 block mt-4">commence ici.</span>
          </h2>

          <p className="max-w-xl mx-auto text-lg md:text-xl font-light italic text-white/30 leading-relaxed font-serif">
            Réservez en quelques clics et recevez vos codes d'accès en toute discrétion. L'excellence n'attend plus que vous.
          </p>

          <div className="pt-12">
            <Link
              to="/checkout"
              className="px-16 py-6 bg-gold text-white text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-white hover:text-noir transition-all duration-700 shadow-2xl shadow-gold/20 inline-block rounded-sm"
            >
              Réserver votre suite
            </Link>
          </div>

          <div className="pt-20 flex flex-col items-center gap-4 text-white/10 uppercase tracking-[0.8em] text-[8px] font-bold">
            <span>Maison Love Rooms</span>
            <div className="h-4 w-px bg-white/10" />
            <span>Tours, FR</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
