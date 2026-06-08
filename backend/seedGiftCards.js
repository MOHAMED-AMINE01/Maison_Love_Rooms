require('dotenv').config();
const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  features: [String],
  badge: String,
  status: { type: String, enum: ['actif', 'inactif'], default: 'actif' },
}, { timestamps: true });

const GiftCard = mongoose.model('GiftCard', giftCardSchema);

const cardsData = [
  {
    name: "Nuit de Rêve",
    price: 189,
    description: "Offrez une nuit magique et inoubliable dans l'une de nos suites luxueuses.",
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop",
    badge: "Populaire",
    status: 'actif',
    features: ["1 nuitée pour 2 personnes", "Valable dans toutes nos suites", "Accès illimité au Spa privatif", "Valable 1 an"]
  },
  {
    name: "Pack Romance Ultime",
    price: 249,
    description: "Le cadeau parfait : une nuitée accompagnée de notre sélection d'attentions romantiques.",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop",
    badge: "Premium",
    status: 'actif',
    features: ["Nuitée exceptionnelle", "Bouteille de Champagne au frais", "Pétales de roses sur le lit", "Départ tardif à 13h"]
  },
  {
    name: "Carte Liberté 100€",
    price: 100,
    description: "Un bon d'achat flexible, déductible sur la réservation ou les options boutique.",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop",
    badge: "Flexible",
    status: 'actif',
    features: ["Montant libre utilisable en 1 fois", "Cumulable avec les promotions", "Choix de la suite au moment de réserver", "Valable 1 an"]
  },
  {
    name: "Bouquet de Fleurs",
    price: 45,
    description: "Bouquet élégant composé de fleurs fraîches et parfumées pour marquer le coup.",
    imageUrl: "https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=1000&auto=format&fit=crop",
    badge: "Option",
    status: 'actif',
    features: ["Composition florale premium", "Fleurs de saison fraîches", "Livraison discrète en chambre", "Présentation soignée"]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connexion MongoDB établie');

    // Vider la collection
    await GiftCard.deleteMany({});
    console.log('Collection vidée');

    // Insérer les données
    const inserted = await GiftCard.insertMany(cardsData);
    console.log(`${inserted.length} cartes cadeaux insérées avec succès`);

    await mongoose.connection.close();
    console.log('Déconnecté');
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

seed();
