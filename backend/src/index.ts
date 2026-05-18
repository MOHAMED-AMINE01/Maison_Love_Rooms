import express, { Request, Response } from 'express';
import cors from 'cors';
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
app.use(cors());
app.use(express.json());

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
