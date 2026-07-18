import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { seedDatabase } from './seeder';

// Routes
import adminRoutes from './routes/adminRoutes';
import publicRoutes from './routes/publicRoutes';
import { stripeWebhook } from './controllers/adminController';

// Configuration de l'environnement
dotenv.config();

import { syncAllSuitesIcal } from './controllers/adminController';

// Connexion à la base de données MongoDB et peuplement des données statiques
connectDB().then(() => {
  seedDatabase();

  // Synchronisation automatique iCal (Airbnb/Booking).
  // ATTENTION : en serverless (Vercel), le process est gelé entre deux requêtes,
  // donc setInterval ne se déclenche jamais en production. Le vrai planificateur
  // en prod est le cron externe qui appelle GET /api/cron/sync-ical (voir SYNC_ICAL.md),
  // complété par le lazy-sync à l'ouverture du back-office.
  // On ne garde donc l'intervalle que pour le développement local (serveur long-running).
  if (!process.env.VERCEL) {
    const intervalMinutes = parseInt(process.env.ICAL_SYNC_INTERVAL_MINUTES || '15', 10);
    console.log(`[iCal Sync] (dev local) Synchronisation automatique toutes les ${intervalMinutes} minutes.`);

    // Première exécution après 10 secondes pour laisser le serveur démarrer tranquillement
    setTimeout(() => {
      syncAllSuitesIcal();
    }, 10000);

    setInterval(() => {
      syncAllSuitesIcal();
    }, intervalMinutes * 60 * 1000);
  }
});

const app = express();

// Middlewares
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'https://maisonloverooms.vercel.app',
  'https://maisonloverooms.netlify.app',
  ...(process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((o) => o.trim()).filter(Boolean)
    : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // Autorise les requêtes sans origin (Postman, curl) et les origins whitelistées
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} non autorisée par CORS`));
    }
  },
  credentials: true,
}));

// Webhook Stripe : doit recevoir le corps BRUT (avant express.json) pour vérifier la signature.
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());
app.use(cookieParser());

// Utilisation des routes Admin et Publiques
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

// Routes de base
app.get('/', (req: Request, res: Response) => {
  res.send('API Maison Love Rooms Backend est fonctionnelle !');
});

// Port du serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré en mode développement sur le port ${PORT}`);
});

export default app;
