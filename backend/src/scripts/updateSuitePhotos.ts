/**
 * Met à jour les photos des deux love rooms dans MongoDB avec les nouvelles
 * photos (septembre 2026) servies depuis le frontend : /public/photos/.
 *
 * Utilisation :
 *   cd backend
 *   MONGO_URI="mongodb+srv://..." npx ts-node src/scripts/updateSuitePhotos.ts
 *
 * (ou renseigner MONGO_URI dans backend/.env)
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Suite from '../models/Suite';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;

const LOVE_STORY_MAIN = '/modifs/top.png';
const LOVE_STORY_GALLERY = [
  '/photos/love-story-6.jpeg',
  '/photos/love-story-2.jpeg',
  '/photos/love-story-3.jpeg',
  '/photos/love-story-5.jpeg',
  '/photos/love-story-4.jpeg'
];

const BAGUERRA_MAIN = '/photos/baguerra-1.jpeg';
const BAGUERRA_GALLERY = [
  '/photos/baguerra-3.jpeg',
  '/photos/baguerra-2.jpeg',
  '/photos/baguerra-4.jpeg',
  '/photos/maison-3.jpeg'
];

async function run() {
  if (!MONGO_URI) throw new Error('MONGO_URI manquant (backend/.env ou variable d\'environnement)');
  await mongoose.connect(MONGO_URI);
  console.log('Connecté à MongoDB.\n');

  const love = await Suite.findOneAndUpdate(
    { name: 'Love Story' },
    { imageUrl: LOVE_STORY_MAIN, images: LOVE_STORY_GALLERY },
    { returnDocument: 'after' }
  );
  console.log(love
    ? `✓ Love Story mise à jour (${love._id}) — 1 photo principale + ${LOVE_STORY_GALLERY.length} photos`
    : '✗ Love Story introuvable dans la base');

  const baguerra = await Suite.findOneAndUpdate(
    { name: { $regex: /Baguerra|Jungle Room/i } },
    { name: 'Baguerra', imageUrl: BAGUERRA_MAIN, images: BAGUERRA_GALLERY },
    { returnDocument: 'after' }
  );
  console.log(baguerra
    ? `✓ Baguerra mise à jour (${baguerra._id}) — 1 photo principale + ${BAGUERRA_GALLERY.length} photos`
    : '✗ Baguerra introuvable dans la base');

  await mongoose.disconnect();
  console.log('\nTerminé. Les nouvelles photos sont en ligne après le prochain déploiement du frontend.');
}

run().catch((err) => {
  console.error('Erreur :', err);
  process.exit(1);
});
