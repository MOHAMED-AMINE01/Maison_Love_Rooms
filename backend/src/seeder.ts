import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin';
import Suite from './models/Suite';
import Reservation from './models/Reservation';
import Service from './models/Service';
import Settings from './models/Settings';
import Product from './models/Product';

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
          pricePerNight: 189,
          features: ["Balnéo Privative", "Douche en duo", "Décoration Chic", "Kitchenette", "Champagne Inclus"],
          status: "disponible",
          imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2000&auto=format&fit=crop",
          images: [
            "https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=2645&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2670&auto=format&fit=crop"
          ]
        },
        {
          name: "Baguerra",
          description: "Laissez-vous transporter par l'exotisme de la suite Baguerra. Une immersion totale dans un décor végétal luxuriant pour une évasion sauvage et sensuelle au cœur de la ville.",
          pricePerNight: 189,
          features: ["Spa Privatif", "Décoration Jungle", "Cuisine Indépendante", "Ambiance Immersive", "Champagne Inclus"],
          status: "disponible",
          imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2000&auto=format&fit=crop",
          images: [
            "https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=2645&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2670&auto=format&fit=crop"
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

    // 4. Vérification et réinitialisation des Services additionnels pour correspondre exactement aux 2 packs officiels du site
    console.log('Réinitialisation des Services/Packs dans MongoDB...');
    await Service.deleteMany({});
    const servicesData = [
      {
        name: "Formule Essentielle",
        description: "Une parenthèse enchantée centrée sur l'essentiel du prestige et de l'intimité.",
        price: 189,
        imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2000&auto=format&fit=crop",
        status: "actif",
        category: "Formules",
        features: [
          "Arrivée 18h / Départ 11h",
          "Accès Balnéo privatif illimité",
          "Ambiance romantique (Bougies LED)",
          "1 Bouteille de champagne offerte",
          "Linge de lit & Serviettes épaisses",
          "Café Nespresso & Thés à disposition",
          "Produits de douche & Hygiène",
          "Ménage premium inclus"
        ]
      },
      {
        name: "Formule Complète",
        description: "L'immersion totale. Chaque détail est orchestré pour une nuit inoubliable.",
        price: 299,
        imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2000&auto=format&fit=crop",
        status: "actif",
        category: "Formules",
        features: [
          "Tout le contenu de l'Essentielle",
          "1/2 Bouteille de soft / Eau pétillante",
          "Plateau Repas (Salé & Sucré) pour 2",
          "Petit-déjeuner complet (Pancakes...)",
          "Décoration pétales de roses",
          "Ambiance Musicale (Enceinte Bluetooth)",
          "Boîtes de jeux & Accessoires",
          "Peignoirs premium à disposition"
        ]
      }
    ];

    await Service.insertMany(servicesData);
    console.log('Les 2 Packs officiels du site (Formule Essentielle et Formule Complète) ont été insérés dans MongoDB avec leurs features.');

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

    console.log('Synchronisation des données statiques terminée avec succès !');
  } catch (error: any) {
    console.error(`Erreur lors de la synchronisation des données: ${error.message}`);
  }
};

