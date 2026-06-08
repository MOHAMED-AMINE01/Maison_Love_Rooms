import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { seedDatabase } from './seeder';

// Routes
import adminRoutes from './routes/adminRoutes';
import publicRoutes from './routes/publicRoutes';

// Configuration de l'environnement
dotenv.config();

// Connexion à la base de données MongoDB et peuplement des données statiques
connectDB().then(() => {
  seedDatabase();
});

const app = express();

// Middlewares
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'https://maisonloverooms.vercel.app',
  'https://maisonloverooms.netlify.app',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
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
