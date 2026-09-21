import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { SUITES } from '../constants';
import { API_URL } from '../constants';
import {
   ShieldCheck, Sparkles, Star
} from 'lucide-react';

export default function SuiteDetail() {
   const { id } = useParams();
   const navigate = useNavigate();

   const staticSuite = SUITES.find(s => s.id === id);
   const [suite, setSuite] = useState<any>(staticSuite);
   const [loading, setLoading] = useState(!staticSuite);
   const [formules, setFormules] = useState<any[]>([]);
   const nights = 1;
   const [formula, setFormula] = useState<string>('');

   useEffect(() => {
      if (id) {
         fetch(`${API_URL}/api/suites/${id}`)
            .then(res => res.json())
            .then(data => {
               if (data && data._id) {
                  setSuite({
                     id: id,
                     _id: data._id,
                     name: data.name,
                     tagline: data.tagline || staticSuite?.tagline || '',
                     description: data.description,
                     longDescription: data.longDescription || staticSuite?.longDescription || '',
                     presentationTitle: data.presentationTitle || staticSuite?.presentationTitle || '',
                     atouts: data.atouts || staticSuite?.atouts || '',
                     callToAction: data.callToAction || staticSuite?.callToAction || '',
                     price: data.pricePerNight,
                     image: data.imageUrl || staticSuite?.image || '/photos/love-story-1.jpeg',
                     images: data.images || staticSuite?.images || [],
                     features: data.features || staticSuite?.features || [],
                     status: data.status || 'disponible'
                  });
               }
            })
            .catch(err => console.log('Utilisation de la suite statique de secours'))
            .finally(() => setLoading(false));

         fetch(`${API_URL}/api/formules`)
            .then(res => res.json())
            .then(data => {
               if (Array.isArray(data)) {
                  setFormules(data);
               }
            })
            .catch(() => console.log('Formules non disponibles'));
      }
   }, [id]);

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
         </div>
      );
   }

   if (!suite) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="text-center">
               <h1 className="text-3xl font-serif mb-6 text-white">Suite introuvable</h1>
               <Link to="/" className="text-gold font-bold uppercase tracking-widest text-xs">Retour à l'accueil</Link>
            </div>
         </div>
      );
   }


   const gallery = [
      suite.image,
      ...(suite.images && suite.images.length > 0 ? suite.images : [
         "https://res.cloudinary.com/djks8n2nh/image/upload/v1785509986/suites/love-champagne.jpg",
         "https://res.cloudinary.com/djks8n2nh/image/upload/v1785510021/suites/love-embrace.jpg",
         "https://res.cloudinary.com/djks8n2nh/image/upload/v1785510002/suites/love-blindfold.jpg",
         "https://res.cloudinary.com/djks8n2nh/image/upload/v1785509995/suites/love-heels.jpg"
      ])
   ];

   const basePrice = Number(suite.price || 189);
   // Formules rattachées à CETTE suite (décision : formule liée à la suite)
   const suiteFormules = formules.filter((f: any) => f.suiteName === suite.name);
   const selectedFormule = suiteFormules.find((f: any) => f.name === formula)
      || suiteFormules.find((f: any) => f.isPopular)
      || suiteFormules[0];
   const currentPrice = selectedFormule ? Number(selectedFormule.price) : basePrice;

   return (
      <div className="bg-[#050505] min-h-screen selection:bg-amber-500/30 text-white overflow-x-hidden">

         <main>

            {/* Full-Height Hero Section */}
            <section className="relative h-[65vh] md:h-[85vh] overflow-hidden">
               <motion.img
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 2 }}
                  src={gallery[0]}
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
                  alt={suite.name}
               />
               <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]" />

               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-8">
                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5, duration: 1 }}
                     className="space-y-6 md:space-y-12 max-w-5xl"
                  >
                     <h1 translate="no" className="notranslate text-5xl md:text-[6vw] font-serif leading-[0.9] tracking-tighter italic">
                        {suite.name}
                     </h1>
                     <p className="text-lg md:text-2xl text-white/60 font-serif italic max-w-2xl mx-auto pt-4 md:pt-8">
                        "{suite.description}"
                     </p>
                  </motion.div>
               </div>

               {/* Scroll Indicator */}
               <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 md:gap-4 text-white/30">
                  <span className="text-[7px] md:text-[8px] uppercase tracking-[0.5em] font-black">Découvrir l'écrin</span>
                  <div className="w-px h-8 md:h-12 bg-gradient-to-b from-amber-500 to-transparent" />
               </div>
            </section>

            {/* Narrative Section */}
            <section className="py-12 md:py-20 bg-[#050505] border-b border-white/5">
               <div className="container-wide px-6">
                  {/* Magazine layout: images float right, text flows beside then full-width below */}
                  <div className="mb-10">
                     {/* Floating Gallery - right side on desktop */}
                     <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="lg:float-right lg:w-[58%] lg:ml-10 mb-6 lg:mb-4 grid grid-cols-2 gap-3 md:gap-4"
                     >
                        {/* Large image - spans 2 rows */}
                        <motion.div
                           className="relative group rounded-xl md:rounded-2xl overflow-hidden shadow-xl h-80 md:h-96 row-span-2"
                           whileHover={{ y: -4 }}
                        >
                           <img
                              src={gallery[1]}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.65]"
                              alt="Detail view"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        </motion.div>

                        {/* Right side: 2 images stacked */}
                        {gallery.slice(3, 5).map((img, idx) => (
                           <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="relative group rounded-lg md:rounded-xl overflow-hidden shadow-lg h-36 md:h-44 cursor-pointer"
                              whileHover={{ y: -2 }}
                           >
                              <img
                                 src={img}
                                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-[0.6] group-hover:brightness-75"
                                 alt={`Gallery ${idx + 1}`}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                           </motion.div>
                        ))}
                     </motion.div>

                     {/* Title + Description - flows beside images then full-width below */}
                     <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                     >
                        {suite.presentationTitle && (
                           <h2 className="text-3xl md:text-4xl font-serif leading-tight mb-5">
                              {suite.presentationTitle}
                           </h2>
                        )}
                        <div className="space-y-3 md:space-y-4 text-sm md:text-base text-white/60 font-serif leading-relaxed">
                           {suite.longDescription?.split('\n\n').map((paragraph: string, i: number) => (
                              <p key={i}>{paragraph}</p>
                           ))}
                        </div>
                     </motion.div>

                     <div className="clear-both" />
                  </div>

                  {/* Features + Atouts - Same Line */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                     {/* Features */}
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="space-y-5"
                     >
                        <h3 className="text-lg md:text-xl font-serif mb-4">
                           ✦ Les atouts de la <span translate="no" className="notranslate">{suite.name}</span>
                        </h3>

                        <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                           {suite.features?.map((feature: string, i: number) => (
                              <motion.div
                                 key={i}
                                 initial={{ opacity: 0, y: 10 }}
                                 whileInView={{ opacity: 1, y: 0 }}
                                 transition={{ delay: i * 0.05 }}
                                 className="flex items-center gap-2.5 p-2.5 md:p-3 rounded-lg border border-white/5 hover:border-gold/30 hover:bg-gold/5 transition-all duration-300 group backdrop-blur-sm"
                              >
                                 <span className="text-amber-500 text-sm md:text-base group-hover:scale-125 transition-transform flex-shrink-0">◆</span>
                                 <span className="text-white/70 font-serif text-xs md:text-sm leading-tight">{feature}</span>
                              </motion.div>
                           ))}
                        </div>
                     </motion.div>

                     {/* Atouts */}
                     {suite.atouts && (
                        <motion.div
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           className="space-y-5"
                        >
                           <h3 className="text-lg md:text-xl font-serif mb-4">
                              ✦ Ce qui rend cette suite spéciale
                           </h3>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3">
                              {suite.atouts.split('\n').map((atout: string, i: number) => (
                                 <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-2.5 p-2.5 md:p-3 rounded-lg border border-white/5 hover:border-gold/30 hover:bg-gold/5 transition-all duration-300 group backdrop-blur-sm"
                                 >
                                    <span className="text-amber-500 text-sm md:text-base group-hover:scale-125 transition-transform flex-shrink-0">✦</span>
                                    <span className="text-white/70 font-serif text-xs md:text-sm leading-tight group-hover:text-white/90 transition-colors">{atout}</span>
                                 </motion.div>
                              ))}
                           </div>
                        </motion.div>
                     )}
                  </div>
               </div>
            </section>

            {/* Booking Module */}
            <section className="py-12 md:py-20 bg-[#0A0A0A] border-y border-white/5" id="booking">
               <div className="container-wide px-6">
                  <div className="space-y-6 md:space-y-10">
                     {/* Header Section */}
                     <div className="space-y-3 md:space-y-4 text-center">
                        <span className="text-[7px] md:text-[8px] uppercase tracking-[0.5em] text-amber-500 font-black">Votre nuit à deux</span>
                        <h3 className="text-2xl md:text-5xl lg:text-6xl font-serif tracking-tighter italic">
                           Réservez <span translate="no" className="notranslate">{suite.name}</span>
                        </h3>

                        {/* Price & Availability */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10 pt-2 md:pt-4">
                           <div className="space-y-2">
                              <span className="text-[7px] md:text-[8px] uppercase text-white/30 tracking-widest font-black block">À partir de</span>
                              <p className="text-3xl md:text-4xl font-serif text-amber-500">{basePrice} €</p>
                           </div>
                           <div className="hidden sm:block w-px h-12 md:h-16 bg-white/10" />
                           <div className="space-y-2">
                              <span className="text-[7px] md:text-[8px] uppercase text-white/30 tracking-widest font-black block">Disponibilité</span>
                              <p className={`text-sm md:text-base font-black uppercase flex items-center justify-center gap-2 tracking-widest ${suite.status !== 'disponible' ? 'text-amber-500' : 'text-green-500'}`}>
                                 <span className={`w-2 h-2 rounded-full animate-pulse ${suite.status !== 'disponible' ? 'bg-amber-500' : 'bg-green-500'}`} />
                                 {suite.status !== 'disponible' ? 'En Maintenance' : 'Disponible'}
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* Formula Selection Grid */}
                     <div className="bg-[#050505] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10">
                        <div className="space-y-6">
                           <label className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] font-black text-white/30 text-center block w-full">Choisir votre expérience</label>

                           {/* Grille adaptée au nombre de formules (max 4 par ligne) */}
                           <div className={`grid gap-3 md:gap-4 ${
                              suiteFormules.length <= 1 ? 'grid-cols-1 max-w-sm mx-auto' :
                              suiteFormules.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
                              suiteFormules.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                           }`}>
                              {suiteFormules.length > 0 ? (
                                 suiteFormules.map((formule: any, idx: number) => {
                                    const isPopular = formule.isPopular;
                                    const price = `${formule.price} €`;
                                    const isSelected = formula === formule.name;

                                    return (
                                       <motion.button
                                          key={formule._id}
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={() => setFormula(formule.name)}
                                          className={`relative group p-4 md:p-5 rounded-lg md:rounded-xl border transition-all duration-400 text-center space-y-2.5 flex flex-col ${isSelected ? 'border-gold/50 bg-gold/8 shadow-lg' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}
                                       >
                                          {isPopular && (
                                             <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                                                <span className="bg-gold/20 text-gold text-[5px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-gold/30 flex items-center gap-0.5">
                                                   <Star size={8} fill="currentColor" /> Recommandé
                                                </span>
                                             </div>
                                          )}

                                          <div className={`space-y-1 ${isPopular ? 'pt-3' : ''}`}>
                                             <p className={`text-sm md:text-base font-serif transition-colors ${isSelected ? 'text-gold' : 'text-white/80'}`}>
                                                {formule.name}
                                             </p>
                                             <p className={`text-2xl md:text-3xl font-serif ${isSelected ? 'text-gold' : 'text-white'}`}>
                                                {price}
                                             </p>
                                          </div>
                                          <p className="text-[10px] text-white/40 font-light leading-snug h-6 overflow-hidden">
                                             {formule.description}
                                          </p>
                                       </motion.button>
                                    );
                                 })
                              ) : (
                                 <div className="col-span-full text-center py-8 text-white/40 italic text-sm">
                                    {suite.status !== 'disponible'
                                       ? 'Cette chambre est actuellement en maintenance.'
                                       : 'Aucune formule disponible pour cette chambre pour le moment.'}
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>

                     {/* CTA Button & Security */}
                     <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
                        {suiteFormules.length > 0 ? (
                           <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => navigate('/checkout', {
                                 state: {
                                    suiteId: suite._id || suite.id,
                                    suiteName: suite.name,
                                    suiteImage: suite.image,
                                    nights: nights,
                                    formuleId: selectedFormule?._id,
                                    formuleName: selectedFormule?.name,
                                    formula: selectedFormule?.name,
                                    price: currentPrice
                                 }
                              })}
                              className="relative w-full bg-gold text-[#0A0A0A] py-4 md:py-6 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-black hover:bg-white transition-all duration-500 shadow-lg overflow-hidden group"
                           >
                              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                              <span className="relative z-10 block">Confirmer ({currentPrice * nights} €)</span>
                           </motion.button>
                        ) : (
                           <button disabled className="w-full bg-white/5 text-white/30 py-4 md:py-6 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-black cursor-not-allowed border border-white/10">
                              {suite.status !== 'disponible' ? 'Chambre en maintenance' : 'Aucune formule disponible'}
                           </button>
                        )}

                        <div className="flex items-center justify-center gap-2 text-white/30">
                           <ShieldCheck size={14} />
                           <p className="text-[7px] md:text-[8px] uppercase tracking-widest font-bold italic">Confidentialité garantie</p>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Gallery Section */}
            <section className="py-16 md:py-24 bg-[#050505] border-t border-white/5">
               <div className="container-wide px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                     <div className="space-y-5 md:space-y-6">
                        {gallery[2] && (
                           <img src={gallery[2]} className="w-full aspect-square object-cover rounded-xl md:rounded-2xl grayscale hover:grayscale-0 transition-all duration-700" alt="Gallery 2" />
                        )}
                        {gallery[3] && (
                           <img src={gallery[3]} className="w-full aspect-[4/3] object-cover rounded-xl md:rounded-2xl" alt="Gallery 3" />
                        )}
                     </div>
                     <div className="space-y-5 md:space-y-6 pt-0 md:pt-8">
                        {gallery[4] && (
                           <img src={gallery[4]} className="w-full aspect-[4/5] object-cover rounded-xl md:rounded-2xl" alt="Gallery 4" />
                        )}
                        {suite.callToAction && (
                           <div className="bg-white/5 p-8 md:p-10 rounded-xl md:rounded-2xl border border-white/10 flex flex-col justify-center items-center text-center gap-4 md:gap-6 min-h-[280px] md:min-h-[350px]">
                              <Sparkles className="text-amber-500" size={28} strokeWidth={1} />

                              <h3 className="text-center text-sm md:text-base text-white/60 font-serif italic">
                                 {suite.callToAction}
                              </h3>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </section>

         </main>

      </div>
   );
}
