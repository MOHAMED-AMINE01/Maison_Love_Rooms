import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, User, MessageSquare, Sparkles, Phone } from 'lucide-react';
import { API_URL } from '../../constants';

export default function Contact() {
  const [focused, setFocused] = useState<string | null>(null);
  const [email, setEmail] = useState("privilege@maisonloveroom.fr");

  useEffect(() => {
    const getSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.email) {
            setEmail(data.email);
          }
        }
      } catch (err) {
        console.error("Failed to load settings in Contact", err);
      }
    };
    getSettings();
  }, []);

  return (
    <section id="contact" className="pt-12 md:pt-20 pb-24 md:pb-40 bg-[#FAF9F6] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="container-wide px-6 md:px-12 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left Side: Content */}
          <div className="space-y-10">
            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-[10px] uppercase tracking-[0.6em] text-gold font-black block"
              >
                Conciergerie privée
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-serif text-noir leading-tight"
              >
                Un souhait <br />
                <span className="italic text-gold">particulier ?</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-noir/40 font-serif italic text-lg md:text-xl max-w-md leading-relaxed"
            >
              Vous avez des questions ? Besoin d'informations ? Vous souhaitez obtenir des renseignements concernant votre réservation ? Contactez-nous, c'est avec plaisir que nous vous répondrons.
            </motion.p>

            <div className="space-y-6 pt-4">
              {[
                { icon: Phone, label: "Téléphone", value: "06.27.09.47.17" },
                { icon: Mail, label: "Email", value: email },
                { icon: Sparkles, label: "Ou bien", value: "Remplissez notre formulaire ci-dessous" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-6 group cursor-default"
                >
                  <div className="w-12 h-12 rounded-full border border-noir/5 flex items-center justify-center text-gold/60 group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-sm">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-noir/20 font-black mb-1">{item.label}</p>
                    <p className="text-noir/60 font-sans font-light">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side: Stylish Form (Light Mode) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-white border border-noir/[0.03] p-10 md:p-14 rounded-[3rem] shadow-xl relative"
          >
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name Input */}
                <div className="relative group">
                  <label className={`absolute left-0 transition-all duration-500 pointer-events-none text-[10px] uppercase tracking-widest font-black ${focused === 'name' ? '-top-6 text-gold opacity-100' : 'top-1 text-noir/20 opacity-60'}`}>
                    Votre Nom <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    onFocus={() => setFocused('name')}
                    onBlur={(e) => setFocused(e.target.value ? 'name' : null)}
                    className="w-full bg-transparent border-b border-noir/10 py-2 text-noir font-light focus:outline-none focus:border-gold transition-colors duration-500"
                  />
                  <div className={`absolute bottom-0 left-0 h-[1px] bg-gold transition-all duration-700 ${focused === 'name' ? 'w-full' : 'w-0'}`} />
                </div>

                {/* Email Input */}
                <div className="relative group">
                  <label className={`absolute left-0 transition-all duration-500 pointer-events-none text-[10px] uppercase tracking-widest font-black ${focused === 'email' ? '-top-6 text-gold opacity-100' : 'top-1 text-noir/20 opacity-60'}`}>
                    Votre Email <span className="text-gold">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    onFocus={() => setFocused('email')}
                    onBlur={(e) => setFocused(e.target.value ? 'email' : null)}
                    className="w-full bg-transparent border-b border-noir/10 py-2 text-noir font-light focus:outline-none focus:border-gold transition-colors duration-500"
                  />
                  <div className={`absolute bottom-0 left-0 h-[1px] bg-gold transition-all duration-700 ${focused === 'email' ? 'w-full' : 'w-0'}`} />
                </div>
              </div>

              {/* Subject Input */}
              <div className="relative group">
                <label className={`absolute left-0 transition-all duration-500 pointer-events-none text-[10px] uppercase tracking-widest font-black ${focused === 'subject' ? '-top-6 text-gold opacity-100' : 'top-1 text-noir/20 opacity-60'}`}>
                  Objet de votre demande
                </label>
                <input
                  type="text"
                  onFocus={() => setFocused('subject')}
                  onBlur={(e) => setFocused(e.target.value ? 'subject' : null)}
                  className="w-full bg-transparent border-b border-noir/10 py-2 text-noir font-light focus:outline-none focus:border-gold transition-colors duration-500"
                />
                <div className={`absolute bottom-0 left-0 h-[1px] bg-gold transition-all duration-700 ${focused === 'subject' ? 'w-full' : 'w-0'}`} />
              </div>

              {/* Message Input */}
              <div className="relative group">
                <label className={`absolute left-0 transition-all duration-500 pointer-events-none text-[10px] uppercase tracking-widest font-black ${focused === 'message' ? '-top-6 text-gold opacity-100' : 'top-1 text-noir/20 opacity-60'}`}>
                  Votre Message <span className="text-gold">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  onFocus={() => setFocused('message')}
                  onBlur={(e) => setFocused(e.target.value ? 'message' : null)}
                  className="w-full bg-transparent border-b border-noir/10 py-2 text-noir font-light focus:outline-none focus:border-gold transition-colors duration-500 resize-none"
                />
                <div className={`absolute bottom-0 left-0 h-[1px] bg-gold transition-all duration-700 ${focused === 'message' ? 'w-full' : 'w-0'}`} />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="group w-full relative py-6 bg-gold text-white text-[11px] font-bold uppercase tracking-[0.4em] rounded-full overflow-hidden transition-all duration-500 shadow-2xl hover:shadow-gold/20 flex items-center justify-center gap-4"
              >
                <div className="absolute inset-0 bg-noir translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10">Envoyer</span>
                <Send size={14} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
