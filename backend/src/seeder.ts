import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin';
import Suite from './models/Suite';
import Reservation from './models/Reservation';
import Service from './models/Service';
import Formule from './models/Formule';
import Settings from './models/Settings';
import Product from './models/Product';
import Faq from './models/Faq';

export const seedDatabase = async () => {
  try {
    console.log('Vérification et synchronisation des données statiques dans MongoDB...');

    // 1. Vérification et création de l'Admin par défaut
    const existingOldAdmin = await Admin.findOne({ email: 'admin@maisonloveroom.com' });
    if (existingOldAdmin) {
      console.log('Mise à jour de l\'ancien email admin vers admin@maisonloverooms.com...');
      existingOldAdmin.email = 'admin@maisonloverooms.com';
      await existingOldAdmin.save();
      console.log('Email admin mis à jour avec succès dans MongoDB !');
    }

    const adminCount = await Admin.countDocuments({ email: 'admin@maisonloverooms.com' });
    if (adminCount === 0) {
      console.log('Création du Super Admin par défaut...');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin123', salt);
      await Admin.create({
        email: 'admin@maisonloverooms.com',
        passwordHash,
        name: 'Super Admin',
        role: 'admin',
      });
      console.log('Super Admin créé avec succès (admin@maisonloverooms.com / admin123)');
    }

    // 2. Vérification et insertion des 2 Suites officielles du site (Love Story & Baguerra) si la base est vide
    console.log('Vérification des Suites dans MongoDB...');
    const suiteCount = await Suite.countDocuments();
    if (suiteCount === 0) {
      console.log('Aucune suite trouvée, insertion des 2 suites officielles...');
      const suitesData = [
        {
          name: "Love Story",
          description: "Une parenthèse enchantée dans un univers inspiré des années folles. Élégance, raffinement et luxe discret définissent cet écrin pensé pour les amoureux en quête d'exception.",
          presentationTitle: "Love Story – Luxe, Glamour & Séduction",
          longDescription: "Bienvenue dans la Love Story, un écrin de raffinement inspiré de l'élégance des Années Folles. Pensée pour les couples en quête d'une expérience unique, cette suite vous plonge dans une atmosphère feutrée où le glamour, le romantisme et la sensualité se rencontrent.\n\nDès votre arrivée, vous serez séduits par les lumières tamisées, les voilages délicats, les touches de noir et de rouge profond ainsi que les détails élégants qui rappellent l'univers prestigieux du célèbre Gatsby. Chaque élément a été imaginé pour créer une ambiance intime, mystérieuse et envoûtante.\n\nProfitez d'un moment de détente absolue dans une baignéo privative avant de vous installer dans le salon cosy, conçu pour favoriser les échanges, la complicité et les instants de partage. Les jeux de lumière, les bougies et le mobilier soigneusement sélectionné offrent un cadre chaleureux propice à l'évasion.\n\nPour enrichir votre expérience, la Love Story dispose également d'équipements dédiés aux amoureux, tels qu'un fauteuil tantra, une balançoire spécialement pensé pour explorer votre complicité dans un environnement élégant, discret et raffiné.\n\nQue vous souhaitiez célébrer un anniversaire, une occasion spéciale, surprendre votre partenaire ou simplement vous offrir une parenthèse à deux, cette suite vous promet une expérience inoubliable où chaque détail invite au lâcher-prise et à la connexion.",
          atouts: "Balnéo privative\nAmbiance inspirée des Années Folles\nÉclairage tamisé et atmosphère romantique\nSalon cosy et intimiste\nFauteuil tantra\nDécoration glamour et élégante\nCadre idéal pour les couples et les occasions spéciales",
          callToAction: "Laissez-vous transporter dans un univers où le luxe, la passion et l'élégance se mêlent pour créer des souvenirs inoubliables.",
          pricePerNight: 189,
          features: ["Balnéo Privative", "Douche en duo", "Décoration Chic", "Kitchenette", "Champagne Inclus"],
          status: "disponible",
          imageUrl: "/photos/love-story-1.jpeg",
          images: [
            "/photos/love-story-6.jpeg",
            "/photos/love-story-2.jpeg",
            "/photos/love-story-3.jpeg",
            "/photos/love-story-5.jpeg",
            "/photos/love-story-4.jpeg"
          ]
        },
        {
          name: "Baguerra",
          description: "Laissez-vous transporter par l'exotisme de la suite Baguerra. Une immersion totale dans un décor végétal luxuriant pour une évasion sauvage et sensuelle au cœur de la ville.",
          presentationTitle: "Baguerra – Exotisme, Luxe & Sérénité",
          longDescription: "Bienvenue à Baguerra, où l'exotisme rencontre l'élégance. Cette suite est une véritable jungle urbaine, conçue pour les couples en quête d'aventure et de sensualité dans un cadre luxe. Dès votre arrivée, vous serez plongés dans une atmosphère sauvage et envoûtante, loin des contraintes du quotidien.\n\nLa décoration luxuriante de Baguerra crée une immersion totale dans un univers végétal sophistiqué. Des plantes généreuses, des teintes de vert profond et des éléments naturels combinés à des touches minimalistes modernes créent une harmonie parfaite entre nature brute et confort premium.\n\nVous disposerez d'un spa privatif pour vous détendre en toute intimité, d'une cuisine indépendante équipée pour préparer vos repas, et d'une ambiance immersive qui enveloppe chaque instant. Les jeux de lumière tamisée et la musique ambiante renforcent cette sensation d'évasion et de connexion.\n\nChaque détail a été pensé pour créer une expérience sensorielle unique, où le luxe discret règne en maître. Les finitions haut de gamme, les matières nobles et les équipements premium transforment votre séjour en une aventure inoubliable.\n\nQue ce soit pour célébrer un moment spécial, fuir le stress quotidien ou redécouvrir votre partenaire dans un cadre enchanteur, Baguerra vous promet une parenthèse magique où la nature, le luxe et la sensualité se conjuguent harmonieusement.",
          atouts: "Spa privatif\nDécoration jungle luxuriante\nCuisine indépendante équipée\nAmbiance immersive et musicale\nLumières tamisées sophistiquées\nMatières nobles et finitions haut de gamme\nÉquipements premium pour couples en quête d'aventure",
          callToAction: "Laissez-vous transporter dans une jungle d'élégance où chaque moment invite à la détente, la complicité et la redécouverte.",
          pricePerNight: 189,
          features: ["Spa Privatif", "Décoration Jungle", "Cuisine Indépendante", "Ambiance Immersive", "Champagne Inclus"],
          status: "disponible",
          imageUrl: "/photos/baguerra-1.jpeg",
          images: [
            "/photos/baguerra-3.jpeg",
            "/photos/baguerra-2.jpeg",
            "/photos/baguerra-4.jpeg",
            "/photos/maison-3.jpeg"
          ]
        }
      ];

      await Suite.insertMany(suitesData);
      console.log('Les 2 Suites officielles (Love Story & Baguerra) ont été enregistrées avec succès.');
    } else {
      console.log(`${suiteCount} suite(s) déjà existante(s) dans MongoDB. Conservation des données.`);
    }

    // 3. Vérification et réinitialisation des Réservations si la base est vide
    console.log('Vérification des Réservations dans MongoDB...');
    const reservationCount = await Reservation.countDocuments();
    if (reservationCount === 0) {
      console.log('Aucune réservation trouvée, insertion des réservations de démo...');
      const reservationsData = [
        {
          clientName: "Marc Morel",
          clientEmail: "marc.morel@example.com",
          clientPhone: "06 12 34 56 78",
          suiteName: "Love Story",
          checkIn: new Date("2026-05-15T14:00:00Z"),
          checkOut: new Date("2026-05-17T11:00:00Z"),
          numberOfPersons: 2,
          services: ["Champagne Inclus", "Décoration romantique"],
          specialRequest: "Arrivée vers 18h si possible, merci.",
          internalNote: "Client VIP, habitué.",
          totalPrice: 378,
          status: "confirmee"
        },
        {
          clientName: "Sophie Laurent",
          clientEmail: "sophie.laurent@example.com",
          clientPhone: "06 98 76 54 32",
          suiteName: "Baguerra",
          checkIn: new Date("2026-05-12T14:00:00Z"),
          checkOut: new Date("2026-05-13T11:00:00Z"),
          numberOfPersons: 2,
          services: ["Pack Anniversaire"],
          specialRequest: "C'est pour l'anniversaire de mon mari.",
          internalNote: "Préparer le mot d'anniversaire.",
          totalPrice: 189,
          status: "en_attente"
        },
        {
          clientName: "Jean Valjean",
          clientEmail: "jean.valjean@example.com",
          clientPhone: "07 45 67 89 01",
          suiteName: "Love Story",
          checkIn: new Date("2026-05-10T14:00:00Z"),
          checkOut: new Date("2026-05-12T11:00:00Z"),
          numberOfPersons: 2,
          services: [],
          specialRequest: "",
          internalNote: "",
          totalPrice: 378,
          status: "confirmee"
        },
        {
          clientName: "Emma Bovary",
          clientEmail: "emma.bovary@example.com",
          clientPhone: "06 54 32 10 98",
          suiteName: "Baguerra",
          checkIn: new Date("2026-05-08T14:00:00Z"),
          checkOut: new Date("2026-05-09T11:00:00Z"),
          numberOfPersons: 2,
          services: ["Pétales de rose"],
          specialRequest: "",
          internalNote: "Annulation suite à un empêchement médical.",
          totalPrice: 189,
          status: "annulee"
        },
        {
          clientName: "Antoine de Saint-Exupéry",
          clientEmail: "antoine@example.com",
          clientPhone: "06 11 22 33 44",
          suiteName: "Love Story",
          checkIn: new Date("2026-05-20T14:00:00Z"),
          checkOut: new Date("2026-05-22T11:00:00Z"),
          numberOfPersons: 2,
          services: ["Option départ tardif"],
          specialRequest: "Départ à 13h demandé.",
          internalNote: "Accordé sans supplément.",
          totalPrice: 378,
          status: "confirmee"
        }
      ];

      await Reservation.insertMany(reservationsData);
      console.log('Les 5 Réservations de démo ont été insérées dans MongoDB.');
    } else {
      console.log(`${reservationCount} réservation(s) déjà existante(s). Conservation des données.`);
    }

    // 4. Prestations (options ajoutables du tunnel). Le modèle "Service" = Prestation.
    // On nettoie les anciennes "formules-services" (Essentielle / Complète), désormais
    // gérées par le modèle Formule, puis on seed des prestations d'exemple UNIQUEMENT si
    // aucune prestation n'existe (pour ne pas écraser celles créées en back-office).
    console.log('Nettoyage des anciennes formules-services et vérification des Prestations...');
    await Service.deleteMany({ name: { $in: ['Formule Essentielle', 'Formule Complète'] } });
    const prestationCount = await Service.countDocuments();
    if (prestationCount === 0) {
      const prestationsData = [
        {
          name: "Massage bien-être",
          description: "Un massage relaxant dispensé dans l'intimité de votre suite. Choisissez la formule solo ou duo.",
          price: 60,
          imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1200&auto=format&fit=crop",
          status: "actif",
          category: "Massage & Bien-être",
          pricingUnit: "forfait",
          allowQuantity: false,
          maxQuantity: 1,
          variants: [
            { label: "Solo (1 personne)", price: 60 },
            { label: "Duo (2 personnes)", price: 110 },
          ],
          order: 1,
        },
        {
          name: "Petit-déjeuner pour 2",
          description: "Pain, viennoiseries, céréales, compotes, boissons chaudes, jus de fruit… servi le premier matin.",
          price: 19.8,
          imageUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=1200&auto=format&fit=crop",
          status: "actif",
          category: "Restauration",
          pricingUnit: "forfait",
          allowQuantity: false,
          maxQuantity: 1,
          variants: [],
          order: 2,
        },
        {
          name: "Planche apéritive",
          description: "Planche charcuterie / fromage à partager en amoureux.",
          price: 30,
          imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=1200&auto=format&fit=crop",
          status: "actif",
          category: "Restauration",
          pricingUnit: "par_unite",
          allowQuantity: true,
          maxQuantity: 5,
          variants: [],
          order: 3,
        },
        {
          name: "Départ tardif",
          description: "Profitez de nos installations jusqu'à 12h30 et prolongez votre séjour.",
          price: 30,
          imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
          status: "actif",
          category: "Confort",
          pricingUnit: "forfait",
          allowQuantity: false,
          maxQuantity: 1,
          variants: [],
          order: 4,
        },
        {
          name: "Décoration romantique",
          description: "Pétales de roses et bougies LED disposés dans la suite avant votre arrivée.",
          price: 25,
          imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop",
          status: "actif",
          category: "Décoration",
          pricingUnit: "forfait",
          allowQuantity: false,
          maxQuantity: 1,
          variants: [],
          order: 5,
        },
        {
          name: "Bouquet de roses",
          description: "Un bouquet de roses fraîches préparé par notre fleuriste partenaire.",
          price: 35,
          imageUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=1200&auto=format&fit=crop",
          status: "actif",
          category: "Décoration",
          pricingUnit: "par_unite",
          allowQuantity: true,
          maxQuantity: 3,
          variants: [],
          order: 6,
        },
      ];
      await Service.insertMany(prestationsData);
      console.log(`${prestationsData.length} prestations d'exemple insérées (massage, petit-déj, planche, etc.).`);
    } else {
      console.log(`${prestationCount} prestation(s) déjà existante(s). Conservation des données.`);
    }

    // 4bis. Formules (offre principale du nouveau tunnel, rattachée à une suite).
    // Non destructif : on ne seed que si la collection est vide. Création formule
    // par formule (try/catch + prix de secours) pour qu'une suite mal formée ne
    // bloque pas tout le lot.
    console.log('Vérification des Formules dans MongoDB...');
    const formuleCount = await Formule.countDocuments();
    const suitesForFormules = await Suite.find();
    console.log(`Formules existantes: ${formuleCount} · Suites trouvées: ${suitesForFormules.length}`);
    if (formuleCount === 0 && suitesForFormules.length > 0) {
      let created = 0;
      for (const s of suitesForFormules) {
        const base = Number(s.pricePerNight) || 189;
        const defs = [
          {
            name: 'Nuit Essentielle',
            price: base,
            isPopular: false,
            order: 1,
            description: "Une parenthèse enchantée centrée sur l'essentiel du prestige et de l'intimité.",
            features: [
              "Arrivée 18h / Départ 11h",
              "Accès bien-être privatif illimité",
              "Ambiance romantique (Bougies LED)",
              "1 Bouteille de champagne offerte",
              "Linge de lit & Serviettes épaisses",
              "Ménage premium inclus"
            ],
          },
          {
            name: 'Nuit Complète',
            price: base + 110,
            isPopular: true,
            order: 2,
            description: "L'immersion totale. Chaque détail est orchestré pour une nuit inoubliable.",
            features: [
              "Tout le contenu de l'Essentielle",
              "Plateau Repas (Salé & Sucré) pour 2",
              "Petit-déjeuner complet (Pancakes...)",
              "Décoration pétales de roses",
              "Ambiance Musicale (Enceinte Bluetooth)",
              "Peignoirs premium à disposition"
            ],
          },
        ];
        for (const d of defs) {
          try {
            await Formule.create({
              name: d.name,
              suiteName: s.name,
              description: d.description,
              price: d.price,
              billingType: 'nuit',
              features: d.features,
              imageUrl: s.imageUrl || '',
              isPopular: d.isPopular,
              status: 'actif',
              order: d.order,
            });
            created++;
          } catch (e: any) {
            console.error(`Formule "${d.name}" pour "${s.name}" non créée: ${e.message}`);
          }
        }
      }
      console.log(`${created} formule(s) créée(s).`);
    } else if (suitesForFormules.length === 0) {
      console.log('Aucune suite en base → aucune formule créée. Ajoute au moins une chambre.');
    } else {
      console.log(`${formuleCount} formule(s) déjà existante(s). Conservation des données.`);
    }

    // 5. Vérification et insertion des paramètres du tableau comparatif
    console.log('Vérification des paramètres (Tableau Comparatif) dans MongoDB...');
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      console.log('Aucun paramètre trouvé, insertion du tableau comparatif par défaut...');
      await Settings.create({
        singletonId: 'main',
        comparisonTable: [
          { label: "Check-in 18h / Check-out 11h", e: true, c: true },
          { label: "Balnéo privatif illimité", e: true, c: true },
          { label: "Bouteille de Champagne", e: true, c: true },
          { label: "Ambiance Romantique (Bougies LED)", e: true, c: true },
          { label: "Linge complet & Hygiène", e: true, c: true },
          { label: "Ménage Premium", e: true, c: true },
          { label: "Plateau Repas (Salé & Sucré)", e: false, c: true },
          { label: "Petit-Déjeuner (Pancakes, Fruits...)", e: false, c: true },
          { label: "Softs & Eaux Pétillantes", e: false, c: true },
          { label: "Ambiance (Jeux, Musique Bluetooth)", e: false, c: true },
          { label: "Peignoirs de bain Premium", e: false, c: true },
        ],
        establishmentName: 'Maison Love Rooms',
        email: 'conciergerie@maisonloveroom.fr',
        phone: '06 27 09 47 17',
        address: 'Rue des Saints-Pères, 75006 Paris',
        instagram: '@maisonloveroom',
        whatsapp: '33627094717',
        checkInTime: '18:00',
        checkOutTime: '11:00',
        maxNights: 2
      });
      console.log('Tableau comparatif par défaut inséré avec succès.');
    } else {
      console.log('Paramètres déjà existants. Conservation des données.');
    }

    // 6. Insertion de produits de démonstration (boutique / stock) si aucun produit
    console.log('Vérification des produits (Boutique / Stock) dans MongoDB...');
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Aucun produit trouvé, insertion de produits de démonstration...');
      await Product.insertMany([
        {
          name: 'Bougie parfumée « Love »',
          description: 'Bougie artisanale aux notes de rose et bois de santal, pour prolonger l\'ambiance romantique chez vous.',
          price: 29,
          imageUrl: 'https://images.unsplash.com/photo-1602874801007-bd36c376cd5e?q=80&w=1200&auto=format&fit=crop',
          stock: 12,
          status: 'actif',
        },
        {
          name: 'Coffret huiles de massage',
          description: 'Duo d\'huiles de massage sensuelles aux extraits naturels, présenté dans un écrin élégant.',
          price: 45,
          imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop',
          stock: 3,
          status: 'actif',
        },
        {
          name: 'Peignoir premium en coton',
          description: 'Peignoir moelleux brodé Maison Love Rooms, une douceur enveloppante à emporter.',
          price: 69,
          imageUrl: 'https://images.unsplash.com/photo-1620656798579-1984d9e87df7?q=80&w=1200&auto=format&fit=crop',
          stock: 8,
          status: 'actif',
        },
        {
          name: 'Champagne Brut « Célébration »',
          description: 'Bouteille de champagne brut sélectionnée par notre conciergerie pour vos instants précieux.',
          price: 39,
          imageUrl: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?q=80&w=1200&auto=format&fit=crop',
          stock: 0,
          status: 'actif',
        },
      ]);
      console.log('Produits de démonstration insérés avec succès.');
    } else {
      console.log('Produits déjà existants. Conservation des données.');
    }

    // 7. Insertion des FAQ par défaut si aucune FAQ (éditables ensuite depuis le BO)
    console.log('Vérification des FAQ dans MongoDB...');
    const faqCount = await Faq.countDocuments();
    if (faqCount === 0) {
      console.log('Aucune FAQ trouvée, insertion des FAQ par défaut...');
      await Faq.insertMany([
        {
          question: "Comment se déroule l'arrivée ?",
          answer: "Pour préserver votre intimité, l'arrivée se fait en autonomie. Le jour de votre réservation, vous recevez un code d'accès par SMS et email pour entrer dans votre suite à l'heure prévue.",
          order: 1,
          status: 'actif',
        },
        {
          question: "La confidentialité est-elle réellement garantie ?",
          answer: "Absolument. Nous avons conçu l'expérience Maison Love Rooms pour qu'aucun contact physique ne soit nécessaire. L'entrée est privée, sans réception ni personnel visible, vous garantissant une intimité absolue.",
          order: 2,
          status: 'actif',
        },
        {
          question: "Quels sont les tarifs et formules proposés ?",
          answer: "Nos tarifs débutent à 189€ la nuit avec une bouteille de champagne offerte. Nous proposons également une formule complète à 299€ incluant champagne, softs, décoration romantique, plateau repas et petit-déjeuner gourmand.",
          order: 3,
          status: 'actif',
        },
        {
          question: "Quels sont les équipements inclus dans les chambres ?",
          answer: "Chaque suite dispose d'un espace bien-être privé (Balnéo pour Love Story, Spa pour Baguerra), d'un lit King Size, d'une cuisine équipée, et d'un système audio Bluetooth pour créer votre propre atmosphère.",
          order: 4,
          status: 'actif',
        },
        {
          question: "Y a-t-il une durée minimum de réservation ?",
          answer: "La durée de réservation est d'une nuit minimum et de deux nuits maximum, afin de préserver l'exclusivité et la qualité de préparation de nos écrins.",
          order: 5,
          status: 'actif',
        },
      ]);
      console.log('Les 5 FAQ par défaut ont été insérées dans MongoDB.');
    } else {
      console.log(`${faqCount} FAQ déjà existante(s). Conservation des données.`);
    }

    console.log('Synchronisation des données statiques terminée avec succès !');
  } catch (error: any) {
    console.error(`Erreur lors de la synchronisation des données: ${error.message}`);
  }
};

