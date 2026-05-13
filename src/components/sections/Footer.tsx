import React from 'react';
import { Instagram, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#0A0A0A] py-20 md:py-20 relative overflow-hidden border-t border-white/5 selection:bg-gold/30">
      {/* Decorative Branding Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-gold/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-serif italic text-white/[0.02] pointer-events-none select-none z-0">
        ML
      </div>

      <div className="container-wide relative z-10 px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 mb-20 md:mb-10">

          <div className="md:col-span-5 space-y-10 text-center md:text-left flex flex-col items-center md:items-start">
            <Link to="/" className="inline-block group">
              <img
                src="/logo.png"
                alt="Maison Love Rooms"
                className="h-20 scale-150 md:h-24 brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              />
            </Link>
            <p className="text-white/40 font-serif italic text-lg md:text-xl max-w-md leading-relaxed">
              Une adresse confidentielle, un service d'excellence hôtelière et une discrétion absolue pour sublimer vos moments les plus précieux au cœur de Paris.
            </p>
          </div>

          <div className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-[10px] uppercase tracking-[0.6em] text-gold mb-8 font-bold">L'Expérience</h4>
            <ul className="space-y-4">
              {[
                { label: "Accueil", to: "/" },
                { label: "Nos Suites", to: "/#suites" },
                { label: "L'Expérience", to: "/experience" },
                { label: "Foire Aux Questions", to: "/#faq" }
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm font-light text-white/60 hover:text-white transition-all duration-500 flex items-center gap-4 group justify-center md:justify-start">
                    <span className="w-0 h-[1px] bg-gold group-hover:w-4 transition-all duration-500 hidden md:block" />
                    <span className="italic font-serif">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-[10px] uppercase tracking-[0.6em] text-gold mb-8 font-bold">Contact & Accès</h4>
            <ul className="space-y-8">
              <li className="space-y-3 flex flex-col items-center md:items-start">
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold flex items-center gap-2"><Phone size={12} /> Réservations</span>
                <p className="text-white/80 font-serif italic text-lg hover:text-white transition-colors cursor-pointer">06 27 09 47 17</p>
              </li>
              <li className="space-y-3 flex flex-col items-center md:items-start">
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold flex items-center gap-2"><Mail size={12} /> Conciergerie</span>
                <p className="text-white/80 font-serif italic text-lg hover:text-white transition-colors cursor-pointer">privilege@maisonloveroom.fr</p>
              </li>
              <li className="space-y-3 flex flex-col items-center md:items-start">
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold flex items-center gap-2"><MapPin size={12} /> Adresse Secrète</span>
                <p className="text-white/60 font-sans font-light text-sm">Paris, France (Révélée après réservation)</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em] font-bold text-white/40 text-center lg:text-left">
          <p>© {new Date().getFullYear()} MAISON LOVE ROOMs PARIS • ALL RIGHTS RESERVED</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 items-center">
            <Link to="/cgv" className="hover:text-gold transition-colors">CGV</Link>
            <div className="w-1 h-1 rounded-full bg-white/10 hidden sm:block" />
            <Link to="/confidentialite" className="hover:text-gold transition-colors">Confidentialité</Link>
            <div className="w-1 h-1 rounded-full bg-white/10 hidden sm:block" />
            <Link to="/mentions-legales" className="hover:text-gold transition-colors">Mentions Légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
