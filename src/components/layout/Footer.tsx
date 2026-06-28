import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Instagram, Crown, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-noir border-t border-white/5 py-40 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1800px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-40">
          <div className="lg:col-span-4">
            <Link to="/" className="flex flex-col items-start group mb-12">
               <span className="text-3xl font-display tracking-[0.3em] font-medium text-gold-light uppercase group-hover:text-gold transition-colors duration-700">Maison</span>
               <span className="text-[10px] font-sans tracking-[0.8em] text-gold uppercase mt-1 opacity-60">Love Room</span>
            </Link>
            <p className="max-w-xs text-sm font-light text-gold-light/40 leading-relaxed italic mb-10">
              L'excellence de l'intimité au cœur de la ville. Une escale sensorielle unique pensée pour l'éveil des sens.
            </p>
            <div className="flex gap-6">
              <a href="https://www.instagram.com/maisonloverooms/" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-500">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-10">Navigation</h4>
            <ul className="space-y-6">
              {["Suites", "L'Expérience", "Prestations", "FAQ", "Blog"].map(link => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase()}`} className="text-sm font-light text-gold-light/40 hover:text-gold-light transition-colors duration-300 italic">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-10">Légal</h4>
            <ul className="space-y-6">
              {["Mentions Légales", "CGU / CGV", "Confidentialité", "Cookies"].map(link => (
                <li key={link}>
                  <Link to="/legal" className="text-sm font-light text-gold-light/40 hover:text-gold-light transition-colors duration-300 italic">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="glass p-12 rounded-[2rem] relative overflow-hidden group/box">
               <div className="absolute top-0 right-0 p-6 opacity-20 group-hover/box:scale-110 transition-transform duration-700">
                 <Crown size={32} className="text-gold" />
               </div>
               <h4 className="text-2xl font-display italic mb-6">Inscrivez-vous à l'exceptionnel</h4>
               <p className="text-xs text-gold-light/40 mb-8 leading-relaxed">
                 Recevez en avant-première nos nouvelles suites et offres exclusives.
               </p>
               <div className="relative">
                 <input 
                   type="email" 
                   placeholder="Votre adresse email"
                   className="w-full bg-noir/50 border border-white/10 py-4 px-6 text-sm italic focus:outline-none focus:border-gold transition-all"
                 />
                 <button className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center bg-gold text-noir rounded-lg hover:scale-105 transition-all">
                   <ArrowUpRight size={18} />
                 </button>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
           <span className="text-[9px] uppercase tracking-[0.6em] text-gold-light/20">
             © {new Date().getFullYear()} Maison ML Limited • All Rights Reserved
           </span>
           <div className="flex items-center gap-12">
             <span className="text-[9px] uppercase tracking-[0.6em] text-gold-light/30 hidden md:block">Handcrafted by Excellence</span>
             <div className="flex gap-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3 w-auto opacity-20 grayscale" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-3 w-auto opacity-20 grayscale" alt="Mastercard" />
             </div>
           </div>
        </div>
      </div>
    </footer>
  );
}
