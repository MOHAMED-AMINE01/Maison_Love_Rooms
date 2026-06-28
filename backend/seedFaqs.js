require('dotenv').config();
const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['actif', 'inactif'], default: 'actif' },
}, { timestamps: true });

const Faq = mongoose.model('Faq', faqSchema);

const faqsData = [
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
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connexion MongoDB établie');

    const count = await Faq.countDocuments();
    if (count > 0) {
      console.log(`${count} FAQ déjà présentes. Aucune insertion (les données existantes sont conservées).`);
    } else {
      const inserted = await Faq.insertMany(faqsData);
      console.log(`${inserted.length} FAQ insérées avec succès.`);
    }

    await mongoose.connection.close();
    console.log('Déconnecté');
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

seed();
