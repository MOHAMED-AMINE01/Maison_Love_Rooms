import React from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

export default function Legal() {
   const location = useLocation();
   const isCGV = location.pathname.includes('cgv');
   const isPrivacy = location.pathname.includes('confidentialite');
   
   let title = "Mentions Légales.";
   let subtitle = "Transparence";
   
   if (isCGV) {
      title = "Conditions Générales.";
      subtitle = "Engagements";
   } else if (isPrivacy) {
      title = "Confidentialité.";
      subtitle = "Protection";
   }

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="bg-[#0A0A0A] min-h-screen pt-48 pb-32 px-4 md:px-8 text-white font-sans selection:bg-gold/30 relative overflow-hidden"
      >
         {/* Decorative Background Glow */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-gold/5 blur-[150px] rounded-full pointer-events-none z-0" />

         <div className="container-wide max-w-4xl mx-auto space-y-16 md:space-y-24 relative z-10">
            <div className="space-y-6 text-center">
               <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-bold">{subtitle}</span>
               <h1 className="text-4xl md:text-7xl font-serif text-white">{title.split('.')[0]}<span className="italic font-light opacity-30">.</span></h1>
               <div className="w-px h-16 md:h-24 bg-gradient-to-b from-gold to-transparent mx-auto mt-8" />
            </div>

            <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 md:p-16 shadow-2xl">
               <div className="space-y-12 md:space-y-16 text-white/60 font-light italic leading-relaxed text-sm md:text-lg">
                  {isPrivacy ? (
                     <>
                        <section className="space-y-4 md:space-y-6">
                           <h2 className="text-lg md:text-2xl font-serif text-white not-italic">1. Collecte des données</h2>
                           <p>
                              Maison Love Rooms limite la collecte de données au strict nécessaire pour garantir votre réservation. Votre anonymat est notre priorité.
                           </p>
                        </section>
                        <section className="space-y-4 md:space-y-6">
                           <h2 className="text-lg md:text-2xl font-serif text-white not-italic">2. Discrétion Bancaire</h2>
                           <p>
                              Toutes les transactions apparaîtront sous l'intitulé neutre "ML Services". Aucune mention de nos suites n'est conservée sur vos relevés bancaires.
                           </p>
                        </section>
                        <section className="space-y-4 md:space-y-6">
                           <h2 className="text-lg md:text-2xl font-serif text-white not-italic">3. Utilisation des données</h2>
                           <p>
                              Vos informations (email, téléphone) ne servent qu'à vous transmettre les codes d'accès sécurisés de votre suite. Elles sont automatiquement chiffrées et purgées de nos serveurs 48h après votre départ.
                           </p>
                        </section>
                     </>
                  ) : isCGV ? (
                     <>
                        <section className="space-y-4 md:space-y-6">
                           <h2 className="text-lg md:text-2xl font-serif text-white not-italic">1. Réservation et Paiement</h2>
                           <p>
                              Toute réservation est définitive après encaissement. Une caution sous forme d'empreinte bancaire (non débitée) est exigée avant l'accès à la suite pour couvrir les éventuels dommages.
                           </p>
                        </section>
                        <section className="space-y-4 md:space-y-6">
                           <h2 className="text-lg md:text-2xl font-serif text-white not-italic">2. Conditions d'Annulation</h2>
                           <p>
                              L'annulation est gratuite jusqu'à 7 jours avant le début du séjour. En deçà, l'intégralité du montant de la nuitée sera retenue à titre de dédommagement.
                           </p>
                        </section>
                        <section className="space-y-4 md:space-y-6">
                           <h2 className="text-lg md:text-2xl font-serif text-white not-italic">3. Règlement Intérieur</h2>
                           <p>
                              Nos suites sont strictement non-fumeurs. Les animaux de compagnie ne sont pas admis. Tout manquement ou dégât matériel constaté entraînera des frais de remise en état prélevés sur l'empreinte bancaire.
                           </p>
                        </section>
                     </>
                  ) : (
                     <>
                        <section className="space-y-4 md:space-y-6">
                           <h2 className="text-lg md:text-2xl font-serif text-white not-italic">1. Édition du site</h2>
                           <p>
                              Le présent site est édité par la société ML Services, Société par Actions Simplifiée au capital de 10 000 €, dont le siège social est situé à Paris, France.
                           </p>
                        </section>
                        <section className="space-y-4 md:space-y-6">
                           <h2 className="text-lg md:text-2xl font-serif text-white not-italic">2. Hébergement</h2>
                           <p>
                              Ce site est hébergé par une infrastructure sécurisée garantissant le cryptage complet et la confidentialité de vos données de navigation.
                           </p>
                        </section>
                        <section className="space-y-4 md:space-y-6">
                           <h2 className="text-lg md:text-2xl font-serif text-white not-italic">3. Propriété Intellectuelle</h2>
                           <p>
                              L'ensemble des éléments constituant ce site (textes, photographies, vidéos, logos, charte graphique) sont la propriété exclusive de ML Services. Toute reproduction est formellement interdite sans accord écrit.
                           </p>
                        </section>
                     </>
                  )}
               </div>
            </div>

            <div className="pt-8 md:pt-12 text-center">
               <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/20">Dernière mise à jour : Mai 2026</p>
            </div>
         </div>
      </motion.div>
   );
}
