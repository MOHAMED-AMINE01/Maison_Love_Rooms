import React from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

export default function Legal() {
   const location = useLocation();
   const isPrivacy = location.pathname.includes('confidentialite');
   const isCookies = location.pathname.includes('cookies');

   let title = "Mentions Légales.";
   let subtitle = "Transparence";

   if (isPrivacy) {
      title = "Politique de Confidentialité.";
      subtitle = "Protection";
   } else if (isCookies) {
      title = "Politique Cookies.";
      subtitle = "Cookies";
   }

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="bg-[#0A0A0A] min-h-screen pt-48 pb-32 px-4 md:px-8 text-gold-light font-sans selection:bg-gold/30 relative overflow-hidden"
      >
         {/* Decorative Background Glow */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-gold/5 blur-[150px] rounded-full pointer-events-none z-0" />

         <div className="container-wide max-w-4xl mx-auto space-y-16 md:space-y-24 relative z-10">
            <div className="space-y-6 text-center">
               <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-bold">{subtitle}</span>
               <h1 className="text-4xl md:text-7xl font-serif text-gold-light">{title.split('.')[0]}<span className="italic font-light opacity-30">.</span></h1>
               <div className="w-px h-16 md:h-24 bg-gradient-to-b from-gold to-transparent mx-auto mt-8" />
            </div>

            <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 md:p-16 shadow-2xl">
               <div className="space-y-8 md:space-y-12 text-gold-light/70 font-light leading-relaxed text-sm md:text-base">
                  {isCookies ? (
                     <>
                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Utilisation des cookies</h2>
                           <p>Le site utilise des cookies pour :</p>
                           <ul className="list-disc list-inside space-y-2 ml-2">
                              <li>Mesurer l'audience</li>
                              <li>Améliorer l'expérience utilisateur</li>
                           </ul>
                        </section>

                        <section className="space-y-3">
                           <p>
                              Lors de votre première visite, un bandeau de gestion du consentement vous permet d'accepter ou de refuser tout ou partie des cookies. Vous pouvez également gérer les cookies via les paramètres de votre navigateur.
                           </p>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Sécurité</h2>
                           <p>
                              Maison Love Rooms met en œuvre toutes les mesures techniques et organisationnelles nécessaires pour garantir la sécurité et la confidentialité des données personnelles.
                           </p>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Durée de conservation</h2>
                           <p>
                              Les cookies sont conservés pour une durée maximale de 13 mois après leur dépôt.
                           </p>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Gestion du consentement</h2>
                           <p>
                              Lors de votre première visite, un bandeau de gestion du consentement vous permet d'accepter ou de refuser tout ou partie des cookies. Vous pouvez également gérer les cookies via les paramètres de votre navigateur.
                           </p>
                        </section>

                        <section className="space-y-3 pt-4 border-t border-white/10">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Contact</h2>
                           <p>
                              Pour toute question concernant notre politique de cookies, vous pouvez nous contacter à : <span className="text-gold"><a href="mailto:conciergerie@maisonloveroom.fr" className="text-gold hover:text-gold/80 underline">conciergerie@maisonloveroom.fr</a></span>
                           </p>
                        </section>
                     </>
                  ) : isPrivacy ? (
                     <>
                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Introduction</h2>
                           <p>
                              La présente politique de confidentialité a pour but d'informer les utilisateurs du site sur la manière dont sont collectées, utilisées et protégées leurs données personnelles.
                           </p>
                           <p>
                              Maison Love Rooms s'engage à ce que la collecte et le traitement de vos données soient conformes au Règlement Général sur la Protection des Données (RGPD) et à la législation française en vigueur.
                           </p>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Responsable du traitement</h2>
                           <p>
                              Le responsable du traitement des données est :
                           </p>
                           <p className="text-gold font-semibold">
                              Maison Love Rooms<br />
                              Email : <a href="mailto:conciergerie@maisonloveroom.fr" className="text-gold hover:text-gold/80 underline">conciergerie@maisonloveroom.fr</a>
                           </p>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Données collectées</h2>
                           <p>
                              Les données personnelles pouvant être collectées sur le site sont :
                           </p>
                           <ul className="list-disc list-inside space-y-2 ml-2">
                              <li>Nom</li>
                              <li>Adresse mail</li>
                              <li>Autres informations saisies dans le champ "message" du formulaire de contact</li>
                           </ul>
                           <p>
                              Ces données sont fournies volontairement par l'utilisateur lors de l'envoi d'un message via le formulaire de contact. Le site peut également collecter automatiquement des données de navigation (adresses IP, données de localisation, type de navigateur, etc.) par le biais de cookies, à des fins statistiques et d'amélioration de l'expérience utilisateur.
                           </p>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Finalités du traitement</h2>
                           <p>
                              Les données sont collectées pour les finalités suivantes :
                           </p>
                           <ul className="list-disc list-inside space-y-2 ml-2">
                              <li>Répondre aux demandes envoyées via le formulaire de contact</li>
                              <li>Assurer la gestion et le bon fonctionnement du site</li>
                              <li>Analyser l'audience du site et améliorer les services proposés</li>
                           </ul>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Destinataires des données</h2>
                           <p>
                              Les données collectées sont destinées uniquement à Maison Love Rooms et ne sont jamais cédées, louées ou vendues à des tiers.
                           </p>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Durée de conservation</h2>
                           <p>
                              Les données personnelles sont conservées :
                           </p>
                           <ul className="list-disc list-inside space-y-2 ml-2">
                              <li>Pour les demandes de contact : pendant 12 mois à compter du dernier échange</li>
                              <li>Pour les cookies : jusqu'à 13 mois maximum après dépôt</li>
                           </ul>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Droits des utilisateurs</h2>
                           <p>
                              Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
                           </p>
                           <ul className="list-disc list-inside space-y-2 ml-2">
                              <li>Droit d'accès</li>
                              <li>Droit de rectification</li>
                              <li>Droit à l'effacement</li>
                              <li>Droit à la limitation du traitement</li>
                              <li>Droit d'opposition</li>
                              <li>Droit à la portabilité des données</li>
                           </ul>
                           <p className="pt-3">
                              Vous pouvez exercer ces droits en envoyant un e-mail à : <span className="text-gold"><a href="mailto:conciergerie@maisonloveroom.fr" className="text-gold hover:text-gold/80 underline">conciergerie@maisonloveroom.fr</a></span>
                           </p>
                        </section>
                     </>
                  ) : (
                     <>
                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Éditeur du site</h2>
                           <p>
                              Le présent site est édité par :
                           </p>
                           <p className="text-gold font-semibold">
                              Maison Love Rooms<br />
                              Email : <a href="mailto:conciergerie@maisonloveroom.fr" className="text-gold hover:text-gold/80 underline">conciergerie@maisonloveroom.fr</a><br />
                              Le directeur de publication du site est Maison Love Room
                           </p>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Hébergement du site</h2>
                           <p>
                              Le site est hébergé par :
                           </p>
                           <p className="text-gold font-semibold">
                              IONOS SARL<br />
                              Adresse : 7 place de la Gare, 57200 Sarreguemines, France<br />
                              Site web : <a href="https://www.ionos.fr" className="hover:text-gold/80">https://www.ionos.fr</a>
                           </p>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Propriété intellectuelle</h2>
                           <p>
                              L'ensemble du contenu du site (textes, images, photos, vidéos, éléments graphiques, logos, structure générale…) est protégé par la législation en vigueur sur la propriété intellectuelle.
                           </p>
                           <p>
                              Toute reproduction, modification ou diffusion, totale ou partielle, sans accord préalable écrit de l'éditeur est interdite.
                           </p>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Données personnelles</h2>
                           <p>
                              Des données personnelles peuvent être collectées via le formulaire de contact et par l'utilisation de cookies.
                           </p>
                           <p>
                              Le responsable du traitement est :<br />
                              <span className="text-gold">Maison Love Rooms — <a href="mailto:conciergerie@maisonloveroom.fr" className="text-gold hover:text-gold/80 underline">conciergerie@maisonloveroom.fr</a></span>
                           </p>
                           <p>
                              Le traitement des données est conforme au RGPD et à la législation française. Pour plus de détails, consultez la <a href="/confidentialite" className="text-gold hover:text-gold/80">Politique de confidentialité</a> du site.
                           </p>
                           <p>
                              Les utilisateurs disposent des droits suivants : accès, rectification, suppression, opposition, portabilité, limitation du traitement.<br />
                              Pour exercer vos droits : <span className="text-gold"><a href="mailto:conciergerie@maisonloveroom.fr" className="text-gold hover:text-gold/80 underline">conciergerie@maisonloveroom.fr</a></span>
                           </p>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Cookies</h2>
                           <p>
                              Le site utilise des cookies pour mesurer l'audience et améliorer l'expérience utilisateur.
                           </p>
                           <p>
                              Un bandeau de consentement permet de gérer l'utilisation des cookies. Pour plus d'informations, consultez la <a href="/cookies" className="text-gold hover:text-gold/80">politique cookies</a>.
                           </p>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Responsabilité</h2>
                           <p>
                              L'éditeur ne saurait être tenu responsable :
                           </p>
                           <ul className="list-disc list-inside space-y-2 ml-2">
                              <li>d'interruptions temporaires du site,</li>
                              <li>de dysfonctionnements indépendants de sa volonté,</li>
                              <li>de tout dommage indirect lié à l'utilisation du site.</li>
                           </ul>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Liens externes</h2>
                           <p>
                              Le site peut contenir des liens vers des sites tiers.<br /> Maison Love Rooms décline toute responsabilité concernant leur contenu ou leur politique de confidentialité.
                           </p>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Modification des mentions légales</h2>
                           <p>
                              Les présentes mentions légales peuvent être modifiées à tout moment pour rester conformes à la réglementation.
                           </p>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Droit applicable</h2>
                           <p>
                              Les présentes mentions légales sont régies par le droit français.<br /> En cas de litige, les tribunaux français seront seuls compétents.
                           </p>
                        </section>

                        <section className="space-y-3">
                           <h2 className="text-lg md:text-2xl font-serif text-gold-light not-italic">Crédits</h2>
                           <p>
                              Site web conçu et développé par Fayçal Zighem – Freelance<br />
                              SIRET : 101 365 617 00014
                           </p>
                        </section>
                     </>
                  )}
               </div>
            </div>

            <div className="pt-8 md:pt-12 text-center">
               <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gold-light/20">Dernière mise à jour : Juin 2026</p>
            </div>
         </div>
      </motion.div>
   );
}
